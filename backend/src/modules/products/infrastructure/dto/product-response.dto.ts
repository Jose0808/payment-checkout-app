import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Wireless Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
  })
  description: string;

  @ApiProperty({
    description: 'Product price in COP',
    example: 299000,
  })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
  })
  stock: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
