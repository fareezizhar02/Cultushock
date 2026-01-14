import clientPromise from './mongodb';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db('cultushock');
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}