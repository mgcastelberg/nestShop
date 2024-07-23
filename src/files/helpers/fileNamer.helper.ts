import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    // Hacer las validaciones
    if ( !file )  return callback( new Error('File is empty'), false ); // el false indica que el archivo no se acepta

    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${ uuid() }.${ fileExtension }`;

    callback(null, fileName);
}