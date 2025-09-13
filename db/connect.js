import 'dotenv/config';
import { MongoClient } from 'mongodb';

let db;

export async function connectDB(db_name) {
  const client = new MongoClient(process.env.ATLAS_URI);
  try {
    await client.connect();
    db = client.db(db_name);
    console.log('Connection to MongoDB succeeded.');
  } catch (e) {
    throw new Error('Connection to MongoDB failed: ' + e);
  }
}

export function getDB() {
  if (!db) {
    throw new Error('use of db before initialization');
  }
  return db;
}

