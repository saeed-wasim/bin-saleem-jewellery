import Database from 'better-sqlite3';
const db = new Database('database.sqlite');
const cats = db.prepare('SELECT * FROM categories').all();
console.log('Categories:', JSON.stringify(cats, null, 2));
db.close();
