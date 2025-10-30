import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Credit card number (test: 4111111111111111 for Visa)',
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{13,19}$/, {
    message: 'Card number must be between 13 and 19 digits',
  })
  cardNumber: string;

  @ApiProperty({
    description: 'Cardholder name',
    example: 'JOHN DOE',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  cardHolder: string;

  @ApiProperty({
    description: 'Expiration date in MM/YY format',
    example: '12/25',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Expiration date must be in MM/YY format',
  })
  expirationDate: string;

  @ApiProperty({
    description: 'CVV code',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3,4}$/, {
    message: 'CVV must be 3 or 4 digits',
  })
  cvv: string;

  @ApiProperty({
    description: 'Delivery address',
    example: 'Calle 123 #45-67',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  deliveryAddress: string;

  @ApiProperty({
    description: 'Delivery city',
    example: 'Bogotá',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  deliveryCity: string;

  @ApiProperty({
    description: 'Delivery state',
    example: 'Cundinamarca',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  deliveryState: string;

  @ApiProperty({
    description: 'Delivery zip code',
    example: '110111',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  deliveryZipCode: string;

  @ApiProperty({
    description: 'Delivery country',
    example: 'Colombia',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  deliveryCountry: string;

  @ApiProperty({
    description: 'Delivery notes (optional)',
    example: 'Please call before delivery',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  deliveryNotes?: string;
}
