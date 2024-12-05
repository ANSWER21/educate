<template>
  <div class="countdown">
    据考研还剩 {{ remainingDays }} 天
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";

const remainingDays = ref(0);

const calculateRemainingDays = () => {
  const examDate = new Date('2024-12-21T00:00:00'); // 假设考研日期是2024年12月21日
  const now = new Date();
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
.countdown {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6); // 弱化显示
  margin-top: 10px;
}
</style>