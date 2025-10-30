import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transactionNumber: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  productAmount: number;

  @ApiProperty()
  baseFee: number;

  @ApiProperty()
  deliveryFee: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @ApiProperty({ required: false })
  wompiTransactionId?: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
