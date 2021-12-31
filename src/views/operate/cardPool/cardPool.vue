<!-- 卡号池查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
           <el-form-item class="cl_td" label="卡BIN" prop="cardBin">
                <el-select v-model="queryFormObj.cardBin" class="wd200">
                    <el-option
                        v-for="(item, index ) in cardBinOptions"
                        :key="index"
                        :label="item.binNo"
                        :value="item.binNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="卡号状态" prop="cardStatus">
                <el-select v-model="queryFormObj.cardStatus" class="wd200">
                    <el-option
                        v-for="(item, index ) in cardStatusOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="预留卡号" prop="cardNumber">
                   <el-input v-model="queryFormObj.cardNumber" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="可用卡量" prop="totalCountSize">
                   <el-input v-model="queryFormObj.totalCountSize" class="wd200" type="text"/>    
                </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="rest()">重置</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="cardBin" label="卡BIN" align="center" />
            <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
            <el-table-column prop="cardNumber" label="预留卡号" align="center" />
            <el-table-column prop="cardStatus" label="预留卡号状态" align="center"/>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
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
            templateRadio: false,
            logininfo: '',
            // 列表
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            list_formatCode: '',
            // 下拉框
            originListOptions:[],// 运营模式 
            cardBinOptions: [],//卡BIN
            cardStatusOptions: [],//预留卡号状态
            /*----新增----*/
            tempAdd: {}, // 新增
            newLegal: '',
            dialogFormVisibleAdd: false,
            rulesAdd: {},
            rulesUp: {},
            //选择法人实体编号
            dataFormLegal: {},
            tempLegal: {},
            rulesLegal: {},
            legalTableList: [],
            legalTotal: 0,
            legalFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            legalListLoading: false,
            dialogFormVisibleLegal: false,
           
        }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.getCardSize()
            this.getList()
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
                //卡BIN
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0011").then(res => {
                this.cardBinOptions = res
            })
            //预留卡号状态
            this.getSelectDict( "dic_cardStatus").then(res => {
                this.cardStatusOptions = res
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
                        if (this.eventList.includes('COS.IQ.02.0163') != -1){ // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('COS.AD.02.0167') != -1) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('COS.UP.02.0154') != -1) { // 维护
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
            this.queryFormObj.pageNum = 1
            this.getCardSize()
           	this.getList()
        },
        // 查询可用卡量
        getCardSize() {
           	if(this.queryFormObj.cardStatus=='' || this.queryFormObj.cardStatus==undefined){
                this.queryFormObj.cardStatus= 'N'
           	}
            let params = {
                cardBin: this.queryFormObj.cardBin, 
                corporationEntityNo: this.logininfo.corporationEntityNo,
            }
            //合并
            params = Object.assign(this.queryFormObj, params)
           	this.getTableList('/beta/betaService/COS.IQ.02.0160', params,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    	this.queryFormObj.totalCountSize=res.returnData.totalCount;
						if(this.queryFormObj.cardStatus=='Y'){
	                    	this.queryFormObj.totalCountSize= 0
	                    	this.$forceUpdate()
	                    }
                 	}else{
                 		this.queryFormObj.totalCountSize= 0
                 	}
                }
            })
        },
        //列表数据查询
        getList(){
        	this.listLoading1 = true
        	if(this.queryFormObj.cardStatus=='' || this.queryFormObj.cardStatus==undefined){
                this.queryFormObj.cardStatus= 'N'
           	}
            let params = {
                cardBin: this.queryFormObj.cardBin, 
                corporationEntityNo: this.logininfo.corporationEntityNo,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_cardStatus'],//查找数据字典所需参数
                transDict : ['cardStatus'],//翻译前后key
            }
			params = Object.assign(this.queryFormObj, params)
            this.getTableList('/beta/betaService/COS.IQ.02.0160', params,(res) => {
                this.listLoading1 = false
            	if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
					} else {
                        this.tableList = []
                        this.tableTotal = 0
                    }
                }
            }, (err) => {
                this.tableList = []
                this.tableTotal = 0
                this.listLoading1 = false
            })
        },
        //重置
        rest(){
        	this.queryFormObj.cardStatus = ''
        	this.queryFormObj.cardBin = ''
        	this.queryFormObj.cardNumber = ''
        },
    }
}
</script>

<style>
</style>
