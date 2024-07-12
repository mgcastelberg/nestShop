
import { Entity, Column, PrimaryColumn, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Product {
    @PrimaryColumn({ type: 'varchar', length: 36, default: uuidv4() })
    id: string;

    @Column('varchar',{unique: true})
    title: string;

    @Column('numeric',{ default: 0 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column('varchar', { length: 255, unique: true })
    slug: string;

    @Column('int', { default: 0 })
    stock: number;

    // Only apply to postgres
    // @PrimaryGeneratedColumn('uuid');
    // id: string;

    // @Column('text',{ array: true, default: [] })
    // sizes: string[];

    // Para mysql solo acepta json
    @Column('json', { array: true })
    sizes: string[];

    @Column('enum', { enum: ['men', 'women', 'kid', 'unisex'] })
    gender: string;

    @Column({ type: 'decimal', nullable: false })
    subtotal: number;

    @BeforeInsert()
    private setId(): void {
      this.id = uuidv4();
    }
}
