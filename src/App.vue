<template>
  <div id="app">    
  <router-view  />
  </div>
</template>
<script>
export default {
  provide(){
    return{
    }
  },
  data(){
    return{
    }
  },
  methods:{
   /*  reload(){
      this.isRouterAlive=false
      this.$nextTick(function(){
        this.isRouterAlive=true
      })
    } */
  }
}
</script>>
<style lang="scss" scoop>
 #app{
  height: 100%;
  width: 100%;
}
 body,html{
  height: 100%;
  width: 100%;
  margin: 0px;
}
</style>
