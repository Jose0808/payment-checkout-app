import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    description: 'Customer full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  customerFullName: string;

  @ApiProperty({
    description: 'Customer phone',
    example: '+573001234567',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  customerPhone: string;

  @ApiProperty({
    description: 'Base fee',
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  baseFee: number;

  @ApiProperty({
    description: 'Delivery fee',
    example: 5000,
  })
  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @ApiProperty({
    description: 'Payment method',
    example: 'CARD',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
