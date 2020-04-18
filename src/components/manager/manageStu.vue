<template>
<div class="userInfo">
  <div style="margin-top: 15px;">
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm">
      <el-form-item prop="inputValue">
        <el-input show-word-limit   placeholder="请输入教师/学生Id" v-model="ruleForm.inputValue" :maxlength="10" class="input-with-select">
          <el-select v-model="ruleForm.selectValue" slot="prepend" placeholder="角色选择">
            <el-option label="教师" value="1"></el-option>
            <el-option label="学生" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
        </el-input>      
      </el-form-item>
      
    </el-form>
  </div>
  <div class="stuForm" v-show="ruleForm.selectValue=='2'">
    <el-form :model="stuForm" label-position="left" label-width="60px">
      <el-form-item label="学号:">
        <el-input v-model="stuForm.stuId" readonly></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="stuForm.stuName" readonly></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-input v-model="stuForm.sex" readonly></el-input>
      </el-form-item>
      <el-form-item label="班级:">
        <el-input v-model="stuForm.className" readonly></el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <el-input v-model="stuForm.password" :type='isPass?"password":"text"'>
          <i slot="suffix" :class="isPass?'el-input__icon el-icon-turn-off':'el-input__icon el-icon-open'" @click="showPass" ></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="float:right;" :disabled="stuForm.stuId==''" @click="change()">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="teaForm" v-show="ruleForm.selectValue=='1'">
    <el-form :model="teaForm" label-position="left" label-width="60px">
      <el-form-item label="教师Id:">
        <el-input v-model="teaForm.teaId" readonly></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="teaForm.teaName" readonly></el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <el-input v-model="teaForm.password" :type='isPass?"password":"text"'>
          <i slot="suffix" :class="isPass?'el-input__icon el-icon-turn-off':'el-input__icon el-icon-open'" @click="showPass" ></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="text" @click="newTeacher()">增加教师？</el-button> -->
        <el-button style="float:right;" :disabled="teaForm.teaId==''" @click="change()">确认修改</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-dialog title="增加新的教师" :visible.sync="dialogForm1Visible" width="300px;">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="教师工号"  prop="teachId" :label-width="labelWidth">
          <el-input style="width:250px;" v-model="form.teachId" autocomplete="off" :maxlength="10" show-word-limit ></el-input>
        </el-form-item>
        <el-form-item label="教师姓名"  prop="teaName" :label-width="labelWidth">
          <el-input style="width:250px;" v-model="form.teaName" autocomplete="off" :maxlength="10" show-word-limit ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm1Visible = false">取 消</el-button>
        <el-button type="primary" @click="updateTea()">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
data() {
    var validateInputvalue = (rule, value, callback) => {
        var numReg = /^[0-9]*$/;
        var numRe = new RegExp(numReg);
        if (!value) {
            return callback(new Error('Id账号不能为空'));
        } else if (!numRe.test(value)) {
            return callback(new Error('Id账号不正确..'));
        } else {
            callback();
        }
    };
      return {
      icon:"el-input__icon el-icon-view",
      isPass:true,
      ruleForm:{
        inputValue: '',
        selectValue: '2',
      },
      stuForm:{
        stuId:'',
        stuName:'',
        sex:'',
        className:'',
        password:'',
      },
      teaForm:{
        teaId:'',
        teaName:'',
        password:'',
        course:[],
      },
      rules:{
        inputValue:[
          //{ required: true, message: '请输入Id账号', trigger: 'blur' },
          {validator:validateInputvalue,trigger:'blur'},
          { min: 10, max: 10, message: 'Id账号的长度为10', trigger: 'blur' }
        ]
      },
      /* dialogForm1Visible:false,
      form:{
        teachId:'',
        teaName:'',
      }, */
      };
},
methods: {
  showPass(){//点击图标是密码隐藏或显示
      this.isPass=!this.isPass;
  },
  search(){
    /* var len=strlen(this.inputValue);
    if(len==10){ */
      var api="http://localhost:8082/manage/search.php";
      var params=new URLSearchParams();
      params.append('id',JSON.parse(sessionStorage.getItem('userid')));
      params.append('selectValue',this.ruleForm.selectValue);
      params.append('inputValue',this.ruleForm.inputValue);
      axios.post(api,params).then(res=>{
        if(res.data['submitInfo']=="success"){
          this.ruleForm.inputValue="";
            if(this.ruleForm.selectValue=="1"){  //教师
              this.teaForm.teaId=res.data['teaId'];
              this.teaForm.teaName=res.data['teaName'];
              this.teaForm.password=res.data['password'];
              this.teaForm.course=res.data['course'];
            }else{
              this.stuForm.stuId=res.data['stuId'];
              this.stuForm.stuName=res.data['stuName'];
              this.stuForm.sex=res.data['sex'];
              this.stuForm.className=res.data['className'];
              this.stuForm.password=res.data['password'];
            }
        }else{
          this.$message.error(res.data['submitInfo']);
        }
      
      })
    /* }else{
      alert("请输入合法Id账号")
    } */
    
  },
  successInfo() {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      },
  change(){
    var api="http://localhost:8082/manage/change.php";
    var params=new URLSearchParams();
    if(this.ruleForm.selectValue=="1"){  //教师
      params.append('teaId',this.teaForm.teaId);
      params.append('password',this.teaForm.password);
    }else{
      params.append('stuId',this.stuForm.stuId);
      params.append('password',this.stuForm.password);
    }
    params.append('selectValue',this.ruleForm.selectValue);
    axios.post(api,params).then(res=>{
      if(res.data=="success"){
        this.successInfo();
      }else{
        this.$message.error("修改失败");
      }
    })
    
  },
  /* newTeacher(){ //增加新教师按钮
    this.dialogForm1Visible=true;
  }, */
},
}
</script>

<style lang="scss" scooped>
.userInfo{
  width: 60%;
  display: block;
  margin: 0 auto;
  .stuForm{
    width: 50%;
    padding-top: 50px;
    margin: 0 auto;
    .el-input__icon{
      color: #409EFF;
    }
  }
  .teaForm{
     padding-top: 50px;
    width: 50%;
    margin: 0 auto;
    .el-input__icon{
      color: #409EFF;
    }
  }
   .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>