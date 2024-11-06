import 'package:flutter/material.dart';

class FxTextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final bool obscureText;

  const FxTextField({
    super.key,  
    required this.controller,
    required this.label,
    this.obscureText = false,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
    );
  }
}