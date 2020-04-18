<template>
<div>
  <el-table
    v-show="myselfShow"
    :data="tableData"
    stripe
    :default-sort = "{prop: 'report_order', order: 'ascending'}"
    >
    <el-table-column
      prop="report_order"
      label="实验序号"
      sortable
      width="100">
    </el-table-column>
    <el-table-column
      prop="title"
      label="实验名称"
      width="250">
    </el-table-column>
    <el-table-column
      prop="subStuNum"
      label="提交报告的人数"
      width="100">
    </el-table-column>
    <el-table-column
      prop="report_date"
      :formatter="dateFormat"
      label="截止日期"
      width="100">
    </el-table-column>
    <el-table-column
      label="操作"
      width=250>
      <template slot-scope="scope">
        <el-button  @click="handleCheck(scope.row.report_order,scope.row.canCheck)" type="text" size="small">提交情况</el-button>
        <el-button  @click="handleGrade(scope.row.report_order,scope.row.canCheck)" type="text" size="small">成绩情况</el-button>
        <el-button type="text" size="small" @click="handleContent(scope.row.report_order)">报告册内容</el-button>
      </template>
    </el-table-column>scope.row.
  </el-table>
  <router-view></router-view>
</div>
</template>
<script>
import axios from 'axios'
export default {
  name:'reportList',
  data() {
    return {
      myselfShow:'true',
      tableData:[],
      report_order:'',
    }
  },
  created(){
    var api="http://localhost:8082/teacher/reportList.php"
    var params=new URLSearchParams()
    params.append('className',sessionStorage.getItem('className'))
    params.append('courseName',sessionStorage.getItem('courseName'))
    params.append('id',JSON.parse(sessionStorage.getItem('userid')))
    axios.post(api,params).then(res=>{
      this.tableData=res.data['tableData'];
      console.log(this.tableData);
    })
  },
  methods:{
    dateFormat(row,column){
      var time=row.report_date;
      var newTime=time.substr(0,10);//substr(start,length) start：开始位置；length:结束位置
      return newTime;
     },
    handleCheck(report_order,canCheck){
      this.report_order=report_order
      sessionStorage.setItem('report_order',report_order);
      var canCheck=canCheck;
        this.$router.push({
            path:'/home/teaCourse/reportList/subStuList',
            query:{
              canCheck:canCheck,
            },
       })
    },
    handleGrade(report_order,canCheck){
      this.report_order=report_order
      sessionStorage.setItem('report_order',report_order);
      var canCheck=canCheck;
        this.$router.push({
            path:'/home/teaCourse/reportList/teaGrade',
            query:{
              canCheck:canCheck,
            },
       })
    },
    handleContent(report_order){
      this.report_order=report_order
      sessionStorage.setItem('report_order',report_order);
      this.$router.push({
            path:'/home/teaCourse/reportList/reportContent',
            query:{
            },
       })
    }
  },
  watch:{
    $route: {
      handler: function(route) {
        this.myselfShow=route['meta']['myselfShow']
      },
      immediate: true
    },
  },
}
</script>

<style>

</style>