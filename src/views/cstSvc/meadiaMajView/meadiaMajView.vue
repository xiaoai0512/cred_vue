<!-- 客户媒介视图 -->
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
            <div class="text_title">媒介信息</div>
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
                <el-table-column width="80">
                    <template slot-scope="scope">
                    <el-radio v-model="curRowRadio" :label="scope.row.mediaUnitCode">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center"/>

                <el-table-column prop="mediaUnitCode" label="媒介单元代码" align="center"/>
                <el-table-column prop="productObjectCode" label="产品代码及描述" align="center" >
                    <template slot-scope="{row}">
                        {{row.productObjectCode}}
                        {{row.productDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center"  />
                <el-table-column prop="mediaUserName" label="媒介使用者姓名" align="center" />
                <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />

                <el-table-column prop="" label="操作" align="center" width = "220">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" icon="el-icon-more"
                            @click="handle1(row)">详情</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                            @click="handle2(row)">修改</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />

            <!-- 媒介信息详情 -->
            <div v-show="showMedaiInfoDiv">
                <div class="text_title">媒介详情</div>
                <media-info
                    :formObj="medaiInfoObj"
                ></media-info>

                <div class="text_title">媒介绑定信息</div>
                <el-table
                    v-loading = "bind_config.loading"
                    :data="bind_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                    @current-change="bind_handleCurrRowChange"
                    @row-click="bind_chooseCurrRow"
                >
                    <el-table-column width="80">
                        <template slot-scope="scope">
                        <el-radio v-model="bind_curRowRadio" :label="scope.row.mediaUnitCode">
                            <span class="el-radio__label"></span>
                        </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mediaUnitCode" label="媒介单元代码" align="center"/>
                    <el-table-column prop="serialNo" label="序列号" align="center"/>
                    <el-table-column prop="bindId" label="绑定识别号" align="center" />
                    <el-table-column prop="mediaObjectCode" label="媒介对象代码" align="center"  />
                    <el-table-column prop="bindDate" label="绑定日期" align="center" />
                    <el-table-column prop="unbindDate" label="解绑日期" align="center" />
                </el-table>
                <pagination v-show="bind_config.total>0" :total="bind_config.total" :page.sync="bind_config.pageNum" :limit.sync="bind_config.pageSize" @pagination="getList2" />


                <div class="text_title">支付标记化信息</div>
                <el-table
                    v-loading = "pay_config.loading"
                    :data="pay_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center"/>
                    <el-table-column prop="mediaUnitCode" label="媒介单元代码" align="center"/>
                    <el-table-column prop="productObjectCode" label="产品代码及描述" align="center" >
                        <template slot-scope="{row}">
                            {{row.productObjectCode}}
                            {{row.productDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center"  />
                    <el-table-column prop="mediaUserName" label="媒介使用者姓名" align="center" />
                    <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />
                    <el-table-column prop="invalidReason" label="失效原因" align="center" />
                </el-table>
                <pagination v-show="pay_config.total>0" :total="pay_config.total" :page.sync="pay_config.pageNum" :limit.sync="pay_config.pageSize" @pagination="getList3" />
            </div>
        </div>

        <!-- 媒介修改弹窗 -->
        <el-dialog title="媒介信息修改" :visible.sync="mediaUp_dialog" width="85%">
            <el-form ref="upRef" :model="tempUp" :rules="upRules">
                <el-form-item class="cl_td" label="媒介单元代码" prop="mediaUnitCode" >
                    <el-input v-model="tempUp.mediaUnitCode" class="wd200" type="text" readonly />
               </el-form-item>
               <el-form-item class="cl_td" label="媒介对象代码" prop="mediaObjectCodeTrans" >
                     <el-input v-model="tempUp.mediaObjectCodeTrans" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="产品对象代码" prop="productObjectCodeTrans">
                    <el-input v-model="tempUp.productObjectCodeTrans" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                     <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="主附标识" prop="mainSupplyIndicator">
                    <el-select v-model="tempUp.mainSupplyIndicator" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in mainSupplyIndicatorOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介使用者姓名" prop="mediaUserName" >
                     <el-input v-model="tempUp.mediaUserName" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
                    <el-input v-model="tempUp.mainCustomerNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="副客户代码" prop="mediaHolderNo" >
                     <el-input v-model="tempUp.mediaHolderNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="所属机构" prop="institutionId">
                    <el-select v-model="tempUp.institutionId" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in institutionIdOptions" 
                            :key="index" 
                            :label="item.organName" 
                            :value="item.organNo" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempUp.operationMode" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="有效期" prop="expirationDate" :rules="[ { required: true, message: '有效期不能为空'}]">
                    <el-input v-model="tempUp.expirationDate" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="上一有效期" prop="previousExpirationDate" >
                    <el-date-picker
                    v-model="tempUp.previousExpirationDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :clearable="true"
                    disabled
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="新建日期" prop="createDate">
                    <el-input v-model="tempUp.createDate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="刻印名" prop="embosserName1" :rules="[ { required: true, message: '刻印名不能为空'}]">
                     <el-input v-model="tempUp.embosserName1" class="wd200" type="text" @input="changeUpWord"/>
                </el-form-item>
                <el-form-item class="cl_td" label="进件人员编号" prop="applicationStaffNo">
                    <el-input v-model="tempUp.applicationStaffNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="分行号" prop="branchNumber" :rules="[ { required: true, message: '分行号不能为空'}]">
                     <el-input v-model="tempUp.branchNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="申请书编号" prop="applicationNumber">
                    <el-input v-model="tempUp.applicationNumber" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="营销人员编号" prop="marketerCode" >
                     <el-input v-model="tempUp.marketerCode" class="wd200" type="text" readonly />
                </el-form-item>
                <div v-show='methodShow'>
                    <el-form-item class="cl_td" label="密码函领取标志" prop="pinDispatchMethod" :rules="[ { required: methodShow, message: '密码函领取标志不能为空'}]">
                        <el-select v-model="tempUp.pinDispatchMethod" class="wd200">
                            <el-option 
                                v-for="(item, index) in pinDispatchMethodOptions" 
                                :key="index" 
                                :label="item.detailDesc" 
                                :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="媒介领取标志" prop="mediaDispatchMethod" :rules="[ { required: methodShow, message: '媒介领取标志不能为空'}]">
                        <el-select v-model="tempUp.mediaDispatchMethod" class="wd200">
                            <el-option 
                                v-for="(item, index) in mediaDispatchMethodOptions" 
                                :key="index" 
                                :label="item.detailDesc" 
                                :value="item.codes"
                            />
                        </el-select> 
                    </el-form-item>
                    <el-form-item class="cl_td" label="卡片寄送地址" prop="addressType" :rules="[ { required: methodShow, message: '卡片寄送地址不能为空'}]">
                        <el-select v-model="tempUp.addressType" class="wd200">
                            <el-option 
                                v-for="(item, index) in addressTypeOptions" 
                                :key="index" 
                                :label="item.detailDesc" 
                                :value="item.codes"
                            />
                        </el-select> 
                    </el-form-item>
                </div>
                <el-form-item class="cl_td" label="激活标识" prop="activationFlag">
                    <el-select v-model="tempUp.activationFlag" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in activationFlagOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"
                        />
                    </el-select> 
                </el-form-item>
                <el-form-item class="cl_td" label="激活方式" prop="activationFlag" >
                    <el-select v-model="tempUp.activationFlag" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in activationModeOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"
                        />
                    </el-select> 
                </el-form-item>
                <el-form-item class="cl_td" label="激活时间" prop="activationDate">
                    <el-input v-model="tempUp.activationDate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="年费日期" prop="annualFeeDate" >
                     <el-input v-model="tempUp.annualFeeDate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="免首年年费日期" prop="waiveFirstAnnualFeeDate">
                    <el-input v-model="tempUp.waiveFirstAnnualFeeDate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="上一年费收取周期号" prop="lastAnnualFeeCycleNo" >
                     <el-input v-model="tempUp.lastAnnualFeeCycleNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td red" label="是否有效标识" prop="invalidFlag">
                    <el-select v-model="tempUp.invalidFlag" class="wd200" @change="invalidFlagChange($event)">
                        <el-option 
                            v-for="(item, index) in invalidFlagOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"
                        />
                    </el-select> 
                </el-form-item>
                <el-form-item class="cl_td" label="失效原因" prop="invalidReason" v-show="invalidF" :rules="[ { required: invalidF, message: '失效原因不能为空'}]">
                    <el-select v-model="tempUp.invalidReason" class="wd200" clearable placeholder="请选择" >
                        <el-option 
                            v-for="(item, index) in invalidReasonOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"
                        />
                    </el-select> 
                </el-form-item>
                <el-form-item class="cl_td" label="制卡请求" prop="productionCode" >
                    <el-select v-model="tempUp.productionCode" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in productionCodeOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="制卡请求日期" prop="productionDate" >
                    <el-input v-model="tempUp.productionDate" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="mediaUp_dialog = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="updateData">
                    确定
                </el-button>
            </div>  
        </el-dialog>

    </div>
</template>
  
<script>
  import Pagination from '@/components/Pagination'
  import MediaInfo from '@/components-ider/cstSvc/MediaInfo'
  import { uppercaseAllWord } from '@/filters/index'

  export default {
    name: 'meadiaMajView',
    components: {
      Pagination,
      MediaInfo
    },
    data() {
      return {
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
        methodShow:false,
        invalidF:false,
        mainSupplyIndicatorOptions: [],// 主附标识
        institutionIdOptions: [], // 所属机构
        operationModeOptions: [], // 运营模式
        pinDispatchMethodOptions: [], // 密码函领取标志
        mediaDispatchMethodOptions: [], // 媒介领取标志
        activationFlagOptions: [], // 激活标识
        activationModeOptions: [], // 激活方式
        invalidFlagOptions: [], // 是否有效标识
        invalidReasonOptions: [], // 失效原因
        productionCodeOptions: [], // *制卡请求
        baseInfoObj: {},
        mediaInit:{},
        // 媒介信息
        showMedaiInfoDiv: false,
        medaiInfoObj: {},

        // 绑定新
        bind_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        bind_tableData: [],
        bind_curRowRadio: '',
        bind_curRow: {},
        // 支付标记化信息
        pay_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        pay_tableData: [],

        // 媒介修改弹窗
        mediaUp_dialog: false,
        tempUp: {},
        upRules: {},
        upRef: {},
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
        // 所属机构
        this.getSelectDict('/beta/betaService/COS.IQ.02.0005').then((res) => {
        this.institutionIdOptions = res
        })
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        // 密码函领取标志 
        this.getSelectDict( "dic_isYorN").then(res => {
            this.pinDispatchMethodOptions = res
            this.mediaDispatchMethodOptions = res
        })
        // 激活标识
        this.getSelectDict( "dic_activationFlag").then(res => {
            this.activationFlagOptions = res
        })
        // 激活方式
        this.getSelectDict( "dic_activationMode").then(res => {
            this.activationModeOptions = res
        })
        // 是否有效标识
        this.getSelectDict( "dic_invalidFlagYN").then(res => {
            this.invalidFlagOptions = res
        })
        // 失效原因
        this.getSelectDict( "dic_invalidReasonTable").then(res => {
            this.invalidReasonOptions = res
        })
        // 制卡请求
        this.getSelectDict( "dic_productionCode").then(res => {
            this.productionCodeOptions = res
        })
        // 地址类型
        this.getSelectDict("dic_addressType").then((res) => {
            this.addressTypeOptions = res
        })
    },
    methods: {
        // 刻印名 大写
        changeUpWord(val) {
            this.tempUp.embosserName1 = uppercaseAllWord (val)
        },
        invalidFlagChange(val){
            if(val == 'N'){
                this.invalidF = true
            }else{
                this.invalidF = false
            }
        },
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showTable = false
            this.tableData = []
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
            isTrans: true,
            transParams: ['dic_mainCharacterCardTable', 'dic_invalidFlagYN'],
            transDict: ['mainSupplyIndicator', 'invalidFlag'],
        }
        params = Object.assign(params , this.config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0017', params, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                    this.config.total = 0
                }
            }
        })
      },
      //  媒介绑定信息
      getList2(row) {
        this.bind_config.loading = true
        let params = {
            mediaUnitCode: row.mediaUnitCode,
            externalIdentificationNo: row.externalIdentificationNo
        }
        params = Object.assign(params , this.bind_config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.OP.01.0017', params, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.bind_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.bind_tableData = res.returnData.rows
                    this.bind_config.total = res.returnData.totalCount
                } else {
                    this.bind_tableData = []
                    this.bind_config.total = 0
                }
            }
        })
      },
      // 支付标记化信息
      getList3(row) {
        this.pay_config.loading = true
        let params = {
            flag: '4',
            mediaUnitCode: row.mediaUnitCode,
            externalIdentificationNo: row.externalIdentificationNo,
            isTrans: true,
            transParams: ['dic_mainCharacterCardTable', 'dic_invalidFlagYN'],
            transDict: ['mainSupplyIndicator', 'invalidFlag'],
        }
        params = Object.assign(params , this.pay_config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0017', params, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.pay_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.pay_tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.pay_tableData = []
                    this.pay_config.total = 0
                }
            }
        })
     },
      // 获取客户基本信息
      getCustBaseInfo () {
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryForm, (res) => {
            if (res.returnCode == '000000') {
                this.baseInfoObj.idNumber = res.returnData.idNumber
                this.baseInfoObj.idType = res.returnData.idType
                this.baseInfoObj.customerName = res.returnData.customerName
                this.getList()
            }
        })
      },
        // 单选 当前行
        handleCurrRowChange(row) {
            this.curRow = row
            this.curRowRadio = row.mediaUnitCode
        },
        chooseCurrRow(row) {
            this.curRow = row
            this.curRowRadio = row.mediaUnitCode
        },
        // 查询媒介
        handle1(row) {
            this.showMedaiInfoDiv = true
            this.medaiInfoObj = Object.assign({}, row)
            this.medaiInfoObj.mediaObjectCodeTrans = this.medaiInfoObj.mediaObjectCode + this.medaiInfoObj.mediaObjectDesc
            this.medaiInfoObj.productObjectCodeTrans = this.medaiInfoObj.productObjectCode + this.medaiInfoObj.productDesc
            this.getList2(row) // 媒介绑定信息
            this.getList3(row) // 支付标记化信息

        },
        // 媒介绑定信息 选中当前
        bind_handleCurrRowChange(val) {
            this.bind_curRowRadio = val.mediaUnitCode
            this.bind_curRow = val
        },
        bind_chooseCurrRow(val) {
            this.bind_curRowRadio = val.mediaUnitCode
            this.bind_curRow = val
        },
        // 媒介修改
        handle2(row) {
            console.log(row)
            this.methodShow = false;
            this.mediaInit.embosserNameInit = row.embosserName1
            this.mediaInit.expirationDateInit = row.expirationDate
            this.mediaUp_dialog = true
            this.tempUp = Object.assign({}, row)
            this.tempUp.mediaObjectCodeTrans = this.tempUp.mediaObjectCode + this.tempUp.mediaObjectDesc
            this.tempUp.productObjectCodeTrans = this.tempUp.productObjectCode + this.tempUp.productDesc

        },
        // 确定 修改
        updateData() {
            this.$refs['upRef'].validate((valid) => {
                if (valid) {
                    if(this.mediaInit.embosserNameInit != this.tempUp.embosserName1 || this.mediaInit.expirationDateInit != this.tempUp.expirationDate){
                        this.$message('您已修改有效期或者刻印名需要重新制卡，请选择媒介领取标志和密码函领取标志并确定卡片邮寄地址进行重新制卡！');//
                        this.methodShow = true;
                        if((this.tempUp.pinDispatchMethod == null || this.tempUp.pinDispatchMethod == undefined || this.tempUp.pinDispatchMethod == '') && 
                        (this.tempUp.mediaDispatchMethod == null || this.tempUp.mediaDispatchMethod == undefined || this.tempUp.mediaDispatchMethod == '') && 
                        (this.tempUp.addressType == null || this.tempUp.addressType == undefined || this.tempUp.addressType == ''))
                        return;
                    }
                    this.post('/nonfi/nonfinanceService/BSS.UP.01.0011', this.tempUp, (res) => {
                        if (res.returnCode == '000000') {
                             this.mediaUp_dialog = false
                            this.$notify({
                                message: '维护成功',
                                type: 'success',
                            }) 
                            this.handleSearch()
                            this.tempUp = {}
                            this.methodShow = false;
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
  