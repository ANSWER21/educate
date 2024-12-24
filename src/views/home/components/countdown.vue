<template>
  <div class="countdown">
    据考研还剩 {{ remainingDays }} 天
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";

const remainingDays = ref(0);

const calculateRemainingDays = () => {
  const now = new Date();
  const year = now.getFullYear();
  const examDate = new Date(`${year + 1}-12-21T00:00:00`);
  const distance = examDate.getTime() - now.getTime();

  if (distance > 0) {
    remainingDays.value = Math.floor(distance / (1000 * 60 * 60 * 24));
  }
};

onMounted(() => {
  calculateRemainingDays();
});
</script>

<style scoped lang="scss">
$countdown-text-color: #333333; // 更深的灰色，提高可读性

.countdown {
  font-size: 16px;
  color: $countdown-text-color; // 使用更深的灰色
  margin-top: 10px;
  font-weight: bold; // 增加字体粗细
}
</style>
