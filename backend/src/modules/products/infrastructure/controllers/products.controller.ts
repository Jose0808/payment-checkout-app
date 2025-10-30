import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.use-case';
import { ProductResponseDto } from '../dto/product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  async getAllProducts(): Promise<ProductResponseDto[]> {
    const result = await this.getAllProductsUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        result.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value.map((product) => product.toJSON());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string): Promise<ProductResponseDto> {
    const result = await this.getProductUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        result.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value.toJSON();
  }
}
