<!-- 密钥索引管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" clearable  class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" >
                <el-select v-model="queryFormObj.cardAssociations" clearable class="wd200">
                <el-option
                    v-for="(item, index ) in cardAssociationsOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="密钥类型" prop="cipherType" >
                <el-select v-model="queryFormObj.cipherType" clearable class="wd200">
                <el-option
                    v-for="(item, index ) in cipherTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center"><!--v-show="selBtnFlag"-->
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()" >新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table
                v-loading = "listLoading1"
                :data="tableList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border>
                <el-table-column label="序号" type="index" width="50" align="center"> </el-table-column>
                <el-table-column prop="cardAssociations" label="卡组织标识" align="center" />
                <el-table-column prop="cipherType" label="密钥类型" align="center" />
                <el-table-column prop="cipherId" label="密钥索引" align="center" />
                <el-table-column prop="keyDesc" label="描述" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-if="selBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete-solid"   type="primary" @click="handleDel(row)" v-if="addBtnFlag">删除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!--新增交易识别-->
        <el-dialog title="加密机参数新增" :visible.sync="dialogFormVisibleAdd" width='70%'>
            <el-form ref="dataFormAdd" :model="encryAdd" :rules="rulesAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="encryAdd.operationMode" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" :rules="[ { required: true, message: '卡组织标识不能为空'} ]">
                    <el-select v-model="encryAdd.cardAssociations" class="wd200">
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="cipherType" :rules="[ { required: true, message: '密钥类型不能为空'} ]">
                    <el-select v-model="encryAdd.cipherType" class="wd200">
                    <el-option
                        v-for="(item, index ) in cipherTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引" prop="cipherId" :rules="[ { required: true, message: '密钥索引不能为空'} ]">
                    <el-input v-model="encryAdd.cipherId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="encryAdd.keyDesc" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addData()">确定</el-button>
                <el-button type="primary" @click="addClose()">关闭</el-button>
            </div>
        </el-dialog>
        <!--修改交易识别-->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp">
            <el-form ref="dataFormUp" :model="encryUp" :rules="rulesUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="encryUp.operationMode" class="filter-item" placeholder="请选择" readonly disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" :rules="[ { required: true, message: '卡组织标识不能为空'} ]">
                    <el-select v-model="encryUp.cardAssociations" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="cipherType" :rules="[ { required: true, message: '密钥类型不能为空'} ]">
                    <el-select v-model="encryUp.cipherType" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in cipherTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引" prop="cipherId" :rules="[ { required: true, message: '密钥索引不能为空'} ]">
                    <el-input v-model="encryUp.cipherId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="encryUp.keyDesc" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">关闭</el-button>
                <el-button type="primary" @click="upData()">确定</el-button>
            </div>
        </el-dialog>
        <!--删除秘钥索引信息-->
        <el-dialog title="删除确认信息" :visible.sync="dialogFormVisibleDel">
            <el-form ref="dataFormDel" :model="encryDel" :rules="rulesDel" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" >
                    <el-select v-model="encryDel.operationMode" class="filter-item" placeholder="请选择" readonly disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" >
                    <el-select v-model="encryDel.cardAssociations" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="cipherType">
                    <el-select v-model="encryDel.cipherType" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in cipherTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引" prop="cipherId" >
                    <el-input v-model="encryDel.cipherId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" >
                    <el-input v-model="encryDel.keyDesc" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="encryDelData()">确认删除</el-button>
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
        showList: false,
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
      operationModeOptions: [], //运营模式
      cardAssociationsOptions: [],//卡组织标识
      cipherTypeOptions: [],//密钥类型
      // 增删改查
        encryAdd: {}, // 新增
        encryUp: {}, // 修改
        encryDel: {}, // 删除
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDel: false,
        rulesAdd: {},
        rulesDel: {},
        rulesUp: {},

    }
  },
  created() {
    this.getBtnAuth()
  },
    mounted() {
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //卡组织标识
         this.getSelectDict( "dic_recordType").then(res => {
            this.cardAssociationsOptions = res
        })
        //密钥类型
        this.getSelectDict( "dic_cipherType").then(res => {
            this.cipherTypeOptions = res
        })
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
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('AUS.PM.20.0001')) { // 新增
                        this.addBtnFlag = true;
                    } else {
                       this.addBtnFlag = false;
                    }
                    if (this.btnAuthStr.includes('AUS.PM.20.0002')) { // 查询
                        this.selBtnFlag = true;
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('AUS.PM.20.0003')) { // 维护
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
        this.showList = true
        let obj={
            authDataSynFlag: "1",
        }
        obj = Object.assign(obj,this.queryFormObj)
        this.getTableList('/beta/betaService/AUS.PM.20.0002', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading1 = false
                if(res.returnData.rows !=[]){
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                        
                    }else{
                        this.listLoading1 = false
                        this.tableTotal = res.returnData.totalCount
                        this.tableList = []
                    }
                }
            }
        }, (err) => {
            this.listLoading1 = false
            this.tableTotal = 0
            this.tableList = []           
        })
	},
    handleSearch() {
        this.getList()
    },
    //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
        })
    }, 
    //关闭弹框清空数据
    addClose() {
        this.dialogFormVisibleAdd = false
        this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
        })
        this.$refs["dataFormAdd"].resetFields()
    },
    //提交新增数据
    addData() {
         let obj2={
            authDataSynFlag: "1",
        }
        this.encryAdd = Object.assign(obj2,this.encryAdd)
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/AUS.PM.20.0001', this.encryAdd, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                        title: 'Success',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                    this.encryAdd = {}
                }
            })
        }
      })
    },  
    //显示删除弹框
    handleDel(row) {
        this.dialogFormVisibleDel = true
        this.encryDel = Object.assign({}, row) // 
        this.$nextTick(() => {
        this.$refs['dataFormDel'].clearValidate()
      })
    },
    //提交删除数据
    encryDelData() {
        let delObj={
            authDataSynFlag: "1",
            invalidFlag: '1',
        }
        this.encryDel = Object.assign(delObj,this.encryDel)
     	this.$confirm('确定是否删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { 
	        this.post('/beta/betaService/AUS.PM.20.0003', this.encryDel, (res) => {
                    if (res.returnCode == '000000') {
                         this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.dialogFormVisibleDel = false
                        this.getList()
                    }
	        })
        })
    },  
    //显示修改弹框
    handleUpdate(row) {
        this.encryUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    //确认提交修改数据
    upData() {
        let params = {
            authDataSynFlag: "1",
            cardAssociations: this.encryUp.cardAssociations,
            gmtCreate: this.encryUp.gmtCreate,
        }
        params = Object.assign( params, this.encryUp ) 
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/AUS.PM.20.0003',params, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                        this.encryUp = {}
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
