<template>
  <div
    class="flex justify-between items-center h-[64px] z-[2000] px-6 relative header"
  >
    <div class="font-bold text-2xl">嘟嘟网盘</div>
    <a-dropdown :trigger="['click']">
      <div class="flex h-[64px] cursor-pointer">
        <div>
          <a-avatar v-if="user.avatar" :size="30" :src="user.avatar" />
          <a-avatar v-else :size="30">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>
        <div class="ml-2 text-lg flex items-center h-[64px]">
          {{ user.username }}
        </div>
      </div>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">
            <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="2">
            <span>系统设置</span>
          </a-menu-item>
          <a-menu-item key="3">
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type MenuProps, message } from 'ant-design-vue'
import { localGet } from '@/utils/util'

const router = useRouter()
const user = localGet('disk-user')

const handleMenuClick: MenuProps['onClick'] = (e) => {
  const { key } = e
  if (key === '1') {
    //
  } else if (key === '2') {
    //
  } else if (key === '3') {
    localStorage.removeItem('disk-user')
    localStorage.removeItem('disk-token')
    router.push('/login')
    message.success('退出成功')
  }
}
</script>

<style scoped lang="scss">
.header {
  box-shadow: -7px 3px 10px 0 rgba(0, 0, 0, 0.06);
}
</style>
