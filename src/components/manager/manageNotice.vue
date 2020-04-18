<template>
<div>
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
            <i class="header-icon icon-userNotice2"></i>   
            <el-button type="text" size="mini" style="color:black">我的通知</el-button>
        </template>
        <div>
            <span v-show="noticeIsNull" class="noticeNull" style="display:inline-block">添加系统公告吧...
                <el-button icon="el-icon-edit" type="text" style="display:inline-block" @click="newNotice()"></el-button>
            </span>
        </div>
        <div v-for="(item,index) in noticeList" :key="index" v-show="index<num" class="list">
            <span class="content">{{item.content}}</span>
            <div class="order1">
            <!-- <span class="className">{{item.className}}</span> -->
            <span class="time" style="padding-left:10px;">{{item.notice_date}}</span>
            <el-popover
                placement="top"
                width="160"
                v-model="visible">
                <p>确定将这条系统消息删除吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteNotice(item.noticeId,item.content)">确定</el-button>
                </div>
                <el-button slot="reference" class="deleteBtn" type="text" size="mini" >删除</el-button>
            </el-popover>
            </div>
            <el-divider style="font-size:8px;"></el-divider>
        </div>
        <el-button v-show="!noticeIsNull" @click="showMore" type="text" size="mini" style="float:right">{{txt}}</el-button>
     </el-collapse-item>
   </el-collapse>
   <el-dialog title="发布系统消息" :visible.sync="isDialog">
        <el-form :model="newNoticeForm">
            <el-form-item label="消息内容" label-width="80px">
            <el-input type="textarea" v-model="newNoticeForm.content" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isDialog = false">取 消</el-button>
            <el-button type="primary" @click="newNotice1()">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import axios from 'axios';
export default {
data(){
    return{
        noticeList:'',
        isNotice:true,
        num:3,
        txt:"显示全部",
        isShow:true,
        noticeIsNull:true,  //当前留言列表为空
        isDialog:false, //添加系统留言的页面是否显示
        newNoticeForm:{ //添加系统留言页面的表单
            content:'',
        },
        message:'', //消息提示内容
        visible:false,  //删除留言确认框
        content:''  //要删除系统消息的内容
    }
},
created(){
    this.loadNoticeList();
},
methods:{
    loadNoticeList(){
        var api="http://localhost:8082/manage/noticeList.php";
        var params=new URLSearchParams();
        params.append('id',JSON.parse(sessionStorage.getItem('userid')));
        axios.post(api,params).then(res=>{
            this.noticeList=res.data['noticeList'];
        })
    },
    newNotice(){    //添加新的系统公告
        this.isDialog=true; //显示添加系统公告的页面
    },
    newNotice1(){
        if(this.newNoticeForm.content==""){
            this.message="发布的消息为空";
            this.warningInfo();
        }else{
             var api="http://localhost:8082/manage/newNotice.php";
             var params=new URLSearchParams();
             params.append('id',JSON.parse(sessionStorage.getItem('userid')));
             params.append('content',this.newNoticeForm.content);
             axios.post(api,params).then(res=>{
                 if(res.data=="success"){
                     this.message="留言发布成功";
                     this.successInfo();
                     this.isDialog=false;   //新增系统留言表单关闭
                     this.loadNoticeList(); //留言发布成功后重新加载留言页面
                 }else{
                     this.message=res.data;
                     this.errorInfo();
                 }
             })
        }
    },
    deleteNotice(noticeId,content){
        //console.log("执行删除操作");
        this.content=content;
        //console.log(this.content);
        var api="http://localhost:8082/manage/deleteNotice.php";
        var params=new URLSearchParams();
        params.append('id',JSON.parse(sessionStorage.getItem('userid')));
        params.append('content',this.content);
        axios.post(api,params).then(res=>{
            if(res.data=="success"){
                this.message="系统消息删除成功";
                this.successInfo();
                this.visible=false;
                this.loadNoticeList();
            }else{
                this.message=res.data;
                this.errorInfo();
            }
        })
    },
    showMore(){
        if(this.noticeList.length<4){
            this.txt="已是全部";    //当前消息列表小于4条的时候，只显示”已是全部“
        }else{
            this.isShow=!this.isShow;
            this.num=this.isShow?3:this.noticeList.length;
            this.txt = this.isShow?  '显示全部':'收起';
        }
        
    },
    successInfo() {
      this.$message({
        message: this.message,
        type: 'success'
      });
    },
    warningInfo() {
            this.$message({
            message: this.message,
            type: 'warning'
            });
    },
    errorInfo() {
        this.$message.error(this.message);
    },
},
watch:{
    noticeList:function(val){
        if(!val){
           this.noticeIsNull=true;
           //console.log("执行空");
        }else{
            this.noticeIsNull=false;
            if(val.length<4){
                this.txt="已是全部";
            }
        }

  }
},
}
</script>

<style>

</style>