<template>
<el-form class="stuReport">
      <span style="display:inline-block;text-align:center;">{{this.report_order}}:{{this.title}}</span>
      <div>
          <span>一、实验目的</span>
          <div v-for="(item,index) in this.one_ques" :key="index"
          style="padding-left:20px;width:100%;">{{item}}</div>
      </div>
      <div>
          <span>二、实验学时</span>
          <div style="padding-left:20px;width:100%;">{{two_ques}}学时</div>
      </div>
      <div>
          <span>三、实验类型</span>
          <div style="padding-left:20px;width:100%;">{{three_ques}}</div>
      </div>
      <div>
          <span>四、实验需求</span>
          <div v-for="(item,index) in this.four_ques" :key="index"
          style="padding-left:20px;width:100%;">{{item}}</div>
      </div>
      <div>
          <span>五、实验任务</span>
          <div v-for="(item,index) in this.five_ques" :key="index"
          style="padding-left:20px;width:100%;">{{item}}</div>
      </div>
       <div>
          <span>六、实验步骤及内容</span>
          <div v-for="(question,item) in this.questions1"  :key="item"
          style="padding-left:20px;width:100%;">
              <span>{{question.queval}}</span><span>({{question.grade}})分</span>
              <el-input type="textarea" :rows="4" v-model="question.item"></el-input>
          </div>
      </div>
      <div>
         <span>七、扩展问题</span>
          <div v-for="(question,item) in this.questions2" :key="item"
          style="padding-left:20px;width:100%;">
              <span>{{question.queval}}</span><span>({{question.grade}})分</span>
              <el-input type="textarea" :rows="4" v-model="question.item"></el-input>
          </div>
      </div>
      <div>
         <span>八、思考问答</span>
          <el-form-item v-for="(question,index) in this.questions3"  :key="index"
          style="padding-left:20px;width:100%;">
              <span>{{question.queval}}</span><span>({{question.grade}})分</span>
             <el-input type="textarea" :rows="4" v-model="question.item"></el-input>
          </el-form-item>
      </div> 
      <div style="width:100%;dispaly:flex;flex-direction:end;"><el-button 
      style="display:inline-block;width:100px;float:right" @click="submitReport()"
      :disabled='subStatus=="2" ||subStatus=="1"'>{{btnValue}}</el-button></div>
</el-form>
</template>
<script>
import axios from 'axios';
export default {
  components: {},
  props: {
  },
  data() {
    return {
    report_order:sessionStorage.getItem('report_order'),
    subStatus:this.$route.query.subStatus,
    title:'',
    one_ques:'',
    two_ques:'',
    three_ques:'',
    four_ques:'',
    five_ques:[],
    questions1:[],
    questions2:[],
    questions3:[],
    report_date:'',
    report_id:'',
    message:'',
    btnValue:'提交',
    };
  },
  created(){
      var api1="http://localhost:8082/student/stuReport.php"
    //   var api2="http://localhost:8082/student/stuReport2.php"
      var params=new URLSearchParams()
      params.append('subStatus',this.subStatus);
      params.append('courseName',sessionStorage.getItem('courseName'));
      params.append('id',JSON.parse(sessionStorage.getItem('userid')));
      params.append('report_order',this.report_order);
      axios.post(api1,params,
        {headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
          var row3=res.data['row3']
          this.title=row3['title'],
          this.one_ques=res.data['one_ques'],
          this.two_ques=row3['two_ques'],
          this.three_ques=row3['three_ques'],
          this.four_ques=res.data['four_ques'],
          this.five_ques=res.data['five_ques']
          this.report_date=row3['report_date'],
          this.report_id=row3['report_id'];
          /* console.log(row3['report_order']); */
          /* 已提交+未过期 0; 未提交+未过期 3；已提交+过期 1；未提交+过期 2*/
          if(this.subStatus=="1" ||this.subStatus=="0"){
            this.btnValue="确认修改";
            var item=res.data['item'];
             this.questions1=JSON.parse(item[0]['six_content']);
             this.questions2=JSON.parse(item[0]['seven_expand']);
             this.questions3=JSON.parse(item[0]['eight_answer']);
          }else{
            this.questions1=JSON.parse(row3['six_ques']);
            this.questions2=JSON.parse(row3['seven_ques']);
            this.questions3=JSON.parse(row3['eight_ques']);
          }
      })
     
  },
  methods:{
     submitReport(){
      var api="http://localhost:8082/student/submitStuReport.php";
      var params=new URLSearchParams();
      params.append('isEdit',this.isEdit);
      params.append('stuId',JSON.parse(sessionStorage.getItem('userid')));
      params.append('courseName',sessionStorage.getItem('courseName'));
      params.append('report_date',this.report_date);
      params.append('report_id',this.report_id);//教师端的实验报告ID
      params.append('report_order',this.report_order);
      params.append('title',this.title);
      params.append('six_content',JSON.stringify(this.questions1));
      params.append('seven_expand',JSON.stringify(this.questions2));
      params.append('eight_answer',JSON.stringify(this.questions3));
      axios.post(api,params,
       {headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
        if(res.data=="success"){
            if(this.isEdit){
                this.message="实验报告修改成功";
            }else{
                this.message="实验报告提交成功";
                this.isEdit="true"
            }
                this.open1();
                var status="0";//等于0是可修改
                this.$emit('getsubStatus',status)
            }else{
                this.message=res.data;
                this.open2();
            }
        })
     },
    open1() {
        this.$message({
          showClose: true,
          message: this.message,
          type: 'success'
        });
      },
    open2() {
        this.$message({
          showClose: true,
          message: this.message,
          type: 'error'
        });
      },
  },
};
</script>
<style  scoped>
.stuReport{
    display: flex;
    justify-content: center;
    flex-direction: column;
}
</style>