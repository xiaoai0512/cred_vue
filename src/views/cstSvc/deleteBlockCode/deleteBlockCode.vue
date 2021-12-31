<!-- 特别状况解除 -->
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
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
      
        <div v-if="showTable">
            <div class="text_title">特别状况列表</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="externalIdentificationNo" label="状况编号及描述" align="center" width="220">
                    <template slot-scope="{row}">
                        {{row.eventNo.substring(7)}}
                        {{row.eventDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="cycleModelDesc" label="管控内容" align="center">
                    <template slot-scope="{row}">
                        {{row.effectivenessCodeType}} {{row.effectivenessCodeScene}}
                        {{row.effectivenessCodeDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="sceneTriggerObjectLevelDesc" label="触发对象层级" align="center"/>
                <el-table-column prop="sceneTriggerObjectCode" label="触发对象" align="center" />
                <el-table-column prop="settingDate" label="设置日期" align="center"  />
                <el-table-column prop="settingTime" label="设置时间" align="center" />
                <el-table-column prop="settingUpUserid" label="设置人员代码" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" icon="el-icon-delete" @click="handleDelete(row)">确定解除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            
            
        </div>
    </div>
  </template>
  
  <script>
  import Pagination from '@/components/Pagination'
  export default {
    name: 'deleteBlockCode',
    components: {
      Pagination
    },
    data() {
      return {
        queryForm: {
            idType: '',
            idNumber: '',
            externalIdentificationNo: '',
        },
        showTable: false,
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData: [],
        // 下拉框
        idTypeList: [],

      }
    },
    created() {
  
    },
    mounted() {
      this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeList = res
      })
    },
    methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
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
              this.getCustBaseInfo()
            }
          } else if (this.queryForm.idNumber) {
            if (!this.queryForm.idType) {
              this.$message({
                message: '请输入证件类型',
                type: 'warning'
              })
            } else {
              this.getList()
            }
          } else {
            this.getList()
          }
        }
      },
      // 查询列表 
      getList() {
        this.config.loading = true
        let params = {
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_scenarioTriggerType'],//查找数据字典所需参数
			transDict : ['sceneTriggerObjectLevel'],//翻译前后key
        }
        params = Object.assign(params , this.config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0035', params, (res) => {
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
      
      // 删除
      handleDelete(row) {
        this.$confirm('确定解除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { // 是

            let params = {
                levelCode: row.sceneTriggerObjectCode,
                currencyCode: row.currencyCode,
                operationMode: row.operationMode,
                customerNo: row.customerNo,
                sceneTriggerObject: row.sceneTriggerObjectLevel,
                effectivenessCodeType: row.effectivenessCodeType,
                effectivenessCodeScene: row.effectivenessCodeScene,
                externalIdentificationNo: this.queryForm.externalIdentificationNo,
                idType: this.queryForm.idType,
                idNumber: this.queryForm.idNumber,
            }

            let str = row.eventNo.substring(7,9)
            let eventNoStr
            if (str == '01') {
                eventNoStr = row.eventNo.replace('.01.','.11.');
            } else if (str == '80') {
                eventNoStr = row.eventNo.replace('.80.','.81.');

            } else if (str == '86') {
                eventNoStr = row.eventNo.replace('.86.','.87.');
            }
            params.spEventNo = eventNoStr
            this.post('/beta/betaService/customerEffectiveUpdate', params, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '解除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                }
            })
        }).catch(() => { // 否   

        });
      },
      
   
    }
  }
  </script>
  
  <style>
  </style>
  