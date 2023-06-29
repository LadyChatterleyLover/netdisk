import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
// import { WinstonModule } from 'nest-winston'
// import * as winston from 'winston'
// import 'winston-daily-rotate-file'
// import logger from './middlewares/logger.middleware'
// import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
// import UnifyExceptionFilter from './filters/uinify-exception.filter'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { FileModule } from './modules/file/file.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<string>('DB_TYPE'),
          host: configService.get<string>('DB_HOST'),
          port: configService.get<string>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        } as TypeOrmModuleOptions),
    }),

    UserModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: UnifyExceptionFilter,
    // },
  ],
})
export class AppModule {}
