<template>
  <div class="nav">
    <el-row><el-button  
      icon="el-icon-menu" 
      class="menuBtn" 
      @click="menuBtn(isCollapse)"></el-button></el-row>
    <el-menu
      background-color="#F5F7FA"
      text-color="#333333"
      active-text-color="#409EFF"
      class="el-menu-vertical-demo"
      @open="handleOpen" 
      @close="handleClose" 
      :collapse="isCollapse"
      style="width:auto"
      default-active="/home/manageStu" 
      router>
      <el-menu-item index="/home/manageClass" style="width:100%;">
        <i class="icon-class"></i>
        <span slot="title">班级信息修改</span>
      </el-menu-item>
      <el-menu-item index="/home/manageStu" style="width:100%;">
        <i class="icon-student"></i>
        <span slot="title">用户信息修改</span>
      </el-menu-item>
      <el-menu-item index="/home/manageCourse" style="width:100%;">
        <i class="icon-course"></i>
        <span slot="title">课程信息修改</span>
      </el-menu-item>
      <el-menu-item index="/home/manageTea" style="width:100%;">
        <i class="icon-teacher"></i>
        <span slot="title">教师信息修改</span>
      </el-menu-item>
      <!-- <el-menu-item index="/home/manageNotice" style="width:100%;">
        <i class="icon-zanwuxitonggonggao"></i>
        <span slot="title">发布系统通知</span>
      </el-menu-item> -->
      <el-menu-item index="/home/stuInfo" style="width:100%;">
        <i class="icon-personal"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  components: {
  },
  props: {},
  data() {
    return {
      // items:[],
      isCollapse:true,
    };
  },
  mounted(){
  },
  created(){
    /* var api="http://localhost:8082/index.php"
    var params=new URLSearchParams()
    params.append('id',this.userid)
    params.append('role',this.userole)
    Axios.post(api,params).then(res=>{
      this.items=res.data;
      // console.log(this.items);
    }).catch(err=>{
      console.log(res.err);
    }) */
  },
  methods:{
    menuBtn(isCollapse){
      this.isCollapse=!isCollapse;
    },
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  },
};
</script>
<style  scoped lang="scss">
  .nav{
  height: 100%;
  background-color:#F5F7FA;
  .menuBtn{
    background:none;
    border:none;
  }
}
</style>
<style lang="scss">
.nav{
 .el-icon-menu:before{
    font-size:25px;
     color: #909399;
  }
  .icon-course:before{
    font-size: 20px;
  }
  .icon-class:before{
    font-size: 20px;
  }
  .icon-personal:before{
    font-size: 20px;
  }
  .icon-teacher{
    font-size: 20px;
    }
  
.menuBtn:hover{
    .el-icon-menu:before{
      // color: #409EFF;
      font-size:30px;
    }
  }
.el-submenu__title{
  .el-submenu__icon-arrow{
    right: 0px;
    // color: whitesmoke;
  }
}
}
</style>