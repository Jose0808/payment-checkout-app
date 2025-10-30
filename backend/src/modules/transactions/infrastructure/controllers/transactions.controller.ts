import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { ProcessPaymentUseCase } from '../../application/use-cases/process-payment.use-case';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.use-case';
import { GetTransactionByNumberUseCase } from '../../application/use-cases/get-transaction-by-number.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly getTransactionByNumberUseCase: GetTransactionByNumberUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Insufficient stock' })
  async createTransaction(
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const result = await this.createTransactionUseCase.execute(dto);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        result.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value.toJSON();
  }

  @Post('process-payment')
  @ApiOperation({ summary: 'Process payment for a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 402, description: 'Payment failed' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async processPayment(
    @Body() dto: ProcessPaymentDto,
  ): Promise<TransactionResponseDto> {
    const result = await this.processPaymentUseCase.execute(dto);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        result.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value.toJSON();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransaction(
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    const result = await this.getTransactionUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        result.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value.toJSON();
  }

  @Get('number/:transactionNumber')
  @ApiOperation({ summary: 'Get transaction by transaction number' })
  @ApiParam({ name: 'transactionNumber', description: 'Transaction number' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransactionByNumber(
    @Param('transactionNumber') transactionNumber: string,
  ): Promise<TransactionResponseDto> {
    const result =
      await this.getTransactionByNumberUseCase.execute(transactionNumber);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        result.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value.toJSON();
  }
}
