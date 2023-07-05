import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import * as iconv from 'iconv-lite'
import { InjectRepository } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { Like, Repository } from 'typeorm'
import { UploadFile } from './dto/file.dto'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { Readable } from 'node:stream'
import { generateRandomCode, generateUUID } from 'src/utils/generate'
const dayjs = require('dayjs')

const host = 'http://localhost:3000'

const imgType = ['bmp', 'jpg', 'jpeg', 'png', 'gif']
const videoType = ['mp4', 'ogg', 'flv', 'avi', 'wmv', 'rmvb', 'mov']
const audioType = [
  'mpeg',
  'mp3',
  'wma',
  'aac',
  'ogg',
  'mpc',
  'flac',
  'ape',
  'wv',
]

@Injectable()
export class FileService {
  public client
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.client = new OSS({
      region: this.configService.get('OSS_REGION'),
      accessKeyId: this.configService.get('OSS_ACCESSKEYID'),
      accessKeySecret: this.configService.get('OSS_ACCESSKEYSECRET'),
      bucket: this.configService.get('OSS_BUCKET'),
    })
  }

  async upload(
    files: UploadFile[],
    stream: Readable,
    user_id: number,
    dirId: number,
  ) {
    const file = files[0]
    const size = file.size
    const ext = file.mimetype.split('/')[1]
    let type = ''
    let filename = decodeURI(escape(file.originalname))
    if (imgType.includes(ext.toLowerCase())) {
      type = 'image'
    } else if (videoType.includes(ext.toLowerCase())) {
      type = 'video'
    } else if (audioType.includes(ext.toLowerCase())) {
      type = 'audio'
    } else if (
      ext === 'pdf' ||
      ext.includes('.sheet') ||
      ext.includes('.document')
    ) {
      type = 'text'
    } else {
      type = 'other'
    }
    const existFiles = await this.fileRepository.find({
      where: {
        name: filename,
      },
    })
    if (existFiles.length) {
      filename = `${filename.replace(`.${ext}`, '')}_${dayjs().format(
        'YYYYMMDD',
      )}_${dayjs().format('HHmmss')}.${ext}`
    }
    const url = await this.uploadFile(filename, stream)
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    })
    const res = await this.fileRepository.save({
      name: filename,
      size,
      ext,
      url,
      user,
      dirId,
      type,
    })
    if (res) {
      return {
        code: 200,
        msg: '上传成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '上传失败',
      }
    }
  }

  async uploadFile(name: string, stream: Readable) {
    let res
    try {
      res = await this.client.putStream(name, stream)
      // 将文件设置为公共可读
      await this.client.putACL(name, 'public-read')
    } catch (error) {
      console.log(error)
    }
    return res.url
  }

  async createDir(name: string, user_id: number, dirId = 0) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    })
    const existDir = await this.fileRepository.findOne({
      where: {
        name,
        isDir: 1,
        dirId,
      },
    })
    if (existDir) {
      return {
        code: 500,
        msg: '文件夹已存在',
      }
    }
    const data = await this.fileRepository.save({
      name,
      isDir: 1,
      user,
      dirId,
    })
    if (data) {
      return {
        code: 200,
        msg: '创建成功',
        data,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll(
    userId: number,
    name = '',
    type = '',
    dirId: number,
    isDir?: boolean,
    isRecovery?: boolean,
    isShared?: boolean,
  ) {
    const query = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.user', 'user')
      .where('user.id = :userId', { userId })
    if (name) {
      query.andWhere('file.name LIKE :name', { name: `%${name}%` })
    }
    if (type) {
      query.andWhere('file.type LIKE :type', { type: `%${type}%` })
    }
    if (dirId) {
      query.andWhere('file.dirId = :dirId', { dirId })
    } else {
      query.andWhere({ dirId: 0 })
    }
    if (isDir) {
      query.andWhere({ isDir: 1 })
    }
    if (isRecovery) {
      query.andWhere({ isRecovery: 1 })
    } else {
      query.andWhere({ isRecovery: 0 })
    }
    if (isShared) {
      query.andWhere({ isShared: 1 })
    } else {
      query.andWhere({ isShared: 0 })
    }

    query.orderBy('file.isDir', 'DESC')
    const data = await query.getMany()
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
  }

  async patchDelete(ids: number[]) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .delete()
      .whereInIds(ids)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }

  async updateFile(updateFileDto) {
    const data = await this.fileRepository.findOne({
      where: {
        id: updateFileDto.id,
      },
    })
    delete updateFileDto.id
    const newData = Object.assign(data, { ...updateFileDto })
    if (updateFileDto.users && updateFileDto.users.length) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .whereInIds(updateFileDto.users)
        .getMany()
      newData.users = users
    }
    const res = await this.fileRepository.save(newData)
    if (res) {
      return {
        code: 200,
        msg: '修改成功',
      }
    } else {
      return {
        code: 500,
        msg: '修改失败',
      }
    }
  }

  async recoveryFile(fileIds: number[]) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .update()
      .set({
        isRecovery: 1,
        deleteAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
      .whereInIds(fileIds)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }

  async reductionFile(fileIds: number[]) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .update()
      .set({
        isRecovery: 0,
      })
      .whereInIds(fileIds)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '还原成功',
      }
    } else {
      return {
        code: 500,
        msg: '还原成功',
      }
    }
  }

  async copyFile(id: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    })
    const file = await this.fileRepository.findOne({
      where: {
        id,
      },
    })
    if (!file) {
      return {
        code: 500,
        msg: '文件不存在',
      }
    }
    const name = `${file.name.replace(`.${file.ext}`, '')}_${dayjs().format(
      'YYYYMMDD',
    )}_${dayjs().format('HHmmss')}.${file.ext}`
    const newFile = {
      ...file,
      user,
      name,
    }
    delete newFile.id
    const res = await this.fileRepository.save(newFile)
    if (res) {
      return {
        code: 200,
        msg: '复制成功',
      }
    } else {
      return {
        code: 500,
        msg: '复制成功',
      }
    }
  }

  async shareFile(
    id: number,
    effectiveTime: number,
    extractedMethod: string,
    extractedCode?: string,
  ) {
    const file = await this.fileRepository.findOne({
      where: {
        id,
      },
    })
    if (!file) {
      return {
        code: 500,
        msg: '文件不存在',
      }
    }
    let code = ''
    if (extractedMethod === 'custom') {
      if (!extractedCode) {
        return {
          code: 500,
          msg: '自定义提取码不能为空',
        }
      }
    }
    if (extractedMethod === 'system') {
      code = generateRandomCode()
    }
    const url = `${host}/${generateUUID()}`
    const newFile = {
      ...file,
      shareAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      shareUrl: url,
      isShared: 1,
      expirationTime: effectiveTime,
    }
    const res = await this.fileRepository.save(newFile)
    if (res) {
      return {
        code: 200,
        msg: '生成分享链接成功',
        data: {
          code,
          url,
        },
      }
    } else {
      return {
        code: 500,
        msg: '生成分享链接失败',
      }
    }

    // let expirationTime = 0
    // let isExpiration = false
    // if (effectiveTime !== -1) {
    //   if (dayjs().value - currentTime < expirationTime * 1000 * 60 * 60 * 24) {
    //     isExpiration = true
    //     return {
    //       code: 500,
    //       msg: '文件已过期'
    //     }
    //   }
    // }
    // if (!isExpiration) {

    // }
  }
}
