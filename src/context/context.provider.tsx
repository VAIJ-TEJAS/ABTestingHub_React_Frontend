/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const MyContext = createContext<any | undefined>(undefined);

// Create a provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(!!localStorage.getItem('abtestinghub-access-token'))
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [rates, setRates] = useState({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('https://api.currencyapi.com/v3/latest?apikey=cur_live_oWV71FQIJL9Dh2YlsFSD8uVwdCTFEWaXZW20Dxws');
        console.log(response);
        setRates(response.data.data);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      } 
    };
    fetchRates();
  }, []);

  const signInUser = (token: string) => {
    localStorage.setItem('abtestinghub-access-token', token);
    setUserAuthenticated(true)
  }

  const signOutUser = () => {
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
    rates,
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