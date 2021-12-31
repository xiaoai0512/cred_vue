<!--客户定价标签-->
<template>
    <div class="allContent">
        <el-form ref="transForm" :model="queryForm">
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
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAdddate(queryForm)">新增</el-button>
                <el-button v-if="eyer" size="medium" icon="el-icon-arrow-down" type="primary" @click="showDateBtn"></el-button>
                <el-button v-else size="medium" icon="el-icon-arrow-up" type="primary" @click="showDateBtn"></el-button>
            </div>
            <template v-if="showDate">
                <el-form-item class="cl_td" label="标签生效日期" prop="custTagEffectiveDate" >
                    <el-date-picker
                        v-model="queryForm.custTagEffectiveDate"
                        type="date"
                        class="wd200"
                        value-format="yyyy-MM-dd" 
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="标签失效日期" prop="custTagExpirationDate" >
                    <el-date-picker
                        v-model="queryForm.custTagExpirationDate"
                        align="right"
                        type="date"
                        class="wd200"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd" 
                        >
                    </el-date-picker>
                </el-form-item>
            </template>
        </el-form>
        <!-- 列表 -->
        <el-table v-if="isShow" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
            <el-table-column align="center" label="定价层级" prop="pricingLevelDesc" />
            <el-table-column align="center" label="定价层级代码" prop="pricingLevelCode" />
            <el-table-column align="center" label="定价类型" prop="pricingObject" />
            <el-table-column align="center" label="定价对象" prop="pricingObjectCodeDesc" />
            <el-table-column align="center" label="定价标签" prop="pricingTag" />
            <el-table-column align="center" label="定价标签描述" prop="pricingDesc" />
            <el-table-column align="center" label="标签生效日期" prop="custTagEffectiveDate" />
            <el-table-column align="center" label="标签失效日期" prop="custTagExpirationDate" />
            <el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="handleDetail(row)">查询</el-button>
                    <el-button size="medium" icon="el-icon-edit" type="primary" @click="handleUp(row)">修改</el-button>
                  
                </template>
            </el-table-column>
        </el-table>
        <pagination  v-if="isShow"  v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize"  @pagination="getList" />
        <!--新增-->
        <el-dialog title="新增定价标签" :visible.sync="dialogFormVisibleAddView" width='70%'>
            <div class="mainname">1. 定价对象信息</div>
            <el-form ref="tempAddRef1" :model="tempAddObjInfo1">
                <el-form-item class="cl_td" label="定价类型 " prop="pricingObject">
                    <el-select v-model="tempAddObjInfo1.pricingObject" class="wd200">
                        <el-option v-for="(item, index) in pricingObjectOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCode">
                    <el-input v-model="tempAddObjInfo1.pricingObjectCode" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchAddData()">搜素</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="resetData()">重置</el-button>
                </div>
            </el-form>
            <el-table  v-loading="addlistLoading" :data="tampAddList" border fit highlight-current-row style="width: 100%;">
                <el-table-column align="center" width="80px" label="运营模式" prop="operationMode" />
                <el-table-column align="center" width="80px" label="定价类型" prop="pricingObject" />
                <el-table-column align="center" label="定价对象" prop="pricingObjectCodeDesc" />
                <el-table-column align="center" label="定价标签" prop="pricingTag" />
                <el-table-column align="center" label="描述" prop="pricingDesc" />
                <el-table-column align="center" label="定价区域" prop="pricingTypeDesc" />
                <el-table-column align="center" width="70px" label="优先级" prop="performOrder" />
                <el-table-column align="center" label="定价方式" prop="pricingMethodDesc" />
                <el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="medium" icon="el-icon-search" type="primary" @click="labelSee(row)">查询</el-button>
                        <el-button size="medium"  type="primary" @click="choseCstInf(row)">选择</el-button>
                      
                    </template>
                </el-table-column>
            </el-table>
            <pagination  v-show="addTotal>0" :total="addTotal" :page.sync="tampAddPage.pageNum" :limit.sync="tampAddPage.pageSize"  @pagination="getAddList" />
            <div class="mainname">2. 客户标签信息</div>
            <el-form ref="tempAddRef2" :model="tempAddObjInfo2">
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag" >
                    <el-input v-model="tempAddObjInfo2.pricingTag" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="定价描述" prop="pricingDesc"> 
                    <el-input v-model="tempAddObjInfo2.pricingDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCodeTrans" >
                    <el-input v-model="tempAddObjInfo2.pricingObjectCodeTrans" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价区域 " prop="pricingType">
                    <el-select v-model="tempAddObjInfo2.pricingType" class="wd200" disabled>
                        <el-option v-for="(item, index) in pricingTypeOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <template>
                    <el-form-item class="cl_td" label="标签生效日期" prop="custTagEffectiveDate" :rules="[ { required: true, message: '标签生效日期不能为空'} ]">
                        <el-date-picker
                            v-model="tempAddObjInfo2.custTagEffectiveDate"
                            type="date"
                            class="wd200"
                            value-format="yyyy-MM-dd" 
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="cl_td" label="标签失效日期" prop="custTagExpirationDate" :rules="[ { required: true, message: '标签失效日期不能为空'} ]">
                        <el-date-picker
                            v-model="tempAddObjInfo2.custTagExpirationDate"
                            align="right"
                            type="date"
                            class="wd200"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd" 
                            >
                        </el-date-picker>
                    </el-form-item>
                </template>
            </el-form>
            <div class="mainname">3. 标签应用范围</div>
            <el-form ref="tempAddRef3" :model="tempAddObjInfo3">
                <el-form-item class="cl_td" label="定价层级 " prop="pricingLevel" :rules="[ { required: true, message: '定价层级不能为空'} ]">
                    <el-select v-model="tempAddObjInfo3.pricingLevel" class="wd200" @change="pricingLevelChange($event)" >
                        <el-option v-for="(item, index) in pricingLevelOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价层级代码 " prop="customerNo" :rules="[ { required: true, message: '定价层级代码不能为空'} ]">
                    <el-select v-model="tempAddObjInfo3.customerNo" class="wd200">
                        <el-option v-for="(item, index) in pricingLevelCodeOptions" 
                            :key="index" 
                            :label="item.label" 
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种 " prop="currencyCode">
                    <el-select v-model="tempAddObjInfo3.currencyCode" class="wd200">
                        <el-option v-for="(item, index) in currencyArrOptions" 
                            :key="index" 
                            :label="item.currencyDesc" 
                            :value="item.currencyCode" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeAdd()">关闭</el-button>
                <el-button type="primary" @click="subAddData()">确认</el-button>
            </div>
        </el-dialog>  
        <!--定价标签详细信息-->
        <el-dialog title="新增定价标签" :visible.sync="dialogFormVisibleDetailView" width='70%'>
            <el-form ref="labelRef" :model="labelDetail">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-input v-model="labelDetail.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="标签号" prop="pricingTag" >
                    <el-input v-model="labelDetail.pricingTag" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价类型" prop="pricingObject">
                    <el-input v-model="labelDetail.pricingObject" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCode">
                    <el-input v-model="labelDetail.pricingObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价描述" prop="pricingDesc" >
                    <el-input v-model="labelDetail.pricingDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价区域 " prop="pricingType" >
                    <el-select v-model="labelDetail.pricingType" class="wd200" disabled>
                        <el-option v-for="(item, index) in pricingLevelOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="performOrder" >
                    <el-input v-model="labelDetail.performOrder" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价方式 " prop="pricingMethod" >
                    <el-select v-model="labelDetail.pricingMethod" class="wd200" disabled>
                        <el-option v-for="(item, index) in pricingMethodOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值类型 " prop="pcdType">
                    <el-select v-model="labelDetail.pcdType" class="wd200" disabled>
                        <el-option v-for="(item, index) in pcdTypeOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue" >
                    <el-input v-model="labelDetail.pcdValue" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="小数位" prop="pcdPoint" >
                    <el-input v-model="labelDetail.pcdPoint" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="附卡基准年费" prop="supplementBaseFee" >
                    <el-input v-model="labelDetail.supplementBaseFee" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetailView = false">关闭</el-button>
            </div>
        </el-dialog> 
        <!--查询-->
        <el-dialog title="客户定价标签信息" :visible.sync="dialogFormVisibleInfoView" width='70%'>
            <el-form ref="customerTagRef" :model="customerTagInfo">
                <el-form-item class="cl_td" label="客户代码" prop="customerNo" >
                    <el-input v-model="customerTagInfo.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价层级" prop="pricingLevel" >
                    <el-input v-model="customerTagInfo.pricingLevel" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价层级代码" prop="pricingLevelCode">
                    <el-input v-model="customerTagInfo.pricingLevelCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="pricingScope" >
                    <el-select v-model="customerTagInfo.pricingScope" class="wd200" disabled>
                        <el-option v-for="(item, index) in currencyArrOptions" 
                            :key="index" 
                            :label="item.currencyDesc" 
                            :value="item.currencyCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价类型" prop="pricingObject">
                    <el-input v-model="customerTagInfo.pricingObject" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价对象 " prop="pricingObjectCode" >
                    <el-input v-model="customerTagInfo.pricingObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag" >
                    <el-input v-model="customerTagInfo.pricingTag" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="标签生效日期" prop="custTagEffectiveDate" >
                    <el-input v-model="customerTagInfo.custTagEffectiveDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="标签失效日期" prop="custTagExpirationDate" >
                    <el-input v-model="customerTagInfo.custTagExpirationDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="设置日期 " prop="customerTagInfo.settingDate" >
                    <el-input v-model="customerTagInfo.settingDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="设置时间" prop="settingTime" >
                    <el-input v-model="customerTagInfo.settingTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="设置人员代码" prop="settingUpUserid" >
                    <el-input v-model="customerTagInfo.settingUpUserid" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="解除日期" prop="removeDate" >
                    <el-input v-model="customerTagInfo.removeDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="解除人员代码" prop="removalUserid" >
                    <el-input v-model="customerTagInfo.removalUserid" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="状态" prop="state" >
                    <el-select v-model="customerTagInfo.state" class="wd200" disabled>
                        <el-option v-for="(item, index) in stateOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <!--定价标签参数信息-->
                <div class="clearboth"></div>
                <div class="mainname">定价标签参数信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-input v-model="customerTagInfo.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag" >
                    <el-input v-model="customerTagInfo.pricingTag" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc" >
                    <el-input v-model="customerTagInfo.pricingDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价区域" prop="pricingType" >
                    <el-select v-model="customerTagInfo.pricingType" class="wd200" disabled>
                        <el-option v-for="(item, index) in pricingLevelOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价类型" prop="pricingObject" >
                    <el-input v-model="customerTagInfo.pricingObject" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCode" >
                    <el-input v-model="customerTagInfo.pricingObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="performOrder" >
                    <el-input v-model="customerTagInfo.performOrder" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价方式 " prop="pricingMethod" >
                    <el-select v-model="customerTagInfo.pricingMethod" class="wd200" disabled>
                        <el-option v-for="(item, index) in pricingMethodOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值类型 " prop="pcdType">
                    <el-select v-model="customerTagInfo.pcdType" class="wd200" disabled>
                        <el-option v-for="(item, index) in pcdTypeOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue" >
                    <el-input v-model="customerTagInfo.pcdValue" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="小数位" prop="pcdPoint" >
                    <el-input v-model="customerTagInfo.pcdPoint" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="附卡基准年费" prop="supplementBaseFee" >
                    <el-input v-model="customerTagInfo.supplementBaseFee" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleInfoView = false">关闭</el-button>
            </div>
        </el-dialog> 
        <!--修改-->
        <el-dialog title="客户定价标签信息" :visible.sync="dialogFormVisibleUpView" width='70%'>
            <el-form ref="tempUpRef" :model="tempUp">
                <el-form-item class="cl_td" label="客户代码" prop="customerNo" >
                    <el-input v-model="tempUp.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价层级" prop="pricingLevel" >
                    <el-input v-model="tempUp.pricingLevel" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价层级代码" prop="pricingLevelCode">
                    <el-input v-model="tempUp.pricingLevelCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="pricingScope" >
                    <el-select v-model="tempUp.pricingScope" class="wd200" disabled>
                        <el-option v-for="(item, index) in currencyArrOptions" 
                            :key="index" 
                            :label="item.currencyDesc" 
                            :value="item.currencyCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价类型" prop="pricingObject">
                    <el-input v-model="tempUp.pricingObject" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价对象 " prop="pricingObjectCode" >
                    <el-input v-model="tempUp.pricingObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag" >
                    <el-input v-model="tempUp.pricingTag" class="wd200" type="text" readonly/>
                </el-form-item>
                <template>
                    <el-form-item class="cl_td" label="标签生效日期" prop="custTagEffectiveDate" >
                        <el-date-picker
                            v-model="tempUp.custTagEffectiveDate"
                            type="date"
                            class="wd200"
                            value-format="yyyy-MM-dd" 
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="cl_td" label="标签失效日期" prop="custTagExpirationDate">
                        <el-date-picker
                            v-model="tempUp.custTagExpirationDate"
                            align="right"
                            type="date"
                            class="wd200"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd" 
                            >
                        </el-date-picker>
                    </el-form-item>
                </template>
                
                <el-form-item class="cl_td" label="设置日期 " prop="settingDate" >
                    <el-input v-model="tempUp.settingDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="设置时间" prop="settingTime" >
                    <el-input v-model="tempUp.settingTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="设置人员代码" prop="settingUpUserid" >
                    <el-input v-model="tempUp.settingUpUserid" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="解除日期" prop="removeDate" >
                    <el-input v-model="tempUp.removeDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="解除人员代码" prop="removalUserid" >
                    <el-input v-model="tempUp.removalUserid" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="状态" prop="state" >
                    <el-select v-model="tempUp.state" class="wd200" disabled>
                        <el-option v-for="(item, index) in stateOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUpView = false">关闭</el-button>
                 <el-button type="primary" @click="subUpData()">确认</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
