<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="title" :visible.sync="showDialog" @closed="handleClose">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model.trim="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model.trim="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model.trim="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="confirmFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    originList: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 名称重复
    const validName = (rule, value, callback) => {
      if (this.isEdit) {
        // 不能和点击这项的同级重名 - 不包含自己(排除)
        const clickSelf = this.originList.find(item => item.id === this.formData.id)
        const pid = clickSelf.pid
        const filterNameList = this.originList.filter(item => item.pid === pid && item.id !== this.formData.id).map(item => item.name)
        filterNameList.includes(value) ? callback(new Error(`${value} 已存在`)) : callback()
      } else {
        // 要加的是子级的权限名字, 不能和子级们同名
        const filterNameList = this.originList.filter(item => item.pid === this.formData.pid).map(item => item.name)
        filterNameList.includes(value) ? callback(new Error(`${value} 已存在`)) : callback()
      }
    }
    // 标识重复
    const validCode = (rule, value, callback) => {
      if (this.isEdit) {
        // 是和所有人比, 唯一不能重复 - 不包含自己(排除)
        const fliterCodeList = this.originList.filter(item => item.id !== this.formData.id).map(item => item.code)
        fliterCodeList.includes(value) ? callback(new Error(`${value} 已存在`)) : callback()
      } else {
        // 是和所有人比, 唯一不能重复
        const codeList = this.originList.map(item => item.code)
        codeList.includes(value) ? callback(new Error(`${value} 已存在`)) : callback()
      }
    }
    return {
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型吖
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      },
      showDialog: false,
      title: '提示'
    }
  },
  methods: {
    confirmFn() {
      this.$refs.perForm.validate(valid => {
        if (valid) {
          this.$emit('confirmPerEV', this.formData)
          this.showDialog = false
        }
      })
    },
    cancelFn() {
      this.showDialog = false
    },
    handleClose() {
      this.formData = this.$options.data().formData
      this.$refs.perForm.resetFields()
    }
  }
}
</script>

<style>

</style>
