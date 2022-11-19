<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共{{ total }}条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button
            v-power="'import'"
            type="danger"
            size="small"
            @click="$router.push('/excel')"
          >导入excel</el-button>
          <el-button
            v-power="'export'"
            type="success"
            size="small"
            @click="exportList"
          >导出excel</el-button>
          <el-button
            type="primary"
            size="small"
            @click="addEmployee"
          >新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px">
        <el-table border :data="employeesList">
          <el-table-column label="序号" type="index" width="100" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="staffPhoto">
            <template #default="{ row }">
              <el-avatar :src="row.staffPhoto" :size="70">
                <img src="@/assets/common/bigUserHeader.png">
              </el-avatar>
            </template> </el-table-column>>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable
            :sort-method="sortWorkNum"
          />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatter"
          />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
            :formatter="timeFormat"
            sortable
          />
          <el-table-column label="操作" width="280">
            <template #default="{ row }">
              <el-button
                type="text"
                size="small"
                @click="
                  $router.push(
                    `/employees/detail?id=${row.id}&form=${row.formOfEmployment}`
                  )
                "
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                @click="setRole(row.id)"
              >分配角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmpFn(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>

      <!-- 新增员工弹窗 -->
      <el-dialog
        title="新增员工"
        :visible.sync="showDialog"
        @closed="handleClose"
      >
        <emp-form
          ref="empForm"
          :dialog-visible.sync="showDialog"
          :hire-type="hireType"
          :options="options"
          @addEmpEV="addEmpFn"
        />
      </el-dialog>

      <!-- 员工-分配角色权限 - 弹窗 -->
      <el-dialog
        title="分配角色"
        :visible.sync="showRoleDialog"
        @closed="roleClose"
      >
        <!-- 设置角色组件 -->
        <assign-role
          ref="AssignRole"
          :roles-list="rolesList"
          @assignRolesEV="assignRolesFn"
          @close="showRoleDialog = false"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getUser,
  getDepartment,
  addUser,
  delUser,
  getAllroles,
  getUserDetail,
  assignRoles
} from '@/api'
import dayjs from 'dayjs'
import EmpForm from './components/EmpForm'
import { transTree, reslog } from '@/utils'
import AssignRole from './components/AssignRole.vue'

export default {
  name: 'Employees',
  components: {
    EmpForm,
    AssignRole
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
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
      showDialog: false, // 添加员工组件的展示
      departArr: [], // 部门列表
      options: [], // 部门列表选项
      showRoleDialog: false, // 分配角色弹窗
      rolesList: [], // 角色列表
      userId: '' // 操作时的员工id
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取员工列表
    async getUserList() {
      const { data } = await getUser(this.query)
      this.employeesList = data.rows
      this.total = data.total
      document.querySelector('.page-tools').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 获取部门列表
    async getDepartmentArr() {
      const res = await getDepartment()
      this.departArr = res.data.depts.map((item) => ({
        label: item.name,
        value: item.name,
        id: item.id,
        pid: item.pid
      }))
      const opt1 = transTree(this.departArr, '', 'options')
      const opt2 = opt1.map((item) => ({
        options: item.options || []
      }))
      const opt3 = opt1
        .map((item) => [
          {
            label: item.label,
            value: item.value,
            id: item.id,
            pid: item.pid
          }
        ])
        .map((item) => ({
          options: item
        }))
      for (const k in opt2) {
        if (opt2[k].options.length > 0) {
          opt2[k].options.unshift(opt3[k].options[0])
        } else {
          opt2[k].options = opt3[k].options
        }
      }
      this.options = opt2
    },
    // 获取角色列表
    async getAllrolesFn() {
      const res = await getAllroles({
        page: 1,
        pagesize: 10
      })
      if (res.data.total > 10) {
        const res2 = await getAllroles({
          page: 1,
          pagesize: res.data.total
        })
        this.rolesList = res2.data.rows
      } else {
        this.rolesList = res.data.rows
      }
      // console.log(res)
    },
    formatter(row, column, cellValue, index) {
      return (
        this.hireType.find((item) => item.id === parseInt(cellValue))?.value ||
        '未知'
      )
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getUserList()
    },
    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getUserList()
    },
    // 工号排序
    sortWorkNum(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },
    // 格式化入职时间
    timeFormat(row, column, cellValue, index) {
      return dayjs(cellValue).format('YYYY-MM-DD')
    },
    // 点击-添加员工
    addEmployee() {
      this.showDialog = true
      this.getDepartmentArr()
    },
    // 添加员工弹窗关闭
    handleClose() {
      this.$refs.empForm.$refs.addForm.resetFields()
    },
    // 新增员工
    async addEmpFn(form) {
      const res = await addUser(form)
      this.getUserList()
      reslog(res)
    },
    // 删除员工
    async delEmpFn(id) {
      const res = await delUser(id)
      if (this.employeesList.length === 1 && this.query.page > 1) {
        this.query.page--
      }
      this.getUserList()
      reslog(res)
    },
    // 导出excel员工列表
    exportList() {
      import('@/vendor/Export2Excel').then(async(excel) => {
        // excel表示导入的模块对象
        const header = [
          '姓名',
          '手机号',
          '工号',
          '部门',
          '聘用形式',
          '入职日期',
          '转正日期'
        ]
        const mapObj = {
          姓名: 'username',
          手机号: 'mobile',
          工号: 'workNumber',
          部门: 'departmentName',
          聘用形式: 'formOfEmployment',
          入职日期: 'timeOfEntry',
          转正日期: 'correctionTime'
        }
        const res = await getUser({
          page: 1,
          size: this.total
        })
        const userArr = res.data.rows
        const data = userArr.map((enObj) => {
          const newArr = []
          header.forEach((zhKey) => {
            const enKey = mapObj[zhKey]
            const value = enObj[enKey]
            if (enKey === 'formOfEmployment') {
              const formObj = this.hireType.find(
                (item) => item.id === parseInt(value)
              )
              newArr.push(formObj ? formObj.value : '未知')
            } else if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
              newArr.push(dayjs(value).format('YYYY-MM-DD'))
            } else {
              newArr.push(value || '未知')
            }
          })
          return newArr
        })
        // console.log(data)
        excel.export_json_to_excel({
          header, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源表', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    // 点击-分配角色
    async setRole(id) {
      this.userId = id
      this.getAllrolesFn()
      const res = await getUserDetail(id)
      this.showRoleDialog = true
      this.$nextTick(() => {
        this.$refs.AssignRole.roleIdList = res.data.roleIds
      })
      // console.log(res)
    },
    // 分配角色弹窗关闭
    roleClose() {
      this.$refs.AssignRole.roleIdList = []
    },
    // 分配角色
    async assignRolesFn(list) {
      const res = await assignRoles({
        id: this.userId,
        roleIds: list
      })
      reslog(res)
    }
  }
}
</script>

<style lang="scss" scoped></style>
