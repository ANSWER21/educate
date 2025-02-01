<template>
  <div class="home-page">
    <div class="header">
      <div class="search-bar">
        <college-select v-model="college" style="width: 650px"/>
        <subject-select v-model="subject"
                        :college="college"
                        :subjects="subjects"
                        @update:subjects="updateSubjects"
                        style="width: 650px"/>
        <el-date-picker
            v-model="dateRange"
            type="monthrange"
            range-separator="到"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            class="date-picker"
            v-if="showDatePicker"
            style="width: 600px"
        />
        <el-input
            v-model="filterKeyword"
            placeholder="请输入过滤关键词"
            class="search-box"
        />
      </div>
    </div>
    <div class="content">
      <exam-list :college="college" :subjects="subjects" :subject="subject" :dateRange="dateRange"
                 :filterKeyword="filterKeyword"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElInput} from 'element-plus';
import ExamList from "@/views/exam/components/examList.vue";
import {College, Subject} from "@/models/exam.ts";
import CollegeSelect from "@/components/Select/CollegeSelect.vue";
import SubjectSelect from "@/components/Select/SubjectSelect.vue";

const filterKeyword = ref('');
const showDatePicker = ref(false)

const college = ref<College | undefined>(undefined)
const subjects = ref<Subject[]>([])
const subject = ref<Subject | undefined>(undefined)
const dateRange = ref<Date[]>([])

const updateSubjects = (val: Subject[]) => {
  subjects.value = val
}

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

    .search-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px; // 增加底部外边距
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

