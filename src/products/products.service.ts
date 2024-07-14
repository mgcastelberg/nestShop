import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  // mandamos el nombre de la clase para que tenga context
  private readonly logger = new Logger('ProductsService');

  // Patron Repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll( paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: string) {
    const productDB = await this.productRepository.findOneBy({ id });
    if (!productDB) {
      throw new NotFoundException(`El producto con el id ${id} no existe`);
    }
    return productDB;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  // Nota recordar que productRepository devuelve una promesa
  async remove(id: string) {
    const productDB = await this.productRepository.findOneBy({ id });
    if (!productDB) {
      throw new BadRequestException(`El producto con el id ${id} no existe`);
    }
    await this.productRepository.delete(id);
    return { deleted: true, detail: `Producto con el id ${id} eliminado` };
  }

  private handleDBExceptions(error: any) {
      // Exception Layer de NestJS
      // Nota para postgres el detalle del error viene en error.detail y en mysql viene en error.sqlMessage
      // console.log(error);
      this.logger.error(error);
      switch (error.code) {
        case '23505':
          throw new BadRequestException(error.sqlMessage);
        case 'ER_DUP_ENTRY':
          throw new BadRequestException(error.sqlMessage);
        default:
          throw new InternalServerErrorException("Unexpected error, check server logs");
      }
  }
}
