<!-- 资金法人 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="法人编号" prop="corporationEntityNo">
                <el-input v-model="queryFormObj.corporationEntityNo" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="法人名称" prop="corporationEntityName">
                <el-input v-model="queryFormObj.corporationEntityName" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="法人类型" prop="partnerCategory">
                <el-select v-model="queryFormObj.partnerCategory" class="wd200" clearable >
                    <el-option
                        v-for="(item, index ) in partnerCategoryOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="状态标识" prop="status" >
                <el-select v-model="queryFormObj.status" class="wd200" clearable >
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
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="corporationEntityNo" label="法人编号" align="center" />
            <el-table-column prop="corporationEntityName" label="法人名称" align="center" />
            <el-table-column prop="partnerCategoryDesc" label="法人类型" align="center" />
            <el-table-column prop="fundTelName" label="联系人" align="center" />
            <el-table-column prop="fundTelMobile" label="联系人电话" align="center" />
            <el-table-column prop="statusDesc" label="状态" align="center" />
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-more" type="primary" @click="detailInfo(row)" v-show="selBtnFlag">查询</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="新增资金法人信息" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <div class="text_title titleInfo">基础信息：</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempAdd.operationMode" class="wd200">
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
               <el-form-item class="cl_td" label="法人类型" prop="partnerCategory" 
                   :rules="[ { required: true, message: '法人类型不能为空'}]">
                    <el-select v-model="tempAdd.partnerCategory" class="wd200">
                        <el-option
                            v-for="(item, index ) in partnerCategoryOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人编号" prop="corporationEntityNo"
                    :rules="[ { required: true, message: '法人编号不能为空'}]">
                   <el-input v-model="tempAdd.corporationEntityNo" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人名称" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人名称不能为空'}]">
                   <el-input v-model="tempAdd.corporationEntityName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="社会统一信用代码" prop="legalSocialNum"
                    :rules="[ { required: true, message: '社会统一信用代码不能为空'}]">
                   <el-input v-model="tempAdd.legalSocialNum" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="生效标识" prop="status" 
                   :rules="[ { required: true, message: '法人类型不能为空'}]">
                    <el-select v-model="tempAdd.status" class="wd200">
                        <el-option
                            v-for="(item, index ) in statusOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="repayPerformOrder">
                   <el-input v-model="tempAdd.repayPerformOrder" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="资金用途" prop="purposeFunds" 
                   :rules="[ { required: true, message: '资金用途不能为空'}]">
                    <el-select v-model="tempAdd.purposeFunds" class="wd200">
                        <el-option
                            v-for="(item, index ) in purposeFundsOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="资金债权标识" prop="isBankFunds" 
                   :rules="[ { required: true, message: '资金债权标识不能为空'}]">
                    <el-select v-model="tempAdd.isBankFunds" class="wd200">
                        <el-option
                            v-for="(item, index ) in isBankFundsOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="text_title titleInfo">法人信息：</div>
                 <el-form-item class="cl_td" label="单位名称" prop="legalCompName"
                    :rules="[ { required: true, message: '单位名称不能为空'}]">
                   <el-input v-model="tempAdd.legalCompName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表名称" prop="legalSocialName"
                    :rules="[ { required: true, message: '法人代表名称不能为空'}]">
                   <el-input v-model="tempAdd.legalSocialName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表证件类型" prop="legalIdType" 
                   :rules="[ { required: true, message: '法人代表证件类型不能为空'}]">
                    <el-select v-model="tempAdd.legalIdType" class="wd200">
                        <el-option
                            v-for="(item, index ) in legalIdTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表证件号码" prop="legalIdNo"
                    :rules="[ { required: true, message: '法人代表证件号码不能为空'}]">
                   <el-input v-model="tempAdd.legalIdNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表手机号" prop="legalMobile"
                    :rules="[ { required: true, message: '法人代表手机号不能为空'}]">
                   <el-input v-model="tempAdd.legalMobile" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表电话号码" prop="legalPhone"
                    :rules="[ { required: true, message: '法人代表电话号码不能为空'}]">
                   <el-input v-model="tempAdd.legalPhone" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="法人代表邮箱" prop="binNo">
                   <el-input v-model="tempAdd.binNo" class="wd200" type="text"/>
                </el-form-item>
                <div class="text_title titleInfo">联系人信息：</div>
               <el-form-item class="cl_td" label="联系人姓名" prop="fundTelName"
                    :rules="[ { required: true, message: '联系人姓名不能为空'}]">
                   <el-input v-model="tempAdd.fundTelName" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="联系人电话" prop="fundTelMobile" 
                     :rules="[ { required: true, message: '联系人电话不能为空'}]">
                   <el-input v-model="tempAdd.fundTelMobile" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="联系人电子邮箱地址" prop="fundTelEmail" 
                     :rules="[ { required: true, message: '联系人电子邮箱地址不能为空'}]">
                   <el-input v-model="tempAdd.fundTelEmail" class="wd200" type="text" />
                </el-form-item>
               <el-form-item class="cl_td" label="联系人类型" prop="fundTelType" 
                   :rules="[ { required: true, message: '联系人类型不能为空'}]">
                    <el-select v-model="tempAdd.fundTelType" class="wd200">
                        <el-option
                            v-for="(item, index ) in fundTelTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAdd()"> 关闭</el-button>
            </div>
        </el-dialog> 
       
        <!-- 修改 -->
        <el-dialog title="修改资金法人信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <div class="text_title titleInfo">基础信息：</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempUp.operationMode" class="wd200">
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
               <el-form-item class="cl_td" label="法人类型" prop="partnerCategory" 
                   :rules="[ { required: true, message: '法人类型不能为空'}]">
                    <el-select v-model="tempUp.partnerCategory" class="wd200">
                        <el-option
                            v-for="(item, index ) in partnerCategoryOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人编号" prop="corporationEntityNo">
                   <el-input v-model="tempUp.corporationEntityNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人名称" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人名称不能为空'}]">
                   <el-input v-model="tempUp.corporationEntityName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="社会统一信用代码" prop="legalSocialNum"
                    :rules="[ { required: true, message: '社会统一信用代码不能为空'}]">
                   <el-input v-model="tempUp.legalSocialNum" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="生效标识" prop="status" 
                   :rules="[ { required: true, message: '法人类型不能为空'}]">
                    <el-select v-model="tempUp.status" class="wd200">
                        <el-option
                            v-for="(item, index ) in statusOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="repayPerformOrder">
                   <el-input v-model="tempUp.repayPerformOrder" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="资金用途" prop="purposeFunds" 
                   :rules="[ { required: true, message: '资金用途不能为空'}]">
                    <el-select v-model="tempUp.purposeFunds" class="wd200">
                        <el-option
                            v-for="(item, index ) in purposeFundsOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="资金债权标识" prop="isBankFunds" 
                   :rules="[ { required: true, message: '资金债权标识不能为空'}]">
                    <el-select v-model="tempUp.isBankFunds" class="wd200">
                        <el-option
                            v-for="(item, index ) in isBankFundsOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="text_title titleInfo">法人信息：</div>
                 <el-form-item class="cl_td" label="单位名称" prop="legalCompName"
                    :rules="[ { required: true, message: '单位名称不能为空'}]">
                   <el-input v-model="tempUp.legalCompName" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表名称" prop="legalSocialName"
                    :rules="[ { required: true, message: '法人代表名称不能为空'}]">
                   <el-input v-model="tempUp.legalSocialName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表证件类型" prop="legalIdType" 
                   :rules="[ { required: true, message: '法人代表证件类型不能为空'}]">
                    <el-select v-model="tempUp.legalIdType" class="wd200">
                        <el-option
                            v-for="(item, index ) in legalIdTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表证件号码" prop="legalIdNo"
                    :rules="[ { required: true, message: '法人代表证件号码不能为空'}]">
                   <el-input v-model="tempUp.legalIdNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表手机号" prop="legalMobile"
                    :rules="[ { required: true, message: '法人代表手机号不能为空'}]">
                   <el-input v-model="tempUp.legalMobile" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表电话号码" prop="legalPhone"
                    :rules="[ { required: true, message: '法人代表电话号码不能为空'}]">
                   <el-input v-model="tempUp.legalPhone" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="法人代表邮箱" prop="binNo">
                   <el-input v-model="tempUp.binNo" class="wd200" type="text" />
                </el-form-item>
                <div class="text_title titleInfo">联系人信息：</div>
               <el-form-item class="cl_td" label="联系人姓名" prop="fundTelName"
                    :rules="[ { required: true, message: '联系人姓名不能为空'}]">
                   <el-input v-model="tempUp.fundTelName" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="联系人电话" prop="fundTelMobile" 
                     :rules="[ { required: true, message: '联系人电话不能为空'}]">
                   <el-input v-model="tempUp.fundTelMobile" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="联系人电子邮箱地址" prop="fundTelEmail" 
                     :rules="[ { required: true, message: '联系人电子邮箱地址不能为空'}]">
                   <el-input v-model="tempUp.fundTelEmail" class="wd200" type="text"/>
                </el-form-item>
               <el-form-item class="cl_td" label="联系人类型" prop="fundTelType" 
                   :rules="[ { required: true, message: '联系人类型不能为空'}]">
                    <el-select v-model="tempUp.fundTelType" class="wd200">
                        <el-option
                            v-for="(item, index ) in fundTelTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--查询-->
        <el-dialog title="资金法人详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <div class="text_title titleInfo">基础信息：</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempDetail.operationMode" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
               <el-form-item class="cl_td" label="法人类型" prop="partnerCategory" 
                   :rules="[ { required: true, message: '法人类型不能为空'}]">
                    <el-select v-model="tempDetail.partnerCategory" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in partnerCategoryOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人编号" prop="corporationEntityNo">
                   <el-input v-model="tempDetail.corporationEntityNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人名称" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人名称不能为空'}]">
                   <el-input v-model="tempDetail.corporationEntityName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="社会统一信用代码" prop="legalSocialNum"
                    :rules="[ { required: true, message: '社会统一信用代码不能为空'}]">
                   <el-input v-model="tempDetail.legalSocialNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="生效标识" prop="status" 
                   :rules="[ { required: true, message: '法人类型不能为空'}]">
                    <el-select v-model="tempDetail.status" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in statusOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="repayPerformOrder">
                   <el-input v-model="tempDetail.repayPerformOrder" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="资金用途" prop="purposeFunds" 
                   :rules="[ { required: true, message: '资金用途不能为空'}]">
                    <el-select v-model="tempDetail.purposeFunds" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in purposeFundsOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="资金债权标识" prop="isBankFunds" 
                   :rules="[ { required: true, message: '资金债权标识不能为空'}]">
                    <el-select v-model="tempDetail.isBankFunds" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in isBankFundsOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class="text_title titleInfo">法人信息：</div>
                 <el-form-item class="cl_td" label="单位名称" prop="legalCompName"
                    :rules="[ { required: true, message: '单位名称不能为空'}]">
                   <el-input v-model="tempDetail.legalCompName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表名称" prop="legalSocialName"
                    :rules="[ { required: true, message: '法人代表名称不能为空'}]">
                   <el-input v-model="tempDetail.legalSocialName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表证件类型" prop="legalIdType" 
                   :rules="[ { required: true, message: '法人代表证件类型不能为空'}]">
                    <el-select v-model="tempDetail.legalIdType" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in legalIdTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表证件号码" prop="legalIdNo"
                    :rules="[ { required: true, message: '法人代表证件号码不能为空'}]">
                   <el-input v-model="tempDetail.legalIdNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表手机号" prop="legalMobile"
                    :rules="[ { required: true, message: '法人代表手机号不能为空'}]">
                   <el-input v-model="tempDetail.legalMobile" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人代表电话号码" prop="legalPhone"
                    :rules="[ { required: true, message: '法人代表电话号码不能为空'}]">
                   <el-input v-model="tempDetail.legalPhone" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="法人代表邮箱" prop="binNo">
                   <el-input v-model="tempDetail.binNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="text_title titleInfo">联系人信息：</div>
               <el-form-item class="cl_td" label="联系人姓名" prop="fundTelName"
                    :rules="[ { required: true, message: '联系人姓名不能为空'}]">
                   <el-input v-model="tempDetail.fundTelName" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="联系人电话" prop="fundTelMobile" 
                     :rules="[ { required: true, message: '联系人电话不能为空'}]">
                   <el-input v-model="tempDetail.fundTelMobile" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="联系人电子邮箱地址" prop="fundTelEmail" 
                     :rules="[ { required: true, message: '联系人电子邮箱地址不能为空'}]">
                   <el-input v-model="tempDetail.fundTelEmail" class="wd200" type="text" readonly/>
                </el-form-item>
               <el-form-item class="cl_td" label="联系人类型" prop="fundTelType" 
                   :rules="[ { required: true, message: '联系人类型不能为空'}]">
                    <el-select v-model="tempDetail.fundTelType" class="wd200" disabled readonly>
                        <el-option
                            v-for="(item, index ) in fundTelTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
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
            btnAuthStr: '',
            logininfo: '',
            // 列表
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
                status: '有效',
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            // 下拉框
            operationModeOptions:[],// 运营模式 
            partnerCategoryOptions: [],//法人类型
            statusOptions: [],//状态标识
            purposeFundsOptions: [],//资金用途
            isBankFundsOptions: [],//资金债券标识
            fundTelTypeOptions: [],//联系人类型
            legalIdTypeOptions: [],
            /*----新增----*/
            tempAdd: {}, // 新增
            newLegal: '',
            dialogFormVisibleAdd: false,
            rulesAdd: {},
            rulesUp: {},
            //修改
            dataFormUp:{},
            tempUp: {}, // 修改
            up_segmentNumber: '',
            dialogFormVisibleUp: false,
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
            this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //法人类型
             this.getSelectDict("dic_fundlegalPersonType").then(res => {
                this.partnerCategoryOptions = res
            })
            //状态标识
            this.getSelectDict("dic_effectiveStatus").then(res => {
            	this.statusOptions = res
            })
            //资金用途
            this.getSelectDict("dic_purposeFunds").then(res => {
                this.purposeFundsOptions = res
            })
            //资金债权标识
            this.getSelectDict("dic_ZorO").then(res => {
                this.isBankFundsOptions = res
            })
            //法人代表证件类型
            this.getSelectDict("dic_certificateType").then((res) => {
                this.legalIdTypeOptions = res;
            });
            //联系人类型
            this.getSelectDict("dic_contactType").then((res) => {
                this.fundTelTypeOptions = res;
            });
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
                            if (this.eventList.includes('COS.IQ.02.0180') != -1) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                            if (this.eventList.includes('COS.IQ.02.1320') != -1) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.eventList.includes('COS.IQ.02.1325') != -1) { // 修改
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
                let params = {
                    isTrans: true,//是否需要翻译数据字典
                    transParams : ['dic_effectiveStatus','dic_fundlegalPersonType'],//查找数据字典所需参数
                    transDict : ['status','partnerCategory'],//翻译前后key
                }
                params = Object.assign(this.queryFormObj, params)   //合并
               if(params.status=='有效' || params.status==''){
                	params.status ='1'
                }else if(params.status=='无效'){
                	params.status='0'
                }
                this.getTableList('/beta/betaService/FMS.IQ.04.0001', params,(res) => {
                    this.listLoading1 = false
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tableList = res.returnData.rows
                            this.tableTotal = res.returnData.totalCount
                        }else{
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
            //查询
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
            //确认新增数据 
            createData() {
               this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/FMS.AD.01.0001',this.tempAdd, (res) => {
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
            //关闭新增
            closeAdd(){
            	this.dialogFormVisibleAdd = false
            },
            //显示修改弹框
            handleUpdate(row) {
                this.tempUp = Object.assign({}, row)
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            }, 
            //确认修改数据
            updateData() {
               this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/FMS.UP.01.0001', this.tempUp, (res) => {
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
            //查询详情显示弹框
            detailInfo(row) {
                this.tempDetail = Object.assign({}, row)
                if(row.status=='1'){
                	this.tempDetail.status='有效'
                }else{
                	this.tempDetail.status='无效'
                }
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
