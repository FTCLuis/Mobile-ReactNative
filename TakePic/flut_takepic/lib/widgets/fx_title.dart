import 'package:flutter/material.dart';

class FxTitle extends StatelessWidget {
  final String text;
  final double lineSize;

  const FxTitle({
    super.key,  
    required this.text,
    this.lineSize = 85,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8.0),
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Positioned(
          bottom: 0,
          child: Container(
            height: 2,
            width: lineSize,
            color: Colors.pink,
          ),
        ),
      ],
    );
  }
}
