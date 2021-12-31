<!-- 媒介挂失 -->
<template>
    <div class="allContent">
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
      
        <div v-if="showTable">
            <div class="text_title">客户基本信息</div>
            <el-form :model="baseInfoObj" :inline="true" class="demo-form-inline" style="padding-left: 20px;">
                <el-form-item class="mrgt20" label="证件类型" prop="idType">
                    <el-select v-model="baseInfoObj.idType" class="wd200" disabled>
                        <el-option v-for="(item, index) in idTypeList" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="mrgt20" label="证件号码" prop="idNumber">
                    <el-input v-model="baseInfoObj.idNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="" label="客户姓名" prop="customerName">
                    <el-input v-model="baseInfoObj.customerName" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title">客户媒介信息</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                @current-change="handleCurrRowChange"
                @row-click="chooseCurrRow"
            >
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-radio v-model="curRowRadio" :label="scope.row.mediaUnitCode">
                            <span class="el-radio__label"></span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" width="180"/>
                <el-table-column prop="mediaUserName" label="使用者姓名" align="center" />
                
                <el-table-column prop="mediaObjectCode" label="媒介对象" align="center" width="180">
                    <template slot-scope="{row}">
                        {{row.mediaObjectCode}}
                        {{row.mediaObjectDesc}}
                    </template>
                </el-table-column>

                <el-table-column prop="productObjectCode" label="产品对象" align="center" width="190">
                    <template slot-scope="{row}">
                        {{row.productObjectCode}}
                        {{row.productDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="mainSupplyIndicatorDesc" label="主附标识" align="center" />
                <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />
                <el-table-column prop="invalidReasonDesc" label="无效原因" align="center" />
                <el-table-column prop="transferCardDesc" label="是否可转卡" align="center" />
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            
        </div>
        <!-- 媒介详细信息 -->
        <div v-show="showInfo">
            <media-info
                :formObj="mediaBaseInfo"
                :text_title ="text_title"
            ></media-info>

            <!-- 是否转卡 -->
            <el-form ref="mediaformRef" :model="mediaObj" :rules="mediaRules">
                <el-form-item class="cl_td" label="是否转卡" prop="isTransferCard">
                    <el-select v-model="mediaObj.isTransferCard" class="wd200" @change="transCardChange">
                        <el-option 
                            v-for="(item, index) in isTransferCardOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="是否支持配置靓号" prop="isSupport" v-show="showNickNum" >
                    <el-radio-group v-model="mediaObj.isSupport" @change="isSupportChange">
                      <el-radio :label="1" >是</el-radio>
                      <el-radio :label="2" >否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item class="cl_td" label="是否支持紧急替代卡" prop="isSupportReplace">
                    <el-radio-group v-model="mediaObj.isSupportReplace"  @change="isSupportReplaceChange">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="2" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="cl_td" label="是否同步卡组织"  prop="isSyncCardOrg">
                    <el-radio-group v-model="mediaObj.isSyncCardOrg" @change="isSyncCardOrgChange">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="2" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 客户靓号 -->
                <div  v-show="showCustNicknameDiv" >
                    <el-form-item class="cl_td" label="新卡外部识别号" prop="externalIdentificationNoIn">
                        <el-input v-model="mediaObj.externalIdentificationNoIn" class="wd200" type="text" readonly/>
                    </el-form-item>
                </div>

                <!-- 选择特别状况事件 -->
                <div v-show="showSpecialSit">
                    <div class="text_title">选择特别状况事件</div>
                    <el-table
                        v-loading = "config2.loading"
                        :data="tableData2"
                        class="mbtm20"
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        border
                        @current-change="handleCurrRowChange2"
                        @row-click="chooseCurrRow2"
                    >
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <el-radio v-model="curRowRadio2" :label="scope.row.eventNo">
                                    <span class="el-radio__label"></span>
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="状况编号" align="center">
                            <template slot-scope="{row}">
                                {{row.eventNo.substring(10)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="eventDesc" label="状况描述" align="center" />
                        <el-table-column prop="" label="管控内容" align="center" width="190">
                            <template slot-scope="{row}">
                                {{row.effectivenessCodeType}}
                                {{row.effectivenessCodeScene}}
                                {{row.effectivenessCodeDesc}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="sceneTriggerObjectDesc" label="设置层级" align="center" />
                        <el-table-column prop="" label="操作" align="center">
                            <template slot-scope="{row}">
                                <el-button size="mini" type="primary" @click="handleSitDetail(row)">详情</el-button>
                            </template> 
                        </el-table-column>
                    </el-table>
                    <pagination v-show="config2.total>0" :total="config2.total" :page.sync="config2.pageNum" :limit.sync="config2.pageSize" @pagination="getSpecialSitList" />
                </div>
            </el-form>
            <div v-show="showLossBtn" class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-check" type="primary" @click="sureLoss()" :disabled="sureBtnIsDisabled">确定挂失</el-button>
            </div>
        </div>
       



        <!-- 挂失后新卡展示 -->
        <div v-show="showNewMediaList">
            <div class="text_title">新卡列表</div>
            <div class="cl_tr text_center">
                <el-button size="medium" v-show="isShowExcepBtn" type="primary" @click="queryException()">授权例外名单</el-button>
            </div>
            <el-table
                :data="newMediaData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" v-show="showDetailBtn"  @click="queryNewMeadiaDetail(row)">详情</el-button>
                        <el-button size="mini" type="primary" v-show="!showDetailBtn" @click="closeBtn(row)">收起</el-button>
                    </template> 
                </el-table-column>
            </el-table>
        </div>

        <!-- 新媒介详情 -->
        <div v-show="showNewMediaList">
            <media-info
                :formObj="newMediaDetailInfo"
                :text_title ="text_title2"
            >
            </media-info>
        </div>

        <!-- 特别状况事件 详情 -->
        <el-dialog title="特别状况详情" :visible.sync="sitDetail_dialogForm" width="65%">
            <div class="text_title">管控码关联的管控项目</div>
            <common-table
                :tableData="sit_tableData1"
                :config="sit_config1"
                :tableLabel="sit_tableLabel1"
                @changePage="sit_getList1"
            ></common-table>
            <!-- <div class="text_title">已选定价标签</div> -->
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sitDetail_dialogForm = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 自动配合弹窗 -->
        <el-dialog title="配置靓号详情" :visible.sync="setNum_dialogForm" width="65%">
            <div class="text_title">特殊号段信息表</div>
            <el-form ref="setNumRef" :rules="setNumRules" :model="setNumObj" >
                <el-form-item class="cl_td" label="发卡BIN" prop="cardBin">
                    <el-input v-model="setNumObj.cardBin" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber"
                :rules="[ { required: true, message: '特殊号码段号不能为空'} ]">
                    <el-select v-model="setNumObj.segmentNumber" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.segmentNumber"
                        :value="item.segmentNumber"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="setNumSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="setNumReset()">重置</el-button>
            </div>
            <!-- 特殊号段信息表 -->
            <div v-show="showSpcialNumTable">
                <el-table
                    v-loading = "setNum_config.loading"
                    :data="spcailNum_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                    @current-change="spcailNumSection_handleCurrRowChange"
                    @row-click="spcailNumSection_chooseCurrRow"
                >
                    <el-table-column width="55">
                        <template slot-scope="scope">
                            <el-radio v-model="spcailNum_curRowRadio" :label="scope.row.segmentNumber">
                                <span class="el-radio__label"></span>
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="segmentNumber" label="特殊号码段号" align="center"/>
                    <el-table-column prop="" label="操作" align="center" >
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary" @click="querySpcialNum(row)">查询特殊号</el-button>
                        </template> 
                    </el-table-column>
                </el-table>
                <pagination v-show="setNum_config.total>0" :total="setNum_config.total" :page.sync="setNum_config.pageNum" :limit.sync="setNum_config.pageSize" @pagination="setNum_getSpecialNumlist" />
            </div>
            <!-- 特殊号信息 -->
            <div v-show="showSpcialNumTable2">
                <div class="text_title">特殊号信息表</div>
                <el-table
                    v-loading = "setNum_config2.loading"
                    :data="spcailNum_tableData2"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                    @current-change="spcailNum_handleCurrRowChang"
                    @row-click="spcailNum_chooseCurrRow"
                >
                    <el-table-column width="55">
                        <template slot-scope="scope">
                            <el-radio v-model="spcailNum_curRowRadio2" :label="scope.row.cardNumber">
                                <span class="el-radio__label"></span>
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardNumberStr" label="特殊号" align="center"/>
                </el-table>
                <pagination v-show="setNum_config2.total>0" :total="setNum_config2.total" :page.sync="setNum_config2.pageNum" :limit.sync="setNum_config2.pageSize" @pagination="setNum_getSpecialNumInfolist" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureMatcheNum()">
                    确定
                </el-button>
                <el-button  @click="setNum_close()">
                    关闭
                </el-button>
            </div>
        </el-dialog>


        <!-- 是否支持紧急替代卡 -->
        <el-dialog title="支持紧急替代卡详情" :visible.sync="replace_dialogForm" width="65%">
            <div class="text_title">特殊号段信息表</div>
            <el-form ref="replaceCardRef" :rules="replaceCardRules" :model="replaceCardObj" >
                <el-form-item class="cl_td" label="发卡BIN" prop="cardBin">
                    <el-input v-model="replaceCardObj.cardBin" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber"
                :rules="[ { required: true, message: '特殊号码段号不能为空'} ]">
                    <el-select v-model="replaceCardObj.segmentNumber" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.segmentNumber"
                        :value="item.segmentNumber"
                        />
                    </el-select>
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="replaceCardSearch()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="replaceCardReset()">重置</el-button>
                </div>
                <!-- 特殊号段信息表 -->
                <div v-show="showReplaceCardTable">
                    <div class="text_title">特殊号信息表</div>
                    <el-table
                        v-loading = "replace_config.loading"
                        :data="replace_tableData"
                        class="mbtm20"
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        border
                        @current-change="replaceSection_handleCurrRowChange"
                        @row-click="replaceSection_chooseCurrRow"
                    >
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <el-radio v-model="replace_curRowRadio" :label="scope.row.segmentNumber">
                                    <span class="el-radio__label"></span>
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="segmentNumber" label="特殊号码段号" align="center"/>
                        <el-table-column prop="" label="操作" align="center" >
                            <template slot-scope="{row}">
                                <el-button size="mini" type="primary" @click="replace_querySpcialNum(row)">查询特殊号</el-button>
                            </template> 
                        </el-table-column>
                    </el-table>
                    <pagination v-show="replace_config.total>0" :total="replace_config.total" :page.sync="replace_config.pageNum" :limit.sync="replace_config.pageSize" @pagination="replace_getSpecialNumlist" />
                </div>
                <!-- 特殊号信息 -->
                <div v-show="showReplaceCardTable2">
                    <el-table
                        v-loading = "replace_config2.loading"
                        :data="replace_tableData2"
                        class="mbtm20"
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        border
                        @current-change="replaceNum_handleCurrRowChang"
                        @row-click="replaceNum_chooseCurrRow"
                    >
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <el-radio v-model="replace_curRowRadio2" :label="scope.row.cardNumber">
                                    <span class="el-radio__label"></span>
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cardNumberStr" label="特殊号" align="center"/>
                    </el-table>
                    <pagination v-show="replace_config2.total>0" :total="replace_config2.total" :page.sync="replace_config2.pageNum" :limit.sync="replace_config2.pageSize" @pagination="replace_getSpecialNumInfolist" />
                    <el-form-item class="cl_td red" label="新卡有效期" prop="newExpirationDate">
                        <el-date-picker
                            class="wd200"
                            v-model="replaceCardObj.newExpirationDate"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureReplaceNum()">
                    确定
                </el-button>
                <el-button  @click="replace_close()">
                    关闭
                </el-button>
            </div>
        </el-dialog>


        <!-- 授权例外名单弹窗 -->
        <el-dialog title="授权例外名单" :visible.sync="authExce_dialogForm" width="65%">
            <el-form ref="authExceRef" :rules="authExceRules" :model="authExce_queryObj" >
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                    <el-input v-model="authExce_queryObj.externalIdentificationNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations">
                    <el-select v-model="authExce_queryObj.cardAssociations" class="wd200">
                        <el-option 
                        v-for="(item, index) in cardAssociationsOptions" 
                        :key="index" :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" type="primary" icon="el-icon-search" @click="selException()">查询</el-button >
                    <el-button size="medium" type="primary" icon="el-icon-plus" @click="addException()" >新增</el-button >
                    <el-button size="medium" type="primary" icon="el-icon-edit"  @click="updateException()">修改</el-button >
                    <el-button size="medium" type="primary" icon="el-icon-delete"  @click="delException()" >删除</el-button >
                </div>
            </el-form>
            
            <!-- 授权例外名单VSIA -->
            <div v-show='showExceptionV'>
                <exception-v-info
                    :formObj="exceptionVObj"
                ></exception-v-info>
                <!-- <el-form :model="exceptionVObj" >
                    <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                        <el-input v-model="exceptionVObj.externalIdentificationNo" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" >
                        <el-input v-model="exceptionVObj.cardAssociations" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="报告日期" prop="contrlReportDate" >
                        <el-input v-model="exceptionVObj.contrlReportDate" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="报告时间" prop="contrlReportTm" >
                        <el-input v-model="exceptionVObj.contrlReportTm" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="删除日期" prop="contrlDelDate" >
                        <el-input v-model="exceptionVObj.contrlDelDate" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="说明" prop="contrlDesc" >
                        <el-input v-model="exceptionVObj.contrlDesc" class="wd200" type="text" />
                    </el-form-item>
                    <div class="mainname titleInfo">VISA详情</div>
                    <el-form-item class="cl_td" label="控管原因" prop="contrlReason" >
                        <el-input v-model="exceptionVObj.contrlReason" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="行动码" prop="actCode" >
                        <el-input v-model="exceptionVObj.actCode" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="地区码" prop="cwbZoneCode" >
                        <div v-for="(item, index) in cwbZoneCodesList" :key="index">
                            <el-input v-model="item.cwbZoneCode" class="wd200" type="text" />
                        </div>
                    </el-form-item>
                </el-form> -->
                <div class="cl_tr text_center">
                    <el-button size="medium" type="primary" @click="closeInfoV()">关闭</el-button >
                </div>
            </div>

            <!-- 授权例外名MCC -->
            <div v-show='showExceptionM'>
                <exception-m-info
                    :formObj="exceptionMObj"
                ></exception-m-info>
                <!-- <el-form :model="exceptionMObj" >
                    <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                        <el-input v-model="exceptionMObj.externalIdentificationNo" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" >
                        <el-input v-model="exceptionMObj.cardAssociations" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="报告日期" prop="contrlReportDate" >
                        <el-input v-model="exceptionMObj.contrlReportDate" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="报告时间" prop="contrlReportTm" >
                        <el-input v-model="exceptionMObj.contrlReportTm" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="删除日期" prop="contrlDelDate" >
                        <el-input v-model="exceptionMObj.contrlDelDate" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="说明" prop="contrlDesc" >
                        <el-input v-model="exceptionMObj.contrlDesc" class="wd200" type="text" />
                    </el-form-item>
                    <div class="mainname titleInfo">MC详情</div>
                    <el-form-item class="cl_td" label="顺序号" prop="cardSerialNo" >
                        <el-input v-model="exceptionMObj.cardSerialNo" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="有效期" prop="expirationDate" >
                        <el-input v-model="exceptionMObj.expirationDate" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="控管原因" prop="contrlReason" >
                        <el-input v-model="exceptionMObj.contrlReason" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="VIP金额" prop="vipAmount" >
                        <el-input v-model="exceptionMObj.vipAmount" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="币种" prop="currencyCode" >
                        <el-input v-model="exceptionMObj.currencyCode" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="同步状态" prop="syncFlag" >
                        <el-input v-model="exceptionMObj.syncFlag" class="wd200" type="text" />
                    </el-form-item>
                    <div class="cl_tr text_center">
                        <el-button size="medium" type="primary" @click="closeInfoM()">关闭</el-button >
                    </div>
                    
                </el-form> -->
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button  type="primary"  @click="authExce_dialogForm  = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 授权例外名单 删除弹窗 -->
        <el-dialog title="授权例外名单" :visible.sync="authExce_del_dialogForm" width="65%">
            <div v-show="del_showExceptionV">
                <exception-v-info
                    :formObj="exceptionVObj"
                ></exception-v-info>
            </div>
            <div -show="del_showExceptionM">
                <exception-m-info
                    :formObj="exceptionMObj"
                ></exception-m-info>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary"  @click="authExce_del_dialogForm  = false">
                    关闭
                </el-button>
                <el-button  type="primary"  @click="delExceptionSure">
                    删除
                </el-button>
            </div>
        </el-dialog>

        <!-- 授权例外名单 新增弹窗 -->
        <el-dialog title="授权例外名单" :visible.sync="authExce_add_dialogForm" width="65%">
            <div v-show="add_showExceptionV">
                <exception-v-info
                    :formObj="exceptionVObj"
                ></exception-v-info>
            </div>
            <div -show="add_showExceptionM">
                <exception-m-info
                    :formObj="exceptionMObj"
                ></exception-m-info>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary"  @click="authExce_add_dialogForm  = false">
                    关闭
                </el-button>
                <el-button  type="primary"  @click="addExceptionSure">
                    新增
                </el-button>
            </div>
        </el-dialog>



        <!-- 授权例外名单 修改弹窗 -->
        <el-dialog title="授权例外名单" :visible.sync="authExce_up_dialogForm" width="65%">
            <div v-show="up_showExceptionV">
                <exception-v-info
                    :formObj="exceptionVObj"
                ></exception-v-info>
            </div>
            <div -show="up_showExceptionM">
                <exception-m-info
                    :formObj="exceptionMObj"
                ></exception-m-info>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary"  @click="authExce_edit_dialogForm  = false">
                    关闭
                </el-button>
                <el-button  type="primary"  @click="upExceptionSure">
                    新增
                </el-button>
            </div>
        </el-dialog>


    </div>
  </template>
  
  <script>
  import ApiService from '@/api/api-service'
  import Pagination from '@/components/Pagination'
  import MediaInfo from '@/components-ider/cstSvc/MediaInfo'
import CommonTable from "@/components-ider/CommonTable"
import ExceptionVInfo from "@/components-ider/auth/ExceptionVInfo" // 授权例外名单VSIA
import ExceptionMInfo from "@/components-ider/auth/ExceptionMInfo" // 授权例外名单MCC

  export default {
    name: 'MediaLoss',
    components: {
      Pagination,
      MediaInfo,
      CommonTable,
      ExceptionVInfo,
      ExceptionMInfo
    },
    data() {
      return {
        longinInfoObj : {},
        queryForm: {
            idType: '',
            idNumber: '',
            externalIdentificationNo: '',
        },
        showTable: false,
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData: [],
        curRowRadio: '',
        curRow: {},
        // 下拉框
        idTypeList: [],
        mainSupplyIndicatorOptions: [],
        isTransferCardOptions: [],
        segmentNumberOptions: [],
        cardAssociationsOptions: [],

        baseInfoObj: {},
        sureBtnIsDisabled: false,


        // 媒介详情
        showInfo: false,
        text_title: '媒介信息详情',
        mediaBaseInfo: {}, // 媒介基本信息
        showLossBtn: false,
        mediaformRef: {},
        mediaObj: {
            isSupport: '',
            isSupportReplace: '',
            isSyncCardOrg: '',    
        },
        mediaRules: {},

        // 配置靓号
        setNum_dialogForm: false,
        showNickNum: true, // 靓号
        matcheFlag: '', // 配号标记
        setNumRef: {},
        setNumRules: {},
        setNumObj: {},
        // newMediaObj: {}, // 新媒介
        showCustNicknameDiv: false,
        // 号段信息表
        showSpcialNumTable: false,
        setNum_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        spcailNum_tableData: [],
        spcailNum_curRowRadio: '',
        spcailNum_curRow: {},
        // 特殊号信息表
        showSpcialNumTable2: false,
        setNum_config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        spcailNum_tableData2: [],
        spcailNum_curRowRadio2: '',
        spcailNum_curRow2: {},

        // 支持紧急替代卡
        replace_dialogForm : false,
        replaceCardRef : {},
        replaceCardRules : {},
        replaceCardObj : {},
        showReplaceCardTable : false,
        showReplaceCardTable2 : false,
        replace_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        replace_tableData: [],
        replace_config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        replace_tableData2: [],
        replace_curRowRadio: '',
        replace_curRowRadio2: '',
        replace_curRow: {},
        replace_curRow2: {},
        
        // 特别状况
        showSpecialSit: false,
        config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData2: [],
        curRowRadio2: '',
        curRow2: {},

        // 特别状况 详情
        sitDetail_dialogForm: false,
        sit_tableData1: [],
        sit_config1: {
            pageNum: 1,
            pageSize: 10,
            loading: false,
            total: 0
        },
        sit_tableLabel1: [
            {
            label: "管控项目确定",
            prop: "controlProjectNo"
            },
            {
            label: "管控描述",
            prop: "controlDesc"
            }
        ],

        // 新媒介
        showNewMediaList: false, // 显示新媒介列表
        isShowExcepBtn: false,  //授权例外名单按钮 
        showDetailBtn: false,
        showNewMediaInfo:false,// 显示新媒介信息
        newMediaData: [],
        newMediaDetailInfo: {}, // 新媒介信息
        text_title2: '新卡详情',


        // 授权例外名单
        authExce_dialogForm : false,
        authExce_queryObj : {},
        authExceRules : {},
        authExceRef : {},
        showExceptionV : false,
        showExceptionM : false,
        exceptionVObj: {},
        exceptionMObj: {},
        cwbZoneCodesList: [],
        authExce_del_dialogForm: false , // 授权例外名单 删除
        del_showExceptionV: false , 
        del_showExceptionM: false , 
        authExce_add_dialogForm: false , 
        add_showExceptionV: false , 
        add_showExceptionM: false , 
        authExce_up_dialogForm: false , 
        up_showExceptionV: false , 
        up_showExceptionM: false , 


      }
    },
    created() {
  
    },
    mounted() {
      this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeList = res
      })
      // 主附标识
        this.getSelectDict('dic_mainAttachedFlag').then((res) => {
            this.mainSupplyIndicatorOptions = res
        })
        // 是否转卡
        this.getSelectDict('dic_isYorN').then((res) => {
            this.isTransferCardOptions = res
        })
        

        // 卡组织标识
        this.getSelectDict('dic_cardAssociations').then((res) => {
            this.cardAssociationsOptions = res
        })
        

        this.getCorEntityNo() // 查询法人实体
        
    },
    methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showTable = false
            this.showInfo = false
            this.showLossBtn = false
            this.tableData = []
        },
      // 重置
      reset() {
        this.init()
      },
      // 查询法人实体
      getCorEntityNo () {
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        let params = {
            organNo : logininfo.organization
        }
        this.post('/beta/betaService/COS.IQ.02.0005', params, (res) => {
            if (res.returnCode == '000000') {
                this.longinInfoObj.corporationEntityNo = res.returnData.rows[0].corporationEntityNo
            }
        })
      },
      // 点击查询按钮
      handleSearch() {
        this.showInfo = false
        this.showLossBtn = false
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
              this.getCustBaseInfo()
            }
          } else if (this.queryForm.idNumber) {
            if (!this.queryForm.idType) {
              this.$message({
                message: '请输入证件类型',
                type: 'warning'
              })
            } else {
              this.getCustBaseInfo()
            }
          } else {
            this.getCustBaseInfo()
          }
        }
      },
      // 查询列表 
      getList() {
        this.config.loading = true
        let params = {
            flag : '1',
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            idType: this.queryForm.idType,
            idNumber: this.queryForm.idNumber,
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainAttachedFlag','dic_activationStateTable','dic_invalidFlagYN','dic_invalidReason','dic_isYorN'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator','activationFlag', 'invalidFlag','invalidReason', 'transferCard'],//翻译前后key
        }
        this.config = Object.assign(this.config, this.queryForm, params)
        this.getTableList('/nonfi/nonfinanceService/ISS.OP.01.0001', this.config, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                }
            }
        })
      },
      // 获取客户基本信息
      getCustBaseInfo () {
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryForm, (res) => {
            if (res.returnCode == '000000') {
                this.baseInfoObj = res.returnData.rows[0]
                this.mediaBaseInfo = Object.assign(this.mediaBaseInfo, this.baseInfoObj)
                // this.baseInfoObj.idNumber = res.returnData.rows[0].idNumber
                // this.baseInfoObj.idType = res.returnData.rows[0].idType
                // this.baseInfoObj.customerName = res.returnData.rows[0].customerName
                this.getList()
            }
        })
      },

      // 特别状况列表
      getSpecialSitList() {
        this.config2.loading = true
        let params = {
            queryType: 'E',
            operationMode: this.curRow.operationMode,
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_scenarioTriggerType' ],//查找数据字典所需参数
			transDict : ['sceneTriggerObject'],//翻译前后key
        }
        this.config2 = Object.assign(this.config2, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0085', this.config2, (res) => {
            if (res.returnCode == '000000') {
                this.showSpecialSit = true
                this.config2.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData2 = res.returnData.rows
                    this.config2.total = res.returnData.totalCount
                } else {
                    this.tableData2 = []
                }
            }
        })
     },

      // 确定挂失
      sureLoss() {
        this.mediaBaseInfo = Object.assign( this.baseInfoObj, this.curRow )
        if (this.mediaBaseInfo.isTransferCard == 'N') { // 不可转卡
            if (!this.curRow2) { // 封锁码
                this.$message({
                    message: '请选择封锁码',
                    type: 'warning'
                })
                return
            }
            let pramas1 = this.curRow2
            let pramas2 =  {
                flag: '2',	
                operationMode: this.baseInfoObj.operationMode,
                contrlLevel:'M',
                levelCode: this.mediaBaseInfo.mediaUnitCode,
                customerNo: this.baseInfoObj.mainCustomerNo,
                idType: this.baseInfoObj.idType,
                idNumber: this.baseInfoObj.idNumber,
                externalIdentificationNo: this.mediaBaseInfo.externalIdentificationNo,
                spEventNo : this.curRow2.eventNo
            }
            let params = Object.assign(pramas1, pramas2)
            this.post('/nonfi/nonfinanceService/BSS.SP.01.9999', params , (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '挂失成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.showSpecialSit = true
                    this.showInfo = true
                }
            })
        } else if (this.mediaBaseInfo.isTransferCard == 'Y') { // 可转卡
            //判断是否收取挂失费，然后在进行挂失
            this.isGetLossFeeFun(this.mediaBaseInfo)
        }
      },
      //  是否收取挂失费函数
      isGetLossFeeFun(params) {
        params.eventId = 'ISS.OP.01.0003'
        this.post('/nonfi/nonfinanceService/COS.IQ.02.0001', params , (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData.rows[0].feeItemNo) {
                    this.$confirm('是否收取挂失费?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => { // 是
                            params.isGetLossFee = 'Y'
							this.mediaLossFun(params) // 挂失函数
                        }).catch(() => { // 否
                            params.isGetLossFee = 'N'
							this.mediaLossFun(params) // 挂失函数      
                    });
                }
            }
        })
      },
      // 媒介挂失 函数
      mediaLossFun(params) {
        this.post('/nonfi/nonfinanceService/COS.IQ.02.0001', params , (res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '挂失成功',
                    type: 'success',
                    duration: 2000
                })
                this.showInfo = true;
                // 初始化 重置表单

                //将新卡信息 放入表格
				// this.putNewMediaInfo(res.returnData.rows[0]);
                this.showNewMediaList = true
                this.newMediaData.push(res.returnData.rows[0])
                this.showDetailBtn = true

				//用旧卡信息 判断是否显示 授权例外名单
                if (params.isSyncCardOrg == '1' &&( params.cardScheme == 'V' || params.cardScheme == 'M')) {
                    this.isShowExcepBtn = true;//授权例外名单按钮 
                } else {
                    this.isShowExcepBtn = false;//授权例外名单按钮 
                }
            }
        })
      },

      // 将数据放入新列表
      putNewMediaInfo(data) {
        this.showNewMediaList = true
        this.newMediaData.push(data)
        this.showDetailBtn = true
      },
        // 新列表详情
        queryNewMeadiaDetail (row) {
            let _this = this
            let params = {
                externalIdentificationNo : row.externalIdentificationNo,
				mediaUnitCode : row.mediaUnitCode,
            }
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0217', params , (res) => {
                if (res.returnCode == '000000') {
                    _this.showDetailBtn = false
                    _this.showNewMediaList = true
                    _this.newMediaDetailInfo = Object.assign({}, res.returnData.rows[0] )
                    _this.newMediaDetailInfo.mediaObjectCodeTrans = _this.newMediaDetailInfo.mediaObjectCode + _this.newMediaDetailInfo.mediaObjectDesc
                    _this.newMediaDetailInfo.productObjectCodeTrans = _this.newMediaDetailInfo.productObjectCode + _this.newMediaDetailInfo.productDesc
                } 
                else {
                    this.showInfo = false
                }
            
            })

        },
        // 收起
        closeBtn(row) {
            this.isShowBtn = true
			this.showNewMediaList = false//详情
        },
        // 授权例外名单
        queryException() {
            // 授权例外名单弹窗
            this.authExce_dialogForm = false
        },
        //
        selException() {
            this.authExce_queryObj.authDataSynFlag = '1'
            this.post('/auth/authService/AUS.IQ.01.0008', this.authExce_queryObj , (res) => {
                if (res.returnCode == '000000') {
                    this.authExce_dialogForm = true
                    if (res.returnData ) {
                        if (res.returnData.cwbZoneCode) {
                            let cwbstr = ''
                            let cwbZoneCodes = res.returnData.cwbZoneCode
                            cwbZoneCodes.forEach(element => {
                                cwbstr = {
                                    cwbZoneCode: cwbZoneCodes.substr(i,1)
                                }
                                this.cwbZoneCodesList.push(cwbstr)
                            })
                        }
                        if (this.authExce_queryObj.cardAssociations == 'V') {
                            this.exceptionVObj = data.returnData
                            this.showExceptionV = true
                            this.showExceptionM = false
                        } else if (this.authExce_queryObj.cardAssociations == 'M') {
                            this.exceptionMObj = data.returnData
                            this.showExceptionV = false
                            this.showExceptionM = true
                        }
                    }
                }
            })
        },
        addException() {
            // AUS.OP.01.0001 AUS.OP.01.0002
            this.authExce_add_dialogForm = true
           
            if (this.authExce_queryObj.cardAssociations == 'V') {
                this.exceptionVObj = {}
                this.exceptionVObj.cardAssociations = this.authExce_queryObj.cardAssociations
                this.exceptionVObj.externalIdentificationNo = this.authExce_queryObj.externalIdentificationNo
                this.add_showExceptionV = true
                this.add_showExceptionM = false
            } else if (this.authExce_queryObj.cardAssociations == 'M') {
                this.exceptionMObj = {}
                this.exceptionMObj.externalIdentificationNo = this.authExce_queryObj.externalIdentificationNo
                this.exceptionMObj.cardAssociations = this.authExce_queryObj.cardAssociations
                this.add_showExceptionV = false
                this.add_showExceptionM = true
            }
        },
        addExceptionSure() {
            let url = ''
            if (this.authExce_queryObj.cardAssociations == 'V') {
                url = 'AUS.OP.01.0001'
                let params = {
                    authFlag: '0',
                    authDataSynFlag: '1'
                }
                let cwbZoneCodeStr = ''
                this.cwbZoneCodesList.forEach(item => {
                    cwbZoneCodeStr += item.cwbZoneCode1
                })
                this.exceptionVObj.cwbZoneCode = cwbZoneCodeStr
                this.exceptionVObj = Object.assign(this.exceptionVObj, params)
                this.addExceptionHandle(url, this.exceptionVObj)
            } else if (this.authExce_queryObj.cardAssociations == 'M') {
                url = 'AUS.OP.01.0002'
                let params = {
                    authFlag: '0',
                    authDataSynFlag: '1'
                }
                this.exceptionMObj = Object.assign(this.exceptionMObj, params)
                this.addExceptionHandle(url, this.exceptionMObj)
            }
        },
        addExceptionHandle(url, obj) {
            let params = {
                authFlag: '0',
                authDataSynFlag: '1'
            }
            this.post('/auth/authService/'+url, obj , (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: "Success",
                        message: "新增成功",
                        type: "success",
                        duration: 2000
                    });
                }
            })
        },
        updateException() {
            this.authExce_queryObj.authDataSynFlag = '1'
            this.post('/auth/authService/AUS.IQ.01.0008', this.authExce_queryObj , (res) => {
                if (res.returnCode == '000000') {
                    this.authExce_up_dialogForm = true
                    if (res.returnData ) {
                        if (res.returnData.cwbZoneCode) {
                            let cwbstr = ''
                            let cwbZoneCodes = res.returnData.cwbZoneCode
                            cwbZoneCodes.forEach(element => {
                                cwbstr = {
                                    cwbZoneCode: cwbZoneCodes.substr(i,1)
                                }
                                this.cwbZoneCodesList.push(cwbstr)
                            })
                        }
                        if (this.authExce_queryObj.cardAssociations == 'V') {
                            this.exceptionVObj = data.returnData
                            this.up_showExceptionV = true
                            this.up_showExceptionM = false
                        } else if (this.authExce_queryObj.cardAssociations == 'M') {
                            this.exceptionMObj = data.returnData
                            this.up_showExceptionV = false
                            this.up_showExceptionM = true
                        }
                    }
                }
            })
        },
        upExceptionSure() {
            let url = ''
            if (this.authExce_queryObj.cardAssociations == 'V') {
                url = 'AUS.OP.01.0001'
                let params = {
                    authFlag: '0',
                    authDataSynFlag: '1'
                }
                let cwbZoneCodeStr = ''
                this.cwbZoneCodesList.forEach(item => {
                    cwbZoneCodeStr += item.cwbZoneCode1
                })
                this.exceptionVObj.cwbZoneCode = cwbZoneCodeStr
                this.exceptionVObj = Object.assign(this.exceptionVObj, params)
                this.addExceptionHandle(url, this.exceptionVObj)
            } else if (this.authExce_queryObj.cardAssociations == 'M') {
                url = 'AUS.OP.01.0002'
                let params = {
                    authFlag: '0',
                    authDataSynFlag: '1'
                }
                this.exceptionMObj = Object.assign(this.exceptionMObj, params)
                this.addExceptionHandle( url, this.exceptionMObj)
            }
        },
        // upExceptionHandle () {

        // },
        delException() {
            this.authExce_queryObj.authDataSynFlag = '1'
            this.post('/auth/authService/AUS.IQ.01.0008', this.authExce_queryObj , (res) => {
                if (res.returnCode == '000000') {
                    this.authExce_del_dialogForm = true
                    if (res.returnData ) {
                        if (res.returnData.cwbZoneCode) {
                            let cwbstr = ''
                            let cwbZoneCodes = res.returnData.cwbZoneCode
                            cwbZoneCodes.forEach(element => {
                                cwbstr = {
                                    cwbZoneCode: cwbZoneCodes.substr(i,1)
                                }
                                this.cwbZoneCodesList.push(cwbstr)
                            })
                        }
                        if (this.authExce_queryObj.cardAssociations == 'V') {
                            this.exceptionVObj = data.returnData
                            this.del_showExceptionV = true
                            this.del_showExceptionM = false
                        } else if (this.authExce_queryObj.cardAssociations == 'M') {
                            this.exceptionMObj = data.returnData
                            this.del_showExceptionV = false
                            this.del_showExceptionM = true
                        }
                    }
                }
            })
        },
        // 确认删除授权例外名单
        delExceptionSure() {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // 是
                let url = ''
                if (this.authExce_queryObj.cardAssociations == 'V') {
                    url = 'AUS.OP.01.0001'
                } else if (this.authExce_queryObj.cardAssociations == 'M') {
                    url = 'AUS.OP.01.0002'
                }
                this.delExceptionHandle(url)
            }).catch(() => { // 否  
            })
        }, 
        delExceptionHandle(url) {
            let params = {
                authDataSynFlag: '1',
                authFlag: '2',
                externalIdentificationNo: this.authExce_queryObj.externalIdentificationNo,
                cardAssociations: this.authExce_queryObj.cardAssociations
            }
            this.post('/auth/authService/'+url, this.authExce_queryObj , (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: "Success",
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                }
            })
        },

      // 
      handleCurrRowChange(row) {
            this.showInfo = true
            this.showLossBtn = true
            if (!row) {
                // this.handleSearch()
                return
            }
            this.curRow = row
            // this.mediaBaseInfo = row
        if (this.curRow.transferCard == 'N') { // 不可转卡
            this.sureBtnIsDisabled = true
            this.showInfo = false
            this.$message({
                message: '当前状态不可转卡',
                type: 'warning'
            })
            return
        } else  if (this.curRow.transferCard == 'Y') { // 可转卡
            this.sureBtnIsDisabled = false
            if (this.curRow.invalidReason == 'TRF') {
                this.$message({
                    message: '该卡已经转卡',
                    type: 'warning'
                })
                return
            } else if (this.curRow.invalidReason == 'EXP') {
                this.$message({
                    message: '该卡已经到期',
                    type: 'warning'
                })
                return
            } else if (this.curRow.invalidReason == 'BRK') {
                this.$message({
                    message: '该卡已经毁损',
                    type: 'warning'
                })
                return
            } else if (this.curRow.invalidReason == 'CLS') {
                this.$message({
                    message: '该卡已经关闭',
                    type: 'warning'
                })
                return
            } else {
                let _this = this
                let params = {
                    externalIdentificationNo: this.curRow.externalIdentificationNo,
                    mediaObjectCode: this.curRow.mediaObjectCode,
                }
                // this.mediaBaseInfo = row
                this.post('/nonfi/nonfinanceService/ISS.OP.01.0002', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let row = res.returnData.rows[0]
                            _this.mediaBaseInfo = Object.assign(_this.curRow, row)
                            _this.mediaBaseInfo.mediaObjectCodeTrans = _this.mediaBaseInfo.mediaObjectCode + _this.mediaBaseInfo.mediaObjectDesc
                            _this.mediaBaseInfo.productObjectCodeTrans = _this.mediaBaseInfo.productObjectCode + _this.mediaBaseInfo.productDesc
                        }
                        _this.mediaObj.isTransferCard = _this.mediaBaseInfo.isTransferCard

                        //关联客户靓号
                        let params1 = {
                            productObjectCode : _this.mediaBaseInfo.productObjectCode,
                            externalIdentificationNo : _this.mediaBaseInfo.externalIdentificationNo,
                            operationMode :  _this.mediaBaseInfo.operationMode,
                        }
                        this.queryIsSupportSetNum(params1)

                        //查询媒介基本信息

                        // 查询新媒介

                        console.log(_this.mediaBaseInfo)
                        console.log(_this.curRow)
                    }
                })
            }


        }


      },
      chooseCurrRow(row) {
        //   console.log(row)
          this.curRowRadio = row.mediaUnitCode
      },
      // 是否转卡
      transCardChange(val) {
        if (val == 'N') {
            // 显示特别状况 不显示靓号
            this.showSpecialSit = true
            this.showNickNum = false
            this.getSpecialSitList()
        } else if (val == 'Y') {
            // 不显示特别状况 显示靓号
            this.showSpecialSit = false
            this.showNickNum = true
        }
      },
      
      
      // 是否支持配置靓号
        isSupportChange(val) {
            if (this.matcheFlag == '1') { //支持配置靓号
                if(val == '1'){ //必须选择支持配置靓号
					// $scope.atuoMatcheFun($rootScope.productObject);
                    console.log(this.curRow)
                    this.atuoMatcheFun(this.curRow)
				}else {
                    this.$message({
                        message: '请选择支持配置靓号',
                        type: 'warning'
                    })
                    return
				}
            } else if (this.matcheFlag == '2') { //不显示弹窗,自动配号
                this.showCustNicknameDiv = false // 是否显示 自动配号输入框
                if (val == '1') {
                    this.$notify({
                      title: '提示',
                      message: ';抱歉，不支持配置靓号',
                      type: 'warning',
                      duration: 2000
                    })
                }
            } else if (this.matcheFlag == '3') {
                if (val == '1') { //必须选择支持配置靓号
                    this.atuoMatcheFun(this.curRow)
                } else if (val == '2') {
                    this.showCustNicknameDiv = false;
                    this.mediaObj.externalIdentificationNoIn = ''
					return
                }
            }
        },  
        // 是否同步卡组织
        isSyncCardOrgChange(val) {
            // if () {

            // } else if () {
                
            // }
        },

        // 查询是否支持靓号
        queryIsSupportSetNum(params) {
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0014', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let row = res.returnData.rows[0]
                            if (row.flagl) {
                                this.matcheFlag = row.flagl // 
                                if (row.flagl == '1') {
                                    this.showNickNum = true
                                    this.mediaBaseInfo.isSupport = '1'
                                } else if (row.flagl == '2') {
                                    this.showNickNum = false
                                    this.mediaBaseInfo.isSupport = '2'
                                } else if (row.flagl == '3') {
                                    this.showNickNum = true
                                    this.mediaBaseInfo.isSupport = ''
                                }
                            } else {
                                this.showNickNum = false

                            }
                        }
                        
                    }
                })
        },
        // 自动配号
        atuoMatcheFun(params) {
            this.setNum_dialogForm = true
            this.setNumObj.cardBin = params.externalIdentificationNo.substr(0,6)
            // 特殊号码段号
            this.post('/beta/betaService/COS.IQ.02.0045', {
                cardBin: params.externalIdentificationNo.substr(0,6),
				criticalFlag : 'N'
            }, (res) => {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.segmentNumberOptions = res.returnData.rows
                } else {
                    this.segmentNumberOptions = []
                }
            })
        },
        // 配置靓号中 查询按钮
        setNumSearch() {
            this.$refs['setNumRef'].validate((valid) => {
                if (valid) {
                    this.showSpcialNumTable2 = false
                    this.setNum_getSpecialNumlist() // 特殊号段信息表
                }
            })
        },
        // 特殊号段信息表
        setNum_getSpecialNumlist() {
            this.setNum_config.loading = true
            let params = {
                cardBin: this.setNumObj.cardBin,
				corporationEntityNo: this.longinInfoObj.corporationEntityNo,
                segmentNumber: this.setNumObj.segmentNumber
            }
            this.setNum_config = Object.assign(this.setNum_config , params)
            this.getTableList("/beta/betaService/COS.IQ.02.0059", this.setNum_config, res => {
                if (res.returnCode == "000000") {
                    this.setNum_config.loading = false;
                    this.showSpcialNumTable = true
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.spcailNum_tableData = res.returnData.rows;
                        this.setNum_config.total = res.returnData.totalCount;
                    } else {
                        this.spcailNum_tableData = [];
                    }
                }
            });
        },
        // 查询特殊号
        querySpcialNum(row) {
            this.showSpcialNumTable2 = true
            this.spcailNum_tableData2 = []
            this.setNum_getSpecialNumInfolist(row)
        },
        // 特殊号信息表
        setNum_getSpecialNumInfolist(row) {
            this.setNum_config2.loading = true
            let params = {
                cardBin: this.setNumObj.cardBin,
				corporationEntityNo: this.longinInfoObj.corporationEntityNo,
                segmentNumber: row.segmentNumber
            }
            this.setNum_config2 = Object.assign(this.setNum_config2, params)
            this.getTableList("/beta/betaService/COS.IQ.02.0060", this.setNum_config2, res => {
                if (res.returnCode == "000000") {
                    this.setNum_config2.loading = false;
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rows = res.returnData.rows
                        rows.forEach(element => {
                            element.cardNumberStr =  '*********'+element.cardNumber.substr( 9, element.cardNumber.split('').length)
                        })
                        this.spcailNum_tableData2 = rows
                        this.setNum_config2.total = res.returnData.totalCount
                    } else {
                        this.spcailNum_tableData2 = [];
                    }
                }
            });
        },
        // 配置靓号中 重置按钮
        setNumReset() {
            this.setNumObj.segmentNumber = ''
            this.showSpcialNumTable = false
            this.showSpcialNumTable2 = false
        },
        // 关闭 配置靓号弹窗
        setNum_close() {
            this.setNum_dialogForm = false
            this.setNumObj = {}
            this.setNumObj.segmentNumber = ''
            this.showSpcialNumTable = false
            this.showSpcialNumTable2 = false
        },
        // 特殊号段信息表
        spcailNumSection_handleCurrRowChange(row) {
            this.spcailNum_curRow = row
        },
        // 特殊号段信息表
        spcailNumSection_chooseCurrRow(row){
            this.spcailNum_curRowRadio = row.segmentNumber
        },
        //特殊号信息
        spcailNum_handleCurrRowChang(row) {
            this.spcailNum_curRow2 = row
        },
        //特殊号信息
        spcailNum_chooseCurrRow(row) {
            this.spcailNum_curRowRadio2 = row.cardNumber
        },
        // 确定配置靓号
        sureMatcheNum() {
            if(!this.spcailNum_curRow){
                this.$message({
                    title: '提示',
                    message: '请选中一条记录',
                    type: 'warning',
                    duration: 2000
                })
				return;
            }
            if(!this.spcailNum_curRow2){
                this.$message({
                    title: '提示',
                    message: '请选中一条记录',
                    type: 'warning',
                    duration: 2000
                })
				return;
            }
            this.setNum_dialogForm = false
            this.showCustNicknameDiv = true
            this.setNumObj = {}
            this.showSpcialNumTable = false
            this.showSpcialNumTable2 = false
            // 客户靓号
            this.mediaObj.externalIdentificationNoIn = this.spcailNum_curRow2.cardNumber
            this.mediaBaseInfo = Object.assign(this.mediaBaseInfo, this.mediaObj)
            //移除支持替换中的新卡有效期
            if (this.mediaBaseInfo.newExpirationDate) {
                for(var key in this.mediaBaseInfo){
					if(key == 'newExpirationDate'){
						delete this.mediaBaseInfo.newExpirationDate;
					}
				}
            }
        },


          
       // 是否支持紧急替代卡
       isSupportReplaceChange(val) {
            if (val == '1') {
                this.isReplaceFun(this.curRow)
            } else if (val == '2') {
                
            }
        },
        // 是否支持紧急替代卡 弹窗
        isReplaceFun(params) {
            // 支持紧急替代卡详情
            this.replace_dialogForm = true
            this.replaceCardObj.cardBin = params.externalIdentificationNo.substr(0,6)
            // 特殊号码段号
            this.post('/beta/betaService/COS.IQ.02.0045', {
                cardBin: params.externalIdentificationNo.substr(0,6),
				criticalFlag : 'Y'
            }, (res) => {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.segmentNumberOptions = res.returnData.rows
                } else {
                    this.segmentNumberOptions = []
                }
            })

        },
        // 支持紧急替代卡 搜索
        replaceCardSearch() {
            this.$refs['replaceCardRef'].validate((valid) => {
                if (valid) {
                    this.showReplaceCardTable2 = false
                    this.replace_getSpecialNumlist() // 特殊号段信息表
                }
            })
        },
        // 重置
        replaceCardReset() {
            this.showReplaceCardTable = false
            this.showReplaceCardTable2 = false
            this.replaceCardObj.segmentNumber = ''
        },
        // 确定支持替代卡
        sureReplaceNum() {
            if(!this.replaceCardObj.newExpirationDate){
                this.$message({
                    title: '提示',
                    message: '请输入新卡有效期！',
                    type: 'warning',
                    duration: 2000
                })
				return
            }
            this.showCustNicknameDiv = true
            this.mediaObj.externalIdentificationNoIn = this.replace_curRow2.cardNumber
            this.mediaObj.newExpirationDate = this.replaceCardObj.newExpirationDate
            this.replace_dialogForm = false
        },
        replace_close() {
            this.replace_dialogForm = false
            this.replaceCardObj.segmentNumber =''
            this.showReplaceCardTable = false
            this.showReplaceCardTable2 = false
            this.replace_tableData = []
            this.replace_tableData2 = []
        },
        replaceSection_handleCurrRowChange (row) {
            this.replace_curRow = row
        },
        replaceSection_chooseCurrRow (row) {
            this.replace_curRowRadio = row.segmentNumber
        },
        replaceNum_handleCurrRowChang (row) {
            this.replace_curRow2 = row

        },
        replaceNum_chooseCurrRow (row) {
            this.replace_curRowRadio2 = row.cardNumber

        },
        // 支持紧急替代卡 特殊号段list
        replace_getSpecialNumlist () {
            this.replace_config.loading = true
            let params = {
                cardBin: this.replaceCardObj.cardBin,
				corporationEntityNo: this.longinInfoObj.corporationEntityNo,
                segmentNumber: this.replaceCardObj.segmentNumber
            }
            this.replace_config = Object.assign(this.replace_config , params)
            this.getTableList("/beta/betaService/COS.IQ.02.0059", this.replace_config, res => {
                if (res.returnCode == "000000") {
                    this.replace_config.loading = false;
                    this.showReplaceCardTable = true
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.replace_tableData = res.returnData.rows;
                        this.replace_config.total = res.returnData.totalCount;
                    } else {
                        this.replace_tableData = [];
                    }
                }
            });
        },
        // 查询特殊号
        replace_querySpcialNum(row) {
            this.showReplaceCardTable2 = true
            this.replace_tableData2 = []
            this.replace_getSpecialNumInfolist(row)
        },
        // 支持紧急替代卡 特殊号信息list
        replace_getSpecialNumInfolist (row) {
            this.replace_config2.loading = true
            let params = {
                cardBin: this.replaceCardObj.cardBin,
				corporationEntityNo: this.longinInfoObj.corporationEntityNo,
                segmentNumber: row.segmentNumber
            }
            this.replace_config2 = Object.assign(this.replace_config2, params)
            this.getTableList("/beta/betaService/COS.IQ.02.0060", this.replace_config2, res => {
                if (res.returnCode == "000000") {
                    this.replace_config2.loading = false;
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rows = res.returnData.rows
                        rows.forEach(element => {
                            element.cardNumberStr =  '*********'+element.cardNumber.substr( 9, element.cardNumber.split('').length)
                        })
                        this.replace_tableData2 = rows
                        this.replace_config2.total = res.returnData.totalCount
                    } else {
                        this.replace_tableData2 = [];
                    }
                }
            });
        },







      // 封锁码管理
      handleCurrRowChange2(row) {
          this.curRow2 = row
      },
      chooseCurrRow2(row) {
          console.log(row)
          this.curRowRadio2 = row.eventNo
      },
      // 特别状况详情
      handleSitDetail(row) {
        if (!row.effectivenessCodeType && !row.effectivenessCodeScene && !row.sceneTriggerObject) {
            this.$message({
                message: "参数设置不正确",
                type: "warning"
            })
            return
        } else { 
            this.sitDetail_dialogForm = true
            this.sit_getList1(row)
            // this.sit_getList2(row) 
        }
      },
        // 管控码关联的管控项目
        sit_getList1(row) {
            this.sit_config1.loading = true;
            let params = {
                effectivenessCodeType: row.effectivenessCodeType,
				effectivenessCodeScene: row.effectivenessCodeScene,
				projectType:'0'
            }
            this.sit_config1 = Object.assign( this.sit_config1, params)
            this.getTableList("/beta/betaService/COS.IQ.02.0050", this.sit_config1, res => {
                if (res.returnCode == "000000") {
                    this.sit_config1.loading = false;
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.sit_tableData1 = res.returnData.rows;
                        this.sit_config1.total = res.returnData.totalCount;
                    } else {
                        this.sit_tableData1 = [];
                    }
                }
            });
        },

        // 已选定价标签
        sit_getList2(row) {
            this.sit_tableLabel1.loading = true;
            this.sit_tableLabel1.businessTypeCode = row.businessTypeCode;
            this.sit_tableLabel1.operationMode = row.operationMode;
            this.getTableList("/beta/betaService/COS.IQ.02.0052", this.sit_tableLabel1, res => {
                if (res.returnCode == "000000") {
                    this.sit_tableLabel1.loading = false;
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.sit_tableData1 = res.returnData.rows;
                        this.sit_tableLabel1.total = res.returnData.totalCount;
                    } else {
                        this.sit_tableData1 = [];
                    }
                }
            });
        },
        
   
    }
  }
  </script>
  
  <style>
  </style>
  