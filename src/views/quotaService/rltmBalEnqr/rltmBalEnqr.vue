<!--实时余额查询-->
<template>
    <div class="allContent">
        <el-form ref="transForm" :model="tableList">
          	<el-form-item class="cl_td" label="证件类型" prop="idType">
	            <el-select v-model="tableList.idType" class="wd200">
	              <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	            </el-select>
          	</el-form-item>
          	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
            	<el-input v-model="tableList.idNumber" class="wd200" type="text" />
          	</el-form-item>
          	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	            <el-input v-model="tableList.externalIdentificationNo" class="wd200" type="text" />
          	</el-form-item>
          	<div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
	            <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
          	</div>
	        </el-form>
	        <!-- 实时余额列表 -->
	        <div v-if="isShow" class="text_title">
		        <el-table  v-loading="listLoading" :data="list" border fit highlight-current-row >
		          	<el-table-column  align="center" label="币种" prop="currencyCodeDesc" />
		          	<el-table-column  align="center" label="业务项目代码" prop="businessProjectCodeDesc" />
		          	<el-table-column  align="center" label="业务类型代码" prop="businessTypeCodeDesc" />
		          	<el-table-column  align="center" label="额度节点" prop="creditNodeNoDesc" />
		          	<el-table-column  align="center" label="产品对象代码" prop="productObjectCodeDesc" />
		          	<el-table-column label="余额信息" width="180">
		              <template slot-scope="scope">
		                <el-popover trigger="hover" placement="top" >
		                    <p class="text_color" v-if="overpayBusinessTypeInfo == scope.row.businessTypeCode">溢缴款当前金额：{{scope.row.totalBalance}}</p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo == scope.row.businessTypeCode">溢缴款冻结金额：{{scope.row.overpayOutstandingAmt}} </p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo != scope.row.businessTypeCode">当期本金余额：{{scope.row.currPrincipalBalance}} </p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo != scope.row.businessTypeCode">账单本金余额： {{scope.row.billPrincipalBalance}}</p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo != scope.row.businessTypeCode">当期利息余额： {{scope.row.currInterestBalance}}<p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo != scope.row.businessTypeCode">账单利息余额：{{scope.row.billInterestBalance}} </p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo != scope.row.businessTypeCode">当期费用余额： {{scope.row.currCostBalance}}</p>
		                    <p class="text_color" v-if="overpayBusinessTypeInfo != scope.row.businessTypeCode">账单费用余额：{{scope.row.billCostBalance}}</p>
		                    <div slot="reference" class="name-wrapper">
		                        <el-tag size="min" ></el-tag>
		                    </div>
		                </el-popover>
		              </template>
		        </el-table-column>
	        </el-table>
	        <pagination v-show="tabTotal>0" :total="tabTotal" :page.sync="tableList.pageNum" :limit.sync="tableList.pageSize" @pagination="getList"/>
	    </div>
   	</div>
</template>

<script>
import ApiService from '@/api/api-service'
import Pagination from '@/components/Pagination'
export default {
  name: 'CusInfo',
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      tableList: {
          pageNum: 1,
          pageSize: 10
      },
      balanceList:[],
      idTypeList: [],
      listLoading: false,//汇总节点&&业务节点列表
      quotaListL: [],//汇总节点data
      isShow: false, // 汇总节点&&业务节点列表
      tabTotal:0,
      overpayBusinessTypeInfo: '',
      operationModeInfo: '',
      currencyCodeDesc:'',
      businessProjectCodeDesc:'', 
      businessTypeCodeDesc:'', 
      creditNodeNoDesc:'',
      productObjectCodeDesc: '',
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
      this.tableList = {
        idType: '',
        idNumber: '',
        externalIdentificationNo: '',
        }
      
    },
    // 重置
    reset() {
      this.init()
    },
    // 点击查询按钮
    handleSearch() {
      if (!this.tableList.externalIdentificationNo && !this.tableList.idType && !this.tableList.idNumber) {
        this.$message({
          message: '请输入查询信息',
          type: 'warning'
        })
        this.init()
      } else {
        if (this.tableList.idType) {
          if (!this.tableList.idNumber) {
            this.$message({
              message: '请输入证件号码',
              type: 'warning'
            })
          } else {
            this.getBalance()
          }
        } else if (this.tableList.idNumber) {
          if (!this.tableList.idType) {
            this.$message({
              message: '请输入证件类型',
              type: 'warning'
            })
          } else {
            this.getBalance()
          }
        } else {
          this.getBalance()
        }
      }
    },
    // 查询列表
    getList() {
      	this.isShow = true
      	this.listLoading = true
        const obj = {
            authDataSynFlag:"1",
            externalIdentificationNo: this.tableList.externalIdentificationNo,
            idType: this.tableList.idType,
            idNumber: this.tableList.idNumber
      	}
      	this.obj = Object.assign(this.tableList, obj)
      	this.getTableList('/auth/authService/AUS.IQ.01.0004', this.tableList, (res) => {
	      	this.listLoading = false
	      	if (res.returnCode == '000000') {
	      		if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                this.list = res.returnData.rows
			       	this.tabTotal = res.returnData.totalCount
			        this.list.forEach((item, index) => {
			             item.currencyCodeDesc = item.currencyCode+ ' '+ item.currencyDesc
			             item.businessProjectCodeDesc = item.businessProjectCode+ ' '+ item.programDesc
			             item.businessTypeCodeDesc = item.businessTypeCode+ ' '+ item.businessDesc
			             item.creditNodeNoDesc = item.creditNodeNo+ ' '+ item.creditNodeDesc
			              item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productDesc
		            })
			    } else {
                    this.list = []
			       	this.tabTotal = 0
                }
	        } 
      	}, (err) => {
            if (err) {
	      	    this.listLoading = false
                this.list = []
                this.tabTotal = 0
            }
        })
    },
    getBalance(){
    	const obj = {
            authDataSynFlag:"1",
            externalIdentificationNo: this.tableList.externalIdentificationNo,
            idType: this.tableList.idType,
            idNumber: this.tableList.idNumber
          }
        this.getTableList('/auth/authService/AUS.IQ.01.0001',obj, (res) => {
        	if (res.returnCode == '000000') {
                this.operationModeInfo = res.returnData.rows[0].operationMode
                this.getoperationMode()
           }
        })
    },
    getoperationMode(){
          let obj = {
            operationMode:this.operationModeInfo
          }
        this.getTableList('/beta/betaService/COS.IQ.02.0006',obj, (res) => {
        	if (res.returnCode == '000000') {
                this.operationModeInfo = res.returnData.rows[0].operationMode
                    this.overpayBusinessTypeInfo = res.returnData.rows[0].overpayBusinessType;       
                    this.getList()
           }
        })
    },
  }
}
</script>

<style scoped="scoped">
    .text_color {
        color: #458BED !important;
    }
    .cell .el-tag {
        margin-right: 0px;
        height: 25px;
}
</style>
