<template>
  <div class="home-page">
    <div class="header">
      <el-input
          v-model="searchQuery"
          placeholder="请输入搜索内容"
          class="search-box"
      >
        <template #prepend>
          <el-select class="search-select" v-model="select" placeholder="" style="width: 85px">
            <el-option label="真题" value="1"/>
            <el-option label="笔记" value="2"/>
          </el-select>
        </template>
      </el-input>
      <el-avatar src="https://freesvg.org/img/abstract-user-flat-1.png" class="user-avatar"></el-avatar>
    </div>
    <div class="content">
      <div class="masonry">
        <div v-for="item in items" :key="item.id" class="masonry-item">
          <div class="item-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :background="background"
          layout="prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';
import {ElAvatar, ElInput, ElPagination} from 'element-plus';

const select = ref('1')
const searchQuery = ref('');
const items = ref([
  {id: 1, title: 'Item 1', description: 'Description of item 1'},
  {id: 2, title: 'Item 2', description: 'Description of item 2'},
  // Add more items as needed...
]);
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true)
const total = ref(items.value.length);

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
};
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
