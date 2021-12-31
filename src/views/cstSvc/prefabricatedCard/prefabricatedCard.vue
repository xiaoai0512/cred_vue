<!-- 预制卡分配 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form :model="queryForm">
        	<el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                <el-input v-model="queryForm.corporationEntityNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="产品对象" prop="productObjectCode">
                <el-select v-model="queryForm.productObjectCode" class="wd200">
                <el-option v-for="(item, index) in productObjectCodeOptions" 
                	:key="index" 
                	:label="item.productObjectCodeDesc" 
                	:value="item.productObjectCode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="分配标识" prop="flag">
                <el-select v-model="queryForm.flag" class="wd200">
                <el-option v-for="(item, index) in flagOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
	                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleQuery()">查询</el-button>
	                <el-button size="medium" icon="el-icon-search" type="primary" @click="reset()">重置</el-button>
	            </div>
        </el-form>
       	<div class="text_title">预制卡信息表</div>   
    	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" @current-change="handleCurrRowChange1" @row-click="chooseCurrRow1"
    		fit highlight-current-row  style="width: 100%;" border>
        	<el-table-column width="55">
                <template slot-scope="scope">
                    <el-radio v-model="templateRadio1" :label="scope.row.externalIdentificationNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
            <el-table-column prop="externalIdentificationNo" label="卡号" align="center" />
            <el-table-column prop="expirationDate" label="有效期" align="center" />
            <el-table-column prop="mediaObjectCodeDesc" label="媒介对象" align="center"/>
            <el-table-column prop="productObjectCodeDesc" label="产品对象" align="center" />
            <el-table-column prop="flagDesc" label="分配标识" align="center"/>
         	<el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button size="medium" v-if="row.flag !='Y'"  icon="el-icon-edit" type="primary" @click="handleArrange(row)">分配</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
		<div v-if="showBasic">
			<div>客户基本信息</div>
		 	<el-form :model="basicInfo">
				<el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="basicInfo.idType" class="wd200">
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="basicInfo.idNumber" class="wd200" type="text" />
	            </el-form-item>
	            <div class="cl_tr text_center">
	                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleBasicInfo()">查询</el-button>
	            </div>
	        </el-form>
		</div>
		<div class="clearboth"></div>
		<div v-if="showMediaInfo">
			<div class="leftmenu_navtitle">媒介信息建立</div>
			<div class="clearboth"></div>
			<div>1. 客户基本信息</div>
			<el-form :model="mediaInfo">
				<el-form-item class="cl_td" label="客户代码" prop="customerNo" >
	                <el-input v-model="mediaInfo.customerNo" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户名称" prop="customerName">
	                <el-input v-model="mediaInfo.customerName" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="mediaInfo.idNumber" class="wd200" type="text" />
	            </el-form-item>
            </el-form>
            <div class="text_title">2. 客户已有产品</div>
            <el-table v-loading = "mediaLoading" :data="mediaList" class="mbtm20" 
                @current-change="handleCurrRowChange2" @row-click="chooseCurrRow2"
                fit highlight-current-row style="width: 100%;" border >
               	<el-table-column width="55">
                    <template slot-scope="scope">
                        <el-radio v-model="curRow1.productObjectCode" :label="scope.row.productObjectCode">
                            <span class="el-radio__label"></span>
                        </el-radio>
                    </template>
                </el-table-column>
	            <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
	            <el-table-column prop="productDesc" label="描述" align="center" />
	        </el-table>
        	<pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="mediaPage.pageNum" :limit.sync="mediaPage.pageSize" @pagination="getMediaList" />
	        <el-form>
    	        <el-form-item class="cl_td" label="客户卡号" prop="externalIdentificationNoIn">
                    <el-input v-model="mediaInfo.externalIdentificationNoIn" class="wd200" type="text" readonly/>
                </el-form-item>
    		    <el-form-item class="cl_td" label="有效期" prop="expirationDate">
                    <el-input v-model="mediaInfo.expirationDate" class="wd200" type="text" readonly/>
                </el-form-item> 
            </el-form>
			<div class="text_title">3.媒介基本信息</div>
			<el-form :model="modifyInfo">
			    <el-form-item class="cl_td" label="主附标识" prop="mainSupplyIndicator">
	                <el-select v-model="modifyInfo.mainSupplyIndicator" class="wd200">
	                  <el-option v-for="(item, index) in mainSupplyIndicatorOptions" 
	                      :key="index" 
	                      :label="item.detailDesc" 
	                      :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
	                <el-input v-model="modifyInfo.mainCustomerNo" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="所属机构" prop="organNo">
	                <el-select v-model="modifyInfo.organNo" class="wd200">
	                  <el-option v-for="(item, index) in institutionIdOptions" 
	                      :key="index" 
	                      :label="item.organName" 
	                      :value="item.organNo" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="分行号" prop="graceDate">
	                <el-input v-model="modifyInfo.graceDate" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="进件人员编号" prop="delinquencyDate">
	                <el-input v-model="modifyInfo.delinquencyDate" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="申请书编号" prop="directDebitDate">
	                <el-input v-model="modifyInfo.directDebitDate" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="营销人员编号" prop="delinquencyDate">
	                <el-input v-model="modifyInfo.delinquencyDate" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="媒介对象代码" prop="statementDate">
	                <el-select v-model="modifyInfo.statementDate" class="wd200" disabled   readonly>
	                    <el-option v-for="(item, index) in businessProgramNoOptions" 
	                      :key="index" 
	                      :label="item.detailDesc" 
	                      :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="媒介领取标志" prop="mediaDispatchMethod">
	                <el-select v-model="modifyInfo.mediaDispatchMethod" class="wd200">
	                    <el-option v-for="(item, index) in mediaDispatchMethodOptions" 
	                      :key="index" 
	                      :label="item.detailDesc" 
	                      :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="密码函领取标志" prop="pinDispatchMethod">
	                <el-select v-model="modifyInfo.pinDispatchMethod" class="wd200">
	                    <el-option v-for="(item, index) in pinDispatchMethodOptions" 
	                      :key="index" 
	                      :label="item.detailDesc" 
	                      :value="item.codes" />
	                </el-select>
	            </el-form-item>
	        </el-form>
	    	<div class="clearboth"></div>
			<div slot="footer" class="cl_tr text_center">
	            <el-button type="primary" icon="el-icon-plus" @click="subData()">保存</el-button>
	        </div> 
        </div>
        <div v-if="showEstablishInfo">
        	<div class="module_title">客户资料建立</div>
        	<div class="text_title">1. 客户基本信息建立</div>
        	<el-form :model="establishInfo" ref="establishInfo" :rule="establishInfo">
        		<el-form-item class="cl_td" label="机构号" prop="institutionId" 
        			:rules="[ { required: true, message: '请输机构号', trigger: 'change' } ]">
	                <el-select v-model="establishInfo.institutionId" class="wd200">
	                  <el-option v-for="(item, index) in institutionIdOptions" 
	                      :key="index" 
	                      :label="item.organName" 
	                      :value="item.organNo" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户名称 " prop="customerName" 
	            	:rules="[ { required: true, message: '请输入客户名称', trigger: 'blur' } ]">
	                <el-input v-model="establishInfo.customerName" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件类型" prop="idType" 
	            	:rules="[ { required: true, message: '请输入证件类型', trigger: 'change' } ]">
	                <el-select v-model="establishInfo.idType" class="wd200">
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
        		<el-form-item class="cl_td" label="证件号码 " prop="idNumber" 
        			:rules="[ { required: true, message: '请输入证件号码', trigger: 'blur' } ]">
	                <el-input v-model="establishInfo.idNumber" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户类型" prop="customerType" 
	            	:rules="[ { required: true, message: '请输入客户类型', trigger: 'change' } ]">
	                <el-select v-model="establishInfo.customerType" class="wd200">
	                  <el-option v-for="(item, index) in customerTypeOptions" 
	                      	:key="index" 
	                      	:label="item.detailDesc" 
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="账单日" prop="billDay" 
	            	:rules="[ { required: true, message: '请输入账单日', trigger: 'blur' } ]">
	                <el-select v-model="establishInfo.billDay" class="wd200">
	                  <el-option v-for="(item, index) in billDayOptions" 
	                      	:key="index" 
	                      	:label="item.detailDesc" 
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="还款选项 " prop="paymentMark" 
	            	:rules="[ { required: true, message: '请输入还款选项', trigger: 'change' } ]">
	                <el-select v-model="establishInfo.paymentMark" class="wd200">
	                  <el-option v-for="(item, index) in paymentMarkOptions" 
	                      	:key="index" 
	                      	:label="item.detailDesc" 
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="城市 " prop="city" 
	            	:rules="[ { required: true, message: '请输入城市', trigger: 'blur' } ]">
	                <el-input v-model="establishInfo.city" class="wd200" type="text"/>
	            </el-form-item>
        		<!--2.客户个人信息-->
        		<div class="text_title">2. 客户个人信息</div>
        		<el-form-item class="cl_td" label="分行号 " prop="branchNumber">
	          		<el-input v-model="establishInfo.branchNumber" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="生日 " prop="dateOfBirth">
		          	<el-date-picker
			            v-model="establishInfo.dateOfBirth"
			            class="wd200"
			            type="date"
			            placeholder="选择日期"
			            format="yyyy 年 MM 月 dd 日"
			            value-format="yyyyMMdd"/>
		        </el-form-item>
				<el-form-item class="cl_td" label="性别 " prop="sexCode">
		          <el-select clearable  v-model="establishInfo.sexCode" class="wd200">
		            <el-option
		              v-for="(item, index) in sexCodeOptions"
		              :key="index"
		              :label="item.detailDesc"
		              :value="item.codes"
		            />
		          </el-select>
		        </el-form-item>
		        <el-form-item class="cl_td" label="手机号码 " prop="mobilePhone" 
		        	:rules="[ { required: true, message: '请输入手机号码', trigger: 'blur' } ]">
		          	<el-input v-model="establishInfo.mobilePhone" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="家庭电话 " prop="homePhone">
		          	<el-input v-model="establishInfo.homePhone" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="公司电话 " prop="companyPhone">
		          	<el-input v-model="establishInfo.companyPhone" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="邮编 " prop="zipCode">
		          	<el-input v-model="establishInfo.zipCode" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="联络人姓名 " prop="contactName">
		          	<el-input v-model="establishInfo.contactName" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="联络人电话 " prop="contactPhone">
		          	<el-input v-model="establishInfo.contactPhone" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="成为会员年份 " prop="branchNumber">
		          	<el-date-picker
			            v-model="establishInfo.memberSince"
			            class="wd200"
			            type="date"
			            placeholder="选择会员年份"
			            format="yyyy 年 MM 月"
			            value-format="yyyyMM" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="客户来源码" prop="customerSource">
		          	<el-input v-model="establishInfo.customerSource" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="行为得分" prop="behaviorScore">
		          	<el-input v-model="establishInfo.behaviorScore" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="客户等级" prop="customerLevel">
		          	<el-input v-model="establishInfo.customerLevel" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="年收入 " prop="annualIncome">
		          	<el-input v-model="establishInfo.annualIncome" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="住宅性质 " prop="residencyStatus">
		          <el-select clearable  v-model="establishInfo.residencyStatus" class="wd200">
		            <el-option
		              v-for="(item, index) in residencyStatusOptions"
		              :key="index"
		              :label="item.detailDesc"
		              :value="item.codes" />
		          	</el-select>
		        </el-form-item>
		        <el-form-item class="cl_td" label="婚姻状况 " prop="maritalStatus">
		          <el-select clearable  v-model="establishInfo.maritalStatus" class="wd200">
		            <el-option
		              v-for="(item, index) in maritalStatusOptions"
		              :key="index"
		              :label="item.detailDesc"
		              :value="item.codes" />
		          	</el-select>
		        </el-form-item>
		        <el-form-item class="cl_td" label="工作行业代码" prop="occupationCode">
		         	<el-input v-model="establishInfo.occupationCode" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="职务级别代码" prop="postRankCode">
		          <el-select clearable  v-model="establishInfo.postRankCode" class="wd200">
		            <el-option
		              v-for="(item, index) in postRankCodeOptions"
		              :key="index"
		              :label="item.detailDesc"
		              :value="item.codes"
		            />
		          </el-select>
		        </el-form-item>
		        <el-form-item class="cl_td" label="职称代码" prop="titleCode">
		          	<el-input v-model="establishInfo.titleCode" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="工作年限" prop="periodOfOccupation">
		          	<el-input v-model="establishInfo.periodOfOccupation" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="兴趣爱好" prop="hobby">
		          	<el-input v-model="establishInfo.hobby" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="担保人标识" prop="guarantorFlag">
		          <el-select clearable  v-model="establishInfo.guarantorFlag" class="wd200">
		            <el-option
		              	v-for="(item, index) in guarantorFlagOptions"
		              	:key="index"
		              	:label="item.detailDesc"
		              	:value="item.codes" />
		          	</el-select>
		        </el-form-item>
		        <el-form-item class="cl_td" label="营销员代码" prop="marketerCode">
		          	<el-input v-model="establishInfo.marketerCode" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="持卡人的社会保障号类型" prop="socialSecurityId">
		          	<el-input v-model="establishInfo.socialSecurityId" class="wd200" type="text" />
		        </el-form-item>
		        <el-form-item class="cl_td" label="社保账号" prop="socialSecurityNumber">
		          	<el-input v-model="establishInfo.socialSecurityNumber" class="wd200" type="text" />
		        </el-form-item>
	      	</el-form>
        	<!--3客户地址信息-->
        	<div class="text_title">3.客户地址信息</div>
	      	<div class="cl_tr text_left">
		        <el-button size="small" icon="el-icon-plus" type="primary" @click="addAdress()">新增</el-button>
	      	</div>
      		<el-table :data="addressObjList" class="mbtm20" fit highlight-current-row  style="width: 100%" border >
		        <el-table-column prop="typeDesc" label="地址类型" align="center" />
		        <el-table-column prop="contactAddress" label="联系地址" align="center" />
		        <el-table-column prop="contactPostCode" label="联系邮编" align="center" />
		        <el-table-column prop="contactMobilePhone" label="指定电话" align="center" />
		        <el-table-column prop="city" label="所在城市" align="center" />
     	 	</el-table>
	      	<el-form ref="addressForm" :rule="addressForm" :model="addressForm">
		        <div v-show="addressFormDiv">
	          	<el-form-item
		            class="cl_td"
		            label="地址类型"
		            prop="type"
		            :rules="[ { required: true, message: '请输入地址类型', trigger: 'change' } ]">
		            <el-select clearable  v-model="addressForm.type" class="wd200">
		              <el-option
		                v-for="(item, index) in addressTypeOptions"
		                :key="index"
		                :label="item.detailDesc"
		                :value="item.codes"
		              />
		            </el-select>
	          	</el-form-item>
		          <el-form-item
		            class="cl_td"
		            label="联系地址"
		            prop="contactAddress"
		            :rules="[ { required: true, message: '请输入联系地址', trigger: 'blur' } ]">
		            <el-input v-model="addressForm.contactAddress" class="wd200" type="text" />
		          </el-form-item>
		          <el-form-item
		            class="cl_td"
		            label="联系邮编"
		            prop="contactPostCode"
		            :rules="[ { required: true, message: '请输入联系邮编', trigger: 'blur' } ]">
		            <el-input v-model="addressForm.contactPostCode" class="wd200" type="text" />
		          </el-form-item>
		          	<el-form-item  class="cl_td" label="指定电话" prop="contactMobilePhone"
		            	:rules="[ { required: true, message: '请输入指定电话', trigger: 'blur' } ]" >
		            	<el-input v-model="addressForm.contactMobilePhone" class="wd200" type="text" />
		         	</el-form-item>
		          	<el-form-item class="cl_td" label="所在城市" prop="city"
			            :rules="[ { required: true, message: '请输入所在城市', trigger: 'blur' } ]">
	            		<el-input v-model="addressForm.city" class="wd200" type="text" />
		          	</el-form-item>
		          	<div class="cl_tr text_center">
			            <el-button size="small" icon="el-icon-circle-check" type="primary" 
			            	@click="saveAddress('addressForm')">保存</el-button>
			            <el-button size="small" icon="el-icon-circle-close" type="primary" 
			            	@click="closeAddress()">关闭</el-button>
		          	</div>
		        </div>
	      	</el-form>
      	 	<div class="text_title">4.客户备注信息</div>
	      	<div class="cl_tr text_left">
		        <el-button size="small" icon="el-icon-plus" type="primary" @click="addRemark()">新增</el-button>
	      	</div>
	      	<el-table  :data="remarkObjList" class="mbtm20" fit  highlight-current-row style="width: 100%" border >
		        <el-table-column prop="remarkInfo" label="备注信息" align="center" />
		        <el-table-column prop="lastUpdateUserid" label="新增备注人员" align="center" />
	      	</el-table>
      		<el-form ref="remarkForm" :rule="remarkForm" :model="remarkForm">
		        <div v-show="remarkFormDiv">
	          		<el-form-item class="cl_td" label="备注信息" prop="remarkInfo">
			            <el-input v-model="remarkForm.remarkInfo" class="wd200" type="text" />
		          	</el-form-item>
		          	<el-form-item class="cl_td" label="新增备注人员" prop="lastUpdateUserid">
			            <el-input v-model="remarkForm.lastUpdateUserid" class="wd200" type="text" />
		          	</el-form-item>
		          	<div class="cl_tr text_center">
			            <el-button size="small" icon="el-icon-circle-check" type="primary" @click="saveRemark()" >保存</el-button>
			            <el-button size="small" icon="el-icon-circle-close"  type="primary"  @click="closeRemark()" >关闭</el-button>
		          	</div>
		        </div>
	      	</el-form>
	      	<div class="cl_tr text_center">
	        	<el-button size="medium" type="primary" @click="submitCustInfo('establishInfo')">下一步
	        		<i class="el-icon-d-arrow-right" /> </el-button>
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
	            templateRadio1: '',
	            templateRadio2: '',
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            newMediaCstInf: {},
	            modifyInfo: {},
	            listLoading: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	            newCard: '',
	            //已存在客户客户基本信息
	            showBasic: false,
	            showMediaInfo: false,//媒介基本信息
	            addressFormDiv: true,//客户地址信息
	            remarkFormDiv: false,//4.客户备注信息
	            basicInfo: {},//客户基本信息
	            mediaInfo: {},//媒介基本信息
	            mediaList: [],//客户已有产品列表
	            mediaLoading: false,
	            mediaPage: {
	                 pageNum: 1,
                    pageSize:10,
	            },
	            tableTotal2: 0,
	           	curRow1: {},
           		curRow2: {},
           		//客户资料建立
           		showEstablishInfo: false,
           		establishInfo: {},//1. 客户基本信息建立
           		addressObjList: [],//3. 客户地址信息
           		addressForm: {},//3. 客户地址信息form
           		remarkObjList:[], //4.客户备注信息表头
           		remarkForm: {},//4.客户备注信息form
	            // 下拉框
	            idTypeList: [],//证件类型
	            productObjectCodeOptions: [],//产品对象
	            operationModeOptions: [],//运营模式
	            flagOptions: [],//分配标识
	            businessProgramNoOptions: [],//媒介对象代码
	            mediaDispatchMethodOptions: [],//媒介领取标志
	            pinDispatchMethodOptions: [],//密码函领取标志
	            mainSupplyIndicatorOptions: [],//主附标识
	            institutionIdOptions: [],//所属机构
	            customerTypeOptions: [],//客户类型
	           	billDayOptions: [],//账单日
	           	paymentMarkOptions: [],//还款选项
	           	sexCodeOptions: [], // 性别
	            residencyStatusOptions: [],//住宅性质
             	maritalStatusOptions: [], // 婚姻状况
		      	postRankCodeOptions: [], // 职务级别代码
		      	guarantorFlagOptions: [], // 担保人标识
		      	addressTypeOptions: [],// 地址类型
    		}
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
        	this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            this.queryForm.corporationEntityNo=this.logininfo.corporationEntityNo
            //所属机构
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
                this.institutionIdOptions = res
            })
            //产品对象
   			this.getSelectDict( "/beta/betaService/COS.IQ.02.0013").then(res => {
   				res.forEach(item =>{
   					item.productObjectCodeDesc = item.productObjectCode+ ''+item.productDesc
				})		
                this.productObjectCodeOptions = res
            })
            // 运营模式
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //分配标识
            this.getSelectDict( "dic_distribution").then(res => {
                this.flagOptions = res
            })
            //密码函领取标志  
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0013").then(res => {
                this.pinDispatchMethodOptions = res
            })
            //媒介对象代码
             this.getSelectDict( "dic_mediaObjectCode").then(res => {
                this.businessProgramNoOptions = res
            })
            //媒介领取标志
            this.getSelectDict( "dic_isYorN").then(res => {
                this.mediaDispatchMethodOptions = res
            })
