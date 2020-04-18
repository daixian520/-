<template>
<div class="grade">
<el-collapse v-model="activeName" accordion>
  <el-collapse-item  name="1">
    <template slot="title">
      <i class="icon-table"></i>成绩表格
    </template>
    <div class="table">
        <el-table
            :data="tableData"
            style="width:90%"
            stripe
            border
            size="mini">
            <el-table-column
                prop="reportOrder"
                label="实验序号"
                width="100">
            </el-table-column>
            <el-table-column
                prop="title"
                label="实验名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="checkGrade"
                :formatter="checkGrade"
                label="实验成绩"
                width="180">
            </el-table-column>
            <el-table-column
                prop="avgGrade"
                label="班级平均成绩"
                :formatter="avgFormatter"
                width="180">
            </el-table-column>
            <el-table-column
                prop="rownum"
                label="班级排名"
                :formatter="rownum"
                width="180">
            </el-table-column>
        </el-table>
    </div>
  </el-collapse-item>
  <el-collapse-item  name="2">
    <template slot="title">
      <i class="icon-charts"></i>成绩图表
    </template>
    <div id="myChart" :style="{width: '400px', height: '450px'}"></div>
  </el-collapse-item>
</el-collapse>
</div>
</template>
<script>
import axios from 'axios';
name:'stuGrade'
export default {
data() {
    return {
        tableData:[],
        activeName:'1',
        chart: "",
    };
},
created(){
    var api="http://localhost:8082/student/stuGrade.php";
    var params=new URLSearchParams();
    params.append('stuId',JSON.parse(sessionStorage.getItem('userid')));
    params.append('courseName',sessionStorage.getItem('courseName'));
    axios.post(api,params).then(res=>{
         this.tableData=res.data['tableData'];
        this.echarData=res.data['echarData'];
        this.draw();
        // console.log(this.echarData);
    })
        
},
mounted(){      
},
methods:{
    checkGrade(row,column){
       var num=parseInt(row.checkGrade);
       if(isNaN(num)){
           return "暂无成绩";
       }else{
           return num;
       }
    },
    avgFormatter(row, column){
        var num=parseFloat(row.avgGrade).toFixed(2);//将平均成绩保留后两位数(四舍五入)
        if(isNaN(num)){
            return "无数据";
        }else{
            return num;
        }
    },
    rownum(row,column){
       var num=parseFloat(row.avgGrade).toFixed(2);
       if(isNaN(num)){
           return "无排名";
       }else{
           return row.rownum;
       }
    },
    draw(){
        var newReportOrder  = [];//实验报告序号新数组
        var newGrade  = [];//成绩数组
        var newavgGrade=[];//平均成绩数组
        var j1 = 0;
        var j2 = 0;
        var j3=0;
        for(let i in this.tableData){
            newReportOrder[j1++] = this.tableData[i].reportOrder;
            newGrade[j2++] = this.tableData[i].checkGrade;
            newavgGrade[j3++]=this.tableData[i].avgGrade;
        }
       
        //this.daylist=newArrayday;//定义
            // 初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            var option = {
                 color: ['#3398DB'],
                title:{
                    text:'学生成绩图',
                    textStyle:{//标题内容的样式
					//color:'#e4393c',//京东红
					fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
					fontWeight:"lighter",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
					fontFamily:"san-serif",//主题文字字体，默认微软雅黑
                    fontSize:18//主题文字字体大小，默认为18px
                    },
                    left:"center",
                    //textAlign:'center',
				},
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    },
                    top:25,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top:'28%',
                    containLabel: true
                },
                legend:{
                    top:70,
                    orient:'horizontal',//默认横向布局，纵向布局值为'vertical'
                },
                xAxis: [
                    {
                        type: 'category',
                        name:'实验序号',
                        data: newReportOrder,
                        axisTick: {
                            alignWithLabel: true
                        },

                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:'分数',}
                    ],
                    series: [
                        {
                            name: '实验成绩',
                            type: 'bar',
                            barWidth: '60%',
                            data:newGrade
                        },
                        {
                            name: '平均成绩',
                            data:newavgGrade,
                            type: 'line',
                            symbol: 'emptyCircle',
                            symbolSize: 5,
                            lineStyle: {
                                color: 'red',
                                width: 2,
                                //type: 'dashed'
                            },
                            itemStyle: {
                             normal:{
                                borderWidth: 3,
                                borderColor: 'red',
                                color: 'red',
                                /* label:{
                                    formatter:function(value){
                                    var num=parseFloat(value).toFixed(2);
                                    if(isNaN(num)){
                                        return "无排名";
                                    }else{
                                        return num;
                                    }}
                                } */
                            }
                            },
                            
                        }
                    ] 
            }
            //防止越界，重绘canvas
            window.onresize = myChart.resize;
            myChart.setOption(option);//设置option
        }
},
watch:{
},
}
</script>

<style  lang="scss" scoped>
.grade{
    width: 100%;
    .table{
        width: 100%;
        display: block;
    }
    #myChart{
        width: 100%;
        display: block;
        margin: 0 auto;
    }
}
</style>
<style lang="scss">
.grade{
    .table{
        .el-table{
            margin: 0 auto;
        }
    }
    
   .el-collapse-item__arrow{
       margin: 0px;
       order: -1;
       margin-right: 10px;
   }
   .icon-charts{
       font-size: 20px;
       margin-right: 10px;
   }
    .icon-table{
       font-size: 20px;
       margin-right: 10px;
   }
} 
</style>