import React from 'react';
import AppNavigator from './AppNavigator';
import { UserProvider } from './provider/userProvider';


export default function App() {
  return (
    <UserProvider>
         <AppNavigator/>
    </UserProvider>
  );
}