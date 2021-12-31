<!-- 发卡例外名单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryFormObj.idType" class="wd200" clearable>
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
                <el-table-column type="index"  label="序号"></el-table-column>
                <el-table-column prop="customerNo" label="客户代码" align="center"/>
                <el-table-column prop="businessProgram" label="业务项目" align="center"/>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center"/>
                <el-table-column prop="productObjectCode" label="产品对象" align="center"/>
            	<el-table-column prop="transIdentifiNo" label="交易识别代码" align="center"/>
                <el-table-column prop="currencyCode" label="入账币种" align="center"/>
                <el-table-column prop="authRespDesc" label="授权响应" align="center"/>
            </el-table>
            <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
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
       
    },
    methods: {
       	//查询
        handleSearch() {
            if(!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
                this.$message('请输入查询信息')
                 return;
            } else if(this.queryFormObj.idType) {
                if(!this.queryFormObj.idNumber) {
                    this.$message('请输入证件号码')
                    return;
                }else {
                	this.getList()
                }
            } else if(this.queryFormObj.idNumber) {
                if(!this.queryFormObj.idType) {
                    this.$message('请输入证件类型')
                    return;
                }else {
                	this.getList()
                }
            }else{
            	this.getList()
            }
    	},
    	// 列表
        getList() {
            this.listLoading = true
            this.showList=true
            let params = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_crpnd'],//查找数据字典所需参数
				transDict : ['authResp'],//翻译前后key
				authDataSynFlag: '1',
            }
            params = Object.assign(params, this.queryFormObj);
            this.getTableList('/auth/authService/AUS.IQ.01.0007', params, (res) => {
            	this.listLoading = false
                if(res.returnCode == '000000') {
                   if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }else {
                        this.tablesList = []
                        this.tableTotal = 0
                    }
                }
            }, (err) => {
            	this.tablesList = []
                this.tableTotal = 0
                this.listLoading = false
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
