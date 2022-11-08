<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件(分为头部和身体) -->
      <el-card class="box-card">
        <!-- 头部 -->
        <div slot="header" class="clearfix">
          <!-- tab导航 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织导航" name="first" class="tab-pane">
              <!-- class="tab-pane"设置左右padding, 把内容往中间挤压 -->
              <!-- 使用 Layout 布局绘制头部区域
                最外层一行, 2列
                  el-row: type布局模式
                          justify两端对齐
                          align交叉轴排列方式(垂直方向居中)
               -->
              <el-row
                type="flex"
                justify="space-between"
                align="middle"
                class="department-header"
              >
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">未来科技</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown trigger="click">
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            @click.native="add()"
                          >添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <!-- 在这里设置, 树形控件 -->
              <el-tree
                class="departments-tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
              >
                <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染, scope.data 所以直接key解构赋值变量也是data(对应数据对象)-->
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>

                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown trigger="click">
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item
                                @click.native="add(data)"
                              >添加子部门</el-dropdown-item>
                              <el-dropdown-item
                                @click.native="edit(data)"
                              >编辑部门</el-dropdown-item>
                              <el-dropdown-item
                                @click.native="del(data)"
                              >删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>

      <!-- 添加子部门弹窗Dialog -->
      <depart-dialog
        ref="departDialog"
        :dialog-visible.sync="showDialog"
        :employees="userList"
        :valid-list="originList"
        :edit-tpye="isEdit"
        :click-id="clickDepartId"
        @editDepartEV="editDepartFn"
      />
    </div>
  </div>
</template>

<script>
import {
  getDepartment,
  getUserSimple,
  addDepartment,
  getDepartDetail,
  updateDepartDetail,
  delDepartment
} from '@/api'
import { transTree } from '@/utils'
import departDialog from './components/departDialog.vue'

export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
      treeData: [], // 层级部门列表，树形控件数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false, // 添加部门弹窗显隐
      userList: [], // 员工列表,
      originList: [], // 扁平部门列表，用于校验
      clickDepartId: '', // 操作时对应部门id
      isEdit: false // 判断是编辑还是添加部门
    }
  },
  created() {
    this.getDepartmentArr()
    this.getUserSimpleArr()
  },
  methods: {
    // 获取组织架构
    async getDepartmentArr() {
      const res = await getDepartment()
      this.treeData = transTree(res.data.depts, '')
      this.originList = res.data.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid
        }
      ))
      // console.log(res)
    },
    // 获取员工简单列表
    async getUserSimpleArr() {
      const res = await getUserSimple()
      this.userList = res.data
      // console.log(res)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 正文部分-右侧的添加子部门
    add(data) {
      this.showDialog = true
      this.isEdit = false
      if (data) {
        this.clickDepartId = data.id
      } else {
        this.clickDepartId = ''
      }
    },
    // 编辑子部分
    async edit(data) {
      this.showDialog = true
      this.isEdit = true
      const res = await getDepartDetail(data.id)
      this.$refs.departDialog.form = res.data
      this.clickDepartId = data.id
      // console.log(res)
    },
    // 删除部分
    del(data) {
      this.$confirm('您确定要删除该部门吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      })
        .then(async() => {
          await delDepartment(data.id)
          await this.getDepartmentArr()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 新增或编辑部门
    async editDepartFn(form) {
      if (this.isEdit) {
        // 编辑部门详情
        form.id = this.clickDepartId
        await updateDepartDetail(form)
        await this.getDepartmentArr()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        // 添加子部门
        form.pid = this.clickDepartId
        await addDepartment(form)
        await this.getDepartmentArr()
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

  .departments-tree {
    margin: 12px 0px;
  }

  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
