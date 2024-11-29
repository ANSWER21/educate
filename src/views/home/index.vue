<template>
  <div class="home-page">
    <div class="header">
      <div class="title-section">
        <h1 class="main-title">{{ appTitle }}</h1>
        <p class="sub-title"></p>
      </div>
      <div class="search-bar">
        <el-select
            v-model="college"
            filterable
            value-key="code"
            placeholder="请选择院校"
            style="width: 650px">
          <el-option
              v-for="college in colleges"
              :value="college"
              :label="`${college.name}(${college.code})`"
          />
        </el-select>
        <el-select
            v-model="subject"
            filterable
            value-key="code"
            placeholder="请选择科目"
            style="width: 480px"
        >
          <el-option
              v-for="subject in subjects"
              :value="subject"
              :label="`(${subject.code})${subject.name}`"
          />
        </el-select>
        <el-date-picker
            v-model="dateRange"
            type="monthrange"
            range-separator="到"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            class="date-picker"
            style="width: 600px"
        />
        <el-input
            v-model="filterKeyword"
            placeholder="请输入过滤关键词"
            class="search-box"
        />
        <el-dropdown>
          <el-avatar
              :src="accountStore.accountInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
              class="user-avatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push(ACCOUNT_URL)">个人中心</el-dropdown-item>
              <el-dropdown-item @click="router.push(CONSOLE_URL)" v-if="accountStore.accountInfo?.role == ROLE_ADMIN">
                控制台
              </el-dropdown-item>
              <el-dropdown-item @click="router.push(SUGGEST_URL)">意见反馈</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <exam-list :college="college" :subjects="subjects" :subject="subject" :dateRange="dateRange"
                 :filterKeyword="filterKeyword"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {ElAvatar, ElInput, ElMessage} from 'element-plus';
import ExamList from "@/views/home/components/examList.vue";
import {College, Subject} from "@/models/exam.ts";
import {ACCOUNT_URL, CONSOLE_URL, SUGGEST_URL} from "@/config";
import {useRouter} from "vue-router";
import {useAccountStore} from "@/stores/accountStore.ts";
import {ROLE_ADMIN} from "@/models/account.ts";
import {getAllColleges, getSubjectByCollege} from "@/api/models/exam.ts";
import {CODE_SUCCESS} from "@/models/resultJson.ts";

const router = useRouter();
const accountStore = useAccountStore();
const filterKeyword = ref('');

// 从环境变量中读取应用标题
const appTitle = computed(() => import.meta.env.VITE_GLOB_APP_TITLE);

const colleges = ref<College[]>([])
const college = ref<College | undefined>(undefined)
const subjects = ref<Subject[]>([])
const subject = ref<Subject | undefined>(undefined)
const dateRange = ref<Date[]>([])

onMounted(async () => {
  await getAllColleges().then(res => {
    if (res.code === CODE_SUCCESS) {
      colleges.value = res.data
    } else {
      ElMessage.error(res.msg)
    }
  }).catch((error) => {
    ElMessage.error(error)
  });
})

watch(college, (college) => {
  console.log('开始获取科目列表', college)
  const collegeCode = college?.code
  if (!collegeCode) {
    subjects.value = []
    subject.value = undefined
  } else {
    getSubjectByCollege(collegeCode)
        .then((res) => {
          if (res.code === CODE_SUCCESS) {
            console.log('获取科目列表成功', res)
            subjects.value = res.data
            // 只有在 subjects 不为空时才赋值
            subject.value = subjects.value.length > 0 ? subjects.value[0] : undefined
          } else {
            ElMessage.error(res.msg)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message || '请求失败')
        })
  }
})

</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

.home-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background: url("@/assets/images/main_bg_4.jpg");
  color: white;
  font-family: "Poppins", sans-serif;
  align-items: center;
  justify-content: center;

  .header {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 10px 20px;
    margin-top: 30px;
    background: rgba(60, 7, 147, 0.8);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25),
    -3px -3px 6px rgba(255, 255, 255, 0.15);
    border-radius: 10px;

    .title-section {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 20px;

      .main-title {
        font-size: 28px;
        margin: 0;
      }

      .sub-title {
        font-size: 18px;
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .search-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;

      .user-avatar {
        width: 40px; /* 确保头像的宽度为固定值 */
        height: 40px; /* 确保头像的高度为固定值 */
        border: 2px solid #ffffff; /* 添加白色边框以增强可见性 */
        overflow: hidden; /* 确保头像图片内容不超出圆形区域 */
      }
    }
  }

  .content {
    flex-grow: 1;
    width: 80%;
    display: flex;
    background: rgba(60, 7, 147, 0.8);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25),
    -3px -3px 6px rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 30px;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow: auto;

    .item-content {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .item-image {
        height: 160px;
      }

      .item-title {
        font-size: 20px;
        color: white;
      }
    }
  }
}

</style>
