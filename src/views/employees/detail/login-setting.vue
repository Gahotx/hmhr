<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateInfo('userForm')">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetail, updateUserDetail } from '@/api'
import { reslog } from '@/utils'

export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailFn()
  },
  methods: {
    // 获取员工基本信息
    async getUserDetailFn() {
      const res = await getUserDetail(this.$route.query.id)
      // console.log(res)
      this.userInfo = res.data
    },
    // 更新员工基本信息
    updateInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await updateUserDetail(this.userInfo)
          if (this.userInfo.id === this.$store.getters.id) {
            await this.$store.dispatch('user/getUserInfoActions')
          }
          reslog(res)
          // console.log(res)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
