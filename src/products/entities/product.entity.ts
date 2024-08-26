
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: "1bd5908e-b4f9-45c9-a3a6-00d3de2d4d12",
    description: 'Product ID',
    uniqueItems: true,
    required: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "T-Shirt Nestlo",
    description: 'Product Title',
    uniqueItems: true,
    required: true
  })
  @Column('varchar', { length: 255, unique: true })
  title: string;

  @ApiProperty({
    example: 399,
    description: 'Product Price',
    required: true
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna aliqua.',
    description: 'Product Description',
    default: null
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 't-shirt_Nestlo',
    description: 'Product Slug for SEO'
  })
  @Column('varchar', { length: 255, unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    required: true,
    default: 0
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Product Sizes'
  })
  @Column('json', { nullable: true })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
    required: true,
    enum: ['men', 'women', 'kid', 'unisex']
  })
  @Column('enum', { enum: ['men', 'women', 'kid', 'unisex'] })
  gender: string;

  @ApiProperty({
    example: ['women', 't_shirt'],
    description: 'Product Tags'
  })
  @Column('json', { nullable: true })
  tags: string[];

  // Relacion entre tablas
  @ApiProperty()
  @OneToMany(
    () => ProductImage, 
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true } // para que cuando se consulte se muestre el usuario
  )
  user?: User;

  @BeforeInsert()
  private generateSlug(): void {
    // console.log('BeforeInsert Triggered');
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
  }

  @BeforeUpdate()
  private checkSlugUpdate(){
      // console.log('BeforeUpdate Triggered');
      if (!this.slug){
        this.slug = this.title
      }
      this.slug = this.slug.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
  }

}

    // Only apply to postgres
    // @PrimaryGeneratedColumn('uuid');
    // id: string;

    // @Column('text',{ array: true, default: [] })
    // sizes: string[];
    
    // @Column({ type: 'decimal', nullable: false })
    // subtotal: number;
