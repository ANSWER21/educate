<template>
  <div class="login-page-bg">
    <div class="main-login-form">
      <div class="login-form-label">
        <h2>登录</h2>
      </div>
      <form class="login-form">
        <input
            maxlength="30"
            minlength="5"
            required="true"
            class="username-input"
            type="text"
            placeholder="username"
        />
        <input
            maxlength="30"
            minlength="5"
            required="true"
            class="password-input"
            type="password"
            placeholder="password"
        />
        <button class="login-button">login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
