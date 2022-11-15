<template>
  <div class="app-container">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import { formatExcelDate, reslog } from '@/utils'
import { batchUser } from '@/api'

export default {
  name: 'Excel',
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header

      // 将表格中的key映射成英文
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      const newRes = results.map(obj => {
        const newObj = {}
        // 1.收集当前对象中所有中文key
        const keyArr = Object.keys(obj)
        keyArr.forEach(zhKey => {
          // 2.寻找中文key对应的英文key
          const enKey = userRelations[zhKey]
          // 3.将英文key及其对应的val保存到新对象中
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            newObj[enKey] = formatExcelDate(obj[zhKey])
          } else {
            newObj[enKey] = obj[zhKey]
          }
        })
        // 4.返回映射完成后的新对象给map的新数组
        return newObj
      })
      // console.log(newRes)
      const res = await batchUser(newRes)
      reslog(res)
      this.$router.back()
    }
  }
}
</script>
