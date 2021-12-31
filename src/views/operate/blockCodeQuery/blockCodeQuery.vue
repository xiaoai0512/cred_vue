<!-- 功能管控码 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryTarget" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryTarget.operationMode" class="wd200" clearable  >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode" />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" >
                <el-select v-model="queryTarget.effectivenessCodeType" class="wd200" clearable  >
                    <el-option
                        v-for="(item, index ) in effectivenessCodeTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="管控码范围" prop="effectivenessCodeScope" >
                <el-select v-model="queryTarget.effectivenessCodeScope" class="wd200" clearable  >
                    <el-option
                        v-for="(item, index ) in effectivenessCodeScopeOptions"
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
        <el-table v-loading = "listLoading1"  :data="tablesList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="effectivenessCodeType" label="管控码类别" align="center" />
            <el-table-column prop="effectivenessCodeScene" label="管控码序号" align="center" />
            <el-table-column prop="effectivenessCodeDesc" label="描述" align="center" />
            <el-table-column prop="effectivenessCodeScopeDesc" label="管控范围" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="selBtnFlag">修改</el-button>
               <!-- <el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)" v-show="updBtnFlag">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryTarget.pageNum" :limit.sync="queryTarget.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="管控码新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[{ required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" 
                    :rules="[{ required: true, message: '管控码类别不能为空'}]">
                    <el-select v-model="tempAdd.effectivenessCodeType" class="wd200" >
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
                    <el-input v-model="tempAdd.effectivenessCodeScene" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="管控范围" prop="effectivenessCodeScope" 
                    :rules="[{ required: true, message: '管控范围不能为空'}]">
                    <el-select v-model="tempAdd.effectivenessCodeScope" class="wd200" >
                    <el-option
                        v-for="(item, index ) in effectivenessCodeScopeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="effectivenessCodeDesc"
                    :rules="[{ required: true, message: '描述不能为空'}]" >
                    <el-input v-model="tempAdd.effectivenessCodeDesc" class="wd200" type="text" />
                </el-form-item>
                <div  class="dialog-footer cl_tr text_center">
                    <el-button type="primary" @click="nextStepBtn1()">下一步</el-button>
                </div>
                <!--选择管控项目-->
                <div v-show="addBusPro_part2">
                    <div class="text_title padLf10">选择管控项目</div>
                    <div style="margin-left: 12%;">
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
                <div style="margin-left: 12%;">
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
                <el-button @click="dialogFormVisibleAdd = false"> 取消</el-button>
                <el-button type="primary" @click="createData()">确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="管控码基本信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="controlDetail" fit
                highlight-current-row style="width: 100%;" border>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="controlDetail.operationMode" class="wd200" clearable  disabled>
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" >
                    <el-select v-model="controlDetail.effectivenessCodeType" class="wd200" clearable  disabled>
                        <el-option
                        v-for="(item, index ) in effectivenessCodeTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码序号" prop="effectivenessCodeScene">
                    <el-input v-model="controlDetail.effectivenessCodeScene" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码范围" prop="effectivenessCodeScope">
                    <el-select v-model="controlDetail.effectivenessCodeScope" class="wd200" clearable  disabled>
                        <el-option
                        v-for="(item, index ) in effectivenessCodeScopeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="描述" prop="effectivenessCodeDesc">
                    <el-input v-model="controlDetail.effectivenessCodeDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title">已选管控项目</div>
            <el-table v-loading = "listControlLoading1" :data="tablesControlList1" class="mbtm20"
                fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="controlProjectNo" label="管控项目编号" align="center" />
                <el-table-column prop="controlDesc" label="描述" align="center" />
                <el-table-column prop="controlModeDesc" label="管控模式" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-more" type="primary" @click="handleItemsDetail(row)" 
                           v-if="row.controlMode == 'E'">详情</el-button>
                    </template> 
                </el-table-column>
                </el-table>
                <pagination v-show="controlTableTotal1>0" :total="controlTableTotal1" :page.sync="controlProjectPage.pageNum" :limit.sync="controlProjectPage.pageSize" @pagination="getListDetail" />
                
                <div class="text_title">已选定价标签</div>
                <el-table v-loading = "listControlLoading2" :data="tablesControlList2" class="mbtm20"
                     fit highlight-current-row style="width: 100%;" border>
                    <el-table-column prop="operationMode" label="运营模式" align="center" />
                    <el-table-column prop="controlProjectNo" label="定价标签编号" align="center" />
                    <el-table-column prop="controlDesc" label="描述" align="center" />
                </el-table>
                <pagination v-show="controlTableTotal2>0" :total="controlTableTotal2" :page.sync="controlDetail.pageNum" :limit.sync="controlDetail.pageSize" @pagination="getLabelListDetail" />
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleDetail = false"> 关闭</el-button>
                </div>
        </el-dialog>
        <el-dialog title="关联事件" :visible.sync="dialogFormVisibleEvent" width="65%">
            <el-table v-loading = "listControlLoading3" :data="tablesControlList3" class="mbtm20" 
                    fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="eventDesc" label="事件描述" align="center" />
            </el-table>
            <pagination v-show="controlTableTotal3>0" :total="controlTableTotal3" :page.sync="tablesControlList3Page.pageNum" :limit.sync="tablesControlList3Page.pageSize" @pagination="getEventListDetail" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleEvent = false"> 取消</el-button>
            </div>
        </el-dialog>   
        <!-- 修改 -->
        <el-dialog title="修改管控码信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[{ required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempUp.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" 
                    :rules="[{ required: true, message: '管控码类别不能为空'}]">
                    <el-select v-model="tempUp.effectivenessCodeType" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in effectivenessCodeTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item> <!--{max:2, message: '系统单元编号长度不能超过2个字符'}]"-->
                <el-form-item class="cl_td" label="管控码序号" prop="effectivenessCodeScene"
                    :rules="[ { required: true, message: '管控码序号不能为空'},]">
                    <el-input v-model="tempUp.effectivenessCodeScene" class="wd200" type="text" readonly />
                </el-form-item>
                 <el-form-item class="cl_td" label="管控范围" prop="effectivenessCodeScope" 
                    :rules="[{ required: true, message: '管控范围不能为空'}]">
                    <el-select v-model="tempUp.effectivenessCodeScope" class="wd200" >
                    <el-option
                        v-for="(item, index ) in effectivenessCodeScopeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="effectivenessCodeDesc"
                    :rules="[{ required: true, message: '描述不能为空'}]" >
                    <el-input v-model="tempUp.effectivenessCodeDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="text_title padLf10">关联管控项目</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethod"
                    :titles="['可选择管控项目', '已选择管控项目']"
                    filter-placeholder="请输入管控项目"
                    v-model="busItemList"
                    @change="handleBusComponent"
                    @right-check-change="rightCheckedChange"
                    :data="leftBusData">
                </el-transfer>
            </div>
            <div class="text_title padLf10">关联定价标签</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethodFormat"
                    :titles="['可选择定价标签', '已选择定价标签']"
                    filter-placeholder="请输入业定价标签"
                    v-model="formatList"
                    @change="handleFormatComponent"
                    @right-check-change="rightCheckedFormatChange"
                    :data="leftFormatData">
                </el-transfer>
            </div>
            <!--end-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false"> 取消</el-button>
                <el-button type="primary" @click="updateData()">确定</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'tablesList',
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
        queryTarget: {
          pageNum: 1,
          pageSize:10,
        },
        listLoading1: false,
        queryFormRef: {},
        queryFormRules: {},      
        tablesList: [],
        tableTotal: 0,
       
        // 下拉框
        operationModeOptions: [], 
        effectivenessCodeScopeOptions:[],//管控码范围
        effectivenessCodeTypeOptions:[],//管控码类别
        // 增删改查
        tempAdd: {}, // 新增
        tempUp: {}, // 修改
        controlDetail: {
            pageNum: 1,
            pageSize:10,
        }, 
        controlProjectPage: {
            pageNum: 1,
            pageSize:10,
        },
        
        /*----新增-----*/
        isReadonly1: false,
        isDisabled1: false,
        addBusPro_part1: true,
        addBusPro_part1Btn: true,
        addBusPro_part2: false,
        addBusPro_part2Btn: false,
        addBusPro_part3: false,
        addBusPro_part3Btn: false,

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
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDetail: false,
        dialogFormVisibleEvent:false,//关联事件
        rulesAdd: {},
        rulesDetail: {},
        rulesUp: {},
       
        controlTableTotal1:0,//已选管控项目分页
        controlTableTotal2:0,//已选定价标签分页
        controlTableTotal3:0,
        listControlLoading1: false,//管控项目暂无数据
        listControlLoading2:false,//定价标签暂无数据
        listControlLoading3:false,
        eventDetail:{},
        tablesControlList1:[],
        tablesControlList2:[],
        tablesControlList3:[],
        tablesControlList3Page:{
            pageNum: 1,
            pageSize:10,
        },
        // 修改
        up_listLoading1:false,
        up_proParamsList: [],
        segmentNumberDiv: false,
        busItemList: [],
        rightCheckedBusList:[],
        busProInitData: [],
        leftBusData: [],


        formatList: [],
        rightCheckedFormatList: [],
        formatInitData: [],
        leftFormatData: [],

        feeItemList: [],
        rightCheckedFeeItemtList: [],
        feeItemInitData: [],
        leftFeeItemData: [],
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
    //管控范围
     this.getSelectDict( "dic_effectiveScope").then(res => {
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0023')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0023')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0023')) { // 维护
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
            isTrans: true,
            transParams:['dic_effectiveScope'],
            transDict : ['effectivenessCodeScope']
        }
        this.queryTarget = Object.assign(this.queryTarget, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0023', this.queryTarget ,(res) => {
            if (res.returnCode == '000000') {
                    this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tablesList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tablesList = []
                    this.tableTotal = 0
                }
            } 
        }, (err) => {
      		this.tablesList = []
            this.tableTotal = 0
       		this.listLoading1 = false
        })

    },
    handleSearch() {
        this.queryTarget.pageNum = 1
        this.getList()
    },
    /*-----新增-----*/
   //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
        })
    }, 
    //选择管控项目
    // 下一步
    nextStepBtn1() {
        this.$refs["dataFormAdd"].validate(valid => {
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
      // 判断是否设置默认业务类型
        // if (this.rightCheckedBusType=='' || this.rightCheckedBusType==undefined) {
        //     this.$message({
        //         message: "请设置默认业务类型",
        //         type: "warning"
        //     });
        //     return;
        // }
        this.addBusPro_part2Btn = false;
        this.addBusPro_part3 = true;
        this.addBusPro_part3Btn = true;
        this.add_allBalanceData = this.generateAllBalanceData();
    },
    addBusPro_nextToPart5Btn() {
        this.addBusPro_part1 = false;
        this.addBusPro_part2 = false;
        this.addBusPro_part3 = false;
        // 查询
        this.getBusItemIntaList();
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
    // 2选择业务类型
    add_filterMethod(query, item) {
        return item.controlProjectNo.indexOf(query) > -1;
    },
    // 左侧被选中业务类型
    add_handleAddComponent(value, direction, movedKeys) {
        this.add_busTypeList = value;
    },
    // 右侧被选中业务类型
    add_rightCheckedChange(val,direction,movedKeys) {
        this.rightCheckedBusType = val;
    },
    // 获取管控项目穿梭框左侧数据
    generateAllBusTypeData() {
      const componentData = []; // 相当于data
      const componentNoList = []; //
      const componentList = [];
      this.post("/beta/betaService/COS.IQ.02.0047", {}, res => {
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
      this.post("/beta/betaService/COS.IQ.02.0019", {}, res => {
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
    getBalanceInList() {
      if (this.rightCheckedBalance.length != 1) {
        this.$message({
          message: "请选择1个定价标签",
          type: "warning"
        });
        return;
      }
      this.viewBalIntDialog = true;
      this.balanctInlistLoading = true;
      let obj = {
        isTrans: true,
        transParams: ["dic_businessNature"],
        transDict: ["businessDebitCreditCode"]
      };
        obj.businessProgramNo = this.tempAdd.businessProgramNo;
        obj.operationMode = this.tempAdd.operationMode;
        obj.instanFlag = 1;
        obj.balanceObjectCodelist = [];
        obj.balanceObjectCodelist = this.leftCheckedBalance; // 左侧当前被选中的值

        obj.businessTypeCodeList = []; // 右侧值
        obj.businessTypeCodeList = this.add_busTypeList;
        this.queryBalanceInFormObj = Object.assign(this.queryBalanceInFormObj,obj);
        this.getTableList("/beta/betaService/COS.IQ.02.0047",this.queryBalanceInFormObj,res => {
            if (res.returnCode == "000000") {
                this.balanctInlistLoading = false;
            if (res.returnData &&res.returnData.rows && res.returnData.rows.length > 0) {
                this.balanctInList = res.returnData.rows;
                this.balanctInTotal = res.returnData.totalCount;

                this.objParamFlag = "balanceIns";

                this.add_balanInList = res.returnData.rows[0].busTypeInstanList;
                this.balanceInsObj.pricingTag = this.rightCheckedBalance.join();
                this.balanceObjectCodeInitData.forEach(item => {
                if (
                  this.balanceInsObj.pricingTag == item.pricingTag
                ) {
                  this.balanceInsObj.pricingDesc = item.pricingDesc;
                }
              });

              this.save_proBPInstanObj.balanceObjectInstan = this.balanctInList;
              this.save_proBPInstanObj.pricingTag = this.leftCheckedBalance.join();
              this.balanceObjectCodeInitData.forEach(item => {
                if (
                  this.save_proBPInstanObj.pricingTag ==
                  item.pricingTag
                ) {
                  this.save_proBPInstanObj.pricingDesc = item.pricingDesc;
                }
              });
              this.save_balanceObjectCodeList.push(this.save_proBPInstanObj);
              //console.log(this.save_balanceObjectCodeList);
            }
          }
        }
      );
    },
    //提交
    createData() {
        let list = []//管控项目&&定价标签
        var one = {}
        var two ={}
        one.controlProjectNo=this.rightCheckedBusType[0] 
        one.effectivenessCodeScene= this.tempAdd.effectivenessCodeScene
        one.effectivenessCodeType=this.tempAdd.effectivenessCodeType
        one.operationMode=this.tempAdd.operationMode
        one.projectType= '0'
        list.push(one)//管控项目
        two.controlProjectNo=this.add_balanceList[0] 
        two.effectivenessCodeScene= this.tempAdd.effectivenessCodeScene
        two.effectivenessCodeType=this.tempAdd.effectivenessCodeType
        two.operationMode=this.tempAdd.operationMode
        two.projectType= '1'
        list.push(two) //定价标签
        this.tempAdd.list=list
        this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0023', this.tempAdd, (res) => {
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
    /*-----显示详情弹框-----*/
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.controlDetail = Object.assign({}, row) // 
        this.getListDetail()
        this.getLabelListDetail()
        this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
          })
    },
    //详情已选管控项目列表
    getListDetail(){
        let params = {
            isTrans: true,
            transParams:['dic_controlAndControl'],
            transDict : ['controlMode'],
            pageSize: this.controlProjectPage.pageSize,
            indexNo: this.controlProjectPage.indexNo,
        }
        params =  Object.assign(params, this.controlDetail)
        params.projectType = 0
        this.getTableList('/beta/betaService/COS.IQ.02.0050',  params,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tablesControlList1 = res.returnData.rows
                    this.controlTableTotal1 = res.returnData.totalCount
                    this.listControlLoading1 = false
                }
            }
        })
    },
    //已选管控列表详情弹框
    handleItemsDetail(row){
        this.dialogFormVisibleEvent = true
        //this.tablesControlList3 = Object.assign({}, row) // 
        this.getEventListDetail(row)
        
    },
    //已选管控列表详情
    getEventListDetail(row){
        let obj = {
            controlProjectNo: row.controlProjectNo,
            operationMode: row.operationMode,
        }
       
        obj = Object.assign(obj,this.tablesControlList3Page)
        this.getTableList('/beta/betaService/COS.IQ.02.0048',  obj,(res) => {
            if (res.returnCode == '000000') {
                this.listControlLoading3 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 &&  res.returnData.rows !=[]) {
                    this.tablesControlList3 = res.returnData.rows
                    this.controlTableTotal3 = res.returnData.totalCount
                }  else {
                    this.tablesControlList3 = []
                    this.controlTableTotal3 = 0
                }
            }
        })
    },
    //详情已关联管定价标签
     getLabelListDetail(){
        let params =  Object.assign({}, this.controlDetail)
        params.projectType = 1
        this.getTableList('/beta/betaService/COS.IQ.02.0050',  params,(res) => {
            if (res.returnCode == '000000') {
                this.listControlLoading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tablesControlList2 = res.returnData.rows
                    this.controlTableTotal2 = res.returnData.totalCount
                } else {
                    this.tablesControlList2 = []
                    this.controlTableTotal2 = 0
                }
            }
        })
    },
    /*---------修改-----------*/
    //修改部分
    handleUpdate(row) {
        this.dialogFormVisibleUp = true
        this.up_listLoading1 = true
        this.tempUp = Object.assign({}, row)
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
        // 管控項目
        this.busItemList = this.getRightBusData(row)
        this.leftBusData = this.getLeftBusData(row, this.busItemList)
        //定价标签
        this.formatList = this.getRightFormatData(row)
        this.leftFormatData = this.getLeftFormatData(row, this.formatList)
    }, 
    // 管控项目
    handleBusComponent(value, direction, movedKeys) {
        // this.busItemList = value
        /*console.log(value)
        console.log(this.busItemList)*/
    },
    rightCheckedChange(val) {
        this.rightCheckedBusList = val
    },
    // 获取所有管控项目数据
    generateData() {
        const componentData = [] // 相当于data
        this.post('/beta/betaService/COS.IQ.02.0050', {} ,(res) => {
            this.busProInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.controlProjectNo+' '+item.controlDesc
                item.key = item.controlProjectNo
                componentData.push(item)
            })
        })
        return componentData;  
    },
    filterMethod(query, item) {
        // console.log(item)
        return item.controlProjectNo.indexOf(query) > -1;
    },
    //右侧数据
    getRightBusData(row){
        const rightData = []
        let obj = {
           effectivenessCodeScene: this.tempUp.effectivenessCodeScene,
            effectivenessCodeType: this.tempUp.effectivenessCodeType,
            operationMode: this.tempUp.operationMode,
            projectType: 0
        }
        this.post('/beta/betaService/COS.IQ.02.0050', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                     res.returnData.rows.forEach(rightItem => {
                        rightItem.label = rightItem.controlProjectNo+' '+rightItem.controlDesc
                        rightItem.key = rightItem.controlProjectNo
                        rightData.push(rightItem.controlProjectNo)
                    })
                }
               
            }
        })
        return rightData
    },
    // 左侧数据 arr: 右侧数据，需要过滤掉
    getLeftBusData(row, arr) {
        let componentData = [] // 相当于data
        let leftBusData = []
        this.post('/beta/betaService/COS.IQ.02.0047', {} ,(res) => {
            this.busProInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.controlProjectNo+' '+item.controlDesc
                item.key = item.controlProjectNo
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.busItemList.length; n++) {
                    if (arr[n] == componentData[m].businessProgramNo) {
                        isrep = true
                        break
                    }
                    if(!isrep) {
                        leftBusData.push(componentData[m])
                    }
                } 
            }
        })
        return componentData
    },
    // 定价标签
    handleFormatComponent(value, direction, movedKeys){
        this.formatList = value
        //console.log(this.formatList)
    },
    rightCheckedFormatChange(val) {
        this.rightCheckedFormatList = val
        //console.log(this.rightCheckedFormatList)
    },
    // 获取定价标签穿梭框所有数据
    generateFormatData (row) {
        const componentData = [] // 相当于data
        const componentNoList = [] // 
        const componentList = []
        this.post('/beta/betaService/COS.IQ.02.0019', {operationMode: row.operationMode} ,(res) => {
            if (res.returnCode == '000000') {
                let rows = []
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    rows = res.returnData.rows
                    this.formatInitList = res.returnData.rows
                    rows.forEach((item, i) => {
                        componentList.push(item.pricingTag+' '+item.pricingDesc)
                        componentNoList.push(item.pricingTag)
                    })
                } else {
                    componentNoList = []
                }
            }
           
        })
        return componentData;  
    },
    filterMethodFormat(query, item) {
        return item.pricingTag.indexOf(query) > -1;
    },
    //右侧数据
    getRightFormatData(row) {
        const rightData = []
        let obj = {
            effectivenessCodeScene: this.tempUp.effectivenessCodeScene,
            effectivenessCodeType: this.tempUp.effectivenessCodeType,
            operationMode: this.tempUp.operationMode,
            projectType:1,
        }
        this.post('/beta/betaService/COS.IQ.02.0050', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                    res.returnData.rows.forEach(rightItem => {
                        rightItem.label = rightItem.controlProjectNo+' '+rightItem.controlDesc
                        rightItem.key = rightItem.controlProjectNo
                        rightData.push(rightItem.controlProjectNo)
                    })
                }
            }
        })
        return rightData
    },
    //定价标签左侧
    getLeftFormatData(row, arr) {
        let componentData = [] // 相当于data
        let leftBusData = []
        this.post('/beta/betaService/COS.IQ.02.0019', {} ,(res) => {
            this.formatInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.pricingTag+' '+item.pricingDesc
                item.key = item.pricingTag
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.busItemList.length; n++) {
                    if (arr[n] == componentData[m].pricingTag) {
                        isrep = true
                        break
                    }
                    if(!isrep) {
                        leftBusData.push(componentData[m])
                    }
                } 
            }
        })

        return componentData
    },
    //修改提交
    updateData() {
        let list = []//管控项目   
        var one = {}
        var two ={}
        //关联管控项目    
        this.busItemList.forEach(item => {
            one.controlProjectNo=item 
            one.effectivenessCodeScene= this.tempUp.effectivenessCodeScene
            one.effectivenessCodeType=this.tempUp.effectivenessCodeType
            one.operationMode=this.tempUp.operationMode
            one.projectType= '0'
            list.push(one) 
            one = {}
        })
        //关联定价标签
        this.formatList.forEach(item => {
            two.controlProjectNo=item 
            two.effectivenessCodeScene= this.tempUp.effectivenessCodeScene
            two.effectivenessCodeType=this.tempUp.effectivenessCodeType
            two.operationMode=this.tempUp.operationMode
            two.projectType= '1'
            list.push(two) 
            two = {}
        })
        this.tempUp.list=list
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0023', this.tempUp, (res) => {
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
    }
}
</script>

<style>
/* 穿梭框样式 */
.el-transfer-panel {
    width: 37%;
}
</style>
