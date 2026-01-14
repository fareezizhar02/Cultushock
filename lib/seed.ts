import { getCollection } from './db';
import { sampleProducts } from './seedData';

export async function seedDatabase() {
  try {
    const productsCollection = await getCollection('products');
    
    // Clear existing products
    await productsCollection.deleteMany({});
    
    // Insert sample products
    const result = await productsCollection.insertMany(sampleProducts);
    
    console.log(`✅ Successfully seeded ${result.insertedCount} products`);
    return {
      success: true,
      count: result.insertedCount,
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}