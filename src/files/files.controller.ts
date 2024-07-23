import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findImage(
    @Res() res: Response, // Tomar las riendas del response
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);

    // Control absoluto de la respuesta como si fuera express 
    // res.status(403).json({
    //   ok: false,
    //   path
    // })
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter, // mandamos la referencia de la función no la estamos ejecutando
    limits: { fileSize: 3000000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadProducrImage(@UploadedFile() file: Express.Multer.File) {

    console.log( {fileInController: file} );

    if ( !file ){
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${ file.filename }`;

    return {
      secureUrl
    };
  }
}
