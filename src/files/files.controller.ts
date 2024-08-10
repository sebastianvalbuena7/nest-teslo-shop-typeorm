import { BadRequestException, Controller, Get, Injectable, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  // * Obtener archivo
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    
    res.sendFile(path);
  }

  // * Subir archivos
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter,
    // limits: { fileSize: 100 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }),
  }))
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure the file is a image');

    // const secureUrl = `${file.filename}`;

    // Usar variables de entorno, se debe importar ConfigModule en el modulo
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    }
  }
}