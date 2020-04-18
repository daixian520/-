<template>
<!-- 写删除课程和增加课程功能 -->
<div class="manageCourse">
  <el-table
    :data="(tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)).filter(data => !search || data.courseName.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="课程Id"
      width="100px"
      prop="courseId">
    </el-table-column>
    <el-table-column
      label="课程名称"
      width="200px"
      prop="courseName">
    </el-table-column>
    <el-table-column
      label="任课教师"
      prop="teaName"
      width="100px;">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.teaName }}</p>
          <p>工号: {{ scope.row.teachId }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.teaName }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="课程专业"
      width="150px"
      prop="specialityName">
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
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="text" style="float:right" @click="newCoursebtn()">添加课程？</el-button>
  <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length">
  </el-pagination>
  <el-dialog title="任课教师修改" :visible.sync="dialogForm1Visible" width="300px;">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="教师工号"  prop="teachId" :label-width="labelWidth">
        <el-input style="width:250px;" v-model="form.teachId" autocomplete="off" :maxlength="10" show-word-limit ></el-input>
      </el-form-item>
    </el-form>
    <p>注意事项：</p>
    <p>1、更改课程对应的教师信息会造成当前课程对应的教师信息更改；</p>
    <p>2、如果当前学期有这门课程会造成正在进行中的课程对应教师的更改，同时，该课程的实验报告信息会丢失</p>
    <p>建议 </p>
    <p>不要在学期进行中进行课程信息的更改</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogForm1Visible = false">取 消</el-button>
      <el-button type="primary" @click="updateTea()">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="增加新课程" :visible.sync="dialogForm2Visible" width="300px;">
    <el-form :model="form2" :rules="rules" ref="form2">
      <el-form-item label="教师工号"  prop="teachId" :label-width="labelWidth">
        <el-input style="width:250px;" v-model="form2.teachId" autocomplete="off" :maxlength="10" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item label="课程Id"  :label-width="labelWidth" prop="courseId">
        <el-input style="width:250px;" v-model="form2.courseId" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="课程名称"  :label-width="labelWidth" prop="courseName">
        <el-input style="width:250px;" v-model="form2.courseName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="课程类型"  :label-width="labelWidth" >
          <el-select  placeholder="请选择课程类型" v-model="courseType">
            <el-option label="必修" value="必修"></el-option>
            <el-option label="选修" value="选修"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="开课专业"   :label-width="labelWidth">
        <el-select  placeholder="请选择开课专业" v-model="speciality">
          <el-option v-for="(item,key) in specialityList" 
            :key="key"
            :label="item.name"
            :value="item.speciality" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogForm2Visible = false">取 消</el-button>
      <el-button type="primary" @click="newCourse()">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import axios from 'axios';
