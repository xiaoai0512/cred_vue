<!-- 副卡限制 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
	       		:rules="[ { required: true, message: '外部识别号不能为空'}]">
            	<el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text"/>
        	</el-form-item>
        	<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleInfo()">新增</el-button>
            </div>
    	</el-form> 
    	<!--列表-->
	 	<div v-if="showList">
	     	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	           <el-table-column label="序号" align="center"
                    type="index">
                </el-table-column>
	            <el-table-column prop="currencyCode" label="币种" align="center" />
	            <el-table-column prop="transLimitCode" label="管控场景代码" align="center" />
	            <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(row)">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUp(row)">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleDel(row)">删除</el-button>
                    </template> 
                </el-table-column>
	        </el-table>
        	<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
	    </div>
    	<!--新增信息附属卡-->
	    <el-dialog title="附属卡管控限制建立" :visible.sync="dialogFormVisibleAdd" width="65%">
	    	<div class="mainname titleInfo">基本信息</div>
	        <el-form ref="dataFormAdd" :model="tempAdd" :rules="rulesAdd">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
        			:rules="[ { required: true, message: '外部识别号不能为空'}]">
	        		<el-input v-model="tempAdd.externalIdentificationNo" class="wd200" type="text" />
	        	</el-form-item>
	        	<div class="cl_tr text_center">
		            <el-button size="medium" icon="el-icon-plus" type="primary" @click="subDetaInfo()" >确定</el-button>
		        </div>
		        <div v-if="showInfo">
		        	<el-form-item class="cl_td" label="币种" prop="currencyCode"
		        		:rules="[ { required: true, message: '币种不能为空'}]">
		            	<el-select v-model="tempAdd.currencyCode" class="wd200" clearable placeholder="请选择" >
		                    <el-option v-for="(item, index) in currencyCodeOptions" 
		                    	:key="index" 
		                    	:label="item.label" 
		                    	:value="item.value" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="管控场景代码" prop="transLimitCode"
		        		:rules="[ { required: true, message: '管控场景代码不能为空'}]">
		            	<el-select v-model="tempAdd.transLimitCode" class="wd200" clearable placeholder="请选择" >
		                    <el-option v-for="(item, index) in transLimitCodeOptions" 
		                    	:key="index" 
		                    	:label="item.label" 
		                    	:value="item.value" />
		                </el-select>
		        	</el-form-item>
		        	<div class="clearboth"></div>
		        	<div class="mainname titleInfo ">限额上限</div>
		        	<el-form-item class="cl_td" label="单笔限额检查" prop="limitSingleTransFlag"
		        		:rules="[ { required: true, message: '单笔限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitSingleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange01($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="单笔限制金额" prop="limitSingleTrans">
		            	<el-input v-model="tempAdd.limitSingleTrans" class="wd200" type="text" v-if="tempAdd.limitSingleTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="日限额检查" prop="limitDayTransFlag"
		        		:rules="[ { required: true, message: '日限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitDayTransFlag" class="wd200" clearable placeholder="请选择"  @change="limitSingleChange02($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="日限制金额 " prop="limitDayTrans">
		            	<el-input v-model="tempAdd.limitDayTrans" class="wd200" type="text" v-if="tempAdd.limitDayTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="CYCLE限额检查" prop="limitCycleTransFlag"
		        		:rules="[ { required: true, message: 'CYCLE限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitCycleTransFlag" class="wd200" clearable placeholder="请选择"  @change="limitSingleChange03($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="CYCLE限制金额 " prop="limitCycleTrans">
		            	<el-input v-model="tempAdd.limitCycleTrans" class="wd200" type="text" v-if="tempAdd.limitCycleTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag"
		        		:rules="[ { required: true, message: '月限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitMonthTransFlag" class="wd200" clearable placeholder="请选择"  @change="limitSingleChange04($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="月限制金额 " prop="limitMonthTrans">
		            	<el-input v-model="tempAdd.limitMonthTrans" class="wd200" type="text" v-if="tempAdd.limitMonthTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="半年限额检查" prop="limitHalfYearTransFlag"
		        		:rules="[ { required: true, message: '半年限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitHalfYearTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange05($event)" >
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="半年限制金额 " prop="limitHalfYearTrans">
		            	<el-input v-model="tempAdd.limitHalfYearTrans" class="wd200" type="text" v-if="tempAdd.limitHalfYearTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全年限额检查 " prop="limitYearTransFlag"
		        		:rules="[ { required: true, message: '全年限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitYearTransFlag" class="wd200" clearable placeholder="请选择"  @change="limitSingleChange06($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全年限制金额" prop="limitYearTrans">
		            	<el-input v-model="tempAdd.limitYearTrans" class="wd200" type="text" v-if="tempAdd.limitYearTransFlag=='Y'"/>
		        	</el-form-item>
		        		<el-form-item class="cl_td" label="全生命周期限额检查 " prop="limitLifeCycleTransFlag"
		        		:rules="[ { required: true, message: '全生命周期限额检查不能为空'}]">
		            	<el-select v-model="tempAdd.limitLifeCycleTransFlag" class="wd200" clearable placeholder="请选择"  @change="limitSingleChange07($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全生命周期限制金额 " prop="limitLifeCycleTrans">
		            	<el-input v-model="tempAdd.limitLifeCycleTrans" class="wd200" type="text" v-if="tempAdd.limitLifeCycleTransFlag=='Y'"/>
		        	</el-form-item>
		        	<div class="clearboth"></div>
		        	<div class="mainname titleInfo">限次上限</div>
					<el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag"
		        		:rules="[ { required: true, message: '日限次检查不能为空'}]">
		            	<el-select v-model="tempAdd.numberDayTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange08($event)" >
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="日限制笔数" prop="numberDayTrans">
		            	<el-input v-model="tempAdd.numberDayTrans" class="wd200" type="text" v-if="tempAdd.numberDayTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="CYCLE限次检查 " prop="numberCycleTransFlag"
		        		:rules="[ { required: true, message: 'CYCLE限次检查不能为空'}]">
		            	<el-select v-model="tempAdd.numberCycleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange09($event)" >
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="CYCLE限制笔数" prop="numberCycleTrans">
		            	<el-input v-model="tempAdd.numberCycleTrans" class="wd200" type="text" v-if="tempAdd.numberCycleTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="月限次检查 " prop="numberMonthTransFlag"
		        		:rules="[ { required: true, message: '月限次检查不能为空'}]">
		            	<el-select v-model="tempAdd.numberMonthTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange10($event)" >
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="月限制笔数 " prop="numberMonthTrans">
		            	<el-input v-model="tempAdd.numberMonthTrans" class="wd200" type="text" v-if="tempAdd.numberMonthTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag"
		        		:rules="[ { required: true, message: '半年限次检查不能为空'}]">
		            	<el-select v-model="tempAdd.numberHalfYearTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange11($event)" >
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="半年限制笔数 " prop="numberHalfYearTrans">
		            	<el-input v-model="tempAdd.numberHalfYearTrans" class="wd200" type="text" v-if="tempAdd.numberHalfYearTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全年限次检查" prop="numberYearTransFlag"
		        		:rules="[ { required: true, message: '全年限次检查不能为空'}]">
		            	<el-select v-model="tempAdd.numberYearTransFlag" class="wd200" clearable placeholder="请选择"  @change="limitSingleChange12($event)">
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全年限制笔数" prop="numberYearTrans">
		            	<el-input v-model="tempAdd.numberYearTrans" class="wd200" type="text" v-if="tempAdd.numberYearTransFlag=='Y'"/>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全生命周期限次检查 " prop="numberLifeCycleTransFlag"
		        		:rules="[ { required: true, message: '全生命周期限次检查不能为空'}]">
		            	<el-select v-model="tempAdd.numberLifeCycleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange13($event)" >
		                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="全生命周期限制笔数" prop="numberLifeCycleTrans">
		            	<el-input v-model="tempAdd.numberLifeCycleTrans" class="wd200" type="text" v-if="tempAdd.numberLifeCycleTransFlag=='Y'"/>
		        	</el-form-item>
		        </div>
	        </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="subAddInfo()" >确认</el-button>
	            <el-button size="medium"  type="primary" @click="dialogFormVisibleAdd = false" >取消</el-button>
	        </div>
	    </el-dialog>
	   	<!--修改-->
	   	<el-dialog title="附属卡管控限制维护" :visible.sync="dialogFormVisibleUp" width="65%">
	    	<div class="mainname titleInfo">基本信息</div>
	        <el-form ref="dataFormUp" :model="tempUp" :rules="rulesUp">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
        			:rules="[ { required: true, message: '外部识别号不能为空'}]">
	        		<el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="币种" prop="currencyCode"
	        		:rules="[ { required: true, message: '币种不能为空'}]">
	            	<el-select v-model="tempUp.currencyCode" class="wd200" disabled readonly>
	                    <el-option v-for="(item, index) in currencyCodeOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="管控场景代码" prop="transLimitCode"
	        		:rules="[ { required: true, message: '管控场景代码不能为空'}]">
	            	<el-select v-model="tempUp.transLimitCode" class="wd200" disabled readonly>
	                    <el-option v-for="(item, index) in transLimitCodeOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo ">限额上限</div>
	        	<el-form-item class="cl_td" label="单笔限额检查" prop="limitSingleTransFlag"
	        		:rules="[ { required: true, message: '单笔限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitSingleTransFlag" class="wd200"  clearable placeholder="请选择" @change="limitSingleChange001($event)">
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="单笔限制金额" prop="limitSingleTrans">
	            	<el-input v-model="tempUp.limitSingleTrans" class="wd200" type="text" v-if="tempUp.limitSingleTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="日限额检查" prop="limitDayTransFlag"
	        		:rules="[ { required: true, message: '日限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitDayTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange002($event)">
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="日限制金额 " prop="limitDayTrans">
	            	<el-input v-model="tempUp.limitDayTrans" class="wd200" type="text" v-if="tempUp.limitDayTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限额检查" prop="limitCycleTransFlag"
	        		:rules="[ { required: true, message: 'CYCLE限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitCycleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange003($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限制金额 " prop="limitCycleTrans">
	            	<el-input v-model="tempUp.limitCycleTrans" class="wd200" type="text" v-if="tempUp.limitCycleTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag"
	        		:rules="[ { required: true, message: '月限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitMonthTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange004($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限制金额 " prop="limitMonthTrans">
	            	<el-input v-model="tempUp.limitMonthTrans" class="wd200" type="text" v-if="tempUp.limitMonthTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限额检查" prop="limitHalfYearTransFlag"
	        		:rules="[ { required: true, message: '半年限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitHalfYearTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange005($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限制金额 " prop="limitHalfYearTrans">
	            	<el-input v-model="tempUp.limitHalfYearTrans" class="wd200" type="text" v-if="tempUp.limitHalfYearTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限额检查 " prop="limitYearTransFlag"
	        		:rules="[ { required: true, message: '全年限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitYearTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange006($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限制金额" prop="limitYearTrans">
	            	<el-input v-model="tempUp.limitYearTrans" class="wd200" type="text" v-if="tempUp.limitYearTransFlag=='Y'"/>
	        	</el-form-item>
	        		<el-form-item class="cl_td" label="全生命周期限额检查 " prop="limitLifeCycleTransFlag"
	        		:rules="[ { required: true, message: '全生命周期限额检查不能为空'}]">
	            	<el-select v-model="tempUp.limitLifeCycleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange007($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全生命周期限制金额 " prop="limitLifeCycleTrans">
	            	<el-input v-model="tempUp.limitLifeCycleTrans" class="wd200" type="text" v-if="tempUp.limitLifeCycleTransFlag=='Y'"/>
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo">限次上限</div>
				<el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag"
	        		:rules="[ { required: true, message: '日限次检查不能为空'}]">
	            	<el-select v-model="tempUp.numberDayTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange008($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="日限制笔数" prop="numberDayTrans">
	            	<el-input v-model="tempUp.numberDayTrans" class="wd200" type="text" v-if="tempUp.numberDayTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限次检查 " prop="numberCycleTransFlag"
	        		:rules="[ { required: true, message: 'CYCLE限次检查不能为空'}]">
	            	<el-select v-model="tempUp.numberCycleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange009($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限制笔数" prop="numberCycleTrans">
	            	<el-input v-model="tempUp.numberCycleTrans" class="wd200" type="text" v-if="tempUp.numberCycleTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限次检查 " prop="numberMonthTransFlag"
	        		:rules="[ { required: true, message: '月限次检查不能为空'}]">
	            	<el-select v-model="tempUp.numberMonthTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange010($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限制笔数 " prop="numberMonthTrans">
	            	<el-input v-model="tempUp.numberMonthTrans" class="wd200" type="text" v-if="tempUp.numberMonthTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag"
	        		:rules="[ { required: true, message: '半年限次检查不能为空'}]">
	            	<el-select v-model="tempUp.numberHalfYearTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange011($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限制笔数 " prop="numberHalfYearTrans">
	            	<el-input v-model="tempUp.numberHalfYearTrans" class="wd200" type="text" v-if="tempUp.numberHalfYearTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限次检查" prop="numberYearTransFlag"
	        		:rules="[ { required: true, message: '全年限次检查不能为空'}]">
	            	<el-select v-model="tempUp.numberYearTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange012($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限制笔数" prop="numberYearTrans">
	            	<el-input v-model="tempUp.numberYearTrans" class="wd200" type="text" v-if="tempUp.numberYearTransFlag=='Y'"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全生命周期限次检查 " prop="numberLifeCycleTransFlag"
	        		:rules="[ { required: true, message: '全生命周期限次检查不能为空'}]">
	            	<el-select v-model="tempUp.numberLifeCycleTransFlag" class="wd200" clearable placeholder="请选择" @change="limitSingleChange013($event)" >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全生命周期限制笔数" prop="numberLifeCycleTrans">
	            	<el-input v-model="tempUp.numberLifeCycleTrans" class="wd200" type="text" v-if="tempUp.numberLifeCycleTransFlag=='Y'"/>
	        	</el-form-item>
		   </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="subUpInfo()" >确认</el-button>
	            <el-button size="medium"  type="primary" @click="dialogFormVisibleUp = false" >取消</el-button>
	        </div>
	    </el-dialog>
	   	<!--详情-->
	   	<el-dialog title="附属卡管控限制建立" :visible.sync="dialogFormVisibleDetail" width="65%">
	    	<div class="mainname titleInfo">基本信息</div>
	        <el-form ref="dataFormDetail" :model="tempDetail" :rules="rulesDetail">
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo"
        			:rules="[ { required: true, message: '外部识别号不能为空'}]">
	        		<el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="币种" prop="currencyCode"
	        		:rules="[ { required: true, message: '币种不能为空'}]">
	            	<el-select v-model="tempDetail.currencyCode" class="wd200" disabled readonly>
	                    <el-option v-for="(item, index) in currencyCodeOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="管控场景代码" prop="transLimitCode"
	        		:rules="[ { required: true, message: '管控场景代码不能为空'}]">
	            	<el-select v-model="tempDetail.transLimitCode" class="wd200" disabled readonly>
	                    <el-option v-for="(item, index) in transLimitCodeOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo ">限额上限</div>
	        	<el-form-item class="cl_td" label="单笔限额检查" prop="limitSingleTransFlag"
	        		:rules="[ { required: true, message: '单笔限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitSingleTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="单笔限制金额" prop="limitSingleTrans">
	            	<el-input v-model="tempDetail.limitSingleTrans" class="wd200" type="text" 
	            		v-if="tempDetail.limitSingleTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="日限额检查" prop="limitDayTransFlag"
	        		:rules="[ { required: true, message: '日限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitDayTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="日限制金额 " prop="limitDayTrans">
	            	<el-input v-model="tempDetail.limitDayTrans" class="wd200" type="text" 
	            		v-if="tempDetail.limitDayTransFlag=='Y'"  readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限额检查" prop="limitCycleTransFlag"
	        		:rules="[ { required: true, message: 'CYCLE限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitCycleTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限制金额 " prop="limitCycleTrans">
	            	<el-input v-model="tempDetail.limitCycleTrans" class="wd200" type="text" 
	            		v-if="tempDetail.limitCycleTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag"
	        		:rules="[ { required: true, message: '月限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitMonthTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限制金额 " prop="limitMonthTrans">
	            	<el-input v-model="tempDetail.limitMonthTrans" class="wd200" type="text"
	            		 v-if="tempDetail.limitMonthTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限额检查" prop="limitHalfYearTransFlag"
	        		:rules="[ { required: true, message: '半年限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitHalfYearTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限制金额 " prop="limitHalfYearTrans">
	            	<el-input v-model="tempDetail.limitHalfYearTrans" class="wd200" type="text" 
	            		v-if="tempDetail.limitHalfYearTransFlag=='Y'"  readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限额检查 " prop="limitYearTransFlag"
	        		:rules="[ { required: true, message: '全年限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitYearTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限制金额" prop="limitYearTrans">
	            	<el-input v-model="tempDetail.limitYearTrans" class="wd200" type="text"
	            		 v-if="tempDetail.limitYearTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        		<el-form-item class="cl_td" label="全生命周期限额检查 " prop="limitLifeCycleTransFlag"
	        		:rules="[ { required: true, message: '全生命周期限额检查不能为空'}]">
	            	<el-select v-model="tempDetail.limitLifeCycleTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全生命周期限制金额 " prop="limitLifeCycleTrans">
	            	<el-input v-model="tempDetail.limitLifeCycleTrans" class="wd200" type="text" 
	            		v-if="tempDetail.limitLifeCycleTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<div class="clearboth"></div>
	        	<div class="mainname titleInfo">限次上限</div>
				<el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag"
	        		:rules="[ { required: true, message: '日限次检查不能为空'}]">
	            	<el-select v-model="tempDetail.numberDayTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="日限制笔数" prop="numberDayTrans">
	            	<el-input v-model="tempDetail.numberDayTrans" class="wd200" type="text"
	            		 v-if="tempDetail.numberDayTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限次检查 " prop="numberCycleTransFlag"
	        		:rules="[ { required: true, message: 'CYCLE限次检查不能为空'}]">
	            	<el-select v-model="tempDetail.numberCycleTransFlag" class="wd200" disabled readonly >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="CYCLE限制笔数" prop="numberCycleTrans">
	            	<el-input v-model="tempDetail.numberCycleTrans" class="wd200" type="text" 
	            		v-if="tempDetail.numberCycleTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限次检查 " prop="numberMonthTransFlag"
	        		:rules="[ { required: true, message: '月限次检查不能为空'}]">
	            	<el-select v-model="tempDetail.numberMonthTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="月限制笔数 " prop="numberMonthTrans">
	            	<el-input v-model="tempDetail.numberMonthTrans" class="wd200" type="text"
	            		 v-if="tempDetail.numberMonthTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag"
	        		:rules="[ { required: true, message: '半年限次检查不能为空'}]">
	            	<el-select v-model="tempDetail.numberHalfYearTransFlag" class="wd200" disabled readonly >
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="半年限制笔数 " prop="numberHalfYearTrans">
	            	<el-input v-model="tempDetail.numberHalfYearTrans" class="wd200" type="text"
	            		 v-if="tempDetail.numberHalfYearTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限次检查" prop="numberYearTransFlag"
	        		:rules="[ { required: true, message: '全年限次检查不能为空'}]">
	            	<el-select v-model="tempDetail.numberYearTransFlag" class="wd200" disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全年限制笔数" prop="numberYearTrans">
	            	<el-input v-model="tempDetail.numberYearTrans" class="wd200" type="text" 
	            		v-if="tempDetail.numberYearTransFlag=='Y'" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全生命周期限次检查 " prop="numberLifeCycleTransFlag"
	        		:rules="[ { required: true, message: '全生命周期限次检查不能为空'}]">
	            	<el-select v-model="tempDetail.numberLifeCycleTransFlag" class="wd200"  disabled readonly>
	                    <el-option v-for="(item, index) in limitSingleTransFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="全生命周期限制笔数" prop="numberLifeCycleTrans">
	            	<el-input v-model="tempDetail.numberLifeCycleTrans" class="wd200" type="text" 
	            		v-if="tempDetail.numberLifeCycleTransFlag=='Y'" readonly/>
	        	</el-form-item>
		   </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="dialogFormVisibleDetail = false" >取消</el-button>
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
                refAddInfo: {},
                tempAddMInfo: {},
                //新增
                dialogFormVisibleAdd: false,
                showInfo: false,
                dataFormAdd: {},
                tempAdd: {},
                rulesAdd: {},
                //修改
               	dialogFormVisibleUp: false,
                dataFormUp: {},
                tempUp: {},
                rulesUp: {},
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
                limitSingleTransFlagOptions: [],//单笔限额检查
           		currencyCodeOptions: [],//币种
                transLimitCodeOptions: [],//管控场景代码
           }
        },
        created() {
            
        },
       	mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            //单笔限额检查
        	this.getSelectDict('dic_isYorN').then((res) => {
				this.limitSingleTransFlagOptions = res
				this.tempAdd.limitSingleTransFlag = 'N';
				this.tempAdd.limitDayTransFlag = 'N';
				this.tempAdd.limitCycleTransFlag = 'N';
				this.tempAdd.limitMonthTransFlag = 'N';
				this.tempAdd.limitHalfYearTransFlag = 'N';
				this.tempAdd.limitYearTransFlag = 'N';
				this.tempAdd.limitLifeCycleTransFlag = 'N';
				this.tempAdd.numberDayTransFlag = 'N';
				this.tempAdd.numberCycleTransFlag = 'N';
				this.tempAdd.numberMonthTransFlag = 'N';
				this.tempAdd.numberHalfYearTransFlag = 'N';
				this.tempAdd.numberYearTransFlag = 'N';
				this.tempAdd.numberLifeCycleTransFlag = 'N';
    		})
        },
      	methods: {
	      	handleSearch(){
	      		if (this.queryFormObj.externalIdentificationNo == '' || this.queryFormObj.externalIdentificationNo == undefined 
	      			|| this.queryFormObj.externalIdentificationNo == null) {
					this.$message('请输入查询条件'); 
					return;
	      		
				}
				this.getList()
      		},
      		//列表
	      	getList(){
	      		this.listLoading = true  
	      		this.showList = true
	      		let params ={
	      			externalIdentificationNo: this.queryFormObj.externalIdentificationNo,
		   			pageNum:  this.queryFormObj.pageNum,
		        	pageSize:  this.queryFormObj.pageSize,
		        	authDataSynFlag: '1',
		        	flag: '0',
		        }
	      		this.post('/auth/authService/AUS.OP.01.0009', params, (res) => {
	   				if(res.returnCode == '000000') {
	       				this.listLoading = false
	       			 	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
							this.tableList = res.returnData.rows
							this.tableTotal = res.returnData.totalCount
						}else{
		            		this.tableList = []
		            		this.tableTotal = 0
		            	}
		            }else{
						this.showList = []
					}
	        	},(err) => {
	        		this.tableList = []
            		this.tableTotal = 0
            		this.listLoading = false
	        	})
	      	},
	      	//新增
	      	handleInfo(){
	      		this.dialogFormVisibleAdd = true
	      		this.$nextTick(() => {
	                this.$refs['dataFormAdd'].clearValidate()
	            })	
		  	},
			limitSingleChange01(val){
				if(val == 'N'){
					this.tempAdd.limitSingleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange02(val){
				if(val == 'N'){
					this.tempAdd.limitDayTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange03(val){
				if(val == 'N'){
					this.tempAdd.limitCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange04(val){
				if(val == 'N'){
					this.tempAdd.limitMonthTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange05(val){
				if(val == 'N'){
					this.tempAdd.limitHalfYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange06(val){
				if(val == 'N'){
					this.tempAdd.limitYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange07(val){
				if(val == 'N'){
					this.tempAdd.limitLifeCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange08(val){
				if(val == 'N'){
					this.tempAdd.numberDayTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange09(val){
				if(val == 'N'){
					this.tempAdd.numberCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange10(val){
				if(val == 'N'){
					this.tempAdd.numberMonthTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange11(val){
				if(val == 'N'){
					this.tempAdd.numberHalfYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange12(val){
				if(val == 'N'){
					this.tempAdd.numberYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange13(val){
				if(val == 'N'){
					this.tempAdd.numberLifeCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange001(val){
				if(val == 'N'){
					this.tempUp.limitSingleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange002(val){
				if(val == 'N'){
					this.tempUp.limitDayTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange003(val){
				if(val == 'N'){
					this.tempUp.limitCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange004(val){
				if(val == 'N'){
					this.tempUp.limitMonthTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange005(val){
				if(val == 'N'){
					this.tempUp.limitHalfYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange006(val){
				if(val == 'N'){
					this.tempUp.limitYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange007(val){
				if(val == 'N'){
					this.tempUp.limitLifeCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange008(val){
				if(val == 'N'){
					this.tempUp.numberDayTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange009(val){
				if(val == 'N'){
					this.tempUp.numberCycleTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange010(val){
				if(val == 'N'){
					this.tempUp.numberMonthTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange011(val){
				if(val == 'N'){
					this.tempUp.numberHalfYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange012(val){
				if(val == 'N'){
					this.tempUp.numberYearTrans = '';		
				}
				this.$forceUpdate()
			},
			limitSingleChange013(val){
				if(val == 'N'){
					this.tempUp.numberLifeCycleTrans = '';		
				}
				this.$forceUpdate()
			},
	      	subDetaInfo(){
	      		let params = {
	      			authDataSynFlag: '1',
	      			externalIdentificationNo: this.tempAdd.externalIdentificationNo
	      		}
	      		this.post('/auth/authService/AUS.IQ.01.0001', params, (res) => {
	   				if(res.returnCode == '000000') {
	       				this.showInfo = true
	       			 	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
							this.tempAdd.operationMode = res.returnData.rows[0].operationMode
							this.getCurrencyCode()
							this.getTransLimitCode()
						}
		            }else{
		            	this.showInfo = false
		            }
	        	})
	      		
	      	},
	      	//币种
	      	getCurrencyCode(){
	      		let objData1 = {
	      			operationMode: this.tempAdd.operationMode
	      		}
	      		this.post('/beta/betaService/COS.IQ.02.0034',objData1,(res) => {
	      			if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
		      			 	let arr = []
	                        let rows = res.returnData.rows
	                        rows.forEach((item, index) => {
	                          	arr[index] = {
	                                label: item.currencyDesc,
	                                value: item.currencyCode
	                            }
	                        })
	                        this.currencyCodeOptions = arr
	                    } else {
	                        this.currencyCodeOptions = []
	                    }
                    }
	      		})
	      	},
            // 	管控场景代码 
           	getTransLimitCode(){
           		let objData2 = {
           			authDataSynFlag:'1',
    				differentType:'0',
    				operationMode: this.tempAdd.operationMode	
				}
       			this.post('/beta/betaService/AUS.PM.02.0102', objData2,(res) => {
    			 	if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	        			 let arr = []
	                        let rows = res.returnData.rows
	                        rows.forEach((item, index) => {
	                          	arr[index] = {
	                                label: item.contrlSceneDesc,
	                                value: item.contrlSceneCode
	                            }
	                        })
	                        this.transLimitCodeOptions = arr
	                    } else {
	                        this.transLimitCodeOptions = []
	                    }
                    }
    			})
           	},
          	//新增确认提交信息
	      	subAddInfo(){
	      		if(this.tempAdd.limitSingleTransFlag=='Y' && (this.tempAdd.limitSingleTrans=='' || 
	      			this.tempAdd.limitSingleTrans == undefined)){
	      			this.$message('请输入单笔限制金额'); 
					return;
	      		}else if(this.tempAdd.limitDayTransFlag=='Y' && (this.tempAdd.limitDayTrans=='' || 
	      			this.tempAdd.limitDayTrans == undefined)){
	      				this.$message('请输入日限制金额 '); 
						return;
      			}else if(this.tempAdd.limitCycleTransFlag=='Y' && (this.tempAdd.limitCycleTrans=='' || 
	      			this.tempAdd.limitCycleTrans == undefined)){
	      				this.$message('请输入CYCLE限制金额 '); 
						return;
      			}else if(this.tempAdd.limitCycleTransFlag=='Y' && (this.tempAdd.limitCycleTrans=='' || 
	      			this.tempAdd.limitCycleTrans == undefined)){
	      				this.$message('请输入CYCLE限制金额 '); 
						return;
      			}else if(this.tempAdd.limitMonthTransFlag=='Y' && (this.tempAdd.limitMonthTrans=='' || 
	      			this.tempAdd.limitMonthTrans == undefined)){
	      				this.$message('请输入月限制金额 '); 
						return;
      			}else if(this.tempAdd.limitHalfYearTransFlag=='Y' && (this.tempAdd.limitHalfYearTrans=='' || 
	      			this.tempAdd.limitHalfYearTrans == undefined)){
	      				this.$message('请输入半年限制金额 '); 
						return;
      			}else if(this.tempAdd.limitYearTransFlag=='Y' && (this.tempAdd.limitYearTrans=='' || 
	      			this.tempAdd.limitYearTrans == undefined)){
	      				this.$message('请输入全年限制金额 '); 
						return;
      			}else if(this.tempAdd.limitLifeCycleTransFlag=='Y' && (this.tempAdd.limitLifeCycleTrans=='' || 
	      			this.tempAdd.limitLifeCycleTrans == undefined)){
	      				this.$message('请输入全生命周期限制金额 '); 
						return;
      			}else if(this.tempAdd.numberDayTransFlag=='Y' && (this.tempAdd.numberDayTrans=='' || 
	      			this.tempAdd.numberDayTrans == undefined)){
	      				this.$message('请输入日限制笔数 '); 
						return;
      			}else if(this.tempAdd.numberCycleTransFlag=='Y' && (this.tempAdd.numberCycleTrans=='' || 
	      			this.tempAdd.numberCycleTrans == undefined)){
	      				this.$message('请输入CYCLE限制笔数 '); 
						return;
      			}else if(this.tempAdd.numberMonthTransFlag=='Y' && (this.tempAdd.numberMonthTrans=='' || 
	      			this.tempAdd.numberMonthTrans == undefined)){
	      				this.$message('请输入月限制笔数 '); 
						return;
      			}else if(this.tempAdd.numberHalfYearTransFlag=='Y' && (this.tempAdd.numberHalfYearTrans=='' || 
	      			this.tempAdd.numberHalfYearTrans == undefined)){
	      				this.$message('请输入半年限制笔数 '); 
						return;
      			}else if(this.tempAdd.numberYearTransFlag=='Y' && (this.tempAdd.numberYearTrans=='' || 
	      			this.tempAdd.numberYearTrans == undefined)){
	      				this.$message('请输入全年限制笔数 '); 
						return;
      			}else if(this.tempAdd.numberLifeCycleTransFlag=='Y' && (this.tempAdd.numberLifeCycleTrans=='' || 
	      			this.tempAdd.numberLifeCycleTrans == undefined)){
	      				this.$message('请输入生命周期限制笔数 '); 
						return;
      			}
	      		this.$refs['dataFormAdd'].validate((valid) => {
                	if (valid) {
						this.tempAdd.authDataSynFlag = '1';
						this.tempAdd.flag = '1';
			      		this.post('/auth/authService/AUS.OP.01.0009', this.tempAdd, (res) => {
							if (res.returnCode == '000000') {
								 this.$notify({
									title: 'Success',
									message: '保存成功',
									type: 'success',
									duration: 2000
								}) 
								this.dialogFormVisibleAdd= false;
								this.tempAdd = {};
								this.tempAdd.limitSingleTransFlag = 'N';
								this.tempAdd.limitDayTransFlag = 'N';
								this.tempAdd.limitCycleTransFlag = 'N';
								this.tempAdd.limitMonthTransFlag = 'N';
								this.tempAdd.limitHalfYearTransFlag = 'N';
								this.tempAdd.limitYearTransFlag = 'N';
								this.tempAdd.limitLifeCycleTransFlag = 'N';
								this.tempAdd.numberDayTransFlag = 'N';
								this.tempAdd.numberCycleTransFlag = 'N';
								this.tempAdd.numberMonthTransFlag = 'N';
								this.tempAdd.numberHalfYearTransFlag = 'N';
								this.tempAdd.numberYearTransFlag = 'N';
								this.tempAdd.numberLifeCycleTransFlag = 'N';
								this.showInfo = false;
								this.handleSearch();
							}
			            })
	      			}
	      		})
	      	},
	      	//详情展示弹框
	       	handleDetail(row){
	       		this.dialogFormVisibleDetail = true
	       		this.tempDetail = Object.assign({}, row)
	       		if(row.transLimitCode=='RTS005'){
	       			this.tempDetail.transLimitCode ='网上支付管控'
	       		}else if(row.transLimitCode=='RTS004'){
	       			this.tempDetail.transLimitCode ='高风险终端'
	       		}else if(row.transLimitCode=='RTS003'){
	       			this.tempDetail.transLimitCode ='二维码支付管控'
	       		}else if(row.transLimitCode=='RTS002'){
	       			this.tempDetail.transLimitCode ='房地产管控'
	       		}else if(row.transLimitCode=='RTS001'){
	       			this.tempDetail.transLimitCode ='所有交易管控'
	       		}else if(row.transLimitCode=='RD1234'){
	       			this.tempDetail.transLimitCode ='差异化描述'
	       		}else if(row.transLimitCode=='CASH00'){
	       			this.tempDetail.transLimitCode ='取现'
	       		}
				this.$nextTick(() => {
	                this.$refs['dataFormDetail'].clearValidate()
	            })
	       	},
	       	//修改展示弹框
	       	handleUp(row){
	       		this.dialogFormVisibleUp = true
	       		this.tempUp = Object.assign({}, row)
	       		if(row.transLimitCode=='RTS005'){
	       			this.tempUp.transLimitDesc ='网上支付管控'
	       		}else if(row.transLimitCode=='RTS004'){
	       			this.tempUp.transLimitDesc ='高风险终端'
	       		}else if(row.transLimitCode=='RTS003'){
	       			this.tempUp.transLimitDesc ='二维码支付管控'
	       		}else if(row.transLimitCode=='RTS002'){
	       			this.tempUp.transLimitDesc ='房地产管控'
	       		}else if(row.transLimitCode=='RTS001'){
	       			this.tempUp.transLimitDesc ='所有交易管控'
	       		}else if(row.transLimitCode=='RD1234'){
	       			this.tempUp.transLimitDesc ='差异化描述'
	       		}else if(row.transLimitCode=='CASH00'){
	       			this.tempUp.transLimitDesc ='取现'
	       		}
	       		this.$nextTick(() => {
	                this.$refs['dataFormUp'].clearValidate()
	            })	
	       		
	       	},
			upDetaInfo(){
	      		let params = {
	      			authDataSynFlag: '1',
	      			externalIdentificationNo: this.tempAdd.externalIdentificationNo
	      		}
	      		this.post('/auth/authService/AUS.IQ.01.0001', params, (res) => {
	   				if(res.returnCode == '000000') {
	       				if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
							this.tempAdd.operationMode = res.returnData.rows[0].operationMode
							this.up_getCurrencyCode()
							this.up_getTransLimitCode()
						}
		            }
	        	})
	      		
	      	},
	      	//币种
	      	up_getCurrencyCode(){
	      		let objData1 = {
	      			operationMode: this.tempAdd.operationMode
	      		}
	      		this.post('/beta/betaService/COS.IQ.02.0034',objData1,(res) => {
	      			if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
		      			 	let arr = []
	                        let rows = res.returnData.rows
	                        rows.forEach((item, index) => {
	                          	arr[index] = {
	                                label: item.currencyDesc,
	                                value: item.currencyCode
	                            }
	                        })
	                        this.currencyCodeOptions = arr
	                    } else {
	                        this.currencyCodeOptions = []
	                    }
                    }
	      		})
	      	},
            // 	管控场景代码 
           	up_getTransLimitCode(){
           		let objData2 = {
           			authDataSynFlag:'1',
    				differentType:'0',
    				operationMode: this.tempAdd.operationMode	
				}
       			this.post('/beta/betaService/AUS.PM.02.0102', objData2,(res) => {
    			 	if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	        			 let arr = []
	                        let rows = res.returnData.rows
	                        rows.forEach((item, index) => {
	                          	arr[index] = {
	                                label: item.contrlSceneDesc,
	                                value: item.contrlSceneCode
	                            }
	                        })
	                        this.transLimitCodeOptions = arr
	                    } else {
	                        this.transLimitCodeOptions = []
	                    }
                    }
    			})
           	},
           	subUpInfo(){
           		if(this.tempUp.limitSingleTransFlag=='Y' && (this.tempUp.limitSingleTrans=='' || 
	      			this.tempUp.limitSingleTrans == undefined)){
	      			this.$message('请输入单笔限制金额'); 
					return;
	      		}else if(this.tempUp.limitDayTransFlag=='Y' && (this.tempUp.limitDayTrans=='' || 
	      			this.tempUp.limitDayTrans == undefined)){
	      				this.$message('请输入日限制金额 '); 
						return;
      			}else if(this.tempUp.limitCycleTransFlag=='Y' && (this.tempUp.limitCycleTrans=='' || 
	      			this.tempUp.limitCycleTrans == undefined)){
	      				this.$message('请输入CYCLE限制金额 '); 
						return;
      			}else if(this.tempUp.limitMonthTransFlag=='Y' && (this.tempUp.limitMonthTrans=='' || 
	      			this.tempUp.limitMonthTrans == undefined)){
	      				this.$message('请输入月限制金额 '); 
						return;
      			}else if(this.tempUp.limitHalfYearTransFlag=='Y' && (this.tempUp.limitHalfYearTrans=='' || 
	      			this.tempUp.limitHalfYearTrans == undefined)){
	      				this.$message('请输入半年限制金额 '); 
						return;
      			}else if(this.tempUp.limitYearTransFlag=='Y' && (this.tempUp.limitYearTrans=='' || 
	      			this.tempUp.limitYearTrans == undefined)){
	      				this.$message('请输入全年限制金额 '); 
						return;
      			}else if(this.tempUp.limitLifeCycleTransFlag=='Y' && (this.tempUp.limitLifeCycleTrans=='' || 
	      			this.tempUp.limitLifeCycleTrans == undefined)){
	      				this.$message('请输入全生命周期限制金额 '); 
						return;
      			}else if(this.tempUp.numberDayTransFlag=='Y' && (this.tempUp.numberDayTrans=='' || 
	      			this.tempUp.numberDayTrans == undefined)){
	      				this.$message('请输入日限制笔数 '); 
						return;
      			}else if(this.tempUp.numberCycleTransFlag=='Y' && (this.tempUp.numberCycleTrans=='' || 
	      			this.tempUp.numberCycleTrans == undefined)){
	      				this.$message('请输入CYCLE限制笔数 '); 
						return;
      			}else if(this.tempUp.numberMonthTransFlag=='Y' && (this.tempUp.numberMonthTrans=='' || 
	      			this.tempUp.numberMonthTrans == undefined)){
	      				this.$message('请输入月限制笔数 '); 
						return;
      			}else if(this.tempUp.numberHalfYearTransFlag=='Y' && (this.tempUp.numberHalfYearTrans=='' || 
	      			this.tempUp.numberHalfYearTrans == undefined)){
	      				this.$message('请输入半年限制笔数 '); 
						return;
      			}else if(this.tempUp.numberYearTransFlag=='Y' && (this.tempUp.numberYearTrans=='' || 
	      			this.tempUp.numberYearTrans == undefined)){
	      				this.$message('请输入全年限制笔数 '); 
						return;
      			}else if(this.tempUp.numberLifeCycleTransFlag=='Y' && (this.tempUp.numberLifeCycleTrans=='' || 
	      			this.tempUp.numberLifeCycleTrans == undefined)){
	      				this.$message('请输入生命周期限制笔数 '); 
						return;
      			}
	      		this.tempUp.authDataSynFlag = "1";
				this.tempUp.flag = "2";
				delete this.tempUp.transLimitDesc;
				this.$refs['dataFormUp'].validate((valid) => {
                	if (valid) {
			      		this.post('/auth/authService/AUS.OP.01.0009', this.tempUp, (res) => {
							if (res.returnCode == '000000') {
								 this.$notify({
									title: 'Success',
									message: '修改成功',
									type: 'success',
									duration: 2000
								}) 
								this.dialogFormVisibleUp= false
								this.handleSearch();
								this.tempUp = {}
							}
			            })
	      			}
	      		})
	      	},
	      	//删除
	      	handleDel (row){
      		 	let tempDel = row
      		 	tempDel.invalidFlag = "1";
				tempDel.authDataSynFlag = "1";
		        this.$confirm('确定要删除该信息?', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(() => { // 是
		            this.post('/auth/authService/AUS.OP.01.0009',tempDel, (res) => {
						if (res.returnCode == '000000') {
							   this.$notify({
								title: 'Success',
								message: '删除成功',
								type: 'success',
								duration: 2000
							})
							this.getList()
						}
		            })
		        }).catch(() => { // 否   

        		});
	      	},
   		}
	}
</script>
<style>
.red{ color: #FF0000;}
</style>
