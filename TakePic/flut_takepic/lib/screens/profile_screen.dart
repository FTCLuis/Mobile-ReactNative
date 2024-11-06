import 'dart:convert';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flutter/material.dart';
import 'package:flut_takepic/widgets/fx_app_bar.dart';
import 'package:flut_takepic/widgets/fx_button.dart';
import 'package:flut_takepic/widgets/fx_image_grid.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FXProfileScreen extends StatefulWidget {
  final String username;
  final VoidCallback? onPostsReloaded; 

  const FXProfileScreen({
    super.key,
    required this.username,
    this.onPostsReloaded,
  });

  @override
  State<FXProfileScreen> createState() => _FXProfileScreenState();
}

class _FXProfileScreenState extends State<FXProfileScreen> {
  final UserRepository _userRepository = UserRepository();
  bool isFollowing = false;
  int postCount = 0;
  int followerCount = 0;
  int followingCount = 0;
  List<Map<String, dynamic>> posts = [];
  bool isLoading = true;
  bool isOwnProfile = false; 
  late String loggedUser;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';
    final userDataString = prefs.getString('user_data');
    
    if (userDataString != null) {
      final userData = jsonDecode(userDataString);
      loggedUser = userData['usuario'];
      setState(() {
        isOwnProfile = (loggedUser == widget.username);
      });
    }

    final response = await _userRepository.getUserByUsername(token, widget.username);
    if (response['status'] && response['data'] != null) {
      final userData = response['data'];
      setState(() {
        isFollowing = (userData['seguidores'] as List<dynamic>).any((follower) => follower == loggedUser);
        postCount = (userData['posts'] as List<dynamic>).length;
        followerCount = (userData['seguidores'] as List<dynamic>).length;
        followingCount = (userData['seguindo'] as List<dynamic>).length;
        posts = List<Map<String, dynamic>>.from(userData['posts'] ?? []);
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _followUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';
    final userDataString = prefs.getString('user_data');

    if (userDataString == null) return; 
    final userData = jsonDecode(userDataString);
    List<dynamic> followingList = userData['seguindo'] ?? [];

    final response = await _userRepository.followUser(loggedUser, widget.username, token);

    if (response['status']) {
      setState(() {
        if (isFollowing) {
          followingList.remove(widget.username);
        } else {
          followingList.add(widget.username);
        }
        isFollowing = !isFollowing;
      });
      userData['seguindo'] = followingList;
      await prefs.setString('user_data', jsonEncode(userData));
      
      widget.onPostsReloaded?.call();
      _loadUserData();
    } else {
      print(response['error'] ?? 'Erro ao seguir o usuário');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: FxAppBar(
        title: CoreStrings.appName,
        actionText: widget.username,
        actionIcon: Icons.person,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 20),
                  ProfileHeader(
                    username: widget.username,
                    isFollowing: isFollowing,
                    isOwnProfile: isOwnProfile,
                    onFollowPressed: _followUser,
                  ),
                  const SizedBox(height: 16),
                  ProfileStats(
                    postCount: postCount,
                    followerCount: followerCount,
                    followingCount: followingCount,
                  ),
                  const SizedBox(height: 16),
                  Expanded(child: FxImageGrid(userPosts: posts, onPostsReloaded: _loadUserData)),
                ],
              ),
            ),
    );
  }
}

class ProfileHeader extends StatelessWidget {
  final String username;
  final bool isFollowing;
  final bool isOwnProfile;
  final VoidCallback onFollowPressed;

  const ProfileHeader({
    super.key,
    required this.username,
    required this.isFollowing,
    required this.isOwnProfile,
    required this.onFollowPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          username,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        if (!isOwnProfile)
          FxButton(
            text: isFollowing ? CoreStrings.profileIsFollowing : CoreStrings.profileIsNotFollowing,
            onPressed: onFollowPressed,
            backgroundColor: isFollowing ? Colors.grey : Colors.pink,
            textColor: Colors.white,
            roundedSize: 10,
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
          ),
      ],
    );
  }
}

class ProfileStats extends StatelessWidget {
  final int postCount;
  final int followerCount;
  final int followingCount;

  const ProfileStats({
    super.key,
    required this.postCount,
    required this.followerCount,
    required this.followingCount,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: Colors.pink,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          ProfileStatItem(count: postCount, label: CoreStrings.profileIsPostCountItem),
          ProfileStatItem(count: followerCount, label: CoreStrings.profileIsFollowerCountItem),
          ProfileStatItem(count: followingCount, label: CoreStrings.profileIsFollowingCountItem),
        ],
      ),
    );
  }
}

class ProfileStatItem extends StatelessWidget {
  final int count;
  final String label;

  const ProfileStatItem({
    super.key,
    required this.count,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          count.toString(),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Colors.white),
        ),
      ],
    );
  }
}
