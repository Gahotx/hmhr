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
          <el-button type="danger" size="small">导入excel</el-button>
          <el-button type="success" size="small">导出excel</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px">
        <el-table border :data="employeesList">
          <el-table-column label="序号" type="index" width="100" align="center" />
          <el-table-column label="姓名" prop="username" align="center" />
          <el-table-column label="头像" prop="staffPhoto" align="center">
            <template #default="{ row }">
              <el-avatar :src="row.staffPhoto" :size="70">
                <img src="@/assets/common/bigUserHeader.png">
              </el-avatar>
            </template> </el-table-column>>
          <el-table-column label="手机号" prop="mobile" align="center" />
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="sortWorkNum" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatter" align="center" />
          <el-table-column label="部门" prop="departmentName" align="center" />
          <el-table-column label="入职时间" prop="timeOfEntry" align="center" :formatter="timeFormat" />
          <el-table-column label="操作" width="280" align="center">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
    </div>
  </div>
</template>

<script>
import { getUser } from '@/api'
import dayjs from 'dayjs'

export default {
  name: 'Employees',
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      hireType: [ // 聘用形式枚举映射
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ]
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
    },
    formatter(row, column, cellValue, index) {
      return this.hireType.find(item => item.id === cellValue)?.value || '未知'
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
