<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPerFn(1, '0')">添加权限</el-button>
        </div>

        <el-table border :data="permissionList" row-key="id">
          <el-table-column
            label="名称"
            prop="name"
            align="left"
            header-align="center"
          />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPerFn(2, row.id)">添加</el-button>
              <el-button type="text" @click="editPerFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delPerFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加权限点弹窗 -->
      <per-dialog ref="PerDialog" :origin-list="originList" :is-edit="isEdit" @confirmPerEV="confirmPerFn" />
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api'
import { transTree, reslog } from '@/utils'
import PerDialog from './components/PerDialog.vue'

export default {
  components: {
    PerDialog
  },
  data() {
    return {
      permissionList: [], // 权限列表
      isEdit: false,
      originList: [] // 原始扁平权限列表
    }
  },
  created() {
    this.getPermissionListFn()
  },
  methods: {
    // 获取所有权限点
    async getPermissionListFn() {
      const res = await getPermissionList()
      this.originList = res.data
      this.permissionList = transTree(res.data, '0')
    },
    // 点击-添加
    addPerFn(type, pid) {
      this.isEdit = false
      this.$refs.PerDialog.showDialog = true
      this.$refs.PerDialog.title = '新增权限点'
      this.$refs.PerDialog.formData.type = type
      this.$refs.PerDialog.formData.pid = pid
    },
    // 点击-删除
    async delPerFn(id) {
      const res = await delPermission(id)
      await this.getPermissionListFn()
      reslog(res)
    },
    // 点击-编辑
    async editPerFn(id) {
      this.isEdit = true
      const res = await getPermissionDetail(id)
      this.$refs.PerDialog.showDialog = true
      this.$refs.PerDialog.title = '编辑权限点'
      this.$refs.PerDialog.formData = res.data
    },
    // 添加/编辑权限弹窗-确定
    async confirmPerFn(data) {
      if (this.isEdit) {
        // 编辑权限
        const res = await updatePermission(data)
        await this.getPermissionListFn()
        reslog(res)
      } else {
        // 添加权限
        const res = await addPermission(data)
        await this.getPermissionListFn()
        reslog(res)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  ::v-deep td.is-left {
    padding-left: 25px;
  }
}
</style>
