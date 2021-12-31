<!-- 分期类型 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="分期类型码" prop="stageTypeCode">
                <el-input v-model="queryFormObj.stageTypeCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="stageTypeCode" label="分期类型码" align="center" />
            <el-table-column prop="transIdentificationCode" label="交易识别码" align="center" />
            <el-table-column prop="stageTypeDesc" label="分期类型描述" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />

        <!-- 新增 -->
        <el-dialog title="分期类型新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <div v-show="part1">
                    <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                        <el-select v-model="tempAdd.operationMode" class="wd200" clearable>
                            <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td red" label="分期类型码" prop="stageTypeCodeHalf"
                        :rules="[ { required: true, message: '分期类型码不能为空'},
                        {max: 4, min: 4 , message: '长度为 4 个字符'}]">
                        <el-select v-model="tempAdd.stageTypeCode" class="wd100" clearable>
                            <el-option
                            v-for="(item, index ) in stageTypeCodeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                        <el-input v-model="tempAdd.stageTypeCodeHalf" class="wd90" type="text" style="margin-left: 10px"/>
                    </el-form-item>
                    <el-form-item class="cl_td red" label="交易识别码" prop="transIdentificationCode"
                    :rules="[ { required: true, message: '交易识别码不能为空'} ]">
                        <el-select v-model="tempAdd.transIdentificationCode" class="wd200" clearable>
                            <el-option
                            v-for="(item, index ) in transIdentificationCodeOptions"
                            :key="index"
                            :label="item.transIdentifiDesc"
                            :value="item.transIdentifiNo"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="分期类型描述" prop="stageTypeDesc"
                    :rules="[ { required: true, message: '分期类型描述不能为空'} ]">
                        <el-input v-model="tempAdd.stageTypeDesc" class="wd200" type="text" />
                    
                    </el-form-item>
                    <el-form-item class="cl_td" label="分期种类" prop="stageType"
                    :rules="[ { required: true, message: '分期种类不能为空'} ]">
                        <el-select v-model="tempAdd.stageType" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in stageTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <div class="cl_tr text_center mtop20" v-show="part1Btn">
                        <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextToPart2Btn()">
                            下一步
                        </el-button>
                    </div>
                </div>

                <div v-show="part2">
                    <el-form-item class="cl_td" label="分期类型码" prop="stageTypeCode">
                        <el-input v-model="stageTypeCodeInfo" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="分期类型描述" prop="stageTypeDesc">
                        <el-input v-model="stageTypeDescInfo" class="wd200" type="text" />
                    </el-form-item>
                    <!-- 分期参数设置 -->
                    <set-param-option
                        :colunm3="up_colunm3"
                        :textTitle="up_textTitle"
                        :list="add_stageInList"
                        @replaceParamClick="replaceParamClick(arguments)"
                        @setParamClick="setParamClick(arguments)"
                    ></set-param-option>
                     <div class="cl_tr text_center mtop20" v-show="part2Btn">
                        <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPart1Btn()">
                            上一步
                        </el-button>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">
                取消
            </el-button>
            <el-button type="primary" @click="createData()">
                确定
            </el-button>
            </div>
        </el-dialog>

        <!-- 详情 查看pcd参数 弹窗-->
        <el-dialog :title="viewPcdTitle" :visible.sync="viewPcd_dialog" width="65%">
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewPcd_dialog = false">
                关闭
                </el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="分期类型详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempDetail.operationMode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期类型码" prop="stageTypeCode"
                :rules="[ { required: true, message: '分期类型码不能为空'}]">
                    <el-input v-model="tempDetail.stageTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td red" label="交易识别码" prop="transIdentificationCode">
                     <el-select v-model="tempDetail.transIdentificationCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in transIdentificationCodeOptions"
                        :key="index"
                        :label="item.transIdentifiDesc"
                        :value="item.transIdentifiNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期类型描述" prop="stageTypeDesc">
                    <el-input v-model="tempDetail.stageTypeDesc" class="wd200" type="text" readonly />
                   
                </el-form-item>
                <el-form-item class="cl_td" label="分期种类" prop="stageType">
                    <el-select v-model="tempDetail.stageType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in stageTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text_title">已关联事件</div>
            <common-table
                :tableData="tableData1"
                :config="config1"
                :tableLabel="tableLabel1"
                @changePage="getEventList(tempDetail)"
            ></common-table>
             <!-- 分期参数设置 -->
            <some-param-option v-if="table9List"
                :textTitle="textTitle9"
                :list="table9List"
                @viewParamClick="hadleViewParam">
            </some-param-option>
            <pagination v-show="table9Total>0" :total="table9Total" :page.sync="table9FormObj.pageNum" :limit.sync="table9FormObj.pageSize" @pagination="getList9(tempDetail)" />  
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>


        <!-- 替换参数 弹窗 -->
        <el-dialog
        title="选择参数选项"
        :visible.sync="replcaeParam_dialog"
        width="65%"
        >
        <replace-param
            :replaceObj="replaceParamObj"
            :replaceIndex="replaceIndex"
            :defalutVal="defalutChoseVal"
            @childByElementVal="childByElementVal"
        ></replace-param>
        <div slot="footer" class="dialog-footer">
            <el-button @click="replcaeParam_dialog = false">
            关闭
            </el-button>
            <el-button type="primary" @click="sureReplaceData()">
            确定
            </el-button>
        </div>
        </el-dialog>

        <!-- 设置参数 弹窗 -->
        <el-dialog :title="setPcdTitle" :visible.sync="setParam_dialog" width="65%">
        <set-pcd
            :setPcdObj="setPcdObj"
            :setIndex="replaceIndex"
            @childBySetVal="childBySetVal"
            @childByDeletPcd="childByDeletPcd"
        ></set-pcd>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setParam_dialog = false">
            关闭
            </el-button>
            <el-button type="primary" @click="sureSetData()">
            确定
            </el-button>
        </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="分期类型修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期类型码" prop="stageTypeCode"
                :rules="[ { required: true, message: '分期类型码不能为空'}]">
                    <el-input v-model="tempUp.stageTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td red" label="交易识别码" prop="transIdentificationCode">
                     <el-select v-model="tempUp.transIdentificationCode" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in transIdentificationCodeOptions"
                        :key="index"
                        :label="item.transIdentifiDesc"
                        :value="item.transIdentifiNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期类型描述" prop="stageTypeDesc">
                    <el-input v-model="tempUp.stageTypeDesc" class="wd200" type="text"  />
                   
                </el-form-item>
                <el-form-item class="cl_td" label="分期种类" prop="stageType">
                    <el-select v-model="tempUp.stageType" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in stageTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text_title">已关联事件</div>
            <common-table
                :tableData="tableData1"
                :config="config1"
                :tableLabel="tableLabel1"
                @changePage="getEventList(tempUp)"
            ></common-table>
            <!-- 分期参数设置 -->
            <set-param-option
            :colunm3="up_colunm3"
            :textTitle="up_textTitle"
            :list="up_stageInList"
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
      btnAuthStr: '',

      // 列表
      queryFormObj: {},
      loading: false,
      queryFormRef: {},
      queryFormRules: {},      
      tableData: [],
      config: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },


      // 下拉框
      operationModeOptions: [], 
      transIdentificationCodeOptions: [],
      stageTypeOptions: [],
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
        textTitle9: '分期参数设置',
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
        add_stageInList: [],
        up_stageInList: [], // 分期参数设置
        up_textTitle: "分期参数设置",
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

        // 新增
        part1: true,
        part1Btn: true,
        part2: false,
        part2Btn: false,
        stageTypeCodeInfo: '',
        stageTypeDescInfo: '',
        // 配置参数
        add_stageInList: [], // 分期参数设置
        add_textTitle: "分期参数设置",
        add_colunm3: false,


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
    // 交易识别码
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0044").then(res => {
        this.transIdentificationCodeOptions = res
    })
    // 分期种类
    this.getSelectDict( "dic_stageType").then(res => {
        this.stageTypeOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0175')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0175')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0175')) { // 维护
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
        this.loading = true
        this.config = Object.assign(this.config, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0175', this.config ,(res) => {
            if (res.returnCode == '000000') {
                this.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    this.tableData = rows
                    this.config.total = res.returnData.totalCount
                }else{
                    this.tableData = []
                    this.config.total = 0
                }
            }
        })

    },
    handleSearch() {
        this.config.pageNum = 1
        this.config.pageSize = 10
        this.getList()
    },

    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
        this.add_stageInList.forEach(item => {
            item.addPcdFlag = '1'
            item.pcdList = item.pcdInitList
            item.instanCode1 = this.stageTypeCodeInfo
            item.operationMode = this.tempAdd.operationMode
        })
        this.tempAdd.instanlist = this.add_stageInList
        this.tempAdd.instanDimen1 = 'INST'
        this.tempAdd.stageTypeCode = this.tempAdd.stageTypeCode + this.tempAdd.stageTypeCodeHalf
        this.tempAdd.stageTypeCode1 = this.tempAdd.stageTypeCode
        this.tempAdd.stageTypeCode2 = this.tempAdd.stageTypeCodeHalf
        delete this.tempAdd.stageTypeCodeHalf
          this.post('/beta/betaService/COS.AD.02.0175', this.tempAdd, (res) => {
              if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                    message: '新增成功',
                    type: 'success',
                    })
                    this.getList()
              }
          })
        }
      })
    },
    getSetList() {
        let obj = {
            instanCode: this.stageTypeCodeInfo,
            instanDimen1: 'INST'
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0042", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_stageInList = res.returnData.rows
                    this.add_stageInList = res.returnData.rows
                } else {
                    this.up_stageInList = []
                    this.add_stageInList = []
                }
            }
        }, (err) => {
      		this.up_stageInList = []
            this.add_stageInList = []
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
                this.stageTypeCodeInfo = this.tempAdd.stageTypeCode+this.tempAdd.stageTypeCodeHalf
                this.stageTypeDescInfo = this.tempAdd.stageTypeDesc
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
        this.stageTypeCodeInfo = ''
        this.stageTypeDescInfo = ''
    }, 
    
    

    // 详情
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.table9FormObj.pageSize = 10
        this.table9FormObj.pageNum = 1 
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
      this.getEventList(row)
      this.getList9(row)
    },
    //已关联事件
    getEventList(row) {
        console.log(row)
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
              this.config1.total = 0;
              this.tableData1 = [];
            }
          }
        }, (err) => {
      		this.config1.total = 0;
            this.tableData1 = [];
            this.config1.loading = false;
        })
    },
    // 分期参数设置
    getList9(row) {
        let obj = { 
            instanCode: row.stageTypeCode,
            operationMode: row.operationMode,
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
                    this.table9List =  []
                     this.table9Total = 0
                }
            } 
        }, (err) => {
      		this.table9List =  []
            this.table9Total = 0
       		this.table9Loading = false
        })
    },
    // 查看参数
    hadleViewParam(row) {
        this.viewPcdTitle = '查看'+row.pcdNo+': '+row.pcdDesc+'参数信息'
        this.viewPcd_dialog = true
        this.viewPcdFormObj = row
    },
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
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
                this.tempUp.artifactInstanList = this.up_stageInList
                this.post('/beta/betaService/COS.UP.02.0175', this.tempUp, (res) => {
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
            instanCode: row.stageTypeCode,
            operationMode: row.operationMode
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_stageInList = res.returnData.rows
                    // this.add_stageInList =  res.returnData.rows
                } else {
                    this.up_stageInList = []
                }
            }
        }, (err) => {
            this.up_stageInList = []
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
        this.$set( this.up_stageInList[this.replaceIndex], "pcdInitList", this.pcdList );
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

    
    
  }
}
</script>

<style>
</style>
