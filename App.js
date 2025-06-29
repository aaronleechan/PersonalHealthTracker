import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabaseSQL } from './database/schema';
import UserForm from './UserForm';

export default function App() {
  return (
    <SQLiteProvider
      databaseName="userDatabase.db"
      onInit={async (db) => {
        await db.execAsync(initDatabaseSQL);
      }}
      options={{useNewConnection: false}}
    >
      <UserForm/>
    </SQLiteProvider>
  );
}



