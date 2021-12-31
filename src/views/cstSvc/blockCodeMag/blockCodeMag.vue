<!--特别状况设置-->
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
                <el-button size="medium" icon="el-icon-search" type="primary" @click="nextBtn()">下一步</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset(queryForm)">重置</el-button>
            </div>
        </el-form>
        <!-- 列表1 -->
        <div class="clearboth"></div>
        <div v-if="isNext">
            <div class="text_title">可选特别状况列表</div>
            <el-table v-loading="listLoading1" :data="list1" tooltip-effect="dark" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="选择" width="60px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="templateRadio"
                        @change.native="getTemplateRow(scope.$index,scope.row)" style="margin-left: 10px;">
                        <span class="el-radio__label">&nbsp;</span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状况编号"  prop="eventNo" >
                    <span v-if="list1.eventNo">{{list1.eventNo.substring(list1.eventNo.length-7)}}</span>
                </el-table-column>
                <el-table-column align="center" label="状况描述" prop="eventDesc" />
                <el-table-column align="center" label="管控内容" prop="elementDesc" />
                <el-table-column align="center" label="设置层级" prop="sceneTriggerObjectDesc" />
                <el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="medium" icon="el-icon-edit" type="primary" @click="searchDetail(row)">查询</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<pagination  v-show="total1>0" :total="total1" :page.sync="listPage1.pageNum" :limit.sync="listPage1.pageSize"  @pagination="getList" />-->
        </div>
        <!--列表点击查询弹框-->
        <el-dialog title="新增定价标签" :visible.sync="dialogFormVisibleViewDetail" width='70%'>
            <div class="text_title">管控码关联的管控项目</div>
            <el-table  v-loading="detailLoading1" :data="tempDetailList1" border fit highlight-current-row style="width: 100%;">
                <el-table-column align="center" label="管控项目确定" prop="controlProjectNo" />
                <el-table-column align="center" label="管控描述" prop="controlDesc" />
            </el-table>
            <pagination  v-show="dtailTotal1>0" :total="dtailTotal1" :page.sync="tampDetailPage1.pageNum" :limit.sync="tampDetailPage1.pageSize"  @pagination="getDetailList1" />
            <div class="clearboth"></div>
            <div class="text_title">已选定价标签</div>
            <el-table  v-loading="detailLoading2" :data="tempDetailList2" border fit highlight-current-row style="width: 100%;">
                <el-table-column align="center" label="运营模式" prop="controlProjectNo" />
                <el-table-column align="center" label="定价标签编号" prop="controlDesc" />
                <el-table-column align="center" label="描述" prop="controlProjectNo" />
            </el-table>
            <pagination  v-show="dtailTotal2>0" :total="dtailTotal2" :page.sync="tampDetailPage2.pageNum" :limit.sync="tampDetailPage2.pageSize"  @pagination="getDetailList2" />
            <div slot="footer" class="dialog-footer" style="margin-top: 15px;">
                <el-button type="primary" @click="dialogFormVisibleViewDetail = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--end列表点击查询弹框-->
        <div class="clearboth"></div>
        <div v-if="showCstDiv">
            <div class="text_title">2. 客户信息</div>
             <el-form ref="cstForm1Ref" :model="cstForm1">
                <el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="cstForm1.customerNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="所属机构" prop="institutionId">
                    <el-input v-model="cstForm1.institutionId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-input v-model="cstForm1.operationMode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="客户姓名" prop="customerName">
                    <el-input v-model="cstForm1.customerName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件类型" prop="idType">
                    <el-input v-model="cstForm1.idType" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                    <el-input v-model="cstForm1.idNumber" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center" style="margin-top: 20px;">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="sure()">确定</el-button>
                </div>
            </el-form>
        </div>
        <div class="clearboth"></div>
        <div v-if="showMediaDiv">
            <div class="text_title">2. 选择媒介</div>
            <el-table v-loading="listLoading2" :data="list2" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="选择" width="60px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="templateRadio2"
                        @change.native="getMediumRow(scope.$index,scope.row)" style="margin-left: 10px;">
                        <span class="el-radio__label">&nbsp;</span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="媒介单元代码" prop="mediaUnitCode" />
                <el-table-column align="center" label="产品对象代码" prop="productObjectCode" />
                <el-table-column align="center" label="外部识别号" prop="externalIdentificationNo" />
                <el-table-column align="center" label="主附卡标识" prop="mainSupplyIndicatorDesc" />
                <el-table-column align="center" label="使用者姓名" prop="mediaUserName" />
                <el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="medium" icon="el-icon-edit" type="primary" @click="checkMedia(row)">查询</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination  v-show="total2>0" :total="total2" :page.sync="listPage2.pageNum" :limit.sync="listPage2.pageSize"  @pagination="getRadioList" />
            <div slot="footer" class="col_tr text_center" style="margin-top: 20px;">
                <el-button type="primary"icon="el-icon-check" @click="sure()">确定</el-button>
            </div>
        </div>
        <!--客户媒介详情-->
        <el-dialog title="客户媒介详情" :visible.sync="dialogFormVisibleViewMedium" width='70%'>
            <el-form ref="mediumRef" :model="mediumInfo">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-input v-model="mediumInfo.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介单元代码" prop="mediaUnitCode">
                    <el-input v-model="mediumInfo.mediaUnitCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介对象 " prop="mediaObjectCode">
                    <el-input v-model="mediumInfo.mediaObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品对象代码" prop="productObjectCode">
                    <el-input v-model="mediumInfo.productObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="mediumInfo.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
                    <el-input v-model="mediumInfo.mainCustomerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="副客户代码" prop="subCustomerNo">
                    <el-input v-model="mediumInfo.subCustomerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="所属机构" prop="institutionId">
                    <el-input v-model="mediumInfo.institutionId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="主附标识" prop="mainSupplyIndicator">
                    <el-input v-model="mediumInfo.mainSupplyIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介使用者姓名" prop="mediaUserName">
                    <el-input v-model="mediumInfo.mediaUserName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="进件人员编号 " prop="applicationStaffNo">
                    <el-input v-model="mediumInfo.applicationStaffNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="分行号" prop="branchNumber">
                    <el-input v-model="mediumInfo.branchNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="申请书编号" prop="applicationNumber">
                    <el-input v-model="mediumInfo.applicationNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="营销人员编号" prop="marketerCode">
                    <el-input v-model="mediumInfo.marketerCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="密码函领取标志" prop="pinDispatchMethod">
                    <el-input v-model="mediumInfo.pinDispatchMethod" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介领取标志" prop="mediaDispatchMethod">
                    <el-input v-model="mediumInfo.mediaDispatchMethod" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="状态" prop="statusCodeTans">
                    <el-input v-model="mediumInfo.statusCodeTans" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleViewMedium = false">关闭</el-button>
            </div>
        </el-dialog>
        <div class="clearboth"></div>
        <div v-if="showAcctDiv">
            <div class="text_title">2. 选择账户</div>
            <el-table v-loading="listLoading3" :data="list3" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="选择" width="60px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="templateRadio2"
                        @change.native="getMediumRow(scope.$index,scope.row)" style="margin-left: 10px;">
                        <span class="el-radio__label">&nbsp;</span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账户代码" prop="accountId" />
                <el-table-column align="center" label="币种" prop="currencyDesc" />
                <el-table-column align="center" label="业务类型及描述" prop="externalIdentificationNo" />
                <el-table-column align="center" label="产品对象代码及描述" prop="mainSupplyIndicatorDesc" />
                <el-table-column align="center" label="账户状态" prop="statusCodeDesc" />
                <el-table-column align="center" label="核算状态" prop="accountingStatusCode" />
            </el-table>
            <div slot="footer" class="col_tr text_center" style="margin-top: 20px;">
                <el-button type="primary"icon="el-icon-check" @click="sure()">确认</el-button>
            </div>
           <pagination  v-show="total3>0" :total="total3" :page.sync="listPage3.pageNum" :limit.sync="listPage3.pageSize"  @pagination="getRadioList" />
        </div>
        
        <div class="clearboth"></div>
        <div v-if="showGDiv">
            <div class="text_title">2. 选择业务项目</div>
            <el-table v-loading="listLoading4" :data="list4" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="选择" width="60px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="templateRadio2"
                        @change.native="getMediumRow(scope.$index,scope.row)" style="margin-left: 10px;">
                        <span class="el-radio__label">&nbsp;</span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="业务项目代码" prop="businessProgramNo" />
                <el-table-column align="center" label="业务项目描述" prop="programDesc" />
            </el-table>
           <pagination  v-show="total4>0" :total="total4" :page.sync="listPage4.pageNum" :limit.sync="listPage4.pageSize"  @pagination="getRadioList" />
            <div slot="footer" class="col_tr text_center" style="margin-top: 20px;">
                <el-button type="primary"icon="el-icon-check" @click="sure()">确认</el-button>
            </div>
        </div>
        <div class="clearboth"></div>
        <div v-if="showProDiv">
            <div class="mainname">2. 选择产品</div>
            <el-table v-loading="listLoading5" :data="list5" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="选择" width="60px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="templateRadio2"
                        @change.native="getMediumRow(scope.$index,scope.row)" style="margin-left: 10px;">
                        <span class="el-radio__label">&nbsp;</span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="产品对象代码" prop="productObjectCode" />
                <el-table-column align="center" label="描述" prop="productDesc" />
            </el-table>
           <pagination  v-show="total5>0" :total="total5" :page.sync="listPage5.pageNum" :limit.sync="listPage5.pageSize"  @pagination="getRadioList" />
            <div slot="footer" class="col_tr text_center" style="margin-top: 20px;">
                <el-button type="primary"icon="el-icon-check" @click="sure()">确认</el-button>
            </div>
        </div>
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
            templateRadio: false,
            templateRadio2: false,
            templateSelection : {},
            logininfo: '',
            queryForm: {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            },
            list1: [],
            listLoading1: false,
            total1: 0,
            listPage1: {
                pageNum: 1,
                pageSize: 10
            },
            showDiv: false, // 结息交易列表
            cstInf: {},
            cstInfRef: {},
            listLoading: true,
            list: null, // 列表
            //点击单选初始化
            cstForm1: {},//2. 客户信息
            list2: [],////媒介
            listLoading2: false,      
            total2: 0,
            listPage2:{
                pageNum: 1,
                pageSize: 10
            },
            list3: [],//业务类型级
            listLoading3: false,      
            total3: 0,
            listPage3:{
                pageNum: 1,
                pageSize: 10
            },
            list4: [],//业务项目
            listLoading4: false,      
            total4: 0,
            listPage4:{
                pageNum: 1,
                pageSize: 10
            },
            list5: [],//产品
            listLoading5: false,      
            total5: 0,
            listPage5:{
                pageNum: 1,
                pageSize: 10
            },
            isNext: false,
            showCstDiv: false,
            showMediaDiv: false,
            showAcctDiv: false,
            showGDiv: false,
            showProDiv: false,
            //客户媒介详情
            mediumInfo: [],
            mediumRef: {},
            dialogFormVisibleViewMedium: false,  
            //查询
            dialogFormVisibleViewDetail: false,
            tempDetailList1:[],
            detailLoading1: false,
            dtailTotal1: 0,
            tampDetailPage1:{
                pageNum: 1,
                pageSize: 10
            },
            tempDetailList2:[],
            detailLoading2: false,
            dtailTotal2: 0,
            tampDetailPage2:{
                pageNum: 1,
                pageSize: 10
            },
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
//          //新增
//          dialogFormVisibleAddView: false,
//          tempAddInfo1: {},
//          tempAddRef1: {},
//          tempAddInfo2: {},
//          tempAddRef2: {},
//          addlistLoading1: false,
//          tampAddList1: [],
//          addTotal1: 0,
//          tampAddPage1:{
//              pageNum: 1,
//              pageSize: 10
//          },
//          addlistLoading2: false,
//          tampAddList2: [],
//          addTotal2: 0,
//          tampAddPage2:{
//              pageNum: 1,
//              pageSize: 10
//          },
//          tempAddObjInfo2: {
//              custTagEffectiveDate: '',//生效日期
//              custTagExpirationDate: '', //失效日期
//          },
//          newPricingLevelCode: '',
//          mewForm: {},
//          addlistLoading: false,
//          addTotal: 0,
//          tampAddList: [],
//          tampAddPage: { // 结息交易表对象
//              pageNum: 1,
//              pageSize: 10
//          },
//          //查看定价标签详细信息
//          labelDetail: {},
//          labelRef: {},
//          dialogFormVisibleDetailView: false,
//          //修改
//          dialogFormVisibleUpView: false,
//          tempUpRef: {},
//          tempUp: {},
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
    },
    methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                pageNum: 1,
                pageSize: 10
            }
            this.showDiv = false // 结息交易列表
            this.showTransUint = false // 交易单元计息明细 三级表格
        },
        // 重置
        reset() {
          this.init()
        },
        // 点击下一步按钮
        nextBtn() {
            if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                this.$message({
                  message: '请输入查询信息',
                  type: 'warning'
                })
                this.isNext = false
                this.isExitFun()
            } else {
                if (this.queryForm.idType) {
                    if (!this.queryForm.idNumber) {
                        this.$message({
                        message: '请输入证件号码',
                        type: 'warning'
                    })
                    this.showCstDiv = false;
                    this.showMediaDiv = false;
                    this.showAcctDiv = false;
                    this.showProDiv = false;
                    this.showGDiv = false;
                    this.isNext = false;
                } else {
                    this.isExitFun()
                }
            } else if (this.queryForm.idNumber) {
                if (!this.queryForm.idType) {
                    this.$message({
                      message: '请输入证件类型',
                      type: 'warning'
                    })
                    this.showCstDiv = false;
                    this.showMediaDiv = false;
                    this.showAcctDiv = false;
                    this.showProDiv = false;
                    this.showGDiv = false;
                    this.isNext = false;
                } else {
                    this.isExitFun()
                }
            }else {
                    this.isExitFun()
                }
            }
        },
        //判断客户是否存在，点击下一步，展示 可选特别状况列表
        isExitFun() {
            let params = {
                idType: this.queryForm.idType,
                idNumber: this.queryForm.idNumber,
                externalIdentificationNo: this.queryForm.externalIdentificationNo,
            };
            this.post('/nonfi//nonfinanceService/BSS.IQ.01.0001', params,(res) => {
                if(res.returnMsg == 'OK') {
                    this.isNext = true;
                    this.showCstDiv = false;
                    this.showMediaDiv = false;
                    this.showAcctDiv = false;
                    this.showProDiv = false;
                    this.showGDiv = false;
                    this.getList();
                    
                }else{
                    this.isNext = false;
                    this.showCstDiv = false;
                    this.showMediaDiv = false;
                    this.showAcctDiv = false;
                    this.showProDiv = false;
                    this.showGDiv = false; //业务项目
                }
            })
        },
        getList (){
            this.listLoading1 = true
            let params = {
                operationMode: this.logininfo.operationMode,
                queryType: "E",
                isTrans: true, //是否需要翻译数据字典
                transParams: ['dic_scenarioTriggerType'], //查找数据字典所需参数
                transDict: ['sceneTriggerObject'], //翻译前后key
            }
            this.getTableList('/beta/betaService/COS.IQ.02.0085', params, (res) => {
                this.listLoading1 = false
                if(res.returnCode == '000000') {
                    this.list1 = res.returnData.rows
                }
            })
        },
        // 查询显示弹框
        searchDetail(row) {
            this.dialogFormVisibleViewDetail = true
            this.getDetailList1(row)
            this.getDetailList2(row)
        }, 
        getDetailList1(item){
            this.detailLoading1 = true    
            let objData1={
                effectivenessCodeScene: item.effectivenessCodeScene,
                effectivenessCodeType: item.effectivenessCodeType,
                projectType: '0',
            }
            objData1 = Object.assign(this.tampDetailPage1, objData1)
            this.post('/beta/betaService/COS.IQ.02.0050', objData1, (res) => {
                this.detailLoading1 = false    
                if(res.returnCode == '000000') {
                    this.tempDetailList1 = res.returnData.rows
                    this.dtailTotal1 = res.returnData.totalCount
                }
            })
        },
        getDetailList2(item){
            this.detailLoading2 = true    
            let objData2={
                effectivenessCodeScene: item.effectivenessCodeScene,
                effectivenessCodeType: item.effectivenessCodeType,
                projectType: '1',
            }
            objData2 = Object.assign(this.tampDetailPage2, objData2)
            this.post('/beta/betaService/COS.IQ.02.0050', objData2, (res) => {
                this.detailLoading2 = false    
                if(res.returnCode == '000000') {
                    this.tempDetailList2 = res.returnData.rows
                    this.dtailTotal2 = res.returnData.totalCount
                }
            })
        },
        //获取单循数据
        getTemplateRow(index,row){                               
            this.templateSelection = row;
            this.getRadioList()
        },
        //点击可选特别状况列表，单选2. 选择媒介列表
        getRadioList(){
            let objDta3 = {
                externalIdentificationNo: this.queryForm.externalIdentificationNo,
                idType: this.queryForm.idType,
                idNumber: this.queryForm.idNumber,
            }
            if(this.templateSelection.sceneTriggerObject=='C'){
                this.showCstDiv = true
                this.showMediaDiv = false;
                this.showAcctDiv = false;
                this.showProDiv = false;
                this.showGDiv = false; 
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', objDta3, (res) => {
                    this.listLoading2 = false    
                    if(res.returnCode == '000000') {
                        this.cstForm1 = res.returnData
                        
                    }
                })
            }else if(this.templateSelection.sceneTriggerObject=='M'){//媒介
                this.listLoading2 = true  
                this.showMediaDiv = true;
                this.showCstDiv = false
                this.showAcctDiv = false;
                this.showProDiv = false;
                this.showGDiv = false; 
                objDta3.sceneTriggerObject= 'M',
                objDta3 = Object.assign(this.listPage2, objDta3)
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0013', objDta3, (res) => {
                    this.listLoading2 = false    
                    if(res.returnCode == '000000') {
                        this.list2 = res.returnData.listcoreMediaBasicInfo
                        this.total2 = res.returnData.totalCount
                    }
                })
            }else if(this.templateSelection.sceneTriggerObject=='A'){//业务类型级
                this.listLoading3 = true
                this.showAcctDiv = true
                this.showMediaDiv = false;
                this.showCstDiv = false
                this.showProDiv = false;
                this.showGDiv = false; 
                objDta3 = Object.assign(this.listPage3, objDta3)
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0003', objDta3, (res) => {
                    this.listLoading3 = false    
                    if(res.returnCode == '000000') {
                        this.list3 = res.returnData.listcoreMediaBasicInfo
                        this.total3 = res.returnData.totalCount
                    }
                })
            }else if (this.templateSelection.sceneTriggerObject=="P") { //P-产品showProDiv  
                this.listLoading5 = true    
                this.showProDiv = true
                this.showAcctDiv = false
                this.showMediaDiv = false;
                this.showCstDiv = false
                this.showGDiv = false;
                objDta3.sceneTriggerObject= 'P',
                objDta3 = Object.assign(this.listPage5, objDta3)
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0012', objDta3, (res) => {
                    this.listLoading5 = false    
                    if(res.returnCode == '000000') {
                        this.list5 = res.returnData.listX5120VOs
                        this.total5 = res.returnData.totalCount
                    }
                })
            }else if (this.templateSelection.sceneTriggerObject=="G") { //G-业务项目  
                this.listLoading4 = true   
                this.showGDiv = true
                this.showProDiv = false
                this.showAcctDiv = false
                this.showMediaDiv = false;
                this.showCstDiv = false
                objDta3 = Object.assign(this.listPage4, objDta3)
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0020', objDta3, (res) => {
                    this.listLoading4 = false    
                    if(res.returnCode == '000000') {
                        this.list4 = res.returnData.rows
                        this.total4 = res.returnData.totalCount
                        console.log(this.total4)
                    }
                })
            }
        },
        //点击单选媒介
        getMediumRow(index,row){
           this.mediumSelection = row;
        },
        checkMedia(row){
           this.dialogFormVisibleViewMedium = true 
           this.mediumInfo = row
        },
        sure(){
            if(this.mediumSelection=='' || this.mediumSelection== undefined){
                this.$message('请选择事件');
                return;
            }
            let objData4 = {
                spEventNo: this.mediumSelection.eventNo,
                externalIdentificationNo: this.mediumSelection.externalIdentificationNo,
                idType: this.mediumSelection.idType,
                idNumber: this.mediumSelection.idNumber,
            }
            if(this.templateSelection.sceneTriggerObject == 'C'){
                objData4.levelCode = this.mediumSelection.customerNo;
                objData4.customerNo = this.mediumSelectioncstInfoList.customerNo;
                objData4.operationMode = this.mediumSelection.operationMode;
                objData4.sceneTriggerObject = 'C'
            }
            if (this.templateSelection.sceneTriggerObject  == 'A') { //账户
                if (!this.mediumSelection) {
                    this.$message('请选择账户');
                    return;
                }
                objData4.levelCode = this.mediumSelection.businessTypeCode;
                objData4.currencyCode = this.mediumSelection.currencyCode;
                objData4.operationMode = this.mediumSelection.operationMode;
                objData4.customerNo = this.mediumSelection.customerNo;
                objData4.sceneTriggerObject = this.mediumSelection.sceneTriggerObject;
                objData4.sceneTriggerObject = 'A'
            }
            if (this.templateSelection.sceneTriggerObject  == 'G') { //G业务项目
                if (!this.mediumSelection) {
                    this.$message('请选择业务项目');
                    return;
                }
                objData4.levelCode = this.mediumSelection.businessProgramNo;
                objData4.operationMode = this.mediumSelection.operationMode;
                objData4.customerNo = this.mediumSelection.customerNo;
                objData4.sceneTriggerObject = this.mediumSelection.sceneTriggerObject;
                objData4.sceneTriggerObject = 'G'
            }
            if (this.templateSelection.sceneTriggerObject  == 'M') { //媒介
                if (!this.mediumSelection) {
                    this.$message('请选择媒介');
                    return;
                }
                objData4.levelCode = this.mediumSelection.mediaUnitCode;
                objData4.operationMode = this.mediumSelection.operationMode;
                objData4.customerNo = this.mediumSelection.mainCustomerNo;
                objData4.sceneTriggerObject = this.mediumSelection.sceneTriggerObject;
                objData4.currencyCode = "";
                objData4.sceneTriggerObject = 'M'
            }
            if (this.templateSelection.sceneTriggerObject  == 'P') { //产品
                if (!this.mediumSelection) {
                    this.$message('请选择产品');
                    return;
                }
                objData4.levelCode = $scope.mediumSelection.productObjectCode;
                objData4.operationMode = $scope.mediumSelection.operationMode;
                objData4.customerNo = $scope.mediumSelection.customerNo;
                objData4.sceneTriggerObject = this.mediumSelection.sceneTriggerObject;
                objData4.currencyCode = "";
                objData4.sceneTriggerObject = 'P'
            }
            this.post('/nonfi/nonfinanceService/customerEffectiveUpdate', objData4, (res) => {
                if(res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '设置成功',
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
