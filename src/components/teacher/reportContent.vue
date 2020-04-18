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
          </div>
      </div>
      <div>
         <span>七、扩展问题</span>
          <div v-for="(question,item) in this.questions2" :key="item"
          style="padding-left:20px;width:100%;">
              <span>{{question.queval}}</span><span>({{question.grade}})分</span>
          </div>
      </div>
      <div>
         <span>八、思考问答</span>
          <el-form-item v-for="(question,index) in this.questions3"  :key="index"
          style="padding-left:20px;width:100%;">
              <span>{{question.queval}}</span><span>({{question.grade}})分</span>
          </el-form-item>
      </div> 
</el-form>
</template>
<script>
import axios from 'axios';
export default {
 data() {
    return {
        report_order:sessionStorage.getItem('report_order'),
        title:'',
        one_ques:'',
        two_ques:'',
        three_ques:'',
        four_ques:'',
        five_ques:[],
        questions1:[],
        questions2:[],
        questions3:[],
    }
},
created(){
     var api1="http://localhost:8082/teacher/reportContent.php"
    //   var api2="http://localhost:8082/student/stuReport2.php"
      var params=new URLSearchParams()
      params.append('courseName',sessionStorage.getItem('courseName'));
      params.append('id',JSON.parse(sessionStorage.getItem('userid')));
      params.append('className',sessionStorage.getItem('className'));
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
          this.questions1=JSON.parse(row3['six_ques']);
          this.questions2=JSON.parse(row3['seven_ques']);
          this.questions3=JSON.parse(row3['eight_ques']);
        }) 
},
}
</script>

<style scooped>
.stuReport{
    display: flex;
    justify-content: center;
    flex-direction: column;
}
</style>