import 'package:flutter/material.dart';

class FxSnackBar {
  static void showSnackbar(BuildContext context, String message, {VoidCallback? onDone}) {
    if (!context.mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 3),
      ),
    );

    if (onDone != null) {
      onDone();
    }
  }
}