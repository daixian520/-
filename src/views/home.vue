<template>
  <div class="home">
    <top></top>
    <div class="main">
      <div v-if="this.userole=='学生'">
        <stuBar></stuBar>
      </div>
      <div v-if="this.userole=='管理员'">
        <managerBar></managerBar>
      </div>
      <div v-else>
        <teacBar></teacBar>
      </div>
      <div class="content" >
        <el-breadcrumb separator="/" >
          <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in breadList" :key="item.path">
              <span v-if="index==breadList.length-1" class="noCursor">{{item.meta.title}}</span>
              <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a>
            </el-breadcrumb-item>
          </transition-group>
        </el-breadcrumb>
          <router-view @newNotice='newNotice'></router-view>
      </div>
      <div class="contentLeft">
        <calendar></calendar>
        <stuNoticeList v-if="this.userole=='学生'" :newInfo='newInfo' v-on:listenToChildren="noticeRead"></stuNoticeList>
        <teaNoticeList v-if="this.userole=='教师'" :newInfo='newInfo' v-on:listenToChildren="noticeRead"></teaNoticeList>
        <manageNotice v-else></manageNotice>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import pathToRegexp from 'path-to-regexp';
import top from '../components/home/top.vue';
import report from '../components/teacher/report.vue';
import stuBar from '../components/student/stuBar.vue';
import teacBar from '../components/teacher/teacBar.vue';
import managerBar from '../components/manager/managerbar.vue';
import foot from '../components/home/footer.vue';
import calendar from '../components/home/calendar.vue';
import teaNoticeList from '../components/teacher/teaNoticeList.vue';
import stuNoticeList from '../components/student/stuNoticeList.vue';
import manageNotice from '../components/manager/manageNotice.vue';
export default {
  // inject:["reload"],
  name:'home',
  components: {
    top,
    stuBar,
    teacBar,
    managerBar,
    report,
    foot,
    calendar,
    teaNoticeList,
    stuNoticeList,
    manageNotice,
  },
  props: {},
  data() {
    return {
      userid:JSON.parse(sessionStorage.getItem('userid')),
      username:JSON.parse(sessionStorage.getItem('username')),
      userole:JSON.parse(sessionStorage.getItem('userole')),
      breadList:'',
      newInfo:'',
    };
  },
  mounted(){
    // this.reload();
  },
  created(){
    this.getBreadcrumb();
  },
  
  watch:{
    $route(){
      this.getBreadcrumb();
    }
  },
  methods: {
    getBreadcrumb(){
      let matched=this.$route.matched.filter(item=>item.meta && item.meta.title )
      this.breadList=matched
    },
    handleLink(item){
      const pathToRegexp = require('path-to-regexp');
      const {params}=this.$route
      const {path}=item
      var PathRule=pathToRegexp.compile(path)
      /* if(redirect){
        this.$router.push(redirect)
        return
      } */
      this.$router.push(PathRule(params))
    },
/* 接收teaCourse.vue 发布课程公告成功的传值 */
  newNotice(value){
    this.newInfo=false;//课程有新的通知,teaNoticeList的小红点不隐藏
    //console.log(this.newInfo);
  },
  /* 接收teaNoticeList传来的值 */
  noticeRead(newInfo){
    this.newInfo=newInfo;
    //console.log("子组件传来的值");
    //console.log(this.newInfo);
  }
},
    
}
</script>
<style  scoped lang="scss">
.home{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  .main{
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction:row;
    .content{
      width: 75%;
        .breakcrumb-enter-active,
        .breakcrumb-leave-active{
          transition: all .5s;
        }
        .breakcrumb-enter,
        .breakcrumb-leave-active{
          opacity: 0;
          transform:translateX(20px);
        }
        .breakcrumb-leave-active{
          position: absolute;
        }
        .el-breadcrumb{
          display: inline-block;
          font-size: 14px;
          line-height: 50px;
          .noCursor{
            color: #97a8be;
            cursor: text;
          }
        }
      /* display: flex;
      width: 100%;
      flex-direction: column; */
/*       .main-content{
        display: flex;
        height: 100%;
        overflow-y: scroll;
        flex-direction: row;
      }
 */    }
    .contentLeft{
      display: flex;
      flex-direction:column;
      width: 25%;
    }
  }
 /*  .footer{
    display: flex;
    height:50px;
    bottom: 0px;
    background-color: rgb(41,11,94);
  } */
}
</style>

