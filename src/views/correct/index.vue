<template>
  <div class="container">
    <header class="header">
      <h1>英语作文批改系统</h1>
    </header>
    <div class="main">
      <div class="content">
        <div class="input-section">
          <div class="card">
            <el-input
                style="flex:1"
                input-style="height:100%;"
                type="textarea"
                v-model="originalText"
                placeholder="请在此处输入您的作文..."
            />
            <div class="button-group">
              <!-- 下拉选框选择年级 -->
              <el-select v-model="grade" placeholder="请选择年级">
                <el-option
                    v-for="item in gradeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
              <!-- 上传照片按钮 -->
              <el-upload
                  action="#"
                  :http-request="imageCorrect"
                  :show-file-list="false"
                  accept="image/*"
                  style="display: flex; align-items: center;"
              >
                <img style="width: 30px;height: 30px" src="@/assets/images/img_upload.svg" alt=""/>
              </el-upload>
              <el-button type="primary" @click="textCorrect">开始批改</el-button>
            </div>
          </div>
        </div>
        <div class="result-section" v-if="rawEssay">
          <div class="card">
            <div class="scrollable-content">
              <el-card class="inner-card">
                <h3 class="card-title">评分概览</h3>
                <div class="progress-section">
                  <div class="total-score-section">
                    <span class="progress-label">总评分</span>
                    <div class="score-value-container">
                      <p class="score-value">{{ rawEssay.totalScore }}</p>
                      <p class="advice">{{ rawEssay.totalEvaluation ?? '' }}</p>
                    </div>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">语法分</span>
                    <el-progress :percentage="rawEssay.majorScore?.grammarScore ?? 0" :color="grammarColor"/>
                    <p class="advice">{{ rawEssay.majorScore?.grammarAdvice ?? '' }}</p>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">内容分</span>
                    <el-progress :percentage="rawEssay.majorScore?.topicScore ?? 0" :color="topicColor"/>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">词汇分</span>
                    <el-progress :percentage="rawEssay.majorScore?.wordScore ?? 0" :color="wordColor"/>
                    <p class="advice">{{ rawEssay.majorScore?.wordAdvice ?? '' }}</p>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">逻辑分</span>
                    <el-progress :percentage="rawEssay.majorScore?.structureScore ?? 0" :color="structureColor"/>
                    <p class="advice">{{ rawEssay.majorScore?.structureAdvice ?? '' }}</p>
                  </div>
                </div>
              </el-card>
              <el-card class="inner-card">
                <h3 class="card-title">作文反馈</h3>
                <p>{{ rawEssay.essayAdvice ?? '' }}</p>
              </el-card>
              <el-card class="inner-card">
                <h3 class="card-title">作文信息</h3>
                <p><strong>语言名称:</strong> {{ rawEssay.essayLangName }}</p>
                <p><strong>段落数量:</strong> {{ rawEssay.paraNum }}</p>
                <p><strong>句子数量:</strong> {{ rawEssay.sentNum }}</p>
                <p><strong>总单词数:</strong> {{ rawEssay.wordNum }}</p>
                <p><strong>批改模型:</strong> {{ rawEssay.writeModel }}</p>
              </el-card>
              <el-card class="inner-card" v-if="rawEssay.allFeatureScore">
                <h3 class="card-title">所有特征分数</h3>
                <div class="progress-section">
                  <div class="progress-item">
                    <span class="progress-label">神经分数</span>
                    <el-progress :percentage="rawEssay.allFeatureScore.neuralScore" :color="neuralColor"/>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">连贯性</span>
                    <el-progress :percentage="rawEssay.allFeatureScore.conjunction" :color="conjunctionColor"/>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">语法</span>
                    <el-progress :percentage="rawEssay.allFeatureScore.grammar" :color="grammarColor"/>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">拼写</span>
                    <el-progress :percentage="rawEssay.allFeatureScore.spelling" :color="spellingColor"/>
                  </div>
                  <!-- 其他特征分数可以继续添加 -->
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {imageCorrectWritingV3, textCorrectWritingV3} from "@/api/models/ai.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {ElMessage} from "element-plus";
import {Essay} from "@/models/essay.ts";

