import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

class UserRepository {
  final String baseUrl = 'https://api-takepic.onrender.com/';
  final List<int> statusOk = [200, 201, 202];

  // Função genérica para enviar a requisição
  Future<Map<String, dynamic>> sendRequest(String url, {required String method, Map<String, String>? headers, Object? body}) async {
    try {
      final uri = Uri.parse(url);
      final response = await http.Request(method, uri)
        ..headers.addAll(headers ?? {})
        ..body = body != null ? jsonEncode(body) : '';
      final streamedResponse = await response.send();
      final responseData = await http.Response.fromStream(streamedResponse);

      if (statusOk.contains(responseData.statusCode)) {
        return {"status": true, "httpCode": responseData.statusCode, "data": jsonDecode(responseData.body)};
      } else {
        final errorData = jsonDecode(responseData.body);
        return {"status": false, "httpCode": responseData.statusCode, "data": responseData, "error": errorData['message']};
      }
    } catch (error) {
      return {"status": false, "httpCode": 500, "data": error};
    }
  }
  
  // Função de login
  Future<Map<String, dynamic>> login(Map<String, dynamic> body) async {
    final url = '${baseUrl}auth/login';
    return await sendRequest(url, method: 'POST', headers: {'Content-Type': 'application/json'}, body: body);
  }

  // Função para obter o usuário por email
  Future<Map<String, dynamic>> getUserByEmail(String token, String email) async {
    final url = '${baseUrl}user/email/$email';
    return await sendRequest(url, method: 'GET', headers: {'Authorization': 'Bearer $token'});
  }

  // Função para obter o usuário por nome de usuário
  Future<Map<String, dynamic>> getUserByUsername(String token, String username) async {
    final url = '${baseUrl}user/$username';
    return await sendRequest(url, method: 'GET', headers: {'Authorization': 'Bearer $token'});
  }

  // Função para listar posts de um usuário
  Future<Map<String, dynamic>> getUserPosts(String username) async {
    final url = '${baseUrl}post/list/user/$username';
    return await sendRequest(url, method: 'GET', headers: {'Content-Type': 'application/json'});
  }

  // Função para registrar um usuário
  Future<Map<String, dynamic>> registerUser(Map<String, dynamic> body) async {
    final url = '${baseUrl}user/register';
    return await sendRequest(url, method: 'POST', headers: {'Content-Type': 'application/json'}, body: body);
  }

  // Função para fazer upload de foto
  Future<Map<String, dynamic>> uploadImage(String token, File imageFile) async {
    try {
      final uri = Uri.parse('${baseUrl}post/upload');
      final request = http.MultipartRequest('POST', uri);

      request.headers['Authorization'] = 'Bearer $token';

      request.files.add(await http.MultipartFile.fromPath(
        'file',
        imageFile.path,
        contentType: MediaType('image', 'jpeg'), // Explicitly set to image/jpeg
      ));


      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(responseBody);
        return {"status": true, "data": responseData};
      } else {
        return {"status": false, "error": responseBody};
      }
    } catch (e) {
      return {"status": false, "error": e.toString()};
    }
  }

  // Função para criar um post
  Future<Map<String, dynamic>> createPost(Map<String, dynamic> body, String token, String userId) async {
    final url = '${baseUrl}post/create/$userId';
    return await sendRequest(url, method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'}, body: body);
  }

  // Função para obter as fotos de um usuário
  Future<Map<String, dynamic>> getUserPhotos(String username, String token) async {
    final url = '${baseUrl}post/list/user/$username';
    return await sendRequest(url, method: 'GET', headers: {'Authorization': 'Bearer $token', 'Cache-Control': 'no-store'});
  }

  // Função para obter todos os posts
  Future<Map<String, dynamic>> getAllPosts() async {
    final url = '${baseUrl}post/list';
    return await sendRequest(url, method: 'GET', headers: {'Content-Type': 'application/json'});
  }

  // Função para obter post por ID
  Future<Map<String, dynamic>> getPostById(String postId) async {
    final url = '${baseUrl}post/list/$postId';
    return await sendRequest(url, method: 'GET', headers: {'Content-Type': 'application/json'});
  }

  // Função para criar um comentário
  Future<Map<String, dynamic>> createComment(Map<String, dynamic> body, String postId, String token) async {
    final url = '${baseUrl}comment/create/$postId';
    return await sendRequest(url, method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'}, body: body);
  }

  // Função para deletar um comentário
  Future<Map<String, dynamic>> deleteComment(String commentId, String token) async {
    final url = '${baseUrl}comment/remove/$commentId';
    return await sendRequest(url, method: 'DELETE', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'});
  }

  // Função para editar um comentário
  Future<Map<String, dynamic>> editComment(Map<String, dynamic> body, String token, String commentId, String postId) async {
    final url = '${baseUrl}comment/update/$commentId/post/$postId';
    return await sendRequest(url, method: 'PUT', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'}, body: body);
  }

  // Função para deletar um post
  Future<Map<String, dynamic>> deletePost(String postId, String token) async {
    final url = '${baseUrl}post/remove/$postId';
    return await sendRequest(url, method: 'DELETE', headers: {'Authorization': 'Bearer $token'});
  }

  // Função para curtir um post
  Future<Map<String, dynamic>> likePost(Map<String, dynamic> body, String postId, String token) async {
    final url = '${baseUrl}post/like/mobile/$postId';
    return await sendRequest(url, method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'}, body: body);
  }

  // Função para seguir um usuário
  Future<Map<String, dynamic>> followUser(String loggedUser, String userToFollow, String token) async {
    final url = '${baseUrl}follow/$loggedUser/$userToFollow';
    return await sendRequest(url, method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'});
  }
}
