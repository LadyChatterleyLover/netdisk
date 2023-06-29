import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Body,
  Param,
  Patch,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { Readable } from 'node:stream'
import { AuthGuard } from '@nestjs/passport'
import { UploadFile } from './dto/file.dto'

/**
 * 将buffer转为Stream流
 * @param binary file.buffer
 * @returns
 */
function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary)
      this.push(null)
    },
  })
  return readableInstanceStream
}

@Controller('file')
@UseGuards(AuthGuard('jwt'))
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: UploadFile,
    @Body() params: { dirId: number },
    @Req() req,
  ) {
    const name = file.originalname
    const stream = bufferToStream(file.buffer)
    return this.fileService.upload(
      name,
      stream,
      file,
      req.user.id,
      params.dirId,
    )
  }

  @Post()
  async findAll(@Body() params: { name: string; dirId: number }) {
    return this.fileService.findAll(params.name, params.dirId)
  }

  @Post('createDir')
  async createDir(@Body() params: { name: string }, @Req() req) {
    return this.fileService.createDir(params.name, req.user.id)
  }

  @Post('patchDelete')
  async patchDelete(@Body() params: { ids: number[] }) {
    return this.fileService.patchDelete(params.ids)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto) {
    return this.fileService.updateFile(+id, updateTaskDto)
  }
}
