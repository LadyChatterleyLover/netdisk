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
    isRecovery?: number
  }) {
    return post<FileItem[]>('/file', params, true)
  },
  createDir(params: { name: string; dirId?: number }) {
    return post('/file/createDir', params, true)
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
  updateFile(id: number, params: any) {
    return post(`/file/${id}`, params, true)
  },
}
