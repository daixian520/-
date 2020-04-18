<template>
<div class="header">
    <div class="logo"><img src="../../assets/image/logo.png" class="img"></div>
    <div class="user">
    <div class="userinfo">
        <div class="info" style="justify-content: space-around;">
            <span>{{this.username}}</span>
            <span 
            style="display:inline-block;margin-right:15px; 
            font-family: Arial, Helvetica, sans-serif;line-height:1.5">({{this.userid}})</span>
            <span>欢迎您使用本系统</span>
        </div>
        <div class="info" style="justify-content: space-around;">
            <span style="display:inline-block;margin-right:15px;">角色：{{this.userole}}</span>
            <schoolYear></schoolYear>
        </div>
        <div class="info" style="justify-content:end;">
            <button @click="LoginOut()">LoginOut</button>
        </div>
    </div>
    </div>
</div>  
</template>
<script>
import Axios from 'axios';
import schoolYear from '../home/schoolYear.vue';
export default {
    name:'top',
  components: {
    schoolYear,
  },
  props: {},
  data() {
    return {
      userid:JSON.parse(sessionStorage.getItem('userid')),
      username:JSON.parse(sessionStorage.getItem('username')),
      userole:JSON.parse(sessionStorage.getItem('userole')),
      isLogin:JSON.parse(sessionStorage.getItem('isLogin')),
    };
  },
   created(){
  },
  methods:{
    LoginOut(){
       this.isLogin=false;
       sessionStorage.removeItem('userid')
       sessionStorage.removeItem('username')
       sessionStorage.removeItem('userole')
      this.$router.replace({
        path:'/',
      })
    },
  }

};
</script>
<style  scoped lang="scss">
.header{
  display: flex;
  flex-direction: row;
  background-color:#2f90b9;  
  width:100%;
  height: auto;
  text-align: center;
  justify-content: space-between;
    .logo{
      display: flex;
      align-items: center;
      margin-right: 30px;
    }
    .user{
      display: flex;
      flex-direction: column;
      width: auto;
      justify-content: end;
      color: white;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
      .userinfo{
        display: flex;
        flex-direction: column;
        width:auto;
        justify-content:end;
    }
      .info{
        display: flex;
        flex-direction: row;
        align-self: flex-end;
        margin-top:12px;
      }
    }
  }
</style>