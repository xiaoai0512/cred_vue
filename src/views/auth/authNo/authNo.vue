<!-- 未入账交易查询 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="queryRef" :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200" clearable placeholder="请选择">
                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                <el-select v-model="queryForm.authSceneCode" class="wd200" clearable>
                    <el-option v-for="(item, index) in authSceneCodeOptions" 
                        :key="index" 
                        :label="item.concat" 
                        :value="item.authSceneCode"/>
                </el-select>
            </el-form-item>
            <div class="" style="display: inline-block;width: 74%;">
	            <el-form-item class="cl_td" label="交易处理日期" prop="startDate" style="display: inline-block;width: 34%;
    					margin-left: 13.5%;">
	                <el-date-picker 
	                    class="wd200"
                        v-model="queryForm.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                  	</el-date-picker >
	            </el-form-item>
	           	<span >~</span>
	            <el-form-item class="" prop="endDate" style="width: 30%;display: inline-block;margin-left: 5px;">
	                <el-date-picker
	                    v-model="queryForm.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"/>
	                </el-date-picker >
	            </el-form-item>
			</div>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!--客户费用信息查询表-->
        <div v-if="isShow">
            <el-table v-loading="listLoading1" :data="tablesList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id">
                <el-table-column prop="cusNo" label="外部识别号" align="center" width='150'/>
                <el-table-column prop="processingDate" label="交易处理日期 " align="center"  width="120"/>
                <el-table-column prop="processingTime" label="交易处理时间" align="center"  width="120"/>
                <el-table-column prop="transCurrCode" label="交易币种" align="center"  width="80"/>
                <el-table-column prop="transAmt" label="交易金额" align="center" width="80"/>
                <el-table-column prop="releaseAmtCurrCode" label="已释放币种" align="center" />
                <el-table-column prop="releaseAmt" label="已释放金额" align="center" />
                <el-table-column prop="billingCurrCode" label="入账币种" align="center" width="100"/>
                <el-table-column prop="billingAmt" label="入账金额" align="center" width="80"/>
                <el-table-column prop="authSceneCodeDesc" label="授权场景" align="center" width="80"/>
                <el-table-column prop="authApprovalCde" label="授权成功码 " align="center" />
                <el-table-column prop="transStatusDesc" label="状态" align="center" />
                <el-table-column prop="transRetainDate" label="交易失效日期 " align="center" width="100"/>
                <el-table-column prop="overplusDay" label="剩余天数" align="center" width="80"/>
            </el-table>
            <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
    </div>
</template>
<script>
    import Pagination from "@/components/Pagination";
    export default {
        name: 'tableList',
        components: {
            Pagination,
        },
        data() {
            return {
                queryForm: {},
                queryRef: {},
                tablesList: [],//列表
                listLoading1: false,
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                tableTotal: 0,
                isShow: false,
                //下拉
                authSceneCodeOptions: [],
                chargingFrequencyOptions: [],
                idTypeList: [],
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() < Date.now();
                  },
                }
            }
        },
        created() {},
        mounted() {
            //证件类型
            this.getSelectDict('dic_certificateType').then((res) => {
                this.idTypeList = res
            })
            //授权
            let obj={
                groupsCode: "dic_periodArray",
                queryFlag: "1",
                type: "DROPDOWNBOX",
            }
            this.getSelectDict('/beta/betaService/AUS.PM.01.0002',obj).then((res) => {
                res.forEach(item => {
                    item.concat = item.authSceneCode + ' ' + item.sceneDesc
                });
                this.authSceneCodeOptions = res
            })
        },
        methods: {
            init() {
                this.queryForm = {
                    idType: '',
                    idNumber: '',
                    externalIdentificationNo: '',
                }
                this.isShow = false // 结息交易列表
            },
            // 重置
            reset() {
                this.init()
            },
            // 点击查询按钮
            handleSearch() {
                if(!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                    this.$message({
                        message: '请输入查询信息',
                        type: 'warning'
                    })
                    this.init()
                } else {
                    if(this.queryForm.idType) {
                        if(!this.queryForm.idNumber) {
                            this.$message({
                                message: '请输入证件号码',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    } else if(this.queryForm.idNumber) {
                        if(!this.queryForm.idType) {
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
            //列表
            getList() {
                this.isShow = true
                this.listLoading1 = true
                let params = {
                    idType: this.queryForm.idType,   
                    idNumber: this.queryForm.idNumber,
                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                    authSceneCode: this.queryForm.authSceneCode,
                    startDate: this.queryForm.startDate,
                    endDate: this.queryForm.endDate,
                    authDataSynFlag: "1",
                    isTrans: true,//是否需要翻译数据字典
                    transParams : ['dic_transStatus'],//查找数据字典所需参数
                    transDict : ['transStatus'],//翻译前后key
                }
                params = Object.assign(params, this.queryFormObj);
                this.getTableList('/auth/authService/AUS.IQ.02.0003', params, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoading1 = false
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.tablesList = res.returnData.rows
                            this.tablesList.authTransMessage = res.returnData.rows.authTransMessage
                            this.tableTotal = res.returnData.totalCount
                            this.tablesList.forEach(item => {
                                item.authSceneCodeDesc = item.authSceneCode+ ''+item.sceneDesc
                            })
                        }else {
                            this.tablesList = []
                            this.tableTotal = 0
                        }
                    }
                }, (err) =>{
                	this.tablesList = []
                    this.tableTotal = 0
                    this.listLoading1 = false
                })
            },
        }
    }
</script>

<style>

</style>    