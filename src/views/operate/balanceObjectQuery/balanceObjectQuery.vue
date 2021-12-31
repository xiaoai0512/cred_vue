<!-- 余额对象 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="余额对象代码" prop="balanceObjectCode">
                <el-input v-model="queryFormObj.balanceObjectCode" class="wd200" type="text" />
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
            <el-table-column prop="" label="余额对象代码及描述" align="center" width="350">
                <template slot-scope="{row}">
                    <span class="tdDivL">{{row.balanceObjectCode}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <span class="tdDivR">{{row.objectDesc}}</span>
                </template> 
            </el-table-column>
            <el-table-column prop="objectTypeDesc" label="余额类型" align="center" width="50"/>
            <el-table-column prop="paymentPriority" label="还款优先级" align="center" />
            <el-table-column prop="beginDate" label="开始日期" align="center" />
            <el-table-column prop="endDate" label="结束日期" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />


        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
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
                <el-form-item class="cl_td" label="余额对象" prop="balanceObjectCodeHalf"
                :rules="[ { required: true, message: '余额对象不能为空'},{max: 5, min: 5 , message: '长度为 5 个字符'}]">
                    MODB <el-input v-model="tempAdd.balanceObjectCodeHalf" class="wd100" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="objectDesc"
                :rules="[ { required: true, message: '描述不能为空'}]">
                <el-input v-model="tempAdd.objectDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="余额类型" prop="objectType"
                :rules="[ { required: true, message: '余额类型不能为空'}]">
                    <el-select v-model="tempAdd.objectType" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in objectTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="利息入账余额对象" prop="interestPostingBalanceObject"
                :rules="[ { required: true, message: '利息余额对象不能为空'}]">
                    <el-select v-model="tempAdd.interestPostingBalanceObject" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in interestPostingBalanceObjectOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority"> <!-- @focus="chosePriorityBtn" -->
                    <el-input v-model="tempAdd.paymentPriority" class="wd120" type="text" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="chosePriorityBtn()" >
                            查询
                        </el-button>
                    </div>
                    </el-form-item>
               <el-form-item class="cl_td" label="开始日期" prop="beginDate" >
                    <el-date-picker
                        v-model="tempAdd.beginDate"
                        type="date"
                        placeholder="选择开始日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptionsStart"
                        @change="startTimeStatus">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="结束日期" prop="endDate" >
                    <el-date-picker
                        v-model="tempAdd.endDate"
                        type="date"
                        placeholder="选择结束日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptionsEnd"
                        @change="endTimeStatus">
                    </el-date-picker>
                </el-form-item>
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
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
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
                <el-form-item class="cl_td" label="余额对象" prop="balanceObjectCode"
                :rules="[ { required: true, message: '余额对象不能为空'}]">
                    <el-input v-model="tempDetail.balanceObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="objectDesc"
                :rules="[ { required: true, message: '描述不能为空'}]">
                <el-input v-model="tempDetail.objectDesc" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="余额类型" prop="objectType">
                    <el-select v-model="tempDetail.objectType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in objectTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="利息入账余额对象" prop="interestPostingBalanceObject"
                :rules="[ { required: true, message: '利息余额对象不能为空'}]">
                    <el-select v-model="tempDetail.interestPostingBalanceObject" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in interestPostingBalanceObjectOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="tempDetail.paymentPriority" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="开始日期" prop="beginDate">
                    <el-input v-model="tempDetail.beginDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="结束日期" prop="endDate">
                    <el-input v-model="tempDetail.endDate" class="wd200" type="text" readonly />
                </el-form-item>
                <!-- 余额对象参数选项-->
                <some-param-option v-if="table8List" 
                    :colunm1="colunm1"
                    :labelStr="labelStr" 
                    :textTitle="textTitle8"
                    :list="table8List"
                    @viewParamClick="hadleViewParam">
                </some-param-option>
                <pagination v-show="table8Total>0" :total="table8Total" :page.sync="table8FormObj.pageNum" :limit.sync="table8FormObj.pageSize" @pagination="getList8(tempDetail)" /> 
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">  
                    关闭
                </el-button>
            </div>
        </el-dialog>


        <!-- 查询还款优先级 -->
        <el-dialog
            title="查询余额对象还款优先级"
            :visible.sync="balPriorityDialog"
            width="65%"
        >
            <balance-object-priority></balance-object-priority>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="balPriorityDialog = false">
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
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%">
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
                <el-form-item class="cl_td" label="余额对象" prop="balanceObjectCode">
                    <el-input v-model="tempUp.balanceObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="objectDesc">
                <el-input v-model="tempUp.objectDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="余额类型" prop="objectType">
                    <el-select v-model="tempUp.objectType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in objectTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="利息入账余额对象" prop="interestPostingBalanceObject">
                    <el-select v-model="tempUp.interestPostingBalanceObject" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in interestPostingBalanceObjectOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority" >
                    <el-input v-model="tempUp.paymentPriority" class="wd120" type="text" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="chosePriorityBtn()">
                            查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="开始日期" prop="beginDate" >
                    <el-date-picker
                        v-model="tempUp.beginDate"
                        type="date"
                        placeholder="选择开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="结束日期" prop="endDate" >
                    <el-date-picker
                        v-model="tempUp.endDate"
                        type="date"
                        placeholder="选择结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <!-- 余额对象参数设置 -->
            <set-param-option
                :isHidden="up_hidden1"
                :colunm3="up_colunm3"
                :textTitle="up_textTitle"
                :list="up_balanceInList"
                @replaceParamClick="replaceParamClick(arguments)"
                @setParamClick="setParamClick(arguments)"
            ></set-param-option>
            <pagination v-show="paramsTotal>0" :total="paramsTotal" :page.sync="setParamsObj.pageNum" :limit.sync="setParamsObj.pageSize" @pagination="getSetOptionList(tempUp)" />
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


import BalanceObjectPriority from "@/components-ider/balanceObjectPriority";  //余额对象还款优先级
import SetParamOption from "@/components-ider/SetParamOption";
import ReplaceParam from "@/components-ider/ReplaceParam";
import SetPcd from "@/components-ider/SetPcd";
import ViewPcd from "@/components-ider/ViewPcd";
import SomeParamOption from "@/components-ider/SomeParamOption"; // 查看参数


export default {
  name: 'tableList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    BalanceObjectPriority,
    SetParamOption,
    ReplaceParam,SetPcd,ViewPcd,SomeParamOption
  },
  data() {
    return {
      // 权限
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      btnAuthStr: '',

      logininfo: {},

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
      objectTypeOptions: [],
      interestPostingBalanceObjectOptions: [],
      
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
      up_artifactInstanList: [],
        // 详情
      // 余额对象参数选项
        banlance_viewParam_dialog:false,
        textTitle8: '余额对象参数选项',
        table8Loading: false,
        table8List: [],
        table8Total: 0,
        table8FormObj: {
            pageSize: 10,
            pageNum: 1
        },
        labelStr: '余额对象',
        colunm1: true,
         // 查看参数组价
        textTitle2: '业务项目参数设置',
        viewPcdTitle: '',
        viewPcd_dialog: false,
        viewPcdFormObj: {},

      // 修改
      balPriorityDialog: false,// 查看还款优先级
       // 配置参数
       up_hidden1: true,
        up_balanceInList: [], // 余额对象参数设置
        up_textTitle: "余额对象参数设置",
        up_colunm3: false,
        paramsTotal: 0,
        setParamsObj: {
            pageNum: 1, 
            pageSize: 10
        },
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
        createDate:"",
        overDate:"",
        pickerOptionsStart: {
            disabledDate: time => {
                let endDateVal = this.overDate;
                if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime();
                }
            }
        },
        pickerOptionsEnd: {
            disabledDate: time => {
                let beginDateVal = this.createDate;
                if (beginDateVal) {
                    return (
                        time.getTime() <
                        new Date(beginDateVal).getTime()
                    );
                }
            },
        },
    }
  },
  created() {
    this.getBtnAuth()
    this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))

  },
  mounted() {
    this.getList()
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 余额类型
    this.getSelectDict('dic_balanceType').then((res) => {
        this.objectTypeOptions = res
    })
    // 利息入账余额对象
    console.log(this.logininfo)
    this.post('/beta/betaService/COS.IQ.02.0021', {operationMode: this.logininfo.operationMode},(res) => {
        let rows = res.returnData.rows
        rows.forEach(row => {
            row.concat = row.balanceObjectCode+' '+row.objectDesc
        })
        this.interestPostingBalanceObjectOptions = rows
        console.log(this.interestPostingBalanceObjectOptions)
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0021')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0021')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0021')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
        // 时间开始选择器
    startTimeStatus:function(value){
        this.createDate = value
    },
    // 时间结束选择器
    endTimeStatus:function(value){
        this.overDate = value
    },
    // 列表
    getList() {
        this.loading = true
        let params = {
            isTrans: true,
            transParams:['dic_balanceType' ],
            transDict : ['objectType']
        }
        this.config = Object.assign(this.config, this.queryFormObj, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0021', this.config ,(res) => {
            if (res.returnCode == '000000') {
                this.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    this.tableData = rows
                    this.config.total = res.returnData.totalCount
                }
            } else {
                this.tableData = []
                this.config.total = 0
            }
        }, (err) => {
      		this.tableData = []
            this.config.total = 0
       		this.loading = false
      })
    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.queryFormObj.pageSize = 10
        this.getList()
    },

    // 新增
    // 查询还款优先级
    chosePriorityBtn() {
      this.balPriorityDialog = true;
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
          this.tempAdd.balanceObjectCode = 'MODB'+ this.tempAdd.balanceObjectCodeHalf
          this.post('/beta/betaService/COS.AD.02.0021', this.tempAdd, (res) => {
              if (res.returnCode == '000000') {
                   this.dialogFormVisibleAdd = false
                    this.$notify({
                    message: '新增成功',
                    type: 'success',
                    })
                    this.getList()
                    this.tempAdd={}
              }
          })
        }
      })
    },  
    


    // 详情
    handleDetail(row) {
      this.tempDetail = {}
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
      this.table8List = []
      this.table8FormObj= {
            pageSize: 10,
            pageNum: 1
        },
      this.getList8(row)
      this.dialogFormVisibleDetail = true
    },
    handleUpdate(row) {
        this.up_artifactInstanList
        this.tempUp = {}
        this.tempUp = Object.assign({}, row)
      this.$nextTick(() => {
          this.$refs['dataFormUp'].clearValidate()
      })
      this.up_balanceInList = []
      this.setParamsObj= {
            pageNum: 1, 
            pageSize: 10
        },
      this.getSetOptionList(row)
      this.dialogFormVisibleUp = true
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.tempUp.artifactInstanList = this.up_artifactInstanList
                console.log(this.tempUp)
               // this.tempUp.paymentPriority = this.tempUp.paymentPriority.toString()
                this.post('/beta/betaService/COS.UP.02.0021', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                        message: '修改成功',
                        type: 'success',
                        })
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }
        })
    },

    // 修改弹窗 中的 函数
    // 查询还款优先级
    chosePriorityBtn() {
      this.balPriorityDialog = true;
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
    // 媒介参数设置
    getSetOptionList(row) {
        let obj = {
            instanCode: row.balanceObjectCode,
            operationMode: row.operationMode
        }
        this.setParamsObj = Object.assign( this.setParamsObj, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", this.setParamsObj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_balanceInList = res.returnData.rows
                    this.paramsTotal = res.returnData.totalCount
                }else{
                    this.up_balanceInList = []
                    this.paramsTotal = 0
                }
            }
        })
    },
    //  确定替换参数
    sureReplaceData() {
      // 媒介对象实例化
        this.$set(this.up_balanceInList[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]);
        this.$set(
          this.up_balanceInList[this.replaceIndex],
          "elementDesc",
          this.choosedVal.split("_")[1]
        );
        this.replcaeParam_dialog = false;
        this.up_artifactInstanList.push(this.up_balanceInList[this.replaceIndex])
    },
    //  确定设置参数
    sureSetData() {
        // 媒介对象实例化
        this.$set(
          this.up_balanceInList[this.replaceIndex],
          "pcdInitList",
          this.pcdList
        );
        this.$set(this.up_balanceInList, this.replaceIndex, this.setPcdObj);
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
    childByDeletPcd(val) {
      this.delePcdList = val;
    },

    // 余额对象参数选项
    getList8(row) {
        let obj = {
            instanCode: row.balanceObjectCode,
            operationMode: row.operationMode
        }
        this.table8FormObj = Object.assign(this.table8FormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.table8FormObj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(item => {
                        item.concat = item.instanCode1 + ' ' +item.instanDesc1
                    })
                     this.table8List = rows
                     this.table8Total = res.returnData.totalCount
                }else{
                    this.table8List = []
                    this.table8Total = 0
                }
            } 
        })
    },
     // 查看参数
    hadleViewParam(row) {
        this.viewPcdTitle = '查看'+row.pcdNo+': '+row.pcdDesc+'参数信息'
        this.viewPcd_dialog = true
        this.viewPcdFormObj = row
    },
    
  }
}
</script>

<style>
</style>
