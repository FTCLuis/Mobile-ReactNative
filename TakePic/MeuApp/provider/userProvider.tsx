import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { userModel } from '../models/userModel';

const initialUser: userModel = {
    _id: "",
    email: "",
    usuario: "",
    dataNasc: new Date(),
    senha: "",
    seguidores: [],
    seguindo: [],
    criadoEm: new Date(),
    posts: [],
    __v: "",
    token: "",
};
  
const UserContext = createContext({
    isLogged: false,
    toggleLogged: () => {},
    setUser: (usrData: userModel) => {},
    getUser: () => {}
  });


interface UserProviderProps {
  children: ReactNode;
}

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(initialUser);
  
  const toggleLogged = () => {
    setIsLogged(prev => !prev);
  };

  const setUser = (usrData: userModel) => {
    setUserData(usrData);
  };

  const getUser = () => {
    return userData;
  }

  return (
    <UserContext.Provider value={{ isLogged, toggleLogged, setUser, getUser }}>
      {children}
    </UserContext.Provider>
  );
};
