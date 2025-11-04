import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './logging';
import { ConfigModule } from './config';
import { AuthModule } from './auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeormModuleOptions),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
