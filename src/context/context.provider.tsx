/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { auth } from "../../firebaseConfig"

// Create the context
const MyContext = createContext<any | undefined>(undefined);

// Create a provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(!!localStorage.getItem('abtestinghub-access-token'))
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      console.log(user);
    })
  }, [userAuthenticated])

  const signInUser = (token: string) => {
    localStorage.setItem('abtestinghub-access-token', token);
    setUserAuthenticated(true)
  }

  const signOutUser = () => {
    signOut(auth)
    localStorage.removeItem('abtestinghub-access-token');
    setUserAuthenticated(false)
  }

  const showAuthModal = () => {
    setAuthModalOpen(true);
  };

  const hideAuthModal = () => {
    setAuthModalOpen(false)
  };

  const contextValue: any = {
    userAuthenticated,
    setUserAuthenticated,
    signInUser,
    signOutUser,
    showAuthModal,
    hideAuthModal,
    authModalOpen,
    setAuthModalOpen
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook to use the context
export const Context = (): any => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};