<!-- 清算渠道管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
          	<el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="渠道ID" prop="numberType">
                <el-input v-model="queryFormObj.numberType" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showDiv">
	        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="channelId" label="渠道ID" align="center" />
	            <el-table-column prop="channelDescription" label="渠道描述" align="center" />
	            <el-table-column prop="channelFileRecognition" label="渠道文件识别" align="center" />
	            <el-table-column prop="dataReceivingModeDesc" label="数据接收模式" align="center" />
	            <el-table-column prop="transRetainDays" label="交易保留天数" align="center" />
	            <el-table-column prop="recheckDays" label="重复检查天数" align="center" />
	            <el-table-column prop="rejTrasnRetainDays" label="拒绝交易保留天数" align="center" />
	            <el-table-column prop="" label="操作" align="center" width = "350">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
	                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
	                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="渠道管理建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               	<el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                	<el-select v-model="tempAdd.operationMode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in operationModeOptions"
	                    :key="index"
	                    :label="item.modeName"
	                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="渠道ID" prop="channelId" 
                    :rules="[ { required: true, message: '渠道ID不能为空'}]">
                    <el-input v-model="tempAdd.channelId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="渠道描述" prop="channelDescription"
                    :rules="[ { required: true, message: '渠道描述不能为空'}]">
                   <el-input v-model="tempAdd.channelDescription" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="渠道文件识别" prop="channelFileRecognition"
                    :rules="[ { required: true, message: '渠道文件识别不能为空'}]">
                   <el-input v-model="tempAdd.channelFileRecognition" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="数据接收模式" prop="dataReceivingMode" 
                    :rules="[ { required: true, message: '特殊号码方式不能为空'}]">
                    <el-select v-model="tempAdd.dataReceivingMode" class="wd200">
                        <el-option
                            v-for="(item, index ) in dataReceivingModeOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select> 
                </el-form-item>
             	<el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays"
                    :rules="[ { required: true, message: '交易保留天数不能为空'}]">
                   <el-input v-model="tempAdd.transRetainDays" class="wd200" type="text" />
                </el-form-item>
               	<el-form-item class="cl_td" label="重复检查天数" prop="recheckDays"
                    :rules="[ { required: true, message: '交易保留天数不能为空'}]">
                   <el-input v-model="tempAdd.recheckDays" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="rejTrasnRetainDays"
                    :rules="[ { required: true, message: '拒绝交易保留天数不能为空'}]">
                   <el-input v-model="tempAdd.rejTrasnRetainDays" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAdd()"> 关闭</el-button>
            </div>
        </el-dialog> 
       <!-- 修改 -->
        <el-dialog title="修改预留号码信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                	<el-select v-model="tempUp.operationMode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in operationModeOptions"
	                    :key="index"
	                    :label="item.modeName"
	                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="渠道ID" prop="channelId" 
                    :rules="[ { required: true, message: '渠道ID不能为空'}]">
                    <el-input v-model="tempUp.channelId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="渠道描述" prop="channelDescription"
                    :rules="[ { required: true, message: '渠道描述不能为空'}]">
                   <el-input v-model="tempUp.channelDescription" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="渠道文件识别" prop="channelFileRecognition"
                    :rules="[ { required: true, message: '渠道文件识别不能为空'}]">
                   <el-input v-model="tempUp.channelFileRecognition" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="数据接收模式" prop="dataReceivingMode" 
                    :rules="[ { required: true, message: '特殊号码方式不能为空'}]">
                    <el-select v-model="tempUp.dataReceivingMode" class="wd200">
                        <el-option
                            v-for="(item, index ) in dataReceivingModeOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select> 
                </el-form-item>
             	<el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays"
                    :rules="[ { required: true, message: '交易保留天数不能为空'}]">
                   <el-input v-model="tempUp.transRetainDays" class="wd200" type="text" />
                </el-form-item>
               	<el-form-item class="cl_td" label="重复检查天数" prop="recheckDays"
                    :rules="[ { required: true, message: '交易保留天数不能为空'}]">
                   <el-input v-model="tempUp.recheckDays" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="rejTrasnRetainDays"
                    :rules="[ { required: true, message: '拒绝交易保留天数不能为空'}]">
                   <el-input v-model="tempUp.rejTrasnRetainDays" class="wd200" type="text" />
                </el-form-item>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--查询-->
         <el-dialog title="修改预留号码信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                	<el-select v-model="tempDetail.operationMode" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in operationModeOptions"
	                    :key="index"
	                    :label="item.modeName"
	                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="渠道ID" prop="channelId">
                    <el-input v-model="tempDetail.channelId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道描述" prop="channelDescription">
                   <el-input v-model="tempDetail.channelDescription" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="渠道文件识别" prop="channelFileRecognition">
                   <el-input v-model="tempDetail.channelFileRecognition" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="数据接收模式" prop="dataReceivingMode">
                    <el-select v-model="tempDetail.dataReceivingMode" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in dataReceivingModeOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"/> 
                    </el-select> 
                </el-form-item>
             	<el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays">
                   <el-input v-model="tempDetail.transRetainDays" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="重复检查天数" prop="recheckDays">
                   <el-input v-model="tempDetail.recheckDays" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="rejTrasnRetainDays">
                   <el-input v-model="tempDetail.rejTrasnRetainDays " class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
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
	            templateRadio: false,
	            logininfo: '',
	            // 列表
	            showDiv: false,
	            queryFormObj: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading1: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	           	// 下拉框
	            operationModeOptions:[],// 运营模式 
	            dataReceivingModeOptions: [],//卡BIN
	           
	            /*----新增----*/
	            tempAdd: {}, // 新增
	            newLegal: '',
	           	tempDetail: {}, // 详情
	            dialogFormVisibleAdd: false,
	            rulesAdd: {},
	            //修改
	            dialogFormVisibleUp: false,
	            tempUp: {}, 
	            dataFormUp: {},
	            rulesUp: {},
	           	//详情
	    		dialogFormVisibleDetail: false,
	    		dataFormDetail: {},
	    		tempDetail: [],
	    		rulesDetail: {},
            }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            this.getList()
           	this.getSelectDict( "/beta/betaService/COS.IQ.02.0006",).then(res => {
	            this.operationModeOptions = res
	        })
            //数据接收模式
            this.getSelectDict( "dic_dataReceivingMode").then(res => {
                this.dataReceivingModeOptions = res
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
                            this.btnAuthStr += item.eventNo+','
                        })
                        if (this.btnAuthStr.includes('MIS.IQ.01.0001') != -1){ // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('MIS.AD.01.0001') != -1) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('MIS.UP.01.0001') != -1){ // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
       	// 列表
        getList() {
            this.listLoading1 = true
            this.showDiv = true
            let params = {
                corporationEntityNo: this.logininfo.corporationEntityNo,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_dataReceivingMode'],//查找数据字典所需参数
                transDict : ['dataReceivingMode'],//翻译前后key
            }
            params = Object.assign(this.queryFormObj, params)   //合并
            this.getTableList('/beta/betaService/MIS.IQ.01.0001', params,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                        this.listLoading1 = false
                    }
                }
            })
        },
        handleSearch() {
            this.getList()
        },
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
        }, 
         //确认新增数据 
        createData() {
        	this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/MIS.AD.01.0001',this.tempAdd, (response) => {
                        this.dialogFormVisibleAdd = false
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    })
                }
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
        //确认修改数据
        updateData() {
           this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/MIS.UP.01.0001', this.tempUp, (response) => {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                          title: 'Success',
                          message: '修改成功',
                          type: 'success',
                          duration: 2000
                        })
                        this.getList()
                    })
                }
            })
        },
        //显示详情弹框
        handleDetail(row) {
            this.tempDetail= Object.assign({}, row)
            this.dialogFormVisibleDetail = true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
    }
}
</script>

<style>
</style>
