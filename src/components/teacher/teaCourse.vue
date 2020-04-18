<template>
<div style="width:100%">
 <div v-if="isShow">
   <span>学期:</span> <el-select v-model="selectValue"  placeholder="请选择学期" >
    <el-option
      v-for="(item,index) in items"
      :key="index"
      :label="item.beginTime"
      :value="item.beginTime">
    </el-option>
  </el-select>
  <el-table
    :data="tableData"
    border
    stripe>
    <el-table-column 
      prop="className"
      label="班级"
      width="200">
    </el-table-column>
    <el-table-column 
      prop="stuNum"
      label="班级人数"
      width="120">
    </el-table-column>
    <el-table-column
      prop="courseName"
      label="课程"
      width="auto">
    </el-table-column>
    <el-table-column
      prop="details"
      label="详细"
      width="120">
      <template slot-scope="scope">
          <el-popover trigger="hover" placement="left">
              <p>课程名：{{scope.row.courseName}}</p>
              <p>课程类型：{{scope.row.details}}</p>
              <p>班级人数：{{scope.row.stuNum}}</p>
              <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{scope.row.details}}</el-tag>
              </div>
          </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="400">
      <template slot-scope="scope">
        <el-button :disabled="dis"  @click="handleClick(scope.row.courseName,scope.row.className)" type="text" size="small">编辑实验指导</el-button>
        <el-button type="text" @click="query(scope.row.courseName,scope.row.className)">查看实验报告</el-button>
        <el-button :disabled="dis"  type="text" size="small" @click="notice(scope.row.courseName,scope.row.className)">发布课程公告</el-button><!-- v-bind:disabled="dis"-->
      </template> 
        
    </el-table-column>
  </el-table>
 </div>
  <router-view v-else/>
</div>
</template>
<script>
import axios from 'axios'
  export default {
    name:'teaCourse',
    data() {
      return {
        items:[],
        selectValue:JSON.parse(sessionStorage.getItem('schoolYear')),
        tableData: [],
        courseName:'',
        className:'',
        id:JSON.parse(sessionStorage.getItem('userid')),
        schoolYear:JSON.parse(sessionStorage.getItem('schoolYear')),
        isShow:true,
        dis:false,
      }
    },
    created(){
        var api="http://localhost:8082/teacher/teaCourse.php"
        var params=new URLSearchParams()
          params.append('id',this.id)
          params.append('schoolYear',this.schoolYear)
          params.append('selectValue',this.selectValue)
        axios.post(api,params).then(res=>{
          //console.log(res.data)
            this.items=res.data['items']
            this.tableData=res.data['tableData']
        })
    },
    methods: {
      handleClick(courseName,className) {
        this.courseName=courseName
        this.className=className
        this.$router.push({
            path:'/home/teaCourse/report',
            query:{
              courseName:this.courseName,
              className:this.className
            },
        })
      },
      query(courseName,className){
        this.courseName=courseName;
        this.className=className;
        sessionStorage.setItem('courseName',courseName);
        sessionStorage.setItem('className',className);
        this.$router.push({
            path:'/home/teaCourse/reportList',
            query:{
            },
        })
      },
      notice(courseName,className){
        this.courseName=courseName;
        this.className=className;
        sessionStorage.setItem('courseName',courseName);
        sessionStorage.setItem('className',className);
        this.$prompt('请输入公告内容', '发布课程公告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          var api="http://localhost:8082/teacher/teaNotice.php";
          var params=new URLSearchParams();
          params.append('courseName',sessionStorage.getItem('courseName'));
          params.append('id',JSON.parse(sessionStorage.getItem('userid')));
          params.append('className',sessionStorage.getItem('className'));
          params.append('content',value);
          axios.post(api,params).then(res=>{
            if(res.data=="success"){
                this.$message({
                type: 'success',
                message: '消息公告发布成功'
                });
                //var status="success";
                this.$emit('newNotice',value)
            }else{
              this.$message({
              type: 'warning',
              message: res.data
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消发布'
          });       
        });
      },
    },
    watch: {
    $route: {
      handler: function(route) {
        this.isShow=route['meta']['isShow']
      },
      immediate: true
    },
    selectValue:function(val){
      if(val!=this.schoolYear){
        this.dis=true;
      }else{
        this.dis=false;
      }
      var api="http://localhost:8082/teacher/teaCourse1.php"
      var params=new URLSearchParams()
      params.append('id',this.id)
      params.append('selectValue',this.selectValue)
      axios.post(api,params,
      {
          headers:{'Content-Type':'application/x-www-form-urlencoded'}
      }
      ).then(res=>{
        this.tableData=res.data;
      })
     }
      
  }
  }
</script>
<style  scoped>
</style>