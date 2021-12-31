<!-- 清算处理结果 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="渠道" prop="channelId" >
                <el-select v-model="queryFormObj.channelId" class="wd200">
                <el-option
                    v-for="(item, index ) in channelIdOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.channelId"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="文件名" prop="fileName">
                <el-input v-model="queryFormObj.fileName" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="文件上送日期" prop="dateOfFileDelivery">
                <el-date-picker class="wd200"
                    v-model="queryFormObj.dateOfFileDelivery"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
               <!-- <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>-->
            </div>
        </el-form>
        <div v-if="showDiv">
            <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column prop="channelId" label="渠道ID" align="center" />
                <el-table-column prop="fileName" label="上传文件名" align="center" />
                <el-table-column prop="stProcessDate" label="文件开始处理日期" align="center" />
                <el-table-column prop="stProcessTime" label="   文件开始处理时间" align="center" />
                <el-table-column label="处理状态" align="center" />
                    <span ng-if="tableList.processStatus == 'R'">文件被拒</span>
                    <span ng-if="tableList.processStatus == 'P'">处理中</span>
                    <span ng-if="tableList.processStatus == 'F'">处理完成</span>
                </el-table-column>
                <el-table-column prop="totalCount" label="处理总笔数" align="center" />
                <el-table-column prop="failCount" label="失败笔数" align="center" />
                <el-table-column prop="endProcessDate" label="文件处理完成日期" align="center" />
                <el-table-column prop="endProcessTime" label="文件处理完成时间" align="center" />
                <el-table-column prop="rejectReason" label="拒绝原因" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-if="tableList.failCount !='0'">查询详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!--查询-->
        <el-dialog title="查看处理明细" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-table v-loading = "detailListLoading" :data="tableListDetail" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
                <el-table-column prop="batchHeader" label="批次号" align="center" />
                <el-table-column prop="sequenceNumber" label="顺序号" align="center" />
                <el-table-column prop="purchaseDate" label="交易日期" align="center" />
                <el-table-column prop="transactionProcessingCode" label="交易码" align="center" />
                <el-table-column prop="sourceAmount" label="交易金额" align="center" />
                <el-table-column prop="sourceCurrencyCode" label="交易币种" align="center" />
                <el-table-column prop="authorizationCode" label="授权成功代码" align="center" />
                <el-table-column prop="rejectionReasonCode" label="拒绝原因码" align="center" />
                <el-table-column prop="rejectionReasonDesc" label="拒绝原因描述" align="center" />
            </el-table>
            <pagination v-show="detailTotal>0" :total="detailTotal" :page.sync="detailPage.pageNum" :limit.sync="detailPage.pageSize" @pagination="getDetailList" />
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
                channelIdOptions: [],//渠道
                //详情
                dialogFormVisibleDetail: false,
                dataFormDetail: {},
                tempDetail: [],
                rulesDetail: {},
                detailPage: {
                    pageNum: 1,
                    pageSize:10,
                },
                tableListDetail:[],
                detailTotal: 0,
                detailListLoading: false,
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            //渠道
            this.getSelectDict( "/beta/betaService/MIS.IQ.01.0001").then(res => {
                this.channelIdOptions = res
            })
        },
      methods: {
        // 列表
        getList() {
            this.listLoading1 = true
            this.showDiv = true
            let params = {
                pageNum: this.queryFormObj.pageNum,
                pageSize: this.queryFormObj.pageSize,
            }
            this.getTableList('/nonfi/nonfinanceService/MIS.IQ.02.0001', params,(res) => {
                 this.listLoading1 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }
                }
            })
        },
        handleSearch() {
            this.getList()
        },
        //显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.tempDateil = row
            this.getDetailList()
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
        getDetailList(){
            this.detailListLoading = true
            let obj = {
                "pageSize":10,
                "indexNo":0,
                queryFileFlag: '2',
                adminFlagUser: this.tempDetail.adminFlagUser,
                channelId: this.tempDetail.channelId,
                clientToken: this.tempDetail.clientToken,
                corporation: this.tempDetail.corporation,
                endProcessDate: this.tempDetail.endProcessDate,
                endProcessTime: this.tempDetail.endProcessTime,
                failCount: this.tempDetail.failCount,
                fileName: this.tempDetail.fileName,
                id: this.tempDetail.id,
                operatorId: this.tempDetail.operatorId,
                processStatus: this.tempDetail.processStatus,
                queryFileFlag: this.tempDetail.queryFileFlag,
                stProcessDate: this.tempDetail.stProcessDate,
                stProcessTime: this.tempDetail.stProcessTime,
                totalCount: this.tempDetail.totalCount,
                userLanguage: this.tempDetail.userLanguage,
                pageNum: this.detailPage.pageNum,
                pageSize: this.detailPage.pageSize,
            }
            this.getTableList('/nonfi/nonfinanceService/MIS.IQ.02.0001', params,(res) => {
                this.detailListLoading = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableListDetail = res.returnData.rows
                        this.detailTotal = res.returnData.totalCount
                    }
                }
            })
        },
    }
}
</script>
<style>
</style>
