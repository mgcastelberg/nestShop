
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Product {
    @PrimaryColumn({ type: 'varchar', length: 36, default: uuidv4() })
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @BeforeInsert()
    private setId(): void {
      this.id = uuidv4();
    }
}
