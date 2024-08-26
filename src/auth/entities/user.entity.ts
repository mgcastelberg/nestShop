import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'app_users' })
export class User {

    @ApiProperty({
        example: "1bd5908e-b4f9-45c9-a3a6-00d3de2d4d12",
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "test@google.com",
        description: 'User Email',
        uniqueItems: true
    })
    @Column('varchar', { length: 255, unique: true })
    email: string;

    @Column('varchar', { length: 255, select: false })
    password: string;

    @ApiProperty({
        example: "Manuel Gómez",
        description: 'User full name'
    })
    @Column('varchar', { length: 255 })
    fullName: string;

    @ApiProperty({
        example: 1,
        description: 'User active status',
        default: true
    })
    @Column('boolean', { default: true })
    isActive: boolean;

    @ApiProperty({
        example: ['user', 'admin','super-user'],
        description: 'Product Roles',
    })
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