<template>
  <a-modal
    v-model:visible="visible"
    :title="`${current?.name} - zip`"
    :footer="null"
    :mask-closable="false"
    :body-style="{
      overflow: 'auto',
      height: '700px',
    }"
    width="35%"
  >
    <vxe-table :data="fileList">
      <vxe-column title="文件名" align="center">
        <template #default="{ row }">
          <div
            class="flex items-center justify-center cursor-pointer"
            @click="clickItem(row)"
          >
            <div class="flex-1 flex justify-end mr-3">
              <img
                v-if="row.size"
                width="40"
                height="40"
                src="../../assets/file.png"
                alt=""
              />
              <img
                v-else
                width="40"
                height="40"
                src="../../assets/dir2.png"
                alt=""
              />
            </div>
            <div class="flex-1 flex justify-start">{{ row.name }}</div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="大小" align="center">
        <template #default="{ row }">
          <div>{{ row.size ? useFormatFileSize(row.size) : '-' }}</div>
        </template>
      </vxe-column>
    </vxe-table>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import JSZip from 'jszip'
import type { FileItem } from '@/types/file'
import { useFormatFileSize } from '@/hooks/useFormatFileSize'

interface ZipItem {
  name: string
  size: string
  children: ZipItem[]
}

const visible = ref(false)
const current = ref<FileItem>()
const fileList = ref<ZipItem[]>([])

const extractFiles = (zipFile: any) => {
  const buildFileTree = (files: any) => {
    const tree: ZipItem[] = []
    for (const filePath in files) {
      const file = files[filePath]
      const parts = filePath.split('/')
      const fileName = parts.pop()
      let currentNode: ZipItem[] = tree
      for (const part of parts) {
        const existingNode = findNode(currentNode, part)
        if (existingNode) {
          currentNode = existingNode.children
        } else {
          const newNode: ZipItem = { name: part, size: '', children: [] }
          currentNode.push(newNode)
          currentNode = newNode.children
        }
      }
      if (fileName) {
        currentNode.push({ name: fileName, size: file.size, children: [] })
      }
    }
    return tree
  }
  const tree = buildFileTree(zipFile)
  return tree
}

const findNode = (children: any[], name: string) => {
  for (const child of children) {
    if (child.name === name) {
      return child
    }
  }
  return null
}

const setSize = async (zip: any, fileNames: string[]) => {
  for (const fileName of fileNames) {
    const file = zip.file(fileName)
    if (!file) {
      zip.files[fileName].size = 0
    } else {
      const fileSize = await file?.async('uint8array')
      zip.files[fileName].size = fileSize.length
    }
  }
}

const clickItem = (row: ZipItem) => {
  if (row.children && row.children.length) {
    fileList.value = row.children
  }
}

const open = async (row: FileItem) => {
  current.value = row
  const { data } = await axios.get(row.url, { responseType: 'arraybuffer' })
  const zip = await JSZip.loadAsync(data)
  const fileNames = Object.keys(zip.files)
  await setSize(zip, fileNames)
  fileList.value = extractFiles(zip.files)
  visible.value = true
}

defineExpose({
  open,
})
</script>

<style scoped></style>
