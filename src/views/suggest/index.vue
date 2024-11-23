<template>
  <div class="feedback-page">
    <h2>意见反馈</h2>
    <p>我们重视您的意见和建议 请填写下面的表单帮助我们改进</p>
    <el-form :model="suggest" label-width="80px" class="form">
      <!-- 反馈类型 -->
      <el-form-item label="反馈类型">
        <el-select v-model="suggest.type" placeholder="请选择反馈类型" class="type-select">
          <el-option label="功能建议" :value="TYPE_SUGGESTION"/>
          <el-option label="页面问题" :value="TYPE_BUG"/>
          <el-option label="其他反馈" :value="TYPE_OTHER"/>
        </el-select>
      </el-form-item>

      <!-- 反馈内容 -->
      <el-form-item label="反馈内容">
        <el-input
            type="textarea"
            v-model="suggest.content"
            placeholder="请详细描述您的问题或建议"
            rows="6"
            class="content-input"
        />
      </el-form-item>

      <!-- 联系方式 -->
      <el-form-item label="联系方式">
        <el-input v-model="suggest.contact" placeholder="请输入您的邮箱或电话" class="contact-input"/>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import {STATUS_UN_HANDLE, Suggest, TYPE_BUG, TYPE_OTHER, TYPE_SUGGESTION} from '@/models/suggest.ts';
import {createSuggest} from '@/api/models/suggest.ts';

// 定义表单数据
const suggest = ref<Suggest>({
  id: null,
  type: TYPE_SUGGESTION,
  content: '',
  contact: '',
  date: new Date(),
  status: STATUS_UN_HANDLE,
});

// 提交反馈
const submitFeedback = () => {
  if (!suggest.value.content) {
    ElMessage.warning('请填写反馈内容！');
    return;
  }
  if (!suggest.value.contact) {
    ElMessage.warning('请填写您的联系方式！');
    return;
  }
  createSuggest(suggest.value).then(res => {
    if (res.data) {
      ElMessage.success('反馈提交成功！');
      suggest.value.content = '';
      suggest.value.contact = '';
    } else {
      ElMessage.error('反馈提交失败，请重试！');
    }
  });
};
</script>

<style scoped lang="scss">
.feedback-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #3c0793;
  background: linear-gradient(to bottom, #f4f7ff, #dce6f9);
  animation: fadeIn 0.6s ease;

  h2 {
    color: #3c0793;
    margin-bottom: 20px;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  }

  p {
    color: #5a3d9a;
    margin-bottom: 20px;
    font-size: 16px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 60px 80px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .el-form-item__label {
      color: #3c0793;
    }

    .type-select, .content-input, .contact-input {
      .el-input__inner, .el-select__inner {
        border-color: #3c0793;
        background-color: #ffffff;
        transition: border-color 0.3s, box-shadow 0.3s;

        &:focus {
          border-color: #5a3d9a;
          box-shadow: 0 0 10px rgba(90, 61, 154, 0.5);
        }
      }
    }

    .content-input {
      .el-textarea__inner {
        border-color: #3c0793;
        background-color: #ffffff;
        transition: border-color 0.3s, box-shadow 0.3s;

        &:focus {
          border-color: #5a3d9a;
          box-shadow: 0 0 10px rgba(90, 61, 154, 0.5);
        }
      }
    }

    .el-button--primary {
      background-color: #3c0793;
      border-color: #3c0793;
      width: 100%;
      transition: background-color 0.3s, border-color 0.3s, transform 0.3s;

      &:hover {
        background-color: #5a3d9a;
        border-color: #5a3d9a;
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
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
