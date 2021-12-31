<!-- ABS计划管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="ABS计划代码" prop="binNo">
                <el-input v-model="queryFormObj.planId" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="资产转变阶段" prop="capitalStage">
                <el-select v-model="queryFormObj.capitalStage" class="wd200">
                    <el-option
                        v-for="(item, index ) in capitalStageOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="planId" label="ABS计划代码" align="center" />
            <el-table-column prop="planDesc" label="计划描述" align="center" />
            <el-table-column prop="capitalOrganizationCode" label="	转出机构代码" align="center" />
            <el-table-column prop="capitalOrganizationName" label="转出机构名称" align="center" />
            <el-table-column prop="capitalStageDesc" label="资产转变阶段" align="center" />
            <el-table-column prop="accountTypeDesc" label="资产类型" align="center" />
            <el-table-column prop="" label="操作" align="center" width="300px">
                <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-more" type="primary" @click="detailInfo(row)" v-show="selBtnFlag">查询</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                <el-button size="mini" icon="el-icon-delete"   type="primary" @click="handleDeldate(row)" v-show="deleBtnFlag">删除</el-button>
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="ABS计划建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
	                <el-select v-model="tempAdd.operationMode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in operationModeOptions"
	                        :key="index"
	                        :label="item.modeName"
	                        :value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="ABS计划代码" prop="planId"
                    :rules="[ { required: true, message: 'ABS计划代码不能为空'}]">
                   <el-input v-model="tempAdd.planId" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="ABS计划描述" prop="planDesc"
                    :rules="[ { required: true, message: 'ABS计划描述不能为空'}]">
                   <el-input v-model="tempAdd.planDesc" class="wd200" type="text"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="计划类型" prop="planType" 
                 	:rules="[ { required: true, message: '计划类型不能为空'}]">
	                <el-select v-model="tempAdd.planType" class="wd200" @change="planTypeChange($event)">
	                    <el-option
	                        v-for="(item, index ) in planTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="转出机构代码" prop="capitalOrganizationCode" 
                 	:rules="[ { required: true, message: '转出机构代码不能为空'}]">
	                <el-select v-model="tempAdd.capitalOrganizationCode" @change="capitalOrganizationCodeChange($event)" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in capitalOrganizationCodeOptions"
	                        :key="index"
	                        :label="item.corporationEntityDesc"
	                        :value="item.corporationEntityName"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="转出机构名称" prop="capitalOrganizationName">
                   <el-input v-model="tempAdd.capitalOrganizationName" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="资产转变阶段" prop="capitalStage" 
                 	:rules="[ { required: true, message: '资产转变阶段不能为空'}]">
	                <el-select v-model="tempAdd.capitalStage" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in addCapitalStageOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资产类型" prop="accountType" 
                 	:rules="[ { required: true, message: '资产类型不能为空'}]">
	                <el-select v-model="tempAdd.accountType" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in accountTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="表内回购法人代码" prop="corporationEntityNoOn" >
                 	<!--:rules="[ { required: true, message: '表内回购法人代码不能为空'}]">-->
	                <el-select v-model="tempAdd.corporationEntityNoOn" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in acorporationEntityNoOnOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDesc"
	                        :value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="表外回购法人代码" prop="corporationEntityNo" >
                 	<!--:rules="[ { required: true, message: '表内回购法人代码不能为空'}]">-->
	                <el-select v-model="tempAdd.corporationEntityNo" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in corporationEntityNoOffOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDescNew"
	                        :value="item.corporationEntityNo"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
                <el-date-picker
                    v-model="tempAdd.effectiveDate"
                    class="wd200"
                    type="date"
                    placeholder="请选择"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="失效日期" prop="expirationDate">
	                <el-date-picker
	                    v-model="tempAdd.expirationDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyy-MM-dd"
	                 	:picker-options="pickerOptions"	/>
	            </el-form-item>
	            <div v-if="tempAdd.planType=='R'">
		            <el-form-item class="cl_td col3 " label="封包->转让（循环期）触发日期" prop="triggerTrs1">
		                <el-date-picker
		                    v-model="tempAdd.triggerTrs1"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		            <el-form-item class="cl_td col3 " label="转让（循还期）->转让（摊还期）触发日期" prop="triggerTrs2">
		                <el-date-picker
		                    v-model="tempAdd.triggerTrs2"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		             <el-form-item class="cl_td col3 " label="转让（摊还期）->回购触发日期" prop="triggerRepo2">
		                <el-date-picker
		                    v-model="tempAdd.triggerRepo2"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		        </div>
		        <div v-if="tempAdd.planType=='S'">
		            <el-form-item class="cl_td col3 " label="封包->转让触发日期" prop="triggerTrsf">
		                <el-date-picker
		                    v-model="tempAdd.triggerTrsf"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		            <el-form-item class="cl_td col3 " label="转让->回购触发日期" prop="triggerRepo">
		                <el-date-picker
		                    v-model="tempAdd.triggerRepo"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		        </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAddBtn()"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="ABS计划修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
	                <el-select v-model="tempUp.operationMode" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in operationModeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="ABS计划代码" prop="planId"
                    :rules="[ { required: true, message: 'ABS计划代码不能为空'}]">
                   <el-input v-model="tempUp.planId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="ABS计划描述" prop="planDesc"
                    :rules="[ { required: true, message: 'ABS计划代码不能为空'}]">
                   <el-input v-model="tempUp.planDesc" class="wd200" type="text" readonly/>
                </el-form-item>
             	<el-form-item class="cl_td" label="计划类型" prop="planType" 
                 	:rules="[ { required: true, message: '计划类型不能为空'}]">
	                <el-select v-model="tempUp.planType" class="wd200" @change="upPlanTypeChange($event)" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in planTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="转出机构代码" prop="capitalOrganizationCode" 
                 	:rules="[ { required: true, message: '转出机构代码不能为空'}]">
	                <el-select v-model="tempUp.capitalOrganizationCode" @change="upCapitalOrganizationCodeChange($event)" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in capitalOrganizationCodeOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDesc"
	                        :value="item.capitalOrganizationCode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="转出机构名称" prop="capitalOrganizationName">
                   <el-input v-model="tempUp.capitalOrganizationName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="资产转变阶段" prop="capitalStage" 
                 	:rules="[ { required: true, message: '资产转变阶段不能为空'}]">
	                <el-select v-model="tempUp.capitalStage" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in addCapitalStageOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资产类型" prop="accountType" 
                 	:rules="[ { required: true, message: '资产类型不能为空'}]">
	                <el-select v-model="tempUp.accountType" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in accountTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="表内回购法人代码" prop="corporationEntityNoOn" >
                 	<!--:rules="[ { required: true, message: '表内回购法人代码不能为空'}]">-->
	                <el-select v-model="tempUp.corporationEntityNoOn" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in acorporationEntityNoOnOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDesc"
	                        :value="item.corporationEntityNoOn"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="表外回购法人代码" prop="corporationEntityNo" >
                 	<!--:rules="[ { required: true, message: '表内回购法人代码不能为空'}]">-->
	                <el-select v-model="tempUp.corporationEntityNo" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in corporationEntityNoOffOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDescNew"
	                        :value="item.corporationEntityNo"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
	                <el-date-picker
	                    v-model="tempUp.effectiveDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyy-MM-dd"
	                    :picker-options="pickerOptionsStart"
	                   />
	            </el-form-item>
	            <el-form-item class="cl_td" label="失效日期" prop="expirationDate">
	                <el-date-picker
	                    v-model="tempUp.expirationDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyy-MM-dd"
	             	 	:picker-options="pickerOptionsEnd"
	             	 	/>
	            </el-form-item>
	            
	            <div v-if="tempUp.planType=='R'">
		            <el-form-item class="cl_td col3 " label="封包->转让（循环期）触发日期" prop="triggerTrs1">
		                <el-date-picker
		                    v-model="tempUp.triggerTrs1"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		            <el-form-item class="cl_td col3 " label="转让（循还期）->转让（摊还期）触发日期" prop="triggerTrs2">
		                <el-date-picker
		                    v-model="tempUp.triggerTrs2"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		             <el-form-item class="cl_td col3 " label="转让（摊还期）->回购触发日期" prop="triggerRepo">
		                <el-date-picker
		                    v-model="tempUp.triggerRepo"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		        </div>
		        <div v-if="tempUp.planType=='S'">
		            <el-form-item class="cl_td col3 " label="封包->转让触发日期" prop="triggerTrsf">
		                <el-date-picker
		                    v-model="tempUp.triggerTrsf"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		            <el-form-item class="cl_td col3 " label="转让->回购触发日期" prop="triggerRepo">
		                <el-date-picker
		                    v-model="tempUp.triggerRepo"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	/>
		            </el-form-item>
		        </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--查询-->
        <el-dialog title="ABS计划详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
	                <el-select v-model="tempDetail.operationMode" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in operationModeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="ABS计划代码" prop="planId"
                    :rules="[ { required: true, message: 'ABS计划代码不能为空'}]">
                   <el-input v-model="tempDetail.planId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="ABS计划描述" prop="planDesc"
                    :rules="[ { required: true, message: 'ABS计划代码不能为空'}]">
                   <el-input v-model="tempDetail.planDesc" class="wd200" type="text" readonly/>
                </el-form-item>
             	<el-form-item class="cl_td" label="计划类型" prop="planType" 
                 	:rules="[ { required: true, message: '计划类型不能为空'}]">
	                <el-select v-model="tempDetail.planType" class="wd200" @change="upPlanTypeChange($event)" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in planTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="转出机构代码" prop="capitalOrganizationCode" 
                 	:rules="[ { required: true, message: '转出机构代码不能为空'}]">
	                <el-select v-model="tempDetail.capitalOrganizationCode" @change="upCapitalOrganizationCodeChange($event)" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in capitalOrganizationCodeOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDesc"
	                        :value="item.capitalOrganizationCode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="转出机构名称" prop="capitalOrganizationName">
                   <el-input v-model="tempDetail.capitalOrganizationName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="资产转变阶段" prop="capitalStage" 
                 	:rules="[ { required: true, message: '资产转变阶段不能为空'}]">
	                <el-select v-model="tempDetail.capitalStage" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in addCapitalStageOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资产类型" prop="accountType" 
                 	:rules="[ { required: true, message: '资产类型不能为空'}]">
	                <el-select v-model="tempDetail.accountType" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in accountTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="表内回购法人代码" prop="corporationEntityNoOn" >
                 	<!--:rules="[ { required: true, message: '表内回购法人代码不能为空'}]">-->
	                <el-select v-model="tempDetail.corporationEntityNoOn" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in acorporationEntityNoOnOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDesc"
	                        :value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="表外回购法人代码" prop="corporationEntityNo" >
                 	<!--:rules="[ { required: true, message: '表内回购法人代码不能为空'}]">-->
	                <el-select v-model="tempDetail.corporationEntityNo" class="wd200" readonly disabled>
	                    <el-option
	                        v-for="(item, index ) in corporationEntityNoOffOptions"
	                        :key="index"
	                        :label="item.corporationEntityNoDescNew"
	                        :value="item.corporationEntityNo"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
                <el-date-picker
                    v-model="tempDetail.effectiveDate"
                    class="wd200"
                    type="date"
                    placeholder="请选择"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="失效日期" prop="expirationDate">
	                <el-date-picker
	                    v-model="tempDetail.expirationDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyy-MM-dd" readonly/>
	            </el-form-item>
	            <div v-if="tempDetail.planType=='R'">
		            <el-form-item class="cl_td col3 " label="封包->转让（循环期）触发日期" prop="triggerTrs1">
		                <el-date-picker
		                    v-model="tempDetail.triggerTrs1"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td col3 " label="转让（循还期）->转让（摊还期）触发日期" prop="triggerTrs2">
		                <el-date-picker
		                    v-model="tempDetail.triggerTrs2"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	readonly/>
		            </el-form-item>
		             <el-form-item class="cl_td col3 " label="转让（摊还期）->回购触发日期" prop="triggerRepo">
		                <el-date-picker
		                    v-model="tempDetail.triggerRepo"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	readonly/>
		            </el-form-item>
		        </div>
		        <div v-if="tempDetail.planType=='S'">
		            <el-form-item class="cl_td col3 " label="封包->转让触发日期" prop="triggerTrsf">
		                <el-date-picker
		                    v-model="tempDetail.triggerTrsf"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td col3 " label="转让->回购触发日期" prop="triggerRepo">
		                <el-date-picker
		                    v-model="tempDetail.triggerRepo"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyy-MM-dd"
		                 	readonly/>
		            </el-form-item>
		        </div>
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
            deleBtnFlag: false,
            btnAuthStr: '',
            templateRadio: false,
            logininfo: '',
            // 列表
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            list_formatCode: '',
            // 下拉框
            operationModeOptions: [],
            originListOptions:[],// 运营模式 
            capitalStageOptions: [],//资产转变阶段
            planTypeOptions: [],//计划类型
            accountTypeOptions: [],//资产类型
            capitalOrganizationCodeOptions: [],//转出机构代码
            acorporationEntityNoOnOptions: [],//表内回购法人代码
            corporationEntityNoOffOptions: [],//表外回购法人代码
            addCapitalStageOptions: [],//新增资产转变结段
            /*----新增----*/
            tempAdd: {}, // 新增
            newLegal: '',
            dialogFormVisibleAdd: false,
            rulesAdd: {},
            rulesUp: {},
            newCapitalOrganizationCode: '',
            newPlanType: '',
            pickerOptions: {
	          	disabledDate(time) {
		            return time.getTime() < Date.now();
	          	},
         	},
            //修改
            dataFormUp:{},
            tempUp: {}, // 修改
            up_segmentNumber: '',
            dialogFormVisibleUp: false,
           /* pickerOptionsStart: {},
         	pickerOptionsEnd:{},*/
         	pickerOptionsStart : {
		        disabledDate: (time) => {
		          	if (this.tempUp.expirationDate) {
		            	return time.getTime() < new Date(this.tempUp.effectiveDate).getTime();
		          	}
		        },
	      	},
	      	pickerOptionsEnd: {
		        disabledDate: (time) => {
		          	if (this.tempUp.effectiveDate) {
			            // 减掉86400000秒(一天)目的是把当前选中的下单日期包含在内可以选择，也就是说在选择结束日期时，可以选择当前下单日期
			            return time.getTime() < new Date(this.tempUp.expirationDate).getTime()- 86400000;  
		          	}
		        },
	     	},
            //查询
            tempDetail: {}, // 详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            rulesDetail: {},
            detail_segmentNumber: '',
           }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
			this.getList()
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //资产转变阶段
       		this.getSelectDict( "dic_transition").then(res => {
       			//res.splice(1,2);
                this.capitalStageOptions = res
            })
       		//计划类型
            this.getSelectDict( "dic_planType").then(res => {
                this.planTypeOptions = res
            })
             //资产转变阶段
            this.getSelectDict( "dic_transition").then(res => {
               	res.splice(1,2);
                this.addCapitalStageOptions = res
            })
            //转出机构代码
            this.capitalOrganizationCodeOptions = []
            this.corporationEntityNoOffOptions = []
           	let params1={
           		status : '1',
	        	isBankFunds : '1',
	        	purposeFunds : '1',
	        	partnerCategory : '1',
	        }
            this.post( "/beta/betaService/FMS.IQ.04.0001",params1,(res) => {
            	let rows = res.returnData.rows
		        rows.forEach((item) => {
            		item.corporationEntityDesc = item.corporationEntityNo + ' ' + item.corporationEntityName
            	})
                this.capitalOrganizationCodeOptions = rows
           })
            //表内回购法人代码
            let params={
	        	partnerCategory : '0',
	        }
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",params).then(res => {
            	res.forEach(item =>{
            		item.corporationEntityNoDesc = item.corporationEntityNo + ' ' + item.corporationEntityName
            	})
                this.acorporationEntityNoOnOptions = res
            })
            //表外回购法人代码
            let params2={
	        	isBankFunds: "0",
	        	partnerCategory: "1",
	        	purposeFunds: "1",
	        }
            this.post( "/beta/betaService/FMS.IQ.04.0001",params2,(res) => {
            	let rows = res.returnData.rows
		        rows.forEach((item) => {
		           item.corporationEntityNoDescNew = item.corporationEntityNo+''+item.corporationEntityName
		        })
		        this.corporationEntityNoOffOptions = rows
            })
       	},
        methods: {
           	// 查询按钮权限
            getBtnAuth() {
                let params= {
                    menuNo : window.sessionStorage.getItem('menuNo')
                }
                this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.length > 0 ) {
                            res.returnData.forEach(item => {
                            	this.eventList += item.eventNo+','
                            })
                            if (this.eventList.includes('COS.IQ.02.0180')) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                            if (this.eventList.includes('COS.IQ.02.1320')) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.eventList.includes('COS.IQ.02.1325')) { // 修改
                                this.updBtnFlag = true
                            } else {
                                this.updBtnFlag = false
                            }
                            if(this.eventList.includes('COS.IQ.02.4095')){    //删除
								this.deleBtnFlag = true
							} else{
								this.deleBtnFlag = false
							}
                        }
                    }
                })
            },
            // 列表
            getList() {
                this.listLoading1 = true
                let params = {
                    autoQuery: false,
                    corporationEntityNo: this.logininfo.corporationEntityNo,
                    isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_capitalStage','dic_assetAccType'],//查找数据字典所需参数
					transDict : ['capitalStage','accountType'],//翻译前后key
                }
                params = Object.assign(this.queryFormObj, params)   //合并
                this.getTableList('/beta/betaService/COS.IQ.02.0180', params,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tableList = res.returnData.rows
                            this.tableTotal = res.returnData.totalCount
                            this.listLoading1 = false
                            this.tableList.forEach(item =>{
                                item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productObjectCodeDesc
                                item.newMediaObjectCodeDesc = item.mediaObjectCode+ ' '+ item.mediaObjectCodeDesc
                                item.newFormatCodeDesc =item.formatCodeDesc + '' + item.formatCode
    
                            })
                        }
                    }
                })
            },
            //删除
            handleDeldate(row){
            	/*this.tempDel = Object.assign({}, row)*/
		        this.$confirm('确定是否删除?', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(() => { // 是
		            this.post('/nonfi/nonfinanceService/COS.IQ.02.4095', row, (res) => {
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
            handleSearch() {
				this.queryFormObj.pageNum = 1
                this.getList()
            },
            //显示新增弹框
            handleCreate() {
            	this.dialogFormVisibleAdd = true
                this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
            }, 
            //关闭新增弹框清空数据
            closeAddBtn(){
            	this.dialogFormVisibleAdd = false
            	this.$nextTick(() => {
                    this.$refs['dataFormAdd'].resetFields()
                })
            },
			//监听转出机构代码
            capitalOrganizationCodeChange(item){
            	this.tempAdd.capitalOrganizationName = item
            	console.log(item)
            },
            //监听计划类型
         	planTypeChange(val){
         		this.newPlanType = val
         		this.getAccountType()
         	},
         	//资产类型
           	getAccountType(){
           	    this.accountTypeOptions = []
       		    this.getSelectDict('dic_assetAccType').then(res => {
       			    if(this.newPlanType =='R'){
   			           this.accountTypeOptions.push(res[1])
                    }else if(this.newPlanType =='S'){
                        this.accountTypeOptions.push(res[0])
                        this.accountTypeOptions.push(res[2])
                    }
				}) 
			},
           	//确认新增数据 
            createData() {
        		if(!this.tempAdd.triggerTrs1<this.tempAdd.effectiveDate || this.tempAdd.triggerTrs1>this.tempAdd.expirationDate){
					this.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(!this.tempAdd.triggerTrs2<this.tempAdd.effectiveDate || this.tempAdd.triggerTrs2>this.tempAdd.expirationDate){
					this.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(!this.tempAdd.triggerTrsf<this.tempAdd.effectiveDate || this.tempAdd.triggerTrsf>this.tempAdd.expirationDate){
					jthis.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(!this.tempAdd.triggerRepo<this.tempAdd.effectiveDate || this.tempAdd.triggerRepo>this.tempAdd.expirationDate){
					this.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(this.tempAdd.planType=='R'){
					if(this.tempAdd.triggerTrs1 >= this.tempAdd.triggerTrs2 || this.tempAdd.triggerTrs2 >= this.tempAdd.triggerRepo || this.tempAdd.triggerTrs1 >= this.tempAdd.triggerRepo){
						this.$message("后面触发日期要大于前面的触发日期");
						return;
					}
				}
				if(this.tempAdd.planType!='R'){
					if(this.tempAdd.triggerTrs1 >=this.tempAdd.triggerTrsf || this.tempAdd.triggerTrs1 >= this.tempAdd.triggerRepo2 || this.tempAdd.triggerTrsf >= this.tempAdd.triggerRepo2){
						this.$message("后面触发日期要大于前面的触发日期");
						return;
					}else{
						this.tempAdd.triggerRepo = this.tempAdd.triggerRepo2;
					}
				}
              	this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/COS.IQ.02.1320',this.tempAdd, (res) => {
							if (res.returnCode == '000000') {
                  
								 this.dialogFormVisibleAdd = false
								this.$notify({
									title: 'Success',
									message: '新增成功',
									type: 'success',
									duration: 2000
								})
								this.getList()
								this.tempAdd = {}
                			}
                           
                        })
                    }
                })
            },  
            //显示修改弹框
            handleUpdate(row) {
                this.tempUp = Object.assign({}, row)
                if(row.accountType =='B'){
                	this.tempUp.accountType ='不良资产'
                }else if(row.accountType =='R'){
                	this.tempUp.accountType ='循环资产'
                }else if(row.accountType =='T'){
                	this.tempUp.accountType ='单笔资产'
                }
                this.dialogFormVisibleUp = true
                this.tempUp.capitalOrganizationCode = row.capitalOrganizationCode
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            }, 
           	//监听转出机构代码
            upCapitalOrganizationCodeChange(item){
            	this.tempUp.capitalOrganizationName = item
            },
            //监听计划类型
         	upPlanTypeChange(val){
         		this.newPlanType = val
         		this.upGetAccountType()
         	},
         	//资产类型
           	upGetAccountType(){
           	    this.accountTypeOptions = []
       		    this.getSelectDict('dic_assetAccType').then(res => {
       			    if(this.newPlanType =='R'){
   			           this.accountTypeOptions.push(res[1])
   			        }else if(this.newPlanType =='S'){
                        this.accountTypeOptions.push(res[0])
                        this.accountTypeOptions.push(res[2])
                    }
				}) 
			},
			//确认修改数据
            updateData() {
            	if(!this.tempUp.triggerTrs1<this.tempUp.effectiveDate || this.tempUp.triggerTrs1>this.tempUp.expirationDate){
					this.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(!this.tempUp.triggerTrs2<this.tempUp.effectiveDate || this.tempUp.triggerTrs2>this.tempUp.expirationDate){
					this.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(!this.tempUp.triggerTrsf<this.tempUp.effectiveDate || this.tempUp.triggerTrsf>this.tempUp.expirationDate){
					jthis.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(!this.tempUp.triggerRepo<this.tempUp.effectiveDate || this.tempUp.triggerRepo>this.tempUp.expirationDate){
					this.$message('触发日期必须在计划的生效日期和失效日期区间内');
					return;
				}
				if(this.tempUp.planType=='R'){
					if(this.tempUp.triggerTrs1 >= this.tempUp.triggerTrs2 || this.tempUp.triggerTrs2 >= this.tempUp.triggerRepo || this.tempUp.triggerTrs1 >= this.tempUp.triggerRepo){
						this.$message("后面触发日期要大于前面的触发日期");
						return;
					}
				}
				if(this.tempUp.planType!='R'){
					if(this.tempUp.triggerTrs1 >=this.tempUp.triggerTrsf || this.tempUp.triggerTrs1 >= this.tempUp.triggerRepo2 || this.tempUp.triggerTrsf >= this.tempUp.triggerRepo2){
						this.$message("后面触发日期要大于前面的触发日期");
						return;
					}else{
						this.tempUp.triggerRepo = this.tempUp.triggerRepo2;
					}
				}
				if(this.tempUp.accountType =='不良资产'){
                	this.tempUp.accountType ='B'
                }else if(this.tempUp.accountType =='循环资产'){
                	this.tempUp.accountType ='R'
                }else if(this.tempUp.accountType =='单笔资产'){
                	this.tempUp.accountType ='T'
                }
        		this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/COS.IQ.02.1325', this.tempUp, (res) => {
							if (res.returnCode == '000000') {
                  
								 this.dialogFormVisibleUp = false
								this.$notify({
								title: 'Success',
								message: '修改成功',
								type: 'success',
								duration: 2000
								})
								this.getList()
								this.tempUp = {}
              				}
                           
                        })
                    }
                })
            },
            //查询详情
            detailInfo(row) {
                this.tempDetail = Object.assign({}, row)
                if(row.accountType =='B'){
                	this.tempDetail.accountType ='不良资产'
                }else if(row.accountType =='R'){
                	this.tempDetail.accountType ='循环资产'
                }else if(row.accountType =='T'){
                	this.tempDetail.accountType ='单笔资产'
                }
                this.detail_segmentNumber=row.formatCode
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
