<template>
  <div class="messageList">
       <el-card class="box-card">
            <div v-if="this.messList == undefined || this.messList.length <= 0">暂时没有留言信息</div>
            <div v-else  class="text"><!-- :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" -->
                <div class="messageContent" v-for="(item,index) in messList.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="index">
                    <div class="cardHeader">
                        <span >第{{messList.length-index}}楼</span>
                        <el-button  type="text" icon="el-icon-delete" @click="deleteMess(item)"></el-button>
                    </div>
                    <span style="padding: 0px 20px;">{{item.messContent}}</span>
                    <span style="display:inline-block;float:right">{{item.sendTime}}</span>
                    <el-button  type="text" style="display:block;padding: 10px 20px 5px;" @click="replyMess(item)"> <i class="el-icon-chat-dot-square"></i>回复</el-button>
                    <div class="replyList"  v-for="(list,index) in item.replyList" :key="index" v-show="index<item.num">
                        <div style="display:flex;flex-direction:row;align-item:center;width:75%">
                            <span style="padding-right:5px;">{{list.senderName==userName?'我':list.senderName}}:</span>
                            <span style="display:inline-block;">{{list.replyContent}}</span>
                        </div>
                        <span style="font-size:8px;align-self:flex-end">{{list.replyTime}}</span>
                    </div>
                    <div class="showMore" v-show="!(item.replyList == undefined || item.replyList.length <= 2)">
                        <div  v-on:click="changeFoldState(item)">
                        <span>{{item.large?"显示全部":"收起"}}</span>
                    </div>
                    </div>
                    <div class="replyMess" v-show="item.isShow">
                        <el-input
                            prefix-icon="el-icon-edit"
                            placeholder="留言回复"
                            v-model="replyContent">
                            <el-button slot="append" icon="el-icon-position" @click="sendMess(item)"></el-button>
                        </el-input>
                    </div>
                    <el-divider content-position="right">{{item.className}}-{{item.senderName}}</el-divider>
                </div>
                 <!-- 当页面只有一页的时候这个分页功能隐藏 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :hide-on-single-page="true"
                    background
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="messList.length"></el-pagination>  
            </div>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
export default {
data(){
    return{
        messList:'',
        //replyList:'',
        //num:2,
        //txt:"显示全部",
        userName:JSON.parse(sessionStorage.getItem('username')),
        messageContent:'',
        replyContent:'',
        isShow:false,   //留言回复框是否显示
        //nullContent:'', // 留言列表是否为空
        show:true,
        brandFold: true,
        currentPage: 1,
        pagesize:10,
        successMess:'', //操作成功时的消息提醒
        failMess:'',    //操作失败时候的消息提醒
        warningMess:'', // 操作不规范的时候的消息提醒
    };
},
created(){
    //this.userName=sessionStorage.getItem('username');
    this.loadMess_message();
    
    //console.log(this.userName);
    //this.loadMess_replyMess();
},
mounted(){
    
},
methods:{
    loadMess_message(){ //页面加载的时候获取留言列表
         var api="http://localhost:8082/teacher/teaMess.php";
         var params=new URLSearchParams();
         params.append('id',JSON.parse(sessionStorage.getItem('userid')));
         params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
         axios.post(api,params).then(res=>{
             this.messList=res.data['messList'].reverse();
             //this.replyList=res.data['replyList'];
             //console.log(this.messList);
             if(this.messList == undefined || this.messList.length <= 0){
                 //this.nullContent=true; //当前没有教师留言
             }else{
                 //this.nullContent=false;
                 /* var api2="http://localhost:8082/teacher/teaMess.php";
                 axios.post() */
             }
         })

    },
    loadMess_replyMess(){
        console.log(this.messList);
        /* var api="http://localhost:8082/teacher/teaReplyMess.php";
        var params=new URLSearchParams();
        params.append('id',JSON.parse(sessionStorage.getItem('userid')));
        params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear'))); */
    },
    replyMess(item){    //点击回复按钮
        item.isShow = !item.isShow;
        //console.log(item.isShow)
    },
    sendMess(item){ // 回复消息
        if(this.replyContent==""){
            this.warningMess="留言回复不能为空";
            this.warningInfo();
        }else{
            var api="http://localhost:8082/teacher/teaReplyMess.php";
            var params=new URLSearchParams();
            params.append('id',JSON.parse(sessionStorage.getItem('userid')));
            params.append('username',JSON.parse(sessionStorage.getItem('username')));
            params.append('messId',item.messId);
            params.append('reciverName',item.senderName);
            params.append('courseName',item.courseName);
            params.append('orderNum',item.orderNum);
            params.append('replyContent',this.replyContent);
            axios.post(api,params).then(res=>{
                if(res.data=="success"){
                    this.successMess="留言回复成功";
                    this.successInfo();
                    this.loadMess_message();
                    this.replyContent="";
                    item.isShow=false;
                }else{
                    this.failMess="留言回复失败";
                    this.failInfo();
                }
            })
        }
         

    },
    deleteMess(item){   //教师端删除留言信息
        this.$confirm('此操作将删除这条留言, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            var api="http://localhost:8082/deleteMess.php";
            var params=new URLSearchParams();
            params.append('messId',item.messId);
            params.append('orderNum',item.orderNum);
            axios.post(api,params).then(res=>{
                if(res.data=="success"){
                    this.successMess="留言删除成功";
                    this.successInfo();
                    this.loadMess_message();
                }else{
                    this.failMess="留言删除失败";
                    this.failInfo();
                }
            })
           /*  this.$message({
                type: 'success',
                message: '删除成功!'
            }); */
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        
    },
    successInfo() {
            this.$message({
            message: this.successMess,
            type: 'success'
            });
        },
    failInfo() {
        this.$message.error(this.failMess);
    },
    warningInfo() {
        this.$message({
          message: this.warningMess,
          type: 'warning'
        });
    },
    changeFoldState(item) {
        item.large=!item.large;
        item.num=item.large?1:item.replyList.length;
    },
    handleSizeChange(size) {
        this.pagesize=size;
        //console.log(`每页 ${val} 条`);
      },
    handleCurrentChange(currentPage) {
        this.currentPage=currentPage;
        //console.log(`当前页: ${val}`);
    },
}
}
</script>

<style scoped lang="scss">
.messageList{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
        font-size: 14px;
        .messageContent{
            .cardHeader{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                //padding:0;
            }
            //padding: 0px 20px;
            .el-divider{
                margin:10px 0px;
            }
        }
        .replyList{
            padding: 10px 30px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
        }
        .showMore{
            display: flex;
            padding-right:40px;
            //width: 100%;
            justify-content: flex-end;
            color: #409EFF;
        }
        .replyMess{
            padding: 10px 20px;
        }
    }
    
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between
    }
}
</style>