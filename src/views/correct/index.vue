<template>
  <div class="container">
    <header class="header">
      <h1>英语作文批改系统</h1>
    </header>
    <main class="main">
      <div class="content">
        <div class="input-section">
          <el-card class="card">
            <h2>输入作文</h2>
            <el-input
                type="textarea"
                v-model="rawEssay"
                rows="10"
                placeholder="请在此处输入您的作文..."
            />
            <el-button type="primary" @click="startCorrection">开始批改</el-button>
          </el-card>
        </div>
        <transition name="fade">
          <div class="result-section" v-if="isCorrected">
            <el-card class="card">
              <h2>批改结果</h2>
              <div class="scrollable-content">
                <el-card class="inner-card">
                  <h3 class="card-title">评分概览</h3>
                  <div ref="scoreChart" style="height: 300px;"></div>
                </el-card>
                <el-card class="inner-card">
                  <h3 class="card-title">作文反馈</h3>
                  <p>{{ essayAdvice }}</p>
                </el-card>
                <el-card class="inner-card">
                  <h3 class="card-title">句子反馈</h3>
                  <el-table :data="sentFeedback">
                    <el-table-column prop="rawSent" label="原句"/>
                    <el-table-column prop="sentFeedback" label="反馈"/>
                    <el-table-column prop="correctedSent" label="修改建议"/>
                  </el-table>
                </el-card>
              </div>
            </el-card>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';

// 响应式数据
const rawEssay = ref("");
const essayAdvice = ref("");
const sentFeedback = ref<any[]>([]);
const majorScore = {
  grammarScore: 0.0,
  topicScore: 0.0,
  structureScore: 0.0,
};
const scoreChart = ref<HTMLDivElement | null>(null);
const isCorrected = ref(false);

// 模拟批改结果
const simulateCorrection = () => {
  // 模拟批改数据
  essayAdvice.value = "文章有效字数基本满足该考试字数要求...";
  sentFeedback.value = [
    {
      rawSent: "Emerging from the cartoon is an eye-catching scene...",
      sentFeedback: "疑似用词不当，建议将〖that〗修正为【where】",
      correctedSent: "Emerging from the cartoon is an eye-catching scene where..."
    },
    // 其他句子的反馈...
  ];
  majorScore.grammarScore = 10.0;
  majorScore.topicScore = 15.0;
  majorScore.structureScore = 12.0;
};

// 初始化图表
const initChart = () => {
  if (scoreChart.value) {
    const myChart = echarts.init(scoreChart.value);
    const option = {
      title: {
        text: '评分概览',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['语法分', '主题分', '结构分'],
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        name: '分数',
        type: 'bar',
        data: [
          majorScore.grammarScore,
          majorScore.topicScore,
          majorScore.structureScore,
        ],
      }],
    };
    myChart.setOption(option);
  }
};

// 开始批改
const startCorrection = () => {
  simulateCorrection();
  isCorrected.value = true; // 显示批改结果
};

// 在组件挂载后初始化图表
onMounted(() => {
  initChart();
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
  font-size: 24px; // 减小标题大小
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
  max-width: 1200px;
  display: flex;
  gap: 20px;
}

.input-section, .result-section {
  flex: 1;
}

.card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  height: 100%; // 确保高度一致
  display: flex;
  flex-direction: column;
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
  max-height: 600px; // 设置最大高度，防止内容过多时超出屏幕

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

.el-button--primary {
  background-color: $primary-color;
  border-color: $primary-color;
}

.el-button--primary:hover {
  background-color: darken($primary-color, 10%);
  border-color: darken($primary-color, 10%);
}
</style>
