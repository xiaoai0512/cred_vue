<!-- 额度节点管理 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                    <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                        :value="item.operationMode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId">
                <el-input v-model="queryFormObj.creditTreeId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="额度节点" prop="instanCode1">
                <el-input v-model="queryFormObj.creditNodeNo" class="wd200" type="text" />
            </el-form-item>
           	<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()"
                    v-if="selBtnFlag01">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary"
                    @click="handleAdd(queryFormObj.operationMode)">新增</el-button>
            </div>
        </el-form>
        <div v-if="showTableList1">
            <el-table v-loading="listLoading1" :data="tableList1" class="mbtm20" fit highlight-current-row
                style="width: 100%;" border>
              	<el-table-column prop="creditTreeId" label="额度网编号" align="center" width="200" />
                <el-table-column prop="creditNodeNo" label="额度节点" align="center" width="200" />
                <el-table-column prop="creditDesc" label="描述" align="center" width="200" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)"
                            v-if=" selBtnFlag01">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)"
                            v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="primary"
                            @click="delAuthCreditNode(scope.row)">删除</el-button>
                        <span v-if="scope.row.creditNodeTyp == 'B'" style="margin-left: 10px;">
                            <el-button size="mini" icon="el-icon-info" type="primary" @click="handQuotaInfo(scope.row)"
                                v-if="selBtnFlag02">额度关系</el-button>
                            <el-button size="mini" icon="el-icon-info" type="primary" @click="handleTrade(scope.row)"
                                v-if="selBtnFlag03">交易识别</el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="queryFormObj.pageNum"
                :limit.sync="queryFormObj.pageSize" @pagination="getListTable" />
        </div>
        <!-- 新增 -->
        <el-dialog title="新增额度节点" :visible.sync="dialogFormVisibleAdd" width="65%" :before-close="closeAddForem">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd">
                <div class="clearboth"></div>
                <div class="mainname titleInfo">新增</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网" prop="creditTreeId"
                	:rules="[ { required: true, message: '额度网不能为空'}]">
                    <el-select v-model="tempAdd.creditTreeId" class="wd200"  clearable>
                        <el-option v-for="(item, index ) in creditTreeIdOptions" 
                        	:key="index" 
                        	:label="item.label" 
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo"
                    :rules="[ { required: true, message: '额度节点不能为空'} ]">
                    <el-input v-model="tempAdd.creditNodeNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="creditDesc"
                    :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="tempAdd.creditDesc" class="wd200" type="text" @input="inputChange($event)"/>
                </el-form-item>
				<div class="clearboth"></div>
                <div class="mainname titleInfo">节点信息</div>
                <el-form-item class="cl_td" label="节点类型" prop="creditNodeTyp"
                    :rules="[ { required: true, message: '节点类型不能为空'} ]">
                    <el-select v-model="tempAdd.creditNodeTyp" class="wd200" clearable>
                        <el-option v-for="(item, index ) in creditNodeTypOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div v-if="tempAdd.creditNodeTyp=='B'">
                    <el-form-item class="cl_td" label="额度种类" prop="creditCategory"
                        :rules="[ { required: true, message: '额度种类不能为空'} ]">
                        <el-select v-model="tempAdd.creditCategory" class="wd200" clearable @change="creditCategoryChange($event)">
                            <el-option v-for="(item, index ) in creditCategoryOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度性质" prop="creditProperty"
                        :rules="[ { required: true, message: '额度性质不能为空'} ]">
                        <el-select v-model="tempAdd.creditProperty" class="wd200" clearable  @change="creditPropertyChange($event)">
                            <el-option v-for="(item, index ) in creditPropertyOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度使用顺序" prop="creditRestoreSeq">
                        <el-input v-model="tempAdd.creditRestoreSeq" class="wd200" type="text" />
                    </el-form-item>
                    <div class="clearboth"></div>
                    <div class="dialog-footer" style="text-align: center;">
                        <el-button type="primary" @click="nextToPart2Btn()">下一步</el-button>
                    </div>
                </div>
                <div v-show="part2">
                    <el-form-item class="cl_td" label="额度节点" prop="creditNodeNoInfo">
                        <el-input v-model="creditNodeNoInfo" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度描述" prop="creditDescInfo">
                        <el-input v-model="creditDescInfo" class="wd200" type="text" />
                    </el-form-item>
                    <!-- 分期参数设置 -->
                    <set-param-option :colunm3="up_colunm3" :textTitle="up_textTitle" :list="up_stageInList"
                        @replaceParamClick="replaceParamClick(arguments)" @setParamClick="setParamClick(arguments)">
                    </set-param-option>
                    <div class="cl_tr text_center mtop20" v-show="part2Btn">
                        <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPart1Btn()">上一步
                        </el-button>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddForem()"> 取消</el-button>
                <el-button type="primary" @click="createData()">确定</el-button>
            </div>
        </el-dialog>
		<!--交易识别-->
        <el-dialog title="交易识别" :visible.sync="dialogFormVisibleTrade" width="65%">
            <el-form ref="dataFormTrade" :rules="rulesTrade" :model="tempTrade">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempTrade.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="tempTrade.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度描述" prop="creditDesc">
                    <el-input v-model="tempTrade.creditDesc" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <div style="float: right;margin-bottom: 5px;">
                <el-button class="text-right" size="mini" icon="el-icon-plus" type="primary"
                    @click="addTradeInfo(tempTrade)" v-if="updBtnFlag03">新增</el-button>
            </div>
            <el-table v-loading="tradelistLoading1" :data="tempTradeList" class="mbtm20" fit highlight-current-row
                style="width: 100%;" border>
                <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
                <el-table-column prop="businessProgramNodesc" label="业务项目" align="center" />
                <el-table-column prop="transIdentifiNoDesc" label="交易识别" align="center" />
                <el-table-column prop="" label="操作" align="center" width="400">
                    <template slot-scope="{row}">
                        <!--<el-button size="mini" icon="el-icon-edit" type="primary" @click="upTrade(row)"
                            v-if="updBtnFlag03">修改</el-button>-->
                        <el-button size="mini" icon="el-icon-delete-solid" type="primary" @click="delTrade(row)"
                            v-if="updBtnFlag03">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subAllTrade()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleTrade = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!--新增关联节点-->
        <el-dialog title="新增关联节点" :visible.sync="dialogFormVisibleAddAssNode" width="65%">
            <el-form ref="dataFormAssNode" :rules="rulesAssNode" :model="tempAssNode">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempAssNode.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="tempAssNode.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="业务项目" prop="businessProgramNo"
                    :rules="[ { required: true, message: '业务项目不能为空'} ]">
                    <el-select v-model="tempAssNode.businessProgramNo" class="wd200"
                        @change="businessProgramNoChange($event)">
                        <el-option v-for="(item, index ) in businessProgramNoOptions" :key="index"
                            :label="item.businessProgramNoDesc" :value="item.businessProgramNo" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别" prop="transIdentifiNo">
                    <el-select v-model="tempAssNode.transIdentifiNo" class="wd200" clearable readonly>
                        <el-option v-for="(item, index ) in transIdentifiNoOptions" 
                        	:key="index"
                            :label="item.label" 
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subAssNode()">保存</el-button>
                <el-button type="primary" @click="dialogFormVisibleAddAssNode = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!--修改关联接点-->
        <el-dialog title="维护关联节点" :visible.sync="dialogFormVisibleUpAssNode" width="65%">
            <el-form ref="dataFormUpAssNode" :rules="rulesUpAssNode" :model="tempUpAssNode">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempUpAssNode.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="tempUpAssNode.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="业务项目" prop="businessProgramNo"
                    :rules="[ { required: true, message: '业务项目不能为空'} ]">
                    <el-select v-model="tempUpAssNode.businessProgramNo" class="wd200"
                        @change="up_businessProgramNoChange($event)">
                        <el-option v-for="(item, index ) in businessProgramNoOptions" :key="index"
                            :label="item.businessProgramNoDesc" :value="item.businessProgramNo" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别" prop="transIdentifiNo">
                    <el-select v-model="tempUpAssNode.transIdentifiNo" class="wd200" clearable readonly>
                        <el-option v-for="(item, index ) in transIdentifiNoOptions" :key="index"
                            :label="item.transIdentifiDesc" :value="item.transIdentifiNo" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subUpAssNode()">保存</el-button>
                <el-button type="primary" @click="dialogFormVisibleUpAssNode = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 详情 查看pcd参数 弹窗-->
        <el-dialog :title="viewPcdTitle" :visible.sync="viewPcd_dialog" width="65%">
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewPcd_dialog = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail">
                <div class="mainname titleInfo">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempDetail.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网" prop="creditTreeId">
                    <el-input v-model="tempDetail.creditTreeId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="tempDetail.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度描述" prop="creditDesc">
                    <el-input v-model="tempDetail.creditDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">节点信息</div>
                <el-form-item class="cl_td" label="节点类型" prop="creditNodeTyp">
                    <el-select v-model="tempDetail.creditNodeTyp" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in creditNodeTypOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div v-if="tempDetail.creditNodeTyp=='B'">
                    <el-form-item class="cl_td" label="额度种类" prop="creditCategory">
                        <el-select v-model="tempDetail.creditCategory" class="wd200" clearable disabled>
                            <el-option v-for="(item, index ) in creditCategoryOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度性质" prop="creditProperty">
                        <el-select v-model="tempDetail.creditProperty" class="wd200" clearable disabled>
                            <el-option v-for="(item, index ) in creditPropertyOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度使用顺序" prop="creditRestoreSeq">
                        <el-input v-model="tempDetail.creditRestoreSeq" class="wd200" type="text" readonly />
                    </el-form-item>
                </div>
            </el-form>
           <!-- 额度节点参数选项 -->
			<div v-if="tempDetail.creditNodeTyp=='B'">
                <some-param-option v-if="table9List" :textTitle="textTitle9" :list="table9List"
                    @viewParamClick="hadleViewParam">
                </some-param-option>
                <pagination v-show="table9Total>0" :total="table9Total" :page.sync="table9FormObj.pageNum"
                    :limit.sync="table9FormObj.pageSize" @pagination="getListTable9" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 替换参数 弹窗 -->
        <el-dialog title="选择参数选项" :visible.sync="replcaeParam_dialog" width="65%">
            <replace-param :replaceObj="replaceParamObj" :replaceIndex="replaceIndex" :defalutVal="defalutChoseVal"
                @childByElementVal="childByElementVal">
            </replace-param>
            <div slot="footer" class="dialog-footer">
                <el-button @click="replcaeParam_dialog = false"> 关闭 </el-button>
                <el-button type="primary" @click="sureReplaceData()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 设置参数 弹窗 -->
        <el-dialog :title="setPcdTitle" :visible.sync="setParam_dialog" width="65%">
            <set-pcd :setPcdObj="setPcdObj" :setIndex="replaceIndex" @childBySetVal="childBySetVal"
                @childByDeletPcd="childByDeletPcd">
            </set-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setParam_dialog = false">关闭</el-button>
                <el-button type="primary" @click="sureSetData()">确定 </el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp">
                <div class="mainname titleInfo">基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网" prop="creditTreeId">
                    <el-input v-model="tempUp.creditTreeId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="tempUp.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="creditDesc">
                    <el-input v-model="tempUp.creditDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">节点信息</div>
                <el-form-item class="cl_td" label="节点类型" prop="creditNodeTyp"
                    :rules="[ { required: true, message: '节点类型不能为空'} ]">
                    <el-select v-model="tempUp.creditNodeTyp" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in creditNodeTypOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div v-if="tempUp.creditNodeTyp=='B'">
                    <el-form-item class="cl_td" label="额度种类" prop="creditCategory">
                        <el-select v-model="tempUp.creditCategory" class="wd200">
                            <el-option v-for="(item, index ) in creditCategoryOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度性质" prop="creditProperty">
                        <el-select v-model="tempUp.creditProperty" class="wd200">
                            <el-option v-for="(item, index ) in creditPropertyOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="额度使用顺序" prop="creditRestoreSeq">
                        <el-input v-model="tempUp.creditRestoreSeq" class="wd200" type="text" />
                    </el-form-item>
                </div>
            </el-form>
           	<!-- 分期参数设置 -->
            <div v-if="tempUp.creditNodeTyp=='B'">
                <set-param-option :colunm3="up_colunm3" :textTitle="up_textTitle" :list="up_stageInList"
                    @replaceParamClick="replaceParamClick(arguments)" @setParamClick="setParamClick(arguments)">
                </set-param-option>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()">确定</el-button>
            </div>
        </el-dialog>
        <!--额度关系-->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleQuota" :before-close="handleCloseQuota" width="65%" min-height="50%">
            <el-form ref="dataFormQuota" :rules="rulesQuota" :model="tempQuota">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempQuota.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="tempQuota.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId"
                	:rules="[ { required: true, message: '额度网编号不能为空'}]">
                    <el-select v-model="tempQuota.creditTreeId" class="wd200" @change="creditTreeIdChange($event)" disabled clearable>
                        <el-option v-for="(item, index ) in creditTreeIdOptions" 
                        	:key="index" 
                        	:label="item.label" 
                            :value="item.creditTreeId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网描述" prop="creditDesc">
                    <el-input v-model="tempQuota.creditDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="额度网版本号" prop="creditTreeVersion"
                	:rules="[ { required: true, message: '额度网版本号不能为空'}]">
                    <el-select v-model="tempQuota.creditTreeVersion" class="wd200" @change="creditTreeVersionChange($event)" clearable>
                        <el-option v-for="(item, index ) in creditTreeVersionOptions" 
                        	:key="index" 
                        	:label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点使用顺序" prop="creditRestoreSeq">
                    <el-input v-model="tempQuota.creditRestoreSeq" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname text_center">
                	<el-button size="mini" icon="el-icon-search"  type="primary"
                    @click="handleSearchQuota()">查询</el-button>
            	</div>
            </el-form>
            <div class="clearboth"></div>
            <div v-if="showQuotaTable">
            	<!--授信网-->
	            <div class="mainname">
	            	<div class="mainname text_left"  style="width: 50%;float: left;">授信网</div>
	                <el-button size="mini" icon="el-icon-plus" style="float: right;" type="primary"
	                    @click="handleAddCredit(tempQuota)" v-if="addCreditTreeActiveStatus=='N'">新增</el-button>
	            </div>
	            <div class="clearboth"></div>
	           	<el-table v-loading="creditLoading" :data="creditList" class="mbtm20" fit highlight-current-row
	                style="width: 100%;" border>
	                <el-table-column label="序号" type="index" width="50" align="center"> </el-table-column>
	                <el-table-column prop="creditNodeNoDesc" label="额度节点" align="center" />
	                <el-table-column prop="relativeNodeNoDesc" label="关联额度节点" align="center" />
	                <el-table-column prop="relativeNodeTypDesc" label="关联关系" align="center" />
	                <el-table-column prop="relativeTypDesc" label="关联类型" align="center" />
	                <el-table-column prop="creditTypeDesc" label="额度种类" align="center" />
	                <el-table-column prop="creditRatio" label="授信比例" align="center" />
	                <el-table-column prop="" label="操作" align="center" width="350" >
	                    <template slot-scope="scope" >
	                        <span v-show="scope.row.relativeTyp == '0'">
	                        	<el-button size="mini" icon="el-icon-info" type="primary"
	                                @click="handleDetailCredit(scope.row)" v-show="selBtnFlag02" >详情</el-button>
	                            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpCredit(scope.row)"
	                                v-show="scope.creditTreeActiveStatus !='Y'">修改</el-button>
	                            <el-button size="mini" icon="el-icon-delete-solid" type="primary"
	                                @click="handleDelCredit(scope.row)" v-show="delBtnFlag02" >删除</el-button>
	                        </span>
	                    </template>
	                </el-table-column>
	            </el-table>
	            <!--用信网-->
	            <div class="mainname">
                	<div class="mainname" style="width: 50%;float: left;">用信网节点关联关系</div>
	                <el-button size="mini" icon="el-icon-plus" style="float: right;" type="primary"
	                    @click="handleAddUseLetter(tempQuota)" v-if="addCreditTreeActiveStatus=='N'">新增</el-button>
	            </div>
	            <!--用信网节点关联关系-->
	            <el-table v-loading="useLetterNewLoading" :data="useLetterListNew" class="mbtm20" fit
                    highlight-current-row style="width: 100%;" border>
                    <el-table-column label="序号" type="index" width="50" align="center"> </el-table-column>
                    <el-table-column prop="creditNodeNoDesc" label="额度节点" align="center" />
                    <el-table-column prop="relativeNodeNoDesc" label="关联额度节点" align="center" />
                    <el-table-column prop="relativeNodeTypDesc" label="关联关系" align="center" />
                    <el-table-column prop="relativeTypDesc" label="关联类型" align="center" />
                   	<el-table-column prop="creditRestoreSeq" label="额度使用顺序" align="center"/>
                    <el-table-column prop="" label="操作" align="center" width="350">
                        <template slot-scope="scope">
                            <div v-if="scope.row.relativeTyp == '0'">
                                <el-button size="mini" icon="el-icon-info" type="primary"
                                    @click="handleDelUseLetterNew(scope.row)" v-show="selBtnFlag02">详情</el-button>
                                <el-button size="mini" icon="el-icon-edit" type="primary"
                                    @click="handleUpUseLetter(scope.row)" v-show="scope.creditTreeActiveStatus !='Y'">修改</el-button>
                                <el-button size="mini" icon="el-icon-delete-solid" type="primary"
                                    @click="handleDelUseLetter(scope.row)" v-show="selBtnFlag02">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mainname">
                	<div class="mainname" style="width: 50%;float: left;">用信网节点被关联关系</div>
	            </div>
	            <!--节点被关联关系-->
                <el-table v-loading="useLetterLoading" :data="useLetterList" class="mbtm20" fit
                    highlight-current-row style="width: 100%;" border>
                    <el-table-column label="序号" type="index" width="50" align="center"> </el-table-column>
                    <el-table-column prop="creditNodeNoDesc" label="额度节点" align="center" />
                    <el-table-column prop="relativeNodeNoDesc" label="关联额度节点" align="center" />
                    <el-table-column prop="relativeNodeTypDesc" label="关联关系" align="center" />
                    <el-table-column prop="relativeTypDesc" label="关联类型" align="center" />
                   	<el-table-column prop="creditRestoreSeq" label="额度使用顺序" align="center"/>
                    <el-table-column prop="" label="操作" align="center" width="350">
                        <template slot-scope="scope">
                            <div v-if="scope.row.relativeTyp == '0'">
                                <el-button size="mini" icon="el-icon-info" type="primary"
                                    @click="handleDetailUseLetter(scope.row)" v-show="selBtnFlag02">详情</el-button>
                           	</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleCloseQuota()">关闭</el-button>
            </div>
        </el-dialog>
        <!--额度网关系修改-->
        <el-dialog title="修改额度网关系" :visible.sync="dialogFormVisibleUpQuota" width="65%">
            <el-form ref="dataFormUpQuota" :rules="rulesUpQuota" :model="upQuotaInfo">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="upQuotaInfo.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" 
                        	:key="index" 
                        	:label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网" prop="creditTreeId">
                    <el-input v-model="upQuotaInfo.creditTreeId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="upQuotaInfo.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度描述" prop="creditDesc">
                    <el-input v-model="upQuotaInfo.creditDesc" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点使用顺序" prop="creditRestoreSeq" 
                	v-if="upQuotaInfo.actionTyp=='U'&& upQuotaInfo.relativeNodeTyp=='S'">
                    <el-input v-model="upQuotaInfo.creditRestoreSeq" class="wd200" type="text" />
                </el-form-item>
				<el-form-item class="cl_td" label="额度网编号" prop="creditTreeId"
                	:rules="[ { required: true, message: '额度网编号不能为空'}]">
                    <el-select v-model="upQuotaInfo.creditTreeId" class="wd200" clearable disabled
                    	@change="up_creditTreeIdChange($event)" clearable>
                        <el-option v-for="(item, index ) in creditTreeIdOptions" 
                        	:key="index" 
                        	:label="item.label" 
                            :value="item.creditTreeId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网版本号" prop="creditTreeVersion"
                	:rules="[ { required: true, message: '额度网版本号不能为空'}]">
                    <el-select v-model="upQuotaInfo.creditTreeVersion" class="wd200" clearable>
                        <el-option v-for="(item, index ) in creditTreeVersionOptions" 
                        	:key="index" 
                        	:label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo" style="background:#ececec;text-align-last:center;font-weight: 900;">
                </div>
                <div v-if="upQuotaInfo.actionTyp=='U'"> 
	                <el-form-item class="cl_td" label="关联类型" prop="relativeNodeTyp" 
	                    :rules="[ { required: true, message: '关联类型不能为空'} ]">
	                    <el-select v-model="upQuotaInfo.relativeNodeTyp" class="wd200"
	                        @change="relativeNodeTypChange($event)">
	                        <el-option v-for="(item, index ) in relativeNodeTypOptions" 
	                        	:key="index"
	                            :label="item.detailDesc" 
	                            :value="item.codes" />
	                    </el-select>
	                </el-form-item>
                </div>
                <div v-if="upQuotaInfo.actionTyp=='L'"> 
	                <el-form-item class="cl_td" label="关联类型" prop="relativeNodeTyp" 
	                    :rules="[ { required: true, message: '关联类型不能为空'} ]">
	                    <el-select v-model="upQuotaInfo.relativeNodeTyp" class="wd200"
	                        @change="relativeNodeTypChange($event)">
	                        <el-option v-for="(item, index ) in creditRatioOptions" 
	                        	:key="index"
	                            :label="item.detailDesc" 
	                            :value="item.codes" />
	                    </el-select>
	                </el-form-item>
                </div>
				<el-form-item class="cl_td" label="关联节点" prop="relativeNodeNo"
                    :rules="[ { required: true, message: '关联节点不能为空'} ]">
                    <el-select v-model="upQuotaInfo.relativeNodeNo" class="wd200" @change="up_relativeNodeNoChange($event)">
                        <el-option v-for="(item, index ) in relativeNodeNoOptions" 
                        	:key="index" 
                        	:label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
               	<el-form-item class="cl_td" label="授信比例" prop="creditRatio" v-if="upQuotaInfo.actionTyp=='L'"
                    :rules="[ { required: true, message: '授信比例不能为空'} ]">
                    <el-input v-model="upQuotaInfo.creditRatio" class="wd200" type="text" />
                </el-form-item>
               <el-form-item class="cl_td" label="额度种类" prop="creditType" v-if="upQuotaInfo.actionTyp=='L'"
               	:rules="[ { required: true, message: '额度种类不能为空'} ]">
	                <el-select v-model="upQuotaInfo.creditType" class="wd200" clearable>
	                    <el-option v-for="(item, index ) in creditTypeOptions" 
	                    	:key="index"
	                        :label="item.detailDesc" 
	                        :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <div v-if="upQuotaInfo.actionTyp=='U'&& upQuotaInfo.relativeNodeTyp=='S'">
		            <el-form-item class="cl_td" label="关联节点使用顺序" prop="relativeNodeNoVals">
	                    <el-input v-model="upQuotaInfo.relativeNodeNoVals" :disabled="edit" class="wd200" type="text" />
	                </el-form-item>
                </div>
               	<div v-if="upQuotaInfo.relativeNodeTyp =='S'">
                    <el-form-item class="cl_td" label="共享交易场景" prop="shareRelativeCode"
                        :rules="[ { required: true, message: '共享交易场景不能为空'} ]">
                        <el-select v-model="upQuotaInfo.shareRelativeCode" class="wd200">
                            <el-option v-for="(item, index ) in transSceneCodeOptions" 
                            	:key="index"
                                :label="item.label" 
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
               	</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUpQuota = false">取消</el-button>
                <el-button type="primary" @click="subUpQuota()">确定</el-button>
            </div>
        </el-dialog>
        <!--额度网关系新增-->
        <el-dialog title="新增关联节点" :visible.sync="dialogFormVisibleAddQuota" width="65%">
            <el-form ref="dataFormAddQuota" :rules="rulesAddQuota" :model="addQuotaInfo">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="addQuotaInfo.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网" prop="creditTreeId">
                    <el-input v-model="addQuotaInfo.creditTreeId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="addQuotaInfo.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度描述" prop="creditDesc">
                    <el-input v-model="addQuotaInfo.creditDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点使用顺序" prop="creditRestoreSeq" 
                	v-if="addQuotaInfo.actionTyp=='U'&& addQuotaInfo.relativeNodeTyp=='S'">
                    <el-input v-model="addQuotaInfo.creditRestoreSeq" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId"
                	:rules="[ { required: true, message: '额度网编号不能为空'}]">
                    <el-select v-model="addQuotaInfo.creditTreeId" class="wd200" @change="add_creditTreeIdChange($event)" clearable>
                        <el-option v-for="(item, index ) in creditTreeIdOptions" 
                        	:key="index" 
                        	:label="item.label" 
                            :value="item.creditTreeId" />
                    </el-select>
                </el-form-item>
               <el-form-item class="cl_td" label="额度网版本号" prop="creditTreeVersion"
                	:rules="[ { required: true, message: '额度网版本号不能为空'}]">
                    <el-select v-model="addQuotaInfo.creditTreeVersion" class="wd200" clearable>
                        <el-option v-for="(item, index ) in creditTreeVersionOptions" 
                        	:key="index" 
                        	:label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
				<div class="clearboth"></div>
                <div class="mainname titleInfo" style="background:#ececec;text-align-last:center;font-weight: 900;"></div>
			   	<div v-if="addQuotaInfo.actionTyp=='U'"> 
	                <el-form-item class="cl_td" label="关联类型" prop="relativeNodeTyp" 
	                    :rules="[ { required: true, message: '关联类型不能为空'} ]">
	                    <el-select v-model="addQuotaInfo.relativeNodeTyp" class="wd200"
	                        @change="addRelativeNodeTypChange($event)">
	                        <el-option v-for="(item, index ) in relativeNodeTypOptions" :key="index"
	                            :label="item.detailDesc" :value="item.codes" />
	                    </el-select>
	                </el-form-item>
                </div>
                <div v-if="addQuotaInfo.actionTyp=='L'"> 
	                <el-form-item class="cl_td" label="关联类型" prop="relativeNodeTyp" 
	                    :rules="[ { required: true, message: '关联类型不能为空'} ]">
	                    <el-select v-model="addQuotaInfo.relativeNodeTyp" class="wd200"
	                        @change="addRelativeNodeTypChange($event)">
	                        <el-option v-for="(item, index ) in creditRatioOptions" :key="index"
	                            :label="item.detailDesc" :value="item.codes" />
	                    </el-select>
	                </el-form-item>
                </div>
                <el-form-item class="cl_td" label="关联节点" prop="relativeNodeNo"
                    :rules="[ { required: true, message: '关联节点不能为空'} ]">
                    <el-select v-model="addQuotaInfo.relativeNodeNo" class="wd200"
                    	 @change="relativeNodeNoChange($event)">
                        <el-option v-for="(item, index ) in relativeNodeNoOptions" :key="index" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
				<el-form-item class="cl_td" label="授信比例" prop="creditRatio" v-if="addQuotaInfo.actionTyp=='L'"
                    :rules="[ { required: true, message: '授信比例不能为空'} ]">
                    <el-input v-model="addQuotaInfo.creditRatio" class="wd200" type="text" />
                </el-form-item>
               <el-form-item class="cl_td" label="额度种类" prop="creditType" v-if="addQuotaInfo.actionTyp=='L'"
               	:rules="[ { required: true, message: '额度种类不能为空'} ]">
	                <el-select v-model="addQuotaInfo.creditType" class="wd200" clearable>
	                    <el-option v-for="(item, index ) in creditTypeOptions" :key="index"
	                        :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <div v-if="addQuotaInfo.actionTyp=='U'&& addQuotaInfo.relativeNodeTyp=='S'">
		            <el-form-item class="cl_td" label="额度使用顺序" prop="relativeNodeNoVals">
	                    <el-input v-model="addQuotaInfo.relativeNodeNoVals" :disabled="edit" class="wd200" type="text" />
	                </el-form-item>
                </div>
               	<div v-if="addQuotaInfo.relativeNodeTyp =='S'">
                    <el-form-item class="cl_td" label="共享交易场景" prop="shareRelativeCode"
                        :rules="[ { required: true, message: '关联节点不能为空'} ]">
                        <el-select v-model="addQuotaInfo.shareRelativeCode" class="wd200">
                            <el-option v-for="(item, index ) in transSceneCodeOptions" :key="index"
                                :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
               	</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAddQuota = false">取消</el-button>
                <el-button type="primary" @click="subAddQuota()">确定</el-button>
            </div>
        </el-dialog>
        <!--额度网详情-->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetailQuota" width="65%">
            <el-form ref="dataFormDetailQuota" :rules="rulesDetailQuota" :model="detailQuotaInfo">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="detailQuotaInfo.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" 
                        	:key="index" 
                        	:label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网" prop="creditTreeId">
                    <el-input v-model="detailQuotaInfo.creditTreeId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-input v-model="detailQuotaInfo.creditNodeNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度描述" prop="creditDesc">
                    <el-input v-model="detailQuotaInfo.creditDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点使用顺序" prop="creditRestoreSeq" 
                	v-if="detailQuotaInfo.actionTyp=='U'&& detailQuotaInfo.relativeNodeTyp=='S'">
                    <el-input v-model="detailQuotaInfo.creditRestoreSeq" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId"
                	:rules="[ { required: true, message: '额度网编号不能为空'}]">
                    <el-select v-model="detailQuotaInfo.creditTreeId" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in creditTreeIdOptions" 
                        	:key="index" 
                        	:label="item.label" 
                            :value="item.creditTreeId" />
                    </el-select>
                </el-form-item>
               <el-form-item class="cl_td" label="额度网版本号" prop="creditTreeVersion"
                	:rules="[ { required: true, message: '额度网版本号不能为空'}]">
                    <el-select v-model="detailQuotaInfo.creditTreeVersion" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in creditTreeVersionOptions" 
                        	:key="index" 
                        	:label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
				<div class="clearboth"></div>
                <div class="mainname titleInfo" style="background:#ececec;text-align-last:center;font-weight: 900;"></div>
			   	<div v-if="detailQuotaInfo.actionTyp=='U'"> 
	                <el-form-item class="cl_td" label="关联类型" prop="relativeNodeTyp" 
	                    :rules="[ { required: true, message: '关联类型不能为空'} ]">
	                    <el-select v-model="detailQuotaInfo.relativeNodeTyp" class="wd200" clearable disabled>
	                        <el-option v-for="(item, index ) in relativeNodeTypOptions" 
	                        	:key="index"
	                            :label="item.detailDesc" 
	                            :value="item.codes" />
	                    </el-select>
	                </el-form-item>
                </div>
                <div v-if="detailQuotaInfo.actionTyp=='L'"> 
	                <el-form-item class="cl_td" label="关联类型" prop="relativeNodeTyp" 
	                    :rules="[ { required: true, message: '关联类型不能为空'} ]">
	                    <el-select v-model="detailQuotaInfo.relativeNodeTyp" class="wd200" clearable disabled>
	                        <el-option v-for="(item, index ) in creditRatioOptions" 
	                        	:key="index"
	                            :label="item.detailDesc" 
	                            :value="item.codes" />
	                    </el-select>
	                </el-form-item>
                </div>
                <el-form-item class="cl_td" label="关联节点" prop="relativeNodeNo"
                    :rules="[ { required: true, message: '关联节点不能为空'} ]">
                    <el-select v-model="detailQuotaInfo.relativeNodeNo" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in relativeNodeNoOptions" 
                        	:key="index" 
                        	:label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
				<el-form-item class="cl_td" label="授信比例" prop="creditRatio" v-if="detailQuotaInfo.actionTyp=='L'"
                    :rules="[ { required: true, message: '授信比例不能为空'} ]">
                    <el-input v-model="detailQuotaInfo.creditRatio" class="wd200" type="text" readonly/>
                </el-form-item>
               <el-form-item class="cl_td" label="额度种类" prop="creditType" v-if="detailQuotaInfo.actionTyp=='L'"
               	:rules="[ { required: true, message: '额度种类不能为空'} ]">
	                <el-select v-model="detailQuotaInfo.creditType" class="wd200" clearable disabled>
	                    <el-option v-for="(item, index ) in creditTypeOptions" 
	                    	:key="index"
	                        :label="item.detailDesc" 
	                        :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <div v-if="detailQuotaInfo.actionTyp=='U'&& detailQuotaInfo.relativeNodeTyp=='S'">
		            <el-form-item class="cl_td" label="额度使用顺序" prop="relativeNodeNoVals" >
	                    <el-input v-model="detailQuotaInfo.relativeNodeNoVals"  class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
               	<div v-if="detailQuotaInfo.relativeNodeTyp =='S'">
                    <el-form-item class="cl_td" label="共享交易场景" prop="shareRelativeCode"
                        :rules="[ { required: true, message: '关联节点不能为空'} ]">
                        <el-select v-model="detailQuotaInfo.shareRelativeCode" class="wd200" clearable disabled>
                            <el-option v-for="(item, index ) in transSceneCodeOptions" 
                            	:key="index"
                                :label="item.label" 
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
               	</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetailQuota = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from "@/components/Pagination";
	import SomeParamOption from "@/components-ider/SomeParamOption"; // 查看参数
    import ViewPcd from "@/components-ider/ViewPcd";
    import CommonTable from "@/components-ider/CommonTable";
    import SetParamOption from "@/components-ider/SetParamOption";
    import ReplaceParam from "@/components-ider/ReplaceParam";
    import SetPcd from "@/components-ider/SetPcd";
	export default {
        name: 'tableList',
        components: {
            // eslint-disable-next-line vue/no-unused-components
            Pagination,
            SomeParamOption,
            ViewPcd,
            CommonTable,
            SetParamOption,
            ReplaceParam,
            SetPcd
        },
        data() {
            return {
                // 权限
                selBtnFlag01: false,
                addBtnFlag: false,
                updBtnFlag: false,
                delBtnFlag02: false,
                selBtnFlag02: false,
                addBtnFlag02: false,
                updBtnFlag02: false,
                selBtnFlag03: false,
                updBtnFlag03: false,
                btnAuthStr: '',

                // 列表
                loading: false,
                queryFormRef: {},
                queryFormRules: {},
                tableData: [],
                tableList1: [],
                showTableList1: false,
                tableTotal1: 0,
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                // 下拉框
                operationModeOptions: [],
                creditNodeTypOptions: [],//节点类型
                creditCategoryOptions: [],//额度种类
                creditPropertyOptions: [],//额度性质
                contrlSceneCodeOptions: [],//管控场景代码
                relativeNodeTypOptions: [],//关联类型   
                relativeNodeNoOptions: [],//管联接点
                transSceneCodeOptions: [],//共享交易场景
                shareAvailIndUpdateOptions: [],//可用额度独立
                transIdentificationCodeOptions: [],
                creditTreeIdOptions: [],//额度网编号
                creditTreeVersionOptions: [],//额度网版本号
                stageTypeOptions: [],
                creditRatioOptions: [],//授信比例
                stageTypeCodeOptions: [{
                    codes: 'MODI',
                    detailDesc: 'MODI'
                }],

                // 增删改查
                tempAdd: {}, // 新增
                tempUp: {}, // 修改
                tempDetail: {}, // 详情
                dialogFormVisibleAdd: false,
                dialogFormVisibleUp: false,
                dialogFormVisibleDetail: false,
                rulesAdd: {},
                rulesDetail: {},
                rulesUp: {},

                // 详情
                // 已选交易识别代码
                tableData1: [],
                config1: {
                    pageNum: 1,
                    pageSize: 10,
                    loading: false,
                    total: 0
                },
                tableLabel1: [
                    {
                        label: "事件编号",
                        prop: "eventNo"
                    },
                    {
                        label: "事件描述",
                        prop: "eventDesc"
                    },
                    {
                        label: "分期类型",
                        prop: "installType"
                    }
                ],
                // 分期参数设置
                textTitle9: '额度节点参数选项',
                table9Loading: false,
                table9List: [],
                table9Total: 0,
                table9FormObj: {
                    pageSize: 10,
                    pageNum: 1
                },
                // 查看参数组价
                textTitle2: '业务项目参数设置',
                viewPcdTitle: '',
                viewPcd_dialog: false,
                viewPcdFormObj: {},

                // 修改
                // 配置参数
                up_stageInList: [], // 额度节点参数设置
                up_textTitle: "额度节点参数选项",
                up_colunm3: false,
                // 替换参数
                replcaeParam_dialog: false,
                replaceParamObj: {},
                listLoading1: false,
                replaceIndex: "",
                defalutChoseVal: "",
                choosedVal: "",
                // 设置参数
                setParam_dialog: false,
                setPcdObj: {},
                setPcdTitle: "",
                pcdList: [],
                delePcdList: [],

                // 新增
                newOperationMode: '',
                part1: true,
                part1Btn: true,
                part2: false,
                part2Btn: false,
                creditNodeNoInfo: '',
                creditDescInfo: '',
                // 配置参数
                add_stageInList: [], // 分期参数设置
                add_textTitle: "分期参数设置",
                add_colunm3: false,
                /*----交易识别----*/
                tempTrade: {},
                dataFormTrade: {},
                rulesTrade: {},
                dialogFormVisibleTrade: false,
                tempTradeList: [],
                tradelistLoading1: false,
                showNewMeshTable: false,
                //新增
                tempAssNode: {},
                dataFormAssNode: {},
                rulesAssNode: {},
                dialogFormVisibleAddAssNode: false,
                businessProgramNoOptions: [],
                transIdentifiNoOptions: [],
                add_businessProgramNo: '',//监听获取业务项目下拉值
                /*----修改----*/
                dialogFormVisibleUpAssNode: false,
                dataFormUpAssNode: {},
                rulesUpAssNode: {},
                tempUpAssNode: {},
                /*----额度关系----*/
                tempQuota: {},
                dataFormQuota: {},
                rulesQuota: {},
                dialogFormVisibleQuota: false,
                showQuotaTable: false,
                val1: '',
                val2: '',
                val3: '',
                creditList: [],
                creditLoading: false,
                creditTreeVersionListPublice: {},
                relativeNodeNoVals: '',
                //用信节点关联关系
                useLetterList: [],
                useLetterLoading: false,
                //用信节点被关联关系
                useLetterListNew: [],
                useLetterNewLoading: false,
               	//修改
                upQuotaInfo: {},
                rulesUpQuota: {},
                dataFormUpQuota: {},
                dialogFormVisibleUpQuota: false,
                relativeNodeTypVal: '',
                upRelativeNodeNoData: '',
                //新增
                addCreditTreeActiveStatus: '',
                creditTreeActiveStatusNew: '',
                addQuotaInfo: {},
                rulesAddQuota: {},
                dataFormAddQuota: {},
                dialogFormVisibleAddQuota: false,
                relativeNodeTypValAdd: '',
                edit: true,
                //详情
                dialogFormVisibleDetailQuota: false,
                detailQuotaInfo: {},
                rulesDetailQuota: {},
                dataFormDetailQuota: {},
            }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            // 运营模式 
            this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //节点类型
            this.getSelectDict("dic_node").then(res => {
                this.creditNodeTypOptions = res
            })
            //额度种类
            this.getSelectDict("dic_typeOfQuota").then(res => {
                this.creditCategoryOptions = res
            })
            //额度性质
            this.getSelectDict("dic_quotaNature").then(res => {
                this.creditPropertyOptions = res
            })
            // 交易识别码
            this.getSelectDict("/beta/betaService/COS.IQ.02.0044").then(res => {
                this.transIdentificationCodeOptions = res
            })
            // 分期种类
            this.getSelectDict("dic_stageType").then(res => {
                this.stageTypeOptions = res
            })
            //用信关联类型
            this.getSelectDict("dic_creditRelativeNodeTyp").then(res => {
                this.relativeNodeTypOptions = res
            })
            //可用额度独立
            this.getSelectDict("dic_shareAvailInd").then(res => {
                this.shareAvailIndUpdateOptions = res
            })
			//额度网编号
			this.getSelectDict("/beta/betaService/LMS.PM.01.0025").then(res => {
				this.creditTreeIdOptions = res
			})
			//授信关联类型
			this.getSelectDict("dic_creditRatio").then(res => {
				this.creditRatioOptions = res
			})
			//授信显示的额度种类
			this.getSelectDict("dic_creditTypeOptions").then(res => {
				this.creditTypeOptions = res
			})
			
        },
        methods: {
        	
            // 查询按钮权限
            getBtnAuth() {
                //console.log(window.sessionStorage.getItem('menuNo'))
                let params = {
                    menuNo: window.sessionStorage.getItem('menuNo')
                }
                this.getTableList('/beta/betaService/COS.CS.01.0030', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.length > 0) {
                        	this.updBtnFlag02 = false;
                            res.returnData.forEach(item => {
                                this.eventList += item.eventNo + ','
                                
                            })
                            if (this.eventList.includes('AUS.PM.03.0002')) { // 查询
                                this.selBtnFlag01 = true
                            } else {
                                this.selBtnFlag01 = false
                            }
                            if (this.eventList.includes('LMS.PM.01.0001')) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.eventList.includes('AUS.PM.03.0003')) { // 修改
                                this.updBtnFlag = true
                            } else {
                                this.updBtnFlag = false
                            }
                            if (this.eventList.includes('LMS.PM.01.0004')) {    //删除额度节点
                                this.delBtnFlag02 = true;
                            } else {
                                this.delBtnFlag02 = false;
                            }
                            if (this.eventList.includes('LMS.PM.01.0007')) {    //额度关系查询
                                this.selBtnFlag02 = true;
                            } else {
                                this.selBtnFlag02 = false;
                            }
                            if (this.eventList.includes('LMS.PM.01.0016')) {    //交易识别查询
                                this.selBtnFlag03 = true;
                            } else {
                                this.selBtnFlag03 = false;
                            }
                            if (this.eventList.includes('LMS.PM.01.0017')) {    //交易识别维护
                                this.updBtnFlag03 = true;
                            } else {
                                this.updBtnFlag03 = false;
                            }
                            if (this.eventList.includes('LMS.PM.01.0006')) {    //额度关系新增
                                this.addBtnFlag02 = true;
                            } else {
                                this.addBtnFlag02 = false;
                            }
                            if (this.eventList.includes('LMS.PM.01.0008')) {    //额度关系维护
                                this.updBtnFlag02 = true;
                            } else {
                                this.updBtnFlag02 = false;
                            }
                            if (this.eventList.includes('LMS.PM.01.0009')) {    //额度关系删除
                                this.delBtnFlag02 = true;
                            } else {
                                this.delBtnFlag02 = false;
                            }
                        }
                    }
                })
            },
            // 点击查询按钮
            handleSearch() {
            	this.queryFormObj.pageNum = 1
       			this.queryFormObj.pageSize = 10
       			this.getListTable()
            },
            //列表
            getListTable() {
                this.showTableList1 = true
                this.listLoading1 = true
                let params = {
                    authDataSynFlag: "1",
                    pageNum: this.queryFormObj.pageNum,
                    pageSize: this.queryFormObj.pageSize,
                    operationMode: this.queryFormObj.operationMode,
                    creditNodeNo: this.queryFormObj.creditNodeNo,
                    creditTreeId: this.queryFormObj.creditTreeId
                }
                this.getTableList('/beta/betaService/LMS.PM.01.0002', params, (res) => {
                    this.listLoading1 = false
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.tableList1 = res.returnData.rows
                            this.tableTotal1 = res.returnData.totalCount
                        } else {
                            this.tableList1 = []
                            this.tableTotal1 = 0
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.listLoading1 = false
                        this.tableList1 = []
                        this.tableTotal1 = 0
                    }
                })
            },
            //删除
            delAuthCreditNode(row) {
                row.authDataSynFlag = '1'
                this.$confirm('确认删除信息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // 是
                    this.post('/beta/betaService/LMS.PM.01.0004', row, (res) => {
                        if (res.returnCode == '000000') {
                            this.$notify({
                                title: 'Success',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.getListTable()
                        }
                    })
                })
            },
            /*----新增显示的弹框----*/
            handleAdd(row) {
                if (!this.queryFormObj.operationMode) {
                    this.$message({
                        message: '请选择运营模式',
                        type: 'warning'
                    })
                    return
                }
                this.dialogFormVisibleAdd = true
                this.tempAdd.operationMode = row
              	this.getContrlSceneCode()
              	this.getCreditTreeId()
               	this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
            },
            //额度网下拉
            getCreditTreeId(){
            	this.post('/beta/betaService/LMS.PM.01.0025', '',(res) => {
        			if (res.returnCode == '000000') {
			 	   		if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							let arr = []
							let rows =res.returnData.rows
							rows.forEach((item, index) => {
								item.creditTreeIdDesc =item.creditTreeId
								arr[index] = {
	                                label: item.creditTreeIdDesc,
	                                value: item.creditTreeId
	                            }
							})
							this.creditTreeIdOptions = arr
						}else{
							this.creditTreeIdOptions = []
						}
                   	}
				})
        	},
        	closeAddForem(){
            	this.dialogFormVisibleAdd = false
            	this.$refs['dataFormAdd'].resetFields()
            },
            inputChange (e) {
			    this.$forceUpdate()
			},
           	//场景管控代码
            getContrlSceneCode() {
                let obj = {
                    differentType: "0",
                    independentFlag: "1",
                    operationMode: this.queryFormObj.operationMode,
                }
                this.getSelectDict("/beta/betaService/AUS.PM.02.0102", obj).then(res => {
                    res.forEach(item => {
                        item.contrlSceneCodeDesc = item.contrlSceneCode + ' ' + item.contrlSceneDesc
                    });
                    this.contrlSceneCodeOptions = res
                })
            },
            //下一步额度节点列表数据  
            getSetList() {
                let obj = {
                    instanCode: this.creditNodeNoInfo,
                    instanDimen1: "LMND",
                    operationMode: this.queryFormObj.operationMode
                }
                this.getTableList("/beta/betaService/COS.IQ.02.0042", obj, res => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.up_stageInList = res.returnData.rows
                        } else {
                            this.up_stageInList = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.up_stageInList = []
                    }
                })
            },
            // 下一步
            nextToPart2Btn() {
                this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        this.part1 = false
                        this.part1Btn = false
                        this.part2 = true
                        this.part2Btn = true
                        this.creditNodeNoInfo = this.tempAdd.creditNodeNo
                        this.creditDescInfo = this.tempAdd.creditDesc
                        this.getSetList()
                    }
                })
            },
            // 上一步
            backPart1Btn() {
                this.part1 = true
                this.part1Btn = true
                this.part2 = false
                this.part2Btn = false
                this.creditNodeNoInfo = ''
                this.creditDescInfo = ''
            },
            creditCategoryChange(t){
            	this.$forceUpdate()
            },
            creditPropertyChange(r){
            	this.$forceUpdate()
            },
            //确认保存数据
            createData() {
                this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        this.up_stageInList.forEach(item => {
                            item.addPcdFlag = '1'
                            item.pcdList = item.pcdInitList
                            item.instanCode1 = this.creditNodeNoInfo
                            item.operationMode = this.tempAdd.operationMode
                        })
                        let subData = {}
                        subData.message = []
                      	subData.message.push(this.tempAdd)
                        subData.instanlist = this.up_stageInList
                        subData.operationMode = this.tempAdd.operationMode
                       	this.post('/beta/betaService/LMS.PM.01.0001', subData, (res) => {
                            if (res.returnCode == '000000') {
                                this.dialogFormVisibleAdd = false
                                this.$notify({
                                    title: 'Success',
                                    message: '新增成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.$refs['dataFormAdd'].resetFields()
                                this.part2 = false
                        		this.getListTable()
                            }
                        })
                    }
                })
            },
            /*---详情----*/
            handleDetail(row) {
                this.dialogFormVisibleDetail = true
                this.tempDetail = Object.assign({}, row)
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
               	this.getListTable9()
            },
            //已关联事件
            getEventList(row) {
                this.config1.loading = true;
                this.config1.installType = row.stageTypeCode;
                this.config1.operationMode = row.operationMode;
                this.getTableList("/beta/betaService/COS.IQ.02.0001", this.config1, res => {
                    if (res.returnCode == "000000") {
                        this.config1.loading = false;
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.tableData1 = res.returnData.rows;
                            this.config1.total = res.returnData.totalCount;
                        } else {
                            this.tableData1 = [];
                            this.config1.total = 0
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.tableData1 = [];
                        this.config1.total = 0
                    }
                });
            },
            // 分期参数设置
            getListTable9() {
            	let obj = {
                    instanCode: this.tempDetail.creditNodeNo,
                    operationMode: this.tempDetail.operationMode,
                    artifactNo: "26",
                }
                this.table9Loading = true
                this.table9FormObj = Object.assign(this.table9FormObj, obj)
                this.getTableList('/beta/betaService/COS.IQ.02.0015', this.table9FormObj, (res) => {
                    if (res.returnCode == '000000') {
                        this.table9Loading = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.table9List = res.returnData.rows
                            this.table9Total = res.returnData.totalCount
                        } else {
                            this.table9List = []
                            this.table9Total = 0
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.table9Loading = false
                        this.table9List = []
                        this.table9Total = 0
                    }
                })
            },
            // 查看参数
            hadleViewParam(row) {
                this.viewPcdTitle = '查看' + row.pcdNo + ': ' + row.pcdDesc + '参数信息'
                this.viewPcd_dialog = true
                this.viewPcdFormObj = row
            },
            /*---交易识别----*/
            //交易识别显示弹框
            handleTrade(row) {
                this.tempTrade = Object.assign({}, row)
                this.dialogFormVisibleTrade = true
                this.getTradeList()
            },
            getTradeList() {
                let obj = {
                    operationMode: this.tempTrade.operationMode,
                    authFlag: "0",
                    creditNodeNo: this.tempTrade.creditNodeNo,
                    pageSize: 10,
                    indexNo: 0,
                    creditTreeId: this.tempTrade.creditTreeId
                }
                this.tradelistLoading1 = true
                this.getTableList('/beta/betaService/LMS.PM.01.0016', obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.tradelistLoading1 = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.tempTradeList = res.returnData.rows
                            this.tempTradeList.forEach(item => { 
                                item.businessProgramNodesc = item.businessProgramNo + ' ' + item.programDesc
                                item.transIdentifiNoDesc = item.transIdentifiNo + '' + item.transIdentifiDesc
                            })

                        } else {
                            this.tempTradeList = []

                        }
                    }
                }, (err) => {
                    if (err) {
                        this.tradelistLoading1 = false
                        this.tempTradeList = []
                    }
                })
            },
            //交易识别确认关闭
            subAllTrade() {
                this.dialogFormVisibleTrade = false
            },
            //删除交易识别信息
            delTrade(items) {
            	items.authFlag = '1'
            	delete items.creditNodeNo 
            	this.$confirm('是否确定删除此关联节点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // 是
                    this.post('/beta/betaService/LMS.PM.01.0017', items, (res) => {
                        if (res.returnCode == '000000') {
                            this.$notify({
                                title: 'Success',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.getTradeList()
                        }
                    })
                }).catch(() => { // 否   

                });
            },
            //交易识别的新增
            addTradeInfo(val) {
                this.tempAssNode = Object.assign({}, val)
                this.dialogFormVisibleAddAssNode = true
                this.getBusinessProgramNoOptions(val)
                this.$nextTick(() => {
                    this.$refs['dataFormAssNode'].clearValidate()
                })
            },
            //业务项目下拉
            getBusinessProgramNoOptions(row) {
                let objData = {
                    operationMode: row.operationMode,
                }
                this.getSelectDict("/beta/betaService/COS.IQ.02.0018", objData).then(res => {
                    res.forEach(item => {
                        item.businessProgramNoDesc = item.businessProgramNo + ' ' + item.programDesc
                    });

                    this.businessProgramNoOptions = res
				})
            },
            //获取业务项目下拉值
            businessProgramNoChange(val) {
            	this.add_businessProgramNo = val
               	this.getTransIdentifiNoOptions()
            },
            //交易识别下拉
            getTransIdentifiNoOptions() {
                let objItem = {
                    authFlag: "0",
                    businessProgramNo: this.add_businessProgramNo,
                    operationMode: this.tempAssNode.operationMode,
                }
                this.post("/beta/betaService/LMS.PM.01.0017", objItem,(res)=> {
                	if (res.returnCode == '000000') {
                		let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.transIdentifiDescNew = item.transIdentifiNo + '' +item.transIdentifiDesc
                            arr[index] = {
                                label: item.transIdentifiDescNew,
                                value: item.transIdentifiNo
                            }
                        })
                        this.transIdentifiNoOptions = arr
                    } else {
                        this.transIdentifiNoOptions = []
                    }
                    
                })
            },
            //新增关联节点保存数据
            subAssNode() {
            	this.tempAssNode.authFlag = '1'
                this.post('/beta/betaService/LMS.PM.01.0017', this.tempAssNode, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleAddAssNode = false
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getTradeList()
                    }
                })
            },
            //交易识别的修改
            upTrade(val) {
                this.tempUpAssNode = Object.assign({}, val)
                this.dialogFormVisibleUpAssNode = true
                this.up_getBusinessProgramNoOptions()
                this.$nextTick(() => {
                    this.$refs['dataFormUpAssNode'].clearValidate()
                })
            },
            //业务项目下拉
            up_getBusinessProgramNoOptions() {
                let objData = {
                    operationMode: this.tempUpAssNode.operationMode,
                }
                this.getSelectDict("/beta/betaService/COS.IQ.02.0018", objData).then(res => {
                    res.forEach(item => {
                        item.businessProgramNoDesc = item.businessProgramNo + ' ' + item.programDesc
                    });
                    this.businessProgramNoOptions = res

                })
            },
            //获取业务项目下拉值
            up_businessProgramNoChange(val) {
                this.add_businessProgramNo = val
                this.up_getTransIdentifiNoOptions()
                this.$forceUpdate()
            },
            //交易识别下拉
            up_getTransIdentifiNoOptions() {
                let objItem = {
                    authFlag: "0",
                    businessProgramNo: this.add_businessProgramNo,
                    operationMode: this.tempUpAssNode.operationMode,
                }
                this.getSelectDict("/beta/betaService/LMS.PM.01.0017", objItem).then(res => {
                    this.transIdentifiNoOptions = res
                })
            },
            //交易识别里的修改关联节点保存数据
            subUpAssNode() {
                this.tempUpAssNode.authFlag = "1"
                this.post('/beta/betaService/LMS.PM.01.0017', this.tempUpAssNode, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleAddAssNode = false
                        this.$notify({
                            title: 'Success',
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getTradeList()
                        this.dialogFormVisibleUpAssNode = false
                    }
                })
            },
           	/*----修改----*/
            //修改显示的弹框
            handleUpdate(row) {
                this.tempUp = Object.assign({}, row)
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
                //this.getEventList(row)
                this.getSetOptionList(row)
                this.up_getContrlSceneCode()
            },
            updateData() {
                this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.tempUp.artifactInstanList = this.up_stageInList
                        this.post('/beta/betaService/LMS.PM.01.0003', this.tempUp, (res) => {
                            if (res.returnCode == '000000') {
                                this.dialogFormVisibleUp = false
                                this.$notify({
                                    title: 'Success',
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.getListTable()
                            }
                        })
                    }
                })
            },
            //场景管控代码
            up_getContrlSceneCode() {
                let obj = {
                    differentType: "0",
                    independentFlag: "1",
                    operationMode: this.tempUp.operationMode,
                }
                this.getSelectDict("/beta/betaService/AUS.PM.02.0102", obj).then(res => {
                    res.forEach(item => {
                        item.contrlSceneCodeDesc = item.contrlSceneCode + ' ' + item.contrlSceneDesc
                    });
                    this.contrlSceneCodeOptions = res
                })
            },
            // 分期参数设置
            getSetOptionList(row) {
                let obj = {
                    instanCode: row.creditNodeNo,
                    operationMode: row.operationMode,
                    artifactNo: '26',
                }
                this.getTableList("/beta/betaService/COS.IQ.02.0015", obj, res => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.rows != null) {
                            this.up_stageInList = res.returnData.rows
                            // this.add_stageInList =  res.returnData.rows
                        } else {
                            this.up_stageInList = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.up_stageInList = []
                    }
                })
            },
            // 替换参数
            replaceParamClick(e) {
                this.replcaeParam_dialog = true;
                this.replaceParamObj = e[0];
                this.replaceIndex = e[1];
                this.defalutChoseVal = e[0].elementNo;
            },
            // 设置参数
            setParamClick(e) {
                this.replaceIndex = e[1];
                this.setParam_dialog = true;
                this.setPcdObj = e[0];
                this.setPcdTitle = "查看" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息";
            },
            //  确定替换参数
            sureReplaceData() {
                // 媒介对象实例化
                this.$set(
                    this.up_stageInList[this.replaceIndex],
                    "elementNo",
                    this.choosedVal.split("_")[0]
                );
                this.$set(
                    this.up_stageInList[this.replaceIndex],
                    "elementDesc",
                    this.choosedVal.split("_")[1]
                );
                this.replcaeParam_dialog = false;
            },
            //  确定设置参数
            sureSetData() {
                // 媒介对象实例化
                this.$set(this.up_stageInList[this.replaceIndex], "pcdInitList", this.pcdList);
                this.$set(this.up_stageInList, this.replaceIndex, this.setPcdObj);
                this.setParam_dialog = false;
            },
            childBySetVal(val) {
                this.pcdList = val;
            },
            childByDeletPcd(val) {
                this.delePcdList = val;
            },
            childByElementVal(val) {
                this.choosedVal = val;
            },
            /*----显示额度关系弹框----*/
            handQuotaInfo(row) {
                this.tempQuota = Object.assign({}, row)
                this.getCreditTreeVersion()
                this.dialogFormVisibleQuota = true
			},
			//查询额度节点关系列表
            handleSearchQuota(){
        	 	this.$refs['dataFormQuota'].validate((valid) => {
                if (valid) {
	            		this.showQuotaTable = true
		            	this.getCreditList()
	            	}
	           	})
            },
            //关闭弹框清空
            handleCloseQuota(){
            	this.dialogFormVisibleQuota = false
            	this.showQuotaTable = false
            	this.$refs['dataFormQuota'].resetFields();
            },
            //监听额度网编号
			creditTreeIdChange(row){
				this.tempQuota.creditTreeId =row
				this.getCreditTreeVersion()
			},
			//下拉获取额度网版本号
			getCreditTreeVersion(){
				let params  = {
					authDataSynFlag:  '1',
					adminFlagUser: '1',
					operationMode:  this.tempQuota.operationMode,
					creditTreeId: this.tempQuota.creditTreeId
				}
				this.post('/beta/betaService/LMS.PM.01.0025', params , (res) => {
			 	   if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							let arr = []
							let rows =res.returnData.rows
							let creditTreeVersionDescNew = {}
							rows.forEach((item, index) => {
								item.creditTreeVersionNew =item.creditTreeVersionList
								this.creditTreeVersionListPublice=item.creditTreeVersionList
								item.creditTreeVersionNew.forEach((item, index) => {
									arr[index] = {
		                                label: item.creditTreeVersion,
		                                value: item.creditTreeVersion
		                            }
								})
							})
							this.creditTreeVersionOptions = arr
						}else{
							  this.creditTreeVersionOptions = []
						}
                   }
				})
			},
			creditTreeVersionChange(row){
				this.creditTreeVersionListPublice.forEach(item => {
					if(row==item.creditTreeVersion){
						this.addCreditTreeActiveStatus=item.creditTreeActiveStatus
					}
				})
			},
            //用信网&&授信网
            getCreditList() {
                this.creditLoading = true
                this.useLetterLoading = true
                let obj = {
                    operationMode: this.tempQuota.operationMode,
                    creditTreeId: this.tempQuota.creditTreeId,
                    creditNodeNo: this.tempQuota.creditNodeNo,
                    creditNodeTyp: this.tempQuota.creditNodeTyp,
                    creditTreeId: this.tempQuota.creditTreeId,
                    creditTreeVersion: this.tempQuota.creditTreeVersion,
                    meshEffectiveTyp: "Y",
                    authFlag: "0",
                    methodType: "selectFlag",
                    isTrans: true,//是否需要翻译数据字典
                    transParams: ['dic_creditRatio','dic_creditRelativeNodeTyp', 'dic_creditRelativeTyp','dic_creditTypeOptions'],//查找数据字典所需参数
                    transDict: ['relativeNodeTyp','relativeNodeTyp', 'relativeTyp','creditType'],//翻译前后key
                }				 
                this.getTableList("/beta/betaService/LMS.PM.01.0007", obj, res => {
                    if (res.returnCode == "000000") {
                        this.creditLoading = false
                        this.useLetterLoading = false
                        if (res.returnData && res.returnData.rows != null) {
                            let creditData = []
                            creditData = res.returnData.rows
                            this.creditList = []
                            this.useLetterList = []
                            this.useLetterListNew = []
                            creditData.forEach(item => {
                                if (item.actionTyp == 'L') {//--授信
                                	this.creditList.push(item)
                                	this.creditList.forEach(item => {
                                        item.creditNodeNoDesc = item.creditNodeNo + '' + item.creditNodeDesc
                                        item.relativeNodeNoDesc = item.relativeNodeNo + '' + item.relativeNodeDesc
                                    })
								}
                                if (item.actionTyp == 'U') {//--用信
                                	if(item.creditNodeRelativeType == "relative"){
										this.useLetterListNew.push(item);
									}else{
										this.useLetterList.push(item)
									}
	                               	this.useLetterList.forEach(item => {
                                        item.creditNodeNoDesc = item.creditNodeNo + '' + item.creditNodeDesc
                                        item.relativeNodeNoDesc = item.relativeNodeNo + '' + item.relativeNodeDesc
                                    })
	                               	this.useLetterListNew.forEach(item => {
                                        item.creditNodeNoDesc = item.creditNodeNo + '' + item.creditNodeDesc
                                        item.relativeNodeNoDesc = item.relativeNodeNo + '' + item.relativeNodeDesc
                                    })
	                            }
                            });
                        } else {
                            this.creditLoading = true
                			this.useLetterLoading = true
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.creditLoading = true
                		this.useLetterLoading = true
                    }
                })
            },
            //额度网关系授信修改显示的弹框
            handleUpCredit(row) {
                this.upQuotaInfo = Object.assign({}, row)
				this.upQuotaInfo.actionTyp = "L"
                this.upQuotaInfo.creditDesc = row.creditNodeDesc
				this.dialogFormVisibleUpQuota = true
                this.up_getCreditTreeVersion()
                this.getRelativeNodeNoChange()
                this.$nextTick(() => {
                    this.$refs['dataFormUpQuota'].clearValidate()
                })
            },
            //额度网关系用信显示修改弹框
            handleUpUseLetter(row){
                this.upQuotaInfo = Object.assign({}, row)
            	this.upQuotaInfo.actionTyp = "U"
            	this.upQuotaInfo.creditDesc = row.creditNodeDesc
                this.upQuotaInfo.relativeNodeNoVals = row.creditRestoreSeq
                this.upQuotaInfo.creditRestoreSeq = this.tempQuota.creditRestoreSeq
                this.dialogFormVisibleUpQuota = true
                this.up_getCreditTreeVersion()
                this.getRelativeNodeNoChange()
                this.$nextTick(() => {
                    this.$refs['dataFormUpQuota'].clearValidate()
                })
            },
            //监听额度网编号
			up_creditTreeIdChange(row){
				this.upQuotaInfo.creditTreeId =row
				this.up_getCreditTreeVersion()
			},
			//下拉获取额度网版本号
			up_getCreditTreeVersion(){
				let params  = {
					authDataSynFlag:  '1',
					adminFlagUser: '1',
					operationMode:  this.upQuotaInfo.operationMode,
					creditTreeId: this.upQuotaInfo.creditTreeId
				}
				this.post('/beta/betaService/LMS.PM.01.0025', params , (res) => {
			 	   if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							let arr = []
							let rows =res.returnData.rows
							let creditTreeVersionDescNew = {}
							rows.forEach((item, index) => {
								item.creditTreeVersionNew =item.creditTreeVersionList
								item.creditTreeVersionNew.forEach((item, index) => {
									arr[index] = {
		                                label: item.creditTreeVersion,
		                                value: item.creditTreeVersion
		                            }
								})
							})
							this.creditTreeVersionOptions = arr
						}else{
							  this.creditTreeVersionOptions = []
						}
                   }
				})
			},
            //监听关联类型
            relativeNodeTypChange(val) {
                this.relativeNodeNoOptions = []
                this.upQuotaInfo.relativeNodeTyp = val
                this.getRelativeNodeNoChange()
               if(val=='S'){
                	this.getShareRelativeCodeOptions(this.upQuotaInfo.operationMode)
                }
                //this.getShareRelativeCodeOptions(this.upQuotaInfo.operationMode)
            },
            //关联节点
            getRelativeNodeNoChange() {
                let obj1 = {
                    operationMode: this.upQuotaInfo.operationMode,
                    creditTreeId: this.upQuotaInfo.creditTreeId,
                    relativeNodeType: this.upQuotaInfo.relativeNodeTyp,
                    authDataSynFlag: "1",
                    creditNodeNo: this.upQuotaInfo.creditNodeNo,
                }
                this.post("/beta/betaService/LMS.PM.01.0002", obj1, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                           /* let rows = res.returnData.rows*/
                            this.upRelativeNodeNoData = res.returnData.rows
                            this.upRelativeNodeNoData.forEach((item, index) => {
                                arr[index] = {
                                    label: item.creditDesc + '' + item.creditNodeNo,
                                    value: item.creditNodeNo
                                }
                            })
                            this.relativeNodeNoOptions = arr
                        } else {
                            this.relativeNodeNoOptions = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.relativeNodeNoOptions = []
                    }
                })
            },
            //监听关联额度节点
            up_relativeNodeNoChange(vals){
            	let rows = ''
            	rows=this.upRelativeNodeNoData
            	rows.forEach(item =>{
            		if((item.creditNodeNo==vals) && item.creditRestoreSeq !=''){
            			this.upQuotaInfo.relativeNodeNoVals=item.creditRestoreSeq
        				this.edit = true
        			}else if(item.creditRestoreSeq==''){
            			this.edit = false
            		}
            	})
            },
           	//确认提交数据
            subUpQuota() {
                delete this.upQuotaInfo.creditNodeNoDesc
                delete this.upQuotaInfo.relativeNodeNoDesc
                this.upQuotaInfo.methodType = "updateFlag"
                this.$refs['dataFormUpQuota'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/LMS.PM.01.0008', this.upQuotaInfo, (res) => {
                            if (res.returnCode == '000000') {
                                 this.dialogFormVisibleUpQuota = false
                                this.$notify({
                                    title: 'Success',
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.getCreditList()
                            }
                        })
                    }
                })
            },
            //额度网关系授信网删除
            handleDelCredit(row) {
                row.methodType = "deleteFlag"
                this.$confirm('是否确定删除此关联节点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // 是
                    this.post('/beta/betaService/LMS.PM.01.0009', row, (res) => {
                        if (res.returnCode == '000000') {
                             this.$notify({
                                title: 'Success',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.getCreditList()
                        }
                    })
                }).catch(() => { // 否   

                });
            },
            //额度网关系用信网删除
            handleDelUseLetter(row) {
                row.methodType = "deleteFlag"
                this.$confirm('是否确定删除此关联节点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // 是
                    this.post('/beta/betaService/LMS.PM.01.0009', row, (res) => {
                        if (res.returnCode == '000000') {
                             this.$notify({
                                title: 'Success',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.getCreditList()
                        }
                    })
                }).catch(() => { // 否   

                });
            },
            //授信新增显示弹框
            handleAddCredit(row) {
                this.addQuotaInfo = Object.assign({}, row)
                this.addQuotaInfo.actionTyp = "L"
				this.dialogFormVisibleAddQuota = true
                this.$nextTick(() => {
                    this.$refs['dataFormAddQuota'].clearValidate()
                })
            },
            //用信新增显示弹框
            handleAddUseLetter(row) {
                this.addQuotaInfo = Object.assign({}, row)
                this.addQuotaInfo.actionTyp = "U"
                this.dialogFormVisibleAddQuota = true
                this.add_getCreditTreeVersion()
                this.$nextTick(() => {
                    this.$refs['dataFormAddQuota'].clearValidate()
                })
            },
            //监听额度网编号
			add_creditTreeIdChange(row){
				this.addQuotaInfo.creditTreeId = row
				this.add_getCreditTreeVersion()
			},
			//下拉获取额度网版本号
			add_getCreditTreeVersion(){
				let params  = {
					authDataSynFlag:  '1',
					adminFlagUser: '1',
					operationMode:  this.addQuotaInfo.operationMode,
					creditTreeId: this.addQuotaInfo.creditTreeId
				}
				this.post('/beta/betaService/LMS.PM.01.0025', params , (res) => {
			 	   if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							let arr = []
							let rows =res.returnData.rows
							let creditTreeVersionDescNew = {}
							rows.forEach((item, index) => {
								item.creditTreeVersionNew =item.creditTreeVersionList
								item.creditTreeVersionNew.forEach((item, index) => {
									arr[index] = {
		                                label: item.creditTreeVersion,
		                                value: item.creditTreeVersion
		                            }
								})
							})
							this.creditTreeVersionOptions = arr
						}else{
							  this.creditTreeVersionOptions = []
						}
                   }
				})
			},
           	//监听关联类型
            addRelativeNodeTypChange(val) {
            	this.relativeNodeNoOptions = []
                this.relativeNodeTypValAdd = val
                if(val=='S'){
                	this.getShareRelativeCodeOptions(this.addQuotaInfo.operationMode)
                }
				this.add_getRelativeNodeNoChange()
            },
            //关联节点
            add_getRelativeNodeNoChange() {
                let obj1 = {
                    operationMode: this.addQuotaInfo.operationMode,
                    creditTreeId: this.addQuotaInfo.creditTreeId,
                    relativeNodeType: this.relativeNodeTypValAdd,
                    authDataSynFlag: "1",
                    creditNodeNo: this.addQuotaInfo.creditNodeNo,
                }
                this.post("/beta/betaService/LMS.PM.01.0002", obj1, res => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            this.relativeNodeNoData = res.returnData.rows
                            
                            this.relativeNodeNoData.forEach((item, index) => {
                                arr[index] = {
                                    label: item.creditDesc + '' + item.creditNodeNo,
                                    value: item.creditNodeNo
                                }
                            })
                            this.relativeNodeNoOptions = arr
                        } else {
                            this.relativeNodeNoOptions = []
                        }
                    }
				}, (err) => {
                    if (err) {
                        this.relativeNodeNoOptions = []
                    }
                })
            },
            //监听关联额度节点
            relativeNodeNoChange(vals){
            	let rows = ''
            	rows=this.relativeNodeNoData
            	rows.forEach(item =>{
            		if((item.creditNodeNo==vals) && item.creditRestoreSeq !=''){
            			this.addQuotaInfo.relativeNodeNoVals=item.creditRestoreSeq
        				this.edit = true
        			}else if(item.creditRestoreSeq==''){
            			this.edit = false
            		}
            	})
            },
            //确认提交数据
            subAddQuota() {
                this.addQuotaInfo.methodType = "insertFlag"
               	this.addQuotaInfo.creditRelativeNodeSeq=this.addQuotaInfo.relativeNodeNoVals
               	delete this.addQuotaInfo.relativeNodeNoVals
                this.$refs['dataFormAddQuota'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/LMS.PM.01.0006', this.addQuotaInfo, (res) => {
                            if (res.returnCode == '000000') {
                                this.dialogFormVisibleAddQuota = false
                                this.$notify({
                                    title: 'Success',
                                    message: '建立成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.addQuotaInfo = {}
                                this.getCreditList()
                            }
                        })
                    }
                })
            },
            //额度网关系授信详情显示弹框
            handleDetailCredit(row) {
                this.detailQuotaInfo = Object.assign({}, row)
                this.detailQuotaInfo.actionTyp = "L"
                this.detailQuotaInfo.creditDesc = row.creditNodeDesc
                this.dialogFormVisibleDetailQuota = true
            },
            //额度用信网关联关系详情显示弹框
            handleDelUseLetterNew(row){
            	this.detailQuotaInfo = Object.assign({}, row)
            	this.detailQuotaInfo.actionTyp = "U"
                this.detailQuotaInfo.creditDesc = row.creditNodeDesc
                this.detailQuotaInfo.relativeNodeNoVals = row.creditRestoreSeq//额度使用顺序
                this.detailQuotaInfo.creditRestoreSeq = this.tempQuota.creditRestoreSeq//额度节点使用顺序
                this.dialogFormVisibleDetailQuota = true
                this.getShareRelativeCodeOptions(this.detailQuotaInfo.operationMode)
            },
            //额度网用信被关联关系详情显示弹框
            handleDetailUseLetter(row){
            	this.detailQuotaInfo = Object.assign({}, row)
            	this.detailQuotaInfo.actionTyp = "U"
                this.detailQuotaInfo.creditDesc = row.creditNodeDesc
                this.detailQuotaInfo.relativeNodeNoVals = row.creditRestoreSeq//额度使用顺序
                this.detailQuotaInfo.creditRestoreSeq = this.tempQuota.creditRestoreSeq//额度节点使用顺序
                this.dialogFormVisibleDetailQuota = true
                this.getShareRelativeCodeOptions(this.detailQuotaInfo.operationMode)
            },
            //新增、修改、详情公用共享交易场景
            getShareRelativeCodeOptions(operationModeNew) {
                let obj2 = {
                    applicationRange: "A",
                    operationMode: operationModeNew,
                    pageSize: 10,
                    indexNo: 0
                }
                this.post("/beta/betaService/AUS.PM.01.0202", obj2, (res) => {
                	if (res.returnCode == '000000') {
                    	
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                arr[index] = {
                                    label: item.transSceneCode + '' + item.transSceneDesc,
                                    value: item.transSceneCode
                                }
                            })
                            this.transSceneCodeOptions = arr
                        } else {
                            this.transSceneCodeOptions = []
                        }
                    	
                   	}
				})
            },
        }
    }
</script>

<style>
</style>