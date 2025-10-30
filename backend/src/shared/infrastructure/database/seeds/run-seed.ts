import { DataSource } from 'typeorm';
import { seed } from './seed';
import * as dotenv from 'dotenv';
import { ProductSchema } from '../../../../modules/products/infrastructure/persistence/product.schema';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'payment_checkout_db',
  entities: [ProductSchema],
  synchronize: true,
});

async function runSeed() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    console.log('Running seeds...');
    await seed(AppDataSource);
    console.log('Seeds completed successfully');

    await AppDataSource.destroy();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeed();
