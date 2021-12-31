<!-- 特别状况 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="状况编号" prop="eventId">
                <el-input v-model="queryFormObj.eventId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="描述" prop="eventId">
                <el-input v-model="queryFormObj.eventDesc" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button><!--v-show="selBtnFlag"-->
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()" >新增</el-button><!--v-show="addBtnFlag"-->
            </div>
        </el-form>
        <el-table
            v-loading = "listLoading1"
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border>
            <el-table-column prop="eventNo" label="状况编号" align="center" />
            <el-table-column prop="eventDesc" label="描述" align="center" />
            <el-table-column prop="effectivenessCodeType" label="管控码类别" align="center" />
            <el-table-column prop="effectivenessCodeDesc" label="管控码场景序号" align="center" >
                <span class="tdDivL">{{tableList.effectivenessCodeScene}}&nbsp;</span>
                <span class="tdDivR">{{tableList.effectivenessCodeDesc}}</span>
            </el-table-column>
            <el-table-column prop="sceneTriggerObjectDesc" label="设置层级" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)">详情</el-button> <!--v-show="selBtnFlag"-->
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" >修改</el-button><!--v-show="updBtnFlag"-->
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="特别状况建立" :visible.sync="dialogFormVisibleAdd" width="85%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <div class="mainname titleInfo">特别状况基本信息</div>
                <el-form-item class="cl_td" label="状况编号" prop="eventNo3"
                    :rules="[ { required: true, message: '状况编号不能为空'} ]" >
                        <el-select v-model="tempAdd.eventNo3" class="wd200" :disabled="isAble" clearable
                        style="float: left;">
                          <el-option
                            v-for="(item, index ) in eventNo3Options"
                            :key="index"
                            :label="item.label"
                            :value="item.codes" :disabled="isAble"/>
                        </el-select>
                        <span style="float: left;">&nbsp;&nbsp;.</span>
                        <el-input class=" cl_td" :disabled="isAble"  v-model="tempAdd.eventNo4 " style="float: left;
                            width: 100px !important;" :rules="[ { required: true, message: '状况编号不能为空'} ]"/>
                </el-form-item>
                <el-form-item label="描述"  prop="eventDesc" class="cl_td" :rules="[{ required: true, message: '描述不能为空'}]">
                    <el-input class="wd200 " :disabled="isAble" v-model="tempAdd.eventDesc "/>
                </el-form-item>
                <el-form-item label="管控码"  prop="effectivenessCodeInfo" class="cl_td">
                   <!-- <el-input class="wd200 " :disabled="isAble" v-model="tempAdd.effectivenessInf "  style="width: 160px !important;" />-->
                    <el-select v-model="tempAdd.effectivenessCodeInfo" class="wd180" :disabled="isAble" clearable>
                        <el-option
                        v-for="(item, index ) in effectivenessInfOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.effectivenessCodeScene"
                        />
                    </el-select>
                   <el-button type="primary" icon="el-icon-plus" @click="handleCreateStatus()"
                       style="float: right;" size="small">新增管控码</el-button>
                </el-form-item>
                <el-form-item class="cl_td" label="设置层级" prop="sceneTriggerObject">
                    <el-select v-model="tempAdd.sceneTriggerObject" class="wd200" :disabled="isAble" clearable>
                      <el-option
                        v-for="(item, index ) in sceneTriggerObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <div  class="dialog-footer" style="text-align: center;" v-if="addBtn1">
                    <el-button type="primary" @click="nextStepBtn()">下一步</el-button>
                </div>
                </el-form>
                <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd2" v-if="showDiv">
                <div  style="margin-top: 150px;">
                    <div class="mainname titleInfo">特别状况解除基本信息</div>
                    <el-form-item class="cl_td" label="解除状况编号" prop="eventNo3"
                    :rules="[ { required: true, message: '解除状况编号不能为空'} ]" >
                        <el-select v-model="tempAdd2.eventNo3" class="wd200" disabled clearable>
                          <el-option
                            v-for="(item, index ) in eventNo3Options"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                        </el-select>
                        <span>&nbsp;&nbsp;.</span>
                        <el-input class="wd200 cl_td" v-model="tempAdd2.eventNo4 " style="float: right; 
                            width: 17% !important;" :rules="[ { required: true, message: '解除状况编号不能为空'} ]" disabled/>
                </el-form-item>
               <el-form-item label="事件描述"  prop="eventDesc" class="cl_td" :rules="[{ required: true, message: '事件描述不能为空'}]" >
                    <el-input class="wd200 " v-model="tempAdd2.eventDesc "   />
                </el-form-item>
                <el-form-item label="管控码"  prop="effectivenessCodeScene" class="cl_td" >
                    <el-select v-model="tempAdd2.effectivenessCodeScene" class="wd200" :disabled="isAble" clearable>
                      <el-option
                        v-for="(item, index ) in effectivenessInfOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.effectivenessCodeScene"
                       />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="设置层级" prop="sceneTriggerObject">
                    <el-select v-model="tempAdd2.sceneTriggerObject" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in sceneTriggerObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <div class="dialog-footer" style="text-align: center;">
                    <el-button type="primary" @click="lastStepBtn()">上一步</el-button>
                </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false"> 取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!--管控码建立-->
        <el-dialog title="管控码建立" :visible.sync="dialogFormVisibleControl01" width="85%">
            <el-form ref="dataFormControl" :rules="rulesControl" :model="tempControl" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[{ required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempControl.operationMode" class="wd200" >
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" 
                    :rules="[{ required: true, message: '管控码类别不能为空'}]">
                    <el-select v-model="tempControl.effectivenessCodeType" class="wd200" >
                        <el-option
                            v-for="(item, index ) in effectivenessCodeTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码序号" prop="effectivenessCodeScene"
                    :rules="[ { required: true, message: '管控码序号不能为空'},
                    {max:2, message: '系统单元编号长度不能超过2个字符'}]" >
                    <el-input v-model="tempControl.effectivenessCodeScene" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="管控范围" prop="effectivenessCodeScope" 
                    :rules="[{ required: true, message: '管控范围不能为空'}]">
                    <el-select v-model="tempControl.effectivenessCodeScope" class="wd200" >
                        <el-option
                            v-for="(item, index ) in sceneTriggerObjectOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="effectivenessCodeDesc"
                    :rules="[{ required: true, message: '描述不能为空'}]" >
                    <el-input v-model="tempControl.effectivenessCodeDesc" class="wd200" type="text" />
                </el-form-item>
                <div  class="dialog-footer cl_tr text_center">
                    <el-button type="primary" @click="nextStepBtn1()">下一步</el-button>
                </div>
                <!--选择管控项目-->
                <div v-show="addBusPro_part2">
                    <div class="text_title padLf10">选择管控项目</div>
                     <!-- <el-form-item class="cl_td" label="管控项目" prop="eventNo3" >
                        <el-input class="wd200 "  v-model="tempControl.controlProjectNo"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="管控项目描述" prop="eventNo3" >
                        <el-input class="wd200 "  v-model="tempControl.controlDesc"/>
                    </el-form-item>
                    <div  class="dialog-footer cl_tr text_center">
                        <el-button type="primary" @click="addBusPro_nextToPart5Btn()">查询</el-button>
                    </div> -->
                    <div style="margin-left: 20%;">
                        <el-transfer
                            filterable
                            :filter-method="add_filterMethod"
                            :titles="['可选择管控项目', '已选择管控项目']"
                            filter-placeholder="请输入管控项目"
                            v-model="add_busTypeList"
                            @change="add_handleAddComponent"
                            @right-check-change="add_rightCheckedChange"
                            :data="add_allBusTypeData" >
                        </el-transfer>
                    </div>
                    <div class="cl_tr text_center mtop20" v-show="addBusPro_part2Btn">
                        <el-button  size="small" icon="el-icon-arrow-up" type="primary" 
                            @click="addBusPro_backPar1Btn()">上一步</el-button>
                            
                        <el-button size="small"  icon="el-icon-arrow-down"  type="primary"  
                        @click="addBusPro_nextToPart3Btn()" >下一步 </el-button>
                    </div>
                </div>
                <div v-show="addBusPro_part3">
                <div class="text_title padLf10">选择定价标签</div>
                <el-form-item class="cl_td" label="定价标签" prop="eventNo3" >
                    <el-input class="wd200 "  v-model="tempControl2.pricingTag"/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签描述" prop="eventNo3" >
                    <el-input class="wd200 "  v-model="tempControl2.pricingDesc"/>
                </el-form-item>
                <div  class="dialog-footer cl_tr text_center">
                    <el-button type="primary" @click="addBusPro_nextToPart6Btn()">查询</el-button>
                </div>
                <div style="margin-left: 20%;">
                    <el-transfer
                        filterable
                        :filter-method="add_filterMethodBalance"
                        :titles="['可选择定价标签', '已选择定价标签']"
                        filter-placeholder="请输入定价标签"
                        v-model="add_balanceList"
                        @change="add_balanceHandleComponent"
                        @right-check-change="add_balanceRightCheckedChange"
                        @left-check-change="add_balanceLeftCheckedChange"
                        :data="add_allBalanceData" >
                    </el-transfer>
                </div>
                <div class="cl_tr text_center mtop20" v-show="addBusPro_part3Btn">
                    <el-button size="small"  icon="el-icon-arrow-up" type="primary" 
                        @click="addBusPro_backPar2Btn()">上一步 </el-button>
                </div>
             </div>
            <!--end-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleControl01 = false"> 取消</el-button>
                <el-button type="primary" @click="confirmData()">确定</el-button>
            </div>
        </el-dialog>
         <!-- 详情 -->
        <el-dialog title="特别状况详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <div class="mainname titleInfo">特别状况基本信息</div>
                    <el-form-item class="cl_td" label="状况编号" prop="eventNo3">
                            <el-select v-model="itemData1.eventNo" class="wd200" disabled clearable>
                              <el-option
                                v-for="(item, index ) in eventNo3Options"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes" />
                            </el-select>
                            <span>&nbsp;&nbsp;.</span>
                    </el-form-item>
                    <el-form-item label="描述"  prop="eventDesc" class="cl_td" :rules="[{ required: true, message: '描述不能为空'}]">
                        <el-input class="wd200 "   v-model="tempDetail.eventDesc " readonly/>
                    </el-form-item>
                    <el-form-item label="管控码类别"  prop="itemPoseffectivenessCodeTypeInfo1" class="cl_td">
                      <el-select v-model="tempDetail.allEffectivenessCodeType" class="wd180" clearable disabled>
                            <el-option
                            v-for="(item, index ) in effectivenessInfOptions"
                            :key="index"
                            :label="item.effectivenessCodeType"
                            :value="item.effectivenessCodeDesc"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="设置层级" prop="sceneTriggerObject">
                        <el-select v-model="itemData1.sceneTriggerObject" class="wd200" clearable disabled>
                          <el-option
                            v-for="(item, index ) in sceneTriggerObjectOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempDetail2">
                    <div  style="margin-top: 150px;">
                        <div class="mainname titleInfo">特别状况解除基本信息</div>
                        <el-form-item class="cl_td" label="解除状况编号" prop="eventNo3">
                            <el-select v-model="itemData2.eventNo" class="wd200" disabled clearable>
                              <el-option
                                v-for="(item, index ) in eventNo3Options"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        <span>&nbsp;&nbsp;.</span>
                        </el-form-item>
                        <el-form-item label="事件描述"  prop="eventDesc" class="cl_td" >
                            <el-input class="wd200 " v-model="itemData2.eventDesc "  readonly />
                        </el-form-item>
                        <el-form-item label="管控码类别"  prop="itemPoseffectivenessCodeTypeInfo2" class="cl_td" >
                            <el-select v-model="tempDetail.allEffectivenessCodeType" class="wd200"  clearable disabled>
                              <el-option
                                v-for="(item, index ) in effectivenessInfOptions"
                                :key="index"
                                :label="item.effectivenessCodeType"
                                :value="item.effectivenessCodeScene"
                               />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="设置层级" prop="sceneTriggerObject">
                            <el-select v-model="itemData2.sceneTriggerObject" class="wd200" clearable disabled>
                            <el-option
                            v-for="(item, index ) in sceneTriggerObjectOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes" disabled
                             />
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>  
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleDetail = false" type="primary"> 取消</el-button>
                </div>
            </el-dialog>
        <!-- 修改 -->
        <el-dialog title="特别状况修改" :visible.sync="dialogFormVisibleUp" width="85%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <div class="mainname titleInfo">特别状况基本信息</div>
                <el-form-item class="cl_td" label="解除状况编号" prop="eventNo3" >
                        <!--<el-select v-model="itemUpData1.eventNo" class="wd200" :disabled="isAble" clearable>
                          <el-option
                            v-for="(item, index ) in eventNo3Options"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes" :disabled="isAble"/>
                        </el-select>-->
                        <el-input class="wd200 " readonly v-model="itemUpData1.eventNo"/>
                </el-form-item>
                <el-form-item label="描述"  prop="eventDesc" class="cl_td">
                    <el-input class="wd200 " v-model="tempUp.eventDesc "/>
                </el-form-item>
                <el-form-item label="管控码类别"  prop="upPoseffectivenessCodeTypeInfo1" class="cl_td">
                    <el-select v-model="itemUpData1.upPoseffectivenessCodeTypeInfo1" class="wd200"  clearable>
                        <el-option
                        v-for="(item, index ) in effectivenessInfOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.effectivenessCodeType"
                        />
                    </el-select>
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-plus" type="primary" @click="upHandleCreateStatus()" >
                            新增管控码
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="设置层级" prop="sceneTriggerObject">
                    <el-select v-model="tempUp.sceneTriggerObject" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in sceneTriggerObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <!--<div  class="dialog-footer" style="text-align: center;">
                    <el-button type="primary" @click="upNextStepBtn()">下一步</el-button>
                </div>-->
                </el-form>
                <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp2" >
                <div  style="margin-top: 150px;">
                    <div class="mainname titleInfo">特别状况解除基本信息</div>
                    <el-form-item class="cl_td" label="解除状况编号" prop="eventNo3" >
                        <el-input class="wd200 "  v-model="itemUpData2.eventNo" readonly/>
                    </el-form-item>
                <el-form-item label="事件描述"  prop="eventDesc" class="cl_td">
                    <el-input class="wd200 " v-model="itemUpData2.eventDesc "/>
                </el-form-item>
                <el-form-item label="管控码类别"  prop="upPoseffectivenessCodeTypeInfo2" class="cl_td" >
                    <el-select v-model="itemUpData2.upPoseffectivenessCodeTypeInfo2" class="wd200" readonly disabled>
                        <el-option
                        v-for="(item, index ) in effectivenessInfOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.effectivenessCodeType"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="设置层级" prop="sceneTriggerObject">
                    <el-select v-model="itemUpData2.sceneTriggerObject" class="wd200" readonly disabled>
                      <el-option
                        v-for="(item, index ) in sceneTriggerObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <!--<div class="dialog-footer" style="text-align: center;">
                    <el-button type="primary" @click="upLastStepBtn()">上一步</el-button>
                </div>-->
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false"> 取消</el-button>
                <el-button type="primary" @click="updateData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!--管控码建立-->
        <el-dialog title="管控码建立" :visible.sync="dialogFormVisibleControl02" width="75%">
            <el-form ref="upDataFormControl" :rules="rulesControlUp" :model="tempControlUp" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[{ required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempControlUp.operationMode" class="wd200" :disabled="isAble">
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" 
                    :rules="[{ required: true, message: '管控码类别不能为空'}]">
                    <el-select v-model="tempControlUp.effectivenessCodeType" class="wd200"  :disabled="isAble">
                        <el-option
                            v-for="(item, index ) in effectivenessCodeTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码序号" prop="effectivenessCodeScene"
                    :rules="[ { required: true, message: '管控码序号不能为空'},
                    {max:2, message: '系统单元编号长度不能超过2个字符'}]" >
                    <el-input v-model="tempControlUp.effectivenessCodeScene" class="wd200" type="text" :disabled="isAble"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="管控范围" prop="effectivenessCodeScope" 
                    :rules="[{ required: true, message: '管控范围不能为空'}]">
                    <el-select v-model="tempControlUp.effectivenessCodeScope" class="wd200" :disabled="isAble">
                        <el-option
                            v-for="(item, index ) in sceneTriggerObjectOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="effectivenessCodeDesc"
                    :rules="[{ required: true, message: '描述不能为空'}]" >
                    <el-input v-model="tempControlUp.effectivenessCodeDesc" class="wd200" type="text" :disabled="isAble"/>
                </el-form-item>
                <div  class="dialog-footer cl_tr text_center">
                    <el-button type="primary" @click="upNextStepBtn1()">下一步</el-button>
                </div>
                <!--选择管控项目-->
                <div v-show="upBusPro_part2">
                    <div class="text_title padLf10">选择管控项目</div>
                    <!-- <el-form-item class="cl_td" label="管控项目" prop="eventNo3" >
                        <el-input class="wd200 "  v-model="tempControlUp.controlProjectNo"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="管控项目描述" prop="eventNo3" >
                        <el-input class="wd200 "  v-model="tempControlUp.controlDesc"/>
                    </el-form-item>
                    <div  class="dialog-footer cl_tr text_center">
                        <el-button type="primary" @click="upBusPro_nextToPart5Btn()">查询</el-button>
                    </div> -->
                    <div style="margin-left: 20%;">
                        <el-transfer
                            filterable
                            :filter-method="up_filterMethod"
                            :titles="['可选择管控项目', '已选择管控项目']"
                            filter-placeholder="请输入管控项目"
                            v-model="up_busTypeList"
                            @change="up_handleAddComponent"
                            @right-check-change="up_rightCheckedChange"
                            :data="up_allBusTypeData" >
                        </el-transfer>
                    </div>
                    <div class="cl_tr text_center mtop20" v-show="upBusPro_part2Btn">
                        <el-button  size="small" icon="el-icon-arrow-up" type="primary" 
                            @click="upBusPro_backPar1Btn()">上一步</el-button>
                            
                        <el-button size="small"  icon="el-icon-arrow-down"  type="primary"  
                        @click="upBusPro_nextToPart3Btn()" >下一步 </el-button>
                    </div>
                </div>
                <div v-show="upBusPro_part3">
                <div class="text_title padLf10">选择定价标签</div>
                <el-form-item class="cl_td" label="定价标签" prop="eventNo3" >
                    <el-input class="wd200 "  v-model="tempControlUp2.pricingTag"/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签描述" prop="eventNo3" >
                    <el-input class="wd200 "  v-model="tempControlUp2.pricingDesc"/>
                </el-form-item>
                <div  class="dialog-footer cl_tr text_center">
                    <el-button type="primary" @click="upBusPro_nextToPart6Btn()">查询</el-button>
                </div>
                <div style="margin-left: 20%;">
                    <el-transfer
                        filterable
                        :filter-method="up_filterMethodBalance"
                        :titles="['可选择定价标签', '已选择定价标签']"
                        filter-placeholder="请输入定价标签"
                        v-model="up_balanceList"
                        @change="up_balanceHandleComponent"
                        @right-check-change="up_balanceRightCheckedChange"
                        @left-check-change="up_balanceLeftCheckedChange"
                        :data="up_allBalanceData" >
                    </el-transfer>
                </div>
                <div class="cl_tr text_center mtop20" v-show="upBusPro_part3Btn">
                    
                    <el-button size="small"  icon="el-icon-arrow-up" type="primary" 
                        @click="upBusPro_backPar2Btn()">上一步 </el-button>
                    
                </div>
             </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleControl02 = false">取消</el-button>
                <el-button type="primary" @click="editData()">确定</el-button>
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

        // 下拉框
        operationModeOptions: [], //运营模式
        sceneTriggerObjectOptions: [],//设置层级
        eventNo3Options: [],//状况编号
        effectivenessCodeScopeOptions:[],//管控范围
        effectivenessCodeTypeOptions:[],//管控码类别
        effectivenessInfOptions: [],
        sceneTriggerObjectOptions2: [],//设置层级
        // 增删改查
        tempAdd: {}, // 新增
        tempAdd2:{},
        tempControl:{},
        tempUp: {}, // 修改
        tempControlUp: {},
        tempUp2: {},
        tempDetail2: {},//
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,//修改一级弹框
        dialogFormVisibleDetail: false,
        //dialogFormVisibleControl:false,//管控码弹框
        dialogFormVisibleControl01:false,//新增管控码建立弹框
        dialogFormVisibleControl02:false,//修改二级弹框
        
        showDiv: false,//新增下一步
        rulesAdd: {},
        rulesControl:{},  
        rulesDetail: {},
        rulesUp: {},
        rulesControlUp: {},
        /*----新增----*/
        isReadonly1: false,
        isDisabled1: false,
        addBtn1:true,
        addBusPro_part1: true,
        addBusPro_part1Btn: true,
        addBusPro_part2: false,
        addBusPro_part2Btn: false,
        addBusPro_part3: false,
        addBusPro_part3Btn: false,
        isAble: false,
        tempControl2:{},//定价标签查询
        // 新增管控项目
        add_busTypeList: [],
        add_allBusTypeData: [],
        rightCheckedBusType: [],
        businessTypeCodeInitData: [],
        // 定价标签
        add_balanceList: [],
        add_allBalanceData: [],
        rightCheckedBalance: [],
        leftCheckedBalance: [],
        balanceObjectCodeInitData: [],
        /*-----详情-----*/
        tempDetail: {
            allEffectivenessCodeType: 0,
        }, // 详情
        itemData1: {
            itemPoseffectivenessCodeTypeInfo1: 0,
            eventNo:0,
        },
        itemData2: {
            itemPoseffectivenessCodeTypeInfo2:0,
            eventNo:0,
        },
        
        
        /*----修改----*/
        showDiv2:false,
        isReadonly2: false,
        isDisabled2: false,
        upBusPro_part2: false,
        upBusPro_part2Btn: false,
        upBusPro_part3: false,
        upBusPro_part3Btn: false,
        upBusPro_part4: false,
        upBusPro_part4Btn: false,
        isAble2: false,
        tempControlUpInfo:{},
        itemUpData1: {
            upPoseffectivenessCodeTypeInfo1: 0,
            eventNo:0,
        },
        itemUpData2: {
            upPoseffectivenessCodeTypeInfo2:0,
            eventNo:0,
        },
        tempControlUp2:{},//定价标签查询
        // 修改管控项目
        up_busTypeList: [],
        up_allBusTypeData: [],
        up_rightCheckedBusType: [],
        up_businessTypeCodeInitData: [],
        // 修改标签
        up_balanceList: [],
        up_allBalanceData: [],
        upRightCheckedBalance: [],
        upLeftCheckedBalance: [],
        upBalanceObjectCodeInitData: [],
        nodeTypOptions: [{value: 'CP', text: '客户生命周期'}, {value: 'PP', text: '产品生命周期'},
                                {value: 'MP', text: '媒介生命周期'}, {value: 'AP', text: '账户生命周期'},
                                {value: 'OP', text: '余额对象生命周期'}, {value: 'UP', text: '余额单元生命周期'},
            ]
    }
  },
  created() {
    this.getBtnAuth()
    
  },
  mounted() {
    this.getList()
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    //管控码
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0023").then(res => {
        let rows = res
        rows.forEach(item => {
            item.concat = item.effectivenessCodeScope+'-'+item.effectivenessCodeScene+'-'+item.effectivenessCodeDesc
        })
        this.effectivenessInfOptions = rows
    })
    //状况编号
    this.getSelectDict( "dic_specialPosiEvent3").then(res => {
        let rows = res
        rows.forEach((item , i ) => {
            item.label = item.codes+ ' ' + item.detailDesc
        })
        this.eventNo3Options = rows
    })
    //设置层级dic_pricingLevel dic_setHierarchy
    this.getSelectDict( "dic_pricingLevel").then(res => {
        this.sceneTriggerObjectOptions = res
    })
    //管控范围
     this.getSelectDict( "dic_effectiveCodeType").then(res => {
        this.effectivenessCodeScopeOptions = res
    })
     //管控码类别
    this.getSelectDict( "dic_effectiveCodeType").then(res => {
        this.effectivenessCodeTypeOptions = res
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
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0018')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
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
        this.listLoading1 = true
        let obj = {
            isTrans: true,
            transParams:['dic_pricingLevel'],
            transDict : ['sceneTriggerObject']
        }
        
        this.queryFormObj = Object.assign(this.queryFormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0140', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                    this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        }, (err) => {
      		this.tableList = []
            this.tableTotal = 0
       		this.listLoading1 = false
         })
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
    nextStepBtn(){
        this.showDiv=true;  
        this.addBtn1=false;
        this.tempAdd2.eventNo3=this.tempAdd.eventNo3
        this.tempAdd2.eventNo4=this.tempAdd.eventNo4
        console.log(this.tempAdd.effectivenessCodeInfo)
        this.tempAdd2.effectivenessCodeScene=this.tempAdd.effectivenessCodeInfo;
        this.tempAdd2.sceneTriggerObject=this.tempAdd.sceneTriggerObject
        if (this.showDiv ==true) {
            this.isAble = true; 
        } else {
            this.isAble = false; 
        }
        if (this.tempAdd.eventNo3 == '01') {
            this.tempAdd2.eventNo3 = '11 手工类解除';
        } else if (this.tempAdd.eventNo3 == '80') {
            this.tempAdd2.eventNo3 = '81 延滞自动解除';
        } else if (this.tempAdd.eventNo3 == '86') {
            this.tempAdd2.eventNo3 = '87 核算自动解除';
        }

        
    },
    lastStepBtn(){
        this.showDiv=false;
        this.addBtn1=true;
        this.tempAdd2={}
        if (this.showDiv ==false) {
            this.isAble = false; 
        } else {
            this.isAble = true; 
        }
    },
    // 显示新增管控码弹框
    handleCreateStatus() {
        this.dialogFormVisibleControl01 = true
        this.$nextTick(() => {
            this.$refs['dataFormControl'].clearValidate()
        })
    }, 
    //选择管控项目
    // 下一步
    nextStepBtn1() {
        this.$refs["dataFormControl"].validate(valid => {
            if (valid) {
                this.addBusPro_part1Btn = false;
                this.isReadonly1 = true;
                this.isDisabled1 = true;
                this.addBusPro_part2 = true;
                this.addBusPro_part2Btn = true;
                this.add_allBusTypeData = this.generateAllBusTypeData();
            }
        });
    },
    addBusPro_nextToPart3Btn() {
        this.addBusPro_part2Btn = false;
        this.addBusPro_part3 = true;
        this.addBusPro_part3Btn = true;
        this.add_allBalanceData = this.generateAllBalanceData();
    },
    addBusPro_nextToPart5Btn() {
        this.generateAllBusTypeData();
    },

    // 上一步
    addBusPro_backPar1Btn() {
      this.addBusPro_part2 = false;
      this.addBusPro_part1Btn = true;
    },
    addBusPro_backPar2Btn() {
        this.addBusPro_part3 = false;
        this.addBusPro_part2Btn = true;
    },
    addBusPro_backPar3Btn() {
        this.addBusPro_part3Btn = true;
    },
    addBusPro_backPar4Btn() {
        this.addBusPro_part1 = true;
        this.addBusPro_part2 = true;
        this.addBusPro_part3 = true;
        this.addBusPro_part1Btn = false;
        this.addBusPro_part2Btn = false;
        this.addBusPro_part3Btn = false;
      
    },
    // 2选择管控项目
    add_filterMethod(query, item) {
        return item.controlProjectNo.indexOf(query) > -1;
    },
    // 左侧被选中管控项目
    add_handleAddComponent(value, direction, movedKeys) {
        this.add_busTypeList = value;
    },
    // 右侧被选中管控项目
    add_rightCheckedChange(val,direction,movedKeys) {
        this.rightCheckedBusType = val;
    },
    // 获取管控项目穿梭框左侧数据
    generateAllBusTypeData() {
        const componentData = []; // 相当于data
        const componentNoList = []; //
        const componentList = [];
        var field = {};
        field.operationMode=this.tempControl.operationMode
        field.controlProjectNo=this.tempControl.controlProjectNo
        this.post("/beta/betaService/COS.IQ.02.0047", field, res => {
        this.businessTypeCodeInitData = res.returnData.rows;
        res.returnData.rows.forEach((item, i) => {
          componentList.push(item.controlProjectNo + " " + item.controlDesc);
          componentNoList.push(item.controlProjectNo);
        });
        componentList.forEach((component, index) => {
          componentData.push({
            label: component,
            // key: index,
            key: component.split(" ")[0],
            controlProjectNo: componentNoList[index]
          });
        });
      });
        return componentData;
    },
    //选择定价标签    
    add_filterMethodBalance(query, item) {
        return item.pricingTag.indexOf(query) > -1;
    },
    add_balanceHandleComponent(value, direction, movedKeys) {
        this.add_balanceList = value;
      //console.log(this.add_balanceList);
    },
    add_balanceRightCheckedChange(val) {
        this.rightCheckedBalance = val;
    },
    add_balanceLeftCheckedChange(val) {
        this.leftCheckedBalance = val;
    },
    generateAllBalanceData() {
        const componentData = []; // 相当于data
        const componentNoList = []; //
        const componentList = [];
        var field = {};
        field.operationMode=this.tempControl.operationMode
        field.pricingTag=this.tempControl2.pricingTag;
        this.post("/beta/betaService/COS.IQ.02.0019", field, res => {
            this.balanceObjectCodeInitData = res.returnData.rows;
            //console.log(this.balanceObjectCodeInitData)
            res.returnData.rows.forEach((item, i) => {
                componentList.push(item.pricingTag + " " + item.pricingDesc);
                componentNoList.push(item.pricingTag);
            });
            componentList.forEach((component, index) => {
                componentData.push({
                label: component,
                // key: index,
                key: component.split(" ")[0],
                pricingTag: componentNoList[index]
                });
            });
        });
        return componentData;
    },
    //提交
    confirmData() {
        let list = []//管控项目&&定价标签
        var one = {}
        var two ={}
        one.controlProjectNo=this.rightCheckedBusType[0] 
        one.effectivenessCodeScene= this.tempControl.effectivenessCodeScene
        one.effectivenessCodeType=this.tempControl.effectivenessCodeType
        one.operationMode=this.tempControl.operationMode
        one.projectType= '0'
        list.push(one)//管控项目
        two.controlProjectNo=this.add_balanceList[0] 
        two.effectivenessCodeScene= this.tempControl.effectivenessCodeScene
        two.effectivenessCodeType=this.tempControl.effectivenessCodeType
        two.operationMode=this.tempControl.operationMode
        two.projectType= '1'
        list.push(two) //定价标签
        this.tempControl.list=list
        this.$refs['dataFormControl'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0023', this.tempControl, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleControl01 = false//关闭弹框
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 2000
                        })  
                        this.tempControl = {}
                    }
                    
                })
            }
        })
    },  
    //确认提交
    createData() {
        let tempAddInfo={}
        this.x0985BOList=[]
        this.x0985BOList.push(this.tempAdd)
        this.x0985BOList.push(this.tempAdd2)
        tempAddInfo.x0985BOList=this.x0985BOList;
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0140', tempAddInfo, (res) => {
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
                    this.tempAdd2 = {}
                }
          })
        }
      })
    },  
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.tempDetail.allEffectivenessCodeType=this.tempDetail.effectivenessCodeType +'-'+this.tempDetail.effectivenessCodeScene+'-'+this.tempDetail.effectivenessCodeDesc;
        this.getDetail();
        this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    getDetail() {
        let queryParam = {
            spEventUpdateFlag: 'updateQuery',
            eventNo: this.tempDetail.eventNo,
        };
        this.getTableList('/beta/betaService/COS.IQ.02.0140', queryParam ,(res) => {
            if (res.returnCode == '000000') {
                this.itemData1= res.returnData[0]
                this.itemData2= res.returnData[1]
                this.itemData1.itemPoseffectivenessCodeTypeInfo1 = this.itemData1.effectivenessCodeType +'-'+this.itemData1.effectivenessCodeScene;
                this.itemData2.itemPoseffectivenessCodeTypeInfo2 = this.itemData2.effectivenessCodeType +'-'+this.itemData2.effectivenessCodeScene;
                this.sceneTriggerObjectOptions.forEach(item => {
                    if (res.returnData[1].sceneTriggerObject == item.codes) {
                        this.itemData2.sceneTriggerObject= item.codes
                    }
                })
            }
        })
    },
    
    
    
    /*-----显示修改弹框-----*/
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.getUpDetail()
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
   getUpDetail() {
        let queryParam = {
            spEventUpdateFlag: 'updateQuery',
            eventNo: this.tempUp.eventNo,
        };
        this.getTableList('/beta/betaService/COS.IQ.02.0140', queryParam ,(res) => {
            if (res.returnCode == '000000') {
                this.itemUpData1= res.returnData[0]
                this.itemUpData2= res.returnData[1]
                this.itemUpData1.upPoseffectivenessCodeTypeInfo1 = this.itemUpData1.effectivenessCodeType +'-'+this.itemUpData1.effectivenessCodeScene;
                this.itemUpData1.upPoseffectivenessCodeTypeInfo1 = this.itemUpData1.effectivenessCodeType +'-'+this.itemUpData1.effectivenessCodeScene+'-'+this.itemUpData1.eventDesc;
                this.itemUpData2.upPoseffectivenessCodeTypeInfo2=this.itemUpData2.effectivenessCodeType +'-'+this.itemUpData2.effectivenessCodeScene+'-'+this.itemUpData2.eventDesc;
                this.sceneTriggerObjectOptions.forEach(item => {
                    if (res.returnData[1].sceneTriggerObject == item.codes) {
                        this.itemUpData2.sceneTriggerObject= item.codes
                    }
                })
                
            }
        })
    },
    upNextStepBtn(){
        this.showDiv2=true;  
        this.tempUp2.eventNo3=this.tempUp.eventNo3
        this.tempUp2.eventNo4=this.tempUp.eventNo4
        this.tempUp2.effectivenessInf=this.tempUp.effectivenessInf
        this.tempUp2.sceneTriggerObject=this.tempUp.sceneTriggerObject
        if (this.showDiv2 ==true) {
            this.isAble = true; 
        } else {
            this.isAble = false; 
        }
        if (this.tempUp.eventNo3 == '01') {
            this.tempUp2.eventNo3 = '11 手工类解除';
        } else if (this.tempUp.eventNo3 == '80') {
            this.tempUp2.eventNo3 = '81 延滞自动解除';
        } else if (this.tempUp.eventNo3 == '86') {
            this.tempUp2.eventNo3 = '87 核算自动解除';
        }
    },
    upLastStepBtn(){
        this.showDiv2=false;
        this.tempUp2={}
        if (this.showDiv2 ==false) {
            this.isAble = false; 
        } else {
            this.isAble = true; 
        }
    },
    // 显示修改管控码弹框
    upHandleCreateStatus() {
        this.dialogFormVisibleControl02 = true
        this.tempControlUp={};
        this.upBusPro_part2=false
        this.$nextTick(() => {
            this.$refs['upDataFormControl'].clearValidate()
        })
    }, 
    //选择管控项目
    // 下一步
    upNextStepBtn1() {
        this.upBusPro_part2=true;
       this.upBusPro_part1Btn = false;
        this.tempUp2={}
        if (this.upBusPro_part2 ==true) {
            this.isAble = true; 
        } else {
            this.isAble = false; 
        }
        this.$refs["upDataFormControl"].validate(valid => {
            if (valid) {
                this.upBusPro_part1Btn = false;
                this.isReadonly2 = true;
                this.isDisabled2 = true;
                this.upBusPro_part2 = true;
                this.upBusPro_part2
                this.upBusPro_part2Btn = true;
                this.up_allBusTypeData = this.upGenerateAllBusTypeData();
            }
        });
    },
    upBusPro_nextToPart3Btn() {
      // 判断是否设置默认业务类型
        // if (this.upRightCheckedBusType=='' || this.upRightCheckedBusType==undefined) {
        //     this.$message({
        //         message: "请设置默认业务类型",
        //         type: "warning"
        //     });
        //     return;
        // }
        this.upBusPro_part2Btn = false;
        this.upBusPro_part3 = true;
        this.upBusPro_part3Btn = true;
        this.up_allBalanceData = this.generateAllBalanceData();
    },
    upBusPro_nextToPart5Btn() {
        // 查询
        this.upGenerateAllBusTypeData();
    },
    // 上一步
    upBusPro_backPar1Btn() {
        this.upBusPro_part2 = false;
        this.upBusPro_part1Btn = true;
        this.tempUp2={}
        if (this.upBusPro_part2 ==false) {
            this.isAble = false; 
        } else {
            this.isAble = true; 
        }
        
    },
    upBusPro_backPar2Btn() {
        this.upBusPro_part3 = false;
        this.upBusPro_part2Btn = true;
    },
    upBusPro_backPar3Btn() {
        this.upBusPro_part3Btn = true;
    },
    upBusPro_backPar4Btn() {
        this.upBusPro_part1 = true;
        this.upBusPro_part2 = true;
        this.upBusPro_part3 = true;
        this.upBusPro_part1Btn = false;
        this.upBusPro_part2Btn = false;
        this.upBusPro_part3Btn = false;
      
    },
    // 2选择管控项目
    up_filterMethod(query, item) {
        return item.controlProjectNo.indexOf(query) > -1;
    },
    // 左侧被选中管控项目
    up_handleAddComponent(value, direction, movedKeys) {
        this.up_busTypeList = value;
    },
    // 右侧被选中管控项目
    up_rightCheckedChange(val,direction,movedKeys) {
        this.upRightCheckedBusType = val;
    },
    // 获取管控项目穿梭框左侧数据
    upGenerateAllBusTypeData() {
      const componentData = []; // 相当于data
      const componentNoList = []; //
      const componentList = [];
      var field = {};
      field.operationMode=this.tempControlUp.operationMode;
      field.controlProjectNo=this.tempControlUp.controlProjectNo;
      this.post("/beta/betaService/COS.IQ.02.0047", field, res => {
        this.up_businessTypeCodeInitData = res.returnData.rows;
        res.returnData.rows.forEach((item, i) => {
          componentList.push(item.controlProjectNo + " " + item.controlDesc);
          componentNoList.push(item.controlProjectNo);
        });
        componentList.forEach((component, index) => {
          componentData.push({
            label: component,
            // key: index,
            key: component.split(" ")[0],
            controlProjectNo: componentNoList[index]
          });
        });
      });
        return componentData;
    },
    //选择定价标签
    up_filterMethodBalance(query, item) {
        return item.pricingTag.indexOf(query) > -1;
    },
    up_balanceHandleComponent(value, direction, movedKeys) {
        this.up_balanceList = value;
      //console.log(this.add_balanceList);
    },
    up_balanceRightCheckedChange(val) {
        this.upRightCheckedBalance = val;
    },
    up_balanceLeftCheckedChange(val) {
        this.upLeftCheckedBalance = val;
    },
    upBusPro_nextToPart6Btn() {
        // 查询
        this.generateAllBalanceData();
    },
    generateAllBalanceData() {
        const componentData = []; // 相当于data
        const componentNoList = []; //
        const componentList = [];
        var field = {};
        field.operationMode=this.tempControlUp.operationMode
        field.pricingTag=this.tempControlUp2.pricingTag;
        this.post("/beta/betaService/COS.IQ.02.0019", field, res => {
            this.upBalanceObjectCodeInitData = res.returnData.rows;
            if(res.returnData &&res.returnData.rows && res.returnData.rows.length > 0){
                res.returnData.rows.forEach((item, i) => {
                    componentList.push(item.pricingTag + " " + item.pricingDesc);
                    componentNoList.push(item.pricingTag);
                });
                componentList.forEach((component, index) => {
                    componentData.push({
                    label: component,
                    // key: index,
                    key: component.split(" ")[0],
                    pricingTag: componentNoList[index]
                    });
                }); 
           }
        });
        return componentData;
    },
    //提交
    editData() {
        let list = []//管控项目&&定价标签
        var one = {}
        var two ={}
        one.controlProjectNo=this.upRightCheckedBusType[0] 
        one.effectivenessCodeScene= this.tempControlUp.effectivenessCodeScene
        one.effectivenessCodeType=this.tempControlUp.effectivenessCodeType
        one.operationMode=this.tempControlUp.operationMode
        one.projectType= '0'
        list.push(one)//管控项目
        two.controlProjectNo=this.up_balanceList[0] 
        two.effectivenessCodeScene= this.tempControlUp.effectivenessCodeScene
        two.effectivenessCodeType=this.tempControlUp.effectivenessCodeType
        two.operationMode=this.tempControlUp.operationMode
        two.projectType= '1'
        list.push(two) //定价标签
        this.tempControlUp.list=list
        this.$refs['upDataFormControl'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0023', this.tempControlUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleControl02 = false
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 500
                        })
                        this.tempControlUp = {}
                    }
                    
                })
            }

        })
    },  
    //确认提交
    updateData() {
        let tempAddInfo={}
        this.x0985BOList=[]
        let list1={
            effectivenessCodeScene:this.itemUpData1.effectivenessCodeScene,
            effectivenessCodeType:this.itemUpData1.effectivenessCodeType,
            eventDesc: this.tempUp.eventDesc,
            eventNo: this.itemUpData1.eventNo,
            eventType: this.itemUpData1.eventType,
            sceneTriggerObject: this.tempUp.sceneTriggerObject,
        }
        let list2={
            effectivenessCodeScene:this.itemUpData2.effectivenessCodeScene,
            effectivenessCodeType:this.itemUpData2.effectivenessCodeType,
            eventDesc: this.itemUpData2.eventDesc,
            eventNo: this.itemUpData2.eventNo,
            eventType: this.itemUpData2.eventType,
            sceneTriggerObject: this.itemUpData2.sceneTriggerObject,
        }
        this.x0985BOList.push(list1)
        this.x0985BOList.push(list2)
        tempAddInfo.x0985BOList=this.x0985BOList;
        this.$refs['dataFormUp'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0140', tempAddInfo, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleUp = false
                    this.$notify({
                    title: 'Success',
                    message: '新增成功',
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
  }
}
</script>

<style>
</style>
