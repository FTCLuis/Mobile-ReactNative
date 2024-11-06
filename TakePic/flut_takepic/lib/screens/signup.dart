import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flut_takepic/widgets/fx_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/screens/login.dart';
import 'package:flut_takepic/widgets/fx_app_bar.dart';
import 'package:flut_takepic/widgets/fx_title.dart';
import 'package:flut_takepic/widgets/fx_text_field.dart';
import 'package:flut_takepic/widgets/fx_button.dart';

class FxSignup extends StatefulWidget {
  const FxSignup({super.key});

  @override
  State<FxSignup> createState() => _FxSignupState();
}

class _FxSignupState extends State<FxSignup> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final UserRepository _userRepository = UserRepository();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: FxAppBar(
        title: CoreStrings.appName,
        actionText: CoreStrings.signupDescription,
        onActionPressed: () {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxLogin()));
        },
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 10),
        child: _isLoading ? const Center(child: CircularProgressIndicator()) : Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 20),
            const FxTitle(text: CoreStrings.signupScreen),
            const SizedBox(height: 24),
            FxTextField(controller: _usernameController, label: CoreStrings.username),
            const SizedBox(height: 16),
            FxTextField(controller: _emailController, label: CoreStrings.email),
            const SizedBox(height: 16),
            FxTextField(controller: _passwordController, label: CoreStrings.password, obscureText: true),
            const SizedBox(height: 24),
            FxButton(
              text: CoreStrings.signup,
              onPressed: _performSignup,
            ),
            const Spacer(),
            _buildLoginPrompt(),
          ],
        ),
      ),
    );
  }

  Widget _buildLoginPrompt() {
    return Center(
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.pink,
            width: 1.5,
          ),
          borderRadius: BorderRadius.circular(10),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(CoreStrings.signupPromptPar1),
            TextButton(
              onPressed: () {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxLogin()));
              },
              child: const Text(
                CoreStrings.signinPromptPar1,
                style: TextStyle(color: Colors.pink),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _performSignup() async {
    if (_isLoading) return;

    final username = _usernameController.text;
    final email = _emailController.text;
    final password = _passwordController.text;

    if (username.isEmpty || email.isEmpty || password.isEmpty) {
      FxSnackBar.showSnackbar(context, "Sem Dados!");
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final registerResponse = await _userRepository.registerUser({
      'usuario': username,
      'email': email,
      'senha': password,
      'dataNasc': DateTime.now().toIso8601String(),
      'dataAtual': DateTime.now().toIso8601String(),
    });

    setState(() {
      _isLoading = false;
    });

    if (!mounted) return;
    if (!registerResponse['status']) {
      FxSnackBar.showSnackbar(
        context,
        "Erro na chamada da API: ${registerResponse['error'] ?? 'Erro desconhecido'}",
      );
      return;
    }

    if (registerResponse['data'] == null) {
      FxSnackBar.showSnackbar(
        context,
        "Erro na chamada da API: Dados inválidos recebidos",
      );
      return;
    }

    FxSnackBar.showSnackbar(context, "Usuário criado com sucesso!");
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const FxLogin()));
  }

}
