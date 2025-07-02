import React, { useState, useEffect, createContext, useContext } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabaseSQL } from './database/schema';
import UserFormScreen from './src/UserForm/UserFormScreen';
import HomeScreen from './src/Home/HomeScreen';
import DashBoardScreen from './src/DashBoard/DashBoardScreen';

// Screen Context
const ScreenContext = createContext();

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }
  return context;
};

// Screen Provider Component
const ScreenProvider = ({ children }) => {
  const [screen, setScreen] = useState('home');
  const [userCode, setUserCode] = useState(null);

  const navigateToSignUp = () => setScreen('signup');
  const navigateToHome = () => setScreen('home');
  const navigateToMain = () => setScreen('main');
  const navigateToWeight = () => setScreen('weight');

  const value = {
    screen,
    userCode,
    setUserCode,
    navigateToSignUp,
    navigateToHome,
    navigateToMain,
    navigateToWeight
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
};

// Screen Router Component
const ScreenRouter = () => {
  const { screen } = useScreen();

  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'signup':
      return <UserFormScreen />;
    case 'main':
      return <DashBoardScreen />;
    default:
      return <HomeScreen />;
  }
};

// Main App Component
export default function App() {
  return (
    <SQLiteProvider
      databaseName="userDatabase.db"
      onInit={async (db) => {
        await db.execAsync(initDatabaseSQL);
      }}
      options={{ useNewConnection: false }}
    >
      <ScreenProvider>
        <ScreenRouter />
      </ScreenProvider>
    </SQLiteProvider>
  );
}