<!-- 授权场景 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryForm.operationMode" class="wd200" clearable >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                <el-select v-model="queryForm.authSceneCode" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in authSceneCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.authSceneCode"
                    />
                </el-select>
            </el-form-item>
             <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAdd()" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showInfo">
            <el-table  v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
                <el-table-column prop="organNo" label="序号" width="100" align="center"
                    type="index">
                </el-table-column>
                <el-table-column  align="center" label="授权场景代码" prop="authSceneCode" />
                <el-table-column  align="center" label="描述" prop="sceneDesc" />
                <el-table-column  align="center" label="交易识别代码" prop="transIdentifiNo" />
                <el-table-column width="420" align="center" label="操作" class-name="small-padding">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete"   type="primary" @click="delSceneInfo(row)" v-show="updBtnFlag">删除</el-button>
                        <el-button type="primary" size="mini"  icon="el-icon-arrow-right" @click="scenarioInfo(row)" v-show="infBtnFlag">场景识别</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tabTotal>0" :total="tabTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList"/>
        </div>
        <!-- 新增 -->
        <el-dialog title="授权场景建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <div v-if='part1'>
                    <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                       <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                           :rules="[ { required: true, message: '运营模式不能为空'}]">
                            <el-select v-model="tempAdd.operationMode" class="wd200">
                            <el-option
                                v-for="(item, index ) in operationModeOptions"
                                :key="index"
                                :label="item.modeName"
                                :value="item.operationMode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode"
                            :rules="[ { required: true, message: '授权场景代码不能为空'}]">
                            <el-input v-model="tempAdd.authSceneCode" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="描述" prop="sceneDesc"
                            :rules="[ { required: true, message: '描述不能为空'}]">
                            <el-input v-model="tempAdd.sceneDesc" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="触发事件编号" prop="triggerNo"
                             :rules="[ { required: true, message: '触发事件编号不能为空',trigger: 'blur' },
                             { min: 14, max: 14, message: '输入长度不能小于14个字符', trigger: 'blur' }]">
                            <el-input v-model="tempAdd.triggerNo" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="交易来源" prop="transOrigin" 
                            :rules="[ { required: true, message: '交易来源不能为空'}]">
                            <el-select v-model="tempAdd.transOrigin" class="wd200" >
                            <el-option
                                v-for="(item, index ) in transSourceOptions"
                                :key="index"
                                :label="item.originDesc"
                                :value="item.transOrigin"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo" 
                            :rules="[ { required: true, message: '交易识别代码不能为空'}]">
                            <el-select v-model="tempAdd.transIdentifiNo" class="wd200" >
                            <el-option
                                v-for="(item, index ) in transIdentifiNoOptions"
                                :key="index"
                                :label="item.transIdentifiDesc"
                                :value="item.transIdentifiNo"/>
                            </el-select>
                        </el-form-item>
                         <el-form-item class="cl_td" label="入账模式" prop="transPostingFlag" 
                            :rules="[ { required: true, message: '入账模式不能为空'}]">
                            <el-select v-model="tempAdd.transPostingFlag" class="wd200" >
                            <el-option
                                v-for="(item, index ) in transPostingFlagOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays" 
                            v-if='tempAdd.authType=="NM" || tempAdd.authType=="PA"'
                            :rules="[ { required: true, message: '交易保留天数不能为空'}]" >
                            <el-input v-model="tempAdd.transRetainDays" class="wd200" type="text"/>
                        </el-form-item>
                        <el-form-item class="cl_td" label="授权类型" prop="authType" 
                            :rules="[ { required: true, message: '授权类型不能为空'}]">
                            <el-select v-model="tempAdd.authType" class="wd200" >
                            <el-option
                                v-for="(item, index ) in authTypeOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="入账保留" prop="postingRetainFlag" 
                            :rules="[ { required: true, message: '入账保留不能为空'}]">
                            <el-select v-model="tempAdd.postingRetainFlag" class="wd200" >
                            <el-option
                                v-for="(item, index ) in postingRetainFlagOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="额度占用方式" prop="creditOccupyMode" 
                            :rules="[ { required: true, message: '额度占用方式不能为空'}]">
                            <el-select v-model="tempAdd.creditOccupyMode" class="wd200" >
                            <el-option
                                v-for="(item, index ) in creditOccupyModeOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="允许强制授权" prop="forceAuthFlag" 
                            :rules="[ { required: true, message: '允许强制授权不能为空'}]">
                            <el-select v-model="tempAdd.forceAuthFlag" class="wd200" >
                            <el-option
                                v-for="(item, index ) in forceAuthFlagOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="允许冲正授权" prop="rvTransFlag" 
                            :rules="[ { required: true, message: '允许冲正授权不能为空'}]">
                            <el-select v-model="tempAdd.rvTransFlag" class="wd200" >
                            <el-option
                                v-for="(item, index ) in rvTransFlagOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="生成授权码" prop="authCodeFlag" 
                            :rules="[ { required: true, message: '生成授权码不能为空'}]">
                            <el-select v-model="tempAdd.authCodeFlag">
                            <el-option
                                v-for="(item, index ) in authCodeFlagOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                         <el-form-item class="cl_td" label="优先级" prop="priority"
                            :rules="[ { required: true, message: '优先级不能为空'}]">
                            <el-input v-model="tempAdd.priority" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="场景类型" prop="sceneType" 
                            :rules="[ { required: true, message: '场景类型不能为空'}]">
                            <el-select v-model="tempAdd.sceneType" allow-create class="wd200" >
                            <el-option
                                v-for="(item, index ) in sceneTypeOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"/>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div  class="dialog-footer cl_tr text_center">
                        <el-button type="primary" @click="nextToPart2Btn()">下一步</el-button>
                    </div>
                </div>
                <div v-show="part2">
                    <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                        <el-input v-model="authSceneCode" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="描述" prop="stageTypeDesc">
                        <el-input v-model="sceneDesc" class="wd200" type="text" />
                    </el-form-item>
                    <!-- 分期参数设置add -->
                    <set-param-option
                      
                        :list="up_scenarioInList"
                        @replaceParamClick="replaceParamClick(arguments)"
                        @setParamClick="setParamClick(arguments)">
                    </set-param-option>
                    <div class="cl_tr text_center mtop20" >
                        <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPart1Btn()"> 上一步</el-button>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog>
        <!-- 详情 查看pcd参数 弹窗-->
        <el-dialog :title="viewPcdTitle" :visible.sync="viewPcd_dialog" width="65%">
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewPcd_dialog = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempDetail.operationMode"  class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                    <el-input v-model="tempDetail.authSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td red" label="场景描述" prop="sceneDesc">
                     <el-select v-model="tempDetail.sceneDesc" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in transIdentificationCodeOptions"
                        :key="index"
                        :label="item.transIdentifiDesc"
                        :value="item.transIdentifiNo"
                        />
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">基本信息</div>
                <el-form-item class="cl_td" label="触发事件编号" prop="triggerNo">
                    <el-input v-model="tempDetail.triggerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易来源" prop="transOrigin" >
                    <el-select v-model="tempDetail.transOrigin" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in transSourceOptions"
                        :key="index"
                        :label="item.originDesc"
                        :value="item.transOrigin"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo" >
                    <el-select v-model="tempDetail.transIdentifiNo" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in transIdentifiNoOptions"
                        :key="index"
                        :label="item.transIdentifiDesc"
                        :value="item.transIdentifiNo"/>
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="入账模式" prop="transPostingFlag">
                    <el-select v-model="tempDetail.transPostingFlag" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in transPostingFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays" 
                    v-if='tempDetail.authType=="NM" || tempDetail.authType=="PA"'>
                    <el-input v-model="tempDetail.transRetainDays" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权类型" prop="authType" >
                    <el-select v-model="tempDetail.authType" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in authTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="入账保留" prop="postingRetainFlag">
                    <el-select v-model="tempDetail.postingRetainFlag" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in postingRetainFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度占用方式" prop="creditOccupyMode">
                    <el-select v-model="tempDetail.creditOccupyMode" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in creditOccupyModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许强制授权" prop="forceAuthFlag">
                    <el-select v-model="tempDetail.forceAuthFlag" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in forceAuthFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许冲正授权" prop="rvTransFlag" >
                    <el-select v-model="tempDetail.rvTransFlag" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in rvTransFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="生成授权码" prop="authCodeFlag">
                    <el-select v-model="tempDetail.authCodeFlag" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in authCodeFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="优先级" prop="priority">
                    <el-input v-model="tempDetail.priority" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="场景类型" prop="sceneType" >
                    <el-select v-model="tempDetail.sceneType" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in sceneTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 授权场景参数选项 -->
            <some-param-option v-if="table9List"
                :textTitle="textTitle9"
                :list="table9List"
                @viewParamClick="hadleViewParam">
            </some-param-option>
            <pagination v-show="table9Total>0" :total="table9Total" :page.sync="table9FormObj.pageNum" :limit.sync="table9FormObj.pageSize" @pagination="getList9" />  
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false"> 关闭 </el-button>
            </div>
        </el-dialog>
        <!-- 替换参数 弹窗 -->
        <el-dialog title="选择参数选项" :visible.sync="replcaeParam_dialog" width="65%">
            <replace-param
                :replaceObj="replaceParamObj"
                :replaceIndex="replaceIndex"
                :defalutVal="defalutChoseVal"
                @childByElementVal="childByElementVal">
            </replace-param>
            <div slot="footer" class="dialog-footer">
                <el-button @click="replcaeParam_dialog = false">关闭</el-button>
                <el-button type="primary" @click="sureReplaceData()">确定 </el-button>
            </div>
        </el-dialog>
        <!-- 设置参数 弹窗 -->
        <el-dialog :title="setPcdTitle" :visible.sync="setParam_dialog" width="65%">
        <set-pcd
            :setPcdObj="setPcdObj"
            :setIndex="replaceIndex"
            @childBySetVal="childBySetVal"
            @childByDeletPcd="childByDeletPcd">
        </set-pcd>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setParam_dialog = false">关闭</el-button>
            <el-button type="primary" @click="sureSetData()">确定</el-button>
        </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]" clearable disabled>
                    <el-select v-model="tempUp.operationMode" class="wd200">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode"
                    :rules="[ { required: true, message: '授权场景代码不能为空'}]">
                    <el-input v-model="tempUp.authSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="场景描述" prop="sceneDesc"
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempUp.sceneDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
               <div class="mainname titleInfo ng-binding">基本信息</div>
               
                <el-form-item class="cl_td" label="触发事件编号" prop="triggerNo"
                     :rules="[ { required: true, message: '触发事件编号不能为空',trigger: 'blur' },
                     { min: 14, max:14, message: '输入长度不能小于14个字符', trigger: 'blur' }]">
                    <el-input v-model="tempUp.triggerNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="交易来源" prop="transOrigin" 
                    :rules="[ { required: true, message: '交易来源不能为空'}]">
                    <el-select v-model="tempUp.transOrigin" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transSourceOptions"
                        :key="index"
                        :label="item.originDesc"
                        :value="item.transOrigin"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo" 
                    :rules="[ { required: true, message: '交易识别代码不能为空'}]">
                    <el-select v-model="tempUp.transIdentifiNo" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transIdentifiNoOptions"
                        :key="index"
                        :label="item.transIdentifiDesc"
                        :value="item.transIdentifiNo"/>
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="入账模式" prop="transPostingFlag" 
                    :rules="[ { required: true, message: '入账模式不能为空'}]">
                    <el-select v-model="tempUp.transPostingFlag" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transPostingFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays" 
                    v-if='tempAdd.authType=="NM" || tempAdd.authType=="PA"'
                    :rules="[ { required: true, message: '交易保留天数不能为空'}]" >
                    <el-input v-model="tempUp.transRetainDays" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权类型" prop="authType" 
                    :rules="[ { required: true, message: '授权类型不能为空'}]">
                    <el-select v-model="tempUp.authType" class="wd200" >
                    <el-option
                        v-for="(item, index ) in authTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="入账保留" prop="postingRetainFlag" 
                    :rules="[ { required: true, message: '入账保留不能为空'}]">
                    <el-select v-model="tempUp.postingRetainFlag" class="wd200" >
                    <el-option
                        v-for="(item, index ) in postingRetainFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度占用方式" prop="creditOccupyMode" 
                    :rules="[ { required: true, message: '额度占用方式不能为空'}]">
                    <el-select v-model="tempUp.creditOccupyMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in creditOccupyModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许强制授权" prop="forceAuthFlag" 
                    :rules="[ { required: true, message: '允许强制授权不能为空'}]">
                    <el-select v-model="tempUp.forceAuthFlag" class="wd200" >
                    <el-option
                        v-for="(item, index ) in forceAuthFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="允许冲正授权" prop="rvTransFlag" 
                    :rules="[ { required: true, message: '允许冲正授权不能为空'}]">
                    <el-select v-model="tempUp.rvTransFlag" class="wd200" >
                    <el-option
                        v-for="(item, index ) in rvTransFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="生成授权码" prop="authCodeFlag" 
                    :rules="[ { required: true, message: '生成授权码不能为空'}]">
                    <el-select v-model="tempUp.authCodeFlag" class="wd200" >
                    <el-option
                        v-for="(item, index ) in authCodeFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="优先级" prop="priority"
                    :rules="[ { required: true, message: '优先级不能为空'}]">
                    <el-input v-model="tempUp.priority" class="wd200" type="text" />
                </el-form-item>
                
                <el-form-item class="cl_td" label="场景类型" prop="sceneType" 
                    :rules="[ { required: true, message: '场景类型不能为空'}]">
                    <el-select v-model="tempUp.sceneType" class="wd200" >
                    <el-option
                        v-for="(item, index ) in sceneTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--<div class="text_title">授权场景参数设置</div>-->
            <!--<common-table
                :tableData="tableData1"
                :config="config1"
                :tableLabel="tableLabel1"
                @changePage="getEventList"
            ></common-table>-->
            <!-- 分期参数设置 -->
            <set-param-option
            :colunm3="up_colunm3"
            :textTitle="up_textTitle"
            :list="up_scenarioInList"
            @replaceParamClick="replaceParamClick(arguments)"
            @setParamClick="setParamClick(arguments)"
            ></set-param-option>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    取消
                </el-button>
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!--场景识别-->
        <el-dialog title="场景识别" :visible.sync="dialogFormVisibleScene" width="65%">
            <el-form ref="dataFormScene" :rules="rulesScene" :model="tempScene" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempScene.operationMode" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                    <el-input v-model="tempScene.authSceneCode" class="wd200" type="text"readonly />
                </el-form-item>
                <div class="clearboth"></div>
                <el-form-item class="cl_td" label="描述" prop="sceneDesc">
                    <el-input v-model="tempScene.sceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            <div class="mtop20 search_button" style="float: right;margin-bottom: 10px;">
                <div class="search_button">
                    <el-button size="small"  icon="el-icon-plus" type="primary" @click="sceneAddBtn(tempScene)"> 新增</el-button>
                    <el-button size="small" icon="el-icon-delete" type="primary" @click="deleteSeneBtn()">全部删除</el-button>
                </div>
            </div>
            <!--場景识别列表-->
            <el-table  v-loading="sceneListLoading" :data="sceneList" border fit highlight-current-row style="width: 100%;">
                <el-table-column prop="organNo" label="序号"  align="center" type="index"></el-table-column>
                <el-table-column  align="center" label="MTI" prop="messageTyp" />
                <el-table-column  align="center" label="PROCESSING CODE" prop="processCode" />
                <el-table-column  align="center" label="POS CONDTION CODE" prop="posConditionCode" />
                <el-table-column  align="center" label="卡组织" prop="cardAssociations" />
                <el-table-column  align="center" label="交易场景" prop="transSceneCodeDesc" />
                <el-table-column  align="center" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdateScene(row)" >修改</el-button>
                        <el-button type="primary" size="mini"  icon="el-icon-arrow-right" @click="deleteSceneInfo(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tabTotalScene>0" :total="tabTotalScene" :page.sync="sceneFormPage.pageNum" :limit.sync="sceneFormPage.pageSize" @pagination="getScenarOptionList"/>
        	</el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="dialogFormVisibleScene= false">关闭</el-button>
            </div>
        </el-dialog>
        <!--新增授权场景识别-->
        <el-dialog title="新增授权场景识别" :visible.sync="dialogFormVisibleSceneAdd" width="65%">
            <el-form ref="dataFormSceneAdd" :rules="rulesSceneAdd" :model="tempSceneSet" >
                <el-form-item class="cl_td" label="运营模式" prop="operationModeScen" >
                    <el-select v-model="operationModeScen" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCodeScen">
                    <el-input v-model="authSceneCodeScen" class="wd200" type="text"readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="sceneDescScen">
                    <el-input v-model="sceneDescScen" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="MTI" prop="messageTyp" 
                    :rules="[ { required: true, message: 'MTI不能为空'}]">
                    <el-input v-model="tempSceneSet.messageTyp" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="PROCESSING CODE" prop="processCode"
                    :rules="[ { required: true, message: 'PROCESSING CODE不能为空'}]">
                    <el-input v-model="tempSceneSet.processCode" class="wd200" type="text" />
                </el-form-item>
                
                <el-form-item class="cl_td" label="POS CONDTITION CODE" prop="posConditionCode" 
                    :rules="[ { required: true, message: 'POS CONDTITION CODE不能为空'}]">
                    <el-input v-model="tempSceneSet.posConditionCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织" prop="cardAssociations"
                    :rules="[ { required: true, message: '卡组织不能为空'}]">
                    <el-input v-model="tempSceneSet.cardAssociations" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易场景" prop="transSceneCodeAdd">
                    <el-select v-model="tempSceneSet.transSceneCodeAdd" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transSceneCodeAddOptions"
                        :key="index"
                        :label="item.transSceneDesc"
                        :value="item.transSceneCode"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogFormVisibleSceneAdd= false">取消</el-button>
                <el-button type="primary" @click="holdScene()"> 确定</el-button>
            </div>
        </el-dialog>
        <!--维护授权场景识别-->
        <el-dialog title="维护授权场景识别" :visible.sync="dialogFormVisibleSceneUp" width="65%">
            <el-form ref="dataFormSceneUp" :rules="rulesSceneUp" :model="tempSceneUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationModeUp" >
                    <el-select v-model="operationModeUp" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCodeUp">
                    <el-input v-model="authSceneCodeUp" class="wd200" type="text"readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="sceneDesc">
                    <el-input v-model="sceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="MTI" prop="messageTyp" 
                    :rules="[ { required: true, message: 'MTI不能为空'}]">
                    <el-input v-model="tempSceneUp.messageTyp" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="PROCESSING CODE" prop="processCode"
                    :rules="[ { required: true, message: 'PROCESSING CODE不能为空'}]">
                    <el-input v-model="tempSceneUp.processCode" class="wd200" type="text" />
                </el-form-item>
                
                <el-form-item class="cl_td" label="POS CONDTITION CODE" prop="posConditionCode" 
                    :rules="[ { required: true, message: 'POS CONDTITION CODE不能为空'}]">
                    <el-input v-model="tempSceneUp.posConditionCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织" prop="cardAssociations"
                    :rules="[ { required: true, message: '卡组织不能为空'}]">
                    <el-input v-model="tempSceneUp.cardAssociations" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易场景" prop="transSceneCode">
                    <el-select v-model="tempSceneUp.transSceneCode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in transSceneCodeAddOptions"
                        :key="index"
                        :label="item.transSceneDesc"
                        :value="item.transSceneCode"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogFormVisibleSceneUp= false">取消</el-button>
                <el-button type="primary" @click="holdSceneUp()"> 确定</el-button>
            </div>
        </el-dialog>
        <!-- 详情 查看pcd参数 弹窗-->
        <el-dialog :title="viewPcdTitle" :visible.sync="viewPcd_dialog" width="65%">
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewPcd_dialog = false"> 关闭</el-button>
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
        selBtnFlag: false,
        addBtnFlag: false,
        updBtnFlag: false,
        infBtnFlag: false,
        btnAuthStr: '',
        /*----列表----*/
        queryForm: {
            pageNum: 1,
            pageSize: 10
        },
        queryFormRules: {}, 
        showInfo: false,
        list:[],
        listLoading: false,
        tabTotal: 0,
        tableData: [],
        config: {
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        // 下拉框
        operationModeOptions: [],//运营模式
        authSceneCodeOptions: [],//授权场景代码
        transSourceOptions: [],//交易来源
        transIdentifiNoOptions: [],//交易识别代码
        transPostingFlagOptions: [],//入账模式
        authTypeOptions: [],//授权类型
        postingRetainFlagOptions: [],//入账保留
        creditOccupyModeOptions: [],//额度占用方式
        forceAuthFlagOptions:[],//允许强制授权
        rvTransFlagOptions:[],//允许冲正授权
        authCodeFlagOptions:[],//生成授权码
        sceneTypeOptions: [],//场景类型
        transIdentificationCodeOptions: [],
        stageTypeOptions: [],
        transSceneCodeAddOptions: [],//交易场景
        stageTypeCodeOptions: [{
            codes: 'MODI',
            detailDesc: 'MODI'
        }],
        // 新增
        part1: true,
        part2: false,
        authSceneCode: '',
        sceneDesc: '',
        // 配置参数
        add_stageInList: [], // 分期参数设置
        add_textTitle: "分期参数设置",
        add_colunm3: false,
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
        textTitle9: '授权场景参数选项',
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
        up_scenarioInList: [], // 分期参数设置
        up_textTitle: "授权场景参数设置",
        up_colunm3: false,
        
        // 替换参数
        replcaeParam_dialog: false,
        replaceParamObj: {},
        istLoading1: false,
        replaceIndex: "",
        defalutChoseVal: "",
        choosedVal: "",
        // 设置参数
        setParam_dialog: false,
        setPcdObj: {},
        setPcdTitle: "",
        pcdList: [],
        delePcdList: [],
        //场景识别
        tempScene:{},
        rulesScene:{},
        dialogFormVisibleScene: false,//场景识别
        tabTotalScene:0,
        sceneListLoading: false,
        sceneList: [],
        sceneFormPage: {
            pageSize: 10,
            pageNum: 1
        },
        //场景识别新增
        dialogFormVisibleSceneAdd: false,//新增弹框
        tempSceneSet:{},
        rulesSceneAdd: {},
        dataFormSceneAdd: {},
        operationModeScen: '', 
        authSceneCodeScen: '',
        sceneDescScen: '',
        //场景识别修改
        dialogFormVisibleSceneUp: false,//新增弹框
        tempSceneUp:{},
        rulesSceneUp: {},
        dataFormSceneUp: {},
        operationModeUp: '', 
        authSceneCodeUp: '',
        sceneDesc: '',
    }
  },
    created() {
        this.getBtnAuth()
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
    },
    mounted() {
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        // 授权场景代码 
        this.getSelectDict( "/beta/betaService/AUS.PM.01.0002").then(res => {
            res.forEach(item => {
                item.label = item.authSceneCode + ' ' + item.sceneDesc
            });
            this.authSceneCodeOptions = res
        })
        //交易来源
        let obj={
            "flag":"Y",
        }
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0069",obj).then(res => {
            this.transSourceOptions = res
        })
        //交易识别代码
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0044").then(res => {
            this.transIdentifiNoOptions = res
        })
        //入账模式 
         this.getSelectDict( "dic_transPosting").then(res => {
            this.transPostingFlagOptions = res
        })
        //授权类型
        this.getSelectDict( "dic_authType").then(res => {
            this.authTypeOptions = res
        })
        //入账保留
        this.getSelectDict( "dic_isYorN").then(res => {
            this.postingRetainFlagOptions = res
        })
        //额度占用方式 
        this.getSelectDict( "dic_credit").then(res => {
            this.creditOccupyModeOptions = res
        })
        //允许强制授权
        this.getSelectDict( "dic_isYorN").then(res => {
            this.forceAuthFlagOptions = res
        })
        //允许冲正授权
        this.getSelectDict( "dic_isYorN").then(res => {
            this.rvTransFlagOptions = res
        })
        //生成授权码
        this.getSelectDict( "dic_isYorN").then(res => {
            this.authCodeFlagOptions = res
        })
        //场景类型
        this.getSelectDict( "dic_scenetype").then(res => {
            this.sceneTypeOptions = res
        })
        
        //交易场景
        let objForm={
            applicationRange:"A",
            operationMode: this.operationMode
        }
        this.getSelectDict( "/beta/betaService/AUS.PM.01.0202",objForm).then(res => {
            this.transSceneCodeAddOptions = res
        })
        
    // 分期类型码
    // this.getSelectDict( "dic_typesOfStages").then(res => {
    //     let rmData = ['APAY','CASH','LOAN','MERH','OTHE','SPCL','STMT','TRAN','TXAT']
    //     if () {

    //     }
    //     this.stageTypeCodeOptions = res
    // })

    
    

  },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('AUS.PM.01.0002')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('AUS.PM.01.0001')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('AUS.PM.01.0003')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('AUS.PM.01.0102')) { // 场景识别查询
                        this.infBtnFlag = true
                    } else {
                        this.infBtnFlag = false
                    }
                }
            }
        })
    },
    getList() {
        this.showInfo = true
        this.listLoading = true
        this.queryForm.authDataSynFlag = '1'
        this.post('/beta/betaService/AUS.PM.01.0002', this.queryForm, (res) => {
            if (res.returnCode == '000000') {
                this.listLoading = false
                if (res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
                    this.showInfo = true
                    this.list = res.returnData.rows
                    this.tabTotal = res.returnData.totalCount
                   
                }
            }
        })
    },
    handleClose() {
        this.showInfo = false
        this.queryForm = {}
    },
    handleSearch() {
        this.getList()
    },
    //新增显示的弹框
    handleAdd() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //新增确认
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
        this.up_scenarioInList.forEach(item => {
            item.addPcdFlag = '1'
            item.pcdList = item.pcdInitList
            item.instanCode1 = this.authSceneCode
            item.operationMode = this.tempAdd.operationMode
        })
        let obj={
            authCodeFlag: this.tempAdd.authCodeFlag,
            authSceneCode: this.tempAdd.authSceneCode,
            authType: this.tempAdd.authType,
            creditOccupyMode: this.tempAdd.creditOccupyMode,
            forceAuthFlag: this.tempAdd.forceAuthFlag,
            operationMode: this.tempAdd.operationMode,
            postingRetainFlag: this.tempAdd.postingRetainFlag,
            priority: this.tempAdd.priority,
            rvTransFlag: this.tempAdd.rvTransFlag,
            sceneDesc: this.tempAdd.sceneDesc,
            sceneType: this.tempAdd.sceneType,
            transIdentifiNo: this.tempAdd.transIdentifiNo,
            transSource: this.tempAdd.transOrigin,
            transPostingFlag: this.tempAdd.transPostingFlag,
            transRetainDays: this.tempAdd.transRetainDays,
            triggerNo: this.tempAdd.triggerNo,
        }
        obj.instanlist = this.up_scenarioInList
        obj.instanDimen1 = 'INST'
        obj.sce = this.tempAdd
        obj.authDataSynFlag = '1'
        this.post('/beta/betaService/AUS.PM.01.0001', obj,(res) => {
            if (res.returnCode == '000000') {
                this.dialogFormVisibleAdd = false
                this.$notify({
                    title: 'Success',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
            }
        })
        }
      })
    },
    // 下一步
    nextToPart2Btn() {
        this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                this.part1 = false
                this.part2 = true
                this.authSceneCode = this.tempAdd.authSceneCode
                this.sceneDesc = this.tempAdd.sceneDesc
                this.getParList()
            }
        })
    },
    // 上一步
    backPart1Btn() {
        this.part1 = true
        this.part2 = false
        this.authSceneCode = ''
        this.sceneDesc = ''
    }, 
    //下一步列表
    getParList (){
        this.showForm = false
        this.addListLoading = true
        let obj={
            instanCode: "123412",
            instanDimen1: "AUTX",
        }
        this.post('/beta/betaService/COS.IQ.02.0042', obj, (res) => {
            if (res.returnCode == '000000') {
                this.addListLoading = false
                if (res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
                    this.up_scenarioInList = res.returnData.rows
                    //this.addTabTotal = res.returnData.totalCount
                }
            }
        })
    },
    getSetList() {
        let obj = {
            instanCode: this.authSceneCode,
            instanDimen1: 'INST'
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0042", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_scenarioInList = res.returnData.rows
                }else{
                	this.up_scenarioInList = []
                }
            }
        }, (err) => {
        	this.up_scenarioInList = []
        })
    },

    // 详情
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
      this.getEventList(row)
      this.getList9()
    },
    //已关联事件
    getEventList(row) {
      	this.config1.loading = true;
      	this.config1.installType = row.stageTypeCode;
      	this.config1.operationMode = row.operationMode;
      	this.getTableList("/beta/betaService/COS.IQ.02.0001", this.config1, res => {
          	if (res.returnCode == "000000") {
            	this.config1.loading = false;
	            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	              	this.tableData1 = res.returnData.rows;
	              	this.config1.total = res.returnData.totalCount;
	            } else {
              		this.tableData1 = [];
              		this.config1.total = 0
            	}
          	}
        }, (err) => {
    		this.tableData1 = [];
          	this.config1.total = 0
          	this.config1.loading = false
        });
    },
    // 分期参数设置
    getList9() {
    	let obj = { 
            instanCode:  this.tempDetail.authSceneCode,
            operationMode:  this.tempDetail.operationMode,
        }
       	this.table9Loading = true
        this.table9FormObj = Object.assign(this.table9FormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.table9FormObj ,(res) => {
            if (res.returnCode == '000000') {
                this.table9Loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                     this.table9List =  res.returnData.rows
                     this.table9Total = res.returnData.totalCount
                }else{
                	this.table9List = []
                    this.table9Total = 0
                }
            } 
        }, (err) => {
        	this.table9List = []
            this.table9Total = 0
        	this.table9Loading = false
        })
    },
    // 查看参数
    hadleViewParam(row) {
        this.viewPcdTitle = '查看'+row.pcdNo+': '+row.pcdDesc+'的参数信息'
        this.viewPcd_dialog = true
        this.viewPcdFormObj = row
    },
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
         this.tempUp.transOrigin = row.transSource
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
        })
        this.getEventList(row)
        this.getSetOptionList(row)
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.tempUp.deletePcdInstanIdList = this.delePcdList
                this.tempUp.artifactInstanList = this.up_scenarioInList
                this.post('/beta/betaService/AUS.PM.01.0003', this.tempUp, (res) => {
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
    // 分期参数设置
    getSetOptionList(row) {
        let obj = {
            instanCode: row.authSceneCode,
            operationMode: row.operationMode
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_scenarioInList = res.returnData.rows
                    // this.add_stageInList =  res.returnData.rows
                }else{
            	  	this.up_scenarioInList = []
                }
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
      this.setPcdTitle = "设置" + e[0].pcdNo + ": " + e[0].pcdDesc + "的参数值";
    },
    //  确定替换参数
    sureReplaceData() {
      // 媒介对象实例化
        this.$set(
          this.up_scenarioInList[this.replaceIndex],
          "elementNo",
          this.choosedVal.split("_")[0]
        );
        this.$set(
          this.up_scenarioInList[this.replaceIndex],
          "elementDesc",
          this.choosedVal.split("_")[1]
        );
        this.replcaeParam_dialog = false;
    },
    //  确定设置参数
    sureSetData() {
        // 媒介对象实例化
        this.$set( this.up_scenarioInList[this.replaceIndex], "pcdInitList", this.pcdList );
        this.$set(this.up_scenarioInList, this.replaceIndex, this.setPcdObj);
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
    //场景识别显示弹框
    scenarioInfo(row){
        this.dialogFormVisibleScene=true
      	this.tempScene.authSceneCode  =  row.authSceneCode,
      	this.tempScene.operationMode = row.operationMode,
        this.tempScene = Object.assign({}, row)
        this.getScenarOptionList()
    },
    //场景识别列表
    getScenarOptionList() {
        let obj = {
            authDataSynFlag: '1',
            authSceneCode: this.tempScene.authSceneCode,
            operationMode: this.tempScene.operationMode,
           	pageNum:  this.sceneFormPage.pageNum,
           	pageSize: this.sceneFormPage.pageSize,
        }
        this.getTableList( "/beta/betaService/AUS.PM.01.0102", obj, res => {
            if (res.returnCode == "000000") {
                this.sceneListLoading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.sceneList = res.returnData.rows
                    this.tabTotalScene =  res.returnData.totalCount
                }else{
                	this.sceneList = []
                    this.tabTotalScene =  0
                }
            }
        }, (err) => {
        	this.sceneList = []
            this.tabTotalScene =  0
            this.sceneListLoading = false
        })
    },
    //新增
    authorizeInfo(row){
        this.dialogFormVisibleAuthorize=true
        this.tempAuthorize = Object.assign({}, row)
        this.getAddAuthorizeBtn(row)
    },
    //新增场景识别显示弹框
    sceneAddBtn(row){
        //console.log(row)
        this.dialogFormVisibleSceneAdd=true
        this.operationModeScen = row.operationMode
        this.authSceneCodeScen = row.authSceneCode
        this.sceneDescScen = row.sceneDesc
        
    },
    //保存场景识别
    holdScene(){
        this.$refs['dataFormSceneAdd'].validate((valid) => {
            if (valid) {
                this.tempSceneSet.operationMode = this.operationModeScen
                this.tempSceneSet.authSceneCode =  this.authSceneCodeScen
                this.tempSceneSet.sceneDesc =  this.sceneDescScen
                this.tempSceneSet.transSceneCode = this.tempSceneSet.transSceneCodeAdd
                this.tempSceneSet.authDataSynFlag = '1'
                delete this.tempSceneSet.transSceneCodeAdd
                delete this.tempSceneSet.sceneDescs
                this.post('/beta/betaService/AUS.PM.01.0101', this.tempSceneSet, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleSceneAdd = false
                        this.tempSceneSet = {}
                        this.$notify({
                        title: 'Success',
                        message: '建立成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getScenarOptionList()
                        this.tempSceneSet = {}
                    }
                })
            }
        })
    },
    //修改显示弹框
    handleUpdateScene(row){
        this.dialogFormVisibleSceneUp=true
        this.operationModeUp = row.operationMode
        this.authSceneCodeUp = row.authSceneCode
        this.sceneDesc = this.tempScene.sceneDesc
        this.tempSceneUp = Object.assign({}, row)
        this.$nextTick(() => {
        this.$refs['dataFormSceneUp'].clearValidate()
      })
        
    },
    //修改保存
    holdSceneUp(){
        this.$refs['dataFormSceneUp'].validate((valid) => {
            if (valid) {
                this.tempSceneUp.operationMode = this.operationModeUp
                this.tempSceneUp.authSceneCode =  this.authSceneCodeUp
                this.tempSceneUp.sceneDesc =  this.sceneDesc
                this.tempSceneUp.authDataSynFlag = '1'
                this.post('/beta/betaService/AUS.PM.01.0103', this.tempSceneUp, (res) => {
                    
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleSceneUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getScenarOptionList()
                        this.tempSceneUp = {}
                    }
                    
                })
            }
        })
    },
    //场景识别删除单条
    deleteSceneInfo(row){
        let item =row
        item.invalidFlag ='1'
  		this.post('/beta/betaService/AUS.PM.01.0103', item, (res) => {
            if (res.returnCode == '000000') {
                this.dialogFormVisibleSceneUp = false
                this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 2000
                })
                this.getScenarOptionList()
            }
        })
    },
    deleteSeneBtn(){
    	this.sceneList.authDataSynFlag = '1'
    	this.sceneList.authSceneCode = this.tempScene.authSceneCode
    	console.log(this.tempScene.authSceneCode)
    	this.post('/beta/betaService/AUS.PM.01.0103', this.sceneList, (res) => {
            if (res.returnCode == '000000') {
                this.dialogFormVisibleSceneUp = false
                this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 2000
                })
                this.sceneList = []
                this.getScenarOptionList()
            }   
        })
    },
  }
}
</script>

<style>
</style>
