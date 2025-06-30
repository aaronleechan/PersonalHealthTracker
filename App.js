import React,{useState, useEffect} from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabaseSQL } from './database/schema';
import UserForm from './UserForm';
import StartScreen from './StartScreen';
import DashBoard from './DashBoard';




export default function App() {
  const [screen, setScreen] = useState('start'); // 'start' | 'signup' | 'main'
  const [userCode, setUserCode] = useState(null);

  const handleSignUp = () => {
    setScreen('signup');
  };

  const handleStartScreen = () =>{
    setScreen('start');
  }

  const handleUserScreen = () =>{
    setScreen('main');
  }


  return (
    <SQLiteProvider
      databaseName="userDatabase.db"
      onInit={async (db) => {
        await db.execAsync(initDatabaseSQL);
      }}
      options={{useNewConnection: false}}
    >
      {screen === 'start' && (
        <StartScreen onSignUp={handleSignUp} onUser={handleUserScreen}/>
      )}
      {screen === 'signup' && <UserForm onStartUp={handleStartScreen} />}
      {screen === 'main' && <DashBoard />}
    </SQLiteProvider>
  );
}



