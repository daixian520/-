<template>
<div class="manageClass" style="width:80%;margin:0 auto">
  <span>学年学期:</span> 
  <el-select v-model="selectValue"  placeholder="请选择专业" @change="classList()">
    <el-option
      v-for="item in specialityList"
      :key="item.title"
      :label="item.name"
      :value="item.speciality">
    </el-option>
  </el-select>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="班级名称"
      width="200px"
      prop="className">
    </el-table-column>
    <el-table-column
      label="班级人数"
      width="200px"
      prop="stuNum">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
        <el-button
          size="mini"
          type="text"
          @click="handleCourse(scope.$index, scope.row)">添加课程</el-button>
      </template>
    </el-table-column>
  </el-table>
 <el-dialog title="班级课程详情" :visible.sync="dialogTableVisible" width="500px">
  <el-table  
    :data="gridData"  
    border 
    row-key="id"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column property="beginTime" label="学期" width="150"></el-table-column>
    <el-table-column property="courseName" label="课程名称" width="200"></el-table-column>
    <el-table-column property="teaName" label="任课教师" width="200"></el-table-column>
  </el-table>
</el-dialog>
<el-dialog title="添加课程" :visible.sync="dialogFormVisible" width="500px">
  <el-form :model="form">
    <el-form-item label="课程Id" label-width="100px">
      <el-input v-model="form.courseId" autocomplete="off" style="width:300px;"></el-input>
    </el-form-item>
    <el-form-item label="课程名称" label-width="100px">
       <el-input v-model="form.courseName" autocomplete="off" style="width:300px;"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="newClassCourse()">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return{
            tableData:[], //页面表单数据
            specialityList:[],  //院系开设专业数据
            selectValue:'', //当前页面所选择的专业
            dialogTableVisible:false, //班级课程详情的显示
            gridData:[],  //班级课程详情的内容
            dialogFormVisible:false,  //添加课程的dialog
            form:{  //给班级添加的课程名称和ID
              courseId:'',
              courseName:'',
            },
            classId:'',
            className:'',
            stuNum:'',  //当给班级添加课程的时候，将这些信息传给后台
            message:'',
        }
    },
    created(){
      this.speciality();
    },
    methods:{
      speciality(){
        var api="http://localhost:8082/manage/specialityList.php";
        var params=new URLSearchParams();
        params.append('id',JSON.parse(sessionStorage.getItem('userid')));
        axios.post(api,params).then(res=>{
          this.specialityList=res.data['specialityList'];
          this.selectValue=this.specialityList['0'].speciality; //默认情况下多选框的值为数组中的第一个值
          this.classList(); 
          //console.log(this.specialityList['0'].speciality);
        })
      },
      classList(){
        var api="http://localhost:8082/manage/classList.php";
        var params=new URLSearchParams();
        params.append('id',JSON.parse(sessionStorage.getItem('userid')));
        params.append('speciality',this.selectValue);
        params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
        axios.post(api,params).then(res=>{
          this.tableData=res.data['classList'];
        })
      },
      handleDetail($index,row){
        this.dialogTableVisible=true;
        var api="http://localhost:8082/manage/courseList.php";
        var params=new URLSearchParams();
        params.append('classId',row.classId);
        axios.post(api,params).then(res=>{
          this.gridData=res.data['courseList'];
          //console.log(this.gridData);
        })
        //console.log("哈哈哈");
      },
      handleCourse($index,row){
        this.dialogFormVisible=true;
        this.classId=row.classId;
        this.className=row.className;
        this.stuNum=row.stuNum; //点击表格中的添加课程按钮的时候获取表格中的数据
        /* var api="http://localhost:8082/manage/courseList.php";
        var params=new URLSearchParams(); */
      },
      newClassCourse(){
        var api="http://localhost:8082/manage/classCourse.php";
        var params=new URLSearchParams();
        params.append('classId',this.classId);
        params.append('className',this.className);
        params.append('stuNum',this.stuNum);    //以后数据库这个地方可能会改
        params.append('courseName',this.form.courseName);
        params.append('courseId',this.form.courseId);
        params.append('beginTime',JSON.parse(sessionStorage.getItem('schoolYear')));
        axios.post(api,params).then(res=>{
          if(res.data=="success"){
            this.message="课程添加成功";
            this.successInfo();
          }else{
            this.message=res.data;
            this.errorInfo();
          }
        })
      },
      objectSpanMethod(){},
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
      
}
</script>

<style scoped lang="scss">
.manageClass{
  //display: block;
  width: 80%;
  margin: 0 auto;
}
</style>