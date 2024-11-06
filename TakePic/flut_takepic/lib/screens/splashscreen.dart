import 'package:flutter/material.dart';
import 'package:flut_takepic/core/constants/core_colors.dart';
import 'package:flut_takepic/screens/home.dart';
import 'package:flut_takepic/screens/login.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FXSplashScreen extends StatefulWidget {
  const FXSplashScreen({super.key});

  @override
  State<FXSplashScreen> createState() => _FXSplashScreenState();
}

class _FXSplashScreenState extends State<FXSplashScreen> {
  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;

    final isLoggedIn = await _isLoggedIn();
    if (!mounted) return;
    if (isLoggedIn) {
      Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => const FxHome()));
    } else {
      Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => const FxLogin()));
    }
  }

  Future<bool> _isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token');
    return token != null;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      color: CoreColors.primaryColor,
    );
  }
}
