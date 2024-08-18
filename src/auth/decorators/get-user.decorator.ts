import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser  = createParamDecorator( (data, ctx: ExecutionContext) => {
    // console.log({data});
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if(!user) throw new InternalServerErrorException('User not found');

    // Si el dato es email retornamos el email, si no retornamos el user
    // if (data === 'email') {
    //     return user?.email;
    // }

    // Mejora primero se valido que el usuario exista y luego retornamos el dato si existe
    return (!data) ? user : user[data];
})