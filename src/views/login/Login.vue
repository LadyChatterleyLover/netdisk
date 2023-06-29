<template>
  <div class="relative h-full w-full px-4 login overflow-hidden">
    <div class="relative h-full py-2 mx-auto px-10 max-w-[1200px]">
      <div class="flex h-full relative top-[-50px]">
        <div
          class="min-h-full pl-4 mr-4 w-1/2 flex animate__animated animate__fadeInLeft"
        >
          <div class="my-auto relative top-[-32px]">
            <div>
              <img
                class="w-[50%]"
                src="../../assets/login-box-bg.svg"
                alt="login-box-bg"
              />
            </div>
            <div class="my-8 text-white text-3xl">嘟嘟网盘</div>
            <div class="text-white text-sm">输入您的个人详细信息开始使用！</div>
          </div>
        </div>
        <div class="flex min-h-full py-5 w-1/2">
          <div
            class="relative w-full px-5 py-8 mx-auto my-auto rounded-md ml-16 bg-transparent p-4"
          >
            <div v-if="!forget" class="animate__animated animate__fadeInRight">
              <div class="mb-3 font-bold text-3xl text-left">
                {{ isLogin ? '登录' : '注册' }}
              </div>
              <a-form
                v-if="isLogin"
                ref="formRef"
                :model="loginModel"
                :rules="loginRules"
                name="login"
              >
                <a-form-item name="username">
                  <a-input
                    v-model:value="loginModel.username"
                    placeholder="请输入用户名"
                    clearable
                  />
                </a-form-item>
                <a-form-item name="password">
                  <a-input-password
                    v-model:value="loginModel.password"
                    placeholder="请输入密码"
                    clearable
                  />
                </a-form-item>
                <a-form-item>
                  <a-row class="w-full">
                    <a-col :span="12">
                      <div />
                    </a-col>
                    <a-col :span="12" class="text-right">
                      <a-button type="link" @click="forget = true"
                        >忘记密码?</a-button
                      >
                    </a-col>
                  </a-row>
                </a-form-item>
                <a-form-item>
                  <div class="flex">
                    <a-button class="flex-1 mr-5" type="primary" @click="login"
                      >登录</a-button
                    >
                    <a-button class="flex-1" @click="isLogin = false"
                      >注册</a-button
                    >
                  </div>
                </a-form-item>
              </a-form>
              <a-form
                v-else
                ref="formRef"
                :model="registerModel"
                :rules="registerRules"
                name="register"
              >
                <a-form-item name="username">
                  <a-input
                    v-model:value="registerModel.username"
                    placeholder="请输入用户名"
                    clearable
                  />
                </a-form-item>
                <a-form-item name="email">
                  <a-input
                    v-model:value="registerModel.email"
                    placeholder="请输入邮箱"
                    clearable
                  />
                </a-form-item>
                <a-form-item name="password">
                  <a-input-password
                    v-model:value="registerModel.password"
                    placeholder="请输入密码"
                    clearable
                  />
                </a-form-item>
                <a-form-item name="rePassword">
                  <a-input-password
                    v-model:value="registerModel.rePassword"
                    placeholder="请确认密码"
                    clearable
                  />
                </a-form-item>
                <a-form-item>
                  <a-row class="w-full">
                    <a-col :span="12">
                      <div />
                    </a-col>
                    <a-col :span="12" class="text-right">
                      <a-button type="link" @click="forget = true"
                        >忘记密码?</a-button
                      >
                    </a-col>
                  </a-row>
                </a-form-item>
                <a-form-item>
                  <div class="flex">
                    <a-button
                      v-if="isLogin"
                      class="flex-1 mr-5"
                      type="primary"
                      @click="login"
                      >登录</a-button
                    >
                    <a-button
                      v-else
                      class="flex-1 mr-5"
                      type="primary"
                      @click="isLogin = true"
                      >返回</a-button
                    >
                    <a-button class="flex-1" @click="register">注册</a-button>
                  </div>
                </a-form-item>
              </a-form>
            </div>
            <div
              v-else
              class="animate__animated animate__fadeInRight relative top-[-100px]"
            >
              <template v-if="!canFind">
                <div class="mb-3 font-bold text-3xl text-left">找回密码</div>
                <a-form
                  ref="forgetFormRef"
                  :model="forgetModel"
                  :rules="forgetRules"
                >
                  <a-form-item name="email">
                    <a-input
                      v-model:value="forgetModel.email"
                      placeholder="请输入邮箱"
                      clearable
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-row class="w-full" :gutter="20">
                      <a-col :span="12">
                        <a-button class="w-full" @click="forgetBack"
                          >返回</a-button
                        ></a-col
                      >
                      <a-col :span="12">
                        <a-button
                          class="w-full"
                          type="primary"
                          @click="findPassword"
                          >确认</a-button
                        ></a-col
                      >
                    </a-row>
                  </a-form-item>
                </a-form>
              </template>
              <template v-else>
                <div class="mb-3 font-bold text-3xl text-left">重置密码</div>
                <a-form
                  ref="updateFormRef"
                  :model="updateFormModel"
                  :rules="updateFormRules"
                >
                  <a-form-item name="verifyCode">
                    <a-row class="w-full">
                      <a-col :span="2">
                        <span class="font-bold text-lg">KTE_</span>
                      </a-col>
                      <a-col :span="21" :offset="1">
                        <a-input
                          v-model:value="updateFormModel.verifyCode"
                          class="w-full"
                          placeholder="请输入验证码"
                          clearable
                      /></a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item name="newPassword">
                    <a-input
                      v-model:value="updateFormModel.newPassword"
                      placeholder="请输入新密码"
                      clearable
                      show-password
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-row class="w-full" :gutter="20">
                      <a-col :span="12">
                        <a-button class="w-full" @click="updateBack"
                          >返回</a-button
                        ></a-col
                      >
                      <a-col :span="12">
                        <a-button
                          class="w-full"
                          type="primary"
                          @click="updatePassword"
                          >确认</a-button
                        ></a-col
                      >
                    </a-row>
                  </a-form-item>
                </a-form>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/lib/form'
