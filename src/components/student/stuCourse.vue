<template>
<div class="stuReport">
<el-form v-if="isShow" style="width:100%">
  <span>学年学期:</span> <el-select v-model="selectValue"  placeholder="请选择学期" >
    <el-option
      v-for="item in items"
      :key="item.title"
      :label="item.title"
      :value="item.title">
    </el-option>
  </el-select>
  <el-table
    :data="tableData"
     style="width:auto"
    stripe
    border
    size="mini">
  <el-table-column
      prop="stuClass"
      label="学期"
      width="180">
  </el-table-column>
  <el-table-column
      prop="courseName"
      label="课程名称"
      width="180">
  </el-table-column>
  <el-table-column
      class-name="status-col"
      label="课程状态"
      width="180">
      <template slot-scope="scope">
          <el-tag :type="scope.row.courseStatus | statusFilter">{{scope.row.courseStatus | formatStata}}</el-tag>
      </template>
  </el-table-column>
  <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleEdit(scope.row.courseName)">实验报告列表</el-button>
        <el-button
          size="mini"
          type="text"
          @click="handleGrade(scope.row.courseName)">实验成绩</el-button>
        <el-button
          size="mini"
          type="text"
          :disabled='scope.row.courseStatus=="0"'
          @click="handleMessage(scope.row.courseName)">实验留言</el-button>
      </template>
      
  </el-table-column>
  </el-table>
</el-form>
<router-view v-else/>
</div>
</template>
<script>
import Axios from 'axios';
import qs from 'qs';
export default {
  components: {},
  props: {},
  data() {
    return {
    selectValue:JSON.parse(sessionStorage.getItem('schoolYear')),
    items:[],
    classMenu:[],
    tableData:[],
    isShow:true,
    courseName:'',
    };
  },
   created(){
      var api="http://localhost:8082/student/stuCourse.php"
      var params=new URLSearchParams()
      params.append('id',JSON.parse(sessionStorage.getItem('userid')))
      params.append('role',JSON.parse(sessionStorage.getItem('userole')))
      params.append('selectValue',this.selectValue)
      Axios.post(api,params).then(res=>{
        // console.log(res.data)
        this.tableData=res.data['tabaleData'];
        this.items=res.data['items'];
        this.classMenu=res.data['classMenu'];
        // console.log(this.tableData)
        // console.log(this.items)
      }).catch(err=>{
        console.log(res.err);
      })
  
  },
  mounted(){
  },
  filters:{
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        0: '已完结',
        1: '进行中',
      }
      return statusMap[status]
    }
  },
  methods:{
    handleEdit(courseName){
      this.courseName=courseName;
      sessionStorage.setItem('courseName',this.courseName)
      this.$router.push({
            path:'/home/stuCourse/stuReportList',
            query:{
            },
        })
      },
    handleGrade(courseName){
      this.courseName=courseName;
      sessionStorage.setItem('courseName',this.courseName)
      this.$router.push({
            path:'/home/stuCourse/stuGrade',
            query:{
            },
        })
    },
    handleMessage(courseName){
      this.courseName=courseName;
      sessionStorage.setItem('courseName',this.courseName)
      this.$router.push({
            path:'/home/stuCourse/stuMessage',
            query:{
            },
        })
    }
  },
   watch:{
    selectValue:function(val){
      var api="http://localhost:8082/student/stuCourse2.php"
      var params=new URLSearchParams()
      params.append('selectValue',this.selectValue);
      params.append('classMenu',JSON.stringify(this.classMenu));
      params.append('schoolYear',JSON.parse(sessionStorage.getItem('schoolYear')));
      Axios.post(api,params,
      {
          headers:{'Content-Type':'application/x-www-form-urlencoded'}
      }
      ).then(res=>{
        this.tableData=res.data;
          console.log(this.tableData)
      })
  },
   $route: {
      handler: function(route) {
        // console.log(route['meta']['isShow'])
        this.isShow=route['meta']['isShow']
      },
      immediate: true
    },
  },
};
</script>
<style  scoped>
.stuReport{
  display: flex;
  justify-content: center;
}
</style>
