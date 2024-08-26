import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/row-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({status: 201, description: 'User Registered', type: User})
  @ApiResponse({status: 400, description: 'Bad request'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({status: 200, description: 'User logged', type: User})
  @ApiResponse({status: 400, description: 'Bad request'})
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('refresh-token')
  @ApiBearerAuth()
  @ApiResponse({status: 200, description: 'Refresh User Token logged', type: User})
  @ApiResponse({status: 400, description: 'Bad request'})
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    console.log('object');
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @ApiBearerAuth()
  @ApiResponse({status: 200, description: 'Validate Role User', type: User})
  @ApiResponse({status: 400, description: 'Bad request'})
  @UseGuards( AuthGuard() )
  testing(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    // console.log({ user: request.user });
    console.log(request);
    console.log(user);

    return {
      ok: true,
      message: 'Hello World Private!',
      user,
      userEmail,
      rawHeaders
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])
  @Get('private2')
  @ApiBearerAuth()
  @ApiResponse({status: 200, description: 'Validate Role Super User', type: User})
  @ApiResponse({status: 400, description: 'Bad request'})
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    };
  }

  // para tener un unico decorador para proteger la ruta
  @Get('private3')
  @ApiBearerAuth()
  @ApiResponse({status: 200, description: 'Validate Role Admin and Super User', type: User})
  @ApiResponse({status: 400, description: 'Bad request'})
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    };
  }

}
