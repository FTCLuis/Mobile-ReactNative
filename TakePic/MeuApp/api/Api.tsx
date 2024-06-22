import { Platform } from 'react-native';

const URL = 'https://apisiteimagens.onrender.com/';
const StatusOk = [200, 201, 202]


export function TOKEN_POST(body: object) {
  return {
    url: `${URL}auth/login`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function USER_GET(token: string, email: string) {
  return {
    url: `${URL}user/email/${email}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  };
}

export function USER_GET_USUARIO(token: string, usuario: string) {
  return {
    url: `${URL}user/${usuario}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  };
}

export function GET_POST_USER(usuario: string) {
  return {
    url: `${URL}post/list/user/${usuario}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}

export function USER_REGISTER(body: object) {
  return {
    url: `${URL}user/register`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function UPLOAD_PHOTO_POST(formatData: FormData, token: string) {
  return {
    url: `${URL}post/upload`,
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formatData,
    },
  };
}

export function PHOTO_POST(body: object, token: string, id: string) {

  return {
    url: `${URL}post/create/${id}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    },
  };
}

export function USER_GET_PHOTO(usuario: string, token: string) {

  return {
    url: `${URL}post/list/user/${usuario}`,
    options: {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  };
}

export function GET_POSTS() {
  return {
    url: `${URL}post/list`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}

export function GET_POST_ID(id: string) {

  return {
    url: `${URL}post/list/${id}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}

export function CREATE_COMMENT(body: object, id: string, token: string) {

  return {
    url: `${URL}comment/create/${id}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    },
  };
}

export function DELETE_COMMENT(id: string, token: string) {

  return {
    url: `${URL}comment/remove/${id}`,
    options: {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    },
  };
}

export function PHOTO_EDIT_COMMENT(
  body: object,
  token: string,
  idComentario: string,
  idPost: string
) {
  return {
    url: `${URL}comment/update/${idComentario}/post/${idPost}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    },
  };
}

export function POST_DELETE(id: string, token: string) {
  return {
    url: `${URL}post/remove/${id}`,
    options: {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  };
}

export function POST_LIKE(body: object, id: string, token: string) {
  return {
    url: `${URL}post/like/mobile/${id}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    },
  };
}

export function USER_FOLLOW(
  usuarioLogado: string,
  usuarioSeguir: string,
  token: string
) {
  return {
    url: `${URL}follow/${usuarioLogado}/${usuarioSeguir}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    },
  };
}


export async function SEND_REQUEST(url: string, options: object) {
  try {
    const response = await fetch(url, options);
    
    if (StatusOk.indexOf(response.status) != -1) {
      let responseJson = await response.json();
      return {"status": true, "httpCode": response.status, "data": responseJson}; 
    }
    
    return {"status": false, "httpCode": response.status, "data": response, error: (await response.json()).message};
  } catch (error) {
    return {"status": false, "httpCode": 500, "data": error}
  } 
}