//          //密码函领取标志
//          this.getSelectDict( "dic_isYorN").then(res => {
//              this.mediaDispatchMethodOptions = res
//          })
            //主附标识
            this.getSelectDict( "dic_isYorN").then(res => {
                this.mainSupplyIndicatorOptions = res
            })
             //所属机构
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
                this.institutionIdOptions = res
            })
           	//客户类型
            this.getSelectDict( "dic_personalCompanyType").then(res => {
                this.customerTypeOptions = res
            })
            //账单日billDay  
            this.getSelectDict( "dic_billDay").then(res => {
                this.billDayOptions = res
            })
            //还款选项
            this.getSelectDict( "dic_paymentMark").then(res => {
                this.paymentMarkOptions = res
            })
            // 性别
		    this.getSelectDict("dic_gender").then((res) => {
		      	this.sexCodeOptions = res
		    })
            //住宅性质
            this.getSelectDict("dic_residencyStatus").then((res) => {
		      	this.residencyStatusOptions = res
		    })
            // 婚姻状况
		    this.getSelectDict("dic_maritalStatus").then((res) => {
		      	this.maritalStatusOptions = res
		    })
		    // 职务级别代码
		    this.getSelectDict("dic_postRankCode").then((res) => {
		      	this.postRankCodeOptions = res
		    })
		    // 担保人标识
		    this.getSelectDict("dic_guarantorFlag").then((res) => {
		      	this.guarantorFlagOptions = res
		    })
		    // 地址类型
		    this.getSelectDict("dic_addressType").then((res) => {
		      this.addressTypeOptions = res
		    })
		    this.getList()
        },
      methods: {
        init() {
            this.queryForm = {
                corporationEntityNo: '',
                productObjectCode: '',
               flag: '',
            }

		},
      	// 重置
      	reset() {
	        this.init()
	    },
        // 点击查询按钮
      	handleQuery() {
	        if (!this.queryForm.corporationEntityNo && !this.queryForm.productObjectCode && !this.queryForm.flag) {
	          this.$message({
	            message: '请输入查询信息',
	            type: 'warning'
	          })
	          this.init()
	        } else {
	            	this.getList() 
				}
        },
      	
      	// 查询按钮权限
    	getBtnAuth() {
	      let params= {
	            menuNo : window.sessionStorage.getItem('menuNo')
	        }
	        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
	            if (res.returnCode == '000000') {
	                if (res.returnData && res.returnData.length > 0 ) {
	                    res.returnData.forEach(item => {
	                        this.btnAuthStr += item.eventNo+','
	                    })
	                    if (this.btnAuthStr.includes('COS.UP.02.0071') != -1) { // 查询
	                        this.selBtnFlag = true
	                    } else {
	                        this.selBtnFlag = false
	                    }
	                    if (this.btnAuthStr.includes('COS.UP.02.0071') != -1){ // 维护
	                        this.updBtnFlag = true
	                    } else {
	                        this.updBtnFlag = false
	                    }
	                }
	            }
	        })
	    },
	   	//预制卡信息表
        getList() {
            this.listLoading = true
           let params = {
           		flag: this.queryForm.flag,
           		corporationEntityNo: this.queryForm.corporationEntityNo,
           		productObjectCode: this.queryForm.productObjectCode,
           		isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_distribution'],//查找数据字典所需参数
				transDict : ['flag'],//翻译前后key
            }
           	this.getTableList('/beta/betaService/COS.IQ.02.0071', params,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableList.cycleNumber=res.returnData.rows.currentCycleNumber
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.mediaObjectCodeDesc = item.mediaObjectCode+ ''+item.mediaObjectCodeDesc
                			item.productObjectCodeDesc = item.productObjectCode+ ''+item.productObjectDesc
                		})
						
                    }
                }
            })
        },
        //客户基本信息
        handleArrange(row){
           this.newCard =row
            this.showBasic = true
        },
        //单选一行
        handleCurrRowChange1(row) {
          	this.curRow1 = row
        },
       	chooseCurrRow1(row) {
       		this.templateRadio1 = row.externalIdentificationNo
		},
        /*----媒介信息建立----*/
        //查询媒介信息建立基本信息&&表
        handleBasicInfo(){
            if (!this.basicInfo.idType && !this.basicInfo.idNumber) {
                this.$message({
                    message: '请输入查询信息',
                    type: 'warning'
                })
            } else {
                if (this.basicInfo.idType) {
                    if (!this.basicInfo.idNumber) {
                      this.$message({
                        message: '请输入证件号码',
                        type: 'warning'
                      })
                    } else {
                        this.getInfo()
                    }
                } else if (this.basicInfo.idNumber) {
                    if (!this.queryForm.idType) {
                      this.$message({
                        message: '请输入证件类型',
                        type: 'warning'
                      })
                    } else {
                       this.getInfo()
                   	}
                } else {
                    this.getInfo()
                }
            }
        },
		//媒介基本信息
        getInfo() {
        	let obj1 = {
            	idNumber: this.basicInfo.idNumber,
            	idType: this.basicInfo.idType,
            }
        	sessionStorage.setItem('newCstBuildFlag',1)
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001',obj1,(res) => {
            	if (res.returnCode == '000000') {
            		if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.mediaInfo = res.returnData.rows[0];
                		this.mediaInfo.externalIdentificationNoIn = this.curRow1.externalIdentificationNo
                		this.mediaInfo.expirationDate = this.curRow1.expirationDate
                		this.modifyInfo.mainCustomerNo = this.mediaInfo.customerNo
                		this.modifyInfo.statementDate = this.curRow1.mediaObjectCode
                		this.showMediaInfo = true;//媒介模块
	           			this.showEstablishInfo = false;//客户资料建立模块
	           			this.getMediaList()
           			 	sessionStorage.setItem('newCstBuildFlag',1)// 删除客户新建标记
	           		}
                }else if(res.returnCode == "CUS-00014" || res.returnCode == "Gns2Error"){
                	this.establishInfo.idType = this.basicInfo.idType;
					this.establishInfo.idNumber = this.basicInfo.idNumber;
					this.showMediaInfo = false;//媒介模块
	           		this.showEstablishInfo = true;//客户资料建立模块
					sessionStorage.setItem('newCstBuildFlag',1)// 删除客户新建标记
					
				}else{
					this.establishInfo.idType = this.basicInfo.idType;
					this.establishInfo.idNumber = this.basicInfo.idNumber;
					this.showMediaInfo = false;//媒介模块
	           		this.showEstablishInfo = true;//客户资料建立模块
				}
           	})
        },
        //单选一行的数据
      	handleCurrRowChange2(row) {
          	this.curRow2 = row
          	this.$message({
                message: '预制卡分配,不允许更换产品对象!',
                type: 'warning'
            })
        },
        chooseCurrRow2(row) {
       		this.templateRadio2 = row.productObjectCode
        },
    	//客户已有产品列表
        getMediaList() {
            this.mediaLoading = true
            this.showMediaInfo = true
        	let obj2= {
            	idNumber: this.basicInfo.idNumber,
                idType: this.basicInfo.idType,
                pageNum: this.mediaPage.pageNum,
                pageSize: this.mediaPage.pageSize,
         	}
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0004',obj2,(res) => {
                this.mediaLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.mediaList = res.returnData.rows;
                		this.tableTotal2 = res.returnData.totalCount;
                	}
                }
            })
        },
       	//确定修改
	    subData(){
	    	let  obj3={
	    		customerNo: this.mediaInfo.customerNo,
	    		customerName : this.mediaInfo.customerName,
	    		idNumber: this.basicInfo.idNumber,
            	idType: this.basicInfo.idType,
            	externalIdentificationNo: this.queryForm.externalIdentificationNoIn,
            	expirationDate: this.mediaInfo.expirationDate,
            	externalIdentificationNoIn: this.mediaInfo.externalIdentificationNoIn,
            	mediaUserName: 'yuzhika',
				embosserName1: 'yuzhika'
	    	}
	    	obj3 =  Object.assign(this.modifyInfo,obj3)
    		this.post('/nonfi/nonfinanceService/BSS.AD.01.0003', obj3,(res) => {
	            if (res.returnCode == '000000') {
                 	this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                 	this.showModify = false
                    this.getList()
	            }
	        })
	    },
	    /*----客户资料建立----*/
	   // 保存客户地址信息
	   	saveAddress(formName) {
	   		if(!this.establishInfo.institutionId || !this.establishInfo.city || !this.establishInfo.customerName || !this.establishInfo.idType ||
	    	!this.establishInfo.idNumber || !this.establishInfo.customerType || !this.establishInfo.billDay || !this.establishInfo.paymentMark){
	    		this.$message('请输入客户基本信息建立!') 
	           return;
	    		
	    	}
	    	this.$refs[formName].validate((valid) => {
		        if (valid) {
		          	this.addressTypeOptions.forEach((item, i) => {
			            if (this.addressForm.type == item.codes) {
			              	this.addressForm.typeDesc = item.detailDesc
			            }
	          		})
		          	this.addressObjList.push(this.addressForm);
		         	this.addressFormDiv = false; // 客户地址信息
		          	this.addressForm = {}
		        } else {
		          	return false;
		        }
	      	});
	    },
	   	// 关闭客户地址信息
	    closeAddress() {
	      	this.addressFormDiv = false // 客户地址信息
	    },
	    // 新增客户地址按钮
	    addAdress() {
	      	this.addressFormDiv = true
	    },
	    // 新增备注信息
	    saveRemark() {
	      	if (!this.remarkForm.remarkInfo && !this.remarkForm.lastUpdateUserid) {
	        	this.$message({
	          	message: "请输入备注信息",
	          	type: "warning",
	        });
	      	} else {
	        	this.remarkObjList.push(this.remarkForm)
	        	this.remarkFormDiv = false; // 客户地址信息
	        	this.remarkForm = {}
	     	}
	    },
	    // 关闭客户备注信息
	    closeRemark() {
	      	this.remarkFormDiv = false // 客户地址信息
	    },
	    // 新增客户备注按钮
	    addRemark() {
	      	this.remarkFormDiv = true
	    },
	    //下一步btn提交新建客户信息
	    submitCustInfo(formName){
	    	this.$refs[formName].validate((valid) => {
		        if (!valid) {
		          return false
		        }
		        // 判断是否有地址信息
		        if (this.addressObjList.lengh == 0) {
		          this.$message({
		            message: "请填写地址信息",
		            type: "warning",
		          })
		          return
		        }
		       	let params = {
		            coreCoreCustomerAddrs: this.addressObjList,
		            coreCustomerRemarkss: this.remarkObjList,
		        }
		       	delete this.establishInfo.city
		        params = Object.assign(params, this.establishInfo)
		        // 下一步
		        this.post('/nonfi/nonfinanceService/BSS.AD.01.0001', params, (res) => {
		            if (res.returnCode == '000000') { // 有产品 新建产品或者卡片
		                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
		                    // 用户基本信息 
		                    this.mediaInfo = res.returnData.rows[0]
		                    this.mediaInfo.customerNo = res.returnData.rows[0].customerNo
		                    this.mediaInfo.customerName = res.returnData.rows[0].customerName
		                    this.mediaInfo.idNumber = res.returnData.rows[0].idNumber
		                    this.mediaInfo.mobilePhone = res.returnData.rows[0].mobilePhone
		                    // 初始化
		                    this.cstBaseInfoForm = {}
		                    this.addressObjList = [] // 地址信息
		                    this.remarkObjList = [] // 标签新
		                   	this.showMediaInfo = true;//媒介模块
	           				this.showEstablishInfo = false;//客户资料建立模块
		                    this.getList()
		                    this.getInfo()
		                }
		            }
		        })
	      	})
    	},
    }
}
</script>

<style>
</style>
