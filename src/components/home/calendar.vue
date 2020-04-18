<template>
  <div class="calendar">
      <el-calendar v-model="date">
     </el-calendar>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
        date: new Date(),
    };
  },
};
</script>
<style lang="scss" scope>
.calendar{
    //height: 40%;
    width: 100%;
    display: flex;
    .el-calendar-table .el-calendar-day{
      height: auto;
    }
  .el-calendar__title{
      font-size: 10px;
  }
  .el-button--mini, .el-button--mini.is-round{
      padding: 2px 5px;
  }
  .el-calendar-table{
      font-size: 10px;
  }
}
</style>