<template>
  <div class="profile-page">
    <h1>个人中心</h1>
    <div class="profile-container">
      <!-- 头像显示和上传 -->
      <div class="avatar-section">
        <el-avatar :src="accountInfo?.avatar" class="avatar"/>
        <el-upload
            action="#"
            accept="image/*"
            :multiple="false"
            :show-file-list="false"
            :http-request="handleUpload"
            :before-upload="beforeAvatarUpload"
        >
          <el-button size="small" type="primary">更换头像</el-button>
        </el-upload>
      </div>

      <!-- 信息修改区域 -->
      <div class="info-section">
        <el-form :model="accountInfo" label-width="100px" class="form">
          <!-- 昵称修改 -->
          <el-form-item label="昵称">
            <el-input v-model="accountInfo.nickName" placeholder="请输入新的昵称"/>
          </el-form-item>

          <!-- 邮箱修改 -->
          <el-form-item label="邮箱">
            <div class="email-update">
              <el-input v-model="accountInfo.email" placeholder="请输入新的邮箱" class="email-input"/>
              <el-button type="primary" @click="sendVerificationCode" :disabled="isCodeSent">
                {{ isCodeSent ? `${countdown}s后重新发送` : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 验证码输入 -->
          <el-form-item label="验证码" v-if="isCodeSent">
            <el-input v-model="verificationCode" placeholder="请输入验证码" class="code-input"/>
          </el-form-item>

          <!-- 保存、取消按钮 -->
          <el-form-item>
            <el-button type="primary" @click="saveChanges">保存修改</el-button>
            <el-button @click="cancelChanges">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import {uploadAvatar} from "@/api/models/account.ts"
import {useAccountStore} from "@/stores/accountStore.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {Account} from "@/models/account.ts";

const accountStore = useAccountStore();

const accountInfo = ref<Account>(accountStore.accountInfo!!);

const verificationCode = ref('');
const isCodeSent = ref(false);
const countdown = ref(60);
let countdownInterval: NodeJS.Timeout | null = null;

// 保存修改
const saveChanges = () => {
  ElMessage.success('修改已保存');
  // 调用API保存修改（模拟保存）
};

// 取消修改
const cancelChanges = () => {
  isCodeSent.value = false;
  countdown.value = 60;
  clearInterval(countdownInterval!);
};

// 头像上传前检查
const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJpgOrPng) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

//头像上传
const handleUpload = (params: any) => {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append("id", accountInfo.value.id.toString());
  console.log('cover upload');
  return new Promise((resolve, reject) => {
    uploadAvatar(formData)
        .then(res => {
          if (res.code === CODE_SUCCESS) {
            accountStore.setAccountInfo(res.data)
            accountInfo.value = res.data
            resolve(res);
          } else {
            ElMessage.error(res.msg);
            reject(res);
          }
        }).catch(reason => {
      ElMessage.error(reason.toString());
      reject(reason);
    })
  })
}

// 发送验证码
const sendVerificationCode = () => {
  isCodeSent.value = true;
  ElMessage.success('验证码已发送');
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      isCodeSent.value = false;
      countdown.value = 60;
      clearInterval(countdownInterval!);
    }
  }, 1000);
};
</script>

<style scoped lang="scss">
.profile-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #3c0793;
  background: url("@/assets/images/main_bg_4.jpg");

  h1 {
    color: #3c0793;
  }

  .profile-container {
    display: flex;
    gap: 30px;
    background-color: #f4f0fa;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      .avatar {
        width: 120px;
        height: 120px;
        border: 2px solid #3c0793;
        border-radius: 50%;
      }
    }

    .info-section {
      width: 400px;

      .form {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .el-form-item__label {
          color: #3c0793;
        }

        .el-input {
          border-color: #3c0793;
        }

        .email-update {
          display: flex;
          gap: 10px;

          .email-input {
            flex: 1;
          }
        }

        .code-input {
          width: 100%;
        }

        .el-button--primary {
          background-color: #3c0793;
          border-color: #3c0793;

          &:hover {
            background-color: #541ab5;
            border-color: #541ab5;
          }
        }
      }
    }
  }
}
</style>