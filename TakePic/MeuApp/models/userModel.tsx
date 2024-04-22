export interface userModel {
    _id: string,
    email: string,
    usuario: string,
    dataNasc: Date,
    senha: string,
    seguidores: [],
    seguindo: [],
    criadoEm: Date,
    posts: [],
    __v: string,
    token: string,
}