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

          <!-- 更改邮箱 -->
          <el-form-item label="邮箱">
            <el-button type="primary" @click="openEmailDialog">更改邮箱</el-button>
          </el-form-item>

          <!-- 表单提交 -->
          <el-form-item>
            <el-button type="primary" @click="saveChanges">保存修改</el-button>
            <el-button @click="cancelChanges">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 邮箱修改弹窗 -->
    <el-dialog v-model="emailDialogVisible" title="更改邮箱" width="40%">
      <el-form :model="accountInfo" label-width="100px">
        <el-form-item label="新邮箱">
          <el-input v-model="accountInfo.email" placeholder="请输入新的邮箱"/>
        </el-form-item>
        <el-form-item label="验证码" v-if="isCodeSent">
          <el-input v-model="verificationCode" placeholder="请输入验证码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendVerificationCode" :disabled="isCodeSent">
            {{ isCodeSent ? `${countdown}s后重新发送` : '发送验证码' }}
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeEmailDialog">取消</el-button>
        <el-button type="primary" @click="saveEmailChanges">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import {getEmailVerificationCode, updateAccount, updateEmail, uploadAvatar} from "@/api/models/account.ts";
import {useAccountStore} from "@/stores/accountStore.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {Account} from "@/models/account.ts";
import {validateEmail} from "@/utils/verify.ts";

const accountStore = useAccountStore();
const accountInfo = ref<Account>(accountStore.accountInfo!!);
const verificationCode = ref('');
const isCodeSent = ref(false);
const countdown = ref(60);
const emailDialogVisible = ref(false);
let countdownInterval: NodeJS.Timeout | null = null;

// 打开和关闭邮箱弹窗
const openEmailDialog = () => (emailDialogVisible.value = true);
const closeEmailDialog = () => {
  emailDialogVisible.value = false;
  cancelChanges();
};

// 保存邮箱修改
const saveEmailChanges = () => {
  const email = accountInfo.value.email
  if (email == null) {
    ElMessage.error('请输入邮箱')
    return
  }
  updateEmail(
      accountInfo.value.id,
      email!!,
      verificationCode.value
  ).then(res => {
    if (res.code === CODE_SUCCESS) {
      ElMessage.success('邮箱修改成功');
      accountStore.setAccountInfo(accountInfo.value)
      closeEmailDialog();
    } else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    ElMessage.error(error.message);
  })
}

// 保存修改
const saveChanges = () => {
  updateAccount(accountInfo.value)
      .then(res => {
        if (res.code === CODE_SUCCESS) {
          accountStore.setAccountInfo(accountInfo.value)
          accountInfo.value = res.data
          ElMessage.success('信息已保存！')
        } else {
          ElMessage.error(res.msg);
        }
      })
      .catch((error) => {
        ElMessage.error(error.message);
      })
};

// 取消修改
const cancelChanges = () => {
  isCodeSent.value = false;
  countdown.value = 60;
  clearInterval(countdownInterval!);
};

// 发送验证码
const sendVerificationCode = () => {
  const email = accountInfo.value.email || ""
  if (validateEmail(email)) {
    getEmailVerificationCode(email).then(res => {
      if (res.data) {
        isCodeSent.value = true;
        ElMessage.success('验证码发送成功')
        countdownInterval = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            isCodeSent.value = false;
            countdown.value = 60;
            clearInterval(countdownInterval!);
          }
        }, 1000);
      } else {
        ElMessage.error('验证码发送失败')
      }
    });
  } else {
    ElMessage.error('请输入正确的邮箱')
  }
};

// 检查头像上传
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

// 上传头像
const handleUpload = (params: any) => {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('id', accountInfo.value.id.toString());
  console.log('cover upload');
  return new Promise((resolve, reject) => {
    uploadAvatar(formData)
        .then(res => {
          if (res.code === CODE_SUCCESS) {
            accountStore.setAccountInfo(res.data);
            accountInfo.value = res.data;
            resolve(res);
          } else {
            ElMessage.error(res.msg);
            reject(res);
          }
        })
        .catch(reason => {
          ElMessage.error(reason.toString());
          reject(reason);
        });
  });
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
  background: linear-gradient(to bottom, #f4f7ff, #dce6f9);

  h1 {
    color: #3c0793;
    margin-bottom: 20px;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  }

  .profile-container {
    display: flex;
    gap: 30px;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      .avatar {
        width: 120px;
        height: 120px;
        border: 3px solid #3c0793;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .el-button {
        background-color: #3c0793;
        border-color: #3c0793;
        color: #fff;

        &:hover {
          background-color: #541ab5;
          border-color: #541ab5;
        }
      }
    }

    .info-section {
      width: 400px;

      .form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px;
        background-color: #f9f9fc;
        border: 1px solid #d9d9e6;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

        .el-form-item__label {
          color: #3c0793;
        }

        .el-input {
          border-color: #3c0793;

          &:focus {
            border-color: #541ab5;
            box-shadow: 0 0 5px rgba(84, 26, 181, 0.3);
          }
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
          color: #fff;

          &:hover {
            background-color: #541ab5;
            border-color: #541ab5;
          }
        }
      }
    }
  }
}

/* 按钮动画 */
.el-button {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

/* 背景动画 */
.profile-page {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
