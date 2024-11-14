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
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              class="user-avatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push(ACCOUNT_URL)">个人中心</el-dropdown-item>
              <el-dropdown-item @click="router.push(CONSOLE_URL)">控制台</el-dropdown-item>
              <el-dropdown-item @click="router.push(SUGGEST_URL)">意见反馈</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <exam-card :subject="subject" :dateRange="dateRange" :filterKeyword="filterKeyword"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';
import {ElAvatar, ElInput} from 'element-plus';
import ExamCard from "@/views/home/components/examCard.vue";
import {SUBJECTS} from "@/models/exam.ts";
import {ACCOUNT_URL, CONSOLE_URL, SUGGEST_URL} from "@/config";
import {useRouter} from "vue-router";

const router = useRouter();
const filterKeyword = ref('');


const subject = ref("(101)政治")
const dateRange = ref<Date[]>([])

</script>

<style scoped lang="scss">
@use "./index.scss";

</style>
