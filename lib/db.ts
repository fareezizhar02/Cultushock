import { MongoClient, Db, Collection, Document } from 'mongodb';

let cachedClient: MongoClient | null = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');
  return uri;
}

async function getClient() {
  if (cachedClient) return cachedClient;

  const uri = getMongoUri();
  const client = new MongoClient(uri);
  await client.connect();

  cachedClient = client;
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(); // uses DB name from URI
}

export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
