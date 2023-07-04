<template>
  <a-breadcrumb separator="">
    <template v-if="breadcrumbPaths.length">
      <a-breadcrumb-item class="active">
        <span @click="back">返回上一级</span>
      </a-breadcrumb-item>
      <a-breadcrumb-separator>|</a-breadcrumb-separator>
    </template>
    <a-breadcrumb-item
      :class="{ active: breadcrumbPaths.length }"
      @click="clickAll"
      >全部文件</a-breadcrumb-item
    >
    <a-breadcrumb-separator v-if="breadcrumbPaths.length"
      >&gt;</a-breadcrumb-separator
    >
    <template v-for="(item, index) in breadcrumbPaths" :key="index">
      <a-breadcrumb-item
        :class="{ active: item.children && item.children.length }"
      >
        <span @click="clickBreadcrumb(item, index)">{{ item.name }}</span>
      </a-breadcrumb-item>
      <a-breadcrumb-separator v-if="index !== breadcrumbPaths.length - 1"
        >&gt;</a-breadcrumb-separator
      >
    </template>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'

interface ListItem {
  name: string
  children: ListItem[]
  [key: string]: any
}

const props = defineProps<{
  fileList: ListItem[]
  breadcrumbPaths: ListItem[]
}>()

const emits = defineEmits<{
  'update:fileList': [val: ListItem[]]
  'update:breadcrumbPaths': [val: ListItem[]]
}>()

const cloneFileList = ref<ListItem[]>([])

const clickBreadcrumb = (row: ListItem, index: number) => {
  if (row.children && row.children.length) {
    emits('update:fileList', cloneDeep(row.children))
    emits('update:breadcrumbPaths', props.breadcrumbPaths.slice(0, index + 1))
  }
}

const clickAll = () => {
  if (props.breadcrumbPaths.length) {
    emits('update:fileList', cloneFileList.value)
    emits('update:breadcrumbPaths', [])
  }
}

const back = () => {
  if (props.breadcrumbPaths.length === 1) {
    emits('update:breadcrumbPaths', [])
    emits('update:fileList', cloneFileList.value)
  }
}

const stopWatch = watch(
  () => props.fileList,
  (val) => {
    cloneFileList.value = cloneDeep(val)
    if (cloneFileList.value.length) {
      stopWatch()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="scss">
.active {
  color: #06a7ff;
  cursor: pointer;
}
</style>
