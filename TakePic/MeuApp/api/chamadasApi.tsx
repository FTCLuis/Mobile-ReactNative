import { Platform } from 'react-native';

const URL = 'https://api-site-imagens.onrender.com/';

export async function TOKEN_POST(body: object) {
  const response = await fetch(`${URL}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function USER_GET(token: string, email: string) {
  const response = await fetch(`${URL}user/email/${email}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return response.json();
}

export async function USER_GET_USUARIO(token: string, usuario: string) {
  const response = await fetch(`${URL}user/${usuario}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return response.json();
}

export async function GET_POST_USER(usuario: string) {
  const response = await fetch(`${URL}post/list/user/${usuario}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function USER_REGISTER(body: object) {
  const response = await fetch(`${URL}user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function UPLOAD_PHOTO_POST(formatData: FormData, token: string) {
  const response = await fetch(`${URL}post/upload`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: formatData,
  });
  return response.json();
}

export async function PHOTO_POST(body: object, token: string, id: string) {
  const response = await fetch(`${URL}post/create/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function USER_GET_PHOTO(usuario: string, token: string) {
  const response = await fetch(`${URL}post/list/user/${usuario}`, {
    method: 'GET',
    cache: Platform.OS === 'ios' ? 'reload' : 'no-cache', // For iOS, use 'reload' cache option
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return response.json();
}

export async function GET_POSTS() {
  const response = await fetch(`${URL}post/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function GET_POST_ID(id: string) {
  const response = await fetch(`${URL}post/list/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function CREATE_COMMENT(body: object, id: string, token: string) {
  const response = await fetch(`${URL}comment/create/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function PHOTO_EDIT_COMMENT(
  body: object,
  token: string,
  idComentario: string,
  idPost: string
) {
  const response = await fetch(`${URL}comment/update/${idComentario}/post/${idPost}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function POST_DELETE(id: string, token: string) {
  const response = await fetch(`${URL}post/remove/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return response.json();
}

export async function POST_LIKE(body: object, id: string, token: string) {
  const response = await fetch(`${URL}post/like/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function USER_FOLLOW(
  usuarioLogado: string,
  usuarioSeguir: string,
  token: string
) {
  const response = await fetch(`${URL}follow/${usuarioLogado}/${usuarioSeguir}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  return response.json();
}