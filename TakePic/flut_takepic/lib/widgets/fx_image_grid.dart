import 'dart:convert';

import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flut_takepic/screens/post_view_modal.dart';
import 'package:flut_takepic/screens/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FxImageGrid extends StatefulWidget {
  final List<Map<String, dynamic>> userPosts;
  final VoidCallback onPostsReloaded;
  
  const FxImageGrid({
    super.key,
    required this.userPosts,
    required this.onPostsReloaded,
  });

  @override
  State<FxImageGrid> createState() => _FxImageGridState();
}

class _FxImageGridState extends State<FxImageGrid> {
  final UserRepository _userRepository = UserRepository();
  String? loggedUser;

  @override
  void initState() {
    super.initState();
    _loadLoggedUser();
  }

  Future<void> _loadLoggedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');
    if (userDataString != null) {
      final userData = jsonDecode(userDataString);
      setState(() {
        loggedUser = userData['usuario'];
      });
    }
  }
    
  Future<void> _deletePost(BuildContext context, String postId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';

    final deleteResponse = await _userRepository.deletePost(postId, token);
    if (deleteResponse['status']) {
      Navigator.pop(context, true);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Postagem deletada com sucesso!')),
      );

      widget.onPostsReloaded();
      
    } else {
      Navigator.pop(context, false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(deleteResponse['error'] ?? 'Erro ao deletar postagem')),
      );
    }
  }
  
  Future<void> _reloadPage(BuildContext context) async {
    widget.onPostsReloaded();
  }

  void _openPostViewModal(BuildContext context, Map<String, dynamic> post) async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');

    if (userDataString == null) return;

    final userData = jsonDecode(userDataString);
    final loggedUser = userData['usuario'];
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return PostViewModal(
          username: post['usuario'],
          likes: (post['curtidas'] as List).length,
          comments: (post['comentarios'] as List<dynamic>?)
              ?.map((comment) => (comment as Map<dynamic, dynamic>)
                  .map((key, value) => MapEntry(key.toString(), value.toString())))
              .cast<Map<String, String>>()
              .toList() ?? [],
          onDeletePressed: () => _deletePost(context, post['_id']),
          onDeleteActive: loggedUser == post['usuario'],
          onUsernamePressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => FXProfileScreen(
                  username: post['usuario'],
                  onPostsReloaded: () => _reloadPage(context),
                ),
              ),
            );
          },
          imageUrl: post['pathFotoPost'] as String,
          loggedUser: loggedUser,
          likedUsers: List<String>.from(post['curtidas'] as List<dynamic>),
          postId: post['_id'],
          onReloadNecessary: () => _reloadPage(context),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: widget.userPosts.length,
      itemBuilder: (context, index) {
        final post = widget.userPosts[index];
        final imageUrl = post['pathFotoPost'] as String;

        return GestureDetector(
          onTap: () => _openPostViewModal(context, post),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(8),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => const Center(
                  child: Icon(Icons.broken_image, size: 40, color: Colors.grey),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

