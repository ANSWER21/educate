<template>
  <div class="pdf-viewer-container">
    <div class="toolbar">
      <button @click="translatePdf" title="翻译" v-if="false">
        <img src="@/assets/images/pdf_translate.svg" alt="PDF Translate"/>
      </button>
      <button @click="downloadPdf" title="下载">
        <img src="@/assets/images/pdf_download.svg" alt="PDF Download"/>
      </button>
    </div>
    <div class="on-demand-pdf-container" ref="pdfContainerRef">
      <!-- 使用 v-for 循环渲染每个 PDF 页面 -->
      <div v-for="pageIndex in renderedPages" :key="pageIndex" class="pdf-page">
        <canvas :id="`pdf-canvas-${pageIndex}`"></canvas>
        <div :id="`pdf-text-${pageIndex}`" class="textLayer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import * as pdfjsLib from "pdfjs-dist";
import {getDocument} from "pdfjs-dist";
import {useRoute} from "vue-router";
import {TextLayerBuilder} from "pdfjs-dist/web/pdf_viewer";

const route = useRoute();
const pdfUrl = route.query.pdfUrl as string;

// 定义 PDF 文档对象
let pdfDoc: any = null;
// 定义 PDF 总页数
const pdfPages = ref(0);
// 定义 PDF 缩放比例
const pdfScale = ref(1.5);
// 定义 PDF 容器引用
const pdfContainerRef = ref<HTMLElement | null>(null);
// 定义已加载的页面数量
const loadedNum = ref(0);

// 计算属性：预加载的页面数量
const preloadNum = computed(() => {
  return pdfPages.value - loadedNum.value > 3 ? 3 : pdfPages.value - loadedNum.value;
});

// 计算属性：是否所有页面都已加载完成
const loadFinished = computed(() => {
  const finished = loadedNum.value + preloadNum.value >= pdfPages.value;
  if (finished) {
    removeEventListeners(); // 如果加载完成，移除事件监听器
  }
  return finished;
});

// 计算属性：当前渲染的页面数量
const renderedPages = computed(() => {
  return loadFinished.value ? pdfPages.value : loadedNum.value + preloadNum.value;
});

// 定义 PDF 加载任务
let loadingTask: any;

// 渲染指定页面
const renderPage = (num: number) => {
  pdfDoc.getPage(num).then((page: any) => {
    const canvas: HTMLCanvasElement | null = document.getElementById(`pdf-canvas-${num}`) as HTMLCanvasElement;
    const textLayer: HTMLElement | null = document.getElementById(`pdf-text-${num}`);
    if (canvas && pdfContainerRef.value) {
      const context = canvas.getContext("2d");
      if (context) {
        const ratio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({scale: pdfScale.value});
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
        // 创建 TextLayerBuilder 实例
        const textLayerBuilder = new TextLayerBuilder({
          pdfPage: page,
        });
        if (textLayer) {
          textLayer.innerHTML = '';
          textLayer.style.setProperty('--scale-factor', viewport.scale.toString());
          textLayer.style.width = `${viewport.width}px`;
          textLayer.style.height = `${viewport.height}px`;
          textLayer.style.position = 'absolute';
          textLayer.style.zIndex = '1';
          textLayer.style.left = '50%'; // 设置左边距为 50%
          textLayer.style.transform = 'translateX(-50%)'; // 向左移动一半的宽度
          textLayer.appendChild(textLayerBuilder.div);
        }
        textLayerBuilder.render(viewport);
        if (num < loadedNum.value + preloadNum.value && !loadFinished.value) {
          setTimeout(() => renderPage(num + 1), 0); // 使用 setTimeout 避免递归过深
        } else {
          loadedNum.value += preloadNum.value;
        }
      }
    }
  });
};

// 初始化 PDF 加载器
const initPdfLoader = async (loadingTask: any) => {
  return new Promise((resolve, reject) => {
    loadingTask.promise
        .then((pdf: any) => {
          pdf.loadingParams.disableAutoFetch = true;
          pdf.loadingParams.disableStream = true;
          pdfDoc = pdf; // 保存加载的 PDF 文件流
          pdfPages.value = pdfDoc.numPages; // 获取 PDF 文件的总页数
          resolve(true);
        })
        .catch((error: any) => {
          console.warn(`[upthen] pdfReader loadFile error: ${error}`);
          reject(error);
        });
  });
};

// 计算距离底部的距离
const distanceToBottom = ref(0);
const calculateDistanceToBottom = () => {
  if (pdfContainerRef.value) {
    const containerHeight = pdfContainerRef.value.offsetHeight;
    const containerScrollHeight = pdfContainerRef.value.scrollHeight;
    distanceToBottom.value = containerScrollHeight - containerHeight - pdfContainerRef.value.scrollTop;
  }
};

// 懒加载 PDF 页面
const lazyRenderPdf = () => {
  calculateDistanceToBottom();
  if (distanceToBottom.value < 1000 && loadedNum.value < pdfPages.value) {
    renderPage(loadedNum.value + 1);
  }
};

// 移除事件监听器
const removeEventListeners = () => {
  pdfContainerRef.value?.removeEventListener("scroll", lazyRenderPdf);
};

// 组件挂载时初始化 PDF 加载器并添加滚动事件监听器
onMounted(async () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
  ).toString();
  loadingTask = getDocument(pdfUrl);
  if (await initPdfLoader(loadingTask)) {
    renderPage(1);
  }

  pdfContainerRef.value?.addEventListener("scroll", lazyRenderPdf);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  removeEventListeners();
});

// 翻译 PDF 的方法
const translatePdf = () => {
  console.log('开始翻译 PDF');
  // 这里添加翻译逻辑
};

// 下载 PDF 的方法
const downloadPdf = () => {
  if (pdfUrl) {
    // 创建一个链接并设置其 href 为 pdfUrl
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'downloaded.pdf'; // 设置下载文件名
    document.body.appendChild(a); // 将链接添加到文档
    a.click(); // 触发点击事件
    document.body.removeChild(a); // 下载后移除链接
  } else {
    console.warn('PDF URL is not available.');
  }
};
</script>


<style lang="scss" scoped>
@use 'pdfjs-dist/web/pdf_viewer.css';

.pdf-viewer-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  width: 100%;
  display: flex;
  justify-content: flex-end; // 将按钮居右对齐
  padding: 10px 0;
  background-color: #333; // 设置深色背景
  border-bottom: 1px solid #555;

  button {
    padding: 5px; // 减少按钮内边距
    cursor: pointer;
    border: none;
    background-color: transparent; // 去掉按钮背景色
    outline: none; // 去除选中效果
    margin-right: 10px; // 增加按钮之间的间距

    img {
      border: none;
      width: 25px;
      height: 25px;
    }

    &:hover {
      background-color: #555; // 设置悬停时的背景色
    }
  }
}

.on-demand-pdf-container {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  .pdf-page {
    position: relative; // 使得子元素可以绝对定位
    margin-bottom: 20px; // 可以根据需要调整页面间距
  }
}
</style>