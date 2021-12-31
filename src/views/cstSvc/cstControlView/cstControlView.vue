<!-- 客户管控视图 -->
<template>
    <div class="allContent">
        <el-form :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="查询方式" prop="queryFlag">
                <el-select clearable  v-model="queryForm.queryFlag" class="wd200" @change="getQueryFlag">
                    <el-option 
                    v-for="item in queryFlagOptions" 
                    :key="item.codes" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
                <!-- <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" /> -->
            </el-form-item>
            
            <div v-show="showHisDiv">
                <el-form-item class="cl_td" label="管控层级" prop="contrlLevel">
                    <el-select clearable  v-model="queryForm.contrlLevel" class="wd200">
                        <el-option 
                        v-for="item in contrlLevelOptions" 
                        :key="item.codes" 
                        :label="item.label" 
                        :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="起始时间" prop="startDate">
                    <el-date-picker
                        v-model="queryForm.startDate"
                        class="wd200"
                        type="date"
                        placeholder="选择起始时间"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptionsStart"
                        :clearable="true"
                        @change="changeStart"
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="结束时间" prop="endDate">
                    <el-date-picker
                        v-model="queryForm.endDate"
                        class="wd200"
                        type="date"
                        placeholder="选择结束时间"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptionsEnd"
                        :clearable="true"
                        @change="changeEnd"
                    />
                </el-form-item>
            </div>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
      
        <div v-if="showTable">
            <div class="text_title">客户基本信息</div>
            <el-form :model="baseInfoObj" :inline="true" class="demo-form-inline" style="padding-left: 20px;">
                <el-form-item class="mrgt20" label="证件类型" prop="idType">
                    <el-select v-model="baseInfoObj.idType" class="wd200" disabled>
                        <el-option v-for="(item, index) in idTypeList" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="mrgt20" label="证件号码" prop="idNumber">
                    <el-input v-model="baseInfoObj.idNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="" label="客户姓名" prop="customerName">
                    <el-input v-model="baseInfoObj.customerName" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title">客户业务项目</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="externalIdentificationNo" label="管控项目" align="center" width="240" >
                    <template slot-scope="{row}">
                        {{row.controlProjectNo}}
                        {{row.controlDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="mainSupplyIndicatorDesc" label="管控码" align="center" >
                    <template slot-scope="{row}">
                        {{row.effectivenessCodeType}}
                        {{row.effectivenessCodeScene}}
                    </template>
                </el-table-column>
                <el-table-column prop="contrlLevelDesc" label="管控层级" align="center"  />
                <el-table-column prop="levelCode" label="层级代码" align="center" />
                <el-table-column prop="invalidFlagDesc" label="币种" align="center" >
                    <template slot-scope="{row}">
                        {{row.currencyCode}}
                        {{row.currencyDesc}}
                    </template>
                </el-table-column>
                
                <el-table-column prop="contrlStartDate" label="开始日期" align="center" />
                <el-table-column prop="contrlEndDate" label="结束日期" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "220">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary"
                            v-if=" row.controlMode == 'E'"
                            @click="handle1(row)">管控事件</el-button>
                        <el-button size="mini" type="primary"
                            @click="handle2(row)">管理特殊情况</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            

            <!-- 管控事件 -->
            <el-dialog title="管控事件信息" :visible.sync="controEv_dialog"  width="85%">
                <common-table
                    :tableData="controEv_tableData"
                    :config="controEv_config"
                    :tableLabel="controEv_tableLabel"
                    @changePage="controEv_getList"
                ></common-table>
    
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="controEv_dialog = false">
                        关闭
                    </el-button>
                </div>
            </el-dialog>


            <!-- 管理特殊情况 -->
            <el-dialog title="管理特殊情况" :visible.sync="manageSpecail_dialog"  width="85%">
                <common-table
                    :tableData="manageSpecail_tableData"
                    :config="manageSpecail_config"
                    :tableLabel="manageSpecail_tableLabel"
                    @changePage="manageSpecail_getList"
                ></common-table>
    
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="manageSpecail_dialog = false">
                        关闭
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
  </template>
  
  <script>
  import Pagination from '@/components/Pagination'
import CommonTable from "@/components-ider/CommonTable";

  export default {
    name: 'cstControlView',
    components: {
      Pagination,
      CommonTable
    },
    data() {
      return {
        queryForm: {
            idType: '',
            idNumber: '',
            externalIdentificationNo: '',
            queryFlag: '0',
            contrlLevel: '',
            startDate: '',
            endDate: '',
        },
        showHisDiv: false,
        queryFlagOptions: [
            {
                detailDesc: '0 当前视图',
                codes: '0'
            },
            {
                detailDesc: '1 历史视图',
                codes: '1'
            }
        ],
        pickerOptionsStart: {}, //  起始时间
        pickerOptionsEnd:{}, // 结束时间
        showTable: false,
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData: [],
        curRowRadio: '',
        curRow: {},
        // 下拉框
        idTypeList: [],
        contrlLevelOptions: [], // 管控层级

        baseInfoObj: {},

        // 管控事件弹窗
        controEv_dialog : false,
        controEv_tableData : [],
        controEv_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        controEv_tableLabel: [
        {
            label: '管控项目',
            prop: 'controlProjectNoDesc'
        },{
            label: '管控项目',
            prop: 'controlProjectNoDesc'
        },{
            label: '管控动作',
            prop: 'controlFieldDesc'
        },{
            label: '事件编号',
            prop: 'eventNo'
        },{
            label: '事件描述',
            prop: 'eventDesc'
        }
        ],

        // 关联特殊状况
        manageSpecail_dialog : false,
        manageSpecail_tableData : [],
        manageSpecail_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        manageSpecail_tableLabel: [
        {
            label: '状况编号',
            prop: 'eventNoDescp'
        },{
            label: '状况描述',
            prop: 'eventDesc'
        },{
            label: '管控码',
            prop: 'effectivenessCodeTypeDesc'
        },{
            label: '场景触发对象层级',
            prop: 'sceneTriggerObjectLevelDesc'
        },{
            label: '场景触发对象代码',
            prop: 'sceneTriggerObjectCode'
        },{
            label: '币种',
            prop: 'currencyCodeDesc'
        },{
            label: '设置日期',
            prop: 'settingDate'
        },{
            label: '设置时间',
            prop: 'settingTime'
        },{
            label: '设置人员',
            prop: 'settingUpUserid'
        },{
            label: '解除人员',
            prop: 'removalUserid'
        },{
            label: '解除日期',
            prop: 'removeDate'
        },{
            label: '状态',
            prop: 'stateDesc'
        }
        ],
        

      }
    },
    created() {
  
    },
    mounted() {
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
      // 管控层级
        this.getSelectDict('dic_effectiveScope').then((res) => {
            res.forEach(element => {
                element.label = element.codes +'-'+element.detailDesc
                element.value = element.codes
            });
            this.contrlLevelOptions = res
        })
    },
    methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                queryFlag: '0',
                contrlLevel: '',
                startDate: '',
                endDate: '',
            }
            this.queryForm.queryFlag = '0'
            this.showHisDiv = false
            this.showTable = false
            this.tableData = []
        },
      // 重置
      reset() {
        this.init()
      },
      // 点击查询按钮
      handleSearch() {
        if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
          this.$message({
            message: '请输入查询信息',
            type: 'warning'
          })
          this.init()
        } else {
          if (this.queryForm.idType) {
            if (!this.queryForm.idNumber) {
              this.$message({
                message: '请输入证件号码',
                type: 'warning'
              })
            } else {


                if (this.queryForm.queryFlag == '1') {
                    if (!this.queryForm.contrlLevel) {
                        this.$message({
                            title: '提示',
                            message: '请输入管控层级',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                    if (!this.queryForm.startDate) {
                        this.$message({
                            title: '提示',
                            message: '请输入开始时间',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                    if (!this.queryForm.endDate) {
                        this.$message({
                            title: '提示',
                            message: '请输入结束时间',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                   this.getCustBaseInfo()
                } else {
                    this.getCustBaseInfo()
                }
            }
          } else if (this.queryForm.idNumber) {
            if (!this.queryForm.idType) {
              this.$message({
                message: '请输入证件类型',
                type: 'warning'
              })
            } else {
                if (this.queryForm.queryFlag == '1') {
                    if (!this.queryForm.contrlLevel) {
                        this.$message({
                            title: '提示',
                            message: '请输入管控层级',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                    if (!this.queryForm.startDate) {
                        this.$message({
                            title: '提示',
                            message: '请输入开始时间',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                    if (!this.queryForm.endDate) {
                        this.$message({
                            title: '提示',
                            message: '请输入结束时间',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                   this.getCustBaseInfo()
                } else {
                    this.getCustBaseInfo()
                }
            }
          } else {
            if (this.queryForm.queryFlag == '1') {
                    if (!this.queryForm.contrlLevel) {
                        this.$message({
                            title: '提示',
                            message: '请输入管控层级',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                    if (!this.queryForm.startDate) {
                        this.$message({
                            title: '提示',
                            message: '请输入开始时间',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                    if (!this.queryForm.endDate) {
                        this.$message({
                            title: '提示',
                            message: '请输入结束时间',
                            type: 'warning',
                            duration: 2000
                        })
                        this.showTable = false
                        this.tableData = []
                        return
                    }
                   this.getCustBaseInfo()
                } else {
                    this.getCustBaseInfo()
                }
          }
        }

      },
      // 查询方式联动
      getQueryFlag(val) {
        if (val == '0') {
            this.showHisDiv = false
            this.queryForm.contrlLevel = ''
            this.queryForm.startDate = ''
            this.queryForm.endDate = ''
        } else if (val == '1') {
            this.showHisDiv = true
        }
      },
      // 查询列表 
      getList(obj) {
        this.config.loading = true
        let params = {
            customerNo: obj.customerNo,
            idNumber: obj.idNumber,
            idType: obj.idType,
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_scenarioTriggerType'],//查找数据字典所需参数
			transDict : ['contrlLevel'],//翻译前后key
        }
        params = Object.assign(params , this.config, this.queryForm)
        this.getTableList('/nonfi/nonfinanceService/BSS.OP.01.0010', params, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                    this.config.total = 0
                }
            }
        })
      },
      // 获取客户基本信息
      getCustBaseInfo () {
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryForm, (res) => {
            if (res.returnCode == '000000') {
                this.baseInfoObj.idNumber = res.returnData.idNumber
                this.baseInfoObj.idType = res.returnData.idType
                this.baseInfoObj.customerName = res.returnData.customerName
                this.baseInfoObj = res.returnData
                this.getList(this.baseInfoObj)
            }
        })
      },
        // 开始时间改变事件
        changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.queryForm.startDate).getTime()
                }
            })
        },
        // 结束时间改变事件
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.queryForm.endDate).getTime()
                }
            })
        },
        // 管控事件
        handle1(row) {
            this.controEv_dialog = true
            // console.log(row)
            this.controEv_getList(row)
        },
        controEv_getList(row) {
            this.controEv_config.loading = true
            let params = {
                idNumber: this.baseInfoObj.idNumber,
                idType: this.baseInfoObj.idType,
                externalIdentificationNo: this.queryForm.externalIdentificationNo,
                queryFlag: this.queryForm.queryFlag,
                contrlLevel: this.queryForm.contrlLevel,
                startDate: this.queryForm.startDate,
                endDate: this.queryForm.endDate,
                customerNo: this.baseInfoObj.customerNo,
                customerName: this.baseInfoObj.customerName
            }
            params = Object.assign(params , this.controEv_config)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0011', params, (res) => {
                if (res.returnCode == '000000') {
                    this.controEv_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rows = res.returnData.rows
                        rows.forEach(item => {
                            item.controlProjectNoDesc = item.controlProjectNo+ ' '+item.controlDesc
                            if (item.controlField == 'NE') {
                                item.controlFieldDesc = '禁止执行'
                            } else if (item.controlField == 'IE') {
                                item.controlFieldDesc = '立即执行'
                            }
                        })
                        this.controEv_tableData = rows
                        this.controEv_config.total = res.returnData.totalCount
                    } else {
                        this.controEv_tableData = []
                        this.controEv_config.total = 0
                    }
                } 
            })
        },
        // 关联特殊情况
        handle2(row) {
            this.manageSpecail_dialog = true
            this.manageSpecail_getList(row)
        },
        manageSpecail_getList(row) {
            this.manageSpecail_config.loading = true
            let params = {
                customerNo: this.baseInfoObj.customerNo,
                idNumber:  this.baseInfoObj.idNumber,
                idType:  this.baseInfoObj.idType,
                customerName: this.baseInfoObj.customerName,
                externalIdentificationNo: this.queryForm.externalIdentificationNo,
                queryFlag: this.queryForm.queryFlag,
                contrlLevel: this.queryForm.contrlLevel,
                startDate: this.queryForm.startDate,
                endDate: this.queryForm.endDate,
                queryControl:'Y',
                effectivenessCodeType: row.effectivenessCodeType,
                effectivenessCodeScene: row.effectivenessCodeScene,
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_scenarioTriggerType','dic_specialEventState'],//查找数据字典所需参数
				transDict : ['sceneTriggerObjectLevel','state'],//翻译前后key
            }
            params = Object.assign(params , this.manageSpecail_config)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0035', params, (res) => {
                if (res.returnCode == '000000') {
                    this.manageSpecail_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rows = res.returnData.rows
                        rows.forEach(item => {
                            item.eventNoDescp = item.eventNo.substring(7)
                            item.effectivenessCodeTypeDesc = item.effectivenessCodeType+ ' ' +item.effectivenessCodeScene
                            item.currencyCodeDesc = item.currencyCode+ ' ' +item.currencyDesc
                            
                        })
                        this.manageSpecail_tableData = rows
                        this.manageSpecail_config.total = res.returnData.totalCount
                    } else {
                        this.manageSpecail_tableData = []
                        this.manageSpecail_config.total = 0
                    }
                }
            })
        },

    }
  }
  </script>
  
  <style>
  </style>
  