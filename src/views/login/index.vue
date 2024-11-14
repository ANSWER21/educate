<template>
  <div class="login-page-bg">
    <div class="main-login-form">
      <div class="form-tabs">
        <button @click="toggleForm('login')"
                :class="{ selected: formType === 'login','tab-button':true, 'right-round':true }">登录
        </button>
        <button @click="toggleForm('register')"
                :class="{ selected: formType === 'register','tab-button':true, 'left-round':true }">注册
        </button>
      </div>
      <form class="login-form" v-if="formType === 'login'" @submit.prevent="handleLoginSubmit">
        <input
            class="email-input"
            type="email"
            placeholder="请输入邮箱"
            v-model="formData.email"
        />
        <input
            class="password-input"
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
        />
        <button class="login-button">登录</button>
      </form>

      <form class="register-form" v-if="formType === 'register'" @submit.prevent="handleRegisterSubmit">
        <input
            class="email-input"
            type="email"
            placeholder="请输入邮箱"
            v-model="formData.email"
        />

        <div class="verification-container">
          <input
              class="verification-code-input"
              type="text"
              minlength="6"
              placeholder="请输入验证码"
              v-model="formData.verificationCode"
          />
          <button type="button" class="get-code-btn" @click="getVerificationCode">{{ verificationCodeBtnText }}</button>
        </div>
        <input
            class="password-input"
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
        />
        <button class="register-button">注册</button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {emailLogin, emailRegister, getEmailVerificationCode} from "@/api/models/account.ts";
import {validateEmail} from "@/utils/verify.ts";
import {ElMessage} from "element-plus";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {useAccountStore} from "@/stores/accountStore.ts";
import {useRouter} from "vue-router";
import {HOME_URL} from "@/config";

const router = useRouter();
const accountStore = useAccountStore()
// tab切换登录/注册
type FormType = 'login' | 'register';
const formType = ref<FormType>('login');

// 验证码倒计时器
const timeLeft = ref(0);
const verificationCodeBtnText = ref('获取验证码');
let intervalId: number | undefined;

function startTimer() {
  if (intervalId) return; // 防止多个计时器同时运行
  timeLeft.value = 60; // 设置倒计时时间为60秒
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    if (timeLeft.value === 0) {
      verificationCodeBtnText.value = '重新获取';
    } else {
      verificationCodeBtnText.value = `${timeLeft.value}秒后重新获取`;
    }
  }, 1000) as unknown as number; // 使用类型断言确保intervalId为number类型
}

interface FormData {
  email: string;
  verificationCode: string;
  password: string;
}

const formData = ref<FormData>({
  email: '',
  verificationCode: '',
  password: '',
});

// 切换登录/注册
function toggleForm(type: FormType) {
  formType.value = type;
}

// 获取验证码
function getVerificationCode() {
  const email = formData.value.email
  if (timeLeft.value > 0) {
    ElMessage.info(`请${timeLeft.value}秒后重新获取`)
  } else {
    if (validateEmail(email)) {
      startTimer()
      getEmailVerificationCode(email).then(res => {
        if (res.data) {
          ElMessage.success('验证码发送成功')
        } else {
          ElMessage.error('验证码发送失败')
        }
      });
    } else {
      ElMessage.error('请输入正确的邮箱')
    }
  }
}

function handleLoginSubmit() {
  accountStore.setToken("token")
  // router.push(HOME_URL);
  // router.push(CONSOLE_URL);
  const {email, password} = formData.value
  emailLogin(email, password).then(res => {
    if (res.code == CODE_SUCCESS) {
      ElMessage.success('登录成功')
      const accountInfo = res.data
      accountStore.setToken(accountInfo.userName)
      accountStore.setAccountInfo(accountInfo)
      router.push(HOME_URL);
    } else {
      ElMessage.error(`登录失败:${res.msg}`)
    }
  }).catch((error) => {
    ElMessage.error(error.message)
  })
}

function handleRegisterSubmit() {
  const {email, password, verificationCode} = formData.value
  emailRegister(email, password, verificationCode).then(res => {
    if (res.code == CODE_SUCCESS) {
      ElMessage.success('注册成功')
    } else {
      ElMessage.error(`注册失败:${res.msg}`)
    }
  }).catch((error) => {
    ElMessage.error(error.message)
  })
}
</script>

<style scoped lang="scss">
@use "./index.scss";


</style>
