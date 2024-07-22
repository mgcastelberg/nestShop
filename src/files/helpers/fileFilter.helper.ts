

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    console.log(file);
    // Hacer las validaciones
    if ( !file )  return callback( new Error('File is empty'), false ); // el false indica que el archivo no se acepta

    const fileExtension = file.mimetype.split('/')[1];

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if( validExtensions.includes( fileExtension ) ) {
        return callback( null, true );
    }

    callback(null, false);
}