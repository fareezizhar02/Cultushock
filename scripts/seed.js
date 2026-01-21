require('dotenv').config({ path: '.env.local', quiet: true });

// Force ts-node to compile TS -> CommonJS for THIS script
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: "CommonJS",
  moduleResolution: "Node",
  esModuleInterop: true,
  target: "ES2020",
});

require('ts-node/register/transpile-only');

const { MongoClient } = require('mongodb');
const { sampleProducts } = require('../lib/seedData.ts'); // <-- keep .ts

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI in .env.local');

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // If your URI has no db name, you MUST specify it here:
    // const db = client.db('cultushock');
    const db = client.db(); // uses db name from the URI if present

    const products = db.collection('products');

    await products.deleteMany({});
    await products.insertMany(sampleProducts);

    console.log(`✅ Seeded ${sampleProducts.length} products into MongoDB`);
  } finally {
    await client.close();
  }
}

run().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
