<template>
  <el-select
      v-model="internalSubject"
      filterable
      value-key="code"
      placeholder="请选择科目"
  >
    <el-option
        v-for="subject in internalSubjects"
        :key="subject.code"
        :value="subject"
        :label="`(${subject.code})${subject.name}`"
    />
  </el-select>
</template>

<script setup lang="ts">
import {ref, toRefs, watch} from "vue";
import {College, Subject} from "@/models/exam.ts";
import {getSubjectByCollege} from "@/api/models/exam.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";
import {ElMessage} from "element-plus";

// 明确定义 props 和它们的类型
const props = defineProps<{
  modelValue?: Subject;
  college?: College;
  subjects: Subject[];
}>();

const emits = defineEmits(['update:modelValue', 'update:subjects']);

const internalSubjects = ref<Subject[]>(props.subjects);
const internalSubject = ref<Subject | undefined>(props.modelValue);

// 监视 internalSubject 和 modelValue 的变化
watch(internalSubject, (newValue) => {
  emits('update:modelValue', newValue);
});

watch(internalSubjects, (newValue) => {
  console.log('subjects数据更新')
  emits('update:subjects', newValue)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalSubject.value) {
    internalSubject.value = newValue;
  }
});

// 使用 toRefs 创建对 college 的响应式引用
const {college} = toRefs(props);

// 监视 college 的变化
watch(college, (newCollege, _) => {
  console.log('开始获取科目列表', newCollege);
  if (!newCollege?.code) {
    internalSubjects.value = [];
    internalSubject.value = undefined;
    emits('update:modelValue', undefined);
  } else {
    getSubjectByCollege(newCollege.code)
        .then((res) => {
          if (res.code === CODE_SUCCESS) {
            internalSubjects.value = res.data;
            internalSubject.value = internalSubjects.value.length > 0 ? internalSubjects.value[0] : undefined;
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch((error) => {
          ElMessage.error(error.message || '请求失败');
        });
  }
});
</script>
