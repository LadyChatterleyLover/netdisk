import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  Req,
  Body,
  Param,
  Patch,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
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
  @UseInterceptors(FilesInterceptor('file', 10))
  async upload(
    @UploadedFiles() file: UploadFile[],
    @Body() params: { dirId: number },
    @Req() req,
  ) {
    const stream = bufferToStream(file[0].buffer)
    return this.fileService.upload(file, stream, req.user.id, params.dirId)
  }

  @Post()
  async findAll(
    @Body()
    params: {
      name: string
      type: string
      dirId: number
      isDir: boolean
      isRecovery: boolean
    },
    @Req() req,
  ) {
    return this.fileService.findAll(
      req.user.id,
      params.name,
      params.type,
      params.dirId,
      params.isDir,
      params.isRecovery,
    )
  }

  @Post('createDir')
  async createDir(@Body() params: { name: string }, @Req() req) {
    return this.fileService.createDir(params.name, req.user.id)
  }

  @Post('patchDelete')
  async patchDelete(@Body() ids: number[]) {
    return this.fileService.patchDelete(ids)
  }

  @Post('recoveryFile')
  async recoveryFile(@Body() ids: number[]) {
    return this.fileService.recoveryFile(ids)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFileDto) {
    return this.fileService.updateFile(+id, updateFileDto)
  }
}
