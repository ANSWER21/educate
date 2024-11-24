<template>
  <div class="home-page">
    <div class="header">
      <div class="search-bar">
        <el-select
            class="search-select"
            :popper-append-to-body="false"
            v-model="subject"
            style="width: 280px"
        >
          <el-option
              v-for="subject in SUBJECTS"
              :value="subject.value"
              :label="`(${subject.value})${subject.label}`"
          />
        </el-select>
        <el-date-picker
            v-model="dateRange"
            type="monthrange"
            range-separator="到"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            class="date-picker"
        />
        <el-input
            v-model="filterKeyword"
            placeholder="请输入过滤关键词"
            class="search-box"
        />
        <el-dropdown>
          <el-avatar
              :src="accountStore.accountInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
              class="user-avatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push(ACCOUNT_URL)">个人中心</el-dropdown-item>
              <el-dropdown-item @click="router.push(CONSOLE_URL)" v-if="accountStore.accountInfo?.role == ROLE_ADMIN">
                控制台
              </el-dropdown-item>
              <el-dropdown-item @click="router.push(SUGGEST_URL)">意见反馈</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <exam-list :subject="subject" :dateRange="dateRange" :filterKeyword="filterKeyword"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';
import {ElAvatar, ElInput} from 'element-plus';
import ExamList from "@/views/home/components/examList.vue";
import {SUBJECTS} from "@/models/exam.ts";
import {ACCOUNT_URL, CONSOLE_URL, SUGGEST_URL} from "@/config";
import {useRouter} from "vue-router";
import {useAccountStore} from "@/stores/accountStore.ts";
import {ROLE_ADMIN} from "@/models/account.ts";

const router = useRouter();
const accountStore = useAccountStore();
const filterKeyword = ref('');


const subject = ref("(101)政治")
const dateRange = ref<Date[]>([])

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
  background: url("@/assets/images/main_bg_4.jpg");
  color: white;
  font-family: "Poppins", sans-serif;
  align-items: center;
  justify-content: center;

  .header {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 10px 20px;
    margin-top: 30px;
    background: rgba(60, 7, 147, 0.8);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25),
    -3px -3px 6px rgba(255, 255, 255, 0.15);
    border-radius: 10px;

    .search-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;

      .user-avatar {
        width: 40px; /* 确保头像的宽度为固定值 */
        height: 40px; /* 确保头像的高度为固定值 */
        border: 2px solid #ffffff; /* 添加白色边框以增强可见性 */
        overflow: hidden; /* 确保头像图片内容不超出圆形区域 */
      }
    }
  }

  .content {
    flex-grow: 1;
    width: 80%;
    display: flex;
    background: rgba(60, 7, 147, 0.8);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25),
    -3px -3px 6px rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 30px;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow: auto;

    .item-content {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .item-image {
        height: 160px;
      }

      .item-title {
        font-size: 20px;
        color: white;
      }
    }
  }
}

</style>
