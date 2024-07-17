import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  // mandamos el nombre de la clase para que tenga context
  private readonly logger = new Logger('ProductsService');

  // Patron Repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Operador Rest
      const { images = [], ...poducDetails } = createProductDto;

      const product = this.productRepository.create({
        ...createProductDto,
        images: images.map( image => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save( product );
      return {...product, images};
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images.map( img => img.url )
    }));
  }

  async findOne(term: string) {
    let productDB: Product;

    if ( isUUID(term) ) {
      productDB = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      productDB = await queryBuilder.where('LOWER(title) =:title or slug =:slug', { 
        title: term.toLowerCase(),
        slug: term.toLowerCase()
      })
      .leftJoinAndSelect('prod.images', 'images')
      .getOne();
    }

    if (!productDB) {
      throw new NotFoundException(`El producto con el termino ${term} no existe`);
    }
    return productDB;
  }

  // metodo para aplanar las imagenes
  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map( image => image.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const productDB = await this.productRepository.preload({ id, ...toUpdate });


    if (!productDB) throw new NotFoundException(`El producto con el id ${id} no existe`);
    
    // Crear query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if ( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } } );
        productDB.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }

      // Hace el update, pero no esta impactando la base datos
      await queryRunner.manager.save( productDB );

      // realizar el commit de la transacción
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {
      // Si falla el commit de la transacción
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
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
