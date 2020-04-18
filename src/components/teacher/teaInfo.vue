<template>
<div class="stuInfo">
<el-form  :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="旧密码：" prop="oldPass">
    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码：" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认新密码：" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass"  autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item style="display:flex;justify-content:center">
    <el-button type="primary" @click="submitForm('ruleForm')" icon="el-icon-position" >提交</el-button>
    <el-button @click="resetForm('ruleForm')" icon="el-icon-refresh-right">重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
import axios from 'axios';
  export default {
    data() {
      var validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          /* if (this.ruleForm.oldPass !== '') {
            this.$refs.ruleForm.validateField('oldPass');
          } */
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(this.ruleForm.pass==this.ruleForm.oldPass){
              callback(new Error('新密码与旧密码一致'));
        }else{
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.checkPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        message:'',
        rules: {
          oldPass: [
            { validator: validateOldPass, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           var api="http://localhost:8082/teacher/teaInfo.php";
           var params=new URLSearchParams();
           params.append('id',JSON.parse(sessionStorage.getItem('userid')));
           params.append('oldPass',this.ruleForm.oldPass);
           params.append('pass',this.ruleForm.pass);
           axios.post(api,params).then(res=>{
               if(res.data=="success"){
                  this.open();
               }else{
                   this.message=res.data;
                   this.open3();
               }
           })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      open() {
        this.$alert('密码修改成功，需要重新登录', '密码修改', {
          confirmButtonText: '确定',
          callback: action => {
          this.$router.push({
            path:'/',
            query:{
            },
          })
          }
        });
       },

     open3() {
        this.$message({
          message: this.message,
          type: 'warning'
        });
      },
    }, 
  }
</script>

<style lang="scss" scooped>
 .el-form{
    display: block;
    width: 50%;
}
</style>