import api from '@/api'
import { localSet } from '@/utils/util'

const router = useRouter()
const isLogin = ref(true)
const forget = ref(false)
const canFind = ref(false)

const formRef = ref<FormInstance>()
const forgetFormRef = ref<FormInstance>()
const updateFormRef = ref<FormInstance>()
const loginModel = ref({
  username: 'dudu',
  password: '111223',
})
const registerModel = ref({
  username: '',
  password: '',
  rePassword: '',
  email: '',
})
const loginRules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
}
const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入确认密码')
  } else if (value !== registerModel.value.password) {
    return Promise.reject('两次密码不一致')
  } else {
    return Promise.resolve()
  }
}
const registerRules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
  rePassword: [{ validator: validatePass, trigger: 'change' }],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '邮箱格式不正确',
      trigger: 'change',
    },
  ],
}

const forgetModel = ref({
  email: '',
})

const forgetRules = {
  email: [
    {
      required: true,
      message: '工号不能为空',
      trigger: 'blur',
    },
  ],
}

const updateFormModel = ref({
  verifyCode: '',
  newPassword: '',
})

const updateFormRules = {
  verifyCode: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur',
    },
    {
      len: 5,
      message: '验证码为5位字符',
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 15,
      message: '新密码在6-15位之间',
      trigger: 'blur',
    },
  ],
}

const login = () => {
  isLogin.value = true
  formRef
    .value!.validate()
    .then(() => {
      api.user
        .login({
          username: loginModel.value.username,
          password: loginModel.value.password,
        })
        .then((res: any) => {
          if (res.code === 200) {
            const token = res.data.token
            if (token) {
              localSet('disk-token', token)
              localSet('disk-user', res.data.user)
              message.success('登录成功！')
              router.push('/')
            }
          } else {
            message.error(res.msg)
          }
        })
    })
    .catch(() => {
      message.error('表单填写有误,请检查')
    })
}

const register = () => {
  if (isLogin.value) {
    isLogin.value = false
  } else {
    formRef
      .value!.validate()
      .then(() => {
        api.user
          .register({
            username: registerModel.value.username,
            password: registerModel.value.password,
            email: registerModel.value.email,
          })
          .then((res: any) => {
            if (res.code === 200) {
              const token = res.data.token
              if (token) {
                localSet('disk-token', token)
                localSet('disk-user', res.data.user)
                message.success('登录成功！')
                router.push('/')
              }
            } else {
              message.error(res.msg)
            }
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }
}

const findPassword = () => {
  forgetFormRef
    .value!.validate()
    .then(() => {
      // api.system.getUserEmail(forgetModel.value.email).then((res) => {
      //   if (res.code == 200) {
      //     if (res.data) {
      //       userEmail.value = res.data
      //       canFind.value = true
      //       api.system.sendEmail({ email: userEmail.value }).then((res) => {
      //         if (res.code == 200) {
      //           message.success(res.msg)
      //         } else {
      //           message.error(res.msg)
      //         }
      //       })
      //     } else {
      //       message.warning('请先去钉钉个人信息里完善邮箱信息')
      //     }
      //   } else {
      //     canFind.value = false
      //     message.error(res.msg)
      //   }
      // })
    })
    .catch(() => {
      message.error('表单填写有误,请检查')
    })
}

const updatePassword = () => {
  updateFormRef
    .value!.validate()
    .then(() => {
      // api.system
      //   .resetPassword({
      //     email: forgetModel.value.email,
      //     ...updateFormModel.value,
      //   })
      //   .then((res) => {
      //     if (res.code == 200) {
      //       message.success(res.msg)
      //       canFind.value = false
      //       forget.value = false
      //     } else {
      //       message.error(res.msg)
      //     }
      //   })
    })
    .catch(() => {
      message.error('表单填写有误,请检查')
    })
}

const forgetBack = () => {
  forget.value = false
  canFind.value = false
  forgetFormRef.value!.resetFields()
}

const updateBack = () => {
  canFind.value = false
  updateFormRef.value!.resetFields()
}
</script>

<style scoped lang="scss">
html[data-theme='dark'] {
  .login {
    background: #293146;
    &::before {
      background-image: url('../../assets/login-bg-dark.svg');
    }
  }
}

.login {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url('../../assets/login-bg.svg');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: '';
    z-index: -1;
  }
}
</style>
