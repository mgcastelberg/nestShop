
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('varchar', { length: 255, unique: true })
  title: string;

  @ApiProperty()
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column('varchar', { length: 255, unique: true })
  slug: string;

  @ApiProperty()
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty()
  @Column('json', { nullable: true })
  sizes: string[];

  @ApiProperty()
  @Column('enum', { enum: ['men', 'women', 'kid', 'unisex'] })
  gender: string;

  @ApiProperty()
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
