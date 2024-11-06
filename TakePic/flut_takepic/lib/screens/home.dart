import 'dart:convert';
import 'package:flut_takepic/screens/login.dart';
import 'package:flut_takepic/widgets/fx_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/screens/feed_screen.dart';
import 'package:flut_takepic/widgets/fx_app_bar.dart';
import 'package:flut_takepic/screens/post_photo_modal.dart';
import 'package:flut_takepic/widgets/fx_image_grid.dart';
import 'package:flut_takepic/widgets/fx_title.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class FxHome extends StatefulWidget {
  const FxHome({super.key});

  @override
  State<FxHome> createState() => _FxHomeState();
}

class _FxHomeState extends State<FxHome> {
  List<Map<String, dynamic>> userPosts = [];
  String username = '';
  final UserRepository _userRepository = UserRepository();
  final RefreshController _refreshController = RefreshController();

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');

    if (userDataString != null) {
      final userData = jsonDecode(userDataString);
      setState(() {
        username = userData['usuario'] ?? 'Usuário';
        userPosts = List<Map<String, dynamic>>.from(userData['posts']);
      });
    }
  }

  void _localReloadPosts() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');

    if (userDataString != null) {
      final userData = jsonDecode(userDataString);

      setState(() {
        userPosts = List<Map<String, dynamic>>.from(userData['posts']);
      });
    }
  }

  Future<void> _onlineReloadPosts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('user_token');
      final userDataString = prefs.getString('user_data');

      if (userDataString == null) return;
      final userData = jsonDecode(userDataString);
      final email = userData['email'];
    
      if (token == null || email == null) return;

      final userResponse = await _userRepository.getUserByEmail(token, email);

      if (!mounted) return;
      if (userResponse['status'] && userResponse['data'] != null) {
        final updatedData = userResponse['data'];
        await prefs.setString('user_data', jsonEncode(updatedData));
        setState(() {
          userPosts = List<Map<String, dynamic>>.from(updatedData['posts']);
        });
      } else {
        FxSnackBar.showSnackbar(
            context, userResponse['error'] ?? 'Erro ao atualizar posts');
      }
    } finally {
      _refreshController.refreshCompleted();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: FxAppBar(
        title: CoreStrings.appName,
        onTitlePressed: () {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxFeedScreen()));
        },
        actionText: username,
        actionIcon: Icons.person, 
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: SmartRefresher(
          controller: _refreshController,
          onRefresh: _onlineReloadPosts,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              FxAccountHeader(onPostCreated: _localReloadPosts),
              const SizedBox(height: 24),
              Expanded(child: FxImageGrid(userPosts: userPosts, onPostsReloaded: _onlineReloadPosts)),
            ],
          ),
        ),
      ),
    );
  }
}

class FxAccountHeader extends StatelessWidget {
  final VoidCallback onPostCreated;

  const FxAccountHeader({super.key, required this.onPostCreated});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const FxTitle(text: CoreStrings.homeScreen, lineSize: 200),
        Row(
          children: [
            IconButton(
              onPressed: () async {
                final result = await showDialog(
                  context: context,
                  builder: (context) => const PostPhotoModal(),
                );
                
                if (result == true) {
                  onPostCreated();
                }
              },
              icon: const Icon(Icons.add),
              color: Colors.black,
              iconSize: 30,
            ),
            IconButton(
              onPressed: () async {
                _logout();
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxLogin()));
              },
              icon: const Icon(Icons.exit_to_app),
              color: Colors.black,
              iconSize: 30,
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
