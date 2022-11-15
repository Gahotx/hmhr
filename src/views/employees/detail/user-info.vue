<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img ref="uploadImg" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserDetail, updateUserDetail } from '@/api'
import { reslog } from '@/utils'

export default {
  data() {
    return {
      hireType: [
        // 聘用形式枚举映射
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ],
      userInfo: {}
    }
  },
  created() {
    // 调用获取用户信息的 API
    this.loadUserInfoById()
  },
  methods: {
    async loadUserInfoById() {
      const res = await getUserDetail(this.$route.query.id)
      this.userInfo = res.data
      // this.userInfo.formOfEmployment = parseInt(this.$route.query.form)
      this.$set(this.userInfo, 'formOfEmployment', parseInt(this.$route.query.form))
      this.$refs.uploadImg.imageUrl = res.data.staffPhoto
    },
    // 更新员工个人信息
    async saveUser() {
      // 保存修改后的头像
      this.userInfo.staffPhoto = this.$refs.uploadImg.imageUrl
      const res = await updateUserDetail(this.userInfo)
      if (this.userInfo.id === this.$store.getters.id) {
        await this.$store.dispatch('user/getUserInfoActions')
      }
      reslog(res)
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
