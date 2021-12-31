<!-- 节假日维护 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="holidaySearchForm" :model="holidaySearchForm" :rules="holidaySearchFormRules">
        <el-form-item class="cl_td" label="假日编号" prop="holidayNo">
            <el-select v-model="holidaySearchForm.holidayNo" class="wd200" @change="holidayNoHandleChange" clearable >
              <el-option
                v-for="(item, index ) in holidayNoList"
                :key="index"
                :label="item.holidayNo"
                :value="item.holidayNo"
              />
            </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="假日年份" prop="queryYear">
            <el-select v-model="holidaySearchForm.queryYear" class="wd200" clearable >
              <el-option
                v-for="(item, index) in queryYearList"
                :key="index"
                :label="item.month"
                :value="item.month"
              />
            </el-select>
        </el-form-item>
        
        <div class="cl_tr text_center">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
            <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
        </div>
    </el-form>
    <el-table
        v-loading = "listLoading1"
        v-show="isShowTable"
        :data="eventList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%;"
        border
      >
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{scope.$index+1}} 
        </template>
      </el-table-column>
        <el-table-column prop="holidayNo" label="假日编号" align="center" />
        <el-table-column prop="year" label="假日年份" align="center" />
        <el-table-column prop="month" label="假日月份" align="center" />
        <el-table-column prop="holidayDate" label="假日日期" align="center" />
        <el-table-column prop="holidayStatusDesc" label="假日状态" align="center" />
        <el-table-column prop="" label="操作" align="center" width="250">
            <el-button icon="el-icon-edit"  type="primary" size="mini" @click="handleUpdate" v-show="updBtnFlag">修改</el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini" @click="handleDelete(row,$index)" v-show="deleteBtnFlag" >
                {{ $t('table.delete') }}
              </el-button>
        </el-table-column>
      </el-table>
      <pagination v-show="holidayTotal>0 && isShowTable" :total="holidayTotal" :page.sync="holidaySearchForm.pageNum" :limit.sync="holidaySearchForm.pageSize" @pagination="getHolidayList" />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'HolidayQuery',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    return {
        holidaySearchForm: {
            pageNum: 1,
            pageSize:10,
        },
        holidayNoList: [], // 假日编号下拉框
        queryYearList: [] , // 假日年份下拉框
      holidaySearchFormRules: {},
      eventList: [],
      holidayTotal: 0,
      isShowTable: false,
      listLoading1: false,
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      deleteBtnFlag: false,
      btnAuthStr: '',

    }
  },
  created() {
    this.init()
    this.getBtnAuth()
  },
  mounted() {
    // 假日编号
    this.post("/beta/betaService/COS.IQ.02.0041", {holidayNoFlag: 1}, (res) => {
      this.holidayNoList = res.returnData.rows
    })

  },
  methods: {
    init() {
        this.holidaySearchForm.holidayNo = ''
        this.holidaySearchForm.queryYear = ''
        this.isShowTable = false
    },
    // 重置
    reset() {
      this.init()
    },
    holidayNoHandleChange(value) {
        this.post('/beta/betaService/COS.IQ.02.0041', {holidayNo: value, yearFlag: 1}, (res)=> {
            this.queryYearList = res.returnData.rows
        })

    },
    // 查询按钮权限
    getBtnAuth() {
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.holidaySearchForm = Object.assign(this.holidaySearchForm,params)
        this.getTableList('/beta/betaService/COS.CS.01.0030', this.holidaySearchForm ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0041')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0039')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0067')) { // 删除
                        this.deleteBtnFlag = true
                    } else {
                        this.deleteBtnFlag = false
                    }
                }
            }
        })
    },
    // 事件清单列表
    getHolidayList() {
        this.listLoading1 = true
        let obj = {
            isTrans: true,
            transParams:['dic_holidayStatus'],
            transDict : ['holidayStatus']
        }
        this.holidaySearchForm = Object.assign(this.holidaySearchForm, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0041', this.holidaySearchForm ,(res) => {
        	this.listLoading1 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.eventList = res.returnData.rows
                    this.holidayTotal = res.returnData.totalCount
					this.isShowTable = true
                }else{
                	this.eventList = []
                    this.holidayTotal = 0
                }
            }
        }, (err) => {
        	this.eventList = []
            this.holidayTotal = 0
        	this.listLoading1 = false
        })
	},
    handleSearch() {
        this.holidaySearchForm.pageNum = 1
        this.holidaySearchForm.pageSize = 10
        this.getHolidayList()
    },
    handleUpdate() {

    }, 
    handleAdd() {

    }, 
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
    //   this.list.splice(index, 1)
    }
  },
}
</script>

<style>
</style>