const originalText = ref('');

// 响应式数据
const rawEssay = ref<Essay | null>(null); // 初始值设为 null
const grade = ref<string>(''); // 初始化年级选择

// 年级选项
const gradeOptions = [
  {value: 'graduate', label: '考研', score: 20},
  {value: 'graduate_b1', label: '考研英语(一)大作文', score: 20},
  {value: 'graduate_a1', label: '考研英语(一)小作文', score: 10},
  {value: 'graduate_a2', label: '考研英语(二)小作文', score: 10},
  {value: 'graduate_b2', label: '考研英语(二)大作文', score: 15},
];

// 设置默认年级
grade.value = gradeOptions[0].value;

// 进度条颜色
const grammarColor = '#67C23A'; // 绿色
const topicColor = '#E6A23C';   // 橙色
const wordColor = '#409EFF';    // 蓝色
const structureColor = '#F56C6C'; // 红色
const neuralColor = '#FF9900'; // 橙色
const conjunctionColor = '#FFCC00'; // 浅橙色
const spellingColor = '#FF4D4D'; // 红色

// 图片批改
const imageCorrect = (options: any) => {
  const {file} = options; // 获取文件和额外参数
  const formData = new FormData();
  formData.append('file', file); // 将文件对象 append 到 FormData 中
  formData.append('grade', grade.value);
  // 执行上传操作
  imageCorrectWritingV3(formData).then(res => {
    if (res.code === CODE_SUCCESS) {
      rawEssay.value = res.data;
      originalText.value = res.data.rawEssay;
    } else {
      ElMessage.error(`上传失败:${res.msg}`);
    }
  }).catch((error) => {
    ElMessage.error(error.message); // 处理错误
  });
};

const textCorrect = () => {
  // 获取用户输入的作文文本
  const essayText = originalText.value;
  if (!essayText) {
    ElMessage.warning('请输入作文内容');
    return;
  }
  textCorrectWritingV3(essayText, grade.value).then(res => {
    if (res.code === CODE_SUCCESS) {
      rawEssay.value = res.data;
    } else {
      ElMessage.error(`批改失败:${res.msg}`);
    }
  }).catch(error => {
    ElMessage.error(error.message);
  });
};


// 在组件挂载后初始化数据
onMounted(() => {
  // 可以在这里初始化数据或进行其他操作
});
</script>


<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: white;
}

.header {
  background-color: $primary-color;
  color: white;
  text-align: center;
  padding: 20px 0;
}

.header h1 {
  font-size: 24px;
}

.main {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.content {
  width: 100%;
  height: 85vh;
  flex: 1;
  display: flex;
  gap: 20px;
}

.input-section, .result-section {
  flex: 1;
  display: flex;
  flex-direction: column;

  .card {
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.scrollable-input {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px; // 增加输入框和按钮之间的间距
}

.inner-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto; // 添加滚动效果
  max-height: 75vh;

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

.card-title {
  margin-bottom: 15px;
  color: $primary-color; // 关键字色为紫色
}

.button-group {
  display: flex;
  margin-top: 20px;
  align-items: center;
  gap: 10px; // 调整间距
}

.el-button--primary {
  background-color: $primary-color;
  border-color: $primary-color;
}

.el-button--primary:hover {
  background-color: rgba(106, 13, 173, 0.1);
  border-color: rgba(106, 13, 173, 0.1);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total-score-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f0f9eb; // 背景色
  padding: 10px;
  border: 1px solid #e1f3d8; // 边框
  border-radius: 5px;
}

.score-value-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.score-value {
  font-size: 36px; // 增大字体大小
  font-weight: bold;
  color: #333; // 字体颜色
  margin: 0;
}

.advice {
  font-size: 14px;
  color: #606266;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .el-progress {
    width: 100%;
  }
}

.progress-label {
  margin-bottom: 5px;
  font-weight: bold;
}

.advice {
  margin-top: 5px;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 10px;
  }

  .input-section, .result-section {
    flex: none;
    width: 100%;
  }
}
</style>


