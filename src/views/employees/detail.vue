<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting />
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <user-info />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入子组件
import JobInfo from './detail/job-info'
import LoginSetting from './detail/login-setting'
import UserInfo from './detail/user-info'

export default {
  // 挂载子组件
  components: {
    JobInfo,
    LoginSetting,
    UserInfo
  }
}
</script>
<style lang="scss" scoped>

</style>
