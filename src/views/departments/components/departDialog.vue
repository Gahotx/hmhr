<template>
  <div>
    <el-dialog
      :title="editTpye ? '编辑部门' : '添加子部门'"
      :visible="dialogVisible"
      width="50%"
      @closed="handleClose"
      @update:visible="(val) => $emit('update:dialogVisible', val)"
    >
      <template>
        <div>
          <el-form
            ref="deptForm"
            :model="form"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model.trim="form.name"
                style="width: 80%"
                placeholder="2-10个字符"
              />
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
              <el-input
                v-model.trim="form.code"
                style="width: 80%"
                placeholder="1-20个字符"
              />
            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
              <el-select
                v-model.trim="form.manager"
                style="width: 80%"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in employees"
                  :key="item.id"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
              <el-input
                v-model="form.introduce"
                style="width: 80%"
                placeholder="1-300个字符"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmFn('deptForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    employees: {
      type: Array,
      default: () => []
    },
    validList: {
      type: Array,
      default: () => []
    },
    editTpye: {
      type: Boolean,
      default: false
    },
    clickId: {
      type: String,
      default: ''
    }
  },
  data() {
    // 编号重复
    const validCode = (rule, value, callback) => {
      if (this.editTpye) {
        const fliterCodeList = this.validList.filter(item => item.id !== this.clickId).map(item => item.code) // 排除本身的部门编号
        fliterCodeList.includes(value) ? callback(new Error(`编码 ${value} 已存在`)) : callback()
      } else {
        const codeList = this.validList.map(item => item.code) // 所有部门的编号
        codeList.includes(value) ? callback(new Error(`编码 ${value} 已存在`)) : callback()
      }
    }
    // 名称重复
    const validName = (rule, value, callback) => {
      if (this.editTpye) {
        const listSelf = this.validList.find(item => item.id === this.clickId) // 寻找当前编辑的部门
        const pId = listSelf.pid // 当前部门的pid
        const fliterNameList = this.validList.filter(item => item.pid === pId && item.id !== this.clickId).map(item => item.name) // 通过pid获得其他同级部门
        fliterNameList.includes(value) ? callback(new Error(`${value} 已存在`)) : callback()
      } else {
        const codeList = this.validList.filter(item => item.pid === this.clickId).map(item => item.name) // 所有子级部门的名称
        codeList.includes(value) ? callback(new Error(`${value} 已存在`)) : callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '部门编码要求1-20个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    confirmFn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('editDepartEV', this.form)
          this.$emit('update:dialogVisible', false)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 弹窗消失后重置表单数据
    handleClose() {
      this.$refs.deptForm.resetFields() // 移除校验结果
    }
  }
}
</script>

<style>
</style>
