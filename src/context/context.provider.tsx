/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
// import axios from 'axios';
import currencyData from "../data/currency.json";

// Create the context
const MyContext = createContext<any | undefined>(undefined);

// Create a provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(!!localStorage.getItem('abtestinghub-access-token'))
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [rates, setRates] = useState({});
  const [conversionNum, setConversionNum] = useState(0.0);
  const [conversionName, setConversionName] = useState<string | null>(null);
  const [conversionSymbol, setConversionSymbol] = useState<string | null>("₹");
  const [username, setUsername] = useState<string | null>(localStorage.getItem('ab_testing_hub_username') ?? "");
  
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = currencyData
        console.log(response);
        setRates(response.data);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      } 
    };
    fetchRates();
  }, []);

    useEffect(() => {
        // Trigger onChange function when the component mounts with the default value
          const storedCurrency = localStorage.getItem("abtestinghub-currency");
          if (storedCurrency) {
            onCurrencyChange(storedCurrency);
          }
          else{
            onCurrencyChange('USD,1');
          }
    }, []);

  const onCurrencyChange = (value: string) => {
    console.log(`selected ${value}`);
    localStorage.setItem('abtestinghub-currency', value);
    const parts = value.split(',');
    setConversionNum(parseFloat(parts[1]));
    setConversionName(parts[0]);
    setConversionSymbol(parts[2]);
    console.log(parts[0]);
    console.log(parseFloat(parts[1]));
  };

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
    onCurrencyChange,
    conversionNum,
    conversionName,
    conversionSymbol,
    userAuthenticated,
    setUserAuthenticated,
    signInUser,
    signOutUser,
    showAuthModal,
    hideAuthModal,
    authModalOpen,
    setAuthModalOpen,
    username,
    setUsername
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