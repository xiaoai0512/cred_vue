<!-- 约定扣款设置 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
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
        <div v-if="showDiv">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户代码" align="center" />
	            <el-table-column prop="businessProgramNo" label="业务项目代码" align="center" />
	            <el-table-column prop="billDay" label="账单日" align="center" />
	            <el-table-column prop="nextBillDate" label="下一账单日期" align="center"/>
	            <el-table-column prop="directDebitStatusDesc" label="约定扣款状态" align="center" />
	            <el-table-column prop="directDebitModeDesc" label="约定扣款方式" align="center" />
	            <el-table-column prop="directDebitBankNo" label="约定还款银行号" align="center" />
	            <el-table-column prop="directDebitAccountNo" label="约定还款账户号" align="center"/>
	            <el-table-column prop="exchangePaymentFlagDesc" label="购汇还款标志" align="center"/>
	            <el-table-column prop="" label="操作" align="center" >
	                <template slot-scope="{row}">
	                <!--<el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>-->
	                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)">修改</el-button><!--v-show="updBtnFlag"-->
	                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<!--修改-->
    	<el-dialog title="约定扣款详细信息" :visible.sync="dialogFormVisibleUp" width="65%">
    		<el-form ref="upRef" :model="tempUp" :rules="upRules">
                
               	<el-form-item class="cl_td" label="约定还款状态" prop="updirectDebitStatus">
                    <el-select v-model="tempUp.updirectDebitStatus" class="wd200" >
                        <el-option 
                            v-for="(item, index) in updirectDebitStatusOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="约定扣款方式" prop="updirectDebitMode">
                    <el-select v-model="tempUp.updirectDebitMode" class="wd200" >
                        <el-option 
                            v-for="(item, index) in updirectDebitModeOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<el-form-item class="cl_td" label="约定还款银行号" prop="directDebitBankNo" >
                    <el-input v-model="tempUp.directDebitBankNo" class="wd200" type="text"  />
               	</el-form-item>
               	<el-form-item class="cl_td" label="约定还款账户号" prop="directDebitAccountNo" >
                    <el-input v-model="tempUp.directDebitAccountNo" class="wd200" type="text"  />
               	</el-form-item>
               	<el-form-item class="cl_td" label="购汇还款标志" prop="upexchangePaymentFlag">
                    <el-select v-model="tempUp.upexchangePaymentFlag" class="wd200" >
                        <el-option 
                            v-for="(item, index) in upexchangePaymentFlagOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
    		</el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button  type="primary" @click="dialogFormVisibleUp = false"> 关闭</el-button>
	            <el-button type="primary" @click="subUpData()"> 确定</el-button>
	        </div>  
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
    export default {
      name: 'tableList',
      components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
      },
      	data() {
        	return {
	           	showDiv: false,
	            logininfo: '',
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	            list_formatCode: '',
	            // 下拉框
	            idTypeList: [],//证件类型
	            updirectDebitStatusOptions: [],//约定还款状态
	            updirectDebitModeOptions: [],//约定款款方式
	            upexchangePaymentFlagOptions: [],//购汇还款标志
	            //修改
	            tempUp: {},
	            upRef: {},
	            upRules: {},
	            dialogFormVisibleUp: false,
    		}
        },
        created() {
        	this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            console.log(this.logininfo)
            
        },
        mounted() {
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
            //约定款款状态
            this.getSelectDict( "dic_directDebitStatus").then(res => {
                this.updirectDebitStatusOptions = res
            })
            //购汇还款标志
            this.getSelectDict( "dic_exchangePaymentFlag").then(res => {
                this.upexchangePaymentFlagOptions = res
            })
            //约定还款方式
           	this.getSelectDict( "dic_directDebitMode").then(res => {
                this.updirectDebitModeOptions = res
            })
        },
      methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showDiv  = false
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
              this.getList()
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
        // 列表
        getList() {
            this.listLoading = true
            this.showDiv = true
            let obj = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_directDebitStatus','dic_exchangePaymentFlag','dic_directDebitMode'],//查找数据字典所需参数
				transDict : ['directDebitStatus','exchangePaymentFlag','directDebitMode'],//翻译前后key
            }
            obj = Object.assign(obj, this.queryForm )
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0020', obj,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		
                    }
                }
            })
        },
        handleUpdate(row) {
	        this.tempUp = Object.assign({}, row)
	        this.tempUp.updirectDebitStatus  =row.directDebitStatus
	        this.tempUp.updirectDebitMode = row.exchangePaymentFlag
	        this.tempUp.upexchangePaymentFlag = row.directDebitMode
	        this.dialogFormVisibleUp = true
	        this.$nextTick(() => {
	            this.$refs['upRef'].clearValidate()
	        })
		}, 
       	subUpData(row){
        	this.post('/nonfi/nonfinanceService/BSS.UP.01.0025', this.tempUp ,(res) => {
	            if (res.returnCode == '000000') {
                 	this.dialogFormVisibleUp = false
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
	            }
	        })
	    },
    }
}
</script>

<style>
</style>
