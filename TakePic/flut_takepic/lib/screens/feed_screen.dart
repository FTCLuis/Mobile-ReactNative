import 'dart:convert';
import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flut_takepic/widgets/fx_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/screens/home.dart';
import 'package:flut_takepic/widgets/fx_app_bar.dart';
import 'package:flut_takepic/widgets/fx_image_grid.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FxFeedScreen extends StatefulWidget {
  const FxFeedScreen({super.key});

  @override
  State<FxFeedScreen> createState() => _FxFeedScreenState();
}

class _FxFeedScreenState extends State<FxFeedScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String username = 'Perfil';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadName();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
  
  Future<void> _loadName() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');
    if (userDataString != null) {
      final userData = jsonDecode(userDataString);
      setState(() {
        username = userData['usuario'] ?? 'Perfil';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: FxAppBar(
        title: CoreStrings.appName,
        actionText: username,
        actionIcon: Icons.person,
        onActionPressed: () {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxHome()));
        },
      ),
      body: Column(
        children: [
          TabBar(
            controller: _tabController,
            labelColor: Colors.pink,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.pink,
            tabs: const [
              Tab(text: CoreStrings.feedTabOne),
              Tab(text: CoreStrings.feedTabTwo),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                const FxFeedContent(),
                const FxFollowingContent(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Conteúdo da Aba Feed Geral
class FxFeedContent extends StatefulWidget {
  const FxFeedContent({super.key});

  @override
  State<FxFeedContent> createState() => _FxFeedContentState();
}

class _FxFeedContentState extends State<FxFeedContent> {
  final UserRepository _userRepository = UserRepository();
  final RefreshController _refreshController = RefreshController();
  List<Map<String, dynamic>> posts = [];
  bool isloading = false;

  Future<void> _fetchGeneralFeed() async {
    setState(() { isloading = true; });
    final response = await _userRepository.getAllPosts();
    if (response['status'] && response['data'] != null) {
      final data = response['data'] as List<dynamic>;

      setState(() {
        posts = data
            .expand((user) => (user['posts'] as List<dynamic>))
            .map((post) => Map<String, dynamic>.from(post as Map<dynamic, dynamic>))
            .toList();
      });
    } else {
      FxSnackBar.showSnackbar(context, response['error'] ?? 'Erro ao carregar o feed');
    }

    setState(() { isloading = false; });
    _refreshController.refreshCompleted();
  }

  @override
  void initState() {
    super.initState();
    _fetchGeneralFeed();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
      child: SmartRefresher(
        controller: _refreshController,
        onRefresh: _fetchGeneralFeed,
        child: !isloading
            ? FxImageGrid(userPosts: posts, onPostsReloaded: _fetchGeneralFeed)
            : const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}

class FxFollowingContent extends StatefulWidget {
  const FxFollowingContent({super.key});

  @override
  State<FxFollowingContent> createState() => _FxFollowingContentState();
}

class _FxFollowingContentState extends State<FxFollowingContent> {
  final UserRepository _userRepository = UserRepository();
  final RefreshController _refreshController = RefreshController();
  List<Map<String, dynamic>> followingPosts = [];
  bool isloading = false;

  Future<void> _fetchFollowingFeed() async {
    setState(() { isloading = true; });

    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');
    if (userDataString == null) { setState(() { isloading = false; }); return; }

    final userData = jsonDecode(userDataString);
    final followingList = List<String>.from(userData['seguindo']);

    final postsList = await Future.wait(followingList.map((username) async {
      final response = await _userRepository.getUserPosts(username);
      if (response['status'] && response['data'] != null) {
        return List<Map<String, dynamic>>.from(response['data']['posts'] as List<dynamic>);
      }
      return <Map<String, dynamic>>[];
    }));

    setState(() {
      followingPosts = postsList.expand((postList) => postList).toList();
    });

    setState(() { isloading = false; });
    _refreshController.refreshCompleted();
  }

  @override
  void initState() {
    super.initState();
    _fetchFollowingFeed();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
      child: SmartRefresher(
        controller: _refreshController,
        onRefresh: _fetchFollowingFeed,
        child: !isloading
            ? FxImageGrid(userPosts: followingPosts, onPostsReloaded: _fetchFollowingFeed)
            : const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
