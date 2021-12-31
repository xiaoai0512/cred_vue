<!-- 授权欺诈名单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryFormObj.idType" clearable  class="wd200">
                    <el-option v-for="(item, index) in idTypeList" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="customerNo" label="客户号" align="center"/>
                 <el-table-column prop="customerNo" label="外部识别号" align="center"/>
                <el-table-column prop="externalIdentificationNo" label="建立日期" align="center"/>
                <el-table-column prop="inputSource" label="输入来源" align="center"/>
            	<el-table-column prop="authRespCode" label="授权应答" align="center"/>
                <el-table-column prop="currencyCode" label="说明" align="center"/>
               	<el-table-column align="center" label="操作" width="300px">
	                <template slot-scope="scope">
	                    <el-button size="mini" icon="el-icon-info" type="primary" @click=" handleUpdate(scope.row)" v-if="updBtnFlag">维护</el-button>
	                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleDeldate(scope.row)" v-if="updBtnFlag">删除</el-button>
	                </template>
            	</el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!--修改-->
        <el-dialog title="修改信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
            	<el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempUp.customerNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="授权应答" prop="authRespCode" >
                    <el-select v-model="tempUp.authRespCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in authRespCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="说明" prop="fraudDesc">
                    <el-input v-model="tempUp.fraudDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="submitUpInfo()">确认</el-button>
            </div>
        </el-dialog> 
        <!--删除-->
        <el-dialog title="删除信息" :visible.sync="dialogFormVisibleDel" width="65%">
            <el-form ref="dataFormDel" :rules="rulesDel" :model="tempDel" >
            	<el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempDel.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempDel.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权应答" prop="authRespCode" readonly disabled>
                    <el-select v-model="tempDel.authRespCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in authRespCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="说明" prop="fraudDesc">
                    <el-input v-model="tempDel.fraudDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDel = false">取消</el-button>
                <el-button type="primary" @click="submitDelInfo()">确认</el-button>
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
            // 权限
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            btnAuthStr: '',
            // 列表
            showList: false,
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            tableList: [],
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableTotal: 0,
            corporationEntityNo: '',
            // 下拉框
            idTypeList: [],
            operationModeOptions: [], //运营模式
            applicationRangeOptions: [],//应用范围
            cardAssociationsOptions: [],//卡组标识
            listTypOptions: [],//清单类型
            listTypOptionsAdd: [],//清单类型add
            authRespCodeOptions: [],//授权应答
            //修改
            dataFormUp: {},
           	dialogFormVisibleUp: false,
            tempUp: {},
            rulesUp: {},
            //删除
            dataFormDel: {},
           	dialogFormVisibleDel: false,
            tempDel: {},
            rulesDel: {},
        }
    },
    created() {
       let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
       
    },
    mounted() {
    	//证件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            corporationEntityNo: this.corporationEntityNo,
            adminFlagLogin: '1',
		}
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //清单类型
        this.getSelectDict( "dic_listTypeFive").then(res => {
            this.listTypOptions = res
        })
        //add清单类型
        this.getSelectDict( "dic_listTypeFive").then(res => {
            this.listTypOptionsAdd = res
        })
       //授权应答
        this.getSelectDict( "dic_crpnd").then(res => {
            this.authRespCodeOptions = res
        })
    	
    },
    
    methods: {
    	// 查询按钮权限
        getBtnAuth() {
            //console.log(window.sessionStorage.getItem('menuNo'))
            let params= {
                menuNo : window.sessionStorage.getItem('menuNo')
            }
            this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.length > 0 ) {
                        res.returnData.forEach(item => {
                            this.eventList += item.eventNo+','
                        })
                        if (this.eventList.includes('AUS.IQ.01.0009')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.OP.01.0006')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.OP.01.0005')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
       	//查询
        handleSearch() {
            if(!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
                    this.$message('请输入查询信息')
                    return;
        } else if(this.queryFormObj.idType) {
            if(!this.queryFormObj.idNumber) {
                this.$message('请输入证件号码')
        	} else {
                this.getList()
            }
        } else if(this.queryFormObj.idNumber) {
            if(!this.queryFormObj.idType) {
	                this.$message('请输入证件类型')
	        } else {
                this.getList()
            }
        }else{
            	this.getList()
            }
       	},
        // 列表
        getList() {
            this.listLoading = true
            let obj = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_crpnd'],//查找数据字典所需参数
				transDict : ['authResp'],//翻译前后key
            }
            obj = Object.assign (obj, this.queryFormObj )
            this.getTableList('/auth/authService/AUS.IQ.01.0009', obj,(res) => {
                if (res.returnCode == '000000') {
                	this.listLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                        this.tableList.forEach(item =>{
                        	if(item.inputSource == '1'){
                        		item.inputSource ='交易录入'
                        	}else if(item.inputSource == '2'){
                        		item.inputSource ='人工录入'
                        	}else if(item.inputSource != '1' && item.inputSource != '2'){
                        		item.inputSource =item.inputSource
                        	}
                        	if(item.authRespCode == 'D'){
                        		item.authRespCode = '拒绝借记交易'
                        	}else if(item.authRespCode == 'P'){
                        		item.authRespCode = '拒绝借记交易'
                        	}else if(item.authRespCode != 'P' || item.authRespCode != 'D'){
                        		item.authRespCode = '拒绝借记交易'
                        	}
                        })
                    }else {
                    	this.tableList = []
                        this.tableTotal = 0
                    }
                }
            }, (err) => {
            	this.tableList = []
                this.tableTotal = 0
                this.listLoading = false
            })
        },
        //显示修改弹框
         handleUpdate(row) {
        	this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
          })
        }, 
        submitUpInfo(){
        	this.tempUp.authDataSynFlag = '1',
        	this.tempUp.inputSource = '2',
            this.post('/auth/authService/AUS.OP.01.0005', this.tempUp, (res) => {
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
         //显示删除弹框
        handleDeldate(row) {
        	this.tempDel = Object.assign({}, row)
            this.dialogFormVisibleDel = true
            this.$nextTick(() => {
                this.$refs['dataFormDel'].clearValidate()
          })
        }, 
        submitDelInfo(){
        	this.tempDel.authDataSynFlag = '1',
        	this.tempDel.inputSource = '1',
            this.post('/auth/authService/AUS.OP.01.0005', this.tempDel, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleDel = false
                    this.$notify({
                        title: 'Success',
                        message: '删除成功',
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
.w-input{
    width: 70px !important;
    display: inline-block;
    padding-right: 5px;
}
</style>
