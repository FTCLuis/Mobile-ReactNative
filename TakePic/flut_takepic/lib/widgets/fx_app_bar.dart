import 'package:flutter/material.dart';

class FxAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onTitlePressed;
  final VoidCallback? onActionPressed;
  final String? actionText;
  final IconData? actionIcon;

  const FxAppBar({
    super.key,  
    required this.title,
    this.onTitlePressed,
    this.onActionPressed,
    this.actionText,
    this.actionIcon,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: onTitlePressed != null
          ? GestureDetector(
              onTap: onTitlePressed,
              child: Text(
                title,
                style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
              ),
            )
          : Text(
              title,
              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
            ),
      centerTitle: false,
      actions: [
        if (actionText != null)
          TextButton(
            onPressed: onActionPressed,
            child: Row(
              children: [
                Text(
                  actionText!,
                  style: const TextStyle(color: Colors.black),
                ),
                if (actionIcon != null)
                  Padding(
                    padding: const EdgeInsets.only(left: 8.0),
                    child: Icon(actionIcon, color: Colors.black),
                  ),
              ],
            ),
          )
      ],
      backgroundColor: Colors.white,
      elevation: 0,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
