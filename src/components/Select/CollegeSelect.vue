<template>
  <el-select
      v-model="internalCollege"
      filterable
      remote
      value-key="code"
      placeholder="请选择院校"
      disabled
      v-load_more="loadMore"
      :filter-method="changeKeyword"
      :remote-method="getColleges">
    <el-option
        v-for="college in colleges"
        :key="college.code"
        :value="college"
        :label="`${college.name}(${college.code})`"
    />
  </el-select>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import type {College} from "@/models/exam.ts";
import {getCollegesByPage} from "@/api/models/exam.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";

const props = defineProps({
  modelValue: Object as () => College | undefined
});
const emits = defineEmits(['update:modelValue']);

const colleges = ref<College[]>([]);
const internalCollege = ref<College | undefined>(props.modelValue);

watch(internalCollege, (newValue) => {
  emits('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalCollege.value) {
    internalCollege.value = newValue;
  }
});


let pageNum = 1;
let pageSize = 20;
let hasNextPage = true;
let keyword: string | null = null;

const changeKeyword = (query: string | null) => {
  if (query != keyword) {
    colleges.value = [];
    pageNum = 1;
    hasNextPage = true;
  }
  keyword = query;
  getColleges();
}

const getColleges = () => {
  if (hasNextPage) {
    getCollegesByPage(keyword, pageNum, pageSize).then(res => {
      if (res.code === CODE_SUCCESS) {
        colleges.value.push(...(res.data.list || []));
        hasNextPage = res.data.hasNextPage;
        if (colleges.value.length > 0 && !internalCollege.value) {
          internalCollege.value = colleges.value[0]; // 设置默认选中为第一个选项
        }
      }
    })
  }
}

const loadMore = () => {
  pageNum++;
  getColleges();
}

onMounted(() => {
  getColleges();
});
</script>
