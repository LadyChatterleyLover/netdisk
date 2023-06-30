import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'

@Module({
  imports: [
    TypeOrmModule.forFeature([File, User]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../upload'),
        filename: (_, file, callback) => {
          const filename = `${Date.now() + extname(file.originalname)}`
          return callback(null, filename.replace(/\\/g, '/'))
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService, ConfigService],
})
export class FileModule {}
