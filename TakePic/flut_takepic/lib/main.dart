import 'package:flutter/material.dart';
import 'package:flut_takepic/core/constants/core_colors.dart';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/screens/splashscreen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: CoreStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: CoreColors.primaryColor),
        useMaterial3: true,
      ),
      home: const FXSplashScreen(),
    );
  }
}