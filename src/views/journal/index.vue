<template>
  <div class="journal-page">
    <!-- 过滤部分 -->
    <div class="filter-section">
      <div class="filter-row">
        <h5>刊物名称:</h5>
        <el-scrollbar>
          <div class="scrollable-list">
            <el-button
                v-for="title in journalTitles"
                :key="title"
                :type="selectedTitle=== title? 'primary' : 'default'"
                @click="selectTitle(title)"
            >
              {{ title }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
      <div class="filter-row">
        <h5>发刊年份:</h5>
        <el-scrollbar>
          <div class="scrollable-list">
            <el-button
                v-for="year in journalYears"
                :key="year"
                :type="selectedYear === year ? 'primary' : 'default'"
                @click="selectYear(year)"
            >
              {{ year }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
      <div class="filter-row">
        <h5>发刊月份:</h5>
        <el-scrollbar>
          <div class="scrollable-list">
            <el-button
                v-for="month in journalMoths"
                :key="month"
                :type="selectedMonth === month ? 'primary' : 'default'"
                @click="selectMonth(month)"
            >
              {{ month }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 结果部分 -->
    <div class="result-section" v-infinite-scroll="loadNextPage" :infinite-scroll-disabled="isLoading"
         infinite-scroll-distance="50">
      <el-row :gutter="20">
        <el-col v-for="journal in journals" :key="journal.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="custom-card">
            <img :src="`${journal.fileUrl}?ci-process=doc-preview&page=1`" alt="journal cover">
            <div class="card-body">
              <div class="bottom">
                <el-tag type="primary">{{ format(journal.date, "yyyy-MM-dd") }}</el-tag>
              </div>
              <div class="filename-and-download">
                <span>{{ getFileNameWithOutExtension(journal.fileUrl) }}</span>
                <el-button type="text" @click="downloadFile(journal)">下载</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {Journal} from "@/models/journal.ts";
import {getJournalMonths, getJournals, getJournalTitles, getJournalYears} from "@/api/models/journal.ts";
import {CODE_SUCCESS, PageInfo} from "@/models/resultJson.ts";
import {ElMessage} from "element-plus";
import {format} from "date-fns";

const journalTitles = ref<string[]>([])
const journalYears = ref<number[]>([])
const journalMoths = ref<number[]>([])

const selectedTitle = ref<string>('')
const selectedYear = ref<number>()
const selectedMonth = ref<number>()

const journals = ref<Journal[]>([])
const currentPage = ref(1);
const pageSize = ref(12);
const lastPageInfo = ref<PageInfo<Journal> | null>(null);
const isLoading = ref(false); // 加载状态
const listBottomTip = ref<string>("")


const selectTitle = (title: string) => {
  selectedTitle.value = title
};

const selectYear = (year: number) => {
  selectedYear.value = year
};

const selectMonth = (month: number) => {
  selectedMonth.value = month
};

watch(selectedTitle, () => {
  getJournalYears(selectedTitle.value).then(res => {
    if (res.code === CODE_SUCCESS) {
      journalYears.value = res.data
      if (res.data.length > 0) {
        selectedYear.value = res.data[0]
      } else {
        journalMoths.value = []
      }
    } else {
      ElMessage.error(res.msg)
    }
  }).catch((error) => {
    ElMessage.error(error.message || '请求失败')
  })
})

watch([selectedTitle, selectedYear], () => {
  if (!selectedYear.value) return
  getJournalMonths(selectedTitle.value, selectedYear.value!!).then(res => {
    if (res.code === CODE_SUCCESS) {
      journalMoths.value = res.data
      if (res.data.length > 0) {
        selectedMonth.value = res.data[0]
      }
    } else {
      ElMessage.error(res.msg)
    }
  }).catch((error) => {
    ElMessage.error(error.message || '请求失败')
  })
})


watch([selectedTitle, selectedYear, selectedMonth], () => {
  refreshData();
})

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

const refreshData = (append = false) => {
  if (append && lastPageInfo.value?.hasNextPage == false) return;
  const year = selectedYear.value
  const month = selectedMonth.value
  console.log(year, month)
  if (!year || !month) return
  const fromDate = new Date(year, month - 1, 1); // 当月的第一天
  const toDate = new Date(year, month, 0); // 当月的最后一天
  getJournals(
      selectedTitle.value,
      fromDate,
      toDate,
      currentPage.value,
      pageSize.value)
      .then(res => {
        if (res.code === CODE_SUCCESS) {
          lastPageInfo.value = res.data;
          if (append) {
            journals.value.push(...(lastPageInfo.value.list || []));
          } else {
            journals.value = lastPageInfo.value.list || [];
          }
        } else {
          ElMessage.error(`刷新失败:${res.msg}`);
        }
      }).catch((error) => {
    ElMessage.error(error.message || '请求失败')
  })
};

onMounted(() => {
  getJournalTitles().then(res => {
    if (res.code === CODE_SUCCESS) {
      journalTitles.value = res.data
      if (res.data.length > 0) {
        selectedTitle.value = res.data[0]
      }
    } else {
      ElMessage.error(res.msg)
    }
  }).catch((error) => {
    ElMessage.error(error.message || '请求失败')
  })
})

// 下载文件方法
const downloadFile = (journal: Journal) => {
  const link = document.createElement('a');
  link.href = journal.fileUrl;
  link.download = getFileName(journal.fileUrl);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getFileName = (fileUrl: string): string => {
  try {
    const url = new URL(fileUrl);
    const encodedFileName = url.pathname.split('/').pop();
    if (!encodedFileName) return '';
    return decodeURIComponent(encodedFileName);
  } catch (error) {
    console.error("Error decoding file name:", error);
    return '';
  }
}

const getFileNameWithOutExtension = (fileUrl: string): string => {
  try {
    const url = new URL(fileUrl);
    const encodedFileName = url.pathname.split('/').pop();
    if (!encodedFileName) return '';
    const decodedFileName = decodeURIComponent(encodedFileName);
    // 移除文件后缀
    return decodedFileName.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error decoding file name:", error);
    return '';
  }
}


</script>

<style scoped lang="scss">
.journal-page {
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

  .filter-section {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 20px; // 增加内边距
    margin-top: 30px;
    background-color: #f9f9f9; // 较浅的灰色背景
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); // 更柔和的阴影
    margin-bottom: 20px; // 增加底部外边距
  }

  .result-section {
    width: 80%;
    padding: 20px;
    background-color: #f9f9f9; // 较浅的灰色背景
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); // 更柔和的阴影
    overflow-y: auto; // 确保 exam-list 可以滚动
    max-height: 100vh; // 设置最大高度，根据需要调整
    position: relative; // 添加相对定位以便调整滚动条的位置

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 12px; // 增加滚动条宽度
      margin-right: 10px; // 增加滚动条与内容的距离
    }

    &::-webkit-scrollbar-track {
      background: $scrollbar-background; // 滚动条轨道背景颜色
      border-radius: 10px; // 滚动条轨道圆角
    }

    &::-webkit-scrollbar-thumb {
      background: $scrollbar-thumb-background; // 滚动条滑块背景颜色
      border-radius: 10px; // 滚动条滑块圆角
      transition: background 0.3s ease; // 平滑过渡效果
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(160, 68, 255, 0.5); // 滚动条滑块悬停时的背景颜色
    }
  }

  .custom-card {
    margin-bottom: 20px;
    border-radius: 10px; // 圆角
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 阴影
    background-color: #fff; // 背景颜色
    transition: transform 0.2s; // 添加过渡效果

    &:hover {
      transform: translateY(-5px); // 悬停时轻微上移
    }

    img {
      width: 100%;
      height: auto;
      border-top-left-radius: 10px; // 图片顶部圆角
      border-top-right-radius: 10px; // 图片顶部圆角
    }

    .card-body {
      padding: 15px; // 内边距
    }

    .bottom {
      margin-top: 13px;
      line-height: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filename-and-download {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 14px;
        color: #333;
      }

      .el-button {
        font-size: 14px;
        color: #409EFF;
        text-decoration: underline;

        &:hover {
          color: #66b1ff;
        }
      }
    }
  }
}

.filter-row {
  display: flex;
  align-items: center; // 确保子元素在垂直方向上居中对齐

  h5 {
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}

.scrollable-list {
  display: flex;

  el-button {
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>


