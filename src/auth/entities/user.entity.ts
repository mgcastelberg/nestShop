import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'app_users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, unique: true })
    email: string;

    @Column('varchar', { length: 255, select: false })
    password: string;

    @Column('varchar', { length: 255 })
    fullName: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column('json', { nullable: true })
    roles: string[];

    @OneToMany(
        () => Product, 
        ( product ) => product.user
    )
    product: Product


    @BeforeInsert()
    setDefaultRoles() {
        if (!this.roles) {
            this.roles = ['user'];
        }
    }

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}   