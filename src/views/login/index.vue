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
      <form class="login-form" v-if="formType === 'login'">
        <input
            class="email-input"
            type="email"
            placeholder="请输入邮箱"
        />
        <input
            class="password-input"
            type="password"
            placeholder="请输入密码"
        />
        <button class="login-button" @submit="handleSubmit">登录</button>
      </form>

      <form class="register-form" v-if="formType === 'register'">
        <input
            class="email-input"
            type="email"
            placeholder="请输入邮箱"
        />

        <div class="verification-container">
          <input
              class="verification-code-input"
              type="text"
              minlength="6"
              placeholder="请输入验证码"
          />
          <button class="get-code-btn">获取验证码</button>
        </div>
        <input
            class="password-input"
            type="password"
            placeholder="请输入密码"
        />
        <button class="register-button" @submit="handleSubmit">注册</button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

type FormType = 'login' | 'register';

interface FormData {
  username: string;
  password: string;
}

const formType = ref<FormType>('login');
const formData = ref<FormData>({
  username: '',
  password: ''
});

function toggleForm(type: FormType) {
  formType.value = type;
}

function handleSubmit() {
  if (formType.value === 'login') {
    console.log('登录信息', formData.value);
  } else {
    console.log('注册信息', formData.value);
  }
}
</script>

<style scoped lang="scss">
@use "./index.scss";


</style>
