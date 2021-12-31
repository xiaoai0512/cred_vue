<!-- 交易管控 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryForm.operationMode" class="wd200" 
                    @change="operationModeChange($event)">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
           
            <el-form-item class="cl_td" label="差异化类型" prop="differentType" >
                <el-select v-model="queryForm.differentType" class="wd200" @change="differentTypeChange()">
                    <el-option
                        v-for="(item, index ) in differentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="风险等级" prop="riskLevel" v-if='queryForm.differentType=="1"'>
                <el-input v-model="queryForm.differentCode" class="wd200" type="text"  minlength='2' maxlength='2'/>
            </el-form-item>
            <el-form-item class="cl_td" label="证件类型" prop="idType" v-if="queryForm.differentType=='2'">
                <el-select v-model="queryForm.idType" class="wd200">
                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber" v-if="queryForm.differentType=='2'"> 
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" v-if="queryForm.differentType=='3'">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
             <el-form-item class="cl_td" label="产品维度" prop="productObjectCode" v-if="queryForm.differentType=='4'">
             								
             	<el-select v-model="queryForm.productObjectCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in productDimensionAddOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.productObjectCode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneType" v-if="showCode">
                <el-select v-model="queryForm.contrlSceneType" class="wd200">
                <el-option
                    v-for="(item, index ) in controlSceneCodeRelOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center" >
                <el-button v-if="eyer" size="medium" icon="el-icon-arrow-down" type="primary" @click="showControlBtn()" >管控场景码</el-button>
                <el-button v-else size="medium" icon="el-icon-arrow-up" type="primary"  @click="elseBtn">管控场景码</el-button>
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-if="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()" v-if="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showListA">
            <el-table v-loading = "listLoadingA" :data="tableListA" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="contrlSceneCode" label="管控场景代码" align="center"/>
                <el-table-column prop="differentTypeDesc" label="差异化类型" align="center"/>
                <el-table-column prop="differentCode" label="差异化代码" align="center"/>
                <el-table-column prop="independentFlagDesc" label="缺省标识" align="center"/>
                <el-table-column prop="contrlSceneDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" width="400px">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-plus" type="primary" @click="copyListCon(scope.row,'copyItem')"  v-if="addBtnFlag">差异化</el-button>
                       	<span v-if="scope.row.independentFlag == '0'" style="margin-left: 10px;">
                       		<el-button size="mini" icon="el-icon-arrow-right" type="primary" @click="authTradInfo(scope.row)" v-if="selTwoBtnFlag">场景识别</el-button>
                    	</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalA>0" class="page-name" :total="tableTotalA" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        </div>
        <div v-if="showListB">
            <el-table v-loading = "listLoadingB" :data="tableListB" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="contrlSceneCode" label="管控场景代码" align="center"/>
                 <el-table-column prop="differentTypeDesc" label="差异化类型" align="center"/>
                <el-table-column prop="differentCode" label="差异化代码" align="center"/>
                <el-table-column prop="independentFlagDesc" label="缺省标识" align="center"/>
                <el-table-column prop="contrlSceneDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" width="400px">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-plus" type="primary" @click="copyListCon(scope.row,'copyItem')" v-if="addBtnFlag">差异化</el-button>
                        <span v-if="scope.row.independentFlag == '0'" style="margin-left: 10px;">
                       	 	<el-button size="mini" icon="el-icon-arrow-right" type="primary" @click="authTradInfo(scope.row)" v-if="selTwoBtnFlag">场景识别</el-button>
                    	</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalB>0" class="page-name" :total="tableTotalB" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="授权响应码新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="tempAdd" :rules="rulesAdd" :model="tempAdd" >
                <div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200"  @change="addOperationModeChange($event)">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode" 
                    :rules="[ { required: true, message: '管控场景代码不能为空'}]">
                    <el-input v-model="tempAdd.contrlSceneCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType"> 
                   <el-input v-model="tempAdd.differentType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="缺省标识" prop="independentFlag" 
                    :rules="[ { required: true, message: '缺省标识不能为空'}]">
                    <el-select v-model="tempAdd.independentFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempAdd.contrlSceneDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ">交易管控信息</div>
                <el-form-item class="cl_td" label="溢缴款管控 " prop="overpayContrlFlag" 
                    :rules="[ { required: true, message: '溢缴款管控不能为空'}]">
                    <el-select v-model="tempAdd.overpayContrlFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in overpayContrlFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="关联管控标识 " prop="contRelFlag" 
                    :rules="[ { required: true, message: '关联管控标识不能为空'}]">
                    <el-select v-model="tempAdd.contRelFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in contRelFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="关联管控管控场景" prop="controlSceneCodeRel" v-if="tempAdd.contRelFlag=='Y'">
                    <el-select v-model="tempAdd.controlSceneCodeRel" class="wd200" 
                        :rules="[ { required: true, message: '关联管控管控场景不能为空'}]">
                    <el-option
                        v-for="(item, index ) in contrlSceneCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许差异化类型 " prop="differentFlag" 
                    :rules="[ { required: true, message: '允许差异化类型不能为空'}]">
                    <el-select v-model="tempAdd.differentFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in differentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <!--差异化类型限制-->
                <div class="col_tr" v-if="tempAdd.differentFlag=='Y'">
	                <div class="col2 text_right">差异化类型限制：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="checkedCitiesDifferent" @change="handleCheckedDifferentChange">
						    	<el-checkbox v-for="cityDiff in differentFlagType" :label="cityDiff.id" :key="cityDiff.id">{{cityDiff.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">正负面清单信息</div>
                <el-form-item class="cl_td" label="检查标志" prop="pnListCheckFlag" >
                    <el-select v-model="tempAdd.pnListCheckFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in pnListCheckFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<div class="col_tr" v-if="tempAdd.pnListCheckFlag=='N' || tempAdd.pnListCheckFlag=='P'">
	                <div class="col2 text_right">清单类型：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="excpListType" @change="handleCheckedCitiesChange">
						    	<el-checkbox v-for="city in listCheckType" :label="city.id" :key="city.id">{{city.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">交易限制信息</div>
                <el-form-item class="cl_td" label="层级限制" prop="transLimitLev">
                    <el-select v-model="tempAdd.transLimitLev" class="wd200" @change="changeTransLimitLev($event)">
                    <el-option
                        v-for="(item, index ) in transLimitLevOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="限制币种 " prop="transLimitCurrCode" v-if="tempAdd.transLimitLev!='N'">
                    <el-select v-model="tempAdd.transLimitCurrCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in transLimitCurrCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--客户层-->
       	 	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempAdd.transLimitLev=='C' || tempAdd.transLimitLev=='B') && (tempAdd.transLimitCurrCode=='0' || tempAdd.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">客户层交易限制</div>
                	<div v-for="(addItemC,index) in tempAddC"  :key="addItemC.id">
        				<div v-if="tempAdd.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCodeC">
	                            <el-select v-model="addItemC.currencyCodeC" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOne"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempAdd.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCodeC">
	                            <el-select v-model="addItemC.currencyCodeC" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwo"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlagC">
	                        <el-select v-model="addItemC.mandatoryInspectionFlagC" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerAddInfo(addItemC,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delAddItemC(addItemC)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showCustomerBtn">
                		<div  slot="footer" class="dialog-footer text_right" v-if="tempAdd.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="customerListAdd()">新增</el-button>
	                   	</div>
                   	</div>
               	</div>
            </el-form>
           <!--媒阶层-->
           	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempAdd.transLimitLev=='M' || tempAdd.transLimitLev=='B') && (tempAdd.transLimitCurrCode=='0' || tempAdd.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">媒介层交易限制</div>
                	<div v-for="(addItemM,index) in tempAddM"  :key="addItemM.id">
        				<div v-if="tempAdd.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCodeM">
	                            <el-select v-model="addItemM.currencyCodeM" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempAdd.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCodeM">
	                            <el-select v-model="addItemM.currencyCodeM" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlagM">
	                        <el-select v-model="addItemM.mandatoryInspectionFlagM" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="exceTypeAddInfo(addItemM,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delAddItemM(addItemM)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showMediumBtn">
	                    <div  slot="footer" class="dialog-footer text_right" v-if="tempAdd.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="mediumListAdd()">新增</el-button>
	                   	</div>
	                </div>
           		</div>
            </el-form>
            <!--产品层-->
            <el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempAdd.transLimitLev=='P') && (tempAdd.transLimitCurrCode=='0' || tempAdd.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">产品层交易限制</div>
                	<div v-for="(addItemP,index) in tempAddP"  :key="addItemP.id">
        				<div v-if="tempAdd.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCodeC">
	                            <el-select v-model="addItemP.currencyCodeC" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempAdd.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCodeC">
	                            <el-select v-model="addItemP.currencyCodeC" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlagC">
	                        <el-select v-model="addItemP.mandatoryInspectionFlagC" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerAddInfo(addItemP,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delAddItemP(addItemP)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showMediumBtn">
	                    <div  slot="footer" class="dialog-footer text_right" v-if="tempAdd.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="productListAdd()">新增</el-button>
	                   	</div>
	                </div>
           		</div>
            </el-form>
	       	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeAddPopup()">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!--限制详情-->
        <el-dialog :title="titleName" :visible.sync="dialogFormVisibleConlimitSelDetail" width="65%">
            <div class="mainname titleInfo">基本信息</div>
            <el-form ref="conlimitSelRef" :data="limitDetailAdd" :rules="conlimitSelRules" border stripe style="width: 100%">
                <el-form-item prop="organNo" label="限制层级" class="cl_td bnone ">
                    <el-input v-model="limitDetailAdd.levelFlagInfo"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种 " prop="currencyCodeInfo" >
                        <el-select v-model="limitDetailAdd.currencyCodeInfo" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in currencyCodeInfoOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                        </el-select>
                    </el-form-item>
                <el-form-item  prop="transLimitCode" label="管控场景代码" class="cl_td bnone">
                    <el-input v-model="limitDetailAdd.transLimitCode"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="差异化类型" class="cl_td bnone">
                    <el-input v-model="limitDetailAdd.differentTypeCusInfo"  class="wd200" readonly/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">限额上限</div>
                <el-form-item class="cl_td" label="单笔限额检查 " prop="limitSingleTransFlag" >
                    <el-select v-model="limitDetailAdd.limitSingleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray1"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="limitSingleTrans" label="单笔限制金额" class="cl_td">
                    <el-input v-model="limitDetailAdd.limitSingleTrans" v-if="limitDetailAdd.limitSingleTransFlag=='Y'" class="wd200"/>
                </el-form-item> 
                
                <el-form-item class="cl_td" label="日限额检查 " prop="limitDayTransFlag" >
                    <el-select v-model="limitDetailAdd.limitDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray2"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitDayTrans" label="日限制金额" class="cl_td">
                    <el-input v-model="limitDetailAdd.limitDayTrans" v-if="limitDetailAdd.limitDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限额检查 " prop="limitCycleTransFlag" >
                    <el-select v-model="limitDetailAdd.limitCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray3"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" prop="limitCycleTrans" label="CYCLE限制金额">
                    <el-input v-model="limitDetailAdd.limitCycleTrans" v-if="limitDetailAdd.limitCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag" >
                    <el-select v-model="limitDetailAdd.limitMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray4"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitMonthTrans" label="月限制金额" >
                    <el-input v-model="limitDetailAdd.limitMonthTrans" v-if="limitDetailAdd.limitMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限制检查" prop="limitHalfYearTransFlag" >
                    <el-select v-model="limitDetailAdd.limitHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray5"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitHalfYearTrans" label="半年限额金额">
                    <el-input v-model="limitDetailAdd.limitHalfYearTrans" v-if="limitDetailAdd.limitHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限制检查" prop="limitYearTransFlag" >
                    <el-select v-model="limitDetailAdd.limitYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray6"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitYearTrans"  label="全年限制金额" class="cl_td">
                    <el-input v-model="limitDetailAdd.limitYearTrans" v-if="limitDetailAdd.limitYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限额检查" prop="limitLifeCycleTransFlag" >
                    <el-select v-model="limitDetailAdd.limitLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray7"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitLifeCycleTrans"  label="全生命周期限制金额" class="cl_td">
                    <el-input v-model="limitDetailAdd.limitLifeCycleTrans" v-if="limitDetailAdd.limitLifeCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">限次上限</div>
                
                <el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag" >
                    <el-select v-model="limitDetailAdd.numberDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray8"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberDayTrans"  label="日限制笔数" class="cl_td">
                    <el-input v-model="limitDetailAdd.numberDayTrans" v-if="limitDetailAdd.numberDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限次检查" prop="numberCycleTransFlag" >
                    <el-select v-model="limitDetailAdd.numberCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray9"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberCycleTrans" label="CYCLE限制笔数 " class="cl_td">
                    <el-input v-model="limitDetailAdd.numberCycleTrans"  v-if="limitDetailAdd.numberCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限次检查" prop="numberMonthTransFlag" >
                    <el-select v-model="limitDetailAdd.numberMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray10"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberMonthTrans"  label="月限制笔数" class="cl_td">
                    <el-input v-model="limitDetailAdd.numberMonthTrans" v-if="limitDetailAdd.numberMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag">
                    <el-select v-model="limitDetailAdd.numberHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray11"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberHalfYearTrans"  label="半年限制笔数" class="cl_td">
                    <el-input v-model="limitDetailAdd.numberHalfYearTrans" v-if="limitDetailAdd.numberHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限次检查 " prop="numberYearTrans" >
                    <el-select v-model="limitDetailAdd.numberYearTrans" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray12"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="全年限制笔数" class="cl_td">
                    <el-input v-model="limitDetailAdd.differentTypeCusInfo"   v-if="limitDetailAdd.numberYearTrans=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限次检查" prop="numberLifeCycleTransFlag" >
                    <el-select v-model="limitDetailAdd.numberLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray13"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberLifeCycleTrans" label="全生命周期限制笔数" class="cl_td">
                    <el-input v-if="limitDetailAdd.numberLifeCycleTransFlag=='Y'" v-model="limitDetailAdd.numberLifeCycleTrans"  class="wd200"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addLimitData()">保存</el-button>
                <el-button type="primary" @click="closeDetail()">取消</el-button>
            </div>
        </el-dialog> 
        <!--- 修改--->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
            	<div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempUp.operationMode" class="wd200"  
                    	@change="addOperationModeChange($event)" disabled   readonly>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" readonly/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode" 
                    :rules="[ { required: true, message: '管控场景代码不能为空'}]">
                    <el-input v-model="tempUp.contrlSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType"> 
                	<el-select v-model="tempUp.differentType" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in differentTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType"> 
                	<el-select v-model="tempUp.differentType" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in differentTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="缺省标识" prop="independentFlag" 
                    :rules="[ { required: true, message: '缺省标识不能为空'}]">
                    <el-select v-model="tempUp.independentFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempUp.contrlSceneDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ">交易管控信息</div>
                <el-form-item class="cl_td" label="溢缴款管控 " prop="overpayContrlFlag" 
                    :rules="[ { required: true, message: '溢缴款管控不能为空'}]">
                    <el-select v-model="tempUp.overpayContrlFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in overpayContrlFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="关联管控标识 " prop="contRelFlag" 
                    :rules="[ { required: true, message: '关联管控标识不能为空'}]">
                    <el-select v-model="tempUp.contRelFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in contRelFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="关联管控管控场景" prop="controlSceneCodeRel" v-if="tempUp.contRelFlag=='Y'">
                    <el-select v-model="tempUp.controlSceneCodeRel" class="wd200" 
                        :rules="[ { required: true, message: '关联管控管控场景不能为空'}]">
                    <el-option
                        v-for="(item, index ) in contrlSceneCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许差异化类型 " prop="differentFlag" 
                    :rules="[ { required: true, message: '允许差异化类型不能为空'}]">
                    <el-select v-model="tempUp.differentFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in differentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <!--差异化类型限制-->
                <div class="col_tr" v-if="tempUp.differentFlag=='Y'">
	                <div class="col2 text_right">差异化类型限制：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="upCheckedCitiesDifferent" @change="upHandleCheckedDifferentChange">
						    	<el-checkbox v-for="upCityDiff in upDifferentFlagType" :label="upCityDiff.id" :key="upCityDiff.id">{{upCityDiff.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">正负面清单信息</div>
                <el-form-item class="cl_td" label="检查标志" prop="pnListCheckFlag" >
                    <el-select v-model="tempUp.pnListCheckFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in pnListCheckFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<div class="col_tr" v-if="tempUp.pnListCheckFlag=='N' || tempUp.pnListCheckFlag=='P'">
	                <div class="col2 text_right">层级限制：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="UpCheckedCities" @change="upHandleCheckedCitiesChange">
						    	<el-checkbox v-for="upCity in upListCheckType" :label="upCity.id" :key="upCity.id">{{upCity.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">交易限制信息</div>
                <el-form-item class="cl_td" label="层级限制" prop="transLimitLev">
                    <el-select v-model="tempUp.transLimitLev" class="wd200" @change="changeTransLimitLev($event)">
                    <el-option
                        v-for="(item, index ) in transLimitLevOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="限制币种 " prop="transLimitCurrCode" v-if="tempUp.transLimitLev!='N'">
                    <el-select v-model="tempUp.transLimitCurrCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in transLimitCurrCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--客户层-->
       	 	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempUp.transLimitLev=='C' || tempUp.transLimitLev=='B') && (tempUp.transLimitCurrCode=='0' || tempUp.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">客户层交易限制</div>
                	<div v-for="(upItemC,index) in tempUpC"  :key="upItemC.id">
        				<div v-if="tempUp.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="upItemC.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOne"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempUp.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="upItemC.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwo"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="upItemC.mandatoryInspectionFlag" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerUpInfo(upItemC,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delupItemC(upItemC)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showCustomerBtn">
                		<div  slot="footer" class="dialog-footer text_right" v-if="tempUp.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="customerListUp()">新增</el-button>
	                   	</div>
                   	</div>
               	</div>
            </el-form>
           <!--媒阶层-->
           	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempUp.transLimitLev=='M' || tempUp.transLimitLev=='B') && (tempUp.transLimitCurrCode=='0' || tempUp.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">媒介层交易限制</div>
                	<div v-for="(upItemM,index) in tempUpM"  :key="upItemM.id">
        				<div v-if="tempUp.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="upItemM.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempUp.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="upItemM.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="upItemM.mandatoryInspectionFlag" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="exceTypeUpInfo(upItemM,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delupItemM(upItemM)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showMediumBtn">
	                    <div  slot="footer" class="dialog-footer text_right" v-if="tempUp.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="mediumListUp()">新增</el-button>
	                   	</div>
	                </div>
           		</div>
            </el-form>
            <!--产品层-->
            <el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempUp.transLimitLev=='P') && (tempUp.transLimitCurrCode=='0' || tempUp.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">产品层交易限制</div>
                	<div v-for="(upItemP,index) in tempUpP"  :key="upItemP.id">
        				<div v-if="tempUp.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="upItemP.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempUp.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="upItemP.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="upItemP.mandatoryInspectionFlag" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerUpInfo(upItemP,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delupItemP(upItemP)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showMediumBtn">
	                    <div  slot="footer" class="dialog-footer text_right" v-if="tempUp.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="productListUp()">新增</el-button>
	                   	</div>
	                </div>
           		</div>
            </el-form>   
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="subUpData()">确认</el-button>
            </div>
        </el-dialog> 
         <!--差异化限制详情-->
        <el-dialog :title="titleName" :visible.sync="dialogFormVisibleUpLimitSelDetail" width="65%">
            <div class="mainname titleInfo">基本信息</div>
            <el-form ref="limitUpRef" :data="limitDetailUp" :rules="limitUpRules" border stripe style="width: 100%">
                <el-form-item prop="organNo" label="限制层级" class="cl_td bnone ">
                    <el-input v-model="limitDetailUp.levelFlagInfo"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种 " prop="currencyCodeInfo" >
                        <el-select v-model="limitDetailUp.currencyCodeInfo" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in currencyCodeInfoOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                        </el-select>
                    </el-form-item>
                <el-form-item  prop="transLimitCode" label="管控场景代码" class="cl_td bnone">
                    <el-input v-model="limitDetailUp.transLimitCode"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="差异化类型" class="cl_td bnone">
                    <el-input v-model="limitDetailUp.differentTypeCusInfo"  class="wd200" readonly/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">限额上限</div>
                <el-form-item class="cl_td" label="单笔限额检查 " prop="limitSingleTransFlag" >
                    <el-select v-model="limitDetailUp.limitSingleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray1"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="limitSingleTrans" label="单笔限制金额" class="cl_td">
                    <el-input v-model="limitDetailUp.limitSingleTrans" v-if="limitDetailUp.limitSingleTransFlag=='Y'" class="wd200"/>
                </el-form-item> 
                
                <el-form-item class="cl_td" label="日限额检查 " prop="limitDayTransFlag" >
                    <el-select v-model="limitDetailUp.limitDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray2"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitDayTrans" label="日限制金额" class="cl_td">
                    <el-input v-model="limitDetailUp.limitDayTrans" v-if="limitDetailUp.limitDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限额检查 " prop="limitCycleTransFlag" >
                    <el-select v-model="limitDetailUp.limitCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray3"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" prop="limitCycleTrans" label="CYCLE限制金额">
                    <el-input v-model="limitDetailUp.limitCycleTrans" v-if="limitDetailUp.limitCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag" >
                    <el-select v-model="limitDetailUp.limitMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray4"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitMonthTrans" label="月限制金额" >
                    <el-input v-model="limitDetailUp.limitMonthTrans" v-if="limitDetailUp.limitMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限制检查" prop="limitHalfYearTransFlag" >
                    <el-select v-model="limitDetailUp.limitHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray5"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitHalfYearTrans" label="半年限额金额">
                    <el-input v-model="limitDetailUp.limitHalfYearTrans" v-if="limitDetailUp.limitHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限制检查" prop="limitYearTransFlag" >
                    <el-select v-model="limitDetailUp.limitYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray6"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitYearTrans"  label="全年限制金额" class="cl_td">
                    <el-input v-model="limitDetailUp.limitYearTrans" v-if="limitDetailUp.limitYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限额检查" prop="limitLifeCycleTransFlag" >
                    <el-select v-model="limitDetailUp.limitLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray7"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitLifeCycleTrans"  label="全生命周期限制金额" class="cl_td">
                    <el-input v-model="limitDetailUp.limitLifeCycleTrans" v-if="limitDetailUp.limitLifeCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">限次上限</div>
                
                <el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag" >
                    <el-select v-model="limitDetailUp.numberDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray8"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberDayTrans"  label="日限制笔数" class="cl_td">
                    <el-input v-model="limitDetailUp.numberDayTrans" v-if="limitDetailUp.numberDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限次检查" prop="numberCycleTransFlag" >
                    <el-select v-model="limitDetailUp.numberCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray9"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberCycleTrans" label="CYCLE限制笔数 " class="cl_td">
                    <el-input v-model="limitDetailUp.numberCycleTrans"  v-if="limitDetailUp.numberCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限次检查" prop="numberMonthTransFlag" >
                    <el-select v-model="limitDetailUp.numberMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray10"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberMonthTrans"  label="月限制笔数" class="cl_td">
                    <el-input v-model="limitDetailUp.numberMonthTrans" v-if="limitDetailUp.numberMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag">
                    <el-select v-model="limitDetailUp.numberHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray11"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberHalfYearTrans"  label="半年限制笔数" class="cl_td">
                    <el-input v-model="limitDetailUp.numberHalfYearTrans" v-if="limitDetailUp.numberHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限次检查 " prop="numberYearTrans" >
                    <el-select v-model="limitDetailUp.numberYearTrans" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray12"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="全年限制笔数" class="cl_td">
                    <el-input v-model="limitDetailUp.differentTypeCusInfo"   v-if="limitDetailUp.numberYearTrans=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限次检查" prop="numberLifeCycleTransFlag" >
                    <el-select v-model="limitDetailUp.numberLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray13"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberLifeCycleTrans" label="全生命周期限制笔数" class="cl_td">
                    <el-input v-if="limitDetailUp.numberLifeCycleTransFlag=='Y'" v-model="limitDetailUp.numberLifeCycleTrans"  class="wd200"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="upLimitData()">保存</el-button>
                <el-button type="primary" @click="dialogFormVisibleUpLimitSelDetail = false">取消</el-button>
            </div>
        </el-dialog>
       	<!--差异化-->
        <el-dialog title="复制信息" :visible.sync="dialogFormVisibleCopy" width="65%">
            <el-form ref="dataFormCopy" :rules="rulesCopy" :model="tempCopy" >
            	<div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempCopy.operationMode" class="wd200"  
                    	@change="addOperationModeChange($event)" disabled   readonly>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" readonly/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode" 
                    :rules="[ { required: true, message: '管控场景代码不能为空'}]">
                    <el-input v-model="tempCopy.contrlSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType"> 
                	<el-select v-model="tempCopy.differentType" class="wd200" @change="differentTypeChange($event)">
	                    <el-option
	                        v-for="(item, index ) in differentTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
	             <el-form-item v-if="tempCopy.differentType=='1'" prop="differentTypeCusInfo" label="风险等级" class="cl_td bnone">
                    <el-input v-model="tempCopy.differentTypeCusInfo"  class="wd200" readonly/>
                </el-form-item>
                <div v-if="tempCopy.differentType=='2'">
	                <el-form-item class="cl_td" label="证件类型" prop="idType">
		                <el-select v-model="limitDetailCopy.idType" class="wd200">
		                    <el-option v-for="(item, index) in idTypeList" 
		                    	:key="index" 
		                    	:label="item.detailDesc" 
		                    	:value="item.codes" />
		                </el-select>
		            </el-form-item>
		           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
		                <el-input v-model="tempCopy.idNumber" class="wd200" type="text" />
		            </el-form-item>
                </div>
                <el-form-item v-if="tempCopy.differentType=='3'" class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	                <el-input v-model="tempCopy.externalIdentificationNo" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" v-if="tempCopy.differentType=='4'" label="产品维度" prop="projectCode">
	                <el-select v-model="tempCopy.projectCode" class="wd200">
	                    <el-option v-for="(item, index) in productDimensionAddOptions" 
	                    	:key="index" 
	                    	:label="item.label"
                        	:value="item.productObjectCode"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempCopy.contrlSceneDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ">交易管控信息</div>
                <div v-if="tempCopy.differentType=='2' || tempCopy.differentType=='3'">
	                <el-form-item class="cl_td" label="起始时间" prop="startDate">
		                <el-date-picker
		                    v-model="tempCopy.startDate"
		                    class="wd200"
		                    type="date"
		                    placeholder="生效日期"
		                    format="yyyy 年 MM 月 dd 日"
		                    :picker-options="pickerOptionsStartCopy"
		                    :clearable="true"
		                    @change="changeStartCopy"/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="结束时间" prop="endDate">
		                <el-date-picker
		                    v-model="tempCopy.endDate"
		                    class="wd200"
		                    type="date"
		                    placeholder="失效日期"
		                    format="yyyy 年 MM 月 dd 日"
		                    value-format="yyyyMMdd"
		             	 	:picker-options="pickerOptionsEndCopy"
		                    :clearable="true"
		                    @change="changeEndCopy"/>
		            </el-form-item>
	                
	                
	            	<el-form-item class="cl_td" label="起始时间" prop="startDate">
					  	<el-time-picker
					  		class="wd200"
						    v-model="tempCopy.startTime"
						   	placeholder="任意时间点">
					  	</el-time-picker>
				  	</el-form-item>
					<el-form-item class="cl_td" label="结束时间" prop="endDate">  	
					  	<el-time-picker
					  		class="wd200"
						    arrow-control
						    v-model="tempCopy.endTime"
						    placeholder="任意时间点">
					  	</el-time-picker>
				  	</el-form-item>
				</div>
                <el-form-item class="cl_td" label="溢缴款管控 " prop="overpayContrlFlag" 
                    :rules="[ { required: true, message: '溢缴款管控不能为空'}]">
                    <el-select v-model="tempCopy.overpayContrlFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in overpayContrlFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">正负面清单信息</div>
               	<!--基本信息差异化为（0：无）时不显示-->
                <el-form-item class="cl_td" v-if="tempCopy.differentType!='0'" label="差异化标志" prop="listDifferentFlag" 
                    :rules="[ { required: true, message: '差异化标志不能为空'}]">
                    <el-select v-model="tempCopy.listDifferentFlag" class="wd200" @change="listDifferentFlagCopyChange($event)">
                    <el-option
                        v-for="(item, index ) in listDifferentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>  
                <div v-if="showCopyListCheck">
	                <el-form-item class="cl_td" v-if="showCopyPnListCheckFlag" label="检查标志" prop="pnListCheckFlag" >
	                    <el-select v-model="tempCopy.pnListCheckFlag" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in pnListCheckFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	               	<div class="col_tr" v-if="tempCopy.pnListCheckFlag!='B'">
		                <div class="col2 text_right">层级限制：</div>
		                <div class="wdper75 float_left">
			              	<template>
			              		<el-checkbox-group v-model="copyCheckedCities" @change="copyHandleCheckedCitiesChange">
							    	<el-checkbox v-for="copyCity in copyListCheckType" :label="copyCity.id" :key="copyCity.id">{{copyCity.label}}</el-checkbox>
							  	</el-checkbox-group>
							</template>
						</div>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">交易限制信息</div>
                <!--基本信息差异化为（0：无）时不显示-->
                <el-form-item v-if="tempCopy.differentType!='0'" class="cl_td" label="差异化标志" prop="transDifferentFlag" 
                    :rules="[ { required: true, message: '差异化标志不能为空'}]">
                    <el-select v-model="tempCopy.transDifferentFlag" class="wd200" @change="transDifferentFlagCopyChange($event)">
                    <el-option
                        v-for="(item, index ) in transDifferentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div v-if="showCopyHierarchica">
	                <el-form-item class="cl_td" v-if="showCopyTransLimitLev" label="层级限制" prop="transLimitLev">
	                    <el-select v-model="tempCopy.transLimitLev" class="wd200" @change="changeTransLimitLev($event)">
	                    <el-option
	                        v-for="(item, index ) in transLimitLevOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	                <el-form-item v-if="tempCopy.transLimitLev!='N'" class="cl_td" label="限制币种 " prop="transLimitCurrCode" >
	                    <el-select v-model="tempCopy.transLimitCurrCode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in transLimitCurrCodeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	            </div>
            </el-form>
            <!--客户层-->
       	 	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempCopy.transLimitLev=='C' || tempCopy.transLimitLev=='B') && (tempCopy.transLimitCurrCode=='0' || tempCopy.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">客户层交易限制</div>
                	<div v-for="(copyItemC,index) in tempCopyC"  >
        				<div v-if="tempCopy.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="copyItemC.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOne"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempCopy.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="copyItemC.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwo"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="copyItemC.mandatoryInspectionFlag" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerCopyInfo(copyItemC,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delCopyItemC(copyItemC)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showCustomerBtn">
                		<div  slot="footer" class="dialog-footer text_right" v-if="tempCopy.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="customerListCopy()">新增</el-button>
	                   	</div>
                   	</div>
               	</div>
            </el-form>
           <!--媒阶层-->
           	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempCopy.transLimitLev=='M' || tempCopy.transLimitLev=='B') && (tempCopy.transLimitCurrCode=='0' || tempCopy.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">媒介层交易限制</div>
                	<div v-for="(copyItemM,index) in tempCopyM"  >
        				<div v-if="tempCopy.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="copyItemM.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempCopy.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="copyItemM.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="copyItemM.mandatoryInspectionFlag" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="exceTypeCopyInfo(copyItemM,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delCopyItemM(copyItemM)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showMediumBtn">
	                    <div  slot="footer" class="dialog-footer text_right" v-if="tempCopy.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="mediumListCopy()">新增</el-button>
	                   	</div>
	                </div>
           		</div>
            </el-form>
            <!--产品层-->
            <el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempCopy.transLimitLev=='P') && (tempCopy.transLimitCurrCode=='0' || tempCopy.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">产品层交易限制</div>
                	<div v-for="(copyItemP,index) in tempCopyP" >
        				<div v-if="tempCopy.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="copyItemP.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempCopy.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="copyItemP.currencyCode" class="wd200">
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="copyItemP.mandatoryInspectionFlag" class="wd200">
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerCopyInfo(copyItemP,index)">限制详情</el-button>
	                        <el-button type="primary" @click="delCopyItemP(copyItemP)">删除</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	                <div v-if="showMediumBtn">
	                    <div  slot="footer" class="dialog-footer text_right" v-if="tempCopy.transLimitCurrCode=='1'">
	                        <el-button type="primary" @click="productListCopy()">新增</el-button>
	                   	</div>
	                </div>
           		</div>
            </el-form>   
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleCopy = false">取消</el-button>
                <el-button type="primary" @click="subCopyData()">确认</el-button>
            </div>
        </el-dialog> 
         <!--差异化限制详情-->
        <el-dialog :title="titleName" :visible.sync="dialogFormVisibleCopyLimitSelDetail" width="65%">
            <div class="mainname titleInfo">基本信息</div>
            <el-form ref="limitCopyRef" :data="limitDetailCopy" :rules="limitCopyRules" border stripe style="width: 100%">
                <el-form-item prop="organNo" label="限制层级" class="cl_td bnone ">
                    <el-input v-model="limitDetailCopy.levelFlagInfo"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种 " prop="currencyCodeInfo" >
                        <el-select v-model="limitDetailCopy.currencyCodeInfo" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in currencyCodeInfoOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                        </el-select>
                    </el-form-item>
                <el-form-item  prop="transLimitCode" label="管控场景代码" class="cl_td bnone">
                    <el-input v-model="limitDetailCopy.transLimitCode"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="差异化类型" class="cl_td bnone">
                    <el-input v-model="limitDetailCopy.differentTypeCusInfo"  class="wd200" readonly/>
                </el-form-item>
               	<div class=" clearboth"></div>
                <div class="mainname titleInfo">限额上限</div>
                <el-form-item class="cl_td" label="单笔限额检查 " prop="limitSingleTransFlag" >
                    <el-select v-model="limitDetailCopy.limitSingleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray1"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="limitSingleTrans" label="单笔限制金额" class="cl_td">
                    <el-input v-model="limitDetailCopy.limitSingleTrans" v-if="limitDetailCopy.limitSingleTransFlag=='Y'" class="wd200"/>
                </el-form-item> 
                
                <el-form-item class="cl_td" label="日限额检查 " prop="limitDayTransFlag" >
                    <el-select v-model="limitDetailCopy.limitDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray2"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitDayTrans" label="日限制金额" class="cl_td">
                    <el-input v-model="limitDetailCopy.limitDayTrans" v-if="limitDetailCopy.limitDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限额检查 " prop="limitCycleTransFlag" >
                    <el-select v-model="limitDetailCopy.limitCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray3"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" prop="limitCycleTrans" label="CYCLE限制金额">
                    <el-input v-model="limitDetailCopy.limitCycleTrans" v-if="limitDetailCopy.limitCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag" >
                    <el-select v-model="limitDetailCopy.limitMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray4"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitMonthTrans" label="月限制金额" >
                    <el-input v-model="limitDetailCopy.limitMonthTrans" v-if="limitDetailCopy.limitMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限制检查" prop="limitHalfYearTransFlag" >
                    <el-select v-model="limitDetailCopy.limitHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray5"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitHalfYearTrans" label="半年限额金额">
                    <el-input v-model="limitDetailCopy.limitHalfYearTrans" v-if="limitDetailCopy.limitHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限制检查" prop="limitYearTransFlag" >
                    <el-select v-model="limitDetailCopy.limitYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray6"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitYearTrans"  label="全年限制金额" class="cl_td">
                    <el-input v-model="limitDetailCopy.limitYearTrans" v-if="limitDetailCopy.limitYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限额检查" prop="limitLifeCycleTransFlag" >
                    <el-select v-model="limitDetailCopy.limitLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray7"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitLifeCycleTrans"  label="全生命周期限制金额" class="cl_td">
                    <el-input v-model="limitDetailCopy.limitLifeCycleTrans" v-if="limitDetailCopy.limitLifeCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">限次上限</div>
                
                <el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag" >
                    <el-select v-model="limitDetailCopy.numberDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray8"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberDayTrans"  label="日限制笔数" class="cl_td">
                    <el-input v-model="limitDetailCopy.numberDayTrans" v-if="limitDetailCopy.numberDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限次检查" prop="numberCycleTransFlag" >
                    <el-select v-model="limitDetailCopy.numberCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray9"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberCycleTrans" label="CYCLE限制笔数 " class="cl_td">
                    <el-input v-model="limitDetailCopy.numberCycleTrans"  v-if="limitDetailCopy.numberCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限次检查" prop="numberMonthTransFlag" >
                    <el-select v-model="limitDetailCopy.numberMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray10"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberMonthTrans"  label="月限制笔数" class="cl_td">
                    <el-input v-model="limitDetailCopy.numberMonthTrans" v-if="limitDetailCopy.numberMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag">
                    <el-select v-model="limitDetailCopy.numberHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray11"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberHalfYearTrans"  label="半年限制笔数" class="cl_td">
                    <el-input v-model="limitDetailCopy.numberHalfYearTrans" v-if="limitDetailCopy.numberHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限次检查 " prop="numberYearTrans" >
                    <el-select v-model="limitDetailCopy.numberYearTrans" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray12"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="全年限制笔数" class="cl_td">
                    <el-input v-model="limitDetailCopy.differentTypeCusInfo"   v-if="limitDetailCopy.numberYearTrans=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限次检查" prop="numberLifeCycleTransFlag" >
                    <el-select v-model="limitDetailCopy.numberLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray13"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberLifeCycleTrans" label="全生命周期限制笔数" class="cl_td">
                    <el-input v-if="limitDetailCopy.numberLifeCycleTransFlag=='Y'" v-model="limitDetailCopy.numberLifeCycleTrans"  class="wd200"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyLimitData()">保存</el-button>
                <el-button type="primary" @click="dialogFormVisibleCopyLimitSelDetail = false">取消</el-button>
            </div>
        </el-dialog>
        <!--场景识别-->
        <el-dialog title="场景识别信息" :visible.sync="dialogFormVisibleSce" width="65%">
            <el-form ref="dataFormSce" :rules="rulesSce" :model="tempSce" >
                
                <el-form-item class="cl_td" label="管控场景" prop="contrlSceneCode">
                    <el-input v-model="tempSce.contrlSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc">
                    <el-input v-model="tempSce.contrlSceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
               
            </el-form>
            <el-table  :data="tableSceList" v-loading="sceListLoading" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <<el-table-column prop="startDate" label="生效日期" align="center"/>
                <el-table-column prop="endDate" label="失效日期" align="center"/>
                <el-table-column prop="invalidFlagDesc" label="有效标识" align="center"/>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                    	<el-button size="mini" icon="el-icon-search" type="primary" @click="handleSceDetail(scope.row)">详情</el-button>
                    	<el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpSce(scope.row)">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleSceDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalSce>0" class="page-name" :total="tableTotalSce" :page.sync="scePage.pageNum" :limit.sync="scePage.pageSize" @pagination="getSceList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleSce = false">取消</el-button>
                <el-button type="primary" @click="sceLimitData()">确认</el-button>
            </div>
        </el-dialog> 
        <!--场景识别修改-->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUpSce" width="65%">
            <el-form ref="dataFormUpSce" :rules="rulesUpSce" :model="upSceInfo" >
               	<div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="modeName">
                    <el-input v-model="upSceInfo.modeName" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode">
                    <el-input v-model="upSceInfo.contrlSceneCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc"> 
                   <el-input v-model="upSceInfo.contrlSceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="无效标识" prop="invalidFlag" 
                    :rules="[ { required: true, message: '缺省标识不能为空'}]">
                    <el-select v-model="upSceInfo.invalidFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ">管控场景信息</div>
                <el-form-item class="cl_td" label="起始时间" prop="startDate">
	                <el-date-picker
	                    v-model="upSceInfo.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="生效日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    :picker-options="pickerOptionsStart"
	                    :clearable="true"
	                    @change="changeStart"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="结束时间" prop="endDate">
	                <el-date-picker
	                    v-model="upSceInfo.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="失效日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	             	 	:picker-options="pickerOptionsEnd"
	                    :clearable="true"
	                    @change="changeEnd"/>
	            </el-form-item>
                <el-form-item class="cl_td" label="交易地点 " prop="transLocation" 
                    :rules="[ { required: true, message: '溢缴款管控不能为空'}]">
                    <el-select v-model="upSceInfo.transLocation" class="wd200">
                    <el-option
                        v-for="(item, index ) in transLocationUpdateOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <!--卡组织标识-->
                <div class="clearboth"></div>
                <div  class="mainname titleInfo ">卡组织标识</div>
               	<div v-for="(card,index) in cardUpdateList" class="col_td" style="margin-bottom: 15px;">
	               	<el-form-item class="col3 col_w" label="卡组织渠道 " prop="cardAssociations">
	                    <el-select v-model="card.cardAssociations" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in cardAssociationsOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	                <div  slot="footer" class=" pull-right">
	                	<el-button type="primary" @click="deleCard(card)">删除</el-button>
	                </div>
                </div>
                <div v-if="showCardBtn">
                    <div  slot="footer" class="dialog-footer text_center">
                        <el-button type="primary" @click="cardTypeAdd()">新增</el-button>
                   	</div>
                </div>
	            <!--交易场景信息-->
                <div class="clearboth"></div>
                <div  class="mainname titleInfo ">交易场景信息</div>
                <div v-for="(trad,index) in tradUpdateList"  class="col_td" style="margin-bottom: 15px;">
	               	<el-form-item class="col3 col_w" label="交易场景 " prop="transScene">
	                    <el-select v-model="trad.transScene" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in transSceneOptions"
	                        :key="index"
	                        :label="item.label"
	                        :value="item.value"/>
	                    </el-select>
	                </el-form-item>
	                <div  slot="footer" class="pull-right">
                		<el-button type="primary" @click="deleTrad(trad)">删除</el-button>
                    </div>
             	</div>
             	<div v-if="showTradBtn">
                    <div  slot="footer" class="dialog-footer text_center">
                        <el-button type="primary" @click="tradTypeAdd()">新增</el-button>
                   	</div>
                </div>
	            <!--例外清单信息-->
                <div class="clearboth"></div>
                <div  class="mainname titleInfo ">例外清单信息</div>
                <el-form-item class="cl_td" label="清单检查标志 " prop="excpListFlag">
                    <el-select v-model="upSceInfo.excpListFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in excpListFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
               	<div class="col_tr" v-if="upSceInfo.excpListFlag =='Y'">
	                <div class="col2 text_right">清单类型：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="sceCheckedCities" @change="handleCheckedCitiesChange">
						    	<el-checkbox v-for="sceCity in sceCheckedCitiesType" :label="sceCity.id" :key="sceCity.id">{{sceCity.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
	            <div  class="mainname titleInfo">管控清单检查标志</div>
                <el-form-item class="cl_td" label="管控清单检查标志 " prop="contListFlag">
                    <el-select v-model="upSceInfo.contListFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in contListFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<!--差异化类型限制-->
               	<div class="clearboth"></div>
                <div class="col_tr" v-if="upSceInfo.contListFlag=='Y'">
	                <div class="col2 text_right">清单类型：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="sceExcpListType" @change="handleExcpListTypeChange">
						    	<el-checkbox v-for="cityList in listCheckType" :label="cityList.id" :key="cityList.id">{{cityList.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" dialogFormVisibleUpSce = false">取消</el-button>
                <el-button type="primary" @click="subUpSceData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!--场景识别详情-->
        <el-dialog :title="titleName" :visible.sync="dialogFormVisibleSceDetail" width="65%">
            <el-form ref="dataFormSceDetail" :rules="rulesSceDetail" :model="sceDetail" >
               	<div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="modeName">
                    <el-input v-model="sceDetail.modeName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode">
                    <el-input v-model="sceDetail.contrlSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc"> 
                   <el-input v-model="sceDetail.contrlSceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="无效标识" prop="invalidFlag" 
                    :rules="[ { required: true, message: '缺省标识不能为空'}]">
                    <el-select v-model="sceDetail.invalidFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ">管控场景信息</div>
                <el-form-item class="cl_td" label="起始时间" prop="startDate">
	                <el-date-picker
	                    v-model="sceDetail.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="生效日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    :picker-options="pickerOptionsStart"
	                    :clearable="true"
	                    @change="changeStart" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="结束时间" prop="endDate">
	                <el-date-picker
	                    v-model="sceDetail.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="失效日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	             	 	:picker-options="pickerOptionsEnd"
	                    :clearable="true"
	                    @change="changeEnd" readonly/>
	            </el-form-item>
                <el-form-item class="cl_td" label="交易地点 " prop="transLocation" 
                    :rules="[ { required: true, message: '溢缴款管控不能为空'}]">
                    <el-select v-model="sceDetail.transLocation" class="wd200" disabled   readonly>
                    <el-option
                        v-for="(item, index ) in transLocationUpdateOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <!--卡组织标识-->
                <div class="clearboth"></div>
                <div  class="mainname titleInfo ">卡组织标识</div>
                <div v-if="cardSelinfoN">
				   <div class="col10 text_center">暂无数据</div>
			    </div>
			    <div v-if="cardSelinfois">
	                <div v-for="(cardInfo,index) in cardDetailList" class="col_td" style="margin-bottom: 15px;">
		               	<el-form-item class="col3 col_w" label="卡组织渠道 " prop="cardAssociations">
		                    <el-select v-model="cardInfo.cardAssociations" class="wd200" disabled   readonly>
		                    <el-option
		                        v-for="(item, index ) in cardAssociationsOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                    </el-select>
		                </el-form-item>
		           	</div>
	           	</div>
               	<!--交易场景信息-->
                <div class="clearboth"></div>
                <div  class="mainname titleInfo ">交易场景信息</div>
                <div v-if="tradSelinfoN">
				   <div class="col10 text_center">暂无数据</div>
			    </div>
                <div v-if="tradSelinfois">
	                <div v-for="(tradInfo,index) in tradDetailList"  class="col_td" style="margin-bottom: 15px;">
		               	<el-form-item class="col3 col_w" label="交易场景 " prop="transScene">
		                    <el-select v-model="tradInfo.transScene" class="wd200"  disabled   readonly>
		                    <el-option
		                        v-for="(item, index ) in transSceneOptions"
		                        :key="index"
		                        :label="item.label"
		                        :value="item.value"/>
		                    </el-select>
		                </el-form-item>
		            </div>
	            </div>
             	<!--例外清单信息-->
                <div class="clearboth"></div>
                <div  class="mainname titleInfo ">例外清单信息</div>
                <el-form-item class="cl_td" label="清单检查标志 " prop="excpListFlag">
                    <el-select v-model="sceDetail.excpListFlag" class="wd200" disabled   readonly>
                    <el-option
                        v-for="(item, index ) in excpListFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
               	<div class="col_tr" v-if="sceDetail.excpListFlag =='Y'">
	                <div class="col2 text_right">清单类型：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="sceDetailCheckedCities" disabled readonly>
						    	<el-checkbox v-for="sceInfoCity in sceDetailCheckedCitiesType" :label="sceInfoCity.id" :key="sceInfoCity.id">{{sceInfoCity.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
	            <div  class="mainname titleInfo">管控清单检查标志</div>
                <el-form-item class="cl_td" label="管控清单检查标志 " prop="contListFlag">
                    <el-select v-model="sceDetail.contListFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in contListFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<!--差异化类型限制-->
               	<div class="clearboth"></div>
                <div class="col_tr" v-if="sceDetail.contListFlag=='Y'">
	                <div class="col2 text_right">清单类型：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="sceDetailExcpListType" disabled readonly>
						    	<el-checkbox v-for="sceInfolList in sceDetailListCheckType" :label="sceInfolList.id" :key="sceInfolList.id">{{sceInfolList.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
            	<el-button type="primary" v-if="showDelBtn" @click="subDelInfo()">确认</el-button>
                <el-button type="primary" @click=" dialogFormVisibleSceDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
            	<div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempDetail.operationMode" class="wd200"  
                    	@change="addOperationModeChange($event)" disabled   readonly>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" readonly/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode" 
                    :rules="[ { required: true, message: '管控场景代码不能为空'}]">
                    <el-input v-model="tempDetail.contrlSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType"> 
                	<el-select v-model="tempDetail.differentType" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in differentTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType"> 
                	<el-select v-model="tempDetail.differentType" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in differentTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="缺省标识" prop="independentFlag" 
                    :rules="[ { required: true, message: '缺省标识不能为空'}]">
                    <el-select v-model="tempDetail.independentFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="contrlSceneDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempDetail.contrlSceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ">交易管控信息</div>
                <el-form-item class="cl_td" label="溢缴款管控 " prop="overpayContrlFlag" 
                    :rules="[ { required: true, message: '溢缴款管控不能为空'}]">
                    <el-select v-model="tempDetail.overpayContrlFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in overpayContrlFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="关联管控标识 " prop="contRelFlag" 
                    :rules="[ { required: true, message: '关联管控标识不能为空'}]">
                    <el-select v-model="tempDetail.contRelFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in contRelFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="关联管控管控场景" prop="controlSceneCodeRel" v-if="tempDetail.contRelFlag=='Y'">
                    <el-select v-model="tempDetail.controlSceneCodeRel" class="wd200" 
                        :rules="[ { required: true, message: '关联管控管控场景不能为空'}]" disabled readonly>
                    <el-option
                        v-for="(item, index ) in contrlSceneCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许差异化类型 " prop="differentFlag" 
                    :rules="[ { required: true, message: '允许差异化类型不能为空'}]">
                    <el-select v-model="tempDetail.differentFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in differentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <!--差异化类型限制-->
                <div class="col_tr" v-if="tempDetail.differentFlag=='Y'">
	                <div class="col2 text_right">差异化类型限制：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="detailCheckedCitiesDifferent" disabled readonly>
						    	<el-checkbox v-for="detailCityDiff in detailDifferentFlagType" :label="detailCityDiff.id" :key="detailCityDiff.id">{{detailCityDiff.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">正负面清单信息</div>
                <el-form-item class="cl_td" label="检查标志" prop="pnListCheckFlag" >
                    <el-select v-model="tempDetail.pnListCheckFlag" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in pnListCheckFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<div class="col_tr" v-if="tempDetail.pnListCheckFlag=='N' || tempDetail.pnListCheckFlag=='P'">
	                <div class="col2 text_right">层级限制：</div>
	                <div class="wdper75 float_left">
		              	<template>
		              		<el-checkbox-group v-model="detailCheckedCities" disabled readonly>
						    	<el-checkbox v-for="detailCity in upListCheckType" :label="detailCity.id" :key="detailCity.id">{{detailCity.label}}</el-checkbox>
						  	</el-checkbox-group>
						</template>
					</div>
				</div>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">交易限制信息</div>
                <el-form-item class="cl_td" label="层级限制" prop="transLimitLev">
                    <el-select v-model="tempDetail.transLimitLev" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in transLimitLevOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="限制币种 " prop="transLimitCurrCode" v-if="tempDetail.transLimitLev!='N'">
                    <el-select v-model="tempDetail.transLimitCurrCode" class="wd200" disabled readonly>
                    <el-option
                        v-for="(item, index ) in transLimitCurrCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--客户层-->
       	 	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempDetail.transLimitLev=='C' || tempDetail.transLimitLev=='B') && (tempDetail.transLimitCurrCode=='0' || tempDetail.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">客户层交易限制</div>
                	<div v-for="(detailItemC,index) in tempDetailC"  :key="detailItemC.id">
        				<div v-if="tempDetail.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="detailItemC.currencyCode" class="wd200" disabled readonly>
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOne"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempDetail.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="detailItemC.currencyCode" class="wd200" disabled   readonly>
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwo"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="detailItemC.mandatoryInspectionFlag" class="wd200" disabled   readonly>
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerDetail(detailItemC,index)">限制详情</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	            </div>
            </el-form>
           <!--媒阶层-->
           	<el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempDetail.transLimitLev=='M' || tempDetail.transLimitLev=='B') && (tempDetail.transLimitCurrCode=='0' || tempDetail.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">媒介层交易限制</div>
                	<div v-for="(detailItemM,index) in tempDetailM"  :key="detailItemM.id">
        				<div v-if="tempDetail.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="detailItemM.currencyCode" class="wd200" disabled   readonly>
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempDetail.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="detailItemM.currencyCode" class="wd200" disabled   readonly>
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoM"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="detailItemM.mandatoryInspectionFlag" class="wd200"disabled   readonly>
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="exceTypeDetail(detailItemM,index)">限制详情</el-button>
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	            </div>
            </el-form>
            <!--产品层-->
            <el-form>
               	<div class="clearboth"></div>
                <div v-if="(tempDetail.transLimitLev=='P') && (tempDetail.transLimitCurrCode=='0' || tempDetail.transLimitCurrCode=='1')">	
                	<div class="mainname titleInfo ng-binding">产品层交易限制</div>
                	<div v-for="(detailItemP,index) in tempDetailP"  :key="detailItemP.id">
        				<div v-if="tempDetail.transLimitCurrCode=='0'">
	                        <el-form-item class="cl_td" label="限制币种 " prop="currencyCode">
	                            <el-select v-model="detailItemP.currencyCode" class="wd200" disabled   readonly>
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsOneP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <div v-if="tempDetail.transLimitCurrCode=='1'">
	                        <el-form-item class="cl_td" label="限制币种 "  prop="currencyCode">
	                            <el-select v-model="detailItemP.currencyCode" class="wd200" disabled   readonly>
	                            <el-option
	                                v-for="(item, index ) in currencyCodeOptionsTwoP"
	                                :key="index"
	                                :label="item.label"
	                                :value="item.value"/>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="clearboth"></div>
	                    <el-form-item class="cl_td" label="强制检查标志 " prop="mandatoryInspectionFlag">
	                        <el-select v-model="detailItemP.mandatoryInspectionFlag" class="wd200" disabled   readonly>
	                        <el-option
	                            v-for="(item, index ) in mandatoryInspectionFlagOptions"
	                            :key="index"
	                            :label="item.detailDesc"
	                            :value="item.codes"/>
	                        </el-select>
	                    </el-form-item>
	                    <div  slot="footer" class="dialog-footer">
	                        <el-button type="primary" @click="customerDetail(detailItemP,index)">限制详情</el-button>
	                       
	                    </div>
	                    <div class=""style="margin-bottom: 30px;"></div>
	                </div>
	            </div>
            </el-form>   
			<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
         <!--详情限制详情-->
        <el-dialog :title="titleName" :visible.sync="dialogFormVisibleLimitDetail" width="65%">
            <div class="mainname titleInfo">基本信息</div>
            <el-form ref="limitDetailRef" :data="limitDetail" :rules="limitDetailRules" border stripe style="width: 100%">
                <el-form-item prop="organNo" label="限制层级" class="cl_td bnone ">
                    <el-input v-model="limitDetail.levelFlagInfo"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种 " prop="currencyCodeInfo" >
                        <el-select v-model="limitDetail.currencyCodeInfo" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in currencyCodeInfoOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                        </el-select>
                    </el-form-item>
                <el-form-item  prop="transLimitCode" label="管控场景代码" class="cl_td bnone">
                    <el-input v-model="limitDetail.transLimitCode"  class="wd200" readonly/>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="差异化类型" class="cl_td bnone">
                    <el-input v-model="limitDetail.differentTypeCusInfo"  class="wd200" readonly/>
                </el-form-item>
               	<div class=" clearboth"></div>
                <div class="mainname titleInfo">限额上限</div>
                <el-form-item class="cl_td" label="单笔限额检查 " prop="limitSingleTransFlag" >
                    <el-select v-model="limitDetail.limitSingleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray1"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="limitSingleTrans" label="单笔限制金额" class="cl_td">
                    <el-input v-model="limitDetail.limitSingleTrans" v-if="limitDetail.limitSingleTransFlag=='Y'" class="wd200"/>
                </el-form-item> 
                
                <el-form-item class="cl_td" label="日限额检查 " prop="limitDayTransFlag" >
                    <el-select v-model="limitDetail.limitDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray2"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitDayTrans" label="日限制金额" class="cl_td">
                    <el-input v-model="limitDetail.limitDayTrans" v-if="limitDetail.limitDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限额检查 " prop="limitCycleTransFlag" >
                    <el-select v-model="limitDetail.limitCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray3"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" prop="limitCycleTrans" label="CYCLE限制金额">
                    <el-input v-model="limitDetail.limitCycleTrans" v-if="limitDetail.limitCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限额检查" prop="limitMonthTransFlag" >
                    <el-select v-model="limitDetail.limitMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray4"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitMonthTrans" label="月限制金额" >
                    <el-input v-model="limitDetail.limitMonthTrans" v-if="limitDetail.limitMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限制检查" prop="limitHalfYearTransFlag" >
                    <el-select v-model="limitDetail.limitHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray5"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"  prop="limitHalfYearTrans" label="半年限额金额">
                    <el-input v-model="limitDetail.limitHalfYearTrans" v-if="limitDetail.limitHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限制检查" prop="limitYearTransFlag" >
                    <el-select v-model="limitDetail.limitYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray6"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitYearTrans"  label="全年限制金额" class="cl_td">
                    <el-input v-model="limitDetail.limitYearTrans" v-if="limitDetail.limitYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限额检查" prop="limitLifeCycleTransFlag" >
                    <el-select v-model="limitDetail.limitLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray7"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="limitLifeCycleTrans"  label="全生命周期限制金额" class="cl_td">
                    <el-input v-model="limitDetail.limitLifeCycleTrans" v-if="limitDetail.limitLifeCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">限次上限</div>
                
                <el-form-item class="cl_td" label="日限次检查" prop="numberDayTransFlag" >
                    <el-select v-model="limitDetail.numberDayTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray8"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberDayTrans"  label="日限制笔数" class="cl_td">
                    <el-input v-model="limitDetail.numberDayTrans" v-if="limitDetail.numberDayTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="CYCLE限次检查" prop="numberCycleTransFlag" >
                    <el-select v-model="limitDetail.numberCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray9"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberCycleTrans" label="CYCLE限制笔数 " class="cl_td">
                    <el-input v-model="limitDetail.numberCycleTrans"  v-if="limitDetail.numberCycleTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="月限次检查" prop="numberMonthTransFlag" >
                    <el-select v-model="limitDetail.numberMonthTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray10"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberMonthTrans"  label="月限制笔数" class="cl_td">
                    <el-input v-model="limitDetail.numberMonthTrans" v-if="limitDetail.numberMonthTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="半年限次检查" prop="numberHalfYearTransFlag">
                    <el-select v-model="limitDetail.numberHalfYearTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray11"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberHalfYearTrans"  label="半年限制笔数" class="cl_td">
                    <el-input v-model="limitDetail.numberHalfYearTrans" v-if="limitDetail.numberHalfYearTransFlag=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全年限次检查 " prop="numberYearTrans" >
                    <el-select v-model="limitDetailCopy.numberYearTrans" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray12"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="differentTypeCusInfo" label="全年限制笔数" class="cl_td">
                    <el-input v-model="limitDetail.differentTypeCusInfo"   v-if="limitDetail.numberYearTrans=='Y'" class="wd200"/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全生命周期限次检查" prop="numberLifeCycleTransFlag" >
                    <el-select v-model="limitDetail.numberLifeCycleTransFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in defaultFlagArray13"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="numberLifeCycleTrans" label="全生命周期限制笔数" class="cl_td">
                    <el-input v-if="limitDetail.numberLifeCycleTransFlag=='Y'" v-model="limitDetail.numberLifeCycleTrans"  class="wd200"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleLimitDetail = false">取消</el-button>
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
    	//新增
    	const differentOptions = [{id:'CN',label:'客户'},{id: 'M',label:'媒介'},{id:'P',label:'产品'}, {id:'R',label: '风险组别'}]
    	const cityOptions = [{id:'CN',label:'国家列表'},{id: 'MH',label:'特店列表'},{id:'TM',label:'终端列表'}, {id:'MN',label: '商户名'}, {id:'MC',label: 'MCC'}];
        //修改
        const upDifferentOptions = [{id:'C',label:'客户'},{id: 'M',label:'媒介'},{id:'P',label:'产品'}, {id:'R',label: '风险组别'}]
    	const upCityOptions = [{id:'C',label:'国家列表'},{id: 'MH',label:'特店列表'},{id:'TM',label:'终端列表'}, {id:'MN',label: '商户名'}, {id:'MC',label: 'MCC'}];
        
        return {
        	/*----新增----*/
        	//差异化类型限制
        	checkedCitiesDifferent: [],
        	differentFlagType: differentOptions,
        	isDifferent: true,
        	//清单类型多选
        	checkedCities: [],
	        listCheckType: cityOptions,
	        isIndeterminate: true,
	        /*----修改----*/
	       	upCheckedCitiesDifferent: [],
	       	upDifferentFlagType: upDifferentOptions,
	       	up_isDifferent: true,
	       	//清单类型多选
        	upcheckedCities: [],
	        upListCheckType: upCityOptions,
	        up_isIndeterminate: true,
	       	/*----差异化----*/
	       	copyCheckedCitiesDifferent: [],
	       	copyDifferentFlagType: upDifferentOptions,
	       	copy_isDifferent: true,
	       	//清单类型多选
        	copyCheckedCities: [],
	       	copyListCheckType: cityOptions,
	        copyIsIndeterminate: true,
	        
	        /*----场景识别----*/
	        //修改例外清单信息：清单类型多选
	        sceListLoading: false,
	       	sceCheckedCities: [],
	       	sceCheckedCitiesType: differentOptions,
	       	sce_isDifferent: true,
	       	//修改控制清单信息：清单类型多选
        	sceExcpListType: [],
	       	sceListCheckType: cityOptions,
	        sceIsIndeterminate: true,
	        /*----详情----*/
	       	//详情例外清单信息：清单类型多选
	       	detailCheckedCitiesDifferent: [],     
	       	detailDifferentFlagType: upDifferentOptions,
	       	//详情控制清单信息：清单类型多选
	       	detailCheckedCities: [],
	       	detailCheckedCities: cityOptions,
	        //详情
	        //例外清单信息：清单类型多选
	       	sceDetailCheckedCities: [],
	       	sceDetailCheckedCitiesType: cityOptions,
	       	sce_detailDifferent: true,
	       	//控制清单信息：清单类型多选
        	sceDetailExcpListType: [],
	       	sceDetailListCheckType: cityOptions,
	        sceDetailIsIndeterminate: true,
	       // 权限
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            selTwoBtnFlag: false,
            btnAuthStr: '',
            // 列表
            showCode: false,
            eyer:true,
            showListA: false,
            showListB: false,
            queryForm: {
                pageNum: 1,
                pageSize:10,
            },
            listLoadingA: false,
            listLoadingB: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableListA: [],
            tableTotalA: 0,
            tableListB: [],
            tableTotalB: 0,
            list_operationMode: '',
            // 下拉框
            operationModeOptions: [], //运营模式
            productDimensionAddOptions: [],//产品维度
            controlSceneCodeRelOptions: [],//授权响应码
            addListCodeOptions: [],
            differentTypeOptions:[],//差异化类型
            independentFlagOptions: [],//缺省标识
            overpayContrlFlagOptions: [],//溢缴款管控 
            contRelFlagOptions: [],//关联管控标识
            differentFlagOptions: [],//允许差异化类型
            transLimitLevOptions: [],//层级限制
            transLimitCurrCodeOptions: [],//限制币种
            pnListCheckFlagOptions: [],
            currencyCodeOptionsOne: [],//交易限制信息的限制币种等于运营币种显示此下拉
            currencyCodeOptionsTwo: [],//交易限制信息的限制币种等于入账币种显示此下拉
            listTypInfoOptions: [],
            idTypeList: [],//证件类型
            mandatoryInspectionFlagOptions: [],//强制检查标志
            contrlSceneCodeOptions: [], //关联管控场景
            currencyCodeOptionsOneM: [],//媒介交易限制信息的限制币种等于运营币种显示此下拉
            currencyCodeOptionsTwoM: [],//媒介交易限制信息的限制币种等于入账币种显示此下拉
            mandatoryInspectionFlagOptionsM: [],//媒介强制检查标志
            currencyCodeOptionsOneP: [],//产品交易限制信息的限制币种等于运营币种显示此下拉
          	currencyCodeOptionsTwoP: [],//产品交易限制信息的限制币种等于入账币种显示此下拉
           	transLocationUpdateOptions: [],//交易地点
            cardAssociationsOptions: [],//卡组织渠道
            transSceneOptions: [],//交易场景
            excpListFlagOptions: [],//清单检查标识
            contListFlagOptions: [],//管控清单检查标识
            listDifferentFlagOptions: [],//差异化标志
            transDifferentFlagOptions: [],//交易限制差异化标志
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dataFormAdd: {},
            customerItem: [{}],
            //客户层
            tempAddC: [{
            	id:this.dataNum++,
	            currencyCodeC: '',
	            mandatoryInspectionFlagC:'',
            }], 
            arrIndex: '',
            rulesAddC: {}, 
            dataNum: 0,
            dataFormAddC: {},
            showCustomerBtn: true,
            
            //媒阶层
            tempAddM: [{
            	id:this.dataNum++,
	            currencyCodeM: '',
	            mandatoryInspectionFlagM:'',
            }], 
            rulesAddM: {}, 
            dataFormAddM: {},
            showMediumBtn: true,
			//产品层
			tempAddP: [{
            	id:this.dataNum++,
	            currencyCodeC: '',
	            mandatoryInspectionFlagC:'',
            }],
            rulesAddP: {}, 
            dataFormAddP: {},
            
            dialogFormVisibleAdd: false,
            addTableList: [],//列表
            addObj: [],
           // cities: cityOptions,
            monitorHierarchy: '',
            corporationIdNew: '',
            //限制详情
            dialogFormVisibleConlimitSelDetail: false,
            conlimitSelRef: {},
            conlimitSelRules: {},
            limitDetailAdd: {},
            //限制详情下拉
            currencyCodeInfoOptions: [],
            defaultFlagArray1: [],
            defaultFlagArray2: [],
            defaultFlagArray3: [],
            defaultFlagArray4: [],
            defaultFlagArray5: [],
            defaultFlagArray6: [],
            defaultFlagArray7: [],
            defaultFlagArray8: [],    
            defaultFlagArray9: [],
            defaultFlagArray10: [],
            defaultFlagArray11: [],    
            defaultFlagArray12: [],
            defaultFlagArray13: [],
            
            /*----修改----*/
           	showDifferentTypeU: false,
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            tempUpList1: [],
            rulesUp: {},
            dataFormUp:{},
            
             //客户层
            tempUpC: [{
            	id:this.dataNum++,
	            currencyCode: '',
	            mandatoryInspectionFlag:'',
            }], 
            arrIndex: '',
            rulesUpC: {}, 
            dataNumUp: 0,
            dataFormUpC: {},
            upShowCustomerBtn: true,
            
            //媒阶层
            tempUpM: [{
            	id:this.dataNum++,
	            currencyCode: '',
	            mandatoryInspectionFlag:'',
            }], 
            rulesUpM: {}, 
            dataFormUpM: {},
            upShowMediumBtn: true,
			//产品层
			tempUpP: [{
            	id:this.dataNum++,
	            currencyCode: '',
	            mandatoryInspectionFlag:'',
            }],
            rulesUpP: {}, 
            dataFormUpP: {},
            //限制详情
            dialogFormVisibleUpLimitSelDetail: false,
            limitUpRules: {},
            limitUpRef: {},
            limitDetailUp: {},
            /*----详情----*/
            dialogFormVisibleDetail: false,
            rulesDetail: {},
            dataFormDetail: {},
            tempDetail: {},
            tempDetailC: [{
            	currencyCode: '',
	            mandatoryInspectionFlag:'',
            }], 
			 //媒阶层
            tempDetailM: [{
            	currencyCode: '',
	            mandatoryInspectionFlag:'',
            }], 
            //产品层
			tempDetailP: [{
            	currencyCode: '',
	            mandatoryInspectionFlag:'',
            }],
            //限制详情
            dialogFormVisibleLimitDetail: false, 
            limitDetailRules: {},
			limitDetail: {},
            limitDetailRef: {},
            /*----场景识别----*/
           	dialogFormVisibleSce: false,
           	tempSce: {},
           	dataFormSce: {},
           	rulesSce: {},
           	tableSceList: [],
           	scePage: {
           		pageNum: 1,
                pageSize:10,
           	},    
           	tableTotalSce: 0,
           	pickerOptionsStart: {}, //起始时间
       		pickerOptionsEnd:{}, // 结束时间
       		//场景识别修改
       		dialogFormVisibleUpSce: false,
       		dataFormUpSce: {},
       		rulesUpSce: {},
       		upSceInfo: {},
       		showCardBtn: true,
       		cardUpdateList:[{//
   			 	cardAssociations: '',
		    }],
		    showTradBtn: true,
       		tradUpdateList: [{
       			transScene: '',
       		}],//增加就push进数组一个新值
       		//场景识别详情
	        sceDetail: {},
	        rulesSceDetail: {},
	        dataFormSceDetail: {},
	        dialogFormVisibleSceDetail: false,
	        cardDetailList:[{
   			 	cardAssociations: '',
		    }],
		    tradDetailList: [{
       			transScene: '',
       		}],
       		cardSelinfoN: false,
       		tradSelinfoN: false,
       		cardSelinfois: true,
       		tradSelinfois: true,
       		//删除
       		titleName: '',
       		showDelBtn: true,
	        /*----差异化----*/
       		dialogFormVisibleCopy: false,
       		showDifferentTypeC: false,
       		dataFormCopy: {},
			tempCopy: {},
			rulesCopy: {},
			pickerOptionsStartCopy: {},
			pickerOptionsEndCopy: {},
			showCopyPnListCheckFlag: false,
			showCopyListCheckType: false,
			showCopyListCheck: false,
			showCopyTransLimit: false,
			showCopyHierarchica: false,
			showCopyTransLimitLev: false,
			tempCopyC: [{
            	currencyCode: '',
	            mandatoryInspectionFlag:'',
            }], 
			 //媒阶层
            tempCopyM: [{
            	currencyCode: '',
	            mandatoryInspectionFlag:'',
            }], 
            //产品层
			tempCopyP: [{
            	currencyCode: '',
	            mandatoryInspectionFlag:'',
            }],
           //限制详情
			dialogFormVisibleCopyLimitSelDetail: false,
			limitDetailCopy: {},
			limitCopyRef: {},
			limitCopyRules: {},
			/*----删除----*/
            dialogFormVisibleDel: false,
            tempDel: {},
            rulesUpSce: {},
            rulesDel: {},
            dataFormDel:{},
        }
    },
    created() {
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationIdNew=logininfo.corporationEntityNo
        this.getBtnAuth()
    },
    mounted() {
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            adminFlagLogin: '1',
        }
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //产品维度
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0013",).then(res => {
        	res.forEach(item => {
                item.label = item.productObjectCode + ' ' + item.productDesc
            });
            
        	this.productDimensionAddOptions = res
        })
        //应用范围
        this.getSelectDict( "dic_applictionrange").then(res => {
            this.applicationRangeOptions = res
        })
        //差异化类型
        this.getSelectDict( "dic_differentType").then(res => {
            this.differentTypeOptions = res
        })
        //缺省标识
        this.getSelectDict( "dic_invalidFlag").then(res => {
            this.independentFlagOptions = res
        })
        //溢缴款管控 
        this.getSelectDict( "dic_isYorN").then(res => {
        	
            this.overpayContrlFlagOptions = res
        })
        //关联管控标识
         this.getSelectDict( "dic_isYorN").then(res => {
            this.contRelFlagOptions = res
        })
        //允许差异化类型 
        
        //检查标志
         this.getSelectDict( "dic_checkList").then(res => {
            this.pnListCheckFlagOptions = res
        })
        //层级限制
        this.getSelectDict( "dic_leveList").then(res => {
            this.transLimitLevOptions = res
        })
        //限制币种
        this.getSelectDict( "dic_currcyType").then(res => {
            this.transLimitCurrCodeOptions = res
        })
        //强制检查标志
        this.getSelectDict( "dic_isYorN").then(res => {
            this.mandatoryInspectionFlagOptions = res
        })
        //单笔限额检查 
        this.getSelectDict( "dic_isYorN").then(res => {
        	res.forEach(item => {
                item.limitSingleTransFlag = 'N'
            });
            this.defaultFlagArray1 = res
        })
        //日限额检查 
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray2 = res
        })
        //CYCLE限额检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray3 = res
        })
        //月限额检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray4 = res
        })
        //半年限额检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray5 = res
        })
        //全年限额检查
         this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray6 = res
        })
        //全生命周期限额检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray7 = res
        })
        //日限次检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray8 = res
        })
        //CYCLE限次检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray9 = res
        })
        //*月限次检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray10 = res
        })
        //半年限次检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray11 = res
        })
        //全年限次检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray12 = res
        })
        //全生命周期限次检查
        this.getSelectDict( "dic_isYorN").then(res => {
            this.defaultFlagArray13= res
        })
        //币种
        this.getSelectDict( "dic_currcyType").then(res => {
            this.currencyCodeInfoOptions = res
        })
	     //允许差异化类型
        this.getSelectDict( "dic_isYorN").then(res => {
            this.differentFlagOptions = res
        })
        //媒介
        //媒介强制检查标志
        this.getSelectDict( "dic_isYorN").then(res => {
        	this.mandatoryInspectionFlagOptionsM = res
        })
        //产品层
        this.getSelectDict( "dic_isYorN").then(res => {
            this.mandatoryInspectionFlagOptionsP = res
        }) 
        //交易地点
       	this.getSelectDict( "dic_countries").then(res => {
            this.transLocationUpdateOptions = res
        })
       	//卡组织渠道
   		this.getSelectDict( "dic_recordType").then(res => {
            this.cardAssociationsOptions = res
        })
		//清单检查标识
       	this.getSelectDict( "dic_isYorN").then(res => {
            this.excpListFlagOptions = res
        })
       	//管控清单检查标志 
       	this.getSelectDict( "dic_isYorN").then(res => {
            this.contListFlagOptions = res
        })
       	//差异化标志
       	this.getSelectDict( "dic_isYorN").then(res => {
            this.listDifferentFlagOptions = res
            
        })
       	//交易限制的差异化标志
       	this.getSelectDict( "dic_isYorN").then(res => {
            this.transDifferentFlagOptions = res
        })
       	
    },
    methods: {
        //带快捷键的开始日期与结束日期
		changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.upSceInfo.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.upSceInfo.endDate).getTime()
                }
            })
        },
         //带快捷键的开始日期与结束日期
		changeStartCopy() {
            this.pickerOptionsEndCopy = Object.assign({}, this.pickerOptionsEndCopy, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.tempCopy.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEndCopy() {
            this.pickerOptionsStartCopy = Object.assign({}, this.pickerOptionsStartCopy, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.tempCopy.endDate).getTime()
                }
            })
        },
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
                        if (this.eventList.includes('AUS.PM.02.0102')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.02.0101')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.02.0103')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                        if(this.eventList.search('AUS.PM.02.0002')){    //授权场景-场景识别查询
                            this.selTwoBtnFlag = true;
                        }
                        else{
                            this.selTwoBtnFlag = false;
                        }
                    }
                }
            })
        },
       //运营模式监听
        operationModeChange(val) {
            this.controlSceneCodeRelOptions = []
            this.list_operationMode = val
            
        },
        //差异化类型监听
        differentTypeChange(){
        	this.$forceUpdate()
        },
        //管控场景箭头向上
        showControlBtn(){
            this.eyer=!this.eyer
            this.showCode=!this.showCode
            this.getListCodeOptions()
        },
        //箭头向下
        elseBtn(){
        	this.eyer=!this.eyer
            this.showCode=!this.showCode
        },
        //授权响应码下拉关联卡组织标识
        getListCodeOptions() {
            let params = {
                differentType:'0',
                operationMode: this.list_operationMode,
            }
            this.post('/beta/betaService/AUS.PM.02.0102', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.listCodeDesc = item.listCode + ' ' + item.contrlSceneDesc
                            arr[index] = {
                                label: item.listCodeDesc,
                                value: item.listCode
                            }
                        })
                        this.controlSceneCodeRelOptions = arr
                    } else {
                        this.controlSceneCodeRelOptions = []
                    }
                }
            })
        },
         //查询
        handleSearch() {
        	if((this.queryForm.operationMode=='' || this.queryForm.operationMode==null || this.queryForm.operationMode==undefined) 
            && (this.queryForm.cardAssociations=='' || this.queryForm.cardAssociations==null || this.queryForm.cardAssociations==undefined) 
            && (this.queryForm.externalResponseCode=='' || this.queryForm.externalResponseCode==null || this.queryForm.externalResponseCode==undefined) ){
                this.$message('请输入查询条件');
                return;
            }else if(this.queryForm.cardAssociations){
                if(this.queryForm.operationMode=='' || this.queryForm.operationMode==null 
                    || this.queryForm.operationMode==undefined){
                        this.$message('请选择运营模式');
                        return;
                    }
            }else if(this.queryForm.differentType=='1'){
                if(this.queryForm.differentCode=='' || this.queryForm.differentCode==null 
                    || this.queryForm.differentCode==undefined){
                        this.$message('请输入风险等级');
                        return;
                    }
            }else if(this.queryForm.differentType=='2'){
                if((this.queryForm.idType=='' || this.queryForm.idType==null 
                    || this.queryForm.idType==undefined) || (this.queryForm.idNumber=='' || this.queryForm.idNumber==null 
                    || this.queryForm.idNumber==undefined)){
                        this.$message('请输入证件类型与证件号码');
                        return;
                    }
            }else if(this.queryForm.differentType=='3'){
                if(this.queryForm.externalIdentificationNo=='' || this.queryForm.externalIdentificationNo==null 
                    || this.queryForm.externalIdentificationNo==undefined){
                        this.$message('请输入外部识别号');
                        return;
                    }
            }
           	this.getList()
        },
        // 列表
        getList() {
        	if(!this.queryForm.differentType || this.queryForm.differentType=='0'){
           		this.queryForm.differentType='0'
                delete  this.queryForm.idNumber
                delete  this.queryForm.idType
                delete  this.queryForm.externalIdentificationNo
                delete  this.queryForm.differentCode
                this.gitListB()
            }else if(this.queryForm.differentType=='1'){
            	delete  this.queryForm.idNumber
                delete  this.queryForm.idType
                delete  this.queryForm.externalIdentificationNo
               	this.gitListB()
            }else if(this.queryForm.differentType=='2'){
                delete this.queryForm.externalIdentificationNo
                delete this.queryForm.differentCode
               
                this.gitListA()
            }else if(this.queryForm.differentType=='3'){
               	delete this.queryForm.idNumber
                delete this.queryForm.idType
                delete this.queryForm.differentCode
              	this.gitListA()
            }else if(this.queryForm.differentType=='4'){
               	delete this.queryForm.idNumber
               	delete this.queryForm.idType
               	delete this.queryForm.externalIdentificationNo
              	delete this.queryForm.differentCode
             	this.gitListB()
            }
        },
        gitListA(){
        	this.listLoadingA = true
        	this.showListA = true
            this.showListB = false
        	let obj={
                differentType: this.queryForm.differentType,
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_differentType','dic_ZorO'],//查找数据字典所需参数
				transDict : ['differentType','independentFlag'],//翻译前后key
            }
            obj = Object.assign ( obj, this.queryForm )
            this.getTableList('/auth/authService/AUS.PM.02.0107', obj ,(res) => {
                this.listLoadingA= false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableListA = res.returnData.rows
                        this.tableTotalA = res.returnData.totalCount
					}
                }
            })
        },
        gitListB(){
        	this.listLoadingB = true
        	this.showListA = false
            this.showListB = true
        	let obj={
                differentType: this.queryForm.differentType,
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_differentType','dic_ZorO'],//查找数据字典所需参数
				transDict : ['differentType','independentFlag'],//翻译前后key
            }
            obj = Object.assign ( obj, this.queryForm )
           	this.getTableList('/beta/betaService/AUS.PM.02.0102', obj ,(res) => {
                this.listLoadingB= false
                if (res.returnCode == '000000') {
                   if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                       	this.tableListB = res.returnData.rows
                        this.tableTotalB = res.returnData.totalCount
                    }
                }
            })
        },
       	/*----显示新增弹框----*/
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.tempAdd.differentType='无'
            this.$nextTick(() => {
                this.$refs['tempAdd'].clearValidate()
          	})
        }, 
        //客户层交易限制
        //监听层级限制关联限制币种
        changeTransLimitLev(value) {
            this.monitorHierarchy = value;
            this.getCurrencyCodeOptionsOneC()
            this.getCurrencyCodeOptionsTwoC()
            this.getCurrencyCodeOptionsOneM()
            this.getCurrencyCodeOptionsTwoM()
            this.getCurrencyCodeOptionsOneP()
            this.getCurrencyCodeOptionsTwoP()
        },
        //限制币种==0
        getCurrencyCodeOptionsOneC() {
            let params = {
                corporationEntityNo:this.corporationIdNew,
                requestType:"1",
                resultType:"1"
            }
            this.post('/beta/betaService/COS.IQ.02.0037', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.currencyDesc,
                                value: item.accountCurrency
                            }
                        })
                        this.currencyCodeOptionsOne = arr
                    } else {
                        this.currencyCodeOptionsOne = []
                    }
                }
            })
        },
        //限制币种==1
        getCurrencyCodeOptionsTwoC() {
            let params = {
                operationMode:this.operationMode,
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
                        this.currencyCodeOptionsTwo = arr
                    } else {
                        this.currencyCodeOptionsTwo = []
                    }
                }
            })
        },
        //媒介层交易限制
         //限制币种==0
        getCurrencyCodeOptionsOneM() {
            let params = {
                corporationEntityNo:this.corporationIdNew,
                requestType:"1",
                resultType:"1"
            }
            this.post('/beta/betaService/COS.IQ.02.0037', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.currencyDesc,
                                value: item.accountCurrency
                            }
                        })
                        this.currencyCodeOptionsOneM = arr
                    } else {
                        this.currencyCodeOptionsOneM = []
                    }
                }
            })
        },
        //限制币种==1
        getCurrencyCodeOptionsTwoM() {
            let params = {
                operationMode:this.operationMode,
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
                        this.currencyCodeOptionsTwoM = arr
                    } else {
                        this.currencyCodeOptionsTwoM = []
                    }
                }
            })
        },
        //产品层交易限制
        //限制币种==0
        getCurrencyCodeOptionsOneP() {
            let params = {
                corporationEntityNo:this.corporationIdNew,
                requestType:"1",
                resultType:"1"
            }
            this.post('/beta/betaService/COS.IQ.02.0037', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.currencyDesc,
                                value: item.accountCurrency
                            }
                        })
                        this.currencyCodeOptionsOneP = arr
                    } else {
                        this.currencyCodeOptionsOneP = []
                    }
                }
            })
        },
        //限制币种==1
        getCurrencyCodeOptionsTwoP() {
            let params = {
                operationMode:this.operationMode,
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
                        this.currencyCodeOptionsTwoP = arr
                    } else {
                        this.currencyCodeOptionsTwoP = []
                    }
                }
            })
        },
        //监听运营模式关联管控场景
		addOperationModeChange(row){
			let operationModeItem = ''
			operationModeItem=row
			this.getAddListCodeOptions(operationModeItem)
		},
		//关联管控场景下拉
		getAddListCodeOptions(operationModeItem){
			let paramsListCode = {
                operationMode: operationModeItem,
                authDataSynFlag:'1',
		       	differentType:'0',
            }
            this.post('/beta/betaService/AUS.PM.02.0102', paramsListCode, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.contrlSceneCodeDesc = item.contrlSceneCode+''+ item.contrlSceneDesc
                            arr[index] = {
                                label: item.contrlSceneCodeDesc,
                                value: item.contrlSceneCode
                            }
                        })
                        this.contrlSceneCodeOptions = arr
                    } else {
                        this.contrlSceneCodeOptions = []
                    }
                }
            })
		},
		//差异化类型限制--多选
		handleCheckedDifferentChange(value) {
			let arrDiff = value
			let str1 = ""; 
			for (let i = 0; i < arrDiff.length; i++) {
			      if (i < arrDiff.length - 1) {
			        str1 += arrDiff[i] + ",";
			      } else {
			        str1 += arrDiff[i];
			      }
			}
			this.tempAdd.differentFlagType=str1
		},
		//清单类型--多选
		handleCheckedCitiesChange(value) {
			let arrListType = value
			let str2 = ""; 
			for (let i = 0; i < arrListType.length; i++) {
			      if (i < arrListType.length - 1) {
			        str2 += arrListType[i] + ",";
			      } else {
			        str2 += arrListType[i];
			      }
			}
	        this.tempAdd.listCheckType = str2;
	    },
		//交易限制信息限制币种==入账币种展示此新增功能
		delete(item,index){
	        if(this.tempAddC.length<=1){//如果只有一个输入框则不可以删除
	          return false
	        }
	        this.tempAddC.splice(index,1)//删除了数组中对应的数据也就将这个位置的输入框删除
	    },
	    //新增客户层交易限制
	    customerListAdd(){
	    	this.tempAddC.push(//增加就push进数组一个新值
	          	{
		            id:this.dataNum++,
		            currencyCodeC: '',
		            mandatoryInspectionFlagC:'',
		        }
	        )
	        if(this.tempAddC.length>=4){
	        	this.showCustomerBtn = false
	        }
	    },
	    //新增媒阶层交易限制
	    mediumListAdd(){
	    	this.tempAddM.push(//增加就push进数组一个新值
	          	{
		            id:this.dataNum++,
		            currencyCodeM: '',
		            mandatoryInspectionFlagM:'',
		        }
	        )
	        if(this.tempAddM.length>=4){
	        	this.showMediumBtn = false
	        }
	    },
		//删除客户
		delAddItemC(item) {
			this.tempAdd.tempAddC.splice(item, 1)
            /*this.index = this.tempAddC.indexOf(item)
            if (index !== -1) {
                this.tempAdd.tempAddC.splice(index, 1)
            }*/
      	},
	    //删除媒介
	    delAddItemM(item) {
			this.tempAdd.tempAddM.splice(item, 1)
		},
	    //新增产品层交易限制
	    productListAdd(){
	    	this.tempAddP.push(//增加就push进数组一个新值
	          	{
		            id:this.dataNum++,
		            currencyCodeC: '',
		            mandatoryInspectionFlagC:'',
		        }
	        )
	        if(this.tempAddP.length>=4){
	        	this.showMediumBtn = false
	        }
	    },
	    //删除产品
	    delAddItemP(item) {
			this.tempAdd.tempAddP.splice(item, 1)
		},

		//显示限制详情弹框===客户层===产品层公用
		customerAddInfo(formValue,index) {
			this.arrIndex = index;
			if(formValue.currencyCodeC){
          		if (formValue.mandatoryInspectionFlagC) {
            		let allLimitSelC = {}
        			if(this.tempAdd.transLimitLev=="C" || this.tempAdd.transLimitLev=="B"){ //===客户层
	        			allLimitSelC.sign = 'C'
		        		allLimitSelC.currencyCode = formValue.currencyCodeC //限制币种
		                allLimitSelC.mandatoryInspectionFlag = formValue.mandatoryInspectionFlagC//强制检查标志
	        		}else  if(this.tempAdd.transLimitLev=="P"){ //===产品层
		        		allLimitSelC.sign = 'P'
		    		 	allLimitSelC.currencyCode = formValue.currencyCodeC //限制币种
		                allLimitSelC.mandatoryInspectionFlag = formValue.mandatoryInspectionFlagC//强制检查标志
        		}
	        	allLimitSelC.authDataSynFlag = "1";
	            allLimitSelC.operationMode = this.tempAdd.operationMode;   //运营模式
	            allLimitSelC.levelFlag = this.tempAdd.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
	            allLimitSelC.differentType = 0;   //差异类型
	            allLimitSelC.contrlSceneCode = this.tempAdd.contrlSceneCode//管控场景代码
		        this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelC, (res) => {
	                if (res.returnCode == '000000') {
	                	this.limitDetailAdd.differentTypeCusInfo = this.tempAdd.differentType//差异化类型
	                	if(formValue.currencyCodeC=='156'){//币种
                			this.limitDetailAdd.currencyCodeInfo = '人民币'
                		}else if(formValue.currencyCodeC=='840'){
	                		this.limitDetailAdd.currencyCodeInfo = '美元'
	                	}
	                	if(allLimitSelC.levelFlag=='C'){//客户
	                		this.titleName = '客户层交易限制详细信息'
	                		this.limitDetailAdd.levelFlagInfo = '客户层'
							this.limitDetailAdd.signItem =allLimitSelC.sign 
	                    	this.dialogFormVisibleConlimitSelDetail = true
	                    }else if(allLimitSelC.levelFlag=='P'){//产品
	                		this.titleName = '产品层交易限制详细信息'
	                		this.limitDetailAdd.levelFlagInfo = '产品层'
	                		this.limitDetailAdd.signItem =allLimitSelC.sign 
	                		this.dialogFormVisibleConlimitSelDetail = true
	                	}else if(allLimitSelC.levelFlag=='B'){//两层
	                		this.titleName = '客户层交易限制详细信息'
	                		this.limitDetailAdd.levelFlagInfo = '两层'
	                		this.limitDetailAdd.signItem =allLimitSelC.sign 
	                		this.dialogFormVisibleConlimitSelDetail = true
                		}
	               	}
	            })
		   	}else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
        },
       	//媒介层限制详情
       	exceTypeAddInfo(formValue,index){
       		this.arrIndex = index;
       		if(formValue.currencyCodeM){
          		if (formValue.mandatoryInspectionFlagM) {
		       		let  allLimitSelM = {}
		       		if(this.tempAdd.transLimitLev=="M" || this.tempAdd.transLimitLev=="B"){ //===媒介层
		       			allLimitSelM.currencyCode = formValue.currencyCodeM //限制币种
		                allLimitSelM.mandatoryInspectionFlag = formValue.mandatoryInspectionFlagM//强制检查标志
		        	}
		       		allLimitSelM.sign = 'M'
		       		allLimitSelM.authDataSynFlag = "1";
		            allLimitSelM.operationMode = this.tempAdd.operationMode;   //运营模式
		            allLimitSelM.levelFlag = this.tempAdd.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
		            allLimitSelM.differentType = 0;   //差异类型
		            allLimitSelM.contrlSceneCode = this.tempAdd.contrlSceneCode//管控场景代码
		           	this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelM, (res) => {
		                if (res.returnCode == '000000') {
		                	this.limitDetailAdd.differentTypeCusInfo = this.tempAdd.differentType//差异化类型
		                	//---币种
		                	this.titleName = '媒介层交易限制详细信息'
		                	if(formValue.currencyCodeM=='156'){
	                			this.limitDetailAdd.currencyCodeInfo = '人民币'
	                		}else if(formValue.currencyCodeM=='840'){
	                			this.limitDetailAdd.currencyCodeInfo = '美元'
	                		}
	                		//---媒介
		                	if(allLimitSelM.levelFlag=='M'){
		                		this.limitDetailAdd.levelFlagInfo = '媒介层'
		                		this.limitDetailAdd.signItem =allLimitSelM.sign 
		                		this.dialogFormVisibleConlimitSelDetail = true
		                		
		                	}else if(allLimitSelM.levelFlag=='B'){//---两层
		                		this.limitDetailAdd.levelFlagInfo = '两层'
		                		this.limitDetailAdd.signItem =allLimitSelM.sign 
		                		this.dialogFormVisibleConlimitSelDetail = true
		                	}
		               	}
		            })
		        }else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
       	},
       	//限制详情确认保存数据Btn
       	addLimitData(){
       		//限额上限
       		if((this.limitDetailAdd.limitSingleTransFlag=="Y") && 
       			(this.limitDetailAdd.limitSingleTrans=='' || this.limitDetailAdd.limitSingleTrans==undefined)){
       			this.$message("单笔限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailAdd.limitDayTransFlag=='Y') && 
       			(this.limitDetailAdd.limitDayTrans=='' ||  this.limitDetailAdd.limitDayTrans==undefined)){
       			this.$message("日限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailAdd.limitCycleTransFlag=='Y') && 
       			(this.limitDetailAdd.limitCycleTrans=='' || this.limitDetailAdd.limitCycleTrans==undefined)){
       			this.$message("CYCLE限制金额 不能为空")
        		return;
       		}
       		if((this.limitDetailAdd.limitMonthTransFlag=='Y') && 
       			(this.limitDetailAdd.limitMonthTrans=='' || this.limitDetailAdd.limitMonthTrans==undefined)){
       			this.$message("月限制金额 不能为空")
        		return;
       		}
       		if((this.limitDetailAdd.limitHalfYearTransFlag=='Y') && 
       			(this.limitDetailAdd.limitHalfYearTrans=='' || this.limitDetailAdd.limitHalfYearTrans==undefined)){
       			this.$message("半年限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailAdd.limitYearTransFlag=='Y') && 
       			(this.limitDetailAdd.limitYearTrans=='' || this.limitDetailAdd.limitYearTrans==undefined)){
       			this.$message("全年限额检查不能为空")
        		return;
       		}
       		if((this.limitDetailAdd.limitLifeCycleTransFlag=='Y') && 
       			(this.limitDetailAdd.limitLifeCycleTrans=='' || this.limitDetailAdd.limitLifeCycleTrans==undefined)){
       			this.$message("全生命周期限制金额 不能为空")
        		return;
       		}
       		//限次上限
       		if((this.limitDetailAdd.numberDayTransFlag=='Y') && 
       			(this.limitDetailAdd.numberDayTrans=='' || this.limitDetailAdd.numberDayTrans==undefined)){
       			this.$message("日限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailAdd.numberCycleTransFlag=='Y') && 
       			(this.limitDetailAdd.numberCycleTrans=='' || this.limitDetailAdd.numberCycleTrans==undefined)){
       			this.$message("CYCLE限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailAdd.numberMonthTransFlag=='Y') && 
       			(this.limitDetailAdd.numberMonthTrans=='' || this.limitDetailAdd.numberMonthTrans==undefined)){
       			this.$message("月限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailAdd.numberHalfYearTransFlag=='Y') && 
       			(this.limitDetailAdd.numberHalfYearTrans=='' || this.limitDetailAdd.numberHalfYearTrans==undefined)){
       			this.$message("半年限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailAdd.numberYearTransFlag=='Y') && 
       			(this.limitDetailAdd.numberYearTrans=='' || this.limitDetailAdd.numberYearTrans==undefined)){
       			this.$message("全年限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailAdd.numberLifeCycleTransFlag=='Y') && 
       			(this.limitDetailAdd.numberLifeCycleTrans=='' || this.limitDetailAdd.numberLifeCycleTrans==undefined)){
       			this.$message("全生命周期限制笔数 不能为空")
        		return;
       		}
       		let customerLimitList = {}//客户层
       		let mediaLimitList = {}	//媒介层
       		let productLimitList = {} //产品层
       		//两层 ==（客户层&媒阶层）
       		if(this.limitDetailAdd.levelFlagInfo=='两层'){
       			if(this.limitDetailAdd.signItem=='C'){
       				delete this.limitDetailAdd.signItem
  					this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailAdd))
					this.tempAdd.customerLimitList=JSON.parse(JSON.stringify(this.customerItem))
       			}else if(this.limitDetailAdd.signItem=='M'){
       				delete this.limitDetailAdd.signItem
       				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailAdd))
					this.tempAdd.mediaLimitList=JSON.parse(JSON.stringify(this.customerItem))
       			}
       		}
       		//客户层保存数据customerLimitList
       		if(this.limitDetailAdd.levelFlagInfo=='客户层' && this.limitDetailAdd.signItem=='C'){
       			delete this.limitDetailAdd.signItem
       			this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailAdd))
				this.tempAdd.customerLimitList=JSON.parse(JSON.stringify(this.customerItem))
				this.limitDetailAdd = {};
       			
       		}
			//媒阶层保存数据mediaLimitList
			if(this.limitDetailAdd.levelFlagInfo=='媒介层' && this.limitDetailAdd.signItem=='M'){
				delete this.limitDetailAdd.signItem
				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailAdd))
				this.tempAdd.mediaLimitList=JSON.parse(JSON.stringify(this.customerItem))
				this.limitDetailAdd = {};
			}
			//产品层保存数据productLimitList
			if(this.limitDetailAdd.levelFlagInfo=='产品层' && this.limitDetailAdd.signItem=='P'){
				delete this.limitDetailAdd.signItem
				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailAdd))
				this.tempAdd.productLimitList=JSON.parse(JSON.stringify(this.customerItem))
			}
       		this.dialogFormVisibleConlimitSelDetail = false
       	},
       	closeDetail(){
       		this.dialogFormVisibleConlimitSelDetail = false
       	},
       	//确认提交新增数据
        createData() {
        	this.tempAdd.excpListCode = this.tempAdd.contrlSceneCode
        	this.post('/beta/betaService/AUS.PM.02.0101', this.tempAdd, (res) => {
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
        },
        closeAddPopup(){
        	this.tempAdd = {}
        	this.dialogFormVisibleAdd = false
        },
      	//显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.getDetailList(row)
        },
        getDetailList(row) {
            this.detailLoading1 = true
            let itemList = {
                authDataSynFlag: "1",
                differentType: row.differentType,
                flag: 'F',
                listCode: row.listCode,
                listTyp: row.listTyp,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
                transDict : ['differentType','listTyp'],//翻译前后key
            }
            itemList = Object.assign ( itemList, this.queryForm )
            if(itemList.differentType=='4' || itemList.differentType=='0' || itemList.differentType=='1'){
                this.getTableList('/beta/betaService/AUS.PM.02.0202', itemList ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tempDetailList1 = res.returnData.rows
                            this.tempDetailList2 = res.returnData.rows
                            ///this.tableTotalA = res.returnData.totalCount
                            this.detailLoading1 = false
                        }
                    }
                })
            }else if(itemList.differentType=='2' || itemList.differentType=='3'){
            	this.getTableList('/authService/AUS.PM.02.0207', itemList ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tempDetailList1 = res.returnData.rows
                            this.tempDetailList2 = res.returnData.rows
                            this.detailLoading1 = false
                        }
                    }
                })
            }
        },
        /*----显示修改弹框----*/
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
           	if(row.differentFlagType){//差异化类型限制
            	this.upCheckedCitiesDifferent = row.differentFlagType.split(',')
            }
            if(row.listCheckType){//层级限制
            	this.UpCheckedCities = row.listCheckType.split(',')
            }
           	this.tempUpC = this.tempUp.customerLimitList//客户层
            this.tempUpM = this.tempUp.mediaLimitList//媒阶层
            this.tempUpP = this.tempUp.productLimitList//产品层
            this.dialogFormVisibleUp= true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
       	//差异化类型限制--多选
		upHandleCheckedDifferentChange(value) {
			let up_arrDiff = value
			let str1 = ""; 
			for (let i = 0; i < up_arrDiff.length; i++) {
			      if (i < up_arrDiff.length - 1) {
			        str1 += up_arrDiff[i] + ",";
			      } else {
			        str1 += up_arrDiff[i];
			      }
			}
			this.tempUp.upCheckedCitiesDifferent=str1
		},
		//清单类型--多选
		upHandleCheckedCitiesChange(value) {
			let up_arrListType = value
			let str2 = ""; 
			for (let i = 0; i < up_arrListType.length; i++) {
			      if (i < up_arrListType.length - 1) {
			        str2 += up_arrListType[i] + ",";
			      } else {
			        str2 += up_arrListType[i];
			      }
			}
	        this.tempUp.UpCheckedCities = str2;
	    },
       	//修改客户层交易限制
	    customerListUp(){
	    	this.tempUpC.push(//增加就push进数组一个新值
	          	{
		            id:this.dataNum++,
		            currencyCode: '',
		            mandatoryInspectionFlag:'',
		        }
	        )
	        if(this.tempUpC.length>=5){
	        	this.showCustomerBtn = false
	        }
	    },
	    //删除
	    delupItemC(row){
	     	this.tempUpC.splice(row,1)
	    },
	    //修改媒阶层交易限制
	    mediumListUp(){
	    	this.tempUpM.push(//增加就push进数组一个新值
	          	{
		            id:this.dataNum++,
		            currencyCode: '',
		            mandatoryInspectionFlag:'',
		        }
	        )
	        if(this.tempUpM.length>=5){
	        	this.showMediumBtn = false
	        }
	    },
	    //删除
	    delupItemM(row){
	     	this.tempUpM.splice(row,1)
	     },
	    //修改产品层交易限制
	    productListUp(){
	    	this.tempUpP.push(//增加就push进数组一个新值
	          	{
		            id:this.dataNum++,
		            currencyCode: '',
		            mandatoryInspectionFlag:'',
		        }
	        )
	        if(this.tempUpP.length>=5){
	        	this.showMediumBtn = false
	        }
	    },
	   	//删除
	    delupItemP(row){
	     	this.tempUpP.splice(row,1)
	    },
	   	//显示限制详情弹框===客户层===产品层公用
		customerUpInfo(upFormValue,index) {
			this.arrIndex = index;
			if(upFormValue.currencyCode){
          		if (upFormValue.mandatoryInspectionFlag) {
            		let allLimitSelC = {}
        			if(this.tempUp.transLimitLev=="C" || this.tempUp.transLimitLev=="B"){ //===客户层
	        			allLimitSelC.sign = 'C'
		        		allLimitSelC.currencyCode = upFormValue.currencyCode //限制币种
		                allLimitSelC.mandatoryInspectionFlag = upFormValue.mandatoryInspectionFlag//强制检查标志
		            }else  if(this.tempUp.transLimitLev=="P"){ //===产品层
		        		allLimitSelC.sign = 'P'
		    		 	allLimitSelC.currencyCode = upFormValue.currencyCode //限制币种
		                allLimitSelC.mandatoryInspectionFlag = upFormValue.mandatoryInspectionFlag//强制检查标志
        			}
	        	allLimitSelC.authDataSynFlag = "1";
	            allLimitSelC.operationMode = this.tempUp.operationMode;   //运营模式
	            allLimitSelC.levelFlag = this.tempUp.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
	            allLimitSelC.differentType = 0;   //差异类型
	            allLimitSelC.contrlSceneCode = this.tempUp.contrlSceneCode//管控场景代码
		        this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelC, (res) => {
	                if (res.returnCode == '000000') {
	                	//---差异化类型
	                	this.limitDetailUp=upFormValue
	                	if(this.tempUp.differentType=='1'){
	                		this.limitDetailUp.differentTypeCusInfo = '风险组别'
	                		
	                	}else if(this.tempUp.differentType=='2'){
	                		this.limitDetailUp.differentTypeCusInfo = '客户'
	                	}else if(this.tempUp.differentType=='3'){
	                		this.limitDetailUp.differentTypeCusInfo = '媒介'
	                	}else if(this.tempUp.differentType=='4'){
	                		this.limitDetailUp.differentTypeCusInfo = '产品维度'
	                	}else {
	                		this.limitDetailUp.differentTypeCusInfo = '无'
	                	}
	                	//---币种
	                	if(upFormValue.currencyCode=='156'){
                			this.limitDetailUp.currencyCodeInfo = '人民币'
                		}else if(upFormValue.currencyCode=='840'){
                			this.limitDetailUp.currencyCodeInfo = '美元'
                		}
                		//---客户
	                	if(allLimitSelC.levelFlag=='C'){
	                		this.titleName = '客户层交易限制信息'
	                		this.limitDetailUp.levelFlagInfo = '客户层'
							this.limitDetailUp.signItem =allLimitSelC.sign 
	                    	this.dialogFormVisibleUpLimitSelDetail = true
	                    }else if(allLimitSelC.levelFlag=='P'){//---产品
	                		this.titleName = '产品层交易限制信息'
	                		this.limitDetailUp.levelFlagInfo = '产品层'
	                		this.limitDetailUp.signItem =allLimitSelC.sign 
	                		this.dialogFormVisibleUpLimitSelDetail = true
	                		
	                	}else if(allLimitSelC.levelFlag=='B'){//---两层
	                		this.titleName = '客户层交易限制详细信息'
	                		this.limitDetailUp.levelFlagInfo = '两层'
	                		this.limitDetailUp.signItem =allLimitSelC.sign 
	                		this.dialogFormVisibleUpLimitSelDetail = true
	                	}
	               	}
	            })
		   	}else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
        },
       	//媒介层限制详情
       	exceTypeUpInfo(upFormValue,index){
       		this.arrIndex = index;
       		if(upFormValue.currencyCode){
          		if (upFormValue.mandatoryInspectionFlag) {
		       		let  allLimitSelM = {}
		       		allLimitSelM = upFormValue
		       		allLimitSelM.sign = 'M'
		       		allLimitSelM.authDataSynFlag = "1";
		            allLimitSelM.operationMode = this.tempUp.operationMode;   //运营模式
		            allLimitSelM.levelFlag = this.tempUp.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
		            allLimitSelM.differentType = 0;   //差异类型
		            allLimitSelM.contrlSceneCode = this.tempUp.contrlSceneCode//管控场景代码
		           	this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelM, (res) => {
		                if (res.returnCode == '000000') {
		                	this.limitDetailUp=upFormValue
		                	this.titleName = '媒介层交易限制信息'
		                	//---差异化类型
		                	if(this.tempUp.differentType=='1'){
		                		this.limitDetailUp.differentTypeCusInfo = '风险组别'
		                	}else if(this.tempUp.differentType=='2'){
		                		this.limitDetailUp.differentTypeCusInfo = '客户'
		                	}else if(this.tempUp.differentType=='3'){
		                		this.limitDetailUp.differentTypeCusInfo = '媒介'
		                	}else if(this.tempUp.differentType=='4'){
		                		this.limitDetailUp.differentTypeCusInfo = '产品维度'
		                	}else {
		                		this.limitDetailUp.differentTypeCusInfo = '无'
		                	}
		                	//---币种
		                	if(upFormValue.currencyCode=='156'){
	                			this.limitDetailUp.currencyCodeInfo = '人民币'
	                		}else if(upFormValue.currencyCode=='840'){
	                			this.limitDetailUp.currencyCodeInfo = '美元'
	                		}
	                		//---媒介
		                	if(allLimitSelM.levelFlag=='M'){
		                		this.limitDetailUp.levelFlagInfo = '媒介层'
		                		this.limitDetailUp.signItem =allLimitSelM.sign 
		                		this.dialogFormVisibleUpLimitSelDetail = true
		                		
		                	}else if(allLimitSelM.levelFlag=='B'){//---两层
		                		this.limitDetailUp.levelFlagInfo = '两层'
		                		this.limitDetailUp.signItem =allLimitSelM.sign 
		                		this.dialogFormVisibleUpLimitSelDetail = true
		                	}
		               	}
		            })
		        }else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
       	},
    	//限制详情确认保存数据Btn
       	upLimitData(){
       		//限额上限
       		if((this.limitDetailUp.limitSingleTransFlag=="Y") && 
       			(this.limitDetailUp.limitSingleTrans=='' || this.limitDetailUp.limitSingleTrans==undefined)){
       			this.$message("单笔限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailUp.limitDayTransFlag=='Y') && 
       			(this.limitDetailUp.limitDayTrans=='' ||  this.limitDetailUp.limitDayTrans==undefined)){
       			this.$message("日限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailUp.limitCycleTransFlag=='Y') && 
       			(this.limitDetailUp.limitCycleTrans=='' || this.limitDetailUp.limitCycleTrans==undefined)){
       			this.$message("CYCLE限制金额 不能为空")
        		return;
       		}
       		if((this.limitDetailUp.limitMonthTransFlag=='Y') && 
       			(this.limitDetailUp.limitMonthTrans=='' || this.limitDetailUp.limitMonthTrans==undefined)){
       			this.$message("月限制金额 不能为空")
        		return;
       		}
       		if((this.limitDetailUp.limitHalfYearTransFlag=='Y') && 
       			(this.limitDetailUp.limitHalfYearTrans=='' || this.limitDetailUp.limitHalfYearTrans==undefined)){
       			this.$message("半年限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailUp.limitYearTransFlag=='Y') && 
       			(this.limitDetailUp.limitYearTrans=='' || this.limitDetailUp.limitYearTrans==undefined)){
       			this.$message("全年限额检查不能为空")
        		return;
       		}
       		if((this.limitDetailUp.limitLifeCycleTransFlag=='Y') && 
       			(this.limitDetailUp.limitLifeCycleTrans=='' || this.limitDetailUp.limitLifeCycleTrans==undefined)){
       			this.$message("全生命周期限制金额 不能为空")
        		return;
       		}
       		//限次上限
       		if((this.limitDetailUp.numberDayTransFlag=='Y') && 
       			(this.limitDetailUp.numberDayTrans=='' || this.limitDetailUp.numberDayTrans==undefined)){
       			this.$message("日限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailUp.numberCycleTransFlag=='Y') && 
       			(this.limitDetailUp.numberCycleTrans=='' || this.limitDetailUp.numberCycleTrans==undefined)){
       			this.$message("CYCLE限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailUp.numberMonthTransFlag=='Y') && 
       			(this.limitDetailUp.numberMonthTrans=='' || this.limitDetailUp.numberMonthTrans==undefined)){
       			this.$message("月限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailUp.numberHalfYearTransFlag=='Y') && 
       			(this.limitDetailUp.numberHalfYearTrans=='' || this.limitDetailUp.numberHalfYearTrans==undefined)){
       			this.$message("半年限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailUp.numberYearTransFlag=='Y') && 
       			(this.limitDetailUp.numberYearTrans=='' || this.limitDetailUp.numberYearTrans==undefined)){
       			this.$message("全年限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailUp.numberLifeCycleTransFlag=='Y') && 
       			(this.limitDetailUp.numberLifeCycleTrans=='' || this.limitDetailUp.numberLifeCycleTrans==undefined)){
       			this.$message("全生命周期限制笔数 不能为空")
        		return;
       		}
       		let customerLimitList = {}//客户层
       		let mediaLimitList = {}	//媒介层
       		let productLimitList = {} //产品层
       		//两层 ==（客户层&媒阶层）
       		if(this.limitDetailUp.levelFlagInfo=='两层'){
       			if(this.limitDetailUp.signItem=='C'){
       				delete this.limitDetailUp.signItem
  					this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailUp))
					this.tempUp.customerLimitList=JSON.parse(JSON.stringify(this.customerItem))
					
       			}else if(this.limitDetailUp.signItem=='M'){
       				delete this.limitDetailUp.signItem
       				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailUp))
					this.tempUp.mediaLimitList=JSON.parse(JSON.stringify(this.customerItem))
       			}
       		}
       		//客户层保存数据customerLimitList
       		if(this.limitDetailUp.levelFlagInfo=='客户层' && this.limitDetailUp.signItem=='C'){
       			delete this.limitDetailUp.signItem
       			this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailUp))
				this.tempUp.customerLimitList=JSON.parse(JSON.stringify(this.customerItem))
				this.limitDetailUp = {};
       			
       		}
			//媒阶层保存数据mediaLimitList
			if(this.limitDetailUp.levelFlagInfo=='媒介层' && this.limitDetailUp.signItem=='M'){
				delete this.limitDetailUp.signItem
				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailUp))
				this.tempUp.mediaLimitList=JSON.parse(JSON.stringify(this.customerItem))
				this.limitDetailUp = {};
			}
			//产品层保存数据productLimitList
			if(this.limitDetailUp.levelFlagInfo=='产品层' && this.limitDetailUp.signItem=='P'){
				delete this.limitDetailUp.signItem
				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailUp))
				this.tempUp.productLimitList=JSON.parse(JSON.stringify(this.customerItem))
			}
       		this.dialogFormVisibleUpLimitSelDetail = false
       	},
       	//确认修改提交数据
       	subUpData() {
       		if(this.tempUp.transLimitLev=='B'){
       			if(this.tempUp.customerLimitList.length==0){
       				this.$message('请设置完整客户层的交易限制')
       				return;
       			}else if(this.tempUp.mediaLimitList.length==0){
       				this.$message('请设置完整媒介层的交易限制')
       				return;
       			}
       		}else if(this.tempUp.transLimitLev=='C'){
       			if(this.tempUp.customerLimitList.length==0){
       				this.$message('请设置完整客户层的交易限制')
       				return;
       			}
       		}else if(this.tempUp.transLimitLev=='M'){
       			if(this.tempUp.mediaLimitList.length==0){
       				this.$message('请设置完整客户层的交易限制')
       				return;
       			}
       		}else if(this.tempUp.transLimitLev=='P'){
       			if(this.tempUp.productLimitList.length==0){
       				this.$message('请设置完整产品层的交易限制')
       				return;
       			}
       		}
        	this.tempUp.excpListCode = this.tempUp.contrlSceneCode
        	this.post('/beta/betaService/AUS.PM.02.0103', this.tempUp, (res) => {
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
       	/*----显示差异化弹框------*/
        copyListCon(row,copyItem){
        	this.tempCopy = Object.assign({}, row)
        	if(row.differentFlagType){//差异化类型限制
            	this.copyCheckedCitiesDifferent = row.differentFlagType.split(',')
            }
            if(row.listCheckType){//层级限制
            	this.copyCheckedCities = row.listCheckType.split(',')
            }
            //基本信息差异化类型
            if(this.differentType=='0'){
            	this.tempCopy.listDifferentFlag=''//正负面清单差异化标志
            	this.tempCopy.transDifferentFlag=''//交易限制信息差异化标志
            }
            //正负面清单差异化标志或者检查标志有值
            if(row.listDifferentFlag=="Y" || row.pnListCheckFlag!=''){
            	this.showCopyPnListCheckFlag = true//检查标志
            }else{
            	this.showCopyPnListCheckFlag = false
            }
            //正负面清单检查标志
            if(row.listDifferentFlag=="Y" || row.pnListCheckFlag=='N' || row.pnListCheckFlag=='P'){
            	this.showCopyListCheckType=true//层级限制
            	this.showCopyListCheck = true
        	}else{
        		this.showCopyListCheckType=false
        		this.showCopyListCheck = false
        	}
           	//交易限制信息或者层级限制不等于（N:不限制）
           	if(row.transDifferentFlag=="Y" || row.transLimitLev!='N'){
            	this.showCopyHierarchica=true//层级限制与限制币种
            	this.showCopyTransLimitLev=true//层级限制
            }else{
        		this.showCopyHierarchica=false
        		this.showCopyTransLimitLev=false
        	}
           	this.tempCopyC = this.tempCopy.customerLimitList//客户层
            this.tempCopyM = this.tempCopy.mediaLimitList//媒阶层
            this.tempCopyP = this.tempCopy.productLimitList//产品层
            this.dialogFormVisibleCopy= true
            this.$nextTick(() => {
                this.$refs['dataFormCopy'].clearValidate()
            })
        },
        //监听基本信息差异化类型
        differentTypeChange(val){
        	this.tempCopy.listDifferentFlag=''//正负面清单差异化标志
           	this.tempCopy.transDifferentFlag=''//交易限制信息差异化标志
        },
        //监听差异化标志==Y显示检查标志
       	listDifferentFlagCopyChange(val){
       		if(val=="Y"){
       			this.showCopyListCheck=true
       		}else{
       			this.showCopyListCheck=false
       		}
       	},
       	//监听交易限制差异化标志
       	transDifferentFlagCopyChange(val){
       		if(val=="Y"){
       			this.showCopyHierarchica =true
       		}else{
       			this.showCopyHierarchica =false
       		}
       	},
        //差异化类型限制--多选
		copyHandleCheckedDifferentChange(value) {
			let copy_arrDiff = value
			let str1 = ""; 
			for (let i = 0; i < copy_arrDiff.length; i++) {
			      if (i < copy_arrDiff.length - 1) {
			        str1 += copy_arrDiff[i] + ",";
			      } else {
			        str1 += copy_arrDiff[i];
			      }
			}
			this.tempCopy.differentFlagType=str1
		},
		//清单类型--多选
		copyHandleCheckedCitiesChange(value) {
			let copy_arrListType = value
			let str2 = ""; 
			for (let i = 0; i < copy_arrListType.length; i++) {
		      	if (i < copy_arrListType.length - 1) {
			        str2 += copy_arrListType[i] + ",";
		      	} else {
			        str2 += copy_arrListType[i];
		      	}
			}
	        this.tempCopy.listCheckType = str2;
	    },
	    //修改客户层交易限制
	    customerListCopy(){
	    	
	        this.tempCopyC.push(//增加就push进数组一个新值
	          	{
		            currencyCode: '',
		            mandatoryInspectionFlag:'',
		        }
	        )
	        if(this.tempCopyC.length>=5){
	        	this.showCustomerBtn = false
	        }
	    },
	    //删除
	    delCopyItemC(row){
	    	this.tempCopyC.splice(row,1)
	    },
	    //修改媒阶层交易限制
	    mediumListCopy(){
	    	this.tempCopyM.push(//增加就push进数组一个新值
	          	{
		            currencyCode: '',
		            mandatoryInspectionFlag:'',
		        }
	        )
	        if(this.tempCopyM.length>=5){
	        	this.showMediumBtn = false
	        }
	    },
	    //删除
	    delCopyItemM(row){
	    	this.tempCopyM.splice(row,1)
	    },
	    //修改产品层交易限制
	    productListCopy(){
	    	this.tempCopyP.push(//增加就push进数组一个新值
	          	{
		            currencyCode: '',
		            mandatoryInspectionFlag:'',
		        }
	        )
	        if(this.tempCopyP.length>=5){
	        	this.showMediumBtn = false
	        }
	    },
	    //删除
	    delCopyItemP(row){
	    	this.tempCopyP.splice(row,1)
	    },
	    //显示差异化限制详情弹框===客户层===产品层公用
		customerCopyInfo(copyFormValue,index) {
			//console.log(copyFormValue)
			this.arrIndex = index;
			if(copyFormValue.currencyCode){
          		if (copyFormValue.mandatoryInspectionFlag) {
            		let allLimitSelC = {}
        			if(this.tempCopy.transLimitLev=="C" || this.tempCopy.transLimitLev=="B"){ //===客户层
	        			allLimitSelC.sign = 'C'
		        		allLimitSelC.currencyCode = copyFormValue.currencyCode //限制币种
		                allLimitSelC.mandatoryInspectionFlag = copyFormValue.mandatoryInspectionFlag//强制检查标志
	        		}else  if(this.tempCopy.transLimitLev=="P"){ //===产品层
		        		allLimitSelC.sign = 'P'
		    		 	allLimitSelC.currencyCode = copyFormValue.currencyCode //限制币种
		                allLimitSelC.mandatoryInspectionFlag = copyFormValue.mandatoryInspectionFlag//强制检查标志
        		}
	        	allLimitSelC.authDataSynFlag = "1";
	            allLimitSelC.operationMode = this.tempCopy.operationMode;   //运营模式
	            allLimitSelC.levelFlag = this.tempCopy.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
	            allLimitSelC.differentType = 0;   //差异类型
	            allLimitSelC.contrlSceneCode = this.tempCopy.contrlSceneCode//管控场景代码
	            this.$refs['dataFormCopy'].validate((valid) => {
        			if (valid) {
				        this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelC, (res) => {
			                if (res.returnCode == '000000') {
			                	//---差异化类型
			                	this.limitDetailCopy=copyFormValue
			                	if(this.tempCopy.differentType=='1'){
			                		this.limitDetailCopy.differentTypeCusInfo = '风险组别'
			                		
			                	}else if(this.tempCopy.differentType=='2'){
			                		this.limitDetailCopy.differentTypeCusInfo = '客户'
			                	}else if(this.tempCopy.differentType=='3'){
			                		this.limitDetailCopy.differentTypeCusInfo = '媒介'
			                	}else if(this.tempCopy.differentType=='4'){
			                		this.limitDetailCopy.differentTypeCusInfo = '产品维度'
			                	}else {
			                		this.limitDetailCopy.differentTypeCusInfo = '无'
			                	}
			                	//---币种
			                	if(copyFormValue.currencyCode=='156'){
		                			this.limitDetailCopy.currencyCodeInfo = '人民币'
		                		}else if(copyFormValue.currencyCode=='840'){
		                			this.limitDetailCopy.currencyCodeInfo = '美元'
		                		}
		                		//---客户
			                	if(allLimitSelC.levelFlag=='C'){
			                		this.titleName = '客户层交易限制详细信息'
			                		this.limitDetailCopy.levelFlagInfo = '客户层'
									this.limitDetailCopy.signItem =allLimitSelC.sign 
			                    	this.dialogFormVisibleCopyLimitSelDetail = true
			                    	
			                	}else if(allLimitSelC.levelFlag=='P'){//---产品
			                		this.titleName = '产品层交易限制详细信息'
			                		this.limitDetailCopy.levelFlagInfo = '产品层'
			                		this.limitDetailCopy.signItem =allLimitSelC.sign 
			                		this.dialogFormVisibleCopyLimitSelDetail = true
			                		
			                	}else if(allLimitSelC.levelFlag=='B'){//---两层
			                		this.titleName = '客户层交易限制详细信息'
			                		this.limitDetailCopy.levelFlagInfo = '两层'
			                		this.limitDetailCopy.signItem =allLimitSelC.sign 
			                		this.dialogFormVisibleCopyLimitSelDetail = true
			                	}
			               	}
			            })
				    }    
		        })
		   	}else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
        },
       	//媒介层限制详情
       	exceTypeCopyInfo(copyFormValue,index){
       		this.arrIndex = index;
       		if(copyFormValue.currencyCode){
          		if (copyFormValue.mandatoryInspectionFlag) {
		       		let  allLimitSelM = {}
		       		allLimitSelM = copyFormValue
		       		allLimitSelM.sign = 'M'
		       		allLimitSelM.authDataSynFlag = "1";
		            allLimitSelM.operationMode = this.tempCopy.operationMode;   //运营模式
		            allLimitSelM.levelFlag = this.tempCopy.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
		            allLimitSelM.differentType = 0;   //差异类型
		            allLimitSelM.contrlSceneCode = this.tempCopy.contrlSceneCode//管控场景代码
		            this.$refs['dataFormCopy'].validate((valid) => {
            			if (valid) {
				           	this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelM, (res) => {
				                if (res.returnCode == '000000') {
				                	this.limitDetailCopy=copyFormValue
				                	this.titleName = '媒介层交易限制详细信息'
				                	//---差异化类型
				                	if(this.tempCopy.differentType=='1'){
				                		this.limitDetailCopy.differentTypeCusInfo = '风险组别'
				                	}else if(this.tempCopy.differentType=='2'){
				                		this.limitDetailCopy.differentTypeCusInfo = '客户'
				                	}else if(this.tempCopy.differentType=='3'){
				                		this.limitDetailCopy.differentTypeCusInfo = '媒介'
				                	}else if(this.tempCopy.differentType=='4'){
				                		this.limitDetailCopy.differentTypeCusInfo = '产品维度'
				                	}else {
				                		this.limitDetailCopy.differentTypeCusInfo = '无'
				                	}
				                	//---币种
				                	if(copyFormValue.currencyCode=='156'){
			                			this.limitDetailCopy.currencyCodeInfo = '人民币'
			                		}else if(copyFormValue.currencyCode=='840'){
			                			this.limitDetailCopy.currencyCodeInfo = '美元'
			                		}
			                		//---媒介
				                	if(allLimitSelM.levelFlag=='M'){
				                		this.limitDetailCopy.levelFlagInfo = '媒介层'
				                		this.limitDetailCopy.signItem =allLimitSelM.sign 
				                		this.dialogFormVisibleCopyLimitSelDetail = true
				                		
				                	}else if(allLimitSelM.levelFlag=='B'){//---两层
				                		this.limitDetailCopy.levelFlagInfo = '两层'
				                		this.limitDetailCopy.signItem =allLimitSelM.sign 
				                		this.dialogFormVisibleCopyLimitSelDetail = true
				                	}
				               	}
				            })
		           		}
		           	})
		        }else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
       	},
    	//限制详情确认保存数据Btn
       	copyLimitData(){
       		//限额上限
       		if((this.limitDetailCopy.limitSingleTransFlag=="Y") && 
       			(this.limitDetailCopy.limitSingleTrans=='' || this.limitDetailCopy.limitSingleTrans==undefined)){
       			this.$message("单笔限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailCopy.limitDayTransFlag=='Y') && 
       			(this.limitDetailCopy.limitDayTrans=='' ||  this.limitDetailCopy.limitDayTrans==undefined)){
       			this.$message("日限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailCopy.limitCycleTransFlag=='Y') && 
       			(this.limitDetailCopy.limitCycleTrans=='' || this.limitDetailCopy.limitCycleTrans==undefined)){
       			this.$message("CYCLE限制金额 不能为空")
        		return;
       		}
       		if((this.limitDetailCopy.limitMonthTransFlag=='Y') && 
       			(this.limitDetailCopy.limitMonthTrans=='' || this.limitDetailCopy.limitMonthTrans==undefined)){
       			this.$message("月限制金额 不能为空")
        		return;
       		}
       		if((this.limitDetailCopy.limitHalfYearTransFlag=='Y') && 
       			(this.limitDetailCopy.limitHalfYearTrans=='' || this.limitDetailCopy.limitHalfYearTrans==undefined)){
       			this.$message("半年限制金额不能为空")
        		return;
       		}
       		if((this.limitDetailCopy.limitYearTransFlag=='Y') && 
       			(this.limitDetailCopy.limitYearTrans=='' || this.limitDetailCopy.limitYearTrans==undefined)){
       			this.$message("全年限额检查不能为空")
        		return;
       		}
       		if((this.limitDetailCopy.limitLifeCycleTransFlag=='Y') && 
       			(this.limitDetailCopy.limitLifeCycleTrans=='' || this.limitDetailCopy.limitLifeCycleTrans==undefined)){
       			this.$message("全生命周期限制金额 不能为空")
        		return;
       		}
       		//限次上限
       		if((this.limitDetailCopy.numberDayTransFlag=='Y') && 
       			(this.limitDetailCopy.numberDayTrans=='' || this.limitDetailCopy.numberDayTrans==undefined)){
       			this.$message("日限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailCopy.numberCycleTransFlag=='Y') && 
       			(this.limitDetailCopy.numberCycleTrans=='' || this.limitDetailCopy.numberCycleTrans==undefined)){
       			this.$message("CYCLE限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailCopy.numberMonthTransFlag=='Y') && 
       			(this.limitDetailCopy.numberMonthTrans=='' || this.limitDetailCopy.numberMonthTrans==undefined)){
       			this.$message("月限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailCopy.numberHalfYearTransFlag=='Y') && 
       			(this.limitDetailCopy.numberHalfYearTrans=='' || this.limitDetailCopy.numberHalfYearTrans==undefined)){
       			this.$message("半年限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailCopy.numberYearTransFlag=='Y') && 
       			(this.limitDetailCopy.numberYearTrans=='' || this.limitDetailCopy.numberYearTrans==undefined)){
       			this.$message("全年限制笔数不能为空")
        		return;
       		}
   			if((this.limitDetailCopy.numberLifeCycleTransFlag=='Y') && 
       			(this.limitDetailCopy.numberLifeCycleTrans=='' || this.limitDetailCopy.numberLifeCycleTrans==undefined)){
       			this.$message("全生命周期限制笔数 不能为空")
        		return;
       		}
       		let customerLimitList = {}//客户层
       		let mediaLimitList = {}	//媒介层
       		let productLimitList = {} //产品层
       		//两层 ==（客户层&媒阶层）
       		if(this.limitDetailCopy.levelFlagInfo=='两层'){
       			if(this.limitDetailCopy.signItem=='C'){
       				delete this.limitDetailCopy.signItem
  					this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailCopy))
					this.tempCopy.customerLimitList=JSON.parse(JSON.stringify(this.customerItem))
					
       			}else if(this.limitDetailCopy.signItem=='M'){
       				delete this.limitDetailCopy.signItem
       				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailCopy))
					this.tempCopy.mediaLimitList=JSON.parse(JSON.stringify(this.customerItem))
       			}
       		}
       		//客户层保存数据customerLimitList
       		if(this.limitDetailCopy.levelFlagInfo=='客户层' && this.limitDetailUp.signItem=='C'){
       			delete this.limitDetailCopy.signItem
       			this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailCopy))
				this.tempCopy.customerLimitList=JSON.parse(JSON.stringify(this.customerItem))
				this.limitDetailUp = {};
       			
       		}
			//媒阶层保存数据mediaLimitList
			if(this.limitDetailCopy.levelFlagInfo=='媒介层' && this.limitDetailUp.signItem=='M'){
				delete this.limitDetailCopy.signItem
				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailCopy))
				this.tempCopy.mediaLimitList=JSON.parse(JSON.stringify(this.customerItem))
				this.limitDetailUp = {};
			}
			//产品层保存数据productLimitList
			if(this.limitDetailCopy.levelFlagInfo=='产品层' && this.limitDetailUp.signItem=='P'){
				delete this.limitDetailCopy.signItem
				this.customerItem[this.arrIndex]= JSON.parse(JSON.stringify(this.limitDetailCopy))
				this.tempCopy.productLimitList=JSON.parse(JSON.stringify(this.customerItem))
			}
       		this.dialogFormVisibleCopyLimitSelDetail = false
       	},
       	//确认差异化提交数据
       	subCopyData() {
        	this.tempUp.excpListCode = this.tempCopy.contrlSceneCode
        	this.post('/beta/betaService/AUS.PM.02.0101', this.tempCopy, (res) => {
				if (res.returnCode == '000000') {
						this.dialogFormVisibleCopy = false
					this.$notify({
						title: 'Success',
						message: '修改成功',
						type: 'success',
						duration: 2000
					}) 
					this.getList()
					this.tempCopy = {}
				}
           	})
        },
        /*----显示场景识别弹框----*/
        authTradInfo(row){
        	this.dialogFormVisibleSce= true
        	this.getSceList(row)
        	this.$nextTick(() => {
                this.$refs['dataFormSce'].clearValidate()
            })
        },
        
        //场景识别列表
       	getSceList(row){
       		this.sceListLoading = true
        	let contrlSceneCodeItem={
        		contrlSceneCode: row.contrlSceneCode,
        		operationMode: row.operationMode,
        		pageNum: this.scePage.pageNum,
        		pageSize: this.scePage.pageSize,
        		isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_invalidFlag'],//查找数据字典所需参数
				transDict : ['invalidFlag'],//翻译前后key
        	}
    	 	this.getTableList('/beta/betaService/AUS.PM.02.0002',contrlSceneCodeItem ,(res) => {
                if (res.returnCode == '000000') {
                	this.sceListLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tempSce = res.returnData.rows[0]
                        this.tableSceList = res.returnData.rows
                        this.tableTotalSce = res.returnData.totalCount
              
                    }else {
                    	this.tableSceList = []
                        this.tableTotalSce = 0
                    }
                }
            }, (err) => {
            	this.tableSceList = []
                this.tableTotalSce = 0
                this.sceListLoading = false
            })
        },
        //修改场景识别显示的弹框
        handleUpSce(row){
        	this.upSceInfo = Object.assign({}, row)
      		this.cardUpdateList = this.upSceInfo.cardAssociations//卡组织标识
            this.tradUpdateList = this.upSceInfo.transScene//交易场景
           	if(row.contListType){//例外清单信息--清单类型
            	this.sceCheckedCities = row.contListType.split(',')
            }
            if(row.excpListType){//管控清单检查标志--清单类型
            	this.sceExcpListType = row.excpListType.split(',')
            }
            if(this.cardUpdateList.length=='0'){
      			this.cardSelinfoUp = true
      		}else{
      			this.cardSelinfoUp = false
      		}
            if(this.tradUpdateList.length=='0'){
      			this.tradSelinfoUp = true
      		}else{
      			this.tradSelinfoUp = false
      		}
            this.dialogFormVisibleUpSce= true
        	this.getTransSceneOptions(row)
        	this.$nextTick(() => {
                this.$refs['dataFormUpSce'].clearValidate()
            })
        },
        //交易场景
        getTransSceneOptions(row){
        	let transSceneItem = {
        		operationMode: row.operationMode,
        		applicationRange: 'C',
        	}
        	this.post( "/beta/betaService/AUS.PM.01.0202",transSceneItem,(res) => {
	          	if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                           arr[index] = {
                                label: item.transSceneDesc,
                                value: item.transSceneCode
                            }
                        })
                        this.transSceneOptions = arr
                    } else {
                        this.transSceneOptions = []
                    }
                }
	      	})
		},
		//场景识别卡组织渠道新增
	    cardTypeAdd(){
	    	this.cardUpdateList.push(//增加就push进数组一个新值
	          	{
		            cardAssociations: '',
		       	}
	        )
	        if(this.cardUpdateList.length>=5){
	        	this.showCardBtn = false
	        }
	    },
		//场景识别交易场景 新增
	    tradTypeAdd(){
	    	this.tradUpdateList.push(//增加就push进数组一个新值
	          	{
		            transScene: '',
		        }
	        )
	        if(this.tradUpdateList.length>=5){
	        	this.showTradBtn = false
	        }
	    },
	    //场景识别卡组织渠道
	   	deleCard(row){
	   		this.cardUpdateList.splice(row,1)
	   	},
	   	deleTrad(row){
	   		this.tradUpdateList.splice(row,1)
	   	},
	    //例外清单:清单类型 --多选
		handleCheckedCitiesChange(value) {
			let arrDiff = value
			let str1 = ""; 
			for (let i = 0; i < arrDiff.length; i++) {
			      if (i < arrDiff.length - 1) {
			        str1 += arrDiff[i] + ",";
			      } else {
			        str1 += arrDiff[i];
			      }
			}
			this.upSceInfo.sceCheckedCitiesType=str1
		},
		//管控清单:清单类型--多选
		handleExcpListTypeChange(value) {
			let arrListType = value
			let str2 = ""; 
			for (let i = 0; i < arrListType.length; i++) {
			    if (i < arrListType.length - 1) {
			        str2 += arrListType[i] + ",";
		      	} else {
			        str2 += arrListType[i];
		      	}
			}
	        this.upSceInfo.listCheckType = str2;
	    },
	    
	    //确认修改场景识别信息
	   	subUpSceData() {
	   		this.upSceInfo.excpListCode = this.upSceInfo.contrlSceneCode
	   		this.upSceInfo.cardAssociations = this.upSceInfo.sceCheckedCitiesType//例外清单--清单类型
	   		this.upSceInfo.transScene = this.upSceInfo.listCheckType//管控清单--清单类型
	   		delete  this.upSceInfo.sceCheckedCitiesType
	   		delete  this.upSceInfo.listCheckType
	   		this.post('/beta/betaService/AUS.PM.02.0003', this.upSceInfo, (res) => {
				if (res.returnCode == '000000') {
						this.dialogFormVisibleUpSce = false
					this.$notify({
						title: 'Success',
						message: '修改成功',
						type: 'success',
						duration: 2000
					}) 
					this.getSceList()
				}
           	})
        },
	    //场景识别详情显示的弹框
        handleSceDetail(row){
        	this.sceDetail = Object.assign({}, row)
        	this.titleName = '查询详细信息'
        	this.showDelBtn=false
        	this.cardDetailList = row.cardAssociations//卡组织标识
        	if(this.cardDetailList.length!=0){
      			this.cardSelinfoN = false
      			this.cardSelinfois = true
      		}else{
      			this.cardSelinfoN = true
      			this.cardSelinfois = false
      		}
            this.tradDetailList = row.transScene//交易场景
            if(this.tradDetailList.length!=0){
            	this.tradSelinfoN=false
            	this.tradSelinfois=true
            }else{
            	this.tradSelinfoN=true
            	this.tradSelinfois=false
            }
            if(row.contListType){//例外清单信息--清单类型
        		this.sceDetailCheckedCities = row.contListType.split(',')
            }
            if(row.excpListType){//管控清单检查标志--清单类型
            	this.sceDetailExcpListType = row.excpListType.split(',')
            }
        	this.dialogFormVisibleSceDetail= true
        	/*this.getTransSceneOptions(row)*/
        	this.$nextTick(() => {
                this.$refs['dataFormSceDetail'].clearValidate()
            })
        },
        //场景识别详情显示的弹框
        handleSceDel(row){
        	this.sceDetail = Object.assign({}, row)
        	this.titleName = '确认删除信息'
        	this.showDelBtn=true
        	this.cardDetailList = row.cardAssociations//卡组织标识
        	if(this.cardDetailList.length!=0){
      			this.cardSelinfoN = false
      			this.cardSelinfois = true
      		}else{
      			this.cardSelinfoN = true
      			this.cardSelinfois = false
      		}
            this.tradDetailList = row.transScene//交易场景
            if(this.tradDetailList.length!=0){
            	this.tradSelinfoN=false
            	this.tradSelinfois=true
            }else{
            	this.tradSelinfoN=true
            	this.tradSelinfois=false
            }
            if(row.contListType){//例外清单信息--清单类型
        		this.sceDetailCheckedCities = row.contListType.split(',')
            }
            if(row.excpListType){//管控清单检查标志--清单类型
            	this.sceDetailExcpListType = row.excpListType.split(',')
            }
        	this.dialogFormVisibleSceDetail= true
        	this.$nextTick(() => {
                this.$refs['dataFormSceDetail'].clearValidate()
            })
        },
        //确认删除
        subDelInfo(){
        	this.sceDetail.flag ='1'
        	this.post('/beta/betaService/AUS.PM.02.0003', this.sceDetail, (res) => {
				if (res.returnCode == '000000') {
					this.dialogFormVisibleSceDetail = false
					this.$notify({
						title: 'Success',
						message: '删除成功',
						type: 'success',
						duration: 2000
					}) 
					this.getSceList()
				}
           	})
        },
       /*----详情显示的弹框----*/
        handleDetail(row) {
            this.tempDetail = Object.assign({}, row)
           	if(row.differentFlagType){//差异化类型限制
            	this.detailCheckedCitiesDifferent = row.differentFlagType.split(',')
            }
            if(row.listCheckType){//层级限制
            	this.detailCheckedCities = row.listCheckType.split(',')
            }
           	this.tempDetailC = this.tempDetail.customerLimitList//客户层
            this.tempDetailM = this.tempDetail.mediaLimitList//媒阶层
            this.tempDetailP = this.tempDetail.productLimitList//产品层
            this.dialogFormVisibleDetail= true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
        /*----详情限制详情----*/
        handleDetail(row) {
            this.tempDetail = Object.assign({}, row)
           	if(row.differentFlagType){//差异化类型限制
            	this.detailCheckedCitiesDifferent = row.differentFlagType.split(',')
            }
            if(row.listCheckType){//层级限制
            	this.detailCheckedCities = row.listCheckType.split(',')
            }
           	this.tempDetailC = this.tempDetail.customerLimitList//客户层
            this.tempDetailM = this.tempDetail.mediaLimitList//媒阶层
            this.tempDetailP = this.tempDetail.productLimitList//产品层
            this.dialogFormVisibleDetail= true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        },
    	//显示差异化限制详情弹框===客户层===产品层公用
		customerDetail(detailFormValue,index) {
			//console.log(copyFormValue)
			this.arrIndex = index;
			if(detailFormValue.currencyCode){
          		if (detailFormValue.mandatoryInspectionFlag) {
            		let allLimitSelC = {}
        			if(this.tempDetail.transLimitLev=="C" || this.tempDetail.transLimitLev=="B"){ //===客户层
	        			allLimitSelC.sign = 'C'
		        		allLimitSelC.currencyCode = detailFormValue.currencyCode //限制币种
		                allLimitSelC.mandatoryInspectionFlag = detailFormValue.mandatoryInspectionFlag//强制检查标志
	        		}else  if(this.tempDetail.transLimitLev=="P"){ //===产品层
		        		allLimitSelC.sign = 'P'
		    		 	allLimitSelC.currencyCode = detailFormValue.currencyCode //限制币种
		                allLimitSelC.mandatoryInspectionFlag = detailFormValue.mandatoryInspectionFlag//强制检查标志
        		}
	        	allLimitSelC.authDataSynFlag = "1";
	            allLimitSelC.operationMode = this.tempDetail.operationMode;   //运营模式
	            allLimitSelC.levelFlag = this.tempDetail.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
	            allLimitSelC.differentType = 0;   //差异类型
	            allLimitSelC.contrlSceneCode = this.tempDetail.contrlSceneCode//管控场景代码
	            this.$refs['dataFormDetail'].validate((valid) => {
        			if (valid) {
				        this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelC, (res) => {
			                if (res.returnCode == '000000') {
			                	//---差异化类型
			                	this.limitDetail=detailFormValue
			                	if(this.tempDetail.differentType=='1'){
			                		this.limitDetail.differentTypeCusInfo = '风险组别'
			                		
			                	}else if(this.tempDetail.differentType=='2'){
			                		this.limitDetail.differentTypeCusInfo = '客户'
			                	}else if(this.tempDetail.differentType=='3'){
			                		this.limitDetail.differentTypeCusInfo = '媒介'
			                	}else if(this.tempDetail.differentType=='4'){
			                		this.limitDetail.differentTypeCusInfo = '产品维度'
			                	}else {
			                		this.limitDetail.differentTypeCusInfo = '无'
			                	}
			                	//---币种
			                	if(detailFormValue.currencyCode=='156'){
		                			this.limitDetail.currencyCodeInfo = '人民币'
		                		}else if(detailFormValue.currencyCode=='840'){
		                			this.limitDetail.currencyCodeInfo = '美元'
		                		}
		                		//---客户
			                	if(allLimitSelC.levelFlag=='C'){
			                		this.titleName = '客户层交易限制详细信息'
			                		this.limitDetail.levelFlagInfo = '客户层'
									this.limitDetail.signItem =allLimitSelC.sign 
			                    	this.dialogFormVisibleLimitDetail = true
			                    	
			                	}else if(allLimitSelC.levelFlag=='P'){//---产品
			                		this.titleName = '产品层交易限制详细信息'
			                		this.limitDetail.levelFlagInfo = '产品层'
			                		this.limitDetail.signItem =allLimitSelC.sign 
			                		this.dialogFormVisibleLimitDetail = true
			                		
			                	}else if(allLimitSelC.levelFlag=='B'){//---两层
			                		this.titleName = '客户层交易限制详细信息'
			                		this.limitDetail.levelFlagInfo = '两层'
			                		this.limitDetail.signItem =allLimitSelC.sign 
			                		this.dialogFormVisibleLimitDetail = true
			                	}
			               	}
			            })
				    }    
		        })
		   	}else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
        },
       	//媒介层限制详情
       	exceTypeDetail(detailFormValue,index){
       		this.arrIndex = index;
       		if(detailFormValue.currencyCode){
          		if (detailFormValue.mandatoryInspectionFlag) {
		       		let  allLimitSelM = {}
		       		allLimitSelM = detailFormValue
		       		allLimitSelM.sign = 'M'
		       		allLimitSelM.authDataSynFlag = "1";
		            allLimitSelM.operationMode = this.tempDetail.operationMode;   //运营模式
		            allLimitSelM.levelFlag = this.tempDetail.transLimitLev;   //限制层级  客户层C  媒介层M  产品层P
		            allLimitSelM.differentType = 0;   //差异类型
		            allLimitSelM.contrlSceneCode = this.tempDetail.contrlSceneCode//管控场景代码
		            this.$refs['dataFormDetail'].validate((valid) => {
            			if (valid) {
				           	this.post('/beta/betaService/AUS.PM.02.0302', allLimitSelM, (res) => {
				                if (res.returnCode == '000000') {
				                	this.limitDetail=detailFormValue
				                	this.titleName = '媒介层交易限制详细信息'
				                	//---差异化类型
				                	if(this.tempDetail.differentType=='1'){
				                		this.limitDetail.differentTypeCusInfo = '风险组别'
				                	}else if(this.tempDetail.differentType=='2'){
				                		this.limitDetail.differentTypeCusInfo = '客户'
				                	}else if(this.tempDetail.differentType=='3'){
				                		this.limitDetail.differentTypeCusInfo = '媒介'
				                	}else if(this.tempDetail.differentType=='4'){
				                		this.limitDetail.differentTypeCusInfo = '产品维度'
				                	}else {
				                		this.limitDetail.differentTypeCusInfo = '无'
				                	}
				                	//---币种
				                	if(detailFormValue.currencyCode=='156'){
			                			this.limitDetail.currencyCodeInfo = '人民币'
			                		}else if(detailFormValue.currencyCode=='840'){
			                			this.limitDetail.currencyCodeInfo = '美元'
			                		}
			                		//---媒介
				                	if(allLimitSelM.levelFlag=='M'){
				                		this.limitDetail.levelFlagInfo = '媒介层'
				                		this.limitDetail.signItem =allLimitSelM.sign 
				                		this.dialogFormVisibleLimitDetail = true
				                		
				                	}else if(allLimitSelM.levelFlag=='B'){//---两层
				                		this.limitDetail.levelFlagInfo = '两层'
				                		this.limitDetail.signItem =allLimitSelM.sign 
				                		this.dialogFormVisibleLimitDetail = true
				                	}
				               	}
				            })
		           		}
		           	})
		        }else{
	 				this.$message("请设置强制检查标志")
	 			}
        	}else{
        		this.$message("请选择客户层交易的对应限制币种")
        	}
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
.aa {
    transition: all 2s;
}

.go {
    transform: rotate(-180deg);
    transition: all 2s;
}
</style>
