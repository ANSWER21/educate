<template>
  <el-container style="height: 100%; display: flex; flex-direction: column;">
    <el-header style="display: flex; justify-content: space-between; align-items: center;">
      <p style="color: #1a1a1a">真题列表</p>
      <college-select v-model="college"
                      style="width: 300px"/>
      <subject-select v-model="subject"
                      :college="college"
                      :subjects="subjects"
                      @update:subjects="updateSubjects"
                      style="width: 300px"/>
    </el-header>
    <el-main class="main-content">
      <div class="table-container">
        <el-table
            :data="filteredExams"
            style="width: 100%;"
            border
        >
          <el-table-column type="expand">
            <template #default="examScope">
              <div class="expand">
                <el-table :data="examScope.row.files" border>
                  <el-table-column label="文件名">
                    <template #default="filesScope">
                      <a :href="filesScope.row" target="_blank">
                        {{ getFileName(filesScope.row) }}
                      </a>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template #default="filesScope">
                      <el-button type="danger" size="small" plain class="view-btn"
                                 @click="deleteFile(examScope.row,filesScope.row)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-upload
                    drag
                    action="#"
                    accept=".pdf"
                    :multiple="false"
                    :http-request="handleUpload"
                    :data="{examId:examScope.row.id}"
                    style="width: 100%"
                >
                  <el-icon class="el-icon--upload">
                    <upload-filled/>
                  </el-icon>
                  <div class="el-upload__text">
                    拖拽pdf文件到这里或者 <em>点击上传</em>
                  </div>
                </el-upload>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="真题名称">
            <template #default="examScope">
              <span class="exam-title">{{ examScope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="subject" label="考试科目">
            <template #default="examScope">
              {{ getSubjectTip(subjects, examScope.row.subject) }}
            </template>
          </el-table-column>
          <el-table-column label="目标年月">
            <template #default="examScope">
              {{ formatDate(examScope.row.date) }}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="examScope">
              <el-button size="small" @click="handleEdit(examScope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(examScope.row.id)">删除</el-button>
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
import {onMounted, ref, watch} from 'vue';
import {ElMessage} from 'element-plus';
import {College, Exam, getSubjectTip, Subject} from '@/models/exam.ts';
import {appendFileToExam, deleteExam, getExamList, removeFileFromExam, uploadFile} from '@/api/models/exam.ts';
import {getFileName} from "@/utils/path.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {UploadFilled} from "@element-plus/icons-vue";
import SubjectSelect from "@/components/Select/SubjectSelect.vue";
import CollegeSelect from "@/components/Select/CollegeSelect.vue";

const exams = ref<Exam[]>([]);
const filteredExams = ref<Exam[]>([]);
const college = ref<College | undefined>(undefined)
const subjects = ref<Subject[]>([])
const subject = ref<Subject | undefined>(undefined)
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const updateSubjects = (val: Subject[]) => {
  subjects.value = val
}

onMounted(() => {
  fetchExams();
});

const fetchExams = async () => {
  try {
    const collegeCode = college?.value?.code ?? null
    const subjectCode = subject?.value?.code ?? null
    if (collegeCode == null || subjectCode == null) {
      exams.value = [];
      total.value = 0;
      filteredExams.value = exams.value;
      return;
    }
    const response = await getExamList(collegeCode, subjectCode, null, null, currentPage.value, pageSize.value);
    exams.value = response.data.list;
    total.value = response.data.total;
    filteredExams.value = exams.value;
  } catch (error) {
    ElMessage.error("数据获取错误");
  }
};

watch(subject, () => {
  currentPage.value = 1;
  fetchExams();
})

const handleSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize;
  fetchExams();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchExams();
};

const handleEdit = (row: Exam) => {
  ElMessage.info(`编辑: ${row.title}`);
  // 这里可以添加编辑逻辑
};

// 删除考试
const handleDelete = async (examId: number) => {
  try {
    await deleteExam(examId);
    ElMessage.success('删除成功');
    await fetchExams();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

// 删除文件
const deleteFile = (exam: Exam, url: string) => {
  try {
    const examId = exam.id
    if (examId == null) {
      ElMessage.error('考试ID为空')
      return
    }
    removeFileFromExam(examId, url).then(res => {
      if (res.code == CODE_SUCCESS) {
        ElMessage.success('删除成功')
        fetchExams()
      } else {
        ElMessage.error('删除失败')
      }
    }).catch((error) => {
      ElMessage.error(error.message)
    })
  } catch (error) {
    ElMessage.error('删除失败');
  }
}

// 文件上传
const handleUpload = (options: any) => {
  const {file, data} = options; // 获取文件和额外参数
  const formData = new FormData();
  formData.append('file', file); // 将文件对象 append 到 FormData 中

  const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(); // 获取文件扩展名并转换为小写
  if (extension !== 'pdf') {
    ElMessage.error('请上传pdf文件');
    return; // 发现非 pdf 文件时中断上传
  }

  // 执行上传操作
  uploadFile(formData).then(res => {
    if (res.code === CODE_SUCCESS) {
      appendFileToExam(data.examId, res.data).then(res => {
        if (res.code === CODE_SUCCESS) {
          ElMessage.success('上传成功');
          fetchExams();
        } else {
          ElMessage.error(`上传失败:${res.msg}`);
        }
      }).catch(error => {
        ElMessage.error(error.message);
      }); // 上传成功后处理文件
    } else {
      ElMessage.error(`上传失败:${res.msg}`);
    }
  }).catch((error) => {
    ElMessage.error(error.message); // 处理错误
  });
};


const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
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

.exam-title {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

/* 新增样式 */
.el-table__expanded-cell {
  padding: 10px;
  background-color: #f9f9f9; /* 背景色 */
  max-height: 200px; /* 最大高度 */
  overflow-y: auto; /* 溢出时显示滚动条 */
}

/* 二级表格*/
.expand {
  padding-left: 20px;
  padding-right: 20px;
}

</style>