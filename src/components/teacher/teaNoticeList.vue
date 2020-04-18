<template>
<div class="teaNoticeList">
  <el-collapse accordion>
  <el-collapse-item>
    <template slot="title">
        <i class="header-icon icon-systemNotice"></i> 系统通知
    </template>
    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
  </el-collapse-item>
  <el-collapse-item>
    <template slot="title">
      <i class="header-icon icon-userNotice2"></i>   
      <el-button type="text" size="mini" style="color:black" @click="myNotice()">我的通知</el-button>
      <el-badge is-dot class="item" :hidden='newInfo'></el-badge>
    </template>
    <span v-show="noticeIsNull" class="noticeNull">暂时还没有公告..<i class="el-icon-edit"></i></span>
    <div v-for="(item,index) in noticeList" :key="index" v-show="index<num" class="list">
        <span class="content">{{item.content}}</span>
        <div class="order1">
          <span class="className">{{item.className}}</span>
          <span class="time">{{item.notice_date}}</span>
          <el-button class="deleteBtn" type="text" size="mini" @click="deleteNotice(item.noticeId,item.content)">删除</el-button>
        </div>
    <el-divider style="font-size:8px;"></el-divider>
    </div>
    <el-button v-show="!noticeIsNull" @click="showMore" type="text" size="mini" style="float:right">{{txt}}</el-button>
  </el-collapse-item>
  </el-collapse>
</div>
</template>
<script>
import axios from 'axios';
export default {
props:{
  newInfo:{
    type:Boolean,
    defalut:true
  }
  },
data() {
    return {
        noticeList:'',
        isNotice:true,
        num:3,
        txt:"显示全部",
        isShow:true,
        noticeIsNull:false,
    };
  },
created(){
    this.dataList();
},
methods:{
  dataList(){
    var api="http://localhost:8082/teacher/noticeList.php";
    var params=new URLSearchParams();
    params.append('id',JSON.parse(sessionStorage.getItem('userid')));
    params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
    axios.post(api,params).then(res=>{
        this.noticeList=res.data['noticeList'];
    })
  },
  myNotice(){
     var newInfo=true //点击之后让小红点的hidden属性等于true
     this.$emit('listenToChildren',newInfo)
    //console.log("向父组件传值");
    //console.log(newInfo);
    //console.log("成了");
  }, 
  showMore(){
    this.isShow=!this.isShow;
    this.num=this.isShow?3:this.noticeList.length;
    this.txt = this.isShow?  '显示全部':'收起';
  },
  errorNotice() {
        this.$message.error('删除错误,请稍后再试');
      },
  deleteNotice(noticeId,content){
    var api="http://localhost:8082/teacher/deleteNotice.php";
    var params=new URLSearchParams();
    params.append('noticeId',noticeId);
    params.append('content',content);
    axios.post(api,params).then(res=>{
      if(res.data=="success"){
        this.dataList();
      }else{
        this.errorNotice();
      }
    })
  }
},
watch:{
  newInfo:function (newVal,oldVal){
    if(newVal==false){
      this.noticeIsNull=false;
      this.dataList();
    }
  },
  noticeList:function(newVal,oldVal){
     if(this.noticeList == undefined || this.noticeList.length <= 0 ){
       this.noticeIsNull=true;
     }
  }
},
}
</script>
<style lang="scss">
.noticeNull{
  display:flex;
  justify-content: center;
  font-size: 8px;
  color:#909399;
  line-height: 10px;
}
.list{
  .el-divider--horizontal{
    margin:5px 0px 25px 0px;//上右下左
  }
  .content{
    display:inline-block;
    padding-left:10px;
    width: 100%;   /*一定要设置宽度，或者元素内含的百分比*/
    overflow:hidden; /*溢出的部分隐藏*/
    white-space: nowrap; /*文本不换行*/
    text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/

  }
  .order1{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin: 5px 0px 0px;
    .deleteBtn{
        display:inline-block;
        //float:right;
        font-size:5px; 
        color:#606266
      }
    .className{
      display:inline-block;
      //padding-left:10px;
      font-size:5px;
      color:#909399;
      //padding-right:15px
    }
    .time{
      display:inline-block;
     // padding-right:10px;
      font-size:5px;
      color:#909399
    }
  }
  
}

.teaNoticeList{
    .el-collapse-item__arrow{
       margin: 0px;
       order: -1;
       margin-right: 10px;
   }
   .icon-userNotice2{
       font-size: 20px;
       margin-right: 10px;
   }
    .icon-systemNotice{
       font-size: 20px;
       margin-right: 10px;
   }
.el-badge__content.is-fixed{
  position: relative;
  //margin-top: 10px;
}
}
</style>