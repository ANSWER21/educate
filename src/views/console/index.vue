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

    <el-container style="height: calc(100% - 60px)">
      <el-aside width="200px">
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
            <el-menu-item index="ExamList" @click="goTo(EXAM_MANAGE_URL)">真题列表</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {Message, Setting} from '@element-plus/icons-vue'
import {useAccountStore} from '@/stores/accountStore.ts'
import {EXAM_MANAGE_URL, EXAM_UPLOAD_URL} from '@/config'
import {useRouter} from "vue-router";

const router = useRouter();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

function goTo(name: any) {
  router.push({name})
}
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
