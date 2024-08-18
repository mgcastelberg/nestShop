import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders  = createParamDecorator( (data, ctx: ExecutionContext) => {
    // console.log({data});
    const req = ctx.switchToHttp().getRequest();
    const headers = req.rawHeaders;

    if(!headers) throw new InternalServerErrorException('headers not found');

    // Mejora primero se valido que el usuario exista y luego retornamos el dato si existe
    return (!data) ? headers : headers[data];

    return headers;
})