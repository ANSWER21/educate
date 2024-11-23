<script setup lang="ts">
import {Exam, getSubjectTip} from "@/models/exam.ts";
import {computed, onMounted, ref, toRefs, watch} from "vue";
import {format} from "date-fns";
import {CircleCheck, Loading} from '@element-plus/icons-vue';
import {getExamList} from "@/api/models/exam.ts";
import {CODE_SUCCESS, PageInfo} from "@/models/resultJson.ts";
import {ElMessage} from "element-plus";
import {getFileName} from "../../../utils/path.ts";

// 子组件接收值
const props = defineProps<{
  subject: string;
  filterKeyword: string;
  dateRange: Date[];
}>();

// 解构 props
const {subject, filterKeyword, dateRange} = toRefs(props);

const exams = ref<Exam[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const lastPageInfo = ref<PageInfo<Exam> | null>(null);
const isLoading = ref(false); // 加载状态
const listBottomTip = ref<string>("")

// 使用计算属性进行过滤
const filteredExams = computed(() => {
  const lowerKeyword = filterKeyword.value.trim().toLowerCase();

  // 如果关键词为空或仅包含空白字符，直接返回原列表
  if (!lowerKeyword) {
    return exams.value;
  }
  return exams.value.filter((exam) => {
    return (
        exam.title.toLowerCase().includes(lowerKeyword) || // 在 title 中搜索
        exam.subject.toLowerCase().includes(lowerKeyword) // 在 subject 中搜索
    );
  });
});


// 加载下一页数据
function loadNextPage() {
  if (isLoading.value || lastPageInfo.value == null || lastPageInfo.value?.hasNextPage == false) {
    listBottomTip.value = "没有更多数据了";
    return;
  } else {
    listBottomTip.value = "加载中...";
  }

  isLoading.value = true; // 标记为加载中
  currentPage.value += 1; // 增加当前页数

  refreshData(true); // 追加数据
}

// 获取数据方法
const refreshData = (append = false) => {
  const fromDate = dateRange.value && dateRange.value[0]
      ? new Date(dateRange.value[0].setHours(0, 0, 0, 0))  // 转换为 ISO 格式字符串
      : null;

  const toDate = dateRange.value && dateRange.value[1]
      ? new Date(dateRange.value[1].setHours(23, 59, 59, 999))  // 转换为 ISO 格式字符串
      : null;


  console.log("加载下一页数据", subject.value, fromDate, toDate)
  getExamList(
      subject.value,
      fromDate,
      toDate,
      currentPage.value,
      pageSize.value
  )
      .then((res) => {
        if (res.code === CODE_SUCCESS) {
          lastPageInfo.value = res.data;
          if (append) {
            exams.value.push(...(lastPageInfo.value.list || []));
          } else {
            exams.value = lastPageInfo.value.list || [];
          }
        } else {
          ElMessage.error(`刷新失败:${res.msg}`);
        }
      })
      .catch((error) => {
        ElMessage.error(error.message);
      })
      .finally(() => {
        isLoading.value = false; // 加载完成
      });
};

// 初次加载数据
onMounted(() => {
  refreshData();
});

// 监听 subject 和 dateRange 的变化
watch(subject, () => {
  currentPage.value = 1;
  refreshData();
});

watch(dateRange, () => {
  currentPage.value = 1;
  refreshData();
}, {deep: true}); // 确保监听 dateRange 数组的内容变化
</script>
filterKeyword

<template>
  <div class="exam-list" v-infinite-scroll="loadNextPage" :infinite-scroll-disabled="isLoading"
       infinite-scroll-distance="50">
    <div v-for="exam in filteredExams" class="exam-item">
      <h2 class="item-title">{{ exam.title }}</h2>
      <h4 class="subject">{{ getSubjectTip(exam.subject) }}</h4>
      <p class="exam-date">{{ format(exam.date, "yyyy-MM-dd") }}</p>
      <el-divider class="divider"/>
      <ul v-if="exam.files && exam.files.length">
        <li v-for="url in exam.files" :key="url" class="file-item">
          <span class="file-name">{{ getFileName(url) }}</span>
          <a :href="url" target="_blank">
            <el-button type="primary" size="small" plain class="view-btn">查看并下载</el-button>
          </a>
        </li>
      </ul>
    </div>
    <div class="bottom-tip" v-if="isLoading || !lastPageInfo?.hasNextPage">
      <el-icon v-if="isLoading">
        <Loading/>
      </el-icon>
      <el-icon v-else>
        <CircleCheck/>
      </el-icon>
      {{ listBottomTip }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.exam-list {
  width: 90%;
  margin: auto;
  padding: 20px;
}

.exam-item {
  background: #3c0793;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px; // 每项之间的间隔
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3),
  -3px -3px 6px rgba(255, 255, 255, 0.2);
  color: #fff;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.item-title {
  margin: 0;
  color: #FAD961; // 标题颜色
  font-size: 1.5rem;
}

h4 {
  margin: 10px 0;
  color: #E3FDFD; // 科目颜色
  font-size: 1.1rem;
}

p {
  color: #D0F8F2; // 日期颜色
  font-size: 1rem;
}

ul {
  padding-left: 0;
  margin-top: 10px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  font-size: 1rem;
}

.file-name {
  flex: 1;
  color: #FFF;
  margin-right: 10px;
}

.download-btn {
  background-color: #E3FDFD;
  color: #3c0793;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-block;
}

.download-btn:hover {
  background-color: #FAD961;
  color: #fff;
}

.download-btn:active {
  background-color: #E3FDFD;
  color: #3c0793;
}

.bottom-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: #909399;
  padding: 10px 0;
}

.bottom-tip .el-icon {
  margin-right: 5px;
  color: #409eff;
}
</style>
