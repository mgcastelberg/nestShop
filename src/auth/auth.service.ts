import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  // mandamos el nombre de la clase para que tenga context
  private readonly logger = new Logger('ProductsService');

  constructor(
   @InjectRepository(User)
   private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      // Preparar el objeto a insertar
      // const user = this.userRepository.create(createUserDto);
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      // Insertar
      await this.userRepository.save(user);
    
      // Eliminar la contraseña
      delete user.password;

      // toDo: Retornar JWT


      // Retornar el objeto insertado
      return user;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
