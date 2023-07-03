import { defineStore } from 'pinia'
import type { FileItem } from '@/types/file'

interface State {
  fileList: FileItem[]
}

export const useFileStore = defineStore('file', {
  state: (): State => ({
    fileList: [],
  }),
  actions: {
    setFileList(list: FileItem[]) {
      this.fileList = list
    },
  },
})
