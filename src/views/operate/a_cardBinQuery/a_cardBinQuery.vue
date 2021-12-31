'<!-- 卡BIN -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                <el-input v-model="queryFormObj.corporationEntityNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                <el-input v-model="queryFormObj.binNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
            <el-table-column prop="binNo" label="发行卡BIN" align="center" />
            <el-table-column prop="cardSchemeDesc" label="卡组织" align="center" />
            <el-table-column prop="cardTypDesc" label="卡类型" align="center" />
            <el-table-column prop="settlementCurrencyDesc" label="清算币种" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                <!--<el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>-->
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="卡BIN建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" >
                    <el-input v-model="tempAdd.corporationEntityNo" class="wd200" @focus="chosecorporation()"   type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo"
                :rules="[ { required: true, message: '发行卡BIN不能为空'},
                { min: 6, max: 6, message: '长度在6个字符', trigger: 'blur' } ]" >
                    <el-input v-model="tempAdd.binNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织" prop="cardScheme">
                    <el-select v-model="tempAdd.cardScheme" class="wd200">
                      <el-option
                        v-for="(item, index ) in cardSchemeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡类型" prop="cardTyp">
                    <el-select v-model="tempAdd.cardTyp" class="wd200">
                      <el-option
                        v-for="(item, index ) in cardTypOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清算币种" prop="currencyCode">
                    <el-select v-model="tempAdd.currencyCode" class="wd200">
                      <el-option
                        v-for="(item, index ) in settlementCurrencyOptions"
                        :key="index"
                        :label="item.currencyDesc"
                        :value="item.currencyCode"
                      />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleAdd = false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--选择法人实体编号-->   
        <el-dialog title="选择法人实体编号" :visible.sync="dialogFormVisibleLegal" width="65%">
            <el-form ref="dataFormLegal" :rules="rulesLegal" :model="tempLegal" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                    <el-input v-model="tempLegal.corporationEntityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人实体名称" prop="corporationEntityName">
                    <el-input v-model="tempLegal.corporationEntityName" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchInfo()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="delInfo()">重置</el-button>
                </div>
            </el-form>
            <el-table v-loading = "legalListLoading" :data="legalTableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                
                <el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <el-radio v-model="templateRadio" :label="scope.$index" @change.native="getTemplateRow(scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
                <el-table-column prop="corporationEntityName" label="法人实体名称" align="center" />
            </el-table>
            <pagination v-show="legalTotal>0" :total="legalTotal" :page.sync="legalFormObj.pageNum" :limit.sync="legalFormObj.pageSize" @pagination="getlegalList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subLegalData()"> 确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleLegal = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改BIN信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" >
                    <el-input v-model="tempUp.corporationEntityNo" class="wd200" type="text" disabled />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-input v-model="tempUp.binNo" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织" prop="cardScheme">
                    <el-select v-model="tempUp.cardScheme" class="wd200">
                      <el-option
                        v-for="(item, index ) in cardSchemeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡类型" prop="cardTyp">
                    <el-select v-model="tempUp.cardTyp" class="wd200">
                      <el-option
                        v-for="(item, index ) in cardTypOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清算币种" prop="currencyCode">
                    <el-select v-model="tempUp.currencyCode" class="wd200">
                        <el-option
                        v-for="(item, index ) in settlementCurrencyOptions"
                        :key="index"
                        :label="item.currencyDesc"
                        :value="item.currencyCode"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">取消</el-button>
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
        templateRadio: false,
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
        originListOptions:[],
        cardSchemeOptions: [],//卡组织
        cardTypOptions: [],//卡类型
        settlementCurrencyOptions: [],//清算币种
        /*----新增----*/
        tempAdd: {}, // 新增
        //选择法人实体编号
        legalTableList: [],//列表
        legalListLoading: false,
        dialogFormVisibleLegal: false,
        tempLegal: {},  
        dataFormLegal: {},
        legalTotal: 0,
        rulesLegal: {},
        legalFormObj:{
            pageNum: 1,
            pageSize:10,
        },
        newLegal: '',
        tempUp: {}, // 修改
        tempDetail: {}, // 详情
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
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
            this.originListOptions = res
        })
        //卡组织
        this.getSelectDict( "dic_cardScheme").then(res => {
            this.cardSchemeOptions = res
        })
        //卡类型
        this.getSelectDict( "dic_cardType").then(res => {
            this.cardTypOptions = res
        })
        //清算币种
          this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
            this.settlementCurrencyOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0011')){ // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0011')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0011')) { // 维护
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
        this.queryFormObj.autoQuery = false
        let objList = {
            isTrans: true,//是否需要翻译数据字典
            transParams : ['dic_cardScheme','dic_cardType'],//查找数据字典所需参数
            transDict : ['cardScheme','cardTyp'],//翻译前后key
        }
        objList = Object.assign(this.queryFormObj, objList)
        this.getTableList('/beta/betaService/COS.IQ.02.0011', objList,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading1 = false
                }else {
                    this.tableList = []
                    this.tableTotal = 0
                    this.listLoading1 = false
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
    //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //显示选择法人实体编号弹框
    chosecorporation(){
        this.dialogFormVisibleLegal = true
        this.getlegalList()
        this.$nextTick(() => {
            this.$refs['dataFormLegal'].clearValidate()
        })
    },
    //查询法人实体编号
    searchInfo(){
        this.getlegalList()
    },
    //法人实体编号列表
    getlegalList(){
        this.legalListLoading = true
        let obj = {
            pageNum: this.legalFormObj.pageNum,
            pageSize: this.legalFormObj.pageSize,
            corporationEntityNo: this.tempLegal.corporationEntityNo,
            corporationEntityName: this.tempLegal.corporationEntityName
        }
        this.getTableList('/beta/betaService/COS.IQ.02.0037', obj,(res) => {
            if (res.returnCode == '000000') {
                this.legalListLoading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.legalTableList = res.returnData.rows
                    this.legalTotal = res.returnData.totalCount
                } else {
                    this.legalTableList = []
                    this.legalTotal = 0
                }
            }
        }) 
    },
    //获取单选数据
    getTemplateRow(row){
        this.newLegal = row
    },
    //确认提交法人实体编号
    subLegalData(item){
        this.tempAdd.corporationEntityNo = this.newLegal.corporationEntityNo
        this.dialogFormVisibleLegal = false
    },
    delInfo(){
        this.tempLegal={}
    },
    //确认新增数据 
    createData() {
        let objData = {
            settlementCurrency: this.tempAdd.currencyCode
        }
        objData = Object.assign(this.tempAdd, objData)
        this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0011',objData, (res) => {
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
    //显示修改弹框
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.tempUp.currencyCode = row.settlementCurrency
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
    }, 
    //确认修改数据
    updateData() {
        let upObjData = {
            settlementCurrency: this.tempUp.currencyCode
        }
        upObjData = Object.assign(this.tempUp, upObjData)
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0011', upObjData, (res) => {
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
</style>
'