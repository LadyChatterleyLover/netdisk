import { post } from '../request'
import type { FileItem } from '@/types/file'

export default {
  uploadFile(params: any) {
    return post<FileItem>('/file/upload', params, false, true)
  },
  getFileList(params?: {
    name?: string
    type?: string
    dirId?: number
    isDir?: number
    isRecovery?: boolean
    isShared?: boolean
  }) {
    return post<FileItem[]>('/file', params, true)
  },
  createDir(params: { name: string; dirId?: number }) {
    return post<FileItem>('/file/createDir', params, true)
  },
  deleteFile(ids: number[]) {
    return post('/file/patchDelete', ids, true)
  },
  recoveryFile(ids: number[]) {
    return post('/file/recoveryFile', ids, true)
  },
  reductionFile(ids: number[]) {
    return post('/file/reductionFile', ids, true)
  },
  updateFile(params: any) {
    return post(`/file/updateFile`, params, true)
  },
  copyFile(params: { id: number }) {
    return post('/file/copyFile', params, true)
  },
  shareFile(params: {
    id: number
    effectiveTime: number
    extractedMethod: string
    extractedCode?: string
  }) {
    return post<{
      code: string
      url: string
    }>('/file/shareFile', params, true)
  },
  cancelShare(params: { id: number }) {
    return post('/file/cancelShare', params, true)
  },
  findFileByCode(params: { code: string }) {
    return post<{
      name: string
      shareAt: string
      username: string
      avatar: string
    }>('/file/findFileByCode', params, true)
  },
  extractFile(params: { urlCode: string; code: string }) {
    return post('/file/extractFile', params, true)
  },
}
