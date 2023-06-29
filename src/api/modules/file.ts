import { post } from '../request'
import type { FileItem } from '@/types/file'

export default {
  uploadFile(params: any) {
    return post<FileItem>('/file/upload', params, false, true)
  },
  getFileList() {
    return post<FileItem[]>('/file', {})
  },
  createDir(params: { name: string }) {
    return post('/file/createDir', params)
  },
  deleteFile(params: { ids: number[] }) {
    return post('/file/patchDelete', params)
  },
  updateFile(id: number, params: any) {
    return post(`/file/${id}`, params)
  },
}
