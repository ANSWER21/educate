<template>
  <el-row class="upload-page" type="flex" justify="center" align="middle" style="height: 100%;">
    <el-col :span="12" style="text-align: center;">
      <h1>上传外刊</h1>
      <el-form :model="journal" label-width="120px" style="max-width: 600px; margin: 0 auto;">
        <el-form-item label="杂志名称:">
          <el-select
              v-model="journal.title"
              filterable
              value-key="code"
              placeholder="请选择标题"
              size="large"
          >
            <el-option
                v-for="title in titles"
                :key="title"
                :value="title"
                :label="title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标年月:">
          <el-date-picker
              v-model="journal.date"
              type="date"
              placeholder="选择日期和时间"
          />
        </el-form-item>
        <el-form-item label="杂志文件:" v-if="allowUpload">
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
      <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>


<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {UploadFilled} from '@element-plus/icons-vue';
import {ElMessage} from 'element-plus';
import {createJournal, getJournalTitles, uploadFile} from '@/api/models/journal.ts';
import {CODE_SUCCESS} from '@/models/resultJson.ts';
import {useAccountStore} from '@/stores/accountStore.ts';
import {Journal} from "@/models/journal.ts";
import {deleteFile} from "@/api/models/common.ts";

const accountStorage = useAccountStore();
let fileMap: Map<string, string> = new Map();

const allowUpload = ref(false);

// 上传组件
const upload = ref();

// 杂志信息
const journal = ref<Journal>({
  id: null,
  title: '',
  date: null,
  fileUrl: '',
  createId: accountStorage.accountInfo?.id ?? -1,
  translatedFileUrl: null
});

const titles = ref<string[]>([])

watch(() => journal.value.title, () => {
  switchUploadVisible()
});

watch(() => journal.value.date, () => {
  switchUploadVisible()
});


function switchUploadVisible() {
  allowUpload.value = journal.value.title !== '' && journal.value.date != null
}

onMounted(async () => {
  await getJournalTitles().then(res => {
    if (res.code === CODE_SUCCESS) {
      titles.value = res.data
    } else {
      ElMessage.error(res.msg)
    }
  }).catch((error) => {
    ElMessage.error(error)
  });
})

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
        journal.value.fileUrl = res.data;
        fileMap.set(params.file.name, res.data);
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
};

// 提交表单
const onSubmit = () => {
  if (!journal.value.title || !journal.value.fileUrl) {
    ElMessage.error("参数缺失")
    return
  }
  console.log(JSON.stringify(journal.value));
  createJournal(journal.value).then(res => {
    if (res.code == CODE_SUCCESS) {
      ElMessage.success('创建成功');
      // 清空文件列表
      upload.value.clearFiles();
      journal.value.fileUrl = ""; // 同步清空上传的文件数据
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