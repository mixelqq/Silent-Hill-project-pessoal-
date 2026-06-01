const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {

  db.run(`
    CREATE TABLE usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      avatar TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      mensagem TEXT,
      autor TEXT,
      curtidas INTEGER DEFAULT 0,
      fixado INTEGER DEFAULT 0
    )
  `);

});

console.log("Banco criado com sucesso!");