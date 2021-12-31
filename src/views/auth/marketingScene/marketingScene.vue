<!-- 营销场景管理 -->
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
           	<el-form-item class="cl_td" label="营销场景代码" prop="marketingSceneCode">
                <el-input v-model="queryFormObj.marketingSceneCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-if="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
             	<el-table-column prop="marketingSceneCode" label="营销场景代码" align="center"/>
                <el-table-column prop="marketingSceneDesc" label="营销场景描述" align="center"/>
                <el-table-column align="center" label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleSceneDate(scope.row)" v-if="copyBtnFlag">场景识别</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="授权响应码新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" @change="operationModeChange($event)">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode" 
                    :rules="[ { required: true, message: '营销场景代码 不能为空'}]">
                    <el-input v-model="tempAdd.marketingSceneCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="marketingSceneDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempAdd.marketingSceneDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">营销规则</div>
                <el-form-item class="cl_td" label="营销币种" prop="currencyCode" 
                	:rules="[ { required: true, message: '营销币种不能为空'}]">
	                <el-select v-model="tempAdd.currencyCode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in marketingCurrencyCodeOptions"
	                    :key="index"
	                    :label="item.label"
	                    :value="item.value"/>
	                </el-select>
            	</el-form-item>
               	<el-form-item class="cl_td" label="营销规则" prop="marketingRule" 
                	:rules="[ { required: true, message: '营销规则不能为空'}]">
	                <el-select v-model="tempAdd.marketingRule" class="wd200">
	                <el-option
	                    v-for="(item, index ) in marketingRuleOptions"
	                    :key="index"
	                    :label="item.detailDesc"
	                    :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="减免金额上限" prop="discountAmtCeiling" 
                    :rules="[ { required: true, message: '减免金额上限不能为空'}]">
                    <el-input v-model="tempAdd.discountAmtCeiling" class="wd200" type="text" />
                </el-form-item>
                <div v-if="tempAdd.marketingRule=='0'">
	                <el-form-item class="cl_td" label="循环金额" prop="circleAmt" >
	                    <el-input v-model="tempAdd.circleAmt" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="循环减免金额" prop="circleDiscountAmt">
	                    <el-input v-model="tempAdd.circleDiscountAmt" class="wd200" type="text" />
	                </el-form-item>
                </div>
                <div v-if="tempAdd.marketingRule=='1'">
	                <el-form-item class="cl_td" label="阶梯金额1" prop="accumAmtLev1">
	                    <el-input v-model="tempAdd.accumAmtLev1" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额1" prop="accumDiscountAmtLev1">
	                    <el-input v-model="tempAdd.accumDiscountAmtLev1" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯金额2" prop="accumAmtLev2">
	                    <el-input v-model="tempAdd.accumAmtLev2" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额2" prop="accumDiscountAmtLev2">
	                    <el-input v-model="tempAdd.accumDiscountAmtLev2" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯金额3" prop="accumAmtLev3">
	                    <el-input v-model="tempAdd.accumAmtLev3" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额3" prop="accumDiscountAmtLev3">
	                    <el-input v-model="tempAdd.accumDiscountAmtLev3" class="wd200" type="text" />
	                </el-form-item>
                </div>
                <div v-if="tempAdd.marketingRule=='2'">
	                <el-form-item class="cl_td" label="随机金额 " prop="randomAmt">
	                    <el-input v-model="tempAdd.randomAmt" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="随机减免金额上限" prop="randomDiscountAmtCeiling">
	                    <el-input v-model="tempAdd.randomDiscountAmtCeiling" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="随机减免金额下限" prop="randomDiscountAmtFloor">
	                    <el-input v-model="tempAdd.randomDiscountAmtFloor" class="wd200" type="text" />
	                </el-form-item>
	            </div>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
	                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempDetail.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode" >
                    <el-input v-model="tempDetail.marketingSceneCode" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="marketingSceneDesc">
                    <el-input v-model="tempDetail.marketingSceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">营销规则</div>
                <el-form-item class="cl_td" label="营销币种" prop="marketingCurrencyCode">
	                <el-select v-model="tempDetail.marketingCurrencyCode" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in marketingCurrencyCodeOptions"
	                    :key="index"
	                    :label="item.label"
	                    :value="item.value"/>
	                </el-select>
            	</el-form-item>
               	<el-form-item class="cl_td" label="营销规则" prop="marketingRule" 
                	:rules="[ { required: true, message: '营销规则不能为空'}]">
	                <el-select v-model="tempDetail.marketingRule" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in marketingRuleOptions"
	                    :key="index"
	                    :label="item.detailDesc"
	                    :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="减免金额上限" prop="discountAmtCeiling" 
                    :rules="[ { required: true, message: '减免金额上限不能为空'}]">
                    <el-input v-model="tempDetail.discountAmtCeiling" class="wd200" type="text" readonly/>
                </el-form-item>
                <div v-if="tempDetail.marketingRule=='0'">
	                <el-form-item class="cl_td" label="循环金额" prop="circleAmt" >
	                    <el-input v-model="tempDetail.circleAmt" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="循环减免金额" prop="circleDiscountAmt">
	                    <el-input v-model="tempDetail.circleDiscountAmt" class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
                <div v-if="tempDetail.marketingRule=='1'">
	                <el-form-item class="cl_td" label="阶梯金额1" prop="accumAmtLev1">
	                    <el-input v-model="tempDetail.accumAmtLev1" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额1" prop="accumDiscountAmtLev1">
	                    <el-input v-model="tempDetail.accumDiscountAmtLev1" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯金额2" prop="accumAmtLev2">
	                    <el-input v-model="tempDetail.accumAmtLev2" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额2" prop="accumDiscountAmtLev2">
	                    <el-input v-model="tempDetail.accumDiscountAmtLev2" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯金额3" prop="accumAmtLev3">
	                    <el-input v-model="tempDetail.accumAmtLev3" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额3" prop="accumDiscountAmtLev3">
	                    <el-input v-model="tempDetail.accumDiscountAmtLev3" class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
                <div v-if="tempDetail.marketingRule=='2'">
	                <el-form-item class="cl_td" label="随机金额 " prop="randomAmt">
	                    <el-input v-model="tempDetail.randomAmt" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="随机减免金额上限" prop="randomDiscountAmtCeiling">
	                    <el-input v-model="tempDetail.randomDiscountAmtCeiling" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="随机减免金额下限" prop="randomDiscountAmtFloor">
	                    <el-input v-model="tempDetail.randomDiscountAmtFloor" class="wd200" type="text" readonly/>
	                </el-form-item>
	            </div>
	        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
        	<el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode" 
	                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempUp.operationMode" class="wd200" @change="upOperationModeChange($event)" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode">
                    <el-input v-model="tempUp.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="marketingSceneDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempUp.marketingSceneDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">营销规则</div>
                <el-form-item class="cl_td" label="营销币种" prop="currencyCode" 
                	:rules="[ { required: true, message: '营销币种不能为空'}]">
	                <el-select v-model="tempUp.currencyCode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in marketingCurrencyCodeOptions"
	                    :key="index"
	                    :label="item.label"
	                    :value="item.value"/>
	                </el-select>
            	</el-form-item>
               	<el-form-item class="cl_td" label="营销规则" prop="marketingRule" 
                	:rules="[ { required: true, message: '营销规则不能为空'}]">
	                <el-select v-model="tempUp.marketingRule" class="wd200">
	                <el-option
	                    v-for="(item, index ) in marketingRuleOptions"
	                    :key="index"
	                    :label="item.detailDesc"
	                    :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<el-form-item class="cl_td" label="减免金额上限" prop="discountAmtCeiling" 
                    :rules="[ { required: true, message: '减免金额上限不能为空'}]">
                    <el-input v-model="tempUp.discountAmtCeiling" class="wd200" type="text" />
                </el-form-item>
                <div v-if="tempUp.marketingRule=='0'">
	                <el-form-item class="cl_td" label="循环金额" prop="circleAmt" >
	                    <el-input v-model="tempUp.circleAmt" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="循环减免金额" prop="circleDiscountAmt">
	                    <el-input v-model="tempUp.circleDiscountAmt" class="wd200" type="text" />
	                </el-form-item>
                </div>
                <div v-if="tempUp.marketingRule=='1'">
	                <el-form-item class="cl_td" label="阶梯金额1" prop="accumAmtLev1">
	                    <el-input v-model="tempUp.accumAmtLev1" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额1" prop="accumDiscountAmtLev1">
	                    <el-input v-model="tempUp.accumDiscountAmtLev1" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯金额2" prop="accumAmtLev2">
	                    <el-input v-model="tempUp.accumAmtLev2" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额2" prop="accumDiscountAmtLev2">
	                    <el-input v-model="tempUp.accumDiscountAmtLev2" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯金额3" prop="accumAmtLev3">
	                    <el-input v-model="tempUp.accumAmtLev3" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="阶梯减免金额3" prop="accumDiscountAmtLev3">
	                    <el-input v-model="tempUp.accumDiscountAmtLev3" class="wd200" type="text" />
	                </el-form-item>
                </div>
                <div v-if="tempUp.marketingRule=='2'">
	                <el-form-item class="cl_td" label="随机金额 " prop="randomAmt">
	                    <el-input v-model="tempUp.randomAmt" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="随机减免金额上限" prop="randomDiscountAmtCeiling">
	                    <el-input v-model="tempUp.randomDiscountAmtCeiling" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="随机减免金额下限" prop="randomDiscountAmtFloor">
	                    <el-input v-model="tempUp.randomDiscountAmtFloor" class="wd200" type="text" />
	                </el-form-item>
	            </div>
            </el-form> 
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()">确认</el-button>
            </div>
        </el-dialog> 
        <!--场景识别-->
        <el-dialog title="场景识别详细信息" :visible.sync="dialogFormVisibleScene" width="65%">
        	<el-form ref="dataFormScene" :rules="rulesScene" :model="tempScene" >
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode" 
	                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempScene.operationMode" class="wd200" @change="upOperationModeChange($event)" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode" 
                    :rules="[ { required: true, message: '营销场景代码 不能为空'}]">
                    <el-input v-model="tempScene.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form> 
            <div class="cl_tr  text_center">
                <el-button type="primary" icon="el-icon-plus" @click="addSceneInfo(tempScene)" v-if="twoBtnAddFlag">新增</el-button>
            </div>
            <el-table v-loading = "sceneListLoading" :data="sceneList" border stripe style="width: 100%">
                <el-table-column prop="transLocationDesc" label="交易地点" align="center"/>
             	<el-table-column prop="channelListCode" label="渠道清单" align="center"/>
                <el-table-column prop="merchantListCode" label="商户清单" align="center"/>
                <el-table-column prop="productListCode" label="产品清单" align="center"/>
                <el-table-column align="center" label="操作" width='280px'>
                    <template slot-scope="scope">  
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleDetailed(scope.row)" v-if="twoBtnSelFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="upDetailedInfo(scope.row)" v-if="twoBtnUpdFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="delDetailedInfo(scope.row)" v-if="twoBtnDelFlag">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="sceneTableTotal>0" class="page-name" :total="sceneTableTotal" :page.sync="scenePage.pageNum" :limit.sync="scenePage.pageSize" @pagination="getSceneList" />
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleScene = false">关闭</el-button>
            </div>
        </el-dialog> 
        <!--营销清单详情查询add-->
        <el-dialog title="营销清单详情查询" :visible.sync="dialogFormVisibleSceneMarketing" width="65%">
        	<el-form ref="dataFormMarketing" :rules="rulesMarketing" :model="marketingDetail" >
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="marketingDetail.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode">
                    <el-input v-model="marketingDetail.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
            	<div class="mainname titleInfo ng-binding">营销场景识别信息</div>
	            <el-form-item class="cl_td" label="开始日期" prop="startDate">
	                <el-date-picker
	                    v-model="marketingDetail.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="结束日期" prop="endDate">
	                <el-date-picker
	                    v-model="marketingDetail.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	:picker-options="pickerOptions"	/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易地点" prop="transLocation" 
	                   :rules="[ { required: true, message: '交易地点不能为空'}]">
                    <el-select v-model="marketingDetail.transLocation" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transLocationOptions"
                        :key="index"
                        :label="item.detailDesc"
	                    :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道清单 " prop="channelListCode">
                    <el-input v-model="marketingDetail.channelListCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户清单 " prop="merchantListCode">
                    <el-input v-model="marketingDetail.merchantListCode" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="产品清单 " prop="productListCode">
                    <el-input v-model="marketingDetail.productListCode" class="wd200" type="text" />
                </el-form-item>
            </el-form> 
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleSceneMarketing = false">取消</el-button>
                <el-button type="primary" @click="subSceneDate()">确认</el-button>
            </div>
        </el-dialog> 
        <!--营销清单详细细息-->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetailed" width="65%">
        	<el-form ref="dataFormDetailed" :rules="rulesDetailed" :model="detailedInfo" >
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="detailedInfo.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode">
                    <el-input v-model="detailedInfo.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
            	<div class="mainname titleInfo ng-binding">营销场景识别信息</div>
	            <el-form-item class="cl_td" label="开始日期" prop="startDate">
	                <el-date-picker
	                    v-model="detailedInfo.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="结束日期" prop="endDate">
	                <el-date-picker
	                    v-model="detailedInfo.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	:picker-options="pickerOptions"	readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易地点" prop="transLocation" 
	                   :rules="[ { required: true, message: '交易地点不能为空'}]">
                    <el-select v-model="detailedInfo.transLocation" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in transLocationOptions"
                        :key="index"
                        :label="item.detailDesc"
	                    :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道清单 " prop="channelListCode">
                    <el-input v-model="marketingDetail.channelListCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户清单 " prop="merchantListCode">
                    <el-input v-model="detailedInfo.merchantListCode" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="产品清单 " prop="productListCode">
                    <el-input v-model="detailedInfo.productListCode" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form> 
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetailed = false">关闭</el-button>
            </div>
        </el-dialog> 
        <!--修改营销清单详细细息-->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleDetailedUp" width="65%">
        	<el-form ref="dataFormDetailedUp" :rules="rulesDetailedUp" :model="detailedInfoUp" >
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="detailedInfoUp.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode">
                    <el-input v-model="detailedInfoUp.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
            	<div class="mainname titleInfo ng-binding">营销场景识别信息</div>
	            <el-form-item class="cl_td" label="开始日期" prop="startDate">
	                <el-date-picker
	                    v-model="detailedInfoUp.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="结束日期" prop="endDate">
	                <el-date-picker
	                    v-model="detailedInfoUp.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	:picker-options="pickerOptions"	/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易地点" prop="transLocation" 
	                   :rules="[ { required: true, message: '交易地点不能为空'}]">
                    <el-select v-model="detailedInfoUp.transLocation" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transLocationOptions"
                        :key="index"
                        :label="item.detailDesc"
	                    :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道清单 " prop="channelListCode">
                    <el-input v-model="detailedInfoUp.channelListCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户清单 " prop="merchantListCode">
                    <el-input v-model="detailedInfoUp.merchantListCode" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="产品清单 " prop="productListCode">
                    <el-input v-model="detailedInfoUp.productListCode" class="wd200" type="text" />
                </el-form-item>
            </el-form> 
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetailedUp = false">关闭</el-button>
                 <el-button type="primary" @click="subDetailedDate()">保存</el-button>
            </div>
        </el-dialog> 
        <!--删除营销清单详细细息-->
        <el-dialog title="确认删除信息" :visible.sync="dialogFormVisibleDetailedDel" width="65%">
        	<el-form ref="dataFormDetailedDel" :rules="rulesDetailedDel" :model="detailedInfoDel" >
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="detailedInfoDel.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码 " prop="marketingSceneCode">
                    <el-input v-model="detailedInfoDel.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
            	<div class="mainname titleInfo ng-binding">营销场景识别信息</div>
	            <el-form-item class="cl_td" label="开始日期" prop="startDate">
	                <el-date-picker
	                    v-model="detailedInfoDel.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="结束日期" prop="endDate">
	                <el-date-picker
	                    v-model="detailedInfoDel.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	:picker-options="pickerOptions"	readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易地点" prop="transLocation" 
	                   :rules="[ { required: true, message: '交易地点不能为空'}]">
                    <el-select v-model="detailedInfoDel.transLocation" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in transLocationOptions"
                        :key="index"
                        :label="item.detailDesc"
	                    :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道清单 " prop="channelListCode">
                    <el-input v-model="detailedInfoDel.channelListCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户清单 " prop="merchantListCode">
                    <el-input v-model="detailedInfoDel.merchantListCode" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="产品清单 " prop="productListCode">
                    <el-input v-model="detailedInfoDel.productListCode" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form> 
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetailedDel = false">关闭</el-button>
                 <el-button type="primary" @click="subDetailedDateDel()">删除</el-button>
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
            copyBtnFlag: false,
            eventList: '',
            // 列表
            showList: false,
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            tableList: [],
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableTotal: 0,
            corporationEntityNo: '',
            // 下拉框
            operationModeOptions: [], //运营模式
            marketingCurrencyCodeOptions: [],//币种
            listTypOptions: [],//清单类型
            listTypOptionsAdd: [],//清单类型add
           marketingRuleOptions: [],//营销规则
           transLocationOptions: [],
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dialogFormVisibleAdd: false,
            addTableList: [],
            addListLoading: false,
            operationModeData: '',
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            rulesUp: {},
            dataFormUp:{},
            //列表
            upTableList: [],
            upListLoading: false,
            /*----详情----*/
            dialogFormVisibleDetail: false,
            tempDetail: {}, // 修改
            rulesDetail: {},
            detailListLoading: false,
            detailTableList: [],
            /*----场景识别----*/
           	dialogFormVisibleScene: false,
          	sceneList: [],
           	dataFormScene: {},
           	sceneListLoading: false, 
       		sceneTableTotal: 0,
       		rulesScene: {},
           	scenePage: {
           		pageNum: 1,
                pageSize:10,
           	},
           	tempScene: {},
        	//按钮权限
           	twoBtnDelFlag: false,//删除
           	twoBtnUpdFlag: false,//修改
           	twoBtnAddFlag: false,//新增
           	twoBtnSelFlag: false,//查询
           	//营销清单详情查询
           	pickerOptions: {
	          	disabledDate(time) {
		            return time.getTime() < Date.now();
	          	},
         	},
         	dialogFormVisibleSceneMarketing: false,
         	rulesMarketing: {},
         	marketingDetail: {},    
         	dataFormMarketing: {},
         	//营销清单详情
         	 detailedInfo: {},
         	 dialogFormVisibleDetailed: false,
         	 dataFormDetailed: {},
         	 rulesDetailed: {},
         	 //营销清单修改
         	 dialogFormVisibleDetailedUp: false,
         	 detailedInfoUp: {},
         	 dataFormDetailedUp: {},
         	 rulesDetailedUp: {},
			//营销清单删除
			dialogFormVisibleDetailedDel: false,
         	detailedInfoDel: {},
         	dataFormDetailedDel: {},
         	rulesDetailedDel: {},
        }
    },
    created() {
       let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
        this.getBtnAuth()
    },
    mounted() {
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            corporationEntityNo: this.corporationEntityNo,
            adminFlagLogin: '1',
		}
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //清单类型
        this.getSelectDict( "dic_listTypeFive").then(res => {
            this.listTypOptions = res
        })
        //add清单类型
        this.getSelectDict( "dic_listTypeFive").then(res => {
            this.listTypOptionsAdd = res
        })
       	//营销规则
       	this.getSelectDict( "dic_ruleType").then(res => {
            this.marketingRuleOptions = res
        })
       	//交易地点
       	this.getSelectDict( "dic_countries").then(res => {
            this.transLocationOptions = res
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
                        if (this.eventList.includes('AUS.PM.04.0102')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0101')) { // 新增
                            this.addBtnFlag = true
                            this.copyBtnFlag = true;
                        } else {
                            this.addBtnFlag = false
                            this.copyBtnFlag = false;
                        }
                        if (this.eventList.includes('AUS.PM.04.0103')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
         //查询
        handleSearch() {
        	 if((this.queryFormObj.operationMode=='' || this.queryFormObj.operationMode==null || this.queryFormObj.operationMode==undefined) 
            && (this.queryFormObj.marketingSceneCode=='' || this.queryFormObj.marketingSceneCode==null || this.queryFormObj.marketingSceneCode==undefined) ){
                this.$message('请输入查询条件');
                return;
            }else if(this.queryFormObj.cardAssociations){
                if(this.queryFormObj.operationMode=='' || this.queryFormObj.operationMode==null 
                    || this.queryFormObj.operationMode==undefined){
                    this.$message('请选择运营模式');
                    return;
            	}
          	 }
            this.showList = true
            this.getList()
        },
        // 列表
        getList() {
            this.listLoading = true
            let obj = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_listTypeFive'],//查找数据字典所需参数
				transDict : ['listTyp'],//翻译前后key
            }
            obj = Object.assign (obj, this.queryFormObj )
            this.getTableList('/beta/betaService/AUS.PM.04.0102', obj,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }else{
                        this.tableList =[]
                        this.tableTotal = 0
                    }
                }
            })
        },
       //显示新增弹框
        handleCreate() {
        	if(this.queryFormObj.operationMode=='' || this.queryFormObj.operationMode==null 
        	|| this.queryFormObj.operationMode==undefined){
        		this.$message('请选择运营模式');
                return;
        	}
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
          })
        },
        //监听运营模式
        operationModeChange(val){
        	this.operationModeData = val
        	this.getMarketingCurrencyCode()
        },
        //营销币种
       getMarketingCurrencyCode() {
            let params = {
                operationMode: this.operationModeData,
       		}
           	this.post('/beta/betaService/COS.IQ.02.0034', params, (res) => {
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
                        this.marketingCurrencyCodeOptions = arr
                    } else {
                        this.marketingCurrencyCodeOptions = []
                    }
                }
            })
        },
	   	//确认提交新增数据
        createData() {
        	if(this.tempAdd.marketingRule == '0'){
				if(!(parseInt(this.tempAdd.circleAmt)>=0)){
					this.$message('循环金额不能为空');  //循环金额不能为空
					return;
				}
				if(!(parseInt(this.tempAdd.circleDiscountAmt)>=0)){
					this.$message('循环减免金额不能为空');
					return;
				}
			}
			if(this.tempAdd.marketingRule == '1'){
				if(!(parseInt(this.tempAdd.accumAmtLev1)>=0)){
					this.$message('阶梯金额1不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.accumDiscountAmtLev1)>=0)){
					this.$message('阶梯减免金额1不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.accumAmtLev2)>=0)){
					this.$message('阶梯金额2不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.accumDiscountAmtLev2)>=0)){
					this.$message('阶梯减免金额2不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.accumAmtLev3)>=0)){
					this.$message('阶梯金额3不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.accumDiscountAmtLev3)>=0)){
					this.$message('阶梯减免金额3不能为空');
					return;
				}
			}
			if(this.tempAdd.marketingRule == '2'){
				if(!(parseInt(this.tempAdd.randomAmt)>=0)){
					this.$message('随机金额不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.randomDiscountAmtCeiling)>=0)){
					this.$message('随机减免金额上限不能为空');
					return;
				}
				if(!(parseInt(this.tempAdd.randomDiscountAmtFloor)>=0)){
					this.$message('随机减免金额下限不能为空');
					return;
				}
			}
			this.tempAdd.marketingCurrencyCode = this.tempAdd.currencyCode
        	this.$refs['dataFormAdd'].validate((valid) => {
	            if (valid) {
	                this.post('/beta/betaService/AUS.PM.04.0101', this.tempAdd, (res) => {
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
    	//显示详情弹框
        handleDetail(row) {
            //console.log(row)
            this.dialogFormVisibleDetail = true
            this.tempDetail = row // 
        //     this.getDetailList()
        //     this.$nextTick(() => {
        //     this.$refs['dataFormDetail'].clearValidate()
        //   })
        },
        //详情
        getDetailList(){
        	let obj = {
        		listCode: this.tempDetail.listCode,
				listSerialNumbr: this.tempDetail.listSerialNumbr,
				listTyp: this.tempDetail.listTyp,
				operationMode: this.tempDetail.operationMode,
				authDataSynFlag: '1',
        	}
        	this.getTableList('/beta/betaService/AUS.PM.04.0202', obj, (res) => {
               if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.detailTableList = res.returnData.rows
                        /*this.detailListLoading = false*/
                    }
                }
            })
        },
        //显示修改弹框
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.tempUp.currencyCode = row.marketingCurrencyCode
            //console.log(row)
            this.getUpMarketingCurrencyCode()
            this.dialogFormVisibleUp= true
           	this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //营销币种
       	getUpMarketingCurrencyCode() {
			 let params = {
                operationMode: this.tempUp.operationMode,
       		}
           	this.post('/beta/betaService/COS.IQ.02.0034', params, (res) => {
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
                        this.marketingCurrencyCodeOptions = arr
                    } else {
                        this.marketingCurrencyCodeOptions = []
                    }
                }
            })
        },
        //提交修改数据
        updateData() {
        	if(this.tempUp.marketingRule == '0'){
				if(!(parseInt(this.tempUp.circleAmt)>=0)){
					this.$message('循环金额不能为空');  //循环金额不能为空
					return;
				}
				if(!(parseInt(this.tempUp.circleDiscountAmt)>=0)){
					this.$message('循环减免金额不能为空');
					return;
				}
			}
			if(this.tempUp.marketingRule == '1'){
				if(!(parseInt(this.tempUp.accumAmtLev1)>=0)){
					this.$message('阶梯金额1不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.accumDiscountAmtLev1)>=0)){
					this.$message('阶梯减免金额1不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.accumAmtLev2)>=0)){
					this.$message('阶梯金额2不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.accumDiscountAmtLev2)>=0)){
					this.$message('阶梯减免金额2不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.accumAmtLev3)>=0)){
					this.$message('阶梯金额3不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.accumDiscountAmtLev3)>=0)){
					this.$message('阶梯减免金额3不能为空');
					return;
				}
			}
			if(this.tempUp.marketingRule == '2'){
				if(!(parseInt(this.tempUp.randomAmt)>=0)){
					this.$message('随机金额不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.randomDiscountAmtCeiling)>=0)){
					this.$message('随机减免金额上限不能为空');
					return;
				}
				if(!(parseInt(this.tempUp.randomDiscountAmtFloor)>=0)){
					this.$message('随机减免金额下限不能为空');
					return;
				}
			}
			this.post('/beta/betaService/AUS.PM.04.0103', this.tempUp, (res) => {
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
        },
        
      	//场景识别详细信息显示弹框
      	handleSceneDate(row){
	      	this.tempScene = Object.assign({}, row)
            this.tempScene.currencyCode = row.marketingCurrencyCode
            this.getSceneList()
            this.getSceneBtnAuth()
            this.dialogFormVisibleScene= true
           	this.$nextTick(() => {
                this.$refs['dataFormScene'].clearValidate()
            })
      	},
      	getSceneBtnAuth() {
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
                        if (this.eventList.includes('AUS.PM.04.0002') != -1) { // 查询
                            this.twoBtnSelFlag = true
                        } else {
                            this.twoBtnSelFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0001') != -1) { // 新增
                            this.twoBtnAddFlag = true
                        } else {
                            this.twoBtnAddFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0003') != -1) { // 维护
                            this.twoBtnUpdFlag = true
                            this.twoBtnDelFlag = true
                        } else {
                            this.twoBtnUpdFlag = false
                            this.twoBtnDelFlag = false
                        }
                        
                    }
                }
            })
        },
      	
      	
      	
      	getSceneList(){
      		this.dialogFormVisibleScene = true
      		this.sceneListLoading = true
      		let params = {
      			authDataSynFlag: '1',
      			pageNum: this.scenePage.pageNum,
      			pageSize: this.scenePage.pageSize,
      			marketingSceneCode: this.tempScene.marketingSceneCode,
      			isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_countries'],//查找数据字典所需参数
				transDict : ['transLocation'],//翻译前后key
      		}
      		this.post('/beta/betaService/AUS.PM.04.0002', params, (res) => {
      			this.sceneListLoading = false
                 if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                       	this.sceneList = res.returnData.rows
                        this.sceneTableTotal =  res.returnData.totalCount
                       
                    }else{
                    	this.sceneList = []
                        this.sceneTableTotal =  0
                    }
                }
               
            }, (err) => {
            	this.sceneList = []
                this.sceneTableTotal =  0
                this.sceneListLoading = false
            })
      	},
      	//显示营销清单弹框
      	addSceneInfo(row){
        	this.dialogFormVisibleSceneMarketing = true
        	this.marketingDetail = Object.assign({}, row)
        	this.$nextTick(() => {
                this.$refs['dataFormMarketing'].clearValidate()
            })
        },
        subSceneDate(){
        	this.marketingDetail.operationModeiden=this.marketingDetail.operationMode
        	this.post('/beta/betaService/AUS.PM.04.0001', this.marketingDetail, (res) => {
                if (res.returnCode == '000000') {
                     this.dialogFormVisibleUp = false
                    this.$notify({
                    title: 'Success',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getSceneList()
                    this.dialogFormVisibleSceneMarketing = false
                }
            })
        },
        //营销清单详情
        handleDetailed(row){
        	this.dialogFormVisibleDetailed = true
        	this.detailedInfo = Object.assign({}, row)
        	this.$nextTick(() => {
                this.$refs['dataFormDetailed'].clearValidate()
            })
        },
        //显示营销清单修改弹框
      	upDetailedInfo(row){
        	this.dialogFormVisibleDetailedUp = true
        	this.detailedInfoUp = Object.assign({}, row)
        	this.$nextTick(() => {
                this.$refs['dataFormDetailedUp'].clearValidate()
            })
        },
        subDetailedDate(){
        	this.detailedInfoUp.operationModeiden=this.detailedInfoUp.operationMode
        	this.post('/beta/betaService/AUS.PM.04.0003', this.detailedInfoUp, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleUp = false
                    this.$notify({
                    title: 'Success',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getSceneList()
                    this.dialogFormVisibleDetailedUp = false
                    this.detailedInfoUp = {}
                }
            })
        },
         //显示营销清单删除弹框
      	delDetailedInfo(row){
        	this.dialogFormVisibleDetailedDel = true
        	this.detailedInfoDel = Object.assign({}, row)
        	this.$nextTick(() => {
                this.$refs['dataFormDetailedDel'].clearValidate()
            })
        },
        subDetailedDateDel(){
        	this.detailedInfoDel.authDataSynFlag = '1'
        	this.detailedInfoDel.operationModeiden=this.detailedInfoDel.operationMode
        	this.post('/beta/betaService/AUS.PM.04.0003', this.detailedInfoDel, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleUp = false
                    this.$notify({
                    title: 'Success',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getSceneList()
                    this.dialogFormVisibleDetailedDel = false
                }
            })
        },
    }
}   
</script>
<style>
.w-input{
    width: 70px !important;
    display: inline-block;
    padding-right: 5px;
}
</style>
