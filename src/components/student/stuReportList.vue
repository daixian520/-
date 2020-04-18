<template>
  <div style="width:100%">
    <el-table
      :data="stuReportList"
      stripe
      border
      :default-sort = "{prop: 'date', order: 'ascending'}"
      size="mini" v-if="show">
      <el-table-column
        prop="report_order"
        sortable
        label="实验序号"></el-table-column>
      <el-table-column
        label="课程名称"
        >{{this.courseName}}</el-table-column>
      <el-table-column
        prop="title"
        label="实验名称"></el-table-column>
      <el-table-column
        prop="report_date"
        :formatter="dateFormat"
        label="截止时间"
        width="100"></el-table-column>
        <!-- <stuReport v-on:listenToChildEvent="showMsgFromChild"></stuReport> -->
      <el-table-column
        label="提交状态"
        class-name="status-col"
        width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStata}}</el-tag>
        </template>
        </el-table-column>
      <el-table-column label="操作" :edit="this.isEdit">
        <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-show='scope.row.status=="3"'
              @click="EditReport(scope.row.report_order)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              v-show='scope.row.status=="0"'
              @click="EditChange(scope.row.report_order,scope.row.status)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              v-show='scope.row.status=="1" || scope.row.status=="2"'
              @click="EditChange(scope.row.report_order,scope.row.status)">查看</el-button>  
        </template>
      </el-table-column>
    </el-table>
  <router-view v-else @getsubStatus='getsubStatus' />
  </div>
</template>
<script>
import axios from 'axios';
export default {
  components: {
  },
  props: {},
  data() {
    return {
        stuReportList:[],
        report_order:sessionStorage.getItem('report_order'),
        courseName:sessionStorage.getItem('courseName'),
        report_order:'',
        show:'',
        isEdit:false,
    };
  },
  created(){
      var api="http://localhost:8082/student/stuReportList.php"
      var params=new URLSearchParams()
      params.append('courseName',this.courseName)
      params.append('id',JSON.parse(sessionStorage.getItem('userid')))
      axios.post(api,params).then(res=>{
          this.stuReportList=res.data
      })
  },
  filters:{
    // el-tag类型转换
    statusFilter(status) {
      /* 已提交+未过期 0; 未提交+未过期 3；已提交+过期 1；未提交+过期 2*/
      const statusMap = {
        0: 'info',
        1: 'success',
        2:'danger',
        3:''
      }
      return statusMap[status]
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        0: '可修改',
        1: '已提交',
        2: '未提交',
        3:'待提交'
      }
      return statusMap[status]
    }
  },
  methods:{
      EditReport(report_order,status){
       this.report_order=report_order;
       sessionStorage.setItem('report_order',this.report_order);
       var subStatus=status;
        this.$router.push({
        path:'/home/stuCourse/stuReportList/stuReport',
        query:{
            /* report_order:this.report_order,
            courseName:this.courseName, */
            subStatus:subStatus,
            // isEdit:this.isEdit
        },
     })
    },
    EditChange(report_order,status){
      this.report_order=report_order;
      sessionStorage.setItem('report_order',this.report_order);
      var subStatus=status;
      this.$router.push({
        path:'/home/stuCourse/stuReportList/stuReport',
        query:{
            /* report_order:this.report_order,
            courseName:this.courseName, */
            // isEdit:!this.isEdit,
            subStatus:subStatus,
        },
     })
    },
    dateFormat(row,column){
      var time=row.report_date
      var newTime=time.substr(0,10)//substr(start,length) start：开始位置；length:结束位置
      return newTime
  },
   /* 父子组件传值 */
    getsubStatus(status){
      var status=status;
      this.stuReportList.forEach(element => {
        if(element.report_order==sessionStorage.getItem('report_order')){
          element.status=status;
          // console.log("更改成功");
        }else{
          // console.log(element);
        }
      });
    },
  },
  watch:{
   $route: {
      handler: function(route) {
        // console.log(route['meta']['show'])
        this.show=route['meta']['show']
      },
      immediate: true
    }
  },

  
};
</script>
<style  scoped>
</style>