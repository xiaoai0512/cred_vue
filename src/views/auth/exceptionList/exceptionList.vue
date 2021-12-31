<!-- 授权例外名单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
	       		:rules="[ { required: true, message: '外部识别号不能为空'}]">
            	<el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text"/>
        	</el-form-item>
        	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
        		:rules="[ { required: true, message: '卡组织标识不能为空'}]">
        	 	<el-select v-model="queryFormObj.cardAssociations" class="wd200" clearable>
                    <el-option v-for="(item, index) in cardAssociationsOptions" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
        	</el-form-item>
    		<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleInfo()">新增</el-button>
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleUp()">修改</el-button>
                <!--<el-button size="medium" icon="el-icon-plus" type="primary" @click="resetInfo()">删除</el-button>-->
            </div>
    	</el-form> 
    	<!--查询基本信息-->
    	<div v-if="showDiv">
    		<el-form ref="refInfo" :model="tempInfo" :rules="rulesInfo">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	            	<el-input v-model="tempInfo.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations">
	            	<el-input v-model="tempInfo.cardAssociations" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="报告日期" prop="contrlReportDate">
	            	<el-input v-model="tempInfo.contrlReportDate" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="报告时间" prop="contrlReportTm">
	            	<el-input v-model="tempInfo.contrlReportTm" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="删除日期" prop="contrlDelDate">
	            	<el-input v-model="tempInfo.contrlDelDate" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="说明" prop="contrlDesc">
	            	<el-input v-model="tempInfo.contrlDesc" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<div v-if="showDivV">
	        		<div class="clearboth"></div>
	        		<div class="mainname titleInfo">VISA详情</div>
	        		<el-form-item class="cl_td" label="控管原因" prop="contrlReason">
		            	<el-input v-model="tempInfo.contrlReason" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="行动码" prop="actCode">
		            	<el-input v-model="tempInfo.actCode" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="地区码" prop="contrlReason" style="display: inline-block;">
		        		<div v-for="cpc in cwbZoneCodesList" style="display: inline-block;width: 42px!important;">
		            		<el-input v-model="cpc.cwbZoneCode" style="width: 100%;" type="text" readonly />
		        		</div>
					</el-form-item>
		        	<el-form-item class="cl_td" label="同步状态" prop="syncFlag">
		            	<el-input v-model="tempInfo.syncFlag" class="wd200" type="text" readonly/>
		        	</el-form-item>
	        	</div>
	        	<div v-if="showDivM">
	        		<div class="clearboth"></div>
		        	<div class="mainname titleInfo">MC详情</div>
		        	<el-form-item class="cl_td" label="顺序号" prop="cardSerialNo">
		            	<el-input v-model="tempInfo.cardSerialNo" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="有效期" prop="expirationDate">
		            	<el-input v-model="tempInfo.expirationDate" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="控管原因" prop="contrlReason">
		            	<el-input v-model="tempInfo.contrlReason" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="VIP金额 " prop="vipAmount">
		            	<el-input v-model="tempInfo.vipAmount" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="币种" prop="currencyCode">
		            	<el-input v-model="tempInfo.currencyCode" class="wd200" type="text" readonly/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="同步状态" prop="syncFlag">
		            	<el-input v-model="tempInfo.syncFlag" class="wd200" type="text" readonly/>
		        	</el-form-item>
	        	</div>
	        </el-form>
	        <div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-plus" type="primary" @click="closeInfo()" >关闭</el-button>
	        </div>
    	</div >
    	<!--新增信息MC-->
	    <el-dialog title="新增信息" :visible.sync="dialogFormVisibleAddM" width="65%">
	        <el-form ref="dataFormAddM" :model="tempAddM" :rules="rulesAddM">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
        			:rules="[ { required: true, message: '外部识别号不能为空'}]">
	        		<el-input v-model="tempAddM.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations"
	        		:rules="[ { required: true, message: '卡组织标识不能为空'}]">
	            	<el-input v-model="tempAddM.cardAssociations" class="wd200" type="text" readonly/>
	        	</el-form-item>
				<el-form-item class="cl_td" label="说明" prop="contrlDesc">
	            	<el-input v-model="tempAddM.contrlDesc" class="wd200" type="text" />
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo">MC详情</div>
				<el-form-item class="cl_td" label="文件ID" prop="fileId"
					:rules="[ { required: true, message: '文件ID不能为空'}]">
                   	<el-select v-model="tempAddM.fileId" class="wd200" clearable>
	                    <el-option v-for="(item, index) in fileIdOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="顺序号" prop="cardSerialNo">
	            	<el-input v-model="tempAddM.cardSerialNo" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="有效期" prop="expirationDate">
	            	<el-input v-model="tempAddM.expirationDate" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="控管原因" prop="contrlReason"
	        		:rules="[ { required: true, message: '控管原因不能为空'}]">
                   	<el-select v-model="tempAddM.contrlReason" class="wd200"  >
	                    <el-option v-for="(item, index) in contrlReasonOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="subAddInfoM()" >确认</el-button>
	            <el-button size="medium"  type="primary" @click="dialogFormVisibleAddM = false" >取消</el-button>
	        </div>
	    </el-dialog>
	    <!--新增信息VISA-->
	   	<el-dialog title="新增信息" :visible.sync="dialogFormVisibleAddV" width="65%">
  	      	<el-form ref="dataFormAddV" :model="tempAddV" :rules="rulesAddV">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	            	<el-input v-model="tempAddV.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations">
	            	<el-input v-model="tempAddV.cardAssociations" class="wd200" type="text" readonly/>
	        	</el-form-item>
				<el-form-item class="cl_td" label="说明" prop="contrlDesc">
	            	<el-input v-model="tempAddV.contrlDesc" class="wd200" type="text"/>
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo">VISA详情</div>
				<el-form-item class="cl_td" label="控管原因" prop="contrlReason">
                   <el-input v-model="tempAddV.contrlReason" @focus="getInfo1()" @blur="closeInfo1()" class="wd200" type="text" />
				</el-form-item>
	        	<el-form-item class="cl_td" label="行动码" prop="actCode">
	            	<el-input v-model="tempAddV.actCode" @focus="getInfo2()" @blur="closeInfo2()" class="wd200" type="text" />
	        	</el-form-item>
	        	<div class="col_tr">
					<div class="col_td" style="height: 100%;" v-show="info1">
						<div class="col2 text_right">输入提示：</div>
						<div class="wd190 float_left">
							<span class="red">L=丢失</span><br/>
							<span class="red">S=被盗</span><br/>
							<span class="red">F=欺诈</span><br/>
							<span class="red">X=伪造</span><br/>
							<span class="red">U=未授权使用</span><br/>
							<span class="red">P=没收</span><br/>
							<span class="red">O=其他</span>
						</div>
					</div>
					<div class="col_td" style="height: 100%;float: right;" v-show="info2">
						<div class="col3 text_right">输入提示 ：</div>
						<div class="wd190 float_left">
							<span class="red">01=联系发卡行</span><br/>
							<span class="red">04=没收</span><br/>
							<span class="red">05=拒绝</span><br/>
							<span class="red">07=特殊情况没收</span><br/>
							<span class="red">11=VIP通过</span><br/>
							<span class="red">41=挂失卡没收</span><br/>
							<span class="red">43=被盗卡没收</span><br/>
							<span class="red">A1~A9=VIP管控</span><br/>
							<span class="red">XA=转发卡行通过</span><br/>
							<span class="red">XD=转发卡行拒绝</span>
						</div>
					</div>
				</div>
				<div v-if="tempAddV.actCode =='04' || tempAddV.actCode =='07' || tempAddV.actCode =='41'
						 || tempAddV.actCode =='43'">
		  	      	<el-form-item class="col_tr" label="地区码" prop="actCode" style="width: 100%;">
	 					<div v-for="(list,$index) in  cwbZoneCodesList" style="width: 100px;display: inline-block;" >
		            		<el-input  maxlength="1" v-model="list.cwbZoneCode"   style="width: 60px;margin-right: 5px;display: inline-block;float: left;" class="wd20" type="text" />
		            		<el-button size="mini" type="primary" @click="czcDel(list,$index)" >删除</el-button>
		        		</div>
		            </el-form-item>
			        <div class="cl_tr text_center"v-if="showBtn">
		            	<el-button size="medium" type="primary" @click="czcAdd()" >新增地区码</el-button>
			        </div>
				</div>
	        </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium" type="primary" @click="subAddInfoV()" >确认</el-button>
	            <el-button size="medium" type="primary" @click="dialogFormVisibleAddV = false" >取消</el-button>
	        </div>
	    </el-dialog>
	    <!--修改-->
	    <!--维护信息MC-->
	    <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUpM" width="65%">
	        <el-form ref="dataFormUpM" :model="tempUpM" :rules="rulesUpM">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
        			:rules="[ { required: true, message: '外部识别号不能为空'}]">
	        		<el-input v-model="tempUpM.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations"
	        		:rules="[ { required: true, message: '卡组织标识不能为空'}]">
	            	<el-input v-model="tempUpM.cardAssociations" class="wd200" type="text" readonly/>
	        	</el-form-item>
				<el-form-item class="cl_td" label="说明" prop="contrlDesc">
	            	<el-input v-model="tempUpM.contrlDesc" class="wd200" type="text" />
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo">MC详情</div>
				<el-form-item class="cl_td" label="文件ID" prop="fileId"
					:rules="[ { required: true, message: '文件ID不能为空'}]">
                   	<el-select v-model="tempUpM.fileId" class="wd200" clearable>
	                    <el-option v-for="(item, index) in fileIdOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="顺序号" prop="cardSerialNo">
	            	<el-input v-model="tempUpM.cardSerialNo" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="有效期" prop="expirationDate">
	            	<el-input v-model="tempUpM.expirationDate" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="控管原因" prop="contrlReason"
	        		:rules="[ { required: true, message: '控管原因不能为空'}]">
                   	<el-select v-model="tempUpM.contrlReason" class="wd200"  clearable>
	                    <el-option v-for="(item, index) in contrlReasonOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="subUpInfoM()" >确认</el-button>
	            <el-button size="medium"  type="primary" @click="dialogFormVisibleUpM = false" >取消</el-button>
	        </div>
	    </el-dialog>
	    <!--维护信息VISA-->
	   	<el-dialog title="维护信息" :visible.sync="dialogFormVisibleUpV" width="65%">
  	      	<el-form ref="dataFormUpV" :model="tempUpV" :rules="rulesUpV">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	            	<el-input v-model="tempUpV.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations">
	            	<el-input v-model="tempUpV.cardAssociations" class="wd200" type="text" readonly/>
	        	</el-form-item>
				<el-form-item class="cl_td" label="说明" prop="contrlDesc">
	            	<el-input v-model="tempUpV.contrlDesc" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo">VISA详情</div>
				<el-form-item class="cl_td" label="控管原因" prop="contrlReason">
                   <el-input v-model="tempUpV.contrlReason" @focus="getUpInfo1()" @blur="upCloseInfo1()" class="wd200" type="text" />
				</el-form-item>
	        	<el-form-item class="cl_td" label="行动码" prop="actCode">
	            	<el-input v-model="tempUpV.actCode" @focus="getUpInfo2()" @blur="upCloseInfo2()" class="wd200" type="text" />
	        	</el-form-item>
	        	<div class="col_tr">
					<div class="col_td" style="height: 100%;" v-show="upInfo1">
						<div class="col2 text_right">输入提示：</div>
						<div class="wd190 float_left">
							<span class="red">L=丢失</span><br/>
							<span class="red">S=被盗</span><br/>
							<span class="red">F=欺诈</span><br/>
							<span class="red">X=伪造</span><br/>
							<span class="red">U=未授权使用</span><br/>
							<span class="red">P=没收</span><br/>
							<span class="red">O=其他</span>
						</div>
					</div>
					<div class="col_td" style="height: 100%;float: right;" v-show="upInfo2">
						<div class="col3 text_right">输入提示 ：</div>
						<div class="wd190 float_left">
							<span class="red">01=联系发卡行</span><br/>
							<span class="red">04=没收</span><br/>
							<span class="red">05=拒绝</span><br/>
							<span class="red">07=特殊情况没收</span><br/>
							<span class="red">11=VIP通过</span><br/>
							<span class="red">41=挂失卡没收</span><br/>
							<span class="red">43=被盗卡没收</span><br/>
							<span class="red">A1~A9=VIP管控</span><br/>
							<span class="red">XA=转发卡行通过</span><br/>
							<span class="red">XD=转发卡行拒绝</span>
						</div>
					</div>
				</div>
				<div v-if="tempUpV.actCode =='04' || tempUpV.actCode =='07' || tempUpV.actCode =='41'
						 || tempAddV.actCode =='43'">
		  	      	<el-form-item class="col_tr" label="地区码" prop="actCode" style="width: 100%;">
	 					<div v-for="(list,$index) in cwbZoneCodeNew" style="width: 100px;display: inline-block;" >
		            		<el-input  maxlength="1" v-model="list.cwbZoneCode"   style="width: 60px;margin-right: 5px;display: inline-block;float: left;" class="wd20" type="text" />
		            		<el-button size="mini" type="primary" @click="up_czcDel(list,$index)" >删除</el-button>
		        		</div>
		            </el-form-item>
			        <div class="cl_tr text_center"v-if="showBtn">
		            	<el-button size="medium" type="primary" @click="up_czcAdd()" >新增地区码</el-button>
			        </div>
				</div>
	        </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium" type="primary" @click="subUpInfoV()" >确认</el-button>
	            <el-button size="medium" type="primary" @click="dialogFormVisibleUpV = false" >取消</el-button>
	        </div>
	    </el-dialog>
	    <!--成本中心客户列表-->
	 	<div v-if="showList">
	     	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="socialCreditCode" label="证件号码" align="center" />
	            <el-table-column prop="statusCodeDesc" label="状态" align="center" />
	            <el-table-column prop="billDay" label="账单日" align="center" />
	            <el-table-column prop="statementFlagDesc" label="是否出账单" align="center" />
	            <el-table-column prop="corporationVipFlagDesc" label="是否VIP公司" align="center" />
	            <el-table-column prop="registerDate" label="注册时间" align="center" />
	            <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handleDetail(row)">详情</el-button>
                    </template> 
                </el-table-column>
	        </el-table>
        	<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
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
                queryFormObj: {
                	pageNum: 1,
                	pageSize:10,
                },
                queryFormRules: {},
                queryFormRef: {}, 
                //查询
                showDiv: false,
                tempInfo: {},
                rulesInfo: {},
                refInfo: {},
                showDivV: false,
                showDivM: false,
               	//新增
                dialogFormVisibleAddM: false,
                dataFormAddM: {},
                tempAddM: {},
                rulesAddM: {},
                dialogFormVisibleAddV: false,
                dataFormAddV: {},
                tempAddV: {},
                rulesAddV: {},
                //cwbZoneCodesList: [],
                info1: false,
                info2: false,
               /*  cwbZoneCodesList: {},*/
                cwbZoneCodesList:[{//地区
		            cwbZoneCode:'',
		        }],
		        cwbZoneCodeStr: '',
               showBtn: true,
               	//修改
               	dialogFormVisibleUpM: false,
                dataFormUpM: {},
                tempUpM: {},
                rulesUpM: {},
                dialogFormVisibleUpV: false,
                dataFormUpV: {},
                tempUpV: {},
                rulesUpV: {},
                upInfo1: false,
                upInfo2: false,
               /*  cwbZoneCodesList: {},*/
                cwbZoneCodeNew:[{//地区
		            cwbZoneCode:'',
		        }],
		        upCwbZoneCodeStr: '',
               	showUpBtn: true,
               	//upcwbZoneCodeNew: [],
            	//详情
                dialogFormVisibleDetail: false,
                tempDetail: {},
                refDetail: {},
                rulesDetail: {},
               	//列表
               	tableTotal: 0,
               	listLoading: false,
               	tableList: [],
               	queryInfo: {},
               	inforData: {},
                // 下拉框
                cardAssociationsOptions: [],//卡组织标识
                fileIdOptions: [],//文件ID
                contrlReasonOptions: [],//管控原因
            }
        },
        created() {
            
        },
       	mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	//卡组织标识
           	this.getSelectDict('dic_cardAssociations').then((res) => {
        		this.cardAssociationsOptions = res
    		})
           	//文件Id
           	this.getSelectDict('dic_fileType').then((res) => {
        		this.fileIdOptions = res
    		})
           	//管控原因
           	this.getSelectDict('dic_contrlR').then((res) => {
        		this.contrlReasonOptions = res
    		})
        },
      	methods: {
	      	handleSearch(){
	      		if ((this.queryFormObj.externalIdentificationNo == '' || this.queryFormObj.externalIdentificationNo == undefined 
	      			|| this.queryFormObj.externalIdentificationNo == null) && (this.queryFormObj.cardAssociations == '' ||
	      			this.queryFormObj.cardAssociations == undefined || this.queryFormObj.cardAssociations == null)) {
					this.$message('请输入查询条件'); 
					return;
	      		
				} else if(!this.queryFormObj.externalIdentificationNo){
					this.$message('请输入外部识别号'); 
					return;
				}else if(!this.queryFormObj.cardAssociations){
					this.$message('请选择卡组织标识'); 
					return;
				}
				this.getInfo()
      		},
      		//重置
	      	resetInfo(){
      			this.queryFormObj = {}
      		},
      		//基本信息
      		getInfo(){
      			if(this.queryFormObj.cardAssociations=='V'){
      				this.showDivV = true//VISA详情
      				this.showDivM = false//Mc详情
      			}else if(this.queryFormObj.cardAssociations=='M'){
      				this.showDivM = true
      				this.showDivV = false
      			}
      			this.showDiv = true
	      		let params ={
	      			authDataSynFlag: '1',
	      			cardAssociations: this.queryFormObj.cardAssociations,
		   			externalIdentificationNo:  this.queryFormObj.externalIdentificationNo,
		        }
	      		this.post('/auth/authService/AUS.IQ.01.0008', params, (res) => {
	   				if(res.returnCode == '000000') {
       			 		this.tempInfo = res.returnData.authSpecContrlDto
						let cwbstr = ''
						this.cwbZoneCodesList =[]
						if(this.tempInfo.cwbZoneCode){
	                		for(var i=0;i<this.tempInfo.cwbZoneCode.length;i++){
	                			cwbstr = {'cwbZoneCode':this.tempInfo.cwbZoneCode.substr(i,1)};
								this.cwbZoneCodesList.push(cwbstr);
	                		}
	                	}
					}else{
		            	this.showDiv = false
		            }
	        	})
	      	},
	      	//关闭
	      	closeInfo(){
	      		this.tempInfo = {}
	      		this.showDiv = false
	      	},
	      	//新增V
	      	handleInfo(){
	      		this.$refs['queryFormRef'].validate((valid) => {
                	if (valid) {
                		if(this.queryFormObj.cardAssociations =='V'){
                			this.tempAddV.externalIdentificationNo=this.queryFormObj.externalIdentificationNo
	                		this.tempAddV.cardAssociations=this.queryFormObj.cardAssociations
	                		this.cwbZoneCodesList = [{}]
				      		this.dialogFormVisibleAddV = true
				       		this.$nextTick(() => {
				                this.$refs['dataFormAddV'].clearValidate()
				            })
			       		}else if(this.queryFormObj.cardAssociations =='M'){
	                		this.tempAddM.externalIdentificationNo=this.queryFormObj.externalIdentificationNo
	                		this.tempAddM.cardAssociations=this.queryFormObj.cardAssociations
				      		this.dialogFormVisibleAddM = true
				       		this.$nextTick(() => {
				                this.$refs['dataFormAddM'].clearValidate()
				            })
                		}
                	}
				})		
	      	},
	      	//管控区与行动码提示信息
	      	getInfo1(){
	      		this.info1 = true
	      	},
	      	getInfo2(){
	      		this.info2 = true
	      	},
	      	closeInfo1(){
	      		this.info1 = false
	      	},
	      	closeInfo2(){
	      		this.info2 = false
	      	},
	      	//地区码添加9个新增按钮牛隐藏
	      	czcAdd (){
		        this.cwbZoneCodesList.push({cwbZoneCode:''})
		       	if(this.cwbZoneCodesList.length >='9'){
		       		this.showBtn = false
		       	}else {
		       		this.showBtn = true
		       	}
		    },
		    czcDel(e,$index){
		    	this.cwbZoneCodesList.splice($index,1);
		    },
	      	//新增确认提交信息
	      	subAddInfoV(){
	      		if(this.tempUpV.actCode =='04' || this.tempUpV.actCode =='07' || this.tempUpV.actCode =='41'
					|| this.tempAddV.actCode =='43'){
					if(this. cwbZoneCodesList.length > 0){
						for(var i=0;i<this. cwbZoneCodesList.length;i++){
							if(this. cwbZoneCodesList[i].cwbZoneCode == "" || this. cwbZoneCodesList[i].cwbZoneCode == null || this. cwbZoneCodesList[i].cwbZoneCode == undefined){
								this.$message('请输入完整地区码');
								return;
							}else{
								this.cwbZoneCodeStr += this. cwbZoneCodesList[i].cwbZoneCode;
					      	}
						}
					}
	      		}
	      		this.tempAddV.authFlag = "0";
				this.tempAddV.authDataSynFlag = "1";
	      		this.tempAddV.cwbZoneCode= this.cwbZoneCodeStr
	      		this.$refs['dataFormAddV'].validate((valid) => {
                	if (valid) {
			      		this.post('/auth/authService/AUS.OP.01.0001', this.tempAddV, (res) => {
							  
							if (res.returnCode == '000000') {
								this.$notify({
									title: 'Success',
									message: '保存成功',
									type: 'success',
									duration: 2000
								}) 
								this.dialogFormVisibleAddV = false
								this.getInfo()
								this.tempAddV = {}
								this.showDiv = true
								showDivV = true
							}
			            })
	      			}
	      		})
	      	},
	      	//新增M
	      	subAddInfoM(){
	      		this.tempAddM.authFlag = "0";
				this.tempAddM.authDataSynFlag = "1";
	      		this.$refs['dataFormAddM'].validate((valid) => {
                	if (valid) {
			      		this.post('/auth/authService/AUS.OP.01.0002', this.tempAddM, (res) => {
							if (res.returnCode == '000000') {
								this.$notify({
									title: 'Success',
									message: '保存成功',
									type: 'success',
									duration: 2000
								}) 
								this.dialogFormVisibleAddM = false
								this.getInfo()
								this.tempAddM = {}
								this.showDiv = true
								this.showDivM = true
							}
			            })
	      			}
	      		})
	      	},
	      	//详情展示摊框
	       	handleDetail(){
	       		this.dialogFormVisibleDetail = true
	       		this.tempDetail = Object.assign({}, row)
				this.$nextTick(() => {
	                this.$refs['dataFormDetail'].clearValidate()
	            })
	       	},
	       	//修改展示摊框
	       	handleUp(){
	       		this.$refs['queryFormRef'].validate((valid) => {
                	if (valid) {
                		this.post('/auth/authService/AUS.IQ.01.0008', this.queryFormObj, (res) => {
			                if (res.returnCode == '000000') {
			                    	let itemU = {}
			                    	itemU = res.returnData.authSpecContrlDto
			                    	if(this.queryFormObj.cardAssociations =='V'){
			                       		this.tempUpV = Object.assign({}, itemU) //
			                       		let cwbstr = ''
										this.cwbZoneCodeNew =[]
										if(this.tempUpV.cwbZoneCode){
					                		for(var i=0;i<this.tempUpV.cwbZoneCode.length;i++){
					                			cwbstr = {'cwbZoneCode':this.tempUpV.cwbZoneCode.substr(i,1)};
												this.cwbZoneCodeNew.push(cwbstr);
					                		}
					                	}
										if(this.cwbZoneCodeNew.length>=9){
											this.showBtn = false
								       	}else {
								       		this.showBtn = true
								       	}
			                       		this.dialogFormVisibleUpV = true
							       		this.$nextTick(() => {
							                this.$refs['dataFormUpV'].clearValidate()
							            })
						       		}else if(this.queryFormObj.cardAssociations =='M'){
				                		this.tempUpM = Object.assign({}, itemU) //
				                		this.dialogFormVisibleUpM = true
							       		this.$nextTick(() => {
							                this.$refs['dataFormUpM'].clearValidate()
							            })
			                		}
			                    }
			               	this.dialogFormVisibleAddM = false
			            })
                	}
				})	
	       	},
	       	//管控区与行动码提示信息
	      	getUpInfo1(){
	      		this.upInfo1 = true
	      	},
	      	getUpInfo2(){
	      		this.upInfo2 = true
	      	},
	      	upCloseInfo1(){
	      		this.upInfo1 = false
	      	},
	      	upCloseInfo2(){
	      		this.upInfo2 = false
	      	},
	      	//地区码添加9个新增按钮牛隐藏
	      	up_czcAdd (){
		        this.cwbZoneCodeNew.push({cwbZoneCode:''})
		       	if(this.cwbZoneCodeNew.length >='9'){
		       		this.showBtn = false
		       	}else {
		       		this.showBtn = true
		       	}
		    },
		    up_czcDel(e,$index){
		    	this.cwbZoneCodeNew.splice($index,1);
		    	if(this.cwbZoneCodeNew.length <'9'){
	 				this.showBtn = true;
		 		}else{
		 			this.showBtn = false;
		 		}
		    },
		    subUpInfoV(){
		    	let cwbZoneCodeStr = ''
		    	if( this.cwbZoneCodeNew.length > 0){
					for(var i=0;i< this.cwbZoneCodeNew.length;i++){
						if( this.cwbZoneCodeNew[i].cwbZoneCode == "" ||  this.cwbZoneCodeNew[i].cwbZoneCode == null ||  this.cwbZoneCodeNew[i].cwbZoneCode == undefined){
							this.$message('请输入完整地区码')
							return
						}else{
							cwbZoneCodeStr +=  this.cwbZoneCodeNew[i].cwbZoneCode;
						}
					}
				}
		    	this.tempUpV.authDataSynFlag = '1'
		    	this.tempUpV.authFlag = '1'
		    	this.tempUpV.cwbZoneCode = cwbZoneCodeStr
		    	this.$refs['dataFormUpV'].validate((valid) => {
                	if (valid) {
			      		this.post('/auth/authService/AUS.OP.01.0001', this.tempUpV, (res) => {
							if (res.returnCode == '000000') {
								 this.$notify({
									title: 'Success',
									message: '修改成功',
									type: 'success',
									duration: 2000
								}) 
								this.dialogFormVisibleUpV = false
								this.getInfo()
								this.tempUpV = {}
								this.showDiv = true
								this.showDivV = true
							}
			            })
	      			}
	      		})
		    },

   		}
	}
</script>
<style>
.red{ color: #FF0000;}
</style>
