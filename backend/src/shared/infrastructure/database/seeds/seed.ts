import { DataSource } from 'typeorm';
import { ProductSchema } from '../../../../modules/products/infrastructure/persistence/product.schema';

export async function seed(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(ProductSchema);

  // Check if products already exist
  const existingProducts = await productRepository.count();
  if (existingProducts > 0) {
    console.log('Products already seeded');
    return;
  }

  const products = [
    {
      id: crypto.randomUUID(),
      name: 'Premium Wireless Headphones',
      description:
        'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
      price: 299000,
      stock: 50,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Smart Watch Pro',
      description:
        'Advanced fitness tracking, heart rate monitoring, GPS, and smartphone notifications. Water-resistant up to 50m with 7-day battery life.',
      price: 450000,
      stock: 30,
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Mechanical Gaming Keyboard',
      description:
        'RGB backlit mechanical keyboard with customizable keys, macro support, and ultra-responsive switches. Built for gamers and typists.',
      price: 180000,
      stock: 75,
      imageUrl:
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await productRepository.save(products);
  console.log(`Seeded ${products.length} products successfully`);
}
