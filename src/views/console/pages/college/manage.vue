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
            <template #default="collegeScope">
              <el-button size="small" @click="handleCollegeEdit(collegeScope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleCollegeDelete(collegeScope.row.code)">删除</el-button>
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
      <el-drawer
          v-model="isShow"
          direction="rtl"
          :title="college?.name ?? ''"
      >
        <div>
          <!-- 新建科目的表单 -->
          <el-form ref="subjectForm" :model="subjectForm">
            <el-form-item label="科目编号">
              <el-input v-model="subjectForm.code"></el-input>
            </el-form-item>
            <el-form-item label="科目名称">
              <el-input v-model="subjectForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSubject">添加</el-button>
            </el-form-item>
          </el-form>
          <!-- 科目列表表格 -->
          <el-table stripe border :data="subjects">
            <el-table-column property="code" label="编号"/>
            <el-table-column property="name" label="名称"/>
            <el-table-column label="操作">
              <template #default="subjectScope">
                <el-button size="small" type="danger" @click="handleSubjectDelete(subjectScope.row.code)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {ElMessage} from 'element-plus';
import {Search} from '@element-plus/icons-vue'
import {College, Subject} from '@/models/exam.ts';
import {getCollegesByPage, getSubjectByCollege,} from '@/api/models/exam.ts';
import {CODE_SUCCESS} from "@/models/resultJson.ts";

const collegeFilterKeyword = ref<string | null>()
const colleges = ref<College[]>([])

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const isShow = ref()
const college = ref<College>()
const subjects = ref<Subject[]>([]);

onMounted(() => {
  fetchColleges()
})

watch(college, () => {
  fetchSubject()
});

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

const fetchSubject = async () => {
  if (!college?.value?.code) {
    subjects.value = [];
  } else {
    await getSubjectByCollege(college.value.code)
        .then((res) => {
          if (res.code === CODE_SUCCESS) {
            subjects.value = res.data;
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch((error) => {
          ElMessage.error(error.message || '请求失败');
        });
  }
}

const handleSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize;
  fetchColleges();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchColleges();
};

const handleCollegeEdit = (row: College) => {
  // 这里可以添加编辑逻辑
  college.value = row;
  isShow.value = true;
};

const handleCollegeDelete = async (_: number) => {
  try {
    ElMessage.success('暂不允许删除院校');
    // await fetchColleges();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

const subjectForm = ref({
  code: '',
  name: ''
});

// 添加科目的方法
function addSubject() {
  // 这里可以添加前端验证
  if (!subjectForm.value.code || !subjectForm.value.name) {
    alert("请填写完整的科目信息");
    return;
  }
  // 假设添加科目到subjects数组
}

const handleSubjectDelete = async (_: number) => {
  try {
    ElMessage.success('暂不允许删除科目');
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