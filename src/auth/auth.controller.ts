import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetHeaders } from './decorators/get-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  // Usar ruta privada y valida el token
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetHeaders() headers: string[],
    // @Headers() headersH: IncomingHttpHeaders
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      email: userEmail,
      headers
    }
  }

  @Get('private2')
  // ! Se crea un decorador y sete en metadata los roles
  // @RoleProtected(ValidRoles.superUser, ValidRoles.user)
  // ! Obtiene la metadata y verifica los roles
  // @UseGuards(AuthGuard(), UserRoleGuard)

  // ! En vez de usar dos decoradores se puede hacer en uno solo:
  @Auth(ValidRoles.superUser)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
}
