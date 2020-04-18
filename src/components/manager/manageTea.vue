<template>
<div class="manageTea">
  <el-table
    :data="(tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)).filter(data => !search || data.teaName.toLowerCase().includes(search.toLowerCase()))"
    style="width: 80%">
    <el-table-column
      label="教师Id"
      width="150px"
      prop="teachId">
    </el-table-column>
    <el-table-column
      label="教师姓名"
      prop="teaName"
      width="100px;">
      <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>授课班级：</p>
            <div v-for="(item,index) in scope.row.className" :key="index">
              <p>{{ item.className}}</p>
            </div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.teaName }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="专业"
      width="150px"
      prop="speciality">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template slot-scope="scope">
        <!-- <el-button
          size="mini"
          type="text"
          @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
        <el-button 
          size="mini"
          type="text"
          @click="handleDelete(scope.$index, scope.row)"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <span>确认删除此任课教师吗？</span>
    <p>注意：</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="deleteTea()">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog title="增加新教师" :visible.sync="dialogForm2Visible" width="300px;">
    <el-form :model="form2" :rules="rules" ref="form2">
      <el-form-item label="教师工号"  prop="teachId" label-width="100px">
        <el-input style="width:250px;" v-model="form2.teachId" autocomplete="off" :maxlength="10" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item label="教师姓名"  label-width="100px" prop="teaName">
        <el-input style="width:250px;" v-model="form2.teaName" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item label="教师密码" label-width="100px">
        <el-input style="width:250px;" v-model="form2.password" :type='isPass?"password":"text"'>
          <i slot="suffix" :class="isPass?'el-input__icon el-icon-turn-off':'el-input__icon el-icon-open'" @click="showPass" ></i>
        </el-input>
      </el-form-item>
      <el-form-item label="所属专业"  label-width="100px">
        <el-select style="width:250px;"  placeholder="请选择教师所属专业" v-model="speciality">
          <el-option v-for="(item,key) in form2.specialityList" 
            :key="key"
            :label="item.name"
            :value="item.speciality" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogForm2Visible = false">取 消</el-button>
      <el-button type="primary" @click="newTeacher1()">确 定</el-button>
    </div>
  </el-dialog>
  <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 15, 20]"
      :page-size="pagesize"
      :hide-on-single-page="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length">
  </el-pagination>
  <el-button type="text" size="mini" style="float:right" @click="newTeacher()">添加教师？</el-button>
</div>
</template>

<script>
import axios from 'axios';
export default {
data(){
    var validateTeachId = (rule, value, callback) => {
        var numReg = /^[0-9]*$/;
        var numRe = new RegExp(numReg);
        if (!value) {
            return callback(new Error('Id账号不能为空'));
        } else if (!numRe.test(value)) {
            return callback(new Error('Id账号不正确..'));
        } else {
            callback();
        }
    };
    return{
        tableData:[],
        pagesize:8,
        currentPage:1,
        search:'',  //搜素框输入的文字
        //visible:false,
        dialogVisible:false,  //删除任课教师时的弹窗
        teachId:'', //删除任课教师时需要传送的教师工号
        message:'', //用户操作之后的提示消息
        dialogForm2Visible:false, //增加新教师页面的弹窗
        form2:{  //增加教师页面数据
          teachId:'',
          teaName:'',
          password:'',
          specialityList:[],
        },
        speciality:'',
        icon:"el-input__icon el-icon-view", //新增教师页面的密码icon切换
        isPass:true,  //是否显示密码内容
        rules:{
          teachId:[
            //{ required: true, message: '请输入Id账号', trigger: 'blur' },
            {validator:validateTeachId,trigger:'blur'},
            { min: 10, max: 10, message: 'Id账号的长度为10', trigger: 'blur' }
          ],
        },
    }
},
created(){
  this.loadMessage();
},
methods:{
  loadMessage(){
    var api1="http://localhost:8082/manage/teaList.php";
    var params=new URLSearchParams();
    params.append('id',JSON.parse(sessionStorage.getItem('userid')));
    params.append('beginTime',JSON.parse(sessionStorage.getItem('schoolYear')));
    axios.post(api1,params).then(res=>{
      this.tableData=res.data['tableData'];
    })

  },
  showPass(){//点击图标是密码隐藏或显示
      this.isPass=!this.isPass;
  },
  /* handleEdit($index,row){
     var api="http://localhost:8082/manage/teaList.php";
     var params=new URLSearchParams();
  }, */
  handleDelete($index,row){
    this.dialogVisible=true;
    this.teachId=row.teachId;
    //console.log(this.teachId);
  },
  deleteTea(){
    var api="http://localhost:8082/manage/deleteTea.php";
    var params=new URLSearchParams();
    params.append('teachId',this.teachId);
    params.append('beginTime',JSON.parse(sessionStorage.getItem('schoolYear')));
    axios.post(api,params).then(res=>{
        if(res.data=="success"){
          this.message="任课教师删除成功";
          this.successInfo();
          this.dialogVisible=false;
          this.loadMessage();
        }else{
          this.message=res.data;
          this.errorInfo();
        }
    })
  },
  newTeacher(){
    this.dialogForm2Visible=true;
    var api="http://localhost:8082/manage/specialityList.php";
    var params=new URLSearchParams();
    params.append('id',JSON.parse(sessionStorage.getItem('userid')));
    axios.post(api,params).then(res=>{
      this.form2.specialityList=res.data['specialityList']
    })
  },
  newTeacher1(){
    var api="http://localhost:8082/manage/newTeacher.php";
    var params=new URLSearchParams();
    params.append('teachId',this.form2.teachId);
    params.append('teaName',this.form2.teaName);
    params.append('password',this.form2.password);
    params.append('speciality',this.speciality);
    axios.post(api,params).then(res=>{
      if(res.data=="success"){
        this.message="添加教师成功";
        this.successInfo();
        this.loadMessage();
        this.dialogForm2Visible=false;
      }else{
        this.message=res.data;
        this.errorInfo();
      }
    })
  },
  handleSizeChange(size) {
    this.pagesize=size;
        //console.log(`每页 ${val} 条`);
  },
  handleCurrentChange(currentPage) {
    this.currentPage=currentPage;
    //console.log(`当前页: ${val}`);
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
}
}
</script>

<style>
.manageTea{
  width: 80%;
  margin: 0 auto;
}
</style>