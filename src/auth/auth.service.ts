import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  // mandamos el nombre de la clase para que tenga context
  private readonly logger = new Logger('ProductsService');

  constructor(
   @InjectRepository(User)
   private readonly userRepository: Repository<User>,
   private readonly jwtService: JwtService
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

      // Retornar el objeto insertado
      return {
        ...user,
        token: this.getJwtToken({ 
          id: user.id,
          email: user.email 
        })
      };

    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
   

      const { password, email } = loginUserDto;

      // const user = await this.userRepository.findOneBy({ email })};
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });
      
      if(!user) throw new UnauthorizedException('Credentials are not valid (email)');

      if (!bcrypt.compareSync( password, user.password)) throw new UnauthorizedException('Credentials are not valid (password)');

      // toDo: regresar el JWT

      return {
        id: user.id,
        email: user.email,
        token: this.getJwtToken({ 
          id: user.id,
          email: user.email 
        })
      };
      
  }
  async checkAuthStatus(user: User) {
      return {
        ...user,
        token: this.getJwtToken({ 
          id: user.id,
          email: user.email 
        })
      };
  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
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
