import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'
import { localGet, localSet } from '@/utils/util'

interface State {
  user: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    user: null || localGet('disk-user'),
  }),
  actions: {
    setUser(data: UserInfo) {
      this.user = data
      localSet('disk-user', data)
    },
  },
})
