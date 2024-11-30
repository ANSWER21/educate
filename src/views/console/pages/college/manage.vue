<template>
  <el-container style="height: 100%; display: flex; flex-direction: column;">
    <el-header style="display: flex; justify-content: space-between; align-items: center;">
      <p style="color: #1a1a1a">院校列表</p>
      <el-input
          v-model="collegeFilterKeyword"
          style="max-width: 600px"
          placeholder="请输入院校名称"
      >
        <template #append>
          <el-button :icon="Search" :onclick="fetchColleges"/>
        </template>
      </el-input>
    </el-header>
    <el-main class="main-content">
      <div class="table-container">
        <el-table
            :data="colleges"
            style="width: 100%;"
            border
        >
          <el-table-column prop="code" label="院校代码"/>
          <el-table-column prop="name" label="院校名称"/>
          <el-table-column prop="department" label="管理部门"/>
          <el-table-column prop="location" label="所在地"/>
          <el-table-column prop="level" label="办学层次"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column label="操作">
            <template #default="examScope">
              <el-button size="small" @click="handleEdit(examScope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(examScope.row.code)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-main>

  </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {ElMessage} from 'element-plus';
import {Search} from '@element-plus/icons-vue'
import {College, Exam} from '@/models/exam.ts';
import {getCollegesByPage,} from '@/api/models/exam.ts';

const collegeFilterKeyword = ref<string | null>()
const colleges = ref<College[]>([])

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

onMounted(() => {
  fetchColleges()
})

const fetchColleges = async () => {
  try {
    const keyword = collegeFilterKeyword.value ?? null;
    const response = await getCollegesByPage(keyword, currentPage.value, pageSize.value);
    colleges.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    ElMessage.error("数据获取错误");
  }
};

const handleSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize;
  fetchColleges();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchColleges();
};

const handleEdit = (row: Exam) => {
  ElMessage.info(`编辑: ${row.title}`);
  // 这里可以添加编辑逻辑
};

// 删除考试
const handleDelete = async (_: number) => {
  try {
    ElMessage.success('暂不允许删除院校');
    // await fetchColleges();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

</script>

<style scoped lang="scss">
.el-header {
  background-color: #f0f2f5;
  padding: 10px 20px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.el-table {
  width: 100%;
  height: 100%;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
  position: sticky;
  bottom: 0;
  background-color: white;
  padding: 10px 20px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}


/* 新增样式 */
.el-table__expanded-cell {
  padding: 10px;
  background-color: #f9f9f9; /* 背景色 */
  max-height: 200px; /* 最大高度 */
  overflow-y: auto; /* 溢出时显示滚动条 */
}


</style>