import ApiService from '@/api/api-service'
import Pagination from '@/components/Pagination'
export default {
    name: 'InterestQueryNew',
    components: {
        Pagination
    },
    data() {
        return {
            showDate: false,
            eyer:true,
            listLoading: true,
            list: null, // 列表
            total: 0,
            logininfo: '',
            queryForm: {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                pageNum: 1,
                pageSize: 10
            },
            isShow: false, // 结息交易列表
            //下拉
            idTypeList: [],
            pricingObjectOptions: [],//定价类型
            pricingTypeOptions: [],//定价区域
            pricingLevelOptions: [],//定价层级
            pricingLevelCodeOptions: [],//定价层级代码
            currencyArrOptions: [],//币种
            pcdTypeOptions: [],//取值类型
            pricingMethodOptions: [],//定价方式
            stateOptions: [],//状态
            //新增
            dialogFormVisibleAddView: false,
            tempAddObjInfo1: {},
            tempAddObjInfo2: {
                custTagEffectiveDate: '',//生效日期
                custTagExpirationDate: '', //失效日期
            },
            tempAddObjInfo3: {},
            tempAddRef1: {},
            tempAddRef2: {},
            tempAddRef3: {},
            newPricingLevelCode: '',
            mewForm: {},
            addlistLoading: false,
            addTotal: 0,
            tampAddList: [],
            tampAddPage: { // 结息交易表对象
                pageNum: 1,
                pageSize: 10
            },
            //查看定价标签详细信息
            labelDetail: {},
            labelRef: {},
            dialogFormVisibleDetailView: false,
            //查询
            customerTagInfo: {},
            customerTagInfo: {},
            dialogFormVisibleInfoView: false,
            //修改
            dialogFormVisibleUpView: false,
            tempUpRef: {},
            tempUp: {},
        }
    },
    created() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
        
    },
    mounted() {
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        //定价类型
        this.getSelectDict('dic_pricingType').then((res) => {
            this.pricingObjectOptions = res
        })
        //定价区域
        this.getSelectDict('dic_priceArea').then((res) => {
            this.pricingTypeOptions = res
        })
        //定价层级
        this.getSelectDict('dic_pricingLevel').then((res) => {
            this.pricingLevelOptions = res
        })
        //币种
        let obj = {
            operationMode: this.logininfo.operationMode
        }
        this.getSelectDict('/beta/betaService/COS.IQ.02.0034', obj).then((res) => {
            this.currencyArrOptions = res
        })
        //取值类型
        this.getSelectDict('dic_valueType').then((res) => {
            this.pcdTypeOptions = res
        })
        //定价方式
        this.getSelectDict('dic_priceModel').then((res) => {
           this.pricingMethodOptions = res
        })
        //状态
        this.getSelectDict('dic_invalidFlagYN').then((res) => {
           this.stateOptions = res
        })
        
    },
    methods: {
        showDateBtn(){
            this.eyer=!this.eyer
            this.showDate=!this.showDate
            
        },
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                pageNum: 1,
                pageSize: 10
            }
            this.isShow = false // 结息交易列表
            this.showTransUint = false // 交易单元计息明细 三级表格
        },
        // 重置
        reset() {
          this.init()
        },
        // 点击查询按钮
        handleSearch() {
            if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                this.$message({
                  message: '请输入查询信息',
                  type: 'warning'
                })
                this.getList()
            } else {
                if (this.queryForm.idType) {
                    if (!this.queryForm.idNumber) {
                        this.$message({
                        message: '请输入证件号码',
                        type: 'warning'
                    })
                } else {
                    this.getList()
                }
            } else if (this.queryForm.idNumber) {
                if (!this.queryForm.idType) {
                    this.$message({
                      message: '请输入证件类型',
                      type: 'warning'
                    })
                } else {
                    this.getList()
                }
                } else {
                    this.getList()
                }
            }
        },
        // 查询列表
        getList() {
            this.listLoading = true
            const obj = {
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_pricingLevel'],//查找数据字典所需参数
                transDict : ['pricingLevel'],//翻译前后key
            }
            this.queryForm = Object.assign(this.queryForm, obj)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0095', this.queryForm, (res) => {
                if(res.returnCode == '000000') {
                    this.listLoading = false
                    this.isShow = true
                    if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.list = res.returnData.rows
                        this.total = res.returnData.totalCount
                        this.list.forEach(item =>{
                            item.pricingObjectCodeDesc = item.pricingObjectCode+ ' '+ item.pricingObjectDesc
                        })
                    } else{
                        this.list = []
                    }
                }
            })
        },
        // 新增 按钮
        handleAdddate(row) {
            this.dialogFormVisibleAddView = true
            this.mewForm=row
            this.getAddList()
            this.getQueryDate()
            this.$nextTick(() => {
                this.$refs['tempAddRef1'].clearValidate()
            })
        }, 
        closeAdd(){
            this.dialogFormVisibleAddView = false
            this.$nextTick(() => {
                this.$refs['tempAddRef2'].resetFields()
            })
            this.tempAddObjInfo1 = {}
            this.tempAddObjInfo3 = {}
        },
        //搜索
        searchAddData(){
            this.getAddList()
        },
        //重置
        resetData(){
            this.tempAddObjInfo1={}
        },
        //新增列表数据
        getAddList() {
            this.addlistLoading = true
            let obj = {
                pcdNo: "8%,9%",
                isTrans: true,//是否需要翻译数据字典
                pricingObject: this.tempAddObjInfo1.pricingObject,
                pricingObjectCode: this.tempAddObjInfo1.pricingObjectCode,
                transParams : ['dic_pricingLevel','dic_priceArea','dic_priceModel'],//查找数据字典所需参数
                transDict : ['pricingLevel','pricingType','pricingMethod'],//翻译前后key
            }
            obj = Object.assign(this.tampAddPage, obj)
            this.getTableList('/beta/betaService/COS.IQ.02.0019', obj, (res) => {
                this.addlistLoading = false
                if(res.returnCode == '000000'){
                    if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.tampAddList = res.returnData.rows
                        this.addTotal = res.returnData.totalCount
                        this.tampAddList.forEach(item =>{
                            item.pricingObjectCodeDesc = item.pricingObjectCode+ ' '+ item.pricingObjectDesc
                        })
                    }
                }
            })
        },
        //运营模式监听
        pricingLevelChange(val) {
            this.pricingLevelCodeOptions = []
            this.newPricingLevelCode = val
            this.getPricingLevelCodeOptions()
        },
        //授权响应码下拉关联卡组织标识
        getPricingLevelCodeOptions() {
            let params = {
                externalIdentificationNo: this.mewForm.externalIdentificationNo,
                idType: this.mewForm.idType,
                idNumber: this.mewForm.idNumber,
            }
            if(this.newPricingLevelCode=='C'){
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0005', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                
                                item.customerNoDesc = item.customerNo + ' ' + item.customerName
                                arr[index] = {
                                    label: item.customerNoDesc,
                                    value: item.customerNo
                                }
                            })
                            this.pricingLevelCodeOptions = arr
                        } else {
                            this.pricingLevelCodeOptions = []
                        }
                    }
                })
            }else if(this.newPricingLevelCode=='G'){
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0020', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                item.customerNoDesc = item.businessProgramNo + ' ' + item.programDesc
                                arr[index] = {
                                    label: item.customerNoDesc,
                                    value: item.businessProgramNo
                                }
                            })
                            this.pricingLevelCodeOptions = arr
                        } else {
                            this.pricingLevelCodeOptions = []
                        }
                    }
                })
            }else if(this.newPricingLevelCode=='T'){
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0020', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let newObj = {}
                            newObj.operationMode = res.returnData.rows[0].operationMode
                            let busArray = []
                            busArray.push(res.returnData.rows[0].businessProgramNo);
                            let busList = {}
                            busList.busArray = busArray
                            newObj = Object.assign(busList, newObj)
                            this.post('/beta/betaService/COS.IQ.02.0033',newObj, (res) => {
                            if (res.returnCode == '000000') {
                                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                    let arr = []
                                    let rows = res.returnData.rows
                                    rows.forEach((item, index) => {
                                        item.customerNoDesc = item.businessTypeCode + ' ' + item.businessDesc
                                        arr[index] = {
                                            label: item.customerNoDesc,
                                            value: item.businessTypeCode
                                        }
                                    })
                                    this.pricingLevelCodeOptions = arr
                                } else {
                                    this.pricingLevelCodeOptions = []
                                }
                            }
                        })
                        }
                    }
                })
                
            }else if(this.newPricingLevelCode=='M'){
                params.flag = '3'
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0017', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                
                                item.customerNoDesc = item.mediaUnitCode + ' ' + item.externalIdentificationNo
                                arr[index] = {
                                    label: item.customerNoDesc,
                                    value: item.mediaUnitCode
                                }
                            })
                            this.pricingLevelCodeOptions = arr
                        } else {
                            this.pricingLevelCodeOptions = []
                        }
                    }
                })
            }else if(this.newPricingLevelCode=='P'){
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0114', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                
                                item.customerNoDesc = item.productObjectCode + ' ' + item.productDesc
                                arr[index] = {
                                    label: item.customerNoDesc,
                                    value: item.productObjectCode
                                }
                            })
                            this.pricingLevelCodeOptions = arr
                        } else {
                            this.pricingLevelCodeOptions = []
                        }
                    }
                })
            }
        },
        //选择
        choseCstInf(item){
            this.tempAddObjInfo2.pricingTag=item.pricingTag
            this.tempAddObjInfo2.pricingDesc=item.pricingDesc
            this.tempAddObjInfo2.pricingObjectCodeTrans=item.pricingObjectCodeTrans
            this.tempAddObjInfo2.pricingType=item.pricingType
            let priceList = []
            let arr=[]
            this.tempAddObjInfo2.pricingObjectCodeTrans=item.pricingObjectCodeDesc
            priceList.push({detailDesc :'客户级',codes : 'C'});
            this.pricingLevelOptions=priceList;
            if(item.instanDimen1=='MODG'||
                item.instanDimen2=='MODG'||
                item.instanDimen3=='MODG'||
                item.instanDimen4=='MODG'||
                item.instanDimen5=='MODG'
                ){
                priceList.push({detailDesc :'业务项目级',codes : 'G'});
                this.pricingLevelOptions=priceList;
            }
            if(item.instanDimen1=='MODT'||
                item.instanDimen2=='MODT'||
                item.instanDimen3=='MODT'||
                item.instanDimen4=='MODT'||
                item.instanDimen5=='MODT'
            ){
                priceList.push({detailDesc :'业务项目级',codes : 'G'},{detailDesc :'业务类型级',codes : 'T',});
                this.pricingLevelOptions=priceList;
            }
            if(item.instanDimen1=='MODP'||
                item.instanDimen2=='MODP'||
                item.instanDimen3=='MODP'||
                item.instanDimen4=='MODP'||
                item.instanDimen5=='MODP'
            ){
                priceList.push({detailDesc :'产品对象级',codes : 'G'});
                this.pricingLevelOptions=priceList;
            }
            if(item.instanDimen1=='MODM'||
                item.instanDimen2=='MODM'||
                item.instanDimen3=='MODM'||
                item.instanDimen4=='MODM'||
                item.instanDimen5=='MODM'
            ){
                priceList.push({detailDesc :'媒介级',codes : 'M'});
                this.pricingLevelOptions=priceList;
            }
        },
        getQueryDate(){
           let params = {
                externalIdentificationNo: this.mewForm.externalIdentificationNo,
                idType: this.mewForm.idType,
                idNumber: this.mewForm.idNumber,
            }
            this.post('/beta/betaService/COS.IQ.02.0038',params,(res) => {
                if (res.returnCode == '000000') {
                    this.tempAddObjInfo2.custTagEffectiveDate = res.returnData.rows[0].lastProcessDate;
                    this.tempAddObjInfo2.custTagExpirationDate = res.returnData.rows[0].nextProcessDate;
                }
            })
        },
        subAddData(){
            if((this.tempAddObjInfo2.pricingTag=='' || this.tempAddObjInfo2.pricingTag==undefined)|| (this.tempAddObjInfo2.pricingDesc=='' ||
            this.tempAddObjInfo2.pricingDesc==undefined) || (this.tempAddObjInfo2.pricingObjectCodeTrans=='' || this.tempAddObjInfo2.pricingObjectCodeTrans== undefined) ||
            (this.tempAddObjInfo2.pricingType==''|| this.tempAddObjInfo2.pricingType== undefined)){
                this.$message("请选择客户定价信息")
                return;
            }
            if( this.tempAddObjInfo2.custTagExpirationDate < this.tempAddObjInfo2.custTagEffectiveDate){
                this.$message("失效日期不能小于生效日期")
                return;
            }
            if(this.tempAddObjInfo3.pricingLevel=='' || this.tempAddObjInfo3.customerNo==''){
                
                this.$message("定价层级与定价层级代码不能为空")
                return;
            }
            let objItem={
                pcdNo: "8%,9%",
                pageNum: this.tampAddPage.pageNum,
                pageSize: this.tampAddPage.pageSize,
                externalIdentificationNo: this.mewForm.externalIdentificationNo,
                idType: this.mewForm.idType,
                idNumber: this.mewForm.idNumber,
            }
            objItem = Object.assign( this.tempAddObjInfo2, this.tempAddObjInfo3 )
            this.$refs['tempAddRef2'].validate((valid) => {
                if (valid) {
                    this.post('/nonfi/nonfinanceService/BSS.AD.01.0010',  objItem,(res) => {
                        if (res.returnCode == '000000') {
                              this.dialogFormVisibleAddView = false
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
        /*----查询定价标签详细信息----*/
         // 新增 按钮
        labelSee(row) {
            this.dialogFormVisibleDetailView = true
            this.labelDetail=row
            this.$nextTick(() => {
                this.$refs['labelRef'].clearValidate()
            })
        }, 
        /*----查询----*/
        // 新增 按钮
        handleDetail(row) {
            this.dialogFormVisibleInfoView = true
            this.customerTagInfo=row
            this.$nextTick(() => {
                this.$refs['customerTagInfoRef'].clearValidate()
            })
        }, 
        /*----修改----*/
        handleUp(row) {
            this.dialogFormVisibleUpView = true
            this.tempUp = Object.assign({}, row)
            this.$nextTick(() => {
                this.$refs['tempUpRef'].clearValidate()
            })
        }, 
        subUpData(){
            if( this.tempUp.custTagExpirationDate < this.tempUp.custTagEffectiveDate){
                this.$message("失效日期不能小于生效日期")
                return;
            }
            this.post('/nonfi/nonfinanceService/BSS.UP.01.0030',  this.tempUp,(res) => {
                
                if (res.returnCode == '000000') {
                        this.dialogFormVisibleUpView = false
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                }
               
            })
        },
    }
}
</script>

<style>
</style>