export default {
data() {
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
      var validatecourseId = (rule, value, callback) => {
            var numReg = /^[0-9]*$/;
            var numRe = new RegExp(numReg);
            if (!value) {
                return callback(new Error('课程ID不能为空'));
            } else if (!numRe.test(value)) {
                return callback(new Error('课程ID为数字'));
            } else {
                callback();
            }
      };
      var validatecourseName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('课程名称不能为空'));
            } else {
                callback();
            }
      };
      return {
        tableData: [],
        specialityList:'',
        search: '',
        currentPage: 1,
        pagesize:8,
        form:{
          teachId: '',
          teaName: '',
        },
        rules:{
          teachId:[
            //{ required: true, message: '请输入Id账号', trigger: 'blur' },
            {validator:validateTeachId,trigger:'blur'},
            { min: 10, max: 10, message: 'Id账号的长度为10', trigger: 'blur' }
          ],
          courseId:[
             {validator:validatecourseId,trigger:'blur'},
          ],
          courseName:[
             {validator:validatecourseName,trigger:'blur'},
          ]
        },
        form2:{
          teachId:'',
          courseId:'',
          courseName:'',
        },
       /*  classList:'', //后台传来的classList */
        //classList1:'', //表单中展示的classList，因为班级的信息要随着speciality的改变而变化
        dialogForm1Visible: false,
        dialogForm2Visible: false,
        speciality:'',  //新增课程表单中选择的开课专业Id
       /*  classId:'', //新增课程表单中选择的开课班级Id */
        courseType:'',  //新增课程表单中选择的课程类型
        labelWidth: '100px',
        courseId:'',
        oldTeaId:'',
        message:''
      }
},
created(){
  this.loadMessage();
},
methods: {
  loadMessage(){
     var api="http://localhost:8082/manage/manageCourse.php";
     var params=new URLSearchParams();
     params.append('id',JSON.parse(sessionStorage.getItem('userid')));
     params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
     axios.post(api,params).then(res=>{
       this.tableData=res.data['tableData'];
       this.specialityList=res.data['specialityList'];
      /*  this.classList=res.data['classList']; */
     })
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
  handleEdit(index, row) {  //没写
    this.dialogForm1Visible=true;
    this.courseId=row.courseId;
    this.oldTeaId=row.teachId;
  },
  updateTea(){
    var that=this;
    var api="http://localhost:8082/manage/updateTea.php";
    var params=new URLSearchParams();
    params.append('teaId',that.form.teachId);
    //params.append('teaName',this.form.teaName);
    params.append('courseId',that.courseId);
    params.append('oldTeaId',that.oldTeaId);  //现在课程所对应的教师工号
    params.append('beginTime',JSON.parse(sessionStorage.getItem('schoolYear')));
    axios.post(api,params).then(res=>{
      switch (res.data){
        case 'noTeacher':
          that.message="教师工号有误";
          that.errorInfo();
          that.form.teachId="";
          break;
        case 'success':
          that.message="任课教师修改成功";
          that.successInfo();
          that.loadMessage();
          that.dialogForm1Visible=false;
          that.form.teachId="";
          break;
        case 'fail':
          that.message="任课教师修改失败";
          that.errorInfo();
          that.form.teachId="";
      }
      /* if(res.data=="noTeacher"){
        this.message="教师工号有误";
        this.errorInfo();
      }else{
        if
      } */
    })
  },
  handleDelete(index, row) {
    this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            var that=this;
            var api="http://localhost:8082/manage/deleteCourse.php";
            var params=new URLSearchParams();
            params.append('teaId',row.teachId);
            params.append('courseId',row.courseId);
            params.append('beginTime',JSON.parse(sessionStorage.getItem('schoolYear')));
            axios.post(api,params).then(res=>{
              if(res.data=="success"){
                that.message="课程信息已被删除";
                that.successInfo();
                that.loadMessage();
              }else{
                that.message="课程信息删除失败";
                that.errorInfo();
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });  
  },
  handleSizeChange(size) {
    this.pagesize=size;
        //console.log(`每页 ${val} 条`);
  },
  handleCurrentChange(currentPage) {
    this.currentPage=currentPage;
    //console.log(`当前页: ${val}`);
  },
  newCoursebtn(){
    this.dialogForm2Visible=true;
  },
  newCourse(){
    //var that=this;
    var api="http://localhost:8082/manage/newCourse.php";
    var params=new URLSearchParams();
    params.append('teachId',this.form2.teachId);
    params.append('courseId',this.form2.courseId);
    params.append('courseName',this.form2.courseName);
    params.append('speciality',this.speciality);
   /*  params.append('classId',this.classId); */
    params.append('courseType',this.courseType);
    axios.post(api,params).then(res=>{
      if(res.data=="success"){
        this.message="课程添加成功";
        this.successInfo();
        this.dialogForm2Visible=false;
      }else{
        this.message=res.data;
        this.errorInfo();
      }
    })
  }
},
watch:{
  /* speciality:function(val){
    var  api="http://localhost:8082/manage/classList.php";
    var params=new URLSearchParams();
    params.append('id',JSON.parse(sessionStorage.getItem('userid')));
    params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
    params.append('speciality',this.speciality);
    axios.post(api,params).then(res=>{
       this.classList=res.data['classList'];
     })
  } */
},
}
</script>

<style scoped lang="scss"> 
.manageCourse{
  //display: block;
  margin:0 auto;
  width: 80%;
  .el-dialog{
    width: 500px;
  }
}

</style>