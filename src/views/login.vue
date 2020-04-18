<template>
<body>
  <div class="login">
    <el-form :model="formLabelAlign" ref="login"  class="elForm">
      <h1 style="color:white">实验报告管理系统</h1>
      <div class="info">
      <el-form-item  prop="id" >
        <el-input 
          placeholder="UserName"
          v-model="formLabelAlign.id">
          <el-button slot="prepend" icon="icon-user"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item   prop="password">
        <el-input
          placeholder="Password"
          type="password"
          v-model="formLabelAlign.password"
          show-password>
          <el-button slot="prepend" icon="icon-password"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item  prop="sidentify">
        <el-row :gutter="2" type="flex">
          <el-col :xs="15" :sm="16" :md="16" :lg="16">
            <el-input placeholder="Sidentify" v-model="formLabelAlign.sidentify">
              <el-button slot="prepend" icon="icon-sidentify"></el-button>
            </el-input>
          </el-col>
          <el-col :xs="9" :sm="8" :md="8" :lg="8">
            <div class="img">
              <img :src="this.url" alt="加载中..." title="看不清？点击图片换一张"  @click="changeCode" >
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-radio-group  v-model="radio" class="elFormItem">
          <el-radio :label="3">学生</el-radio>
          <el-radio :label="2">教师</el-radio>
          <el-radio :label="1">管理员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="elFormItem">
        <div style="display:flex;flex-direction:row;justify-content:space-between;width:100%">
          <el-checkbox style="display:inline-flex;align-items:center;" v-model="checked">记住?</el-checkbox>
          <el-button style="display:inline-flex"   @click="submitForm('formLabelAlign')">登录</el-button>
        </div>
      </el-form-item>
      </div>
    </el-form>
  </div>
  <ul class="bg-bubbles">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</body>
</template>
<script>
import axios from 'axios'
import Cookies from 'js-cookie'
export default {
  name:'login',
    data() {
      return {
        radio: 3,
        formLabelAlign: {
          id: '',
          password: '',
          sidentify:'',
          loginstatus:"",
        },
        isLogin:'',
       url:'http://localhost:8082/test.php',
        checked:false,
      };
    },
    components:{
    },
    mounted(){
    this.formLabelAlign.id=Cookies.get('userId')
    this.formLabelAlign.password=Cookies.get('userPassw')
    // this.reload();
    },
    methods:{
      changeCode(){
        this.url="http://localhost:8082/test.php?"+Math.random();//链接后面加入一个随机数是为了防止缓存
      },
      submitForm(){
        // var self=this;
        var api="http://localhost:8082/login.php"
        var params=new URLSearchParams()
        params.append('id',this.formLabelAlign.id)
        params.append('password',this.formLabelAlign.password)
        params.append('sidentify',this.formLabelAlign.sidentify)
        params.append('role',this.radio)
        axios.defaults.withCredentials = true; //让ajax携带cookie
        axios.post(api,params,
        {headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
          this.loginstatus=res.data['loginfo']
          if(this.loginstatus=="登录成功！"){
            this.isLogin=true;
            sessionStorage.setItem('userid',JSON.stringify(this.formLabelAlign.id));
            sessionStorage.setItem('username',JSON.stringify(res.data['username']));
            sessionStorage.setItem('userole',JSON.stringify(res.data['userole']));
            sessionStorage.setItem('isLogin',JSON.stringify(this.isLogin));
            sessionStorage.setItem('schoolYear',JSON.stringify(res.data['schoolYear']));
            /* 根据不同的角色进入不同的页面 */
            if(this.radio=="3"){
              var nextPath='/home/stuCourse';
            }else{
              if(this.radio=="2"){
                var nextPath='home/teaCourse';
              }else{
                var nextPath='home/manageStu';
              }
            }
            this.$router.push({
              path:nextPath,
               query:{
                userid:this.formLabelAlign.id,
                username:res.data['username'],
                userole:res.data['userole']
              } 
            })
              if(this.checked==true){
                /* let userId=this.formLabelAlign.id;
                let userPassw=this.formLabelAlign.password; */
                Cookies.set('userId',this.formLabelAlign.id);
                Cookies.set('userPassw',this.formLabelAlign.password);
              }
              // }else{
              // }
          }else{
            this.alert()
          }
        })/* .catch(e=>{
          //  console.log(e)
        }); */
      },
      alert(){
      this.$confirm(this.loginstatus, '错误提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          // this.$message({
          // });
        }).catch(() => {
          // this.$message({
          // });          
        });
      },
    }
  }
</script>
<style  scoped lang="scss"> 
body{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2f90b9;
	background: -webkit-linear-gradient(to bottom right, #2f90b9 50%, #5698c3 50%);
	background: linear-gradient(to bottom right, #2f90b9 50%, #5698c3 50%);
	background-size:cover;
	background-attachment: fixed;
  overflow-x: hidden;
  padding: 0; 
  margin: 0;
  .login{
    position: absolute;
    z-index: 2;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    height: 550px;
    width: 40%;
    .elForm{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .info{
        display: flex;
        position: relative;
        padding: 20px;
        width: 60%;
        flex-direction:column;
        justify-content:flex-start;
      }
      .img{
        display: flex;
        width: auto;
        height: 38px;
        justify-content: flex-end;
      }
      .elFormItem{
        display: flex;
        position: relative;
        width: 100%;
        flex-direction:row;
        justify-content:space-between;
        }
    }
}
}

.bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:1;
}
ul,li {
    margin: 0;
    padding: 0;
}
.bg-bubbles li {
    position: absolute;
    list-style: none;
    display: block;
    width: 40px;
    height: 40px;
    background-color: rgba(255,255,255,.15);
    bottom: -0px;
    -webkit-animation: square 25s infinite;
    animation: square 25s infinite;
    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;
}
.bg-bubbles li:nth-child(1) {
	left: 10%
}

.bg-bubbles li:nth-child(2) {
	left: 20%;
	width: 80px;
	height: 80px;
	-webkit-animation-delay: 200ms;
	animation-delay: 200ms;
	-webkit-animation-duration: 17s;
	animation-duration: 17s
}

.bg-bubbles li:nth-child(3) {
	left: 25%;
	-webkit-animation-delay: 400ms;
	animation-delay: 400ms
}

.bg-bubbles li:nth-child(4) {
	left: 40%;
	width: 60px;
	height: 60px;
	-webkit-animation-duration: 10s;
	animation-duration: 10s;
	background-color: rgba(255, 255, 255, .25)
}

.bg-bubbles li:nth-child(5) {
	left: 70%
}

.bg-bubbles li:nth-child(6) {
	left: 80%;
	width: 120px;
	height: 120px;
	-webkit-animation-delay: 3s;
	animation-delay: 3s;
	background-color: rgba(255, 255, 255, .2)
}

.bg-bubbles li:nth-child(7) {
	left: 32%;
	width: 100px;
	height: 100px;
	-webkit-animation-delay: 7s;
	animation-delay: 7s
}

.bg-bubbles li:nth-child(8) {
	left: 55%;
	width: 20px;
	height: 20px;
	-webkit-animation-delay: 15s;
	animation-delay: 15s;
	-webkit-animation-duration: 40s;
	animation-duration: 40s
}

.bg-bubbles li:nth-child(9) {
	left: 25%;
	width: 10px;
	height: 10px;
	-webkit-animation-delay: 2s;
	animation-delay: 2s;
	-webkit-animation-duration: 40s;
	animation-duration: 40s;
	background-color: rgba(255, 255, 255, .3)
}

.bg-bubbles li:nth-child(10) {
	left: 90%;
	width: 100px;
	height: 100px;
	-webkit-animation-delay: 11s;
	animation-delay: 11s
}

@-webkit-keyframes square {
	0% {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}

	100% {
		-webkit-transform: translateY(-700px) rotate(600deg);
		transform: translateY(-700px) rotate(600deg)
	}

}

@keyframes square {
	0% {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}

	100% {
		-webkit-transform: translateY(-700px) rotate(600deg);
		transform: translateY(-700px) rotate(600deg)
	}

} 
</style>
<style lang="scss">
.elFormItem{
 .el-form-item__content{
   width: 100%;
   .el-checkbox{
     color:white;
   }
}
}

.el-radio{
    .el-radio__input{
    margin-right: 5px;
    cursor: pointer;
    font-size: 14px;
    width: 15px;
    height: 12px;
    position: relative;
    .el-radio__inner{
      border-radius:0px;
    }
    
     /*  content: "✓";
      display: block;
      position: relative;
      top: -2px;
      left: 3px;
      width: 12px;
      height:12px;
      color: whitesmoke;
      font-weight: 400;
      z-index: 1; */
    }
    .el-radio__label{
       color: white;
    }
    &.is-checked{
      position: relative;
      .el-radio__inner{
        display: none;
      }
      &:after {
        position: absolute;
        // margin-right: 5px;
        width: 14px;
        height: 14px;
        top: 1px;
        left: 3px;
        right: 1px;
        content: "✓";
        background-color:#5698c3;
        color: #fff;
        display: inline-block;
        visibility: visible;
        // padding: 0px 3px;
        // border-radius: 50%;
      }
    }
  }

</style>
// route指的就是一条路由，是一个单数
// routes是一组路由，把每一条路由组合起来形成一个数组
// router是一个机制，相当于一个管理者