 <!--利率目录 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryFormObj.operationMode" class="wd200" @change="getProChange">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                <el-select v-model="queryFormObj.productObjectCode" class="wd200" >
                <el-option
                    v-for="(item, index ) in productObjectCodeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.productObjectCode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="业务类型" prop="businessTypeCode">
                <el-select v-model="queryFormObj.businessTypeCode" class="wd200">
                <el-option
                    v-for="(item, index ) in businessTypeCodeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.businessTypeCode"
                />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button><!--v-show="selBtnFlag"-->
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit  highlight-current-row style="width: 100%;" border>
             <el-table-column prop="instanCode1" label="余额对象"  align="center" >
                <template slot-scope="scope" align="left">
                    <div class="tdDivL" style="width:41%;">{{scope.row.instanCode1}}</div>
                    <div class="tdDivR" style="width:51%;">{{scope.row.instanDesc1}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="instanCode1" label="业务类型 "  align="center">
                <template slot-scope="scope" align="left">
                    <div class="tdDivL" style="width:41%;">{{scope.row.instanCode2}}</div>
                    <div class="tdDivR" style="width:51%;">{{scope.row.instanDesc2}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="instanCode1" label="利率附加维度1"  align="center">
                <template slot-scope="scope">
                    <div class="tdDivL" style="width:41%;">{{scope.row.x0987BO[0].baseInstanCode}}</div>
                    <div class="tdDivR" style="width:51%;">{{scope.row.x0987BO[0].baseInstanDesc}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="instanCode1" label="利率附加维度2" width="200" align="center">
                <template slot-scope="scope">
                    <div class="tdDivL" style="width:41%;">{{scope.row.x0987BO[0].optionInstanCode}}</div>
                    <div class="tdDivR" style="width:51%;">{{scope.row.x0987BO[0].optionInstanDesc}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="instanCode1" label="利率值" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.x0987BO[0].bigPcdValue}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" >
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" >详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)">修改</el-button>
                <el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)"  v-show="updBtnFlag">复制</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 详情 -->
        <el-dialog title="利率详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="interestrateDetail" >
                 <el-form-item label="运营模式 " prop="operationMode" class="cl_td">
                    <!-- <el-input class="wd200 " v-model="interestrateDetail.operationMode"  readonly/> -->
                    <el-select v-model="interestrateDetail.operationMode" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="参数构件编号" prop="artifactNo" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.artifactNo"  readonly/>
                </el-form-item>
                 <el-form-item label="元件编号及描述" prop="elementNo" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.elementNo"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度1" prop="instanCode1" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.instanCode1"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度2" prop="instanCode2" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.instanCode2" readonly />
                </el-form-item>
                 <el-form-item label="应用维度3" prop="instanCode3" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.instanCode3"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度4" prop="instanCode4" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.instanCode4"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度5" prop="instanCode5" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.instanCode5"  readonly/>
                </el-form-item>
                 <el-form-item label="执行顺序" prop="performOrder" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.performOrder"  readonly/>
                </el-form-item>
                <div class="mainname">PCD实例</div>
                <el-form-item label="PCD编号" prop="pcdNo" class="cl_td" >
                    <el-input class="wd200 " v-model="interestrateDetail.pcdNo"  readonly/>
                </el-form-item>
                 <el-form-item label="分段类型" prop="segmentTypeUpdate" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.segmentTypeUpdate"  readonly/>
                </el-form-item>
                 <el-form-item label="基础实例代码" prop="baseInstanCode" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.baseInstanCode"  readonly/>
                </el-form-item>
                 <el-form-item label="可选实例代码" prop="optionInstanCode" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateDetail.optionInstanCode"  readonly/>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="detailTableList" border stripe style="width: 100%">
                <el-table-column prop="segmentSerialNum" label="分段序号" width="180" align="center">
                    <template slot-scope="scope">
                        <span >{{scope.row.segmentSerialNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pcdType" label="取值类型" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pcdType}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="segmentValue" label="分段取值" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.segmentValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pcdValue" label="取值" align="center">
                    <template slot-scope="scope">
                         <span class="">{{scope.row.pcdValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pcdPoint" label="取值小数位" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pcdPoint}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="利率维护" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp"  :model="interestrateUp" :rules="rulesUp">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td">
                    <!-- <el-input class="wd200 " v-model="interestrateUp.operationMode"  readonly/> -->
                    <el-select v-model="interestrateUp.operationMode" class="wd200" disabled>
                        <el-option 
                            v-for="(item, index) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="参数构件编号" prop="artifactNo" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.artifactNo"  readonly/>
                </el-form-item>
                <el-form-item label="元件编号及描述" prop="elementNo" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.elementNo"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度1" prop="instanCode1" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.instanCode1"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度2" prop="instanCode2" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.instanCode2"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度3" prop="instanCode3" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.instanCode3"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度4" prop="instanCode4" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.instanCode4"  readonly/>
                </el-form-item>
                 <el-form-item label="应用维度5" prop="instanCode5" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.instanCode5"  readonly/>
                </el-form-item>
                 <el-form-item label="执行顺序" prop="performOrder" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.performOrder"  readonly/>
                </el-form-item>
                <div class="mainname">PCD实例</div>
                <el-form-item label="PCD编号" prop="pcdNo" class="cl_td" >
                    <el-input class="wd200 " v-model="interestrateUp.pcdNo"  readonly/>
                </el-form-item>
                 <el-form-item label="分段类型" prop="segmentTypeUpdate" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.segmentTypeUpdate"  readonly/>
                </el-form-item>
                 <el-form-item label="基础实例代码" prop="baseInstanCode" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.baseInstanCode"  readonly/>
                </el-form-item>
                 <el-form-item label="可选实例代码" prop="optionInstanCode" class="cl_td">
                    <el-input class="wd200 " v-model="interestrateUp.optionInstanCode"  readonly/>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="tableListUp" border stripe style="width: 100%">
                <el-table-column prop="segmentSerialNum" label="分段序号" width="180" align="center">
                    <template slot-scope="scope">
                        <span >{{scope.row.segmentSerialNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pcdType" label="取值类型" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pcdType}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="segmentValue" label="分段取值" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.segmentValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pcdValue" label="取值" align="center">
                    <template slot-scope="scope">
                         <el-input v-model="scope.row.pcdValue"  />
                    </template>
                </el-table-column>
                <el-table-column prop="pcdPoint" label="取值小数位" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pcdPoint}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">关闭</el-button>
                <el-button type="primary" @click="updateData()">确定</el-button>
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
        // 列表
        queryFormObj: {
            pageNum: 1,
            pageSize:10,
        },
        listLoading1: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList: [],
        tableTotal: 0,
        // 下拉框
        operationModeOptions: [], 
        productObjectCodeOptions: [],
        businessTypeCodeOptions: [],
        // 增删改查
        tempAdd: {}, // 新增
        interestrateUp: {}, // 修改
        tableListUp:[],//修改
        x0987BO: [],
        interestrateDetail: {}, // 详情
        detailTableList: [],//详情列表
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDetail: false,
        rulesAdd: {},
        rulesDetail: {},
        rulesUp: {},

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
    },
  methods: {
    // 运营模式联动
    getProChange() {
        // this.queryFormObj.productObjectCode = ''
        this.businessQuery()
        this.productQuery()
    },
    //业务类型
    businessQuery(){
        let obj = {
            operationMode: this.queryFormObj.operationMode
        }
        this.post( "/beta/betaService/COS.IQ.02.0013 ", obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rowss = res.returnData.rows
                    rowss.forEach(item => {
                        item.label = item.productObjectCode+ ' '+ item.productDesc
                    })
                    this.productObjectCodeOptions = rowss
                } else {
                    this.productObjectCodeOptions = []
                }
            }
        })
    },
    //产品代码
    productQuery(){
        let obj = {
            operationMode: this.queryFormObj.operationMode
        }
        this.post( "/beta/betaService/COS.IQ.02.0020", obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rowss = res.returnData.rows
                    rowss.forEach(item => {
                        item.label = item.businessTypeCode+ ' '+ item.businessDesc
                    })
                    this.businessTypeCodeOptions = rowss
                } else {
                    this.businessTypeCodeOptions = []
                }
            }
        })
    },
    
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0162')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0033')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0160')) { // 维护
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
        this.getTableList('/beta/betaService/COS.IQ.02.0162', this.queryFormObj, (res) => {
            console.log(res)
            if (res.returnCode == '000000') {
                this.listLoading1 = false
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
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },
    //新增
    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //新增提交
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
          this.post('/beta/betaService/COS.AD.02.0033', this.tempAdd, (res) => {
               if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                    message: '新增成功',
                    type: 'success',
                    })
                    this.getList()
                    this.tempAdd = {}
                }
            })
        }
      })
    },  
    //详情
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
        })
        this.interestrateDetail = Object.assign({}, row) 
        if (this.interestrateDetail.x0987BO.length >0) {
            this.detailTableList = this.interestrateDetail.x0987BO;
        } else {
        	this.detailTableList = [];
        }
    },
    //修改
    handleUpdate(row) {
        this.interestrateUp = Object.assign({}, row)
        if (this.interestrateUp.x0987BO.length >0) {
            this.tableListUp = this.interestrateUp.x0987BO;
        } else {
        	this.tableListUp = [];
        }
        this.dialogFormVisibleUp = true;
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
    }, 
    //修改提交
    updateData() {
        this.interestrateUp.x0987BO=this.tableListUp
        this.interestrateUp.pcdList=this.tableListUp
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0160', this.interestrateUp, (res) => {
                     if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                        message: '修改成功',
                        type: 'success',
                        })
                        this.getList()
                        this.interestrateUp = {}
                    }
                })
            }
        })
    },
  }
}
</script>

<style>
.mainname {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
    display: inline-block;
}
</style>
