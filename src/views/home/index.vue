<template>
  <div class="home-page">
    <div class="header">
      <div class="search-bar">
        <el-select class="search-select" :popper-append-to-body="false" v-model="subject" style="width: 280px">
          <el-option v-for="subject in SUBJECTS" :value="subject.value" :label="`(${subject.value})${subject.label}`"/>
        </el-select>
        <el-date-picker
            v-model="dateRange"
            type="monthrange"
            range-separator="到"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM-dd HH:mm:ss"
        />
        <el-input
            v-model="searchQuery"
            placeholder="请输入搜索内容"
            class="search-box"/>
        <el-avatar src="https://freesvg.org/img/abstract-user-flat-1.png" class="user-avatar"></el-avatar>
      </div>
    </div>
    <div class="content">
      <exam-card :subject="subject" :dateRange="dateRange"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';
import {ElAvatar, ElInput} from 'element-plus';
import ExamCard from "@/views/home/components/examCard.vue";
import {SUBJECTS} from "@/models/exam.ts";


const searchQuery = ref('');


const subject = ref("(101)政治")
const dateRange = ref<Date[]>([])

</script>

<style scoped lang="scss">
@use "./index.scss";

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
