<template>
  <div :v-model="time" class="schoolYear">学年：{{this.time}}</div>
</template>

<script>
import Axios from 'axios';
export default {
  components: {},
  props: {},
  data() {
    return {
        time:'',
    };
  },
  created(){
    var api="http://localhost:8082/schoolYear.php"
    Axios.post(api).then(res=>{
      this.time=res.data;
      //sessionStorage.setItem("schoolYear",JSON.stringify(this.time));
    }).catch(err=>{
      console.log(res.err);
    })
  },
};
</script>
<style  scoped>
.schoolYear{
  font-family: Arial, Helvetica, sans-serif;
  padding-right: 10px;
}
</style>