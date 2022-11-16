<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIdList">
      <el-checkbox v-for="item in rolesList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    rolesList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleIdList: [] // 选中的角色Id
    }
  },
  methods: {
    // 取消弹框
    cancelFn() {
      this.$emit('close')
    },
    confirmFn() {
      this.$emit('close')
      this.$emit('assignRolesEV', this.roleIdList)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
