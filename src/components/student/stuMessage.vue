<template>
<!-- 
    学生端回复教师的留言
    留言的删除功能
-->
<div class="stuMessage">
    <el-input
        prefix-icon="el-icon-edit"
        placeholder="留个言吧"
        clearable
        v-model="messContent">
        <el-button slot="append" icon="el-icon-position" @click="sendMess()"></el-button>
    </el-input>
    <el-divider  content-position="left">我的留言列表</el-divider>
    <div class="messageList">
       <el-card class="box-card">
            <div v-if=" this.messList == undefined || this.messList.length <= 0">暂时没有留言信息</div>
            <div v-else  class="text"><!-- :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" -->
                <div class="messageContent" v-for="(item,index) in messList.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="index">
                    <div class="cardHeader">
                        <span >第{{messList.length-index}}楼</span>
                        <el-button  type="text" icon="el-icon-delete" @click="deleteMess(item)"></el-button>
                    </div>
                    <span style="padding: 0px 20px;">{{item.messContent}}</span>
                    <span style="display:inline-block;float:right;color:#909399;font-size:8px;">{{item.sendTime}}</span>
                    <el-divider content-position="left">回复列表</el-divider>
                    <div class="replyList"  v-for="(list,index) in item.replyList" :key="index" v-show="index<item.num">
                        <div style="display:flex;width:100%">
                            <div style="display:flex;flex-direction:row;width:75%;">
                                <span style="display:flex;padding-right:5px;">{{list.senderName==userName?'我':list.senderName}}:</span>
                                <span style="display:flex;width:75%">{{list.replyContent}}</span>
                            </div>
                            <span style="font-size:8px;align-self:flex-end">{{list.replyTime}}</span>
                        </div>
                        
                        <div v-show="list.senderName==userName?false:true">
                            <el-button  type="text" style="display:block;padding: 10px 20px 5px;" @click="replyMess(list)"> <i class="el-icon-chat-dot-square"></i>回复</el-button>
                            <div v-show="list.isShow">
                                <el-input
                                    prefix-icon="el-icon-edit"
                                    placeholder="留言回复"
                                    v-model="replyContent">
                                    <el-button slot="append" icon="el-icon-position" @click="sendReplyMess(item,list)"></el-button>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <div class="showMore" v-show="!(item.replyList == undefined || item.replyList.length <= 2)">
                        <div  v-on:click="changeFoldState(item)">
                            <span>{{item.large?"显示全部":"收起"}}</span>
                        </div>
                    </div>
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
</div>
</template>

<script>
import axios from 'axios';
export default {
 data() {
      return {
          messList:'',
          messContent:'',
        //replyList:'',
        //num:2,
        //txt:"显示全部",
        userName:JSON.parse(sessionStorage.getItem('username')),
        messageContent:'',
        replyContent:'',    //学生端回复教师留言的内容
        isShow:false,   //留言回复框是否显示
        nullContent:'', // 留言列表是否为空
        show:true,
        //brandFold: true,
        currentPage: 1,
        pagesize:10,
        //successMess:'', 
        successMess:'', //操作成功时的消息提醒
        failMess:'',    //操作失败时候的消息提醒
        warningMess:'', // 操作不规范的时候的消息提醒

      };
    },
created(){
    this.loadMessage();
},
methods: {
    loadMessage(){
        var api="http://localhost:8082/student/stuMess.php";
        var params=new URLSearchParams();
        params.append('id',JSON.parse(sessionStorage.getItem('userid')));
        params.append('courseName',sessionStorage.getItem('courseName'));
        axios.post(api,params).then(res=>{
            this.messList=res.data['messList'].reverse();
        })
    },
    sendMess(){
        if(this.messContent==""){
            this.warningMess="留言内容不能为空";
            this.warningInfo();
        }else{
            var api="http://localhost:8082/student/sendMess.php";
            var params=new URLSearchParams();
            params.append('id',JSON.parse(sessionStorage.getItem('userid')));
            params.append('courseName',sessionStorage.getItem('courseName'));
            params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
            params.append('messContent',this.messContent);
            axios.post(api,params).then(res=>{
                if(res.data=="success"){
                    this.successMess="留言成功";
                    this.successInfo();
                    this.loadMessage();
                    this.messContent="";
                }else{
                    this.failMess="留言失败";
                    this.failInfo();
                }
            })
        }
        
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
    replyMess(list){
        list.isShow=!list.isShow;
    },
    sendReplyMess(item,list){ //  学生端对于教师回复留言的回复
        if(this.replyContent==''){
            this.warningMess="留言回复不能为空"
            this.warningInfo();
        }else{
            var api="http://localhost:8082/student/sendReplyMess.php";
            var params=new URLSearchParams();
            params.append('messId',item.messId);
            params.append('id',JSON.parse(sessionStorage.getItem('userid')));
            params.append('senderName',item.senderName);
            params.append('reciverName',item.reciverName);
            params.append('orderNum',item.orderNum),
            params.append('replyContent',this.replyContent);
            axios.post(api,params).then(res=>{
                if(res.data=="success"){
                    this.successMess="留言回复成功";
                    this.replyContent="";
                    list.isShow=false;
                    this.successInfo();
                    this.loadMessage();
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
                    this.loadMessage();
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

}
}
</script>

<style scoped lang="scss">
.stuMessage{
    width: 80%;
    height: 100%;
    margin: 0 auto;
    .el-divider--horizontal{
        margin:50px 0px 30px;
    }
    .messageList{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        .box-card {
            width: 90%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            
            .text {
                font-size: 14px;
                .messageContent{
                    padding: 0px 20px;
                    .cardHeader{
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        //padding:0;
                    }
                    .replyList{
                        width: 100%;
                        padding: 10px 30px;
                        //display: flex;
                        //justify-content: flex-start;
                        //align-items: center;
                    }
                    .showMore{
                        display: flex;
                        width: 100%;
                        padding-right:30px;
                        //width: 100%;
                        justify-content: flex-end;
                        color: #409EFF;
                    }
                    .el-divider{
                        margin:25px 0px 10px;
                        .el-divider__text{
                            font-size:8px; 
                            color: #C0C4CC; 
                        }
                        
                    }
                }
        }
        
        
        }
        
    }
}
</style>