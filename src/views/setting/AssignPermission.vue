<template>
  <div>
    <el-tree
      ref="tree"
      :data="permissionList"
      :props="treeProps"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
      :default-checked-keys="permIds"
    />

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelFn">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="confirmFn"
        >确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignPermission',
  props: {
    permissionList: {
      type: Array,
      default: () => []
    },
    permIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    // 取消
    cancelFn() {
      this.$emit('input', false)
    },

    // 确定
    confirmFn() {
      this.$emit('assignPermEV', this.$refs.tree.getCheckedKeys())
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
