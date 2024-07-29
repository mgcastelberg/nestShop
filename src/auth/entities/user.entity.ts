import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'app_users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, unique: true })
    email: string;

    @Column('varchar', { length: 255 })
    password: string;

    @Column('varchar', { length: 255 })
    fullname: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column('json', { nullable: true })
    roles: string[];
}