<template>
  <div class="home-page">
    <div class="header">
      <div class="title-section">
        <img src="@/assets/images/logo.svg" alt="Logo" class="logo"/>
        <h1 class="main-title">{{ appTitle }}</h1>
        <p class="sub-title"></p>
      </div>
      <div class="search-bar">
        <countdown/>
        <el-dropdown>
          <el-avatar
              :src="accountStore.accountInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
              class="user-avatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push(ACCOUNT_URL)">个人中心</el-dropdown-item>
              <el-dropdown-item @click="router.push(SUGGEST_URL)">意见反馈</el-dropdown-item>
              <el-dropdown-item @click="router.push(CONSOLE_URL)" v-if="accountStore.accountInfo?.role == ROLE_ADMIN">
                管理后台
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="additional-buttons">
        <div>
          <el-button @click="router.push(EXAM_URL)" class="additional-button">考研真题</el-button>
          <el-button @click="router.push(JOURNAL_URL)" class="additional-button">外刊阅读</el-button>
          <el-button @click="router.push(CORRECT_URL)" class="additional-button">英语作文批改</el-button>
        </div>
      </div>
    </div>
    <div class="content">

    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {ElAvatar} from 'element-plus';
import {ACCOUNT_URL, CONSOLE_URL, CORRECT_URL, EXAM_URL, JOURNAL_URL, SUGGEST_URL} from "@/config";
import {useRouter} from "vue-router";
import {useAccountStore} from "@/stores/accountStore.ts";
import {ROLE_ADMIN} from "@/models/account.ts";
import Countdown from "@/views/home/components/countdown.vue";

const router = useRouter();
const accountStore = useAccountStore();

// 从环境变量中读取应用标题
const appTitle = computed(() => import.meta.env.VITE_GLOB_APP_TITLE);

</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

.home-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #ffffff; // 主背景颜色改为白色
  color: #000000; // 文字颜色改为黑色
  font-family: "Poppins", sans-serif;
  align-items: center;
  justify-content: center;

  .header {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 20px; // 增加内边距
    margin-top: 30px;
    background-color: #f9f9f9; // 较浅的灰色背景
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); // 更柔和的阴影
    margin-bottom: 20px; // 增加底部外边距

    .title-section {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .logo {
        width: 35px; // 设置logo的宽度
        height: 35px; // 设置logo的高度
        margin-right: 10px; // 设置logo和标题之间的间距
      }

      .main-title {
        font-size: 28px;
        margin: 0;
      }

      .sub-title {
        font-size: 18px;
        margin: 0;
        color: #666666; // 较浅的灰色
      }
    }

    .search-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px; // 增加底部外边距

      .user-avatar {
        width: 40px;
        height: 40px;
        border: 2px solid #cccccc; // 较浅的灰色边框
        overflow: hidden;
      }
    }

    .additional-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px; // 增加上部外边距
      gap: 15px; // 增加按钮之间的间距

      .additional-button {
        margin-top: 0; // 移除顶部外边距
      }
    }
  }

  .content {
    flex-grow: 1;
    width: 80%;
    display: flex;
    background-color: #f9f9f9; // 较浅的灰色背景
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); // 四周均匀的阴影
    margin-top: 8px; // 增加上部外边距
    margin-bottom: 30px; // 增加底部外边距
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow: auto;
  }
}
</style>

