<template>
  <div class="nav">
    <el-row><el-button  
      icon="el-icon-menu" 
      class="menuBtn" 
      @click="menuBtn(isCollapse)"></el-button></el-row>
    <el-menu
      background-color="#F5F7FA"
      text-color="#333333"
      active-text-color="#336666"
      class="el-menu-vertical-demo"
      @open="handleOpen" 
      @close="handleClose" 
      :collapse="isCollapse"
      style="width:auto"
      :default-active="$route.path" 
      router>
      <el-menu-item index="/home/teaCourse" style="width:100%;">
          <i class="el-icon-document "></i>
          <span slot="title">报告册管理</span>
      </el-menu-item>
      <!-- <el-menu-item index="/home/teaCheck" style="width:100%;">
          <i class="el-icon-medal"></i>
          <span slot="title">批改</span>
      </el-menu-item> -->
      <el-menu-item index="/home/teaInfo" style="width:100%;">
        <i class="el-icon-user"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
      <el-menu-item index="/home/teaMessage" style="width:100%;">
        <i class="el-icon-chat-dot-round" ></i>
        <span slot="title">留言管理</span>
      </el-menu-item>
    </el-menu>
    <p></p>
  </div>
</template>
<script>
import Axios from 'axios';
import teaCourse from'./teaCourse.vue';
export default {
  components: {
  },
  props: 
    ["userole"],
  data() {
    return {
      items:[],
      isCollapse:true,
    };
  },
/*   created(){
    var api="http://localhost:8082/index.php"
    var params=new URLSearchParams()
    params.append('id',this.userid)
    params.append('role',this.userole)
    Axios.post(api,params).then(res=>{
      this.items=res.data;
      console.log(this.items);
    }).catch(err=>{
      console.log(res.err);
    })
  },
 */  methods:{
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
    font-size:40px;
     color: #909399;
  }
  .el-icon-document:before{
    font-size: 20px;
  }
  .el-icon-medal:before{
    font-size: 20px;
  }
  .el-icon-user:before{
    font-size: 20px;
  }
  .el-icon-chat-dot-round:before{
    font-size: 20px;
    }
  
.menuBtn:hover{
    .el-icon-menu:before{
      // color: #409EFF;
      font-size:45px;
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