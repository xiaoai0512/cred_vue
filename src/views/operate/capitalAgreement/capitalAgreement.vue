<!-- 资金协议 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
         	<el-form-item class="cl_td" label="资金协议编号" prop="trustNum">
                <el-input v-model="queryFormObj.trustNum" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="资金协议名称" prop="trustName">
                <el-input v-model="queryFormObj.trustName" class="wd200" type="text" />
            </el-form-item>
           	<el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
        	</el-form-item>
            <el-form-item class="cl_td" label="状态" prop="statusData">
                <el-select v-model="queryFormObj.statusData" class="wd200">
                    <el-option
                        v-for="(item, index ) in statusOptions"
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
        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="trustNum" label="资金协议编号" align="center" />
            <el-table-column prop="trustName" label="资金协议名称" align="center" />
            <el-table-column prop="trustTypeDesc" label="资金协议类型" align="center" />
            <el-table-column prop="loanAmt" label="资金额度" align="center" />
            <el-table-column prop="isMulitTrustDesc" label="是否多方标志" align="center" />
            <el-table-column prop="isAutoTrunDesc" label="是否自动转回" align="center" />
            <el-table-column prop="fundsTypeDesc" label="出资类型" align="center" />
            <el-table-column prop="effectiveDate" label="生效日期" align="center" />
            <el-table-column prop="expireDate" label="到期日期" align="center" />
            <el-table-column prop="statusDesc" label="状态" align="center" />
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-more" type="primary" @click="detailInfo(row)" v-show="selBtnFlag">查询</el-button>
	                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
               </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="新增资金协议" :visible.sync="dialogFormVisibleAdd" width="65%">
         	<div v-if="fundDiv">
	            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
	                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
	                	:rules="[ { required: true, message: '运营模式不能为空'}]">
		                <el-select v-model="tempAdd.operationMode" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in operationModeOptions"
		                        :key="index"
		                        :label="item.modeName"
	                			:value="item.operationMode"/>
		                </el-select>
	            	</el-form-item>
	                <el-form-item class="cl_td" label="资金协议编号" prop="trustNum"
	                    :rules="[ { required: true, message: '资金协议编号不能为空'}]">
	                   <el-input v-model="tempAdd.trustNum" class="wd200" type="text"/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="资金协议名称" prop="trustName"
	                    :rules="[ { required: true, message: '资金协议名称不能为空'}]">
	                   <el-input v-model="tempAdd.trustName" class="wd200" type="text"/>
	                </el-form-item>
	             	<el-form-item class="cl_td" label="资金协议类型" prop="trustType" 
	                 	:rules="[ { required: true, message: '资金协议类型不能为空'}]">
		                <el-select v-model="tempAdd.trustType" class="wd200" >
		                    <el-option
		                        v-for="(item, index ) in trustTypeOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	            	<el-form-item class="cl_td" label="出资类型" prop="fundsType" 
	                 	:rules="[ { required: true, message: '出资类型不能为空'}]">
		                <el-select v-model="tempAdd.fundsType" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in fundsTypeOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	            	<el-form-item class="cl_td" label="币种" prop="currencyCode" 
	                 	:rules="[ { required: true, message: '币种不能为空'}]">
		                <el-select v-model="tempAdd.currencyCode" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in accountCcyOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	            	<el-form-item class="cl_td" label="是否多方" prop="isMulitTrust" 
	                 	:rules="[ { required: true, message: '是否多方不能为空'}]">
		                <el-select v-model="tempAdd.isMulitTrust" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in isMulitTrustOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	                <el-form-item class="cl_td" label="资金额度" prop="loanAmt"
	                	:rules="[ { required: true, message: '资金额度不能为空'}]">
	                   <el-input v-model="tempAdd.loanAmt" class="wd200" type="text"/>
	                </el-form-item>
	               	<el-form-item class="cl_td" label="合作模式" prop="cooperatModel" >
	                 	<el-select v-model="tempAdd.cooperatModel" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in cooperatModelOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	            	<el-form-item class="cl_td" label="可用额度" prop="busRestQuota">
	                   <el-input v-model="tempAdd.busRestQuota" class="wd200" type="text"/>
	                </el-form-item>
	            	<el-form-item class="cl_td" label="清算模式" prop="clearMode" >
	                 	<el-select v-model="tempAdd.clearMode" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in clearModeOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	            	<el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
		                <el-date-picker
		                    v-model="tempAdd.effectiveDate"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyyMMdd"/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="是否自动转回" prop="isAutoTrun" >
	                 	<el-select v-model="tempAdd.isAutoTrun" class="wd200">
		                    <el-option
		                        v-for="(item, index ) in isAutoTrunOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
		            <el-form-item class="cl_td" label="到期日期" prop="expireDate">
		                <el-date-picker
		                    v-model="tempAdd.expireDate"
		                    class="wd200"
		                    type="date"
		                    placeholder="请选择"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyyMMdd"
		                 	:picker-options="pickerOptions"	/>
		            </el-form-item>
		        </el-form>
		        <!--法人信息-->
		        <div class="clearboth"></div>
		        <div class="mainname ng-binding" style="width:50%;text-align: left;float: left;">法人信息</div>
		        <div  class="col_tr text_right">
		        	<el-button type="primary" @click="addCapitalInfo(tempAdd)">新增资金法人</el-button>
	            </div>
	         	<el-table v-loading = "listLoading1" :data="addTableList1" class="mbtm20" fit highlight-current-row  
	         		@current-change="capitalChange"  @row-click="chooseone" style="width: 100%;" border>
		            <el-table-column width="80">
	                	<template slot-scope="scope">
			                <el-radio v-model="curRowRadio1" :label="scope.row.corporationEntityNo">
			                    <span class="el-radio__label"></span>
			                </el-radio>
		                </template>
	            	</el-table-column>
		            <el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
		            <el-table-column prop="corporationEntityName" label="法人名称" align="center" />
		            <el-table-column prop="ratio" label="出资比例%" align="center" />
		            <el-table-column prop="dividendRule" label="分润规则" align="center" >
		            	<template slot-scope="{row}">
			            	<span v-if="row.dividendRule=='0'">按出资</span>
			            	<span v-if="row.dividendRule=='1'">按利率</span>
			            	<span v-if="row.dividendRule=='2'">按利息</span>
		            	</template>
	            	</el-table-column>
		            <el-table-column prop="profitMargin" label="分润利率%" align="center" />
		            <el-table-column prop="interestDividendRatio" label="分润比例%" align="center" />
		            <el-table-column prop="amount" label="出资金额（元）" align="center" />
		            <el-table-column  label="多余资金归属" align="center">
		            	<template slot-scope="{row}">
			            	<span v-if="row.restInd=='1'" >是</span>
			            	<span v-if="row.restInd=='0'" >否</span>
		            	</template>
		            </el-table-column>
		           	<el-table-column prop="" label="操作" align="center" width="250px">
		                <template slot-scope="{row,$index}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="addCapitalAccount(row,$index)">新增资金法人账号</el-button>
		                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="deleteListA(row,$index)">删除</el-button>
		                </template> 
		            </el-table-column>
	        	</el-table>
		        <!--法人账号信息-->
	         	<el-table v-loading = "listLoading2" :data="addTableList2" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
		          	<el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
		            <el-table-column prop="accountName" label="户名" align="center" />
		            <el-table-column prop="bankName" label="开户行名称" align="center" />
		            <el-table-column prop="bankNo" label="开户行" align="center" />
		            <el-table-column prop="cashOrRemit" label="钞票标志" align="center" />
		            <el-table-column prop="accountCcy" label="币种" align="center" />
		            <el-table-column prop="accountNo" label="账号" align="center" />
		            <el-table-column prop="accountType" label="账号类型" align="center" />
		            <el-table-column prop="accountInd" label="账号标志" align="center" />
		           	<el-table-column prop="" label="操作" align="center" width="200px">
		                <template slot-scope="{row,$index}">
		                	<el-button size="mini" icon="el-icon-more" type="primary" @click="deleteListB(row,$index)" >删除</el-button>
		               </template> 
	            	</el-table-column>
	            </el-table>
        		<div  class="cl_tr text_center">
	                <el-button type="primary"  @click="nextStep()"> 下一步</el-button>
	            </div>
	        </div>
        	<div v-if="productDiv">
	           <!--选择产品-->
	            <div class="text_title">选择产品</div>
	            <el-form ref="productFormRef" :model="productForm">
	                <el-form-item class="cl_td" label="产品对象代码" prop="productObjectCode">
	                    <el-input v-model="productForm.productObjectCode" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="产品对象描述" prop="productDesc">
	                    <el-input v-model="productForm.productDesc" class="wd200" type="text" />
	                </el-form-item>
	            </el-form>
	            <div class="cl_tr text_center">
	                <el-button size="medium" icon="el-icon-search" type="primary" @click="add_controlSearch()">查询</el-button>
	                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="add_productHandle()">关联</el-button>
	            </div>
	            <el-table v-loading = "listLoading3" :data="productTableList"  class="mbtm20" fit highlight-current-row style="width: 100%;"  
	                border @selection-change="add_controlSelectChange">
	               	<el-table-column type="selection" width="55"></el-table-column>
	                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
	                <el-table-column prop="productDesc" label="产品对象描述" align="center" />
	            </el-table>
	            <pagination v-show="productTotal>0" :total="productTotal" :page.sync="productPage.pageNum" :limit.sync="productPage.pageSize" @pagination="getProductList" />
	            <div class="text_title">已关联产品</div>
	            <el-table v-loading = "listLoading4"  :data="addAssociatedList" class="mbtm20" 
	                fit  highlight-current-row  style="width: 100%;" border >
	                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
	                <el-table-column prop="productDesc" label="产品对象描述" align="center" />
	                <el-table-column prop="" label="操作" align="center" width="200">
	                    <template slot-scope="{row,$index}">
	                        <el-button size="mini" type="primary" @click="addDateQuotaNode(row,$index)" >关联额度节点</el-button>
	                        <el-button size="mini" type="primary" @click="deleteControl(row,$index)" >删除</el-button><!--v-show="selBtnFlag"-->
	                    </template>
	                </el-table-column>
	            </el-table>
	        </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAddBtn()"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--新增资金法人信息-->
        <el-dialog title="新增资金法人信息" :visible.sync="dialogFormVisibleCapital" width="65%">
        	<el-form ref="dataFormCapital" :rules="rulesCapital" :model="addCapital" >
                <el-form-item class="cl_td" label="法人编号" prop="corporationEntityNo" 
                	:rules="[ { required: true, message: '法人编号不能为空'}]">
	                <el-select v-model="addCapital.corporationEntityNo" class="wd200" @change="corporationEntityNoChange($event)" >
	                    <el-option
	                        v-for="(item, index ) in corporationOptions"
	                        :key="index"
	                        :label="item.corporationEntityNo"
                			:value="item.corporationEntityNo"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="法人名称" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人名称不能为空'}]">
                   <el-input v-model="addCapital.corporationEntityName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="出资金额" prop="amount" v-if="addCapital.fundsType == '1'"
                    :rules="[ { required: true, message: '出资金额不能为空'}]">
                   <el-input v-model="addCapital.amount" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="出资比例%" prop="ratio" v-if="addCapital.fundsType == '0'"
                    :rules="[ { required: true, message: '出资比例%不能为空'}]">
                   <el-input v-model="addCapital.ratio" class="wd200" type="text"/>
                </el-form-item>
               	<el-form-item class="cl_td" label="分润规则 " prop="dividendRule" 
                 	:rules="[ { required: true, message: '分润规则 不能为空'}]">
	                <el-select v-model="addCapital.dividendRule" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in dividendRuleOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item  v-if="addCapital.dividendRule=='1'" class="cl_td" label="*利率（%）" prop="profitMargin"
                    :rules="[ { required: true, message: '*利率（%）不能为空'}]">
                   <el-input v-model="addCapital.profitMargin" class="wd200" type="text"/>
                </el-form-item>
            	<el-form-item v-if="addCapital.dividendRule=='2'" class="cl_td" label="分润比例（%）" prop="interestDividendRatio"
                    :rules="[ { required: true, message: '分润比例（%）不能为空'}]">
                   <el-input v-model="addCapital.interestDividendRatio" class="wd200" type="text"/>
                </el-form-item>
            	<el-form-item class="cl_td" label="多余资金归属" prop="restInd" 
                 	:rules="[ { required: true, message: '多余资金归属不能为空'}]">
	                <el-select v-model="addCapital.restInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in restIndOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="费用规则" prop="feeRules" 
                 	:rules="[ { required: true, message: '费用规则为空'}]">
	                <el-select v-model="addCapital.feeRules" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in feeRulesOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item v-if="addCapital.feeRules=='0'" class="cl_td" label="费用固定金额" prop="fixedAmountFee"
                    :rules="[ { required: true, message: '费用固定金额不能为空'}]">
                   <el-input v-model="addCapital.fixedAmountFee" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item  v-if="addCapital.feeRules=='1'" class="cl_td" label="费用比例（%）" prop="feeRatio"
                    :rules="[ { required: true, message: '费用比例（%）不能为空'}]">
                   <el-input v-model="addCapital.feeRatio" class="wd200" type="text"/>
                </el-form-item>
            </el-form>    
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subCapitalData()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleCapital=false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--新增资金法人账号-->
       	<el-dialog title="新增法人账号信息" :visible.sync="dialogFormVisibleCorporate" width="65%">
        	<el-form ref="dataFormCorporate" :rules="rulesCorporate" :model="addCorporate" >
                <el-form-item class="cl_td" label="法人编号" prop="corporationEntityNo" 
                	:rules="[ { required: true, message: '法人编号不能为空'}]">
	                <el-select v-model="addCorporate.corporationEntityNo" class="wd200" disabled  readonly>
	                    <el-option
	                        v-for="(item, index ) in corporationOptions"
	                        :key="index"
	                        :label="item.corporationEntityNo"
                			:value="item.corporationEntityNo"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="法人名称" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人名称不能为空'}]">
                   <el-input v-model="addCorporate.corporationEntityName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="户名" prop="accountName"
                    :rules="[ { required: true, message: '户名不能为空'}]">
                   <el-input v-model="addCorporate.accountName" class="wd200" type="text"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="开户行名称 " prop="bankName" 
                 	:rules="[ { required: true, message: '开户行名称不能为空'}]">
	               	<el-input v-model="addCorporate.bankName" class="wd200" type="text"/>
	            </el-form-item>
            	<el-form-item class="cl_td" label="开户行" prop="bankNo" 
                 	:rules="[ { required: true, message: '开户行不能为空'}]">
	               	<el-input v-model="addCorporate.bankNo" class="wd200" type="text"/>
	            </el-form-item>
            	<el-form-item class="cl_td" label="钞票标志" prop="cashOrRemit" 
                 	:rules="[ { required: true, message: '钞票标志不能为空'}]">
	                <el-select v-model="addCorporate.cashOrRemit" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in cashOrRemitOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="账号" prop="accountNo" 
                 	:rules="[ { required: true, message: '账号不能为空'}]">
	               	<el-input v-model="addCorporate.accountNo" class="wd200" type="text"/>
	            </el-form-item>
            	<el-form-item class="cl_td" label="币种" prop="currencyCode" 
                 	:rules="[ { required: true, message: '币种不能为空'}]">
	                <el-select v-model="addCorporate.currencyCode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in accountCcyOptions2"
	                        :key="index"
	                        :label="item.currencyCode2Desc"
	                        :value="item.currencyCode"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="账号标志" prop="accountInd" 
                 	:rules="[ { required: true, message: '账号标志不能为空'}]">
	                <el-select v-model="addCorporate.accountInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in accountIndOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="账号类型" prop="accountType" 
                 	:rules="[ { required: true, message: '账号类型不能为空'}]">
	                <el-select v-model="addCorporate.accountType" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in accountTypeOptions2"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subCorporateData()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleCorporate=false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--关联额度节点的产品对象-->
        <el-dialog title="新增资金法人信息" :visible.sync="dialogFormVisibleQuota" width="65%">
        	<div class="mainname">资金协议产品对象额度节点关系新增</div>
        	<el-form ref="dataFormQuota" :rules="rulesQuota" :model="quotaInfo" >
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                   <el-input v-model="quotaInfo.creditNodeNo" class="wd200" type="text"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="额度节点描述 " prop="creditDesc">
	               	<el-input v-model="quotaInfo.creditDesc" class="wd200" type="text"/>
	            </el-form-item>
	        </el-form>
         	<div  class="dialog-footer cl_tr text_center">
           		<el-button type="primary" @click="quotaSearch()">查询</el-button>
        	</div>
            <div style="margin-left: 20%;">
                <el-transfer
                    filterable
                    :filter-method="add_filterMethod"
                    :titles="['可选择额度节点', '已选择额度节点']"
                    filter-placeholder="请输入额度节点"
                    v-model="add_busTypeList"
                    @change="add_handleAddComponent"
                    @right-check-change="add_rightCheckedChange"
                    :data="add_allBusTypeData" >
                </el-transfer>
            </div>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addQuotaData()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleQuota=false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="修改资金协议" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                	:rules="[ { required: true, message: '运营模式不能为空'}]">
	                <el-select v-model="tempUp.operationMode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in operationModeOptions"
	                        :key="index"
	                        :label="item.modeName"
                			:value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资金协议编号" prop="trustNum"
                    :rules="[ { required: true, message: '资金协议编号不能为空'}]">
                   <el-input v-model="tempUp.trustNum" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="资金协议名称" prop="trustName"
                    :rules="[ { required: true, message: '资金协议名称不能为空'}]">
                   <el-input v-model="tempUp.trustName" class="wd200" type="text"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="资金协议类型" prop="trustType" 
                 	:rules="[ { required: true, message: '资金协议类型不能为空'}]">
	                <el-select v-model="tempUp.trustType" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in trustTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="出资类型" prop="fundsType" 
                 	:rules="[ { required: true, message: '出资类型不能为空'}]">
	                <el-select v-model="tempUp.fundsType" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in fundsTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	 <el-form-item class="cl_td" label="币种" prop="currencyCode" 
                 	:rules="[ { required: true, message: '币种不能为空'}]">
	                <el-select v-model="tempUp.currencyCode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in accountCcyOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="是否多方" prop="isMulitTrust" 
                 	:rules="[ { required: true, message: '是否多方不能为空'}]">
	                <el-select v-model="tempUp.isMulitTrust" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in isMulitTrustOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资金额度" prop="loanAmt"
                	:rules="[ { required: true, message: '资金额度不能为空'}]">
                   <el-input v-model="tempUp.loanAmt" class="wd200" type="text"/>
                </el-form-item>
               	<el-form-item class="cl_td" label="合作模式" prop="cooperatModel" >
                 	<el-select v-model="tempUp.cooperatModel" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in cooperatModelOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="可用额度" prop="busRestQuota">
                   <el-input v-model="tempUp.busRestQuota" class="wd200" type="text"/>
                </el-form-item>
            	<el-form-item class="cl_td" label="清算模式" prop="clearMode" >
                 	<el-select v-model="tempUp.clearMode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in clearModeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
	                <el-date-picker
	                    v-model="tempUp.effectiveDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="是否自动转回" prop="isAutoTrun" >
                 	<el-select v-model="tempUp.isAutoTrun" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in isAutoTrunOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
	            <el-form-item class="cl_td" label="到期日期" prop="expireDate">
	                <el-date-picker
	                    v-model="tempUp.expireDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	:picker-options="pickerOptions"	/>
	            </el-form-item>
	        </el-form>
	        <!--法人信息-->
	        <div class="clearboth"></div>
	        <div class="mainname ng-binding" style="width:50%;text-align: left;float: left;">法人信息</div>
	        <div  class="col_tr text_right">
	        	<el-button type="primary" @click="upCapitalInfo(tempUp)">新增资金法人</el-button>
            </div>
         	<el-table v-loading = "upListLoading1" :data="upTableList1" class="mbtm20" fit highlight-current-row  
         		@current-change="upCapitalChange"  @row-click="chooseone" style="width: 100%;" border>
	            <el-table-column width="80">
                	<template slot-scope="scope">
		                <el-radio v-model="curRowRadio2" :label="scope.row.corporationEntityNo">
		                    <span class="el-radio__label"></span>
		                </el-radio>
	                </template>
            	</el-table-column>
	            <el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
	            <el-table-column prop="corporationEntityName" label="法人名称" align="center" />
	            <el-table-column prop="ratio" label="出资比例%" align="center" />
	            <el-table-column prop="dividendRule" label="分润规则" align="center" >
	            	<template slot-scope="{row}">
		            	<span v-if="row.dividendRule=='0'">按出资</span>
		            	<span v-if="row.dividendRule=='1'">按利率</span>
		            	<span v-if="row.dividendRule=='2'">按利息</span>
	            	</template>
	            </el-table-column>
	            <el-table-column prop="profitMargin" label="分润利率%" align="center" />
	            <el-table-column prop="interestDividendRatio" label="分润比例%" align="center" />
	            <el-table-column prop="amount" label="出资金额（元）" align="center" />
	            <el-table-column  label="多余资金归属" align="center">
	            	<template slot-scope="{row}">
		            	<span v-if="row.restInd=='1'" >是</span>
		            	<span v-if="row.restInd=='0'" >否</span>
	            	</template>
	            </el-table-column>
            	<el-table-column prop="" label="操作" align="center" width="250px">
	                <template slot-scope="{row,$index}">
	                	<el-button size="mini" icon="el-icon-more" type="primary" @click="upCapitalAccount(row,$index)">新增资金法人账号</el-button>
	                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="upDelListA(row,$index)">删除</el-button>
	                </template> 
	            </el-table-column>
        	</el-table>
	        <!--法人账号信息-->
	        <div class="clearboth"></div>
	        <div class="mainname ng-binding" style="width:50%;text-align: left;float: left;">法人账号信息</div>
         	<el-table v-loading = "upListLoading2" :data="upTableList2" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	          	<el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
	            <el-table-column prop="accountName" label="户名" align="center" width="50px"/>
	            <el-table-column prop="bankName" label="开户行名称" align="center" width="100px"/>
	            <el-table-column prop="bankNo" label="开户行" align="center" />
	            <el-table-column prop="cashOrRemit" label="钞票标志" align="center" />
	            <el-table-column prop="accountCcy" label="币种" align="center" width="100px"/>
	            <el-table-column prop="accountNo" label="账号" align="center" width="50px"/>
	            <el-table-column prop="accountType" label="账号类型" align="center" width="100px"/>
	            <el-table-column prop="accountInd" label="账号标志" align="center" width="110px"/>
	            <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row,$index}">
	                	<el-button size="mini" icon="el-icon-more" type="primary" @click="upDelListB(row,$index)" >删除</el-button>
	               	</template> 
            	</el-table-column>
            </el-table>
    		<!--选择产品-->
            <div class="text_title">选择产品</div>
            <el-form ref="upProductFormRef" :model="upProductForm">
                <el-form-item class="cl_td" label="产品对象代码" prop="productObjectCode">
                    <el-input v-model="upProductForm.productObjectCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="产品对象描述" prop="productDesc">
                    <el-input v-model="upProductForm.productDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="up_controlSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="up_productHandle()">关联</el-button>
            </div>
            <el-table v-loading = "upListLoading3" :data="upProductTableList"  class="mbtm20" fit highlight-current-row style="width: 100%;"  
                border @selection-change="up_controlSelectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
                <el-table-column prop="productDesc" label="产品对象描述" align="center" />
            </el-table>
            <pagination v-show="upProductTotal>0" :total="upProductTotal" :page.sync="upProductPage.pageNum" :limit.sync="upProductPage.pageSize" @pagination="getUpProductList" />
            <div class="text_title">已关联产品</div>
            <el-table v-loading = "upListLoading4"  :data="upAssociatedList" class="mbtm20" 
                fit  highlight-current-row  style="width: 100%;" border >
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
                <el-table-column prop="productDesc" label="产品对象描述" align="center" />
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" type="primary" @click="upDateQuotaNode(row,$index)" >关联额度节点</el-button>
                        <el-button size="mini" type="primary" @click="upDelQuotaNode(row,$index)" >删除</el-button><!--v-show="selBtnFlag"-->
                    </template>
                </el-table-column>
            </el-table>
	        <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="upDateData(upAssociatedList)">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--关联额度节点的产品对象-->
        <el-dialog title="产品对象" :visible.sync="dialogFormVisibleQuotaUp" width="65%">
        	<div class="mainname">资金协议产品对象额度节点关系新增</div>
        	<!--<el-form ref="dataFormQuotaUp" :rules="rulesQuotaUp" :model="quotaInfoUp" >
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                   <el-input v-model="quotaInfoUp.creditNodeNo" class="wd200" type="text"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="额度节点描述 " prop="creditDesc">
	               	<el-input v-model="quotaInfoUp.creditDesc" class="wd200" type="text"/>
	            </el-form-item>
	        </el-form>
         	<div  class="dialog-footer cl_tr text_center">
           		<el-button type="primary" @click="upQuotaSearch()">查询</el-button>
        	</div>-->
            <div style="margin-left: 20%;">
                <!--<el-transfer
                    filterable
                    :titles="['可选择额度节点', '已选择额度节点']"
                    filter-placeholder="请输入额度节点"
                    v-model="up_busTypeList"
                    @change="up_handleAddComponent"
                    @right-check-change="up_rightCheckedChange"
                    :data="up_allBusTypeData" >
                </el-transfer>-->
                <el-transfer
                    filterable
                   	:titles="['可选择入账币种', '已选择入账币种']"
                    filter-placeholder="请输入入账币种"
                    v-model="up_busTypeList"
                    @change="up_handleAddComponent"
                    @right-check-change="up_rightCheckedChange"
                    :data="up_allBusTypeData"
                    :right-default-checked="rightCheckedBusType"
                    ref="up_transfer">
                </el-transfer>
            </div>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="upQuotaData()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleQuotaUp=false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--查询-->
        <el-dialog title="资金协议信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                	:rules="[ { required: true, message: '运营模式不能为空'}]">
	                <el-select v-model="tempDetail.operationMode" class="wd200" disabled   readonly>
	                    <el-option
	                        v-for="(item, index ) in operationModeOptions"
	                        :key="index"
	                        :label="item.modeName"
                			:value="item.operationMode"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资金协议编号" prop="trustNum"
                    :rules="[ { required: true, message: '资金协议编号不能为空'}]">
                   <el-input v-model="tempDetail.trustNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="资金协议名称" prop="trustName"
                    :rules="[ { required: true, message: '资金协议名称不能为空'}]">
                   <el-input v-model="tempDetail.trustName" class="wd200" type="text" readonly/>
                </el-form-item>
             	<el-form-item class="cl_td" label="资金协议类型" prop="trustType" 
                 	:rules="[ { required: true, message: '资金协议类型不能为空'}]">
	                <el-select v-model="tempDetail.trustType" class="wd200" disabled   readonly>
	                    <el-option
	                        v-for="(item, index ) in trustTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="出资类型" prop="fundsType" 
                 	:rules="[ { required: true, message: '出资类型不能为空'}]">
	                <el-select v-model="tempDetail.fundsType" class="wd200" disabled   readonly>
	                    <el-option
	                        v-for="(item, index ) in fundsTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	 <el-form-item class="cl_td" label="币种" prop="accountCcy" 
                 	:rules="[ { required: true, message: '币种不能为空'}]">
	                <el-select v-model="tempDetail.accountCcy" class="wd200" disabled   readonly>
	                    <el-option
	                        v-for="(item, index ) in accountCcyOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="是否多方" prop="isMulitTrust" 
                 	:rules="[ { required: true, message: '是否多方不能为空'}]">
	                <el-select v-model="tempDetail.isMulitTrust" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in isMulitTrustOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="资金额度" prop="loanAmt"
                	:rules="[ { required: true, message: '资金额度不能为空'}]">
                   <el-input v-model="tempDetail.loanAmt" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="合作模式" prop="cooperatModel" >
                 	<el-select v-model="tempDetail.cooperatModel" class="wd200" disabled   readonly>
	                    <el-option
	                        v-for="(item, index ) in cooperatModelOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="清算模式" prop="clearMode" >
                 	<el-select v-model="tempDetail.clearMode" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in clearModeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
	                <el-date-picker
	                    v-model="tempDetail.effectiveDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"   readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="是否自动转回" prop="isAutoTrun" >
                 	<el-select v-model="tempDetail.isAutoTrun" class="wd200" disabled   readonly>
	                    <el-option
	                        v-for="(item, index ) in isAutoTrunOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
	            <el-form-item class="cl_td" label="到期日期" prop="expireDate">
	                <el-date-picker
	                    v-model="tempDetail.expireDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="请选择"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	:picker-options="pickerOptions"	   readonly/>
	            </el-form-item>
	        </el-form>
	        <!--法人信息-->
	        <div class="clearboth"></div>
	        <div class="mainname ng-binding" style="width:50%;text-align: left;float: left;">法人信息</div>
	      	<el-table v-loading = "detailListLoading1" :data="detailTableList1" class="mbtm20" fit highlight-current-row  
         		@current-change="detailCapitalChange"  @row-click="chooseone" style="width: 100%;" border>
	            <el-table-column width="80">
                	<template slot-scope="scope">
		                <el-radio v-model="curRowRadio3" :label="scope.row.corporationEntityNo">
		                    <span class="el-radio__label"></span>
		                </el-radio>
	                </template>
            	</el-table-column>
	            <el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
	            <el-table-column prop="corporationEntityName" label="法人名称" align="center" />
	            <el-table-column prop="ratio" label="出资比例%" align="center" />
	            <el-table-column  label="分润规则" align="center" >
	            	<template slot-scope="{row}">
		            	<span v-if="row.dividendRule=='0'">按出资</span>
		            	<span v-if="row.dividendRule=='1'">按利率</span>
		            	<span v-if="row.dividendRule=='2'">按利息</span>
	            	</template>
	            </el-table-column>
	            <el-table-column prop="profitMargin" label="分润利率%" align="center" />
	            <el-table-column prop="interestDividendRatio" label="分润比例%" align="center" />
	            <el-table-column prop="amount" label="出资金额（元）" align="center" />
	            <el-table-column  label="多余资金归属" align="center">
	            	<template slot-scope="{row}">
		            	<span v-if="row.restInd=='1'" >是</span>
		            	<span v-if="row.restInd=='0'" >否</span>
	            	</template>
	            </el-table-column>
	           </el-table>
	        <!--法人账号信息-->
	        <div class="clearboth"></div>
	        <div class="mainname ng-binding" style="width:50%;text-align: left;float: left;">法人账号信息</div>
         	<el-table v-loading = "detailListLoading2" :data="detailTableList2" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	          	<el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
	            <el-table-column prop="accountName" label="户名" align="center" />
	            <el-table-column prop="bankName" label="开户行名称" align="center" />
	            <el-table-column prop="bankNo" label="开户行" align="center" />
	            <el-table-column prop="cashOrRemit" label="钞票标志" align="center" />
	            <el-table-column prop="accountCcy" label="币种" align="center" />
	            <el-table-column prop="accountNo" label="账号" align="center" />
	            <el-table-column prop="accountType" label="账号类型" align="center" />
	            <el-table-column prop="accountInd" label="账号标志" align="center" />
	        </el-table>
    		<!--选择产品-->
    		<div class="text_title">已关联产品</div>
            <el-table v-loading = "detailListLoading3"  key="detailQuotaName" :data="detailAssociatedList" class="mbtm20" 
                fit  highlight-current-row  style="width: 100%;" border @current-change="detailQuotaChange">
                <el-table-column width="80">
                	<template slot-scope="scope">
		                <el-radio v-model="curRowRadio4" :label="scope.row.productObjectCode">
		                    <span class="el-radio__label"></span>
		                </el-radio>
	                </template>
            	</el-table-column>
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
                <el-table-column prop="productDesc" label="产品对象描述" align="center" />
            </el-table>
            <pagination v-show="detailTotal>0" :total="detailTotal" :page.sync="detailPage.pageNum" :limit.sync="detailPage.pageSize" @pagination="getQuotaList" />
           <div v-if="showQuotaDetail">
	           <div class="text_title">产品关联额度节点</div>
	            <el-table v-loading = "detailListLoading4" key="quotaName" :data="detailQuota" class="mbtm20" 
	                fit  highlight-current-row  style="width: 100%;" border >
	                <el-table-column prop="code" label="额度节点代码" align="center" />
	                <el-table-column prop="desc" label="额度节点描述" align="center" />
	            </el-table>
            </div>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeDetail()">取消</el-button>
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
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            list_formatCode: '',
            // 下拉框
            operationModeOptions: [],//运营模式
           	statusOptions: [],//状态
           	trustTypeOptions: [],//资金协议类型
           	fundsTypeOptions: [],//出资类型
           	accountCcyOptions: [],//币种
           	isMulitTrustOptions: [],//是否多方
           	cooperatModelOptions: [],//合作模式
           	isAutoTrunOptions: [],//是否自动回转
           	clearModeOptions: [],//清算模式
           	corporationOptions: [],//法人编号
           	dividendRuleOptions: [],//分润规则
           	restIndOptions: [],//多余资金归属地
           	feeRulesOptions: [],//费用规则
           	cashOrRemitOptions: [],//钞票标志
           	accountCcyOptions2: [],//币种
           	accountIndOptions: [],//账号标志
           	accountTypeOptions2: [],//账号类型
           	/*----新增----*/
           	fundDiv: true,//资金方信息
			curRowRadio1: '',//单选
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
         	addTableList1: [],//法人信息表
         	listLoading1: false,
         	addTableList2: [],//法人账号信息表
         	coreTrustAccountList: [],
         	listLoading2: false,
         	//新增资金法人信息
         	dialogFormVisibleCapital: false,
         	dataFormCapital: {},
         	addCapital: {},
         	rulesCapital: {},
         	dataCapital: '',
         	legalVal: '',
         	//新增资金法人账号信息
         	dataFormCorporate: {},
         	addCorporate: {},
         	rulesCorporate: {},
         	dialogFormVisibleCorporate: false,
         	tableListIndex: '',
         	//选择产品
         	productForm: {},
         	productFormRef: {},
         	listLoading3 :false,
         	productTableList : [],
         	productTotal  : 0,
         	productPage: {
         		pageNum: 1,
                pageSize:10,
         	},
         	//已关联产品
         	add_listNew:[],//事件关联临时数组
         	listLoading4 :false,
         	addAssociatedList: [],
         	productDiv : false,
         	productIndex: '',
         	//关联额度节点
         	businessTypeCodeInitData: [],
         	dialogFormVisibleQuota: false,
         	quotaInfo: {},
         	dataFormQuota: {},
         	rulesQuota: {},
         	add_busTypeList: [],
	        add_allBusTypeData: [],
	        add_rightCheckedBusType: [],
	        add_businessTypeCodeInitData: [],
	        rightCheckedBusType: [],
            /*-----修改-----*/
            dataFormUp:{},
            tempUp: {}, // 修改
            up_segmentNumber: '',
            dialogFormVisibleUp: false,
            //法人信息
            upTableList2: [],
            upTableList1: [],//法人信息表
         	upListLoading1: false,
         	upTableList2: [],//法人账号信息表
         	coreTrustAccountList: [],
         	upListLoading2: false,
         	upSign: '',
         	curRowRadio2: '',//单选
         	//选择产品
         	upProductFormRef: {},
         	upProductForm: {},
         	upListLoading3: false,
         	upProductTableList: [],   
         	upProductTotal: 0,
         	upProductPage: {
         		pageNum: 1,
                pageSize:10,
         	},  
         	upListLoading4: false,
         	upProductObjectCodeList: [],
         	//已关联产品
         	up_listNew:[],//事件关联临时数组
         	upListLoading4 :false,
         	upAssociatedList: [],
         	trustNumNew: '',
			//关联额度节点
         	upBusinessTypeCodeInitData: [],
         	dialogFormVisibleQuotaUp: false,
         	quotaInfoUp: {},
         	dataFormQuotaUp: {},
         	rulesQuotaUp: {},
         	up_busTypeList: [],
	        up_allBusTypeData: [],
	        up_rightCheckedBusType: [],
	        up_businessTypeCodeInitData: [],
	        upRightCheckedBusType: [],
	        showQuotaUp: false,
	        up_busTypeList: [],
        up_allBusTypeData: [],
        up_rightCheckedBusType: [],
        up_businessTypeCodeInitData: [],
            /*-----查询-----*/
            tempDetail: {}, // 详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            rulesDetail: {},
            detail_segmentNumber: '',
            //法人信息
            detailTableList1: [],
            detailListLoading1: false,
            curRowRadio3: '',//单选
            //法人账号信息
            detailTableList2: [],
            detailListLoading2: false,
            //已关联产品
           	detailListLoading3: false,
            detailAssociatedList: [],
            detailTotal: 0,
            detailPage: {
            	pageNum: 1,
                pageSize:10,
            },
            curRowRadio4: '',//单选
            detailQuotaName: '',
            //产品关联额度节点
            showQuotaDetail: false,
            detailListLoading4: false,
            quotaName: '',
            detailQuota: [],
    	}
   	},
    created() {
        this.getBtnAuth()
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
		this.getList()
        //运营模式
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //状态
        this.getSelectDict( "dic_effectiveStatus").then(res => {
        	this.statusOptions = res
        })
        //资金协议类型
        this.getSelectDict( "dic_fundAgreementType").then(res => {
            this.trustTypeOptions.push(res[3])
        })
        //出资类型
        this.getSelectDict( "dic_typesOfContribution").then(res => {
            this.fundsTypeOptions = res
        })
        //币种
        this.getSelectDict( "dic_curreny").then(res => {
        	this.accountCcyOptions.push(res[0])
       	})
        //是否多方
        this.getSelectDict( "dic_ZorO").then(res => {
        	this.isMulitTrustOptions = res
       	})
        //合作模式
        this.getSelectDict( "dic_cooperationMode").then(res => {
        	this.cooperatModelOptions = res
       	})
     	//清算模式
        this.getSelectDict( "dic_liquidationMode").then(res => {
        	this.clearModeOptions = res
       	})
        //是否自动回转
        this.getSelectDict( "dic_ZorO").then(res => {
        	this.isAutoTrunOptions = res
       	})
        //法人编号
        let objData={
        	status: 1,
        }
        this.getSelectDict( "/beta/betaService/FMS.IQ.04.0001", objData).then(res => {
        	this.corporationOptions = res
       })	
       	//分润规则
       	this.getSelectDict( "dic_distributionRules").then(res => {
        	this.dividendRuleOptions = res
       	})
       //多余资金归属地
       	this.getSelectDict( "dic_ZorO").then(res => {
        	this.restIndOptions = res
       	})
        //费用规则
       	this.getSelectDict( "dic_costRule").then(res => {
        	this.feeRulesOptions = res
       	})
       	//钞票标志
       	this.getSelectDict( "dic_bankNote").then(res => {
        	this.cashOrRemitOptions = res
       	})
       	//币种
       	this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
       		res.forEach(item=>{
       		 item.currencyCode2Desc	= item.currencyCode+""+item.currencyDesc
       		})
        	this.accountCcyOptions2 = res
        })
       	//账号标志
       	this.getSelectDict( "dic_accountMark").then(res => {
        	this.accountIndOptions = res
       	})
       	//账号类型
       	this.getSelectDict( "dic_accountType").then(res => {
        	this.accountTypeOptions2 = res
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
                        if (this.eventList.includes('FMS.IQ.05.0001')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('FMS.AD.05.0001')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('FMS.UP.05.0001')) { // 修改
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
            this.listLoading = true
           	let params = {
            	status:  this.queryFormObj.statusData ? this.queryFormObj.statusData : '1',
                isTrans: true,
				transParams: ['dic_fundAgreementType','dic_ZorO','dic_ZorO','dic_typesOfContribution','dic_effectiveStatus'],
				transDict: ['trustType','isMulitTrust','isAutoTrun','fundsType','status'],
           	}
            params = Object.assign(this.queryFormObj, params)   //合并
            this.getTableList('/beta/betaService/FMS.IQ.05.0001', params,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                        this.listLoading = false
                        
                        this.tableList.forEach(item =>{
                            item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productObjectCodeDesc
                            item.newMediaObjectCodeDesc = item.mediaObjectCode+ ' '+ item.mediaObjectCodeDesc
                            item.newFormatCodeDesc =item.formatCodeDesc + '' + item.formatCode

                        })
                    }
                }
            })
        },
        handleSearch() {
			this.queryFormObj.pageNum = 1
            this.getList()
        },
        /*----------新增----------*/
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.getProductList()//选择产品列表
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
         //————1.新增资金法人信息显示弹框———修改与新增用同一弹框————
        addCapitalInfo(row){
        	this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                	this.addCapital = Object.assign({}, row)
                	this.dialogFormVisibleCapital=true
	            	this.getCorporationEntityNo()
	            	this.$nextTick(() => {
	                    this.$refs['dataFormCapital'].clearValidate()
	                })
	            }	
        	})
        },
        //法人编号下拉
        getCorporationEntityNo(){
        	let objData = {
        		status: '1',
        	}
        	this.post('/beta/betaService/FMS.IQ.04.0001', objData, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                         this.corporationOptions = res.returnData.rows
                    } else {
						this.corporationOptions = []
					}
                }
        	})
        },
        //监听法人编号下拉
        corporationEntityNoChange(val){
        	this.legalVal = val
        	this.getCorporationEntityName()
        },
        getCorporationEntityName(){
    	  	this.post('/beta/betaService/FMS.IQ.04.0001', {}, (res) => {
                if (res.returnCode == '000000') {
                    for(var i =0; i < res.returnData.rows.length; i++){
						if(res.returnData.rows[i].corporationEntityNo == this.legalVal){
							this.addCapital.corporationEntityName = res.returnData.rows[i].corporationEntityName;
							this.$forceUpdate()
							this.addCapital.partnerCategory = res.returnData.rows[i].partnerCategory;
							this.addCapital.status = res.returnData.rows[i].status;
                        }
                    }
                }
        	})
        },
        //新增资金法人信息回调与修改新增资金法人信息回调，修改与新增用同一表弹框
       	subCapitalData(){
        	this.dialogFormVisibleCapital = false
    		if(this.addCapital.hasOwnProperty('upSign')){//修改页面新增法人信息回调数据
        		this.upTableList1.push(this.addCapital)
        	}else{//新增页面新增法人信息回调数据
        		this.addTableList1.push(this.addCapital)
        	}
        },
        //删除资金方信息
        deleteListA(list,index){
			this.addTableList1.splice(index,1);
			this.addTableList2.splice(0,this.addTableList2.length);
		},
        chooseone(row){
	      this.radio = row.id
    	},
        //新增资金法人信息列表单选
        capitalChange(row,index) {
	      	let currentSelectItem = row;
	      	let itemIndex= index
	      	if(row.hasOwnProperty('coreTrustAccountList')){
	      		this.addTableList2=row.coreTrustAccountList
	      	}else{
	      		this.addTableList2 = []
	      	}
	    },
	   	//————————2.子表&&新增资金法人账号显示的弹框————————
        addCapitalAccount(row,index){
        	this.dialogFormVisibleCorporate=true
        	this.tableListIndex=index
        	this.capitalChange(row,index)
        	this.addCorporate = Object.assign({}, row)
        	this.addCorporate.tableListIndex = this.tableListIndex
        },
        //确认回调资金法人账号信息
        subCorporateData(){
        	let itemIndex = this.tableListIndex;
        	let coreTrustAccountList = []
        	if(this.addCorporate.hasOwnProperty('upSign')){//修改页面新增法人账号信息回调数据
        		if(this.upTableList1[itemIndex].hasOwnProperty("coreTrustAccountList")){
            		this.upTableList1[itemIndex].coreTrustAccountList.push(this.addCorporate);
            	}else{
					this.upTableList1[itemIndex].coreTrustAccountList = [this.addCorporate];
				}
            	this.upTableList2 = this.upTableList1[itemIndex].coreTrustAccountList
            	this.upTableList2.forEach(item=>{
            		//钞票标志
            		if(item.cashOrRemit=='0'){
	        			item.cashOrRemit = '钞'
	            	}else if(item.cashOrRemit=='1'){
	            		item.cashOrRemit= '汇'
	            	}
            		//币种
            		if(item.currencyCode=='976'){
	            		item.accountCcy='976 瑞士法郎'
	            	}else if(item.currencyCode=='977'){
	            		item.accountCcy='977 法国金路易斯'
	            	}else if(item.currencyCode=='344'){
	            		item.accountCcy='344 港币'
	            	}else if(item.currencyCode=='156'){
	            		item.accountCcy='156 人民币'
	            	}else if(item.currencyCode=='840'){
	            		item.accountCcy='840 美元'
	            	}else if(item.currencyCode=='978'){
	            		item.accountCcy='978 欧元'
	            	}else if(item.currencyCode=='702'){
	            		item.accountCcy='702 新加坡元'
	            	}else if(item.currencyCode=='826'){
	            		item.accountCcy='826 英镑'
	            	}else if(item.currencyCode=='392'){
	            		item.accountCcy='392 日元'
	            	}else if(item.currencyCode=='975'){
	            		item.accountCcy='975 德国马克'
	            	}else if(item.currencyCode=='217'){
	            		item.accountCcy='217 越南盾'
	            	}
            		//账号类型
	            	if(item.accountType=='0'){
	            		item.accountType='个人账号'
	            	}else if(item.accountType='1'){
	            		item.accountType='对公账号'
	            	}else if(item.accountType=='2'){
	            		item.accountType='内部账号'
	            	}else if(item.accountType=='3'){
	            		item.accountType='他行账号'
	            	}
	            	//账号标志
	            	if(item.accountInd=='0'){
	            		item.accountInd='结算账号'
	            	}else if(item.accountInd=='1'){
	            		item.accountInd='代理业务负债账号'
	            	}else if(item.accountInd=='2'){
	            		item.accountInd='回笼本金账号'
	            	}else if(item.accountInd=='3'){
	            		item.accountInd='回笼利息账号'
	            	}
            	})
            }else{//新增页面新增法人账号信息回调数据
            	if(this.addTableList1[itemIndex].hasOwnProperty("coreTrustAccountList")){
            		this.addTableList1[itemIndex].coreTrustAccountList.push(this.addCorporate);
            	}else{
					this.addTableList1[itemIndex].coreTrustAccountList = [this.addCorporate];
				}
            	this.addTableList2 = this.addTableList1[itemIndex].coreTrustAccountList
            	this.addTableList2.forEach(item=>{
	            		//钞票标志
	            	if(item.cashOrRemit=='0'){
	        			item.cashOrRemit = '钞'
	            	}else if(item.cashOrRemit=='1'){
	            		item.cashOrRemit= '汇'
	            	}
	            	//币种
	            	if(item.currencyCode=='976'){
	            		item.accountCcy='976 瑞士法郎'
	            	}else if(item.currencyCode=='977'){
	            		item.accountCcy='977 法国金路易斯'
	            	}else if(item.currencyCode=='344'){
	            		item.accountCcy='344 港币'
	            	}else if(item.currencyCode=='156'){
	            		item.accountCcy='156 人民币'
	            	}else if(item.currencyCode=='840'){
	            		item.accountCcy='840 美元'
	            	}else if(item.currencyCode=='978'){
	            		item.accountCcy='978 欧元'
	            	}else if(item.currencyCode=='702'){
	            		item.accountCcy='702 新加坡元'
	            	}else if(item.currencyCode=='826'){
	            		item.accountCcy='826 英镑'
	            	}else if(item.currencyCode=='392'){
	            		item.accountCcy='392 日元'
	            	}else if(item.currencyCode=='975'){
	            		item.accountCcy='975 德国马克'
	            	}else if(item.currencyCode=='217'){
	            		item.accountCcy='217 越南盾'
	            	}
	            	//账号类型
	            	if(item.accountType=='0'){
	            		item.accountType='个人账号'
	            	}else if(item.accountType=='1'){
	            		item.accountType='对公账号'
	            	}else if(item.accountType=='2'){
	            		item.accountType='内部账号'
	            	}else if(item.accountType=='3'){
	            		item.accountType='他行账号'
	            	}
	            	//账号标志
	            	if(item.accountInd=='0'){
	            		item.accountInd='结算账号'
	            	}else if(item.accountInd=='1'){
	            		item.accountInd='代理业务负债账号'
	            	}else if(item.accountInd=='2'){
	            		item.accountInd='回笼本金账号'
	            	}else if(item.accountInd=='3'){
	            		item.accountInd='回笼利息账号'
	            	}
            	})
           	}	
        	this.$forceUpdate()
			this.dialogFormVisibleCorporate = false
    	},
    	//删除资金方账号信息
		deleteListB(item,index){
			this.addTableList2.splice(index,1);
		},
		//3.点击下一步
		nextStep(){
			let capitalInfoList = {
				trustNum: this.tempAdd.trustNum,
				trustName: this.tempAdd.trustName,
				trustType: this.tempAdd.trustType,
				fundsType: this.tempAdd.fundsType,
				isAutoTrun: this.tempAdd.isAutoTrun,
				isMulitTrust: this.tempAdd.isMulitTrust,
				loanAmt: this.tempAdd.loanAmt,
				cooperatModel: this.tempAdd.cooperatModel,
				clearMode: this.tempAdd.clearMode,
				effectiveDate: this.tempAdd.effectiveDate,
				expireDate: this.tempAdd.expireDate,
				operationMode: this.tempAdd.operationMode,
				accountCcy: this.tempAdd.currencyCode,
			};
			let countNum = 0;
			let theSum = 0;
			let ratioNum = 0;
			capitalInfoList.coreBusTrustPersonList= this.addTableList1;
			for(var prop in capitalInfoList.coreBusTrustPersonList){
				countNum += capitalInfoList.coreBusTrustPersonList[prop].amount;
				theSum += capitalInfoList.coreBusTrustPersonList[prop].interestDividendRatio;
				ratioNum += capitalInfoList.coreBusTrustPersonList[prop].ratio;
            }
			this.post('/beta/betaService/FMS.AD.05.0001',capitalInfoList, (res) => {
				if (res.returnCode == '000000') {
					 this.dialogFormVisibleAdd = false
					if (data.returnCode == '000000') {
						this.capitalInfoList = {};
						this.fundDiv = false;//资金方信息
						this.productDiv = true;//产品额度节点
					}
                }
               
            })
		},
		 //选择产品列表
		getProductList(){
			this.listLoading3 = true
			this.getTableList('/beta/betaService/COS.IQ.02.0013', this.productPage,(res) => {
				this.listLoading3 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.productTableList = res.returnData.rows
                        this.productTotal = res.returnData.totalCount
                    } else {
						this.productTableList = []
                        this.productTotal = 0
					}
                }
            }, (err) => {
				this.productTableList = []
                this.productTotal = 0
				this.listLoading3 = false
			})
		},
		//列表多选，选择产品
		add_controlSelectChange(val) {
	        this.add_listNew = val;
	    },
	   	//关联产品
		add_productHandle() {
	        var that = this;
	        if(this.addAssociatedList == undefined || this.addAssociatedList.length <= 0){
	        	this.addAssociatedList = this.add_listNew;
	        }else{
	        let newList = [];  //保存遍历时要留下的项
	        for(let len = 0; len<that.add_listNew.length;len++){
	            let item = that.add_listNew[len]
	            let isExist = false;
	            for(var j = 0; j <  that.addAssociatedList.length; j++){
		            var id = that.addAssociatedList[j].productObjectCode;
		            if(item.productObjectCode== id){
		                isExist = true;
		                break;
		            }
	        	}
	        	if(!isExist){
	           		newList.push(item);
	            }
	        }
	        	that.addAssociatedList  = that.addAssociatedList.concat(newList)
	        }
	        this.add_listNew = [];
	    },
	    //关联额度节点显示弹框
	   	addDateQuotaNode(row,index) {
	        this.quotaInfo = Object.assign({}, row)
	        this.dialogFormVisibleQuota= true
	        this.quotaIndex = index
	        this.quotaInfo.isIndex=index
	        this.add_allBusTypeData = this.generateAllBusTypeData();
	        this.$nextTick(() => {
	            this.$refs['dataFormQuota'].clearValidate()
	        })
	    }, 
	    addBusPro_nextToPart3Btn() {
	      	// 判断是否设置默认入账币种
	        if (this.add_rightCheckedBusType=='' || this.add_rightCheckedBusType==undefined) {
	           this.$message({
	                message: "请设置默认额度节点",
	                type: "warning"
	            });
	            return;
	        }
			this.add_allBalanceData = this.generateAllBalanceData();
	    },
	    // 选择额度节点
	    add_filterMethod(query, item) {
	        return item.creditNodeNo.indexOf(query) > -1;
	    },
	    // 左侧被选额度节点
	   	add_handleAddComponent(value, direction, movedKeys) {
			this.add_busTypeList = value;
	    },
	    // 右侧被选额度节点
	    add_rightCheckedChange(val,direction,movedKeys) {
	    	this.rightCheckedBusType = val;
	   },
	    // 获取额度节点穿梭框左侧数据
	    generateAllBusTypeData() {
	        const componentData = []; // 相当于data
	        const componentNoList = []; //
	        const componentList = [];
	        var field = {};
	        field.operationMode=this.quotaInfo.operationMode
	       	this.post("/beta/betaService/LMS.PM.01.0002", field, res => {
		        this.businessTypeCodeInitData = res.returnData.rows;
		        res.returnData.rows.forEach((item, i) => {
		          	componentList.push(item.creditNodeNo + " " + item.creditDesc);
		          	componentNoList.push(item.creditNodeNo);
		        });
		        componentList.forEach((component, index) => {
		          	componentData.push({
		            	label: component,
		            	// key: index,
		            	key: component.split(" ")[0],
		            	creditNodeNo: componentNoList[index]
		          	});
	        	});
	      	});
	        return componentData;
	    },
	    //确认&&新增额度节点
	    addQuotaData() {
	       	let indexNew = this.quotaIndex
	        let creditNodeNo = ''
	       	if(!this.rightCheckedBusType || this.rightCheckedBusType.length == 0){
				this.$message("检查是否关联额度节点");
				return;
       		}
	       	creditNodeNo = this.rightCheckedBusType.join(",");
	       	this.addAssociatedList[indexNew].creditNodeNo = creditNodeNo
			let productObjectCodeList = []
	        this.addAssociatedList.forEach(item => {
	        	let paramsData = {
					creditNodeNo: item.creditNodeNo,
					productDesc: item.productDesc,
					productObjectCode: item.productObjectCode,
				};
				productObjectCodeList.push(paramsData)
            })
	        this.tempAdd.productObjectCodeList = productObjectCodeList
	      	this.dialogFormVisibleQuota= false
	        this.$refs['dataFormAdd'].validate((valid) => {
	            if (valid) {
	                this.post('/beta/betaService/FMS.AD.05.0002', this.tempAdd, (res) => {
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
       	/*-----显示修改弹框------*/
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
           	this.getUpAssociatedList(row)
            /*this.up_busTypeList=this.getRightBusData(row)*/
            this.up_getCorporateList(row)
            this.getUpProductList()
            this.dialogFormVisibleUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //法人信息&&法人账号信息
      	up_getCorporateList(row){
      		this.getTableList('/beta/betaService/FMS.IQ.05.0002', row,(res) => {
	            if (res.returnCode == '000000') {
					if (res.returnData) {
	                	this.upItem = res.returnData.obj
						if(res.returnData.obj) {
	               			this.upTableList1 = res.returnData.obj.coreBusTrustPersonList
							   if (this.upTableList1[0]) {
	             					this.upTableList2 = this.upTableList1[0].coreTrustAccountList 
								} else {
									this.upTableList2 = []
								}
						} else {
							this.upTableList1 = []
						}
					} else {
						this.upItem = {}
					}
	            }
	        })
      	},
      	//单选
      	upCapitalChange (list,index){
      		if(list.hasOwnProperty('coreTrustAccountList')){
	      		this.upTableList2=list.coreTrustAccountList
	      	}else{
	      		this.upTableList2 = []
	      	}
		},
		//新增法人信息
		upCapitalInfo(row){
			this.addCapital = Object.assign({}, row)
			this.addCapital.upSign = 'up'
			this.dialogFormVisibleCapital=true
        	this.getCorporationEntityNo()
        	this.$nextTick(() => {
                this.$refs['dataFormCapital'].clearValidate()
            })
		},
		//删除
		upDelListA(row,index){
			this.upTableList1.splice(index,1);
		},
		//新增法人账号信息
		upCapitalAccount(row,index){
        	this.dialogFormVisibleCorporate=true
        	this.tableListIndex=index
        	this.capitalChange(row,index)
        	this.addCorporate = Object.assign({}, row)
        	this.addCorporate.upSign = 'up'
        	this.addCorporate.tableListIndex = this.tableListIndex
        },
        //删除
        upDelListB(row,index){
			this.upTableList2.splice(index,1);
		},
        //选择产品
        getUpProductList(){
        	let UpDataItem = {
        		pageNum: this.upProductPage.pageNum,
        		pageSize: this.upProductPage.pageSize,
        		productDesc: this.upProductForm.productDesc,
        		productObjectCode: this.upProductForm.productObjectCode,
        	}
        	this.getTableList('/beta/betaService/COS.IQ.02.0013', UpDataItem,(res) => {
	            if (res.returnCode == '000000') {
	            	if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ){
	            		this.upProductTableList= res.returnData.rows
	            		this.upProductTotal = res.returnData.totalCount
	               	}
	            }
	        })
      	},
      	//已关联产品
        getUpAssociatedList(row){
        	this.trustNumNew=row.trustNum
        	let objTrustNum = {
        		trustNum: row.trustNum,
        	}
        	this.getTableList('/beta/betaService/FMS.IQ.05.0004', objTrustNum,(res) => {
	            if (res.returnCode == '000000') {
	            	if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ){
	            		this.upAssociatedList= res.returnData.rows
	            	}
	            }
	        })
      	},
      	//列表多选，选择产品
		up_controlSelectChange(val) {
	        this.up_listNew = val;
	    },
	   	//关联产品
		up_productHandle() {
	        var that = this;
	        if(this.upAssociatedList == undefined || this.upAssociatedList.length <= 0){
	        	this.upAssociatedList = this.up_listNew;
	        }else{
	        let newList = [];  //保存遍历时要留下的项
	        for(let len = 0; len<that.up_listNew.length;len++){
	            let item = that.up_listNew[len]
	            let isExist = false;
	            for(var j = 0; j <  that.upAssociatedList.length; j++){
		            var id = that.upAssociatedList[j].productObjectCode;
		            if(item.productObjectCode== id){
		                isExist = true;
		                break;
		            }
	        	}
	        	if(!isExist){
	           		newList.push(item);
	            }
	        }
	        	that.upAssociatedList  = that.upAssociatedList.concat(newList)
	        }
	        this.up_listNew = [];
	    },
	    up_controlSearch(){
	    	this.getUpProductList()
	    },
	    //关联额度节点显示弹框
	   	upDateQuotaNode(row,index) {
	   		this.quotaInfoUp = Object.assign({}, row)
	        this.dialogFormVisibleQuotaUp= true
	        this.quotaIndex = index
	        this.quotaInfoUp.isIndex=index
	        // 获取额度节点穿梭框左侧数据
        	this.up_allBusTypeData = this.up_generateAllBusTypeData();
        	// 获取额度节点穿梭框右侧数据
        	this.up_busTypeList = this.up_generateRightData(row)
	   	}, 
		// 左侧被选中额度节点
	    up_handleAddComponent(value, direction, movedKeys) {
	        this.$refs['dataFormUp'].validate((valid) => {
	            if (valid) {
	                // businessTypeCodeInitData  原始数据
	                this.up_busTypeList = value; // 选择的+右侧的数据 数组
	                // this.upRightCuurList = value  // 选择的+右侧的数据 数组
	                value.forEach((item, index) => {
	                    this.businessTypeCodeInitData.forEach((item2, ii) => {
	                        if (item == item2.currencyCode) {
	                            this.upRightCuurList.push({
	                                operationMode: this.tempUp.operationMode,
	                                currencyCode: item
	                            })
	                        }
	                    })
	                })
	                this.dialogFormVisiblePriorityUp=true;
	            }
	        })
	    },
	    // 右侧已选额度节点
	    up_rightCheckedChange(val,direction,movedKeys) {
	        this.rightCheckedBusType = val; // 右侧别选中的数据数组
	    },
	   	// 获取可选额度节点：穿梭框左侧数据
	    up_generateAllBusTypeData() {
	        const componentData = []; // 相当于data
	        const componentNoList = []; //
	        const componentList = [];
	        var field = {};
	        field.operationMode=this.tempUp.operationMode
	        this.post("/beta/betaService/LMS.PM.01.0002", field, res => {
	        this.businessTypeCodeInitData = res.returnData.rows;
	       	res.returnData.rows.forEach((item, i) => {
	          componentList.push(item.creditNodeNo + " " + item.creditDesc);
	          componentNoList.push(item.creditNodeNo);
	        });
	        componentList.forEach((component, index) => {
	          componentData.push({
	            label: component,
	            // key: index,
	            key: component.split(" ")[0],
	            currencyCode: componentNoList[index]
	          });
	        });
	      });
	        return componentData;
	    },
	    // 修改 获取右侧数据
	    up_generateRightData(row) {
	        const rightData = []
	        let obj = {
	            trustNum: this.trustNumNew
	        }
	        this.post('/beta/betaService/FMS.IQ.05.0004', obj ,(res) => {
	            if (res.returnCode == '000000') {
	                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
	                    res.returnData.rows.forEach(rightItem => {
	                    	rightItem.creditNodeNoList.forEach(item=>{
	                    		item.label = item.code+' '+item.desc
	                        	item.key = item.code
	                        	rightData.push(item.code)
	                    	})
	                        
	                    })
	                }
	            }
	        })
	        return rightData
	    },

	    //确认&&新增额度节点
	    upQuotaData() {
	       	let indexNew = this.quotaIndex
	        let creditNodeNo = ''
	       	if(!this.rightCheckedBusType || this.rightCheckedBusType.length == 0){
				this.$message("检查是否关联额度节点");
				return;
       		}
	       	creditNodeNo = this.rightCheckedBusType.join(",");
	       	this.upAssociatedList[indexNew].creditNodeNo = creditNodeNo
			this.dialogFormVisibleQuotaUp= false
	    },
	    //删除额度节点
	    upDelQuotaNode(row,index){
	    	this.upAssociatedList.splice(index,1);
	    },
	    //提交修改数据
	    upDateData(row){
	    	let upProductObjectCodeList = []
	    	let creditNodeNo11=[]
	    	let associatedItem=row
	    	for(var k = 0 ; k < associatedItem.length; k++){
				if(!associatedItem[k].creditNodeNoList){
					this.$message('检查是否关联额度节点')
					return;
				} else if(associatedItem[k].creditNodeNoList && associatedItem[k].creditNodeNoList.length > 0){
					creditNodeNo11=associatedItem[k].creditNodeNo
					if(creditNodeNo11){
						var obj = {
							productObjectCode : associatedItem[k].productObjectCode,
							productDesc : associatedItem[k].productDesc,
							creditNodeNo : creditNodeNo11,
						};
						upProductObjectCodeList.push(obj);
                    }
                }
            }
	    	this.tempUp.accountCcy = this.tempUp.currencyCode
	    	this.tempUp.productObjectCodeList=upProductObjectCodeList
	    	this.tempUp.coreBusTrustPersonList = this.upTableList1
	    	delete this.tempUp.newMediaObjectCodeDesc
	    	delete this.tempUp.productObjectCodeDesc
	    	this.$refs['dataFormUp'].validate((valid) => {
	            if (valid) {
	                this.post('/beta/betaService/FMS.UP.05.0001', this.tempUp, (res) => {
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
		/*------查询详情------*/
        detailInfo(row) {
            this.tempDetail = Object.assign({}, row)
            this.getLegalPersonList(row)
            this.getQuotaList(row)
            this.detail_segmentNumber=row.formatCode
            this.dialogFormVisibleDetail = true
            this.showQuotaDetail=false
            this.$forceUpdate()
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
        //法人信息
   	  	getLegalPersonList(row){
   	  		this.detailListLoading1 = true
   	  		this.detailListLoading1 = true
   	  		let itemData={
   	  			isTrans: true,
				transParams: ['dic_fundAgreementType',],
				transDict: ['trustType_trustTypeDesc',],
   	  		}
   	  		this.getTableList('/beta/betaService/FMS.IQ.05.0002', row,(res) => {
        		this.detailListLoading1 = false
        		this.detailListLoading2 = false
	            if (res.returnCode == '000000') {
            		this.tempDetail= res.returnData.obj
            		this.detailTableList1 = res.returnData.obj.coreBusTrustPersonList
            		this.detailTableList2 = this.detailTableList1[0].coreTrustAccountList
            		//钞票标志
            		this.detailTableList2.forEach(item=>{
            			if(item.length >0){
			            	if(item.cashOrRemit=='0'){
			        			item.cashOrRemit = '钞'
			            	}else if(item.cashOrRemit=='1'){
			            		item.cashOrRemit= '汇'
			            	}
			            	//币种
			            	if(item.currencyCode=='976'){
			            		item.accountCcy='976 瑞士法郎'
			            	}else if(item.currencyCode=='977'){
			            		item.accountCcy='977 法国金路易斯'
			            	}else if(item.currencyCode=='344'){
			            		item.accountCcy='344 港币'
			            	}else if(item.currencyCode==156){
			            		item.accountCcy='156 人民币'
	//		            		console.log(this.detailTableList2.accountCcy)
			            	}else if(item.currencyCode=='840'){
			            		item.accountCcy='840 美元'
			            	}else if(item.currencyCode='978'){
			            		item.accountCcy=='978 欧元'
			            	}else if(item.currencyCode=='702'){
			            		item.accountCcy='702 新加坡元'
			            	}else if(item.currencyCode=='826'){
			            		item.accountCcy='826 英镑'
			            	}else if(item.currencyCode=='392'){
			            		item.accountCcy='392 日元'
			            	}else if(item.currencyCode=='975'){
			            		item.accountCcy='975 德国马克'
			            	}else if(item.currencyCode=='217'){
			            		item.accountCcy='217 越南盾'
			            	}
			            	//账号类型
			            	if(item.accountType=='0'){
			            		item.accountType='个人账号'
			            	}else if(item.accountType=='1'){
			            		item.accountType='对公账号'
			            	}else if(item.accountType=='2'){
			            		item.accountType='内部账号'
			            	}else if(item.accountType=='3'){
			            		item.accountType='他行账号'
			            	}
			            	//账号标志
			            	if(item.accountInd=='0'){
			            		item.accountInd='结算账号'
			            	}else if(item.accountInd=='1'){
			            		item.accountInd='代理业务负债账号'
			            	}else if(item.accountInd=='2'){
			            		item.accountInd='回笼本金账号'
			            	}else if(item.accountInd=='3'){
			            		item.accountInd='回笼利息账号'
			            	}
		            	}
        			})
                }
	        })
      	},
      	//法人信息单选
      	detailCapitalChange(row,index){
      		let currentSelectItem = row;
	      	let itemIndex= index
	      	if(row.hasOwnProperty('coreTrustAccountList')){
      			this.detailTableList2=row.coreTrustAccountList
	      	}else{
	      		this.detailTableList2 = []
	      	}
	    },
	    //关联产品
	    getQuotaList(row){
   	  		this.detailListLoading3 = true
   	  		this.detailListLoading4 = true
   	  		let trustNumData= {
   	  			pageNum: this.detailPage.pageNum,
   	  			pageSize: this.detailPage.pageSize,
   	  			trustNum: row.trustNum,
   	  		}
   	  		this.getTableList('/beta/betaService/FMS.IQ.05.0004', trustNumData,(res) => {
        		this.detailListLoading3 = false
        		this.detailListLoading4 = false
	            if (res.returnCode == '000000') {
	            	if(res.returnData &&res.returnData.rows && res.returnData.rows.length > 0){
	            		this.detailAssociatedList = res.returnData.rows
	            		this.detailQuota = this.detailAssociatedList[0].creditNodeNoList
	            	}
            		
                }
	        })
      	},
      	//已关联产品单选
      	detailQuotaChange(row,index){
      		let currentSelectItem = []
      		this.showQuotaDetail=true
      		currentSelectItem = row;
	      	let itemIndex= index
	      	if(row !=null){
				this.detailQuota=row.creditNodeNoList
	      	}else{
	      		this.detailQuota = []
	      		this.showQuotaDetail=false
	      		this.curRowRadio4=''
	      	}
	    },
	    closeDetail(){
	    	this.dialogFormVisibleDetail = false
		},
	}
}
</script>

<style>
</style>
