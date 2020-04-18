<template>
  <div class="grade">
<el-collapse v-model="activeName" accordion>
  <el-collapse-item  name="1">
    <template slot="title">
      <i class="icon-table"></i>成绩表格
    </template>
    <div class="table">
        <el-table
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            :default-sort = "{prop: 'stuId', order: 'ascending'}"
            style="width:90%"
            stripe
            border
            size="mini">
            <el-table-column
                prop="stuId"
                label="学号"
                sortable
                width="180">
            </el-table-column>
            <el-table-column
                prop="className"
                label="班级"
                width="200">
            </el-table-column>
            <el-table-column
                prop="stuName"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="checkGrade"
                label="成绩"
                sortable
                width="180">
            </el-table-column>
        </el-table>
         <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"></el-pagination>
    </div>
  </el-collapse-item>
  <el-collapse-item  name="2">
    <template slot="title">
      <i class="icon-charts"></i>成绩图
    </template>
    <div id="myChart" :style="{width: '600px', height: '400px'}"></div>
  </el-collapse-item>
  <el-collapse-item  name="3">
    <template slot="title">
      <i class="icon-charts"></i>成绩分布区间图
    </template>
    <div id="gradeRange" :style="{width: '500px', height: '450px'}"></div>
  </el-collapse-item>
</el-collapse>
</div>
</template>

<script>
import axios from 'axios';
import echarts from 'echarts';
export default {
data() {
    return {
        tableData:[],
        activeName:'1',
        pagesize:10,
        currentPage:1,
        pieData:'',

    };
},
created(){
    var api="http://localhost:8082/teacher/teaGrade.php";
    var params=new URLSearchParams();
    params.append('id',JSON.parse(sessionStorage.getItem('userid')));
    params.append('courseName',sessionStorage.getItem('courseName'));
    params.append('className',sessionStorage.getItem('className'));
    params.append('report_order',sessionStorage.getItem('report_order'));
    axios.post(api,params).then(res=>{
         this.tableData=res.data['tableData'];
         this.pieData=res.data['gradeRange'];
         //console.log(this.pieData);
         this.drawBar();
         this.drawPie();
        /* this.echarData=res.data['echarData'];
         */
        // console.log(this.echarData);
    })
},
mounted(){},
methods:{
    handleSizeChange(size) {
      this.pagesize=size;
        //console.log(this.pagesize);
      },
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage;
        //console.log(this.currentPage);
      },
  drawPie(){
        /* var piePatternImg = new Image();
        piePatternImg.src = piePatternSrc;
        var bgPatternImg = new Image();
        bgPatternImg.src = bgPatternSrc;
 */
        var itemStyle = {
            normal: {
                opacity: 0.7,
                color: {
                    //image: piePatternImg,
                    //repeat: 'repeat'
                },
                borderWidth: 3,
                borderColor: '#235894'
            }
        };
     let gradeRange = this.$echarts.init(document.getElementById('gradeRange'))
        var option = {
            title: {
                text: '成绩区间图',
                //subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ["低于80分", "80分到90分之间", "90分到95分", "95分到100分"]
                //data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
                {
                    name: '区间',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data:this.pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

            //防止越界，重绘canvas
            window.onresize = gradeRange.resize;
            gradeRange.setOption(option);//设置option
    },
  drawBar(){
    var stuId=[];//实验报告序号新数组
        var grade  = [];//成绩数组
        var j1 = 0;
        var j2 = 0;
        for(let i in this.tableData){
            stuId[j1++] = this.tableData[i].stuId;
            grade[j2++] = this.tableData[i].checkGrade;
        }
    var dataAxis = stuId;
    var data = grade;
    var yMax = 100;
    var dataShadow = [];
    for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }
    let myChart = this.$echarts.init(document.getElementById('myChart'))
    var option = {
            title: {
                text: '学生成绩图',
                //subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
                textStyle:{//标题内容的样式
					          //color:'#e4393c',//京东红
                    fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                    fontWeight:"lighter",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                    fontFamily:"san-serif",//主题文字字体，默认微软雅黑
                    fontSize:18//主题文字字体大小，默认为18px
                    },
                    left:"center",
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                },
                top:20,
            },
            tooltip:{
                trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
            },
            xAxis: {
                data: dataAxis,
                type: 'category',
                name:'学号',
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: 'black'
                    }
                },
                /* axisTick: {
                    show: false
                }, */
                axisLine: {
                    show: true
                },
                splitLine:{
                show:false
                },

                z: 10
            },
            yAxis: {
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                },
                splitLine:{
                 show:false
                },
                //top:250,

            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                
                { // For shadow
                    name:'满分',
                    type: 'bar',
                    itemStyle: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    data: dataShadow,
                    animation: false
                },
                {
                    type: 'bar',
                    name:"成绩",
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#2378f7'},
                                    {offset: 0.7, color: '#2378f7'},
                                    {offset: 1, color: '#83bff6'}
                                ]
                            )
                        }
                    },
                    data: data
                },
            ]
        };

// Enable data zoom when user click bar.
    var zoomSize = 6;
    myChart.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
    });
    //window.onresize = myChart.resize;
    myChart.setOption(option);//设置option
 },
},
}
</script>

<style sooped>
#myChart{
    margin-top: 20px;
    margin: 0 auto;
}
#gradeRange{
    margin: 0 auto;
}
</style>
<style lang="scss">
.grade{
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