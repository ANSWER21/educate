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
      <exam-card :exams="exams"/>
      <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :background="background"
          layout="prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, watch} from 'vue';
import {ElAvatar, ElInput, ElMessage, ElPagination} from 'element-plus';
import ExamCard from "@/views/home/components/examCard.vue";
import {Exam, SUBJECTS} from "@/models/exam.ts";
import {onMounted} from "@vue/runtime-core";
import {getExamList} from "@/api/models/exam.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";

const searchQuery = ref('');
const exams = ref<Exam[]>([])
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true)
const total = ref(exams.value.length);
const subject = ref("(101)政治")
const dateRange = ref<Date[]>()

onMounted(() => {
  refreshData()
})

watch(subject, () => {
  refreshData()
})

watch(dateRange, () => {
  refreshData()
})

const refreshData = () => {
  const fromDate = dateRange.value ? dateRange.value[0] : null
  const toDate = dateRange.value ? dateRange.value[1] : null
  console.log(`subject:${subject.value};fromDate:${fromDate};toDate:${toDate}`)
  getExamList(
      subject.value,
      fromDate,
      toDate,
      currentPage.value,
      pageSize.value
  ).then(res => {
    console.log(`res=${JSON.stringify(res.data)}`)
    if (res.code == CODE_SUCCESS) {
      exams.value = res.data.list
    } else {
      ElMessage.error(`刷新失败:${res.msg}`)
    }
  }).catch((error) => {
    console.log(`error=${error.message}`)
    ElMessage.error(error.message)
  })
}

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
};

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
