<!-- 批量异常管理  	 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
        	<el-form-item class="cl_td" label="证件类型" prop="idType" >
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="客户号" prop="ecommCustId">
                <el-input v-model="queryForm.ecommCustId" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" v-if='baBtnFlag' icon="el-icon-refresh" type="primary" @click="handleSearch()" >恢复备份</el-button>
                <el-button size="medium" v-if="againBtnFlag" id="reRunBtn" icon="el-icon-refresh" type="primary" @click="runAgain()" >重跑</el-button>
            </div>
        </el-form>
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
        	//权限
        	baBtnFlag: false,
            againBtnFlag: false,
            logininfo: '',
           //下拉
            idTypeList: [],
            //form
            queryFormRef: {},
            queryForm: {},
            queryFormRules: {},
        }
    },
    created() {
       
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
       //证件类型
		this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
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
                        if (this.eventList.includes('BSS.BH.00.9010')) { // 备份
                            this.baBtnFlag = true
                        } else {
                            this.baBtnFlag = false
                        }
                        if (this.eventList.includes('BSS.BH.00.9000')) { // 重跑
                            this.againBtnFlag = true
                        } else {
                            this.againBtnFlag = false
                        }
                    }
                }
            })
        },
    	//恢复备份
        restoreBackupBtn() {
			if((this.queryForm.idType == null || this.queryForm.idType == undefined  || this.queryForm.idType == "")&&
					(this.queryForm.idNumber == null || this.queryForm.idNumber == undefined  || this.queryForm.idNumber == "")){
				this.$message('请输入查询条件');
			}else {
				if(this.queryForm.idType){
					if(this.queryForm.idNumber == null || this.queryForm.idNumber == undefined  || this.queryForm.idNumber == ""){
						this.$message('请输入证件号码');
					}else {
						this.restoreBackupFun();
					}
				}else if(this.queryForm.idNumber ){
					if(this.queryForm.idType == null || this.queryForm.idType == undefined  || this.queryForm.idType == ""){
						this.$message('请输入证件类型');
					}else {
						this.restoreBackupFun();
                    }
                }
				
			}
		
		},
		//恢复备份
		restoreBackupFun(){
    	 	this.post('/card/cardForSomeBatch/BSS.BH.00.9010', this.queryForm, (res) => {
                if(res.returnCode == '000000'){
	                this.$notify({
		                message: '操作成功',
		                type: 'success',
	                })
	                $("#reRunBtn").attr("disabled",false);
					$("#reRunBtn").removeClass("layui-btn-disabled");
				}else{
					let returnMsg = res.returnMsg ? res.returnMsg : ('操作失败');
					this.$message(returnMsg);
				}
            })
    	 	
        },
        //重跑
        reRunBtn(){
        	if((this.queryForm.ecommCustId == null || this.queryForm.ecommCustId == undefined  || this.queryForm.ecommCustId == "")&&
					(this.queryForm.idType == null || this.queryForm.idType == undefined  || this.queryForm.idType == "")&&
					(this.queryForm.idNumber == null || this.queryForm.idNumber == undefined  || this.queryForm.idNumber == "")){
					this.$message('请输入条件进行查询');
					return
			}else {
				if(this.queryForm.idType){
					if(this.queryForm.idNumber == null || this.queryForm.idNumber == undefined  || this.queryForm.idNumber == ""){
						this.$message('证件号码不能为空！');
						return
					}else {
						this.reRunFun();
					}
				}else if(this.queryForm.idNumber ){
					if(this.queryForm.idType == null || this.queryForm.idType == undefined  || this.queryForm.idType == ""){
						this.$message('证件类型不能为空');
						return
					}else {
						this.reRunFun();
                    }
                }
				
			}
        },
        //重跑事件调取接口
        reRunFun(){
    	 	this.post('/card/cardForSomeBatch/BSS.BH.00.9000', this.queryForm, (res) => {
                if(res.returnCode == '000000'){
	                this.$notify({
		                message: '操作成功',
		                type: 'success',
	                })
                }else{
                	let returnMsg = res.returnMsg ? res.returnMsg : ('操作失败');
					this.$message(returnMsg);
                }
            })
        },
        
    }
}
</script>

<style>
</style>
