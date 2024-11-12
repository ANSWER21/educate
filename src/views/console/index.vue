<template>
  <el-container style="height: 100%">
    <el-header id="header" class="layout-header">
      <div class="toolbar">
        <el-icon style="margin-right: 8px; margin-top: 1px">
          <setting/>
        </el-icon>
        <span class="title">后台管理系统</span>
      </div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting/>
            </el-icon>
            {{ useAccountStore().accountInfo?.nickName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container :style="{ height: scrollbarHeight + 'px' }">
      <el-aside>
        <el-scrollbar>
          <el-menu class="layout-menu"
                   :default-openeds="['1']"
                   default-active="DramaList"
                   active-text-color="#ffd04b"
                   background-color="#545c64"
                   text-color="#fff"
                   @open="handleOpen"
                   @close="handleClose">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                真题管理
              </template>
              <el-menu-item index="ExamUpload" @click="goTo(EXAM_UPLOAD_URL)">上传真题</el-menu-item>
              <el-menu-item index="ExamList" @click="goTo('DramaList')">真题列表</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {Message, Setting} from '@element-plus/icons-vue'
import router from "@/routers";
import {onBeforeUnmount, onMounted} from "@vue/runtime-core";
import {ref} from "vue";
import {useAccountStore} from "@/stores/accountStore.ts";
import {EXAM_UPLOAD_URL} from "@/config";

const scrollbarHeight = ref(0);

const calculateScrollbarHeight = () => {
  const headerHeight = document.querySelector('#header')?.clientHeight || 0;
  scrollbarHeight.value = window.innerHeight - headerHeight;
};

onMounted(() => {
  calculateScrollbarHeight();
  window.addEventListener('resize', calculateScrollbarHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateScrollbarHeight);
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

function goTo(name: any) {
  router.push({name});
}
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
