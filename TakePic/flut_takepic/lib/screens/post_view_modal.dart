import 'package:flut_takepic/core/constants/core_strings.dart';
import 'package:flut_takepic/repositories/user_repository.dart';
import 'package:flutter/material.dart';
import 'package:flut_takepic/widgets/fx_button.dart';
import 'package:flut_takepic/widgets/fx_text_field.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PostViewModal extends StatefulWidget {
  final String username;
  final int likes;
  final VoidCallback onUsernamePressed;
  final VoidCallback? onDeletePressed;
  final VoidCallback? onReloadNecessary;
  final List<Map<String, String>> comments;
  final String imageUrl;
  final List<String> likedUsers;
  final String loggedUser;
  final TextEditingController commentController = TextEditingController();
  final bool onDeleteActive;
  final String postId;

  PostViewModal({
    super.key,
    required this.username,
    required this.likes,
    required this.onUsernamePressed,
    this.onDeletePressed,
    this.onDeleteActive = false,
    required this.comments,
    required this.imageUrl,
    required this.likedUsers,
    required this.loggedUser,
    required this.postId,
    required this.onReloadNecessary
  });

  @override
  State<PostViewModal> createState() => _PostViewModalState();
}

class _PostViewModalState extends State<PostViewModal> {
  late bool isLiked;
  late int likeCount;
  late List<Map<String, String>> comments;
  bool isLoading = false; // Loading state

  @override
  void initState() {
    super.initState();
    isLiked = widget.likedUsers.contains(widget.loggedUser);
    likeCount = widget.likes;
    comments = List<Map<String, String>>.from(widget.comments);
  }

  Future<void> _createComment() async {
    if (widget.commentController.text.isEmpty) return;

    setState(() {
      isLoading = true;
    });
    
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';
    final content = widget.commentController.text;

    final body = {
      'usuario': widget.loggedUser,
      'comentarioTexto': content,
    };

    final response = await UserRepository().createComment(body, widget.postId, token);
    if (response['status']) {
      setState(() {
        comments.add({'usuario': widget.loggedUser, 'comentarioTexto': content, "_id": response['data']['_id']});
        widget.commentController.clear();
      });
      widget.onReloadNecessary?.call();
    }

    setState(() {
      isLoading = false;
    });
  }

  Future<void> _deleteComment(String commentId, int index) async {
    setState(() {
      comments.removeAt(index); // Remove comment immediately to update the tree
    });
    
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';

    final response = await UserRepository().deleteComment(commentId, token);
    if (response['status']) {
      widget.onReloadNecessary?.call();
    } else {
      setState(() {
        comments.insert(index, {'usuario': widget.loggedUser, 'comentarioTexto': commentId});
      });
    }
  }


  Future<void> _editComment(String commentId, int index, String newContent) async {
    setState(() {
      isLoading = true;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';
    final body = {'comentarioTexto': newContent};

    final response = await UserRepository().editComment(body, token, commentId, widget.postId);
    if (response['status']) {
      setState(() {
        comments[index]['comentarioTexto'] = newContent;
      });
      widget.onReloadNecessary?.call();
    }

    setState(() {
      isLoading = false;
    });
  }

  void _handleLike() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('user_token') ?? '';
    final body = {'usuario': widget.loggedUser};

    final response = await UserRepository().likePost(body, widget.postId, token);

    if (response['status']) {
      setState(() {
        if (isLiked) {
          likeCount--;
          widget.likedUsers.remove(widget.loggedUser);
        } else {
          likeCount++;
          widget.likedUsers.add(widget.loggedUser);
        }
        isLiked = !isLiked;
      });
      widget.onReloadNecessary?.call();
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ModalImage(imageUrl: widget.imageUrl),
                const SizedBox(height: 16),
                LikeSection(
                  likes: likeCount,
                  onLikePressed: _handleLike,
                  isLiked: isLiked,
                  username: widget.username,
                  onUsernamePressed: widget.onUsernamePressed,
                ),
                const SizedBox(height: 8),
                isLoading ? const SizedBox(
                  height: 16,
                  child: Center(
                    child: CircularProgressIndicator()
                  ),
                ) : comments.isNotEmpty ? Expanded(
                  child: CommentList(
                    comments: comments,
                    onDeletePressed: _deleteComment,
                    onEditPressed: _editComment,
                  ),
                ) : Container(),
                const SizedBox(height: 8),
                FxTextField(
                  controller: widget.commentController,
                  label: CoreStrings.viewPostModalCommentLabelText,
                ),
                const SizedBox(height: 20),
                FxButton(
                  text: CoreStrings.viewPostModalCommentPostButton,
                  onPressed: _createComment,
                ),
                if (widget.onDeleteActive)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: FxButton(
                      text: CoreStrings.viewPostModalDeleteButton,
                      onPressed: widget.onDeletePressed!,
                      backgroundColor: Colors.red,
                      textColor: Colors.white,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}



class CommentList extends StatelessWidget {
  final List<Map<String, String>> comments;
  final void Function(String commentId, int index) onDeletePressed;
  final void Function(String commentId, int index, String newContent) onEditPressed;

  const CommentList({
    super.key,
    required this.comments,
    required this.onDeletePressed,
    required this.onEditPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: comments.length,
      itemBuilder: (context, index) {
        final comment = comments[index];
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Dismissible(
            key: Key('${comment['comentarioTexto'] ?? '-'}${index.toString()}'),
            onDismissed: (_) => onDeletePressed(comment['_id']!, index),
            background: Container(
              color: Colors.red,
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              child: const Icon(Icons.delete, color: Colors.white),
            ),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: GestureDetector(
                onLongPress: () async {
                  final newContent = await _showEditDialog(context, comment['comentarioTexto'] ?? '');
                  if (newContent != null) {
                    onEditPressed(comment['_id']!, index, newContent);
                  }
                },
                child: RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: '${comment['usuario']}: ',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      TextSpan(
                        text: comment['comentarioTexto'] ?? '',
                        style: const TextStyle(color: Colors.black),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<String?> _showEditDialog(BuildContext context, String currentContent) async {
    final controller = TextEditingController(text: currentContent);
    return showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Editar Comentário"),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(labelText: "Editar conteúdo"),
          ),
          actions: [
            TextButton(
              child: const Text("Cancelar"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text("Salvar"),
              onPressed: () {
                Navigator.of(context).pop(controller.text);
              },
            ),
          ],
        );
      },
    );
  }
}

// Widget para exibir a imagem usando uma URL
class ModalImage extends StatelessWidget {
  final String imageUrl;

  const ModalImage({super.key, required this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 300,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Image.network(
          imageUrl,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => const Center(
            child: Icon(Icons.broken_image, size: 40, color: Colors.grey),
          ),
        ),
      ),
    );
  }
}

// Widget para a seção de curtidas e nome do usuário
class LikeSection extends StatelessWidget {
  final int likes;
  final VoidCallback onLikePressed;
  final bool isLiked;
  final String username;
  final VoidCallback onUsernamePressed;

  const LikeSection({
    super.key,
    required this.likes,
    required this.onLikePressed,
    required this.isLiked,
    required this.username,
    required this.onUsernamePressed,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            IconButton(
              icon: Icon(
                isLiked ? Icons.favorite : Icons.favorite_border,
                color: isLiked ? Colors.pink : Colors.black,
              ),
              onPressed: onLikePressed,
            ),
            Text('$likes'),
          ],
        ),
        TextButton(
          onPressed: onUsernamePressed,
          child: Text(
            '@$username',
            style: const TextStyle(color: Colors.black),
          ),
        ),
      ],
    );
  }
}