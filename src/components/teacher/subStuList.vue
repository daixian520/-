<template>
  <div>
    <el-form v-show="Show">
      <!-- arrayObject.slice(start,end)从当前数组中返回指定的元素，不会修改原数组中的数据只会返回一个新的数组 -->
      <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
      style="width:60%"
      stripe
      border
      :default-sort = "{prop: 'stuId', order: 'ascending'}"
      size="mini">
        <el-table-column
        prop="stuId"
        label="学号"
        sortable
        width="auto">
        </el-table-column>
        <el-table-column
        prop="name"
        label="姓名"
        width="auto">
        </el-table-column>
        <el-table-column
          label="批改状态"
          :formatter="formatterData"
          width="90">
          <!-- <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStata}}</el-tag>
          </template> class-name="status-col"-->
        </el-table-column>
        <el-table-column label="操作"> 
            <template slot-scope="scope"><!-- slot-scope="scope" -->
              <el-button
                size="mini"
                type="text"
                v-show='scope.row.status=="1"'
                :disabled='canCheck=="0"'
                @click="handleCheck(scope.row.stuId,scope.row.status)">批改</el-button>
                <el-button
                size="mini"
                type="text"
                v-show='scope.row.status=="0"'
                @click="handleCheck(scope.row.stuId,scope.row.status)">修改</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"></el-pagination>
    </el-form>
    <router-view @getsubStatus='getsubStatus'></router-view>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name:'subStuList',
  components: {},
  props: {},
  data() {
    return {
      tableData:[],
      pagesize:10,
      currentPage:1,
      report_order:sessionStorage.getItem('report_order'),
      Show:'true',
      canCheck:this.$route.query.canCheck,
      status1:'',
    };
  },
  created(){
      var api="http://localhost:8082/teacher/subStuList.php"
      var params=new URLSearchParams()
      params.append('id',JSON.parse(sessionStorage.getItem('userid')));
      params.append('className',sessionStorage.getItem('className'));
      params.append('courseName',sessionStorage.getItem('courseName'));
      params.append('report_order',sessionStorage.getItem('report_order'));
      axios.post(api,params).then(res=>{
        this.tableData=res.data['tableData'];
      })
  },
  /* filters:{
    // el-tag类型转换
    statusFilter(status) { */
      /* 已批改 0； 未批改 1; */
     /*  const statusMap = {
        0: 'info',
        1:''
      }
      return statusMap[status]
    }, */
    // 状态显示转换
    /* formatStata(status) {
      var status=status;
      if(this.status1!=''){
        status=this.status;
      }
      const statusMap = {
        0: '已批改',
        1: '未批改',
      }
      return statusMap[status]
    } 
  },*/
  methods:{
    handleCheck(stuId,status){
      var stuId=stuId;
      var status=status;
      sessionStorage.setItem('stuId',stuId);
      this.$router.push({
            path:'/home/teaCourse/reportList/subStuList/teaCheck',
            query:{
              subStatus:status
            },
        })
    },
    handleSizeChange(size) {
      this.pagesize=size;
        console.log(this.pagesize);
      },
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage;
        console.log(this.currentPage);
      },
      /* 父子组件传值 */
    getsubStatus(status){
      var status=status;
      this.tableData.forEach(element => {
        if(element.stuId==sessionStorage.getItem('stuId')){
          element.status=status;
          console.log("更改成功");
        }else{
          console.log(element);
        }
        /* console.log(element); */
      });
      /* this.status=status;
      console.log(status); */
    },
    formatterData(row, column){
      if(row.status=="1"){
        return "未批改";
      }else{
        return "已批改";
      }
    }
  },
  watch:{
     $route: {
      handler: function(route) {
        this.Show=route['meta']['Show']
      },
      immediate: true
    },
}
};
</script>
<style  scoped>
</style>