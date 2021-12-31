<!-- 媒介额度查询 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
            </div>
        </el-form>
        <!--列表-->
        <div v-if="showList">
            <!--<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="item.productObjectCodeDesc"  :label="creditDescName" align="center" />
	            <el-table-column prop="currencyCode" label="币种" align="center" />
	            <el-table-column prop="permLimit" label="固定额度" align="center" />
	            <el-table-column prop="toleranceLimit" label="容差额度" align="center" />
	            <el-table-column prop="tempLimit" label="临时额度" align="center" />
	            <el-table-column prop="tempLimitEffectvDate" label="临时额度生效日" align="center" />
	            <el-table-column prop="tempLimitExpireDate" label="临时额度失效日" align="center" />
	            <el-table-column prop="paymentOutstandingAmt" label="还款未入账金额" align="center" />
	            <el-table-column prop="outstandingAmt" label="未入账额度" align="center" />
	            <el-table-column prop="balance" label="已入账额度" align="center" />
	            <el-table-column prop="occupyAmt" label="额度占用金额" align="center" />
	            <el-table-column prop="availableLimit" label="可用额度" align="center" />
	        </el-table>-->
		 	<div style="margin-bottom:20px" class="cl_th">
                <table style="width:100%" v-for="item in tableList" cellspacing="0">
                    <thead>
                        <tr>
                            <th align="center" v-if="item.creditDesc != '' && item.creditDesc != null " colspan="7">
                                <br>
                            </th>
                        </tr>
                        <tr style="background-color: #DCDCDC;">
                            <th align="center" v-if="item.creditDesc != '' && item.creditDesc != null">
                                <span>{{item.creditDesc}}</span></th>
                        </tr>
                        <tr style="background-color: #DCDCDC;"
                            v-if="item.productObjectCode == '' || item.productObjectCode == null">
                            <th style="width:14%;padding:0 5px" align="center">应用对象</th>
                            <!--应用对象-->
                            <th style="width:5%;padding:0 5px" align="center">币种</th>
                            <!--币种-->
                            <th style="width:7%;padding:0 5px" align="center">固定额度</th>
                            <!--固定额度-->
                            <th style="width:7%;padding:0 5px" align="center">容差额度</th>
                            <!--容差额度-->
                            <th style="width:7%;padding:0 5px" align="center">临时额度</th>
                            <!--临时额度-->
                            <th style="width:10%;padding:0 5px" align="center">临时额度生效日</th>
                            <!--临时额度生效日-->
                            <th style="width:10%;padding:0 5px" align="center">临时额度失效日</th>
                            <!--临时额度失效日-->
                            <th style="width:9%;padding:0 5px" align="center">还款未入账</th>
                            <!--还款未入账-->
                            <th style="width:7%;padding:0 5px" align="center">未入账额度</th>
                            <!--未入账额度-->
                            <th style="width:8%;padding:0 5px" align="center">已入账额度</th>
                            <!--已入账额度-->
                            <th style="width:8%;padding:0 5px" align="center">额度占用金额</th>
                            <!--额度占用金额-->
                            <th style="width:6%;padding:0 5px" align="center">可用额度</th>
                            <!--可用额度-->
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width:14%" align="center">{{item.productObjectCode}} {{item.productDesc}}</td>
                            <td align="center" style="width: 5%;">{{item.currencyCode}}</td>
                            <td style="width:7%" align="center">{{item.permLimit}}</td>
                            <td style="width:7%" align="center">{{item.toleranceLimit}}</td>
                            <td style="width:7%" align="center">{{item.tempLimit}}</td>
                            <td style="width:10%" align="center">{{item.tempLimitEffectvDate}}</td>
                            <td style="width:10%" align="center">{{item.tempLimitExpireDate}}</td>
                            <td style="width:9%" align="center">{{item.paymentOutstandingAmt}}</td>
                            <td style="width: 7%;" align="center">{{item.outstandingAmt}}</td>
                            <td style="width: 8%;" align="center">{{item.balance}}</td>
                            <td style="width: 8%;" align="center">{{item.occupyAmt}}</td>
                            <td style="width: 6%;" align="center">{{item.availableLimit}}</td>
                        </tr>
                    </tbody>
                </table>
                <!--<div ng-if="isDateList2" style="text-align: center;">暂无数据</div>-->
            </div>

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
                logininfo: '',
                // form
                stBtnFlag: false,
                showList: false,
                queryFormObj: {},
                queryFormRules: {},
                queryFormRef: {},
                //列表
                tableTotal: 0,
                listLoading: false,
                tableList: [],
                queryInfo: {},
                inforData: {},
                // 下拉框
                institutionIdOptions: [],//所属机构
            }
        },
        created() {

        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限

            //所属机构
            this.getSelectDict('/beta/betaService/COS.IQ.02.0005').then((res) => {
                this.institutionIdOptions = res
            })

        },
        methods: {
            handleSearch() {
                if (this.queryFormObj.externalIdentificationNo == '' || this.queryFormObj.externalIdentificationNo == undefined
                    || this.queryFormObj.externalIdentificationNo == null) {
                    this.$message('请输入查询条件');
                    return;
                }
                this.getList()
            },
            //列表
            getList() {
                this.listLoading = true
                this.showList = true
                this.showDiv = false
                let params = {
                    externalIdentificationNo: this.queryFormObj.externalIdentificationNo,
                    authDataSynFlag: "1",
                    availableClass: "P",
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0005', params, (res) => {
                	this.listLoading = false
                     if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let nameObj = '应用对象'
                            this.tableList = res.returnData.rows
                            this.tableList.forEach(item => {
                                if (item.creditDesc != null) {
                                    item.creditDescName = item.creditDesc
                                } else {
                                    item.creditDescName = ''
                                }
                                if (item.productObjectCode != null) {
                                    item.productObjectCodeDesc = item.productObjectCode + '' + item.productDesc
                                } else {
                                    item.productObjectCodeDesc = ''
                                }
                            })
                        }
                    } else {
                        this.tableList = []
                        this.showList = false
                    }
                }, (err) => {
                    if (err) {
                        this.tableList = []
                        this.showList = false
                    }
                })
            },

        }
    }
</script>
<style>
    .cl_th th {
        color: #909399;
        font-size: 14px;
        line-height: 35px;
        padding: 8px;
    }

    .cl_th td {
        font-size: 14px;
        color: #606266;
        font-family: inherit;
        padding: 8px;
    }
</style>