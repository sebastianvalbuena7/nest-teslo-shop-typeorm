import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    // * Usar variables de entorno
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BD_HOST ?? 'localhost',
      port: +process.env.DB_PORT ?? 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      // Usar solo si se quiere modificar la bd desde la app
      synchronize: true
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule
  ]
})
export class AppModule { }
