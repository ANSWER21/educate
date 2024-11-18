<template>
  <el-col class="upload-page" :span="24" style="text-align: center;" justify="center">
    <h1>上传真题</h1>
    <el-form :model="exam" label-width="auto">
      <el-form-item label="真题名称:">
        <el-autocomplete
            v-model="exam.title"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入真题名"
            @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="考试科目:">
        <el-select
            v-model="exam.subject"
            placeholder="请选择科目"
            size="large"
        >
          <el-option
              v-for="item in examSubjects"
              :key="item.value"
              :label="`(${item.value})${item.label}`"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标年月:">
        <el-date-picker
            v-model="exam.date"
            type="date"
            placeholder="选择日期和时间"
        />
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
    <el-row type="flex" justify="center" style="margin-bottom: 20px">
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
    </el-row>
  </el-col>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {UploadFilled} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {Exam, SUBJECTS} from "@/models/exam.ts";
import {Select} from "@/models/select.ts";
import {createExam, deleteFile, getExamTitles, uploadFile} from "@/api/models/exam.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {useAccountStore} from "@/stores/accountStore.ts";

const accountStorage = useAccountStore();
const upload = ref()

// 考试信息
const exam = ref<Exam>({
  id: null,
  title: '',
  subject: '',
  date: new Date(),
  createId: accountStorage.accountInfo?.id ?? -1,
  files: []
});

let fileMap: Map<string, string> = new Map();

const examSubjects = ref<Select<string, string>[]>(SUBJECTS)

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  getExamTitles(queryString).then(res => {
    cb(res.data);
  }).catch(error => {
    ElMessage.error(error.message)
  })
};

//名称选择处理
const handleSelect = (item: Record<string, any>) => {
  console.log(item);
};

//文件上传
const handleUpload = (params: any) => {
  const formData = new FormData();
  formData.append('file', params.file);
  const extension = params.file.name.substring(params.file.name.lastIndexOf('.') + 1)
  if (extension !== 'pdf') {
    return ElMessage.error('请上传pdf文件')
  }
  return new Promise((resolve, reject) => {
    uploadFile(formData).then(res => {
      if (res.code == CODE_SUCCESS) {
        console.log('上传文件名:' + params.file.name)
        fileMap.set(params.file.name, res.data)
        exam.value.files.push(res.data);
        resolve(res);
      } else {
        ElMessage.error(`上传失败:${res.msg}`)
        reject(res);
      }
    }).catch((error) => {
      ElMessage.error(error.message)
      reject(error)
    })
  })
}

const handleRemove = (file: any, _: any) => {
  deleteFile(fileMap.get(file.name) as string)
  exam.value.files = exam.value.files.filter(item => item !== fileMap.get(file.name))
  fileMap.delete(file.name)
  console.log(exam.value.files);
}

//提交表单
const onSubmit = () => {
  console.log(JSON.stringify(exam.value))
  createExam(exam.value).then(res => {
    if (res.code == CODE_SUCCESS) {
      ElMessage.success('创建成功')
      // 清空文件列表
      upload.value.clearFiles();
      exam.value.files = []; // 同步清空上传的文件数据
      fileMap.clear(); // 清空文件映射表
    } else {
      ElMessage.error(`创建失败:${res.msg}`)
    }
  }).catch(error => {
    ElMessage.error(error.message)
  })
}
</script>

<style scoped lang="scss">
.upload-page {
  margin-left: 30px;
  margin-right: 30px;
}
</style>