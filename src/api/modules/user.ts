import { post } from '../request'

export default {
  register(params: { username: string; password: string; email: string }) {
    return post('/user/register', params)
  },
  login(params: { username: string; password: string }) {
    return post('/user/login', params)
  },
}
