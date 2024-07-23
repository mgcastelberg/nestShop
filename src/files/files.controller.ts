import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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

    return {
      fieldName: file.fieldname,
      fileOriginalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
    };
  }
}
