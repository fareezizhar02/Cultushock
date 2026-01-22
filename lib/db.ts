import { MongoClient, Db, Collection, Document } from 'mongodb';

let cachedClient: MongoClient | null = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }
  return uri;
}

function getDbName() {
  return process.env.MONGODB_DB || 'cultushock';
}

async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(getMongoUri(), {
    tls: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    appName: 'cultushock-vercel',
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(getDbName());
}

export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
