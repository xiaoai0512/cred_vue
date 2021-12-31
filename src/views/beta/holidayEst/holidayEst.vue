<template>
  <div style="width:80%;margin-left: 10%;margin-top: 2%;">
    <FullCalendar
      ref="fullCalendar"
      defaultView="dayGridMonth"
      locale="zh-cn"
      :header="{
        left: 'prev,next today',
        center: 'title',
        right: ''
      }"
      :buttonText="buttonText"
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      :eventLimit="true"
      eventLimitText="更多"
      @dateClick="handleDateClick"
      />
<!-- :events="getCalendarEvents"   @eventClick="handleEventClick"-->
    <div v-show="dataDiv">
      <div class="text_title padLf10" style="color:#333">设置处理状态:</div>
      <el-form ref="holidayForm" :model="holiday" >
            <el-form-item class="cl_td" label="节假日编号：" prop="holidayNoInfut" v-show="isInput">
                <el-input v-model="holiday.holidayNoInfut" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="节假日编号：" prop="holidayNoSelect" v-show="isSelect">
                <el-select v-model="holiday.holidayNoSelect" class="wd200" clearable>
                    <el-option
                    v-for="(item, index ) in holidayNoArr"
                    :key="index"
                    :label="item.holidayNo"
                    :value="item.holidayNo"
                    />
                </el-select>
            </el-form-item>
            <el-button size="medium" type="primary" v-show ="selFlag" @click="handleSearch()" >取消</el-button>
            <el-button size="medium" icon="el-icon-plus" type="primary" v-show ="addFlag" @click="handleCreate()" >新增</el-button>
        </el-form>
        <el-table  :data="hDays"  border stripe style="width: 100%">
            <el-table-column prop="numNo" label="序号" align="center"  width="100"
                type="index">
            </el-table-column>
            <el-table-column label="日期"  align="center" >
                <template slot-scope="scope" >    
                    <el-input v-model="scope.row.ymd" readonly/>
                </template>
            </el-table-column>
            <el-table-column label="处理状态"  align="center" >
                <template slot-scope="scope" >   
                    <el-select v-model="scope.row.holidayStatus">
                      <el-option v-for="(item, index) in statusOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select> 
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-delete" type="primary" @click="delBtn(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
        <div style="text-align: center; margin-top: 10px;">
          <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleSave()" >保存</el-button>
        </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'fullcalendar_page',
  components: {
    FullCalendar
  },
  data () {
    return {
      holiday: {},
      buttonText: {
        today: '今天',
        month: '月',
        week: '周',
        day: '天',
        list: '列表'
      },
      calendarPlugins: [ // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      hDays: [],
      hData: [],
      statusOptions: [],
      holidayNoArr: [],
      calendarWeekends: true,
      calendarApi: null,
      isInput:false,
      isSelect:true,
      selFlag:false,
      addFlag:true,
      dataDiv:false

    }
  },
  methods: {
    handleDateClick (arg) {
      this.dataDiv = true
      let data1 = arg.dateStr.substring(0,4)
      let data2 = arg.dateStr.substring(5,7)
      let data3 = arg.dateStr.substring(8,10)
      let data4 = data1 + data2 + data3
      console.log(data1 + data2 + data3) 
      if(this.hData.length > 0){
        if (this.hData.indexOf(data4) != -1) {
          this.hDays.forEach((item,index) => {
            if(item.ymd == data4){
              arg.dayEl.classList.remove("selday");//设定为选中样式
              this.hDays.splice(index,1)
              this.hData.forEach((item1,index1) => {
                if(item1 == data4){
                  this.hData.splice(index1,1)
                }
              });
            }
          });
        } else {
          let hDaysStr = {'ymd':data4,'holidayStatus':'O','arg':arg}
          arg.dayEl.setAttribute("class", "selday");//设定为选中样式
          this.hDays.push(hDaysStr)
          this.hData.push(data4)
        }
      }else{
        let hDaysStr = {'ymd':data4,'holidayStatus':'O','arg':arg}
        arg.dayEl.setAttribute("class", "selday");//设定为选中样式
        this.hDays.push(hDaysStr)
        this.hData.push(data4)
      }
    },
    //取消
    handleSearch (){
      this.addFlag = true
      this.selFlag = false
      this.isSelect = true
      this.isInput = false
      this.holiday.holidayNoInfut = ''
    },
    //新增
    handleCreate (){
      this.selFlag = true
      this.isInput = true
      this.addFlag = false
      this.isSelect = false
      this.holiday.holidayNoSelect = ''
    },
    delBtn (index){
       this.hDays[index].arg.dayEl.classList.remove("selday")
       this.hDays.splice(index,1)
       this.hData.splice(index,1)
    },
    //保存
    handleSave (){
      let dayResult = ''; 
      let dayInfo = {};
      dayInfo.dayResultList = [];
      if(this.hDays.length == 0){
        this.$message({
            message: '请选择日期',
            type: 'warning'
        })
      }else{
        for(var m=0;m<this.hDays.length;m++){
          dayResult = {'holidayDate':this.hDays[m].ymd,'holidayStatus':this.hDays[m].holidayStatus};
          dayInfo.dayResultList.push(dayResult);
        }
        if(this.holiday.holidayNoInfut){
          dayInfo.holidayNo = this.holiday.holidayNoInfut;
        }else if(this.holiday.holidayNoSelect){
         dayInfo.holidayNo = this.holiday.holidayNoSelect;
        }else{
          this.$message({
              message: '请输入节假日编号',
              type: 'warning'
          })
          return;
        }
        this.post('/beta/betaService/COS.AD.02.0035', dayInfo, (res) => {
            if(res.returnCode == '000000') {
              this.getSelectDict( "/beta/betaService/COS.IQ.02.0041",{holidayNoFlag:'1'}).then(res => {
                this.holidayNoArr = res
              }) 
                this.hDays.forEach((item,index) => {
                  console.log(item)
                  item.arg.dayEl.classList.remove("selday")
                })
                dayInfo = {}
                this.hDays = []
                this.hData = []
                this.isInput = false
                this.isSelect = true
                this.selFlag = false
                this.addFlag = true
                this.holiday.holidayNoInfut = ''
                this.holiday.holidayNoSelect = ''
                this.dataDiv = false
                this.$notify({
                    message: '设置成功',
                    type: 'success',
                })
            }
        })  

      }
    }
  },
  mounted () {
    //处理状态
    this.getSelectDict( "dic_holidayStatus").then(res => {
        this.statusOptions = res
    }),
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0041",{holidayNoFlag:'1'}).then(res => {
      this.holidayNoArr = res
    }) 
  }
}
</script>

<style lang='less'>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
</style>
