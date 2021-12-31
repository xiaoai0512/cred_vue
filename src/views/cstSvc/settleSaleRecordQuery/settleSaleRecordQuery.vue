<!-- 结售汇记录查询 -->
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
	           	<el-table-column  label="外部识别号/账户号" align="center" />
	           		<span v-if="tableList.externalIdentificationNo == null ">{{tableList.accountId}}</span>
					<span v-if="tableList.externalIdentificationNo != '' ">{{tableList.externalIdentificationNo}}</span>
					<span v-if="tableList.externalIdentificationNo == '0000000000000000000' ">{{tableList.accountId}}</span>
	           </el-table-column>
	            <el-table-column prop="postingCurrencyCode" label="入账币种" align="center" />
	            <el-table-column prop="settlementCurrencyCode" label="入账金额" align="center"/>
	            <el-table-column prop="settlementCurrencyCode" label="清算币种" align="center" />
	            <el-table-column prop="settlementAmount" label="清算金额" align="center"/>
             	<el-table-column prop="postingConvertRate" label="汇率" align="center"/>
              	<el-table-column prop="transDate" label="交易日期" align="center"/>
              	<el-table-column prop="eventNo" label="事件编号" align="center"/>
              	<el-table-column prop="eventDesc" label="事件描述" align="center"/>
              	<el-table-column prop="" label="操作" align="center" >
	                <template slot-scope="{row}">
	                   <el-button size="mini" type="primary" @click="handDetail(row)">查看</el-button>
	                </template> 
	            </el-table-column>
            </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    		<!--查看-->
    		<el-dialog title="结售汇记录详情" :visible.sync="dialogFormVisibleDetail"  width="65%">
            	<el-form ref="dataFormDetail" :model="tempDetail" :rules="rulesDetail">
	                <el-form-item class="cl_td bnone" label="事件编号" prop="eventNo" >
	                    <el-input v-model="tempDetail.eventNo" class="wd200" type="text" readonly />
	               	</el-form-item>
	               	<el-form-item class="cl_td bnone" label="活动编号" prop="activityNo" >
	                     <el-input v-model="tempDetail.activityNo" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td" label="外部识别号" prop="ecommTransPostingAmount">
	                    <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="账户号/余额单元号" prop="entityKey" >
	                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly />
	              	</el-form-item>
	               	<el-form-item class="cl_td bnone" label="交易日期" prop="transDate" >
	                     <el-input v-model="tempDetail.transDate" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td" label="入账时间" prop="occurrDate">
	                    <el-input v-model="tempDetail.occurrDate" class="wd200" type="text"  readonly/>
	                </el-form-item>
	          		<el-form-item class="cl_td bnone" label="交易币种" prop="transCurrCde" >
	                    <el-input v-model="tempDetail.transCurrCde" class="wd200" type="text" readonly />
	               </el-form-item>
	               <el-form-item class="cl_td bnone" label="交易金额" prop="transAmount" >
	                     <el-input v-model="tempDetail.transAmount" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td" label="入账币种" prop="postingCurrencyCode">
	                    <el-input v-model="tempDetail.postingCurrencyCode" class="wd200" type="text"  readonly/>
	                </el-form-item>
	           		<el-form-item class="cl_td bnone" label="入账金额" prop="postingAmount" >
	                    <el-input v-model="tempDetail.postingAmount" class="wd200" type="text" readonly/>
	               	</el-form-item>
	               	<el-form-item class="cl_td bnone" label="清算币种" prop="settlementCurrencyCode" >
	                     <el-input v-model="tempDetail.settlementCurrencyCode" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td" label="清算金额" prop="settlementAmount">
	                    <el-input v-model="tempDetail.settlementAmount" class="wd200" type="text" readonly/>
	                </el-form-item>
	          		<el-form-item class="cl_td bnone" label="入账转换汇率" prop="postingConvertRate" >
	                    <el-input v-model="tempDetail.postingConvertRate" class="wd200" type="text" readonly />
	               	</el-form-item>
	               	<el-form-item class="cl_td bnone" label="交易描述" prop="transDesc" >
	                     <el-input v-model="tempDetail.transDesc" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td" label="余额类型" prop="settlementAmount">
	                    <el-input v-model="tempDetail.settlementAmount" class="wd200" type="text"  />
	                    <span ng-if="tempDetail.balanceType=='P'">本金</span>
						<span ng-if="tempDetail.balanceType=='I'">利息</span>
						<span ng-if="tempDetail.balanceType=='F'">費用</span>
	                </el-form-item>
	       			<el-form-item class="cl_td bnone" label="客户号" prop="customerNo" >
	                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly />
	               	</el-form-item>
	               	<el-form-item class="cl_td bnone" label="账户代码" prop="accountId" >
	                     <el-input v-model="tempDetail.accountId" class="wd200" type="text" readonly />
	                </el-form-item>
	      			<el-form-item class="cl_td bnone" label="交易状态" prop="customerNo" >
	                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly />
	               		<span  ng-if="tempDetail.transState == 'NOR'">正常 </span>
						<span  ng-if="tempDetail.transState == 'INS'">已分期</span>
						<span  ng-if="tempDetail.transState == 'REV'">已冲正 </span>
						<span  ng-if="tempDetail.transState == 'FRT'">全额退货</span>
						<span  ng-if="tempDetail.transState == 'PRT'">部分退货  </span>
						<span  ng-if="tempDetail.transState == 'DIS'">争议登记</span>
	                </el-form-item>
	               	<el-form-item class="cl_td bnone" label="业务类型代码" prop="businessTypeCode" >
	                    <span>{{tempDetail.businessTypeCode}}</span><span>{{tempDetail.businessDesc}}</span>
	                    <el-input v-model="tempDetail.businessTypeCode" class="wd200" type="text" readonly />
	                </el-form-item>
	         		<el-form-item class="cl_td bnone" label="余额对象代码" prop="customerNo" >
	                    <span>{{tempDetail.balanceObjectCode}}</span><span>{{tempDetail.objectDesc}}</span>
					</el-form-item>
	               	<el-form-item class="cl_td bnone" label="授权码" prop="authCde" >
	                     <el-input v-model="tempDetail.authCde" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="来源码" prop="sourceCde" >
	                     <el-input v-model="tempDetail.sourceCde" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="交易国家代码" prop="transCountryCde" >
	                     <el-input v-model="tempDetail.transCountryCde" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="交易城市代码" prop="transCityCde" >
	                     <el-input v-model="tempDetail.transCityCde" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="收单参考号" prop="acquireReferenceNumbr" >
	                     <el-input v-model="tempDetail.acquireReferenceNumbr" class="wd200" type="text" readonly />
	                </el-form-item>
	               	<el-form-item class="cl_td bnone" label="渠道代码" prop="channelCde" >
	                     <el-input v-model="tempDetail.channelCde" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="商户类别码" prop="mcc" >
	                     <el-input v-model="tempDetail.mcc" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="商户代码" prop="merchantCde" >
	                     <el-input v-model="tempDetail.merchantCde" class="wd200" type="text" readonly />
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="全局流水号" prop="globalSerialNumbr" >
	                     <el-input v-model="tempDetail.globalSerialNumbr" class="wd200" type="text" readonly />
	                </el-form-item>
    			</el-form>
	            <div slot="footer" class="dialog-footer">
	             	<el-button @click="dialogFormVisibleDetail = false"> 关闭 </el-button>
	            </div>
        	</el-dialog>
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
	           	// 列表
	            showDiv: false,
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading: false,
	            tableList: [],
	            tableTotal: 0,
	            //详情
	            dataFormDetail: {},
	            rulesDetail: {},
	            tempDetail: {},//forem
	            dialogFormVisibleDetail: false,
	            //下拉
	            idTypeList: [],//证件类型
    		}
        },
        created() {
            //this.getBtnAuth()
        },
        mounted() {
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
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
           	this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0011', this.queryForm,(res) => {
           		if (res.returnCode == '000000') {
           			this.listLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.productObjectCodeDesc = item.productObjectCode+ ''+item.productDesc
                		})
						
                    }
                }
            })
        },
        //查看详情显示的弹框
        handDetail(row) {
	        this.dialogFormVisibleDetail = true
	     	this.tempDetail = Object.assign({}, row) 
	      	this.$nextTick(() => {
	        	this.$refs['dataFormDetail'].clearValidate()
	      	})
	   	},
    }
}
</script>

<style>
</style>
