<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="https://img.lkxin.cn/api/v1/upload"
      :headers="headerObj"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '',
      headerObj: {
        Authorization: 'Bearer 40|oxTsvbPMVk2AcB0vqapIzcJWNxBvf2DqBtC2J6qM'
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw) // 本地图片 blob:...
      // console.log(res)
      this.imageUrl = res.data.links.url
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 146px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
