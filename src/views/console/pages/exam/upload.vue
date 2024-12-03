<template>
  <el-row class="upload-page" type="flex" justify="center" align="middle" style="height: 100%;">
    <el-col :span="12" style="text-align: center;">
      <h1>上传真题</h1>
      <el-form :model="exam" label-width="120px" style="max-width: 600px; margin: 0 auto;">
        <el-form-item label="真题名称:">
          <el-autocomplete
              v-model="exam.title"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入真题名"
              @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="考试院校:">
          <el-select
              v-model="exam.college"
              filterable
              value-key="code"
              placeholder="请选择院校"
              size="large"
          >
            <el-option
                v-for="college in colleges"
                :key="college.code"
                :value="college.code"
                :label="`${college.name}(${college.code})`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试科目:">
          <el-select
              v-model="exam.subject"
              placeholder="请选择科目"
              value-key="code"
              size="large"
          >
            <el-option
                v-for="subject in subjects"
                :key="subject.code"
                :value="subject.code"
                :label="`(${subject.code})${subject.name}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标年月:">
          <el-date-picker
              v-model="exam.date"
              type="date"
              placeholder="选择日期和时间"
              :disabled="ignoreDate"
          />
          <el-switch v-model="ignoreDate" active-text="不区分年月" inactive-text="" @change="toggleIgnoreDate"
                     style="margin-left: 20px"/>
        </el-form-item>
        <el-form-item label="资料文件:">
          <el-upload
              ref="upload"
              drag
              action="#"
              accept=".pdf"
              :multiple="true"
              :http-request="handleUpload"
              :on-remove="handleRemove"
              :before-upload="handleBeforeUpload"
              style="width: 100%"
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              拖拽pdf文件到这里或者 <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>


<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {UploadFilled} from '@element-plus/icons-vue';
import {ElMessage} from 'element-plus';
import {College, Exam, Subject} from '@/models/exam.ts';
import {
  createExam,
  deleteFile,
  getAllColleges,
  getExamTitles,
  getSubjectByCollege,
  uploadFile
} from '@/api/models/exam.ts';
import {CODE_SUCCESS} from '@/models/resultJson.ts';
import {useAccountStore} from '@/stores/accountStore.ts';
import {UNLIMITED_DATE} from "@/utils/date.ts";
import {formatDate} from "date-fns";

const accountStorage = useAccountStore();

const ignoreDate = ref(false)

// 上传组件
const upload = ref();

// 考试信息
const exam = ref<Exam>({
  id: null,
  title: '',
  college: '',
  subject: '',
  date: new Date(),
  createId: accountStorage.accountInfo?.id ?? -1,
  files: []
});

const colleges = ref<College[]>([])
const subjects = ref<Subject[]>([])

let fileMap: Map<string, string> = new Map();

onMounted(async () => {
  await getAllColleges().then(res => {
    if (res.code === CODE_SUCCESS) {
      colleges.value = res.data
    } else {
      ElMessage.error(res.msg)
    }
  }).catch((error) => {
    ElMessage.error(error)
  });
})

// 动态生成默认真题名称
const defaultTitle = computed(() => {
  const college = colleges.value.find((item) => item.code === exam.value.college);
  const subject = subjects.value.find((item) => item.code === exam.value.subject);
  const year = ignoreDate.value ? "不限" : formatDate(exam.value.date, "yyyy");
  if (college && subject && year) {
    return `${year}${college.name}${subject.code}${subject.name}`;
  }
  return "";
});

// 监听动态更新标题
watch([() => exam.value.college, () => exam.value.subject, () => exam.value.date], () => {
  exam.value.title = defaultTitle.value;
});

const handleBeforeUpload = (file: File) => {
  const fileName = file.name;
  const potentialCode = fileName.substring(0, 3);
  if (potentialCode.match(/^\d{3}$/)) {
    const matchedSubject = subjects.value.find(subject => subject.code === potentialCode);
    if (matchedSubject) {
      exam.value.subject = matchedSubject.code; // 自动设置科目
      console.log(`科目自动设置为: ${matchedSubject.name} (${matchedSubject.code})`);
      ElMessage.success(`科目自动设置为: ${matchedSubject.name} (${matchedSubject.code})`);
    } else {
      ElMessage.warning('文件名前三位是数字，但没有找到匹配的科目代码');
    }
  } else {
    ElMessage.info('文件名前三位不是数字，未自动设置科目');
  }
  // 不阻止文件上传
  return true;
};


// 监听 college 字段的变化
watch(() => exam.value.college, (collegeCode) => {
  if (!collegeCode) {
    subjects.value = []
    exam.value.subject = ''
  } else {
    getSubjectByCollege(collegeCode)
        .then((res) => {
          if (res.code === CODE_SUCCESS) {
            console.log('获取科目列表成功', res)
            subjects.value = res.data
            // 只有在 subjects 不为空时才赋值
            exam.value.subject = subjects.value.length > 0 ? subjects.value[0].code : ''
          } else {
            ElMessage.error(res.msg)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message || '请求失败')
        })
  }
});

let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  getExamTitles(queryString).then(res => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      // 将字符串列表转化为符合 el-autocomplete 的格式
      const result = res.data.map((item: string) => ({
        value: item,  // 这里的 value 是 el-autocomplete 期望的字段
      }));
      cb(result);
    }, 3000 * Math.random())
  }).catch(error => {
    ElMessage.error(error.message);
  });
};

// 名称选择处理
const handleSelect = (item: Record<string, any>) => {
  console.log(item);
};

const toggleIgnoreDate = (value: boolean) => {
  ignoreDate.value = value;
  if (ignoreDate) {
    exam.value.date = UNLIMITED_DATE;
  }
};

// 文件上传
const handleUpload = (params: any) => {
  const formData = new FormData();
  formData.append('file', params.file);
  const extension = params.file.name.substring(params.file.name.lastIndexOf('.') + 1);
  if (extension !== 'pdf') {
    return ElMessage.error('请上传pdf文件');
  }
  return new Promise((resolve, reject) => {
    uploadFile(formData).then(res => {
      if (res.code == CODE_SUCCESS) {
        console.log('上传文件名:' + params.file.name);
        fileMap.set(params.file.name, res.data);
        exam.value.files.push(res.data);
        resolve(res);
      } else {
        ElMessage.error(`上传失败:${res.msg}`);
        reject(res);
      }
    }).catch((error) => {
      ElMessage.error(error.message);
      reject(error);
    });
  });
};

const handleRemove = (file: any, _: any) => {
  deleteFile(fileMap.get(file.name) as string);
  exam.value.files = exam.value.files.filter(item => item !== fileMap.get(file.name));
  fileMap.delete(file.name);
  console.log(exam.value.files);
};

// 提交表单
const onSubmit = () => {
  if (!exam.value.college || !exam.value.subject) {
    ElMessage.error("参数缺失")
    return
  }
  console.log(JSON.stringify(exam.value));
  createExam(exam.value).then(res => {
    if (res.code == CODE_SUCCESS) {
      ElMessage.success('创建成功');
      // 清空文件列表
      upload.value.clearFiles();
      exam.value.files = []; // 同步清空上传的文件数据
      fileMap.clear(); // 清空文件映射表
    } else {
      ElMessage.error(`创建失败:${res.msg}`);
    }
  }).catch(error => {
    ElMessage.error(error.message);
  });
};
</script>


<style scoped lang="scss">
.upload-page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .el-form {
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-button {
    margin-top: 20px;
  }
}
</style>