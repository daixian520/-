<template>
<div class="all">
  <el-form  
   :model="reportForm" 
   ref="reportForm" 
   class="report" 
   label-position="top">
    <el-form-item class="reportTitle" prop="value">
        <el-row :gutter="2" style="display:flex;justify-content:center;">
          <el-col :span="6">
            <el-select v-model="reportForm.report_order" clearable placeholder="实验序号"
            >
            <el-option
            v-for="item in reportForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input
            placeholder="实验题目"
            v-model="reportForm.title"
            clearable>
            </el-input>
          </el-col>
        </el-row>
    </el-form-item>
    <el-form-item prop="textarea1" :label="'一、实验目的'">
      <el-input
      type="textarea"
      :rows="4"
      placeholder="实验目的"
      v-model="reportForm.one_ques"
      style="margin-left:10px;width:97%;"></el-input>
    </el-form-item>
    <el-form-item prop="time" :label="'二、实验学时'" >
      <el-select v-model="reportForm.two_ques" clearable placeholder="实验学时"
      style="margin-left:10px;">
        <el-option
        v-for="item in reportForm.times"
        :key="item.time"
        :label="item.label"
        :value="item.time">
        </el-option>
        </el-select>
    </el-form-item>
    <el-form-item prop="kind"  :label="'三、实验类型'">
      <el-select v-model="reportForm.three_ques" clearable placeholder="实验类型"
      style="margin-left:10px;">
        <el-option
        v-for="item in reportForm.kinds"
        :key="item.kind"
        :label="item.label"
        :value="item.kind">
        </el-option>
        </el-select>
    </el-form-item>
    <el-form-item prop="textarea4" :label="'四、实验需求'">
      <el-input
      type="textarea"
      :rows="4"
      placeholder="实验需求"
      v-model="reportForm.four_ques"
      style="margin-left:10px;width:97%;"></el-input>
    </el-form-item>
    <el-form-item prop="textarea5" :label="'五、实验任务'" >
      <el-input
      type="textarea"
      :rows="4"
      placeholder="实验任务"
      v-model="reportForm.five_ques"
      style="margin-left:10px;width:97%;"></el-input>
    </el-form-item>
    <el-form-item :label="'六、实验内容及步骤'" >
      <el-form-item
      v-for="(question,index) in reportForm.questions1"
      :label="'问题'+index+':'"
      label-width="200px"
      :key="question.key"
      :prop="'questions1.'+index+'.queval'"
      class="question"
      required
      ><!-- index表示当前数组的下标 -->
        <el-input
          type="textarea"
          :rows="2"
          placeholder="实验问题"
          v-model="question.queval"
         style="width:85%;"></el-input>
          <el-input type="textarea"
          placeholder="分数"
          v-model="question.grade"
          :rows="2"
          maxlength="3"
          style="width:10%;line-height: 54px;"></el-input>
          <el-button 
          @click.prevent="removeQuestion(question)" 
          icon="el-icon-delete" 
          class="butt" plain></el-button>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="addQuestion" icon="el-icon-plus" style="width:100px;"></el-button>
      </el-form-item>
    </el-form-item>
    <el-form-item :label="'七、实验扩展'" >
      <el-form-item
      v-for="(question,index) in reportForm.questions2"
      :label="'问题'+index+':'"
      :key="question.key"
      :prop="'questions2.'+index+'.queval'"
      class="question"
      required>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="实验问题"
          v-model="question.queval"
          style="width:85%;"></el-input>
        <el-input type="textarea"
          placeholder="分数"
          v-model="question.grade"
          :rows="2"
          maxlength="3"
          style="width:10%;line-height: 54px;"></el-input>
          <el-button 
          @click.prevent="removeQuestion2(question)" 
          icon="el-icon-delete" 
          class="butt" plain></el-button>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="addQuestion2" icon="el-icon-plus" style="width:100px;"></el-button>
      </el-form-item>
    </el-form-item>
    <el-form-item :label="'八、思考问答'" >
      <el-form-item
        v-for="(question3,index) in reportForm.questions3"
        :label="'问题'+index+':'"
        :key="question3.key"
        :prop="'questions3.'+index+'.queval'"
        class="question"
        required>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="思考问答"
          v-model="question3.queval"
          style="width:85%;"></el-input>
        <el-input type="textarea"
          placeholder="分数"
          v-model="question3.grade"
          :rows="2"
          maxlength="3"
          style="width:10%;line-height: 54px;"></el-input>
          <el-button 
          @click.prevent="removeQuestion3(question3)" 
          icon="el-icon-delete" 
          class="butt" plain></el-button>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="addQuestion3" icon="el-icon-plus" style="width:100px;"></el-button>
      </el-form-item>
    </el-form-item>
    <el-form-item label="实验报告提交截止日期：" class="date">
      <el-form-item>
        <el-date-picker type="date" placeholder="选择日期" v-model="reportForm.date"  value-format="yyyy-MM-dd"  style="width: 60%;"></el-date-picker>
      </el-form-item>
  </el-form-item>
  <el-form-item>
    <el-button  @click="submitForm(reportForm)" style="float:right">提交</el-button>
     <el-button @click="exportWord()">导出word模板</el-button>
  </el-form-item>
  </el-form>
</div>
</template>
<script>
import axios from 'axios';
import docxtemplater from 'docxtemplater'//使用 JSON 数据格式作为输入，可以处理docx 和 ppt模板
import PizZip from 'pizzip'
import 'pizzip/dist/pizzip-utils.js'
import JSZipUtils from 'jszip-utils'//提供一个getBinaryContent(path, data)接口，path即是文件的路径，支持AJAX get请求，data为读取的文件内容
import {saveAs} from 'file-saver'//适合在客户端生成文件的工具，它提供的接口saveAs(blob, "1.docx")
export default {
  components: {},
  props: {},
  data() {
    return {
      reportForm:{
       options: [{
          value: '01',
          label: '实验一'
        }, {
          value: '02',
          label: '实验二'
        }, {
          value: '03',
          label: '实验三'
        }, {
          value: '04',
          label: '实验四'
        }, {
          value: '05',
          label: '实验五'
        },{
            value:'06',
            label:'实验六'
        },{
            value:'07',
            label:'实验七'
        },{
            value:'08',
            label:'实验八'
        },{
            value:'09',
            label:'实验九'
        },{
            value:'10',
            label:'实验十'
        },{
            value:'11',
            label:'实验十一'
        },{
            value:'12',
            label:'实验十二'
        }],
       times:[{
            time:'1',
            label:'1学时'
          },{
            time:'2',
            label:'2学时'
        }],
       kinds:[{
            kind:'01',
            label:'综合性实验'
          },{
            kind:'02',
            label:'创新型实验'
        }],
      questions1:[{
        queval:'',
        grade:'',
      }],
      questions2:[{
        queval:'',
        grade:'',
      }],
      questions3:[{
        queval:'',
        grade:'',
      }],
     report_order:'',
     title:'',
     one_ques:'',
     two_ques:'',
     three_ques:'',
     four_ques:'',
     five_ques:'',
     six_ques:'',
     seven_ques:'',
     eight_ques:'',
     date:'',
      },
    courseName:this.$route.query.courseName,
    className:this.$route.query.className,
    doc_arr:'',
    doc_arr2:'',
    doc_arr3:'',
    message:'',
    };
  },
  created(){
  },
  methods:{
      submitForm(reportForm) {
        var api="http://localhost:8082/teacher/tea_report.php"
        var params=new URLSearchParams()
         params.append('teacId',JSON.parse(sessionStorage.getItem('userid')))
        params.append('report_order',this.reportForm.report_order)
        params.append('title',this.reportForm.title)
        params.append('one_ques',this.reportForm.one_ques)//实验目的
        params.append('two_ques',this.reportForm.two_ques)//实验学时
        params.append('three_ques',this.reportForm.three_ques)//实验类型
        params.append('four_ques',this.reportForm.four_ques)//实验需求
        params.append('five_ques',this.reportForm.five_ques)//实验任务
        params.append('questions1',JSON.stringify(this.reportForm.questions1))//实验内容及步骤
        params.append('questions2',JSON.stringify(this.reportForm.questions2))//实验扩展
        params.append('questions3',JSON.stringify(this.reportForm.questions3))//思考问答
        params.append('date',this.reportForm.date)//实验提交截止日期
        params.append('courseName',this.courseName)//传递当前的课程信息
        params.append('className',this.className)//传递当前的班级信息
        axios.post(api,params).then(res=>{
          console.log(res.data)
          if(res.data=="success"){
            this.message="实验报告提交成功"
            this.open1()
          }else{
            this.message=res.data
            this.open2()
          }
          }).catch(err=>{
            console.log(res.err);
          })
       },
      loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
      },
      postData(reportForm){
        var api="http://localhost:8082/exportWord.php"
        var params=new URLSearchParams()
        params.append('one_ques',this.reportForm.one_ques)//实验目的
        params.append('four_ques',this.reportForm.four_ques)//实验需求
        params.append('five_ques',this.reportForm.five_ques)//实验任务
        axios.post(api,params).then(res=>{
            this.doc_arr=res.data['arr'],
            this.doc_arr2=res.data['arr2'],
          this.doc_arr3=res.data['arr2']
        })
      },
      exportWord:function(){
        var that=this
        this.postData()
        this.loadFile("/model.docx", function (error, content) {
          if (error) {
            throw error
          };
          var zip = new PizZip(content);
          var doc = new docxtemplater().loadZip(zip)
        doc.setData({
            report_order:that.reportForm.report_order,
            title:that.reportForm.title,
            one_ques:that.doc_arr,//实验目的
            two_ques:that.reportForm.two_ques,//实验学时
            three_ques:that.reportForm.three_ques,//实验类型
            four_ques:that.doc_arr2,//实验需求
            five_ques:that.doc_arr3,//实验任务
            questions1:that.reportForm.questions1,//实验内容及步骤
            questions2:that.reportForm.questions2,//实验扩展
            questions3:that.reportForm.questions3//思考问答
          })
          try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
          } catch (error) {
            var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
            }
            console.log(JSON.stringify({
              error: e
            }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
          }
          var out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }) //Output the document using Data-URI
          saveAs(out, 'out.docx')
        })
      },
      removeQuestion(item) {
        var index = this.reportForm.questions1.indexOf(item)
        if (index !== -1) {
          this.reportForm.questions1.splice(index, 1)
        }
      },
      addQuestion() {
        this.reportForm.questions1.push({
          queval: '',
          key: Date.now()
        });
      },
      removeQuestion2(item) {
        var index = this.reportForm.questions2.indexOf(item)
        if (index !== -1) {
          this.reportForm.questions2.splice(index, 1)
        }
      },
      addQuestion2() {
        this.reportForm.questions2.push({
          queval: '',
          key: Date.now()
        });
      },
      removeQuestion3(item) {
        var index = this.reportForm.questions3.indexOf(item)
        if (index !== -1) {
          this.reportForm.questions3.splice(index, 1)
        }
      },
      addQuestion3() {
        this.reportForm.questions3.push({
          queval: '',
          key: Date.now()
        });
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
  }
};
</script>
<style   lang="scss" scoped>
.all{
  width: 70%;
  display: flex;
  justify-content: center;
.report{
  width: 80%;
  height:auto;
  display: flex;
  flex-direction: column;
  .reportTitle{
    display: flex;
    width: auto;
    justify-content: center;
  }
  .question{
   display:flex;
   flex-direction:row;
   margin-bottom: 10px;
   .btn{
     line-height:2;
   }
  }
  .date{
    display:flex;
   flex-direction:row;
   margin-bottom: 10px;
  }
}
}
</style>
<style lang="scss">
.question{
   .el-form-item__label{
     width: 60px;
     margin-left: 20px;
   }
   .el-form-item__content{
     display: flex;
     width: 100%;
   }
 }
 .date{
   .el-form-item__label{
     width: auto;
     margin-left: 20px;
   }
 }
</style>