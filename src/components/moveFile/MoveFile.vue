<template>
  <a-modal
    v-model:visible="visible"
    title="移动到"
    :mask-close="false"
    ok-text="移动到此"
    :cancel-button-props="{ shape: 'round' }"
    :ok-button-props="{ shape: 'round' }"
    @ok="confirm"
    @cancel="cancel"
  >
    <template v-if="dirList.length">
      <div
        v-for="(item, index) in dirList"
        :key="index"
        class="flex items-center cursor-pointer"
        @click="clickItem(item)"
      >
        <template v-if="item.isDir">
          <img
            class="mr-2"
            src="../../assets/dir2.png"
            width="40"
            height="40"
            alt=""
          />
          <div>{{ item.name }}</div>
        </template>
      </div>
    </template>
    <div v-else class="flex justify-center items-center flex-col w-full h-full">
      <div>
        <img class="w-[90px] h-[90px]" src="../../assets/dir3.png" alt="" />
      </div>
      <div v-if="activeItem" class="text-sm text-[#afb3bf]">
        移动到 {{ activeItem.name }} 文件夹
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { message } from 'ant-design-vue'
import api from '../../api'
import type { FileItem } from '@/types/file'

const getFileList = inject<() => void>('getFileList')

const visible = ref(false)
const current = ref<FileItem[]>([])
const activeItem = ref<FileItem>()
const dirList = ref<FileItem[]>([])

const geiAllDir = () => {
  api.file
    .getFileList({
      isDir: 1,
    })
    .then((res) => {
      dirList.value = res.data
    })
}

const clickItem = (item: FileItem) => {
  activeItem.value = item
  api.file
    .getFileList({
      dirId: item.id,
    })
    .then((res) => {
      dirList.value = res.data
    })
}

const confirm = () => {
  const arr: Promise<any>[] = current.value.map((item) => {
    return api.file.updateFile({
      id: item.id,
      dirId: activeItem.value?.id || 0,
    })
  })
  Promise.all(arr)
    .then(() => {
      message.success('操作成功')
      getFileList?.()
      cancel()
    })
    .catch((err) => {
      message.error(err)
    })
}

const cancel = () => {
  current.value = []
  activeItem.value = undefined
  dirList.value = []
  visible.value = false
}

const open = (row: FileItem[]) => {
  current.value = row
  visible.value = true
  geiAllDir()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
