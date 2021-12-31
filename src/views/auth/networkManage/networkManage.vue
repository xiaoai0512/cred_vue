<!-- 国际组织网络管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            	:rules="[ { required: true, message: '运营模式不能为空'}]">
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
           		:rules="[ { required: true, message: '卡组织标识不能为空'}]">
                <el-select v-model="queryFormObj.cardAssociations" class="wd200">
                <el-option
                    v-for="(item, index ) in cardAssociationsOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
            </div>
        </el-form>
        <div v-if="showList">
        	<div class="mainname titleInfo" v-if='queryFormObj.cardAssociations == "C"'>CUP网络详情</div>
        	<div class="mainname titleInfo" v-if='queryFormObj.cardAssociations == "JC"'>JCB网络详情</div>
        	<div class="mainname titleInfo" v-if='queryFormObj.cardAssociations == "M"'>MC网络详情</div>
        	<div class="mainname titleInfo" v-if='queryFormObj.cardAssociations == "V"'>VISA网络详情</div>
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               	<el-form-item class="cl_td bnone" label="网络状态：" prop="procStatusDesc" >
                    <el-input v-model="tempAdd.procStatusDesc" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="功能选择" prop="tempStatus">
	                <el-select v-model="tempAdd.tempStatus" class="wd200">
	                <el-option
	                    v-for="(item, index ) in tempStatusOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                    	:value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<div v-if="tempAdd.tempStatus=='1' || tempAdd.tempStatus == '4'">
	        		<el-form-item class="cl_td" label="密钥类型" prop="keyType">
		                <el-select v-model="tempAdd.keyType" class="wd200">
		                <el-option
		                    v-for="(item, index ) in keyTypeOptions"
		                    :key="index"
		                    :label="item.detailDesc"
		                    :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	        		<el-form-item class="cl_td" label="加密算法" prop="encryptType">
		                <el-select v-model="tempAdd.encryptType" class="wd200">
		                <el-option
		                    v-for="(item, index ) in encryptTypeOptions"
		                    :key="index"
		                    :label="item.detailDesc"
		                    :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
            	</div>
	            <div class="cl_tr text_center">
	                <el-button size="medium"  type="primary" @click="updateInfoC()" >执行</el-button>
	                <el-button size="medium"  type="primary" @click="closeInfo()" >关闭</el-button>
	            </div>	
            </el-form>
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
            operationModeOptions: [], //运营模式
            applicationRangeOptions: [],//应用范围
            cardAssociationsOptions: [],//卡组标识
            tempStatusOptions: [],//功能选择
            keyTypeOptions: [],//秘钥类型
            encryptTypeOptions   : [],//加密算法
            
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dataFormAdd: {},
            
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            rulesUp: {},
            dataFormUp:{},
            //列表
            upTableList: [],
            upListLoading: false,
            /*----详情----*/
            dialogFormVisibleDetail: false,
            tempDetail: {}, // 修改
            rulesDetail: {},
            detailListLoading: false,
            detailTableList: [],
            /*----删除----*/
            dialogFormVisibleDel: false,
            tempDel: {},
            rulesDel: {},
            dataFormDel:{},
        }
    },
    created() {
       let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
        this.getBtnAuth()
    },
    mounted() {
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
        //卡组织标识
       	this.getSelectDict( "dic_recordType").then(res => {
       		res.splice(2,1)
       		this.cardAssociationsOptions = res
        })
       	//功能选择
       	/*this.getSelectDict( "dic_functionArray").then(res => {
       		//res.splice(0,1)
            this.tempStatusOptions = res
            
        })*/
       	//秘钥类型
       	this.getSelectDict( "dic_keyType").then(res => {
       		res.splice(1,1)
            this.keyTypeOptions = res
        })
       	//加密算法
       	this.getSelectDict( "dic_encryptType").then(res => {
       		this.encryptTypeOptions = res
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
                        if (this.eventList.includes('AUS.PM.04.0202')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0201')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0203')) { // 维护
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
        	this.$refs['queryFormRef'].validate((valid) => {
            	if (valid) {
            		this.queryFormObj.authDataSynFlag = '1'
		        	this.queryFormObj.authFlag = '1'
		        	this.showList = true
		        	let obj = {
		            	isTrans: true,//是否需要翻译数据字典
						transParams : ['dic_functionArray'],//查找数据字典所需参数
						transDict : ['procStatus'],//翻译前后key
		            }
		        	obj = Object.assign ( obj, this.queryFormObj )// 合并
        			if(this.queryFormObj.cardAssociations=='C'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0202', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempAdd = res.returnData.rows[0]
			                        if(this.tempAdd.procStatusDesc=='签到'){
		                        		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(0,1)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}else if(this.tempAdd.procStatusDesc=='签退'){
			                       		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(1,3)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}
			                    }
			                }
			            })
            		}
		           if(this.queryFormObj.cardAssociations=='J'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0302', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempAdd = res.returnData.rows[0]
			                        if(this.tempAdd.procStatusDesc=='签到'){
			                        	this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(0,1)
			                       			this.tempStatusOptions = res
			                       			
				                        })
			                       	}else if(this.tempAdd.procStatusDesc=='签退'){
			                       		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(1,3)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}
			                    }
			                }
		            	})
            		}
		            if(this.queryFormObj.cardAssociations=='L'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0102', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempAdd = res.returnData.rows[0]
			                        if(this.tempAdd.procStatusDesc=='签到'){
			                        	this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(0,1)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}else if(this.tempAdd.procStatusDesc=='签退'){
			                       		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(1,3)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}
			                    }
			                }
		            	})
            		}
		            if(this.queryFormObj.cardAssociations=='M'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0102', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempAdd = res.returnData.rows[0]
			                        if(this.tempAdd.procStatusDesc=='签到'){
		                        		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(0,1)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}else if(this.tempAdd.procStatusDesc=='签退'){
			                       		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(1,3)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}
			                    }
			                }
		            	})
            		}
		            if(this.queryFormObj.cardAssociations=='V'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0002', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempAdd = res.returnData.rows[0]
			                        if(this.tempAdd.procStatusDesc=='签到'){
		                        		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(0,1)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}else if(this.tempAdd.procStatusDesc=='签退'){
			                       		this.getSelectDict( "dic_functionArray").then(res => {
			                       			res.splice(1,3)
			                       			this.tempStatusOptions = res
			                       		})
			                       	}
			                    }
			                }
		            	})
            		}
	          	}
	        })
        },
       	//执行
       	updateInfoC(){
       		let  data = {
	       			_2rt: "001",
					_2ssc: "auth",
					authDataSynFlag: "1",
					authFlag: "1",
	       		}
       		data = Object.assign ( data, this.tempAdd ) //合并
	       	if(this.queryFormObj.cardAssociations=='C'){
	       		this.post('/auth/authService/AUS.PM.10.0201', data, (res) => {
                    if (res.returnCode == '000000') {
						 this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.showList = false
                    }
	        	})
	       	}
	       	if(this.queryFormObj.cardAssociations=='J'){
	       		this.post('/auth/authService/AUS.PM.10.0301', data, (res) => {
                    if (res.returnCode == '000000') {
						 this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.showList = false
                    }
	        	})
	       	}
	       	if(this.queryFormObj.cardAssociations=='L'){
	       		this.post('/auth/authService/AUS.PM.10.0301', data, (res) => {
                    if (res.returnCode == '000000') {
						 this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.showList = false
                    }
	        	})
	       	}
	       	if(this.queryFormObj.cardAssociations=='M'){
	       		this.post('/auth/authService/AUS.PM.10.0101', data, (res) => {
                    if (res.returnCode == '000000') {
						this.$notify({
							title: 'Success',
							message: '执行成功',
							type: 'success',
							duration: 2000
						})
						this.handleSearch()
						this.showList = false
                    }
	        	})
	       	}
	       	if(this.queryFormObj.cardAssociations=='V'){
	       		this.post('/auth/authService/AUS.PM.10.0001', data, (res) => {
                    if (res.returnCode == '000000') {
						this.$notify({
							title: 'Success',
							message: '执行成功',
							type: 'success',
							duration: 2000
						})
						this.handleSearch()
						this.showList = false
                    }
	        	})
	       	}
        },
        //关闭按钮
        closeInfo(){
        	this.showList = false
        	this.tempAdd = {}
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
