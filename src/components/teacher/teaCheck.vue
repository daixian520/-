<template>
 <el-form class="teaCheck">
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
        <div v-for="(question,index) in this.questions1"  :key="index"
        style="padding-left:20px;width:100%;">
            <span>{{question.queval}}</span><span>({{question.grade}})分</span>
            <div class="check">
                <el-input type="textarea" :rows="4" v-model="question.item"></el-input>
                <el-input type="number" :min="0" v-model="question.check_grade"></el-input></div>
        </div>
    </div>
    <div>
        <span>七、扩展问题</span>
        <div v-for="(question,item) in this.questions2" :key="item"
        style="padding-left:20px;width:100%;">
            <span>{{question.queval}}</span><span>({{question.grade}})分</span>
            <div class="check">
                <el-input type="textarea" :rows="4" v-model="question.item"></el-input>
               <el-input type="number" :min="0" v-model="question.check_grade"></el-input></div>
        </div>
    </div>
    <div>
        <span>八、思考问答</span>
        <el-form-item v-for="(question,index) in this.questions3"  :key="index"
        style="padding-left:20px;width:100%;">
            <span>{{question.queval}}</span><span>({{question.grade}})分</span>
            <div class="check">
                <el-input type="textarea"  :rows="4" v-model="question.item"></el-input>
                <el-input type="number"  :min="0" v-model="question.check_grade" ></el-input>
            </div>
        </el-form-item>
    </div> 
    <div style="width:100%;dispaly:flex;flex-direction:end;">
       <span>总分：{{checkGrade}}</span>
    <el-button style="display:inline-block;width:100px;float:right" @click="subCheck()">{{btnValue}}</el-button></div>
</el-form>
</template>
<script>
import axios from 'axios';
export default {
name:'teaCheck',
data(){
    return{
        subStatus:this.$route.query.subStatus,
        btnValue:'',
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
        total:'',
        message:'',
    }
},
created(){
    var api="http://localhost:8082/teacher/teaCheck.php";
    var params=new URLSearchParams();
    params.append('id',sessionStorage.getItem('stuId'));
    params.append('className',sessionStorage.getItem('className'));
    params.append('courseName',sessionStorage.getItem('courseName'));
    params.append('subStatus',this.subStatus);
    params.append('report_order',this.report_order);
    axios.post(api,params).then(res=>{
        var row3=res.data['row3'];
        this.title=row3['title'],
        this.one_ques=res.data['one_ques'],
        this.two_ques=row3['two_ques'],
        this.three_ques=row3['three_ques'],
        this.four_ques=res.data['four_ques'],
        this.five_ques=res.data['five_ques'],
        this.questions1=res.data['six_content'],
        this.questions2=res.data['seven_expand'],
        this.questions3=res.data['eight_answer'];
        if(this.subStatus=="0"){
            this.btnValue="确认修改";
        }else{
            this.btnValue="确认批改";
        }
    })
},
computed:{
    /* 计算总分 */
    checkGrade:function(){
        let min=0, 
            me=this,
           total=0;
            
        var quesItem=[];
        quesItem=quesItem.concat(me.questions1).concat(me.questions2).concat(me.questions3);
                for(let j=0;j<quesItem.length;j++){
                    let inputValue=parseInt(quesItem[j]["check_grade"]);
                    let grade=parseInt(quesItem[j]["grade"]);
                    if(isNaN(inputValue)){
                      inputValue=0;
                      /* me.message="NAN";
                        me.errorOpen(); */
                    }
                    if(inputValue>grade){
                        inputValue=grade;
                        me.message="最大输入值为"+grade;
                        me.errorOpen();
                    }else if(inputValue<0){
                        inputValue=0;
                        me.message="最小输入值为0";
                        me.errorOpen();
                    }
                   total+=inputValue; 
                }
                me.total=total
                return me.total;
    },
},
methods:{
    subCheck(){
        if(this.total==0){
            this.message="批改的成绩不能是0分";
            this.errorOpen()
        }else{
            var api="http://localhost:8082/teacher/subCheck.php";
            var params=new URLSearchParams();
            params.append('stuId',sessionStorage.getItem('stuId'));
            params.append('courseName',sessionStorage.getItem('courseName'));
            params.append('report_order',sessionStorage.getItem('report_order'));
            params.append('six_content',JSON.stringify(this.questions1));
            params.append('seven_expand',JSON.stringify(this.questions2));
            params.append('eight_answer',JSON.stringify(this.questions3));
            
            params.append('checkGrade',this.total);
            axios.post(api,params).then(res=>{
                if(res.data=="success"){
                this.open1();
                var status="0";//等于0是已批改
                this.$emit('getsubStatus',status)
                }
                console.log(this.questions1);
            });
        }
    },
    errorOpen() {
        this.$notify.error({
          title: '错误',
          message:this.message
        });
      },
    open1() {
        this.$message({
          showClose: true,
          message: "批改成功",
          type: 'success'
        });
      },
},
}
</script>
<style scoped lang="scss">
.teaCheck{
    display: flex;
    // width: 60%;
    justify-content: center;
    flex-direction: column;
    .check{
        display: flex;
        flex-direction: row;
    }
}
</style>
<style lang="scss">
.teaCheck{
    .check{
        div:first-child{
            width: 90%;
        }
        div:last-child{
            width:10%;
            margin-left: 10px;
            line-height: 100px;
            .el-input__inner{
                padding:5px 0px;
            }
        }
    }
    
}

</style>