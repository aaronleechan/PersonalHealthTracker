export const initDatabaseSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    height REAL NOT NULL,
    code TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY NOT NULL,
    userId INTEGER NOT NULL,
    food TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUri TEXT NOT NULL,
    calories INTEGER NOT NULL,
    analysis TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS weight_records (
    id INTEGER PRIMARY KEY NOT NULL,
    userId INTEGER NOT NULL,
    weight REAL NOT NULL,
    recordedAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS blood_pressure_records (
    id INTEGER PRIMARY KEY NOT NULL,
    userId INTEGER NOT NULL,
    systolic INTEGER NOT NULL,
    diastolic INTEGER NOT NULL,
    pulse INTEGER NOT NULL,
    recordedAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`;
