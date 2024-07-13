
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('varchar', { length: 255, unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('json', { nullable: true })
  sizes: string[];

  @Column('enum', { enum: ['men', 'women', 'kid', 'unisex'] })
  gender: string;

  @BeforeInsert()
  private generateSlug(): void {
    if (!this.slug) {
      this.slug = this.title;
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
