import 'dart:convert';
import 'dart:io';
import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/fx_snack_bar.dart';
import 'package:image/image.dart' as img;
import 'package:permission_handler/permission_handler.dart';
import 'package:path_provider/path_provider.dart';

class PostPhotoModal extends StatefulWidget {
  const PostPhotoModal({super.key});

  @override
  State<PostPhotoModal> createState() => _PostPhotoModalState();
}

class _PostPhotoModalState extends State<PostPhotoModal> {
  final TextEditingController _descriptionController = TextEditingController();
  final UserRepository _userRepository = UserRepository();
  XFile? _selectedImage;
  bool _isPosting = false;

  Future<File?> _convertToJpeg(File imageFile) async {
    if (await Permission.storage.request().isGranted) {
      final image = img.decodeImage(await imageFile.readAsBytes());

      if (image == null) {
        throw Exception('Erro ao decodificar a imagem');
      }

      final tempDir = await getTemporaryDirectory();
      final jpegFile = File('${tempDir.path}/converted_image.jpg');

      final jpegImage = img.encodeJpg(image);

      await jpegFile.writeAsBytes(jpegImage);
      return jpegFile;
    } else {
      print('Permissão de armazenamento negada');
      return null;
    }
  }

  Future<void> _chooseImage() async {
    if (_isPosting) return;
    
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
   
    setState(() {
      _selectedImage = image;
    });
  }

  Future<void> _postPhoto() async {
    if (_isPosting) return;
    
    if (_selectedImage == null) {
      FxSnackBar.showSnackbar(context, 'Imagem não selecionada');
      return;
    }

    setState(() {
      _isPosting = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final userDataString = prefs.getString('user_data');

      if (!mounted) return;
      if (userDataString == null) {
        FxSnackBar.showSnackbar(context, 'Erro ao recuperar os dados do usuário.');
        setState(() => _isPosting = false);
        return;
      }

      final userData = jsonDecode(userDataString);
      final String token = prefs.getString('user_token') ?? '';
      final String userId = userData['_id'];
      final String username = userData['usuario'];
      final description = _descriptionController.text;

      final fileExtension = _selectedImage!.path.split('.').last.toLowerCase();
    
      if (fileExtension != 'jpeg' && fileExtension != 'jpg') {
        final convertedImage = await _convertToJpeg(File(_selectedImage!.path));
        if (convertedImage != null) {
          setState(() {
            _selectedImage = XFile(convertedImage.path);
          });
        } 
      }

      final imageFile = File(_selectedImage!.path);
      
      final uploadResponse = await _userRepository.uploadImage(token, imageFile);
      if (!mounted) return;
      if (!uploadResponse['status']) {
        FxSnackBar.showSnackbar(context, uploadResponse['error'] ?? 'Erro ao fazer upload da imagem');
        setState(() => _isPosting = false);
        return;
      }

      final String imageUrl = uploadResponse['data']['url'];

      final postResponse = await _userRepository.createPost({
        'usuario': username,
        'pathFotoPost': imageUrl,
        'descricaoPost': description,
      }, token, userId);

      if (!mounted) return;
      if (!postResponse['status']) {
        FxSnackBar.showSnackbar(context, postResponse['error'] ?? 'Erro ao postar a foto');
        setState(() => _isPosting = false);
        return;
      }

      final userPostsResponse = await _userRepository.getUserPhotos(username, token);

      if (!mounted) return;
      if (!userPostsResponse['status']) {
        FxSnackBar.showSnackbar(context, userPostsResponse['error'] ?? 'Erro ao atualizar os posts');
        setState(() => _isPosting = false);
        return;
      }

      final updatedUser = {
        ...userData,
        'posts': userPostsResponse['data']['posts']
      };
      await prefs.setString('user_data', jsonEncode(updatedUser));

      if (!mounted) return;
      FxSnackBar.showSnackbar(context, 'Post criado com sucesso!');
      Navigator.pop(context, true);
    } catch (e) {
      FxSnackBar.showSnackbar(context, 'Erro ao postar a foto: $e');
    } finally {
      setState(() {
        _isPosting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const ModalTitle(title: CoreStrings.postPhotoModalTitle),
            const SizedBox(height: 8),
            const Text(
              CoreStrings.postPhotoModalDescription,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            _isPosting ? const Center(child: CircularProgressIndicator()) : DescriptionField(controller: _descriptionController),
            const SizedBox(height: 24),
            _isPosting ? Container() : ImageButton(
              selectedImage: _selectedImage,
              onPressed: _chooseImage,
            ),
            if (_selectedImage != null)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8.0),
                child: Text(
                  CoreStrings.postPhotoModalImageSelected,
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            const SizedBox(height: 8),
            _isPosting ? Container() : PostButton(
              onPressed: _postPhoto,
            ),
          ],
        ),
      ),
    );
  }
}


class ModalTitle extends StatelessWidget {
  final String title;

  const ModalTitle({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      textAlign: TextAlign.center,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        decoration: TextDecoration.underline,
        decorationColor: Colors.pink,
      ),
    );
  }
}

// Campo de texto para a descrição
class DescriptionField extends StatelessWidget {
  final TextEditingController controller;

  const DescriptionField({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      decoration: const InputDecoration(
        hintText: CoreStrings.postPhotoModalDescriptionLabel,
        border: OutlineInputBorder(),
      ),
      maxLines: 3,
    );
  }
}

// Botão para escolher a imagem
class ImageButton extends StatelessWidget {
  final XFile? selectedImage;
  final VoidCallback onPressed;

  const ImageButton({
    super.key,
    required this.selectedImage,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.pink,
        padding: const EdgeInsets.symmetric(vertical: 16),
      ),
      child: Text(
        selectedImage == null ? CoreStrings.postPhotoModalImageTextOne : CoreStrings.postPhotoModalImageTextTwo ,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
}

// Botão para postar a foto
class PostButton extends StatelessWidget {
  final VoidCallback onPressed;

  const PostButton({super.key, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.pink,
        padding: const EdgeInsets.symmetric(vertical: 16),
      ),
      child: const Text(
        CoreStrings.postPhotoModalButton,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
}
