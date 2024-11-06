import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flut_takepic/widgets/fx_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/screens/home.dart';
import 'package:flut_takepic/screens/signup.dart';
import 'package:flut_takepic/widgets/fx_app_bar.dart';
import 'package:flut_takepic/widgets/fx_title.dart';
import 'package:flut_takepic/widgets/fx_text_field.dart';
import 'package:flut_takepic/widgets/fx_button.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

// gui@teste.com 123
class FxLogin extends StatefulWidget {
  const FxLogin({super.key});

  @override
  State<FxLogin> createState() => _FxLoginState();
}

class _FxLoginState extends State<FxLogin> {
  final UserRepository _userRepository = UserRepository();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool isPasswordObscure = true;
  bool _isLoading = false;


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: FxAppBar(
        title: CoreStrings.appName,
        actionText: CoreStrings.signupDescription,
        onActionPressed: () {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxSignup()));
        },
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 10),
        child: _isLoading ? const Center(child: CircularProgressIndicator()) : Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 20),
            const FxTitle(text: CoreStrings.loginScreen),
            const SizedBox(height: 24),
            FxTextField(controller: _emailController, label: CoreStrings.email),
            const SizedBox(height: 16),
            FxTextField(controller: _passwordController, label: CoreStrings.password, obscureText: true),
            const SizedBox(height: 24),
            FxButton(
              text: CoreStrings.login,
              onPressed: _signIn,
            ),
            const Spacer(),
            _buildRegisterPrompt(),
          ],
        ),
      ),
    );
  }

  Widget _buildRegisterPrompt() {
    return Center(
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.pink,
            width: 1.5,
          ),
          borderRadius: BorderRadius.circular(10),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(CoreStrings.signupPromptPar1),
            TextButton(
              onPressed: () {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxSignup()));
              },
              child: const Text(
                CoreStrings.signupPromptPar2,
                style: TextStyle(color: Colors.pink),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _signIn() async {
    final email = _emailController.text;
    final password = _passwordController.text;
    if (_isLoading) return;

    setState(() { _isLoading = true; });
    
    if (email.isEmpty || password.isEmpty) {
      FxSnackBar.showSnackbar(context, CoreStrings.signupAllFields);
      setState(() { _isLoading = false; });
      return;
    } 

    final loginSuccessful = await _performLogin(email, password);
    if (!mounted) return;

    if (loginSuccessful) {
      FxSnackBar.showSnackbar(context, CoreStrings.loginSuccess);
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxHome()));
    } else {
      FxSnackBar.showSnackbar(context, CoreStrings.authenticationFailed);
    }

    setState(() { _isLoading = false; });
  }

  Future<bool> _performLogin(String email, String password) async {
    final loginResponse = await _userRepository.login({
      'email': email,
      'senha': password,
    });

    if (!mounted) return false;
    if (!loginResponse['status']) {
      FxSnackBar.showSnackbar(
          context, loginResponse['error'] ?? 'Erro ao fazer login');
      return false;
    }

    if (!mounted) return false;
    final token = loginResponse['data']['access_token'];
    if (token == null) {
      FxSnackBar.showSnackbar(context, 'Sem Dados!');
      return false;
    }

    final userResponse = await _userRepository.getUserByEmail(token, email);
    if (!mounted) return false;
    if (!userResponse['status'] || userResponse['data'] == null) {
      FxSnackBar.showSnackbar(
          context, userResponse['error'] ?? 'Erro ao carregar Usuário');
      return false;
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_token', token);
    await prefs.setString('user_data', jsonEncode(userResponse['data']));
    if (!mounted) return false;
    FxSnackBar.showSnackbar(context, 'Logado com sucesso!');
    return true;
  }
}




