<script setup lang="ts">
import {Exam} from "@/models/exam.ts"
import {toRefs} from "vue"
import {format} from "date-fns";

// 子组件接收值
const props = defineProps({
  exams: Array
});

function getFileName(url: string): string {
  // 先提取文件名
  const fileName = url.substring(url.lastIndexOf('/') + 1);

// 使用正则表达式去掉最后的时间戳部分
  return fileName.replace(/_\d+(?=\.pdf$)/, "");
}


const {exams} = toRefs(props)
</script>

<template>
  <div class="exam-list">
    <div v-for="exam in exams as Exam[]" :key="exam.id" class="exam-item">
      <h2 class="item-title">{{ exam.title }}</h2>
      <h4>{{ exam.subject }}</h4>
      <p>{{ format(exam.date, "yyyy-MM-dd") }}</p>
      <ul v-if="exam.files && exam.files.length">
        <li v-for="url in exam.files" :key="url">{{ getFileName(url) }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.exam-list {
  width: 100%; // 宽度为100%
  margin: auto;
}

.exam-item {
  background: #3c0793;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px; // 每项之间的间隔
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3),
  -3px -3px 6px rgba(255, 255, 255, 0.2);
  color: #fff;
}

.item-title {
  margin: 0;
  color: #FAD961; // 标题颜色
}

h4 {
  margin: 10px 0;
  color: #E3FDFD; // 科目颜色
}

ul {
  padding-left: 20px;
}

li {
  list-style-type: disc;
}
</style>