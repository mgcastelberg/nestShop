import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter // mandamos la referencia de la función no la estamos ejecutando
  }) )
  uploadProducrImage(@UploadedFile() file: Express.Multer.File) {

    console.log( {fileInController: file} );

    if ( !file ){
      throw new BadRequestException('Make sure that the file is an image');
    }

    return {
      fieldName: file.fieldname,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
  }
}
