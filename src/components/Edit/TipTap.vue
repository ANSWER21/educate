<template>
  <el-container v-if="editor" class="container">
    <el-header class="editor-header">
      <div class="button-group">
        <el-dropdown @command="handleHeadingChange">
          <el-button type="primary">{{ getActiveHeadingLevel }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">
                <span class="heading1">标题1</span>
              </el-dropdown-item>
              <el-dropdown-item command="2">
                <span class="heading2">标题2</span>
              </el-dropdown-item>
              <el-dropdown-item command="3">
                <span class="heading3">标题3</span>
              </el-dropdown-item>
              <el-dropdown-item command="4">
                <span class="heading4">标题4</span>
              </el-dropdown-item>
              <el-dropdown-item command="5">
                <span class="heading5">标题5</span>
              </el-dropdown-item>
              <el-dropdown-item command="6">
                <span class="heading6">标题6</span>
              </el-dropdown-item>
              <el-dropdown-item command="paragraph">
                <span>正文</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <img class="fas fa-bold" src="@/assets/images/bold.svg" alt="粗体"/>
        </el-button>
        <el-button @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }">
          <img class="fas fa-italic" src="@/assets/images/italic.svg" alt="斜体"/>
        </el-button>
        <el-button @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }">
          <img class="fas fa-strikethrough" src="@/assets/images/strikethrough.svg" alt="删除线"/>
        </el-button>
        <el-button @click="editor.chain().focus().toggleHighlight().run()"
                :class="{ 'is-active': editor.isActive('highlight') }">
          <img class="fas fa-highlighter" src="@/assets/images/highlight.svg" alt="高亮"/>
        </el-button>
        <el-button @click="editor.chain().focus().setTextAlign('left').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
          <img class="fas fa-align-left" src="@/assets/images/text-align-left.svg" alt="左对齐"/>
        </el-button>
        <el-button @click="editor.chain().focus().setTextAlign('center').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
          <img class="fas fa-align-center" src="@/assets/images/text-align-center.svg" alt="居中对齐"/>
        </el-button>
        <el-button @click="editor.chain().focus().setTextAlign('right').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
          <img class="fas fa-align-right" src="@/assets/images/text-align-right.svg" alt="右对齐"/>
        </el-button>
        <el-button @click="editor.chain().focus().setTextAlign('justify').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
          <img class="fas fa-align-justify" src="@/assets/images/text-align-justify.svg" alt="两端对齐"/>
        </el-button>
      </div>
    </el-header>
    <el-main class="editor-main">
      <editor-content :editor="editor" class="editor-content"/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/vue-3'
import {computed, ref} from "vue";

const content = ref<string>('')

const editor = useEditor({
  content: content,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Highlight,
  ],
  editorProps: {
    attributes: {
      class: 'tiptap-editor'
    }
  }
})


const getActiveHeadingLevel = computed(() => {
  if (editor.value?.isActive('heading', {level: 1})) return '标题1';
  if (editor.value?.isActive('heading', {level: 2})) return '标题2';
  if (editor.value?.isActive('heading', {level: 3})) return '标题3';
  if (editor.value?.isActive('heading', {level: 4})) return '标题4';
  if (editor.value?.isActive('heading', {level: 5})) return '标题5';
  if (editor.value?.isActive('heading', {level: 6})) return '标题6';
  if (editor.value?.isActive('paragraph')) return '正文';
  return '';
});

const handleHeadingChange = (value: string) => {
  if (value === 'paragraph') {
    editor.value?.chain().focus().setParagraph().run();
  } else {
    editor.value?.chain().focus().toggleHeading({level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6}).run();
  }
}
</script>

<style lang="scss">
/* Basic editor styles */

.container {
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: white;

  .editor-header {
    position: fixed;
    top: 0;
    width: 100%;
    height: auto;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;


    .button-group {
      display: flex;
      justify-content: center;
      padding: 10px;

      button {
        margin: 0 5px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: #f9f9f9;
        cursor: pointer;
        color: black; /* 添加这一行 */

        &:hover {
          background-color: #e9e9e9;
        }

        &.is-active {
          background-color: #ddd;
        }
      }

    }
  }

  .editor-main {
    flex: 1;
    display: flex;
    flex-flow: column;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    background: #F3F4F6;

    .editor-content {
      margin: 10px 30px 20px;
      display: flex;
      flex-flow: column;
      flex: 1;
      padding: 0;

      .tiptap-editor {
        background: white;
        flex: 1;
        text-align: left;
        color: black; /* 设置文字默认颜色为黑色 */
        outline: none;
      }
    }
  }
}

/* 样式定义 */
.heading1 {
  font-size: 2em; /* H1 样式 */
  font-weight: bold;
}

.heading2 {
  font-size: 1.5em; /* H2 样式 */
  font-weight: bold;
}

.heading3 {
  font-size: 1.17em; /* H3 样式 */
  font-weight: bold;
}

.heading4 {
  font-size: 1em; /* H4 样式 */
  font-weight: bold;
}

.heading5 {
  font-size: 0.83em; /* H5 样式 */
  font-weight: bold;
}

.heading6 {
  font-size: 0.67em; /* H6 样式 */
  font-weight: bold;
}
</style>