class UserPost {
  final String id;
  final DateTime atualizadoEm;
  final List<dynamic> comentarios;
  final DateTime criadoEm;
  final List<dynamic> curtidas;
  final String descricaoPost;
  final String pathFotoPost;
  final List<dynamic> tags;
  final String usuario;

  UserPost({
    required this.id,
    required this.atualizadoEm,
    required this.comentarios,
    required this.criadoEm,
    required this.curtidas,
    required this.descricaoPost,
    required this.pathFotoPost,
    required this.tags,
    required this.usuario,
  });

  factory UserPost.fromJson(Map<String, dynamic> json) {
    return UserPost(
      id: json['_id'],
      atualizadoEm: DateTime.parse(json['atualizadoEm']),
      comentarios: json['comentarios'] ?? [],
      criadoEm: DateTime.parse(json['criadoEm']),
      curtidas: json['curtidas'] ?? [],
      descricaoPost: json['descricaoPost'],
      pathFotoPost: json['pathFotoPost'],
      tags: json['tags'] ?? [],
      usuario: json['usuario'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'atualizadoEm': atualizadoEm.toIso8601String(),
      'comentarios': comentarios,
      'criadoEm': criadoEm.toIso8601String(),
      'curtidas': curtidas,
      'descricaoPost': descricaoPost,
      'pathFotoPost': pathFotoPost,
      'tags': tags,
      'usuario': usuario,
    };
  }
}
