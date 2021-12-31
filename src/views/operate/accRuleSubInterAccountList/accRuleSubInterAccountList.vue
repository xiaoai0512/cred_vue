<!-- 记账规则子表-内部帐类 -->
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
            <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode">
                <el-input v-model="queryFormObj.accountingRuleCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="accountingRuleCode" label="记账规则代码" align="center" />
            <el-table-column prop="subTableSequence" label="子表序号" align="center" />
            <el-table-column prop="internalAccountNo" label="内部账号" align="center" />
            <el-table-column prop="drcrFlagDesc" label="借贷方向" align="center" />
            <el-table-column prop="currencyFlagDesc" label="币种标识" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "300">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                    <el-button size="mini" icon="el-icon-delete"  type="primary" @click="handleDelete(row)" v-show="delBtnFlag">删除</el-button>

                    
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />

        
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="refAdd" :model="tempAdd" :rules="rulesAdd">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
               </el-form-item>
               <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode" >
                     <el-input v-model="tempAdd.accountingRuleCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="子表序号" prop="subTableSequence">
                    <el-input v-model="tempAdd.subTableSequence" class="wd200" type="text" />
                </el-form-item>
                <div class="text_title">详细信息</div>
                <el-form-item class="cl_td" label="内部账号" prop="internalAccountNo" >
                     <el-input v-model="tempAdd.internalAccountNo" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" label="借贷方向" prop="drcrFlag">
                    <el-select v-model="tempAdd.drcrFlag" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in drcrFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种标识" prop="currencyFlag" >
                    <el-select v-model="tempAdd.currencyFlag" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in currencyFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
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

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="refDetail" :model="tempDetail" :rules="rulesDetail">
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
               <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode" >
                     <el-input v-model="tempDetail.accountingRuleCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子表序号" prop="subTableSequence">
                    <el-input v-model="tempDetail.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="text_title">详细信息</div>
                <el-form-item class="cl_td" label="内部账号" prop="internalAccountNo" >
                     <el-input v-model="tempDetail.internalAccountNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="借贷方向" prop="drcrFlag">
                    <el-select v-model="tempDetail.drcrFlag" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in drcrFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种标识" prop="currencyFlag" >
                    <el-select v-model="tempDetail.currencyFlag" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in currencyFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="媒介对象修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="refUp" :model="tempUp" :rules="rulesUp">
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
               <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode" >
                     <el-input v-model="tempUp.accountingRuleCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子表序号" prop="subTableSequence">
                    <el-input v-model="tempUp.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="text_title">详细信息</div>
                <el-form-item class="cl_td" label="内部账号" prop="internalAccountNo" >
                     <el-input v-model="tempUp.internalAccountNo" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" label="借贷方向" prop="drcrFlag">
                    <el-select v-model="tempUp.drcrFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in drcrFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种标识" prop="currencyFlag" >
                    <el-select v-model="tempUp.currencyFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in currencyFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
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

export default {
  name: 'accRuleSubInterAccountList',
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
        delBtnFlag: false,
        btnAuthStr: '',

        // 列表
        queryFormObj: {},
        loading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableData: [],
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },


        // 下拉框
        operationModeOptions: [], 
        mediaObjectTypeOptions: [],
        mediaFormOptions: [],

        operationModeOptions: [], // 运营模式
        drcrFlagOptions:  [], // 借贷方向
        currencyFlagOptions:  [], // 币种标识
        
        // 增删改查
        tempAdd: {}, // 新增
        rulesAdd: {},
        refAdd: {},
        tempUp: {}, // 修改
        rulesUp: {},
        refUp: {},
        tempDetail: {}, // 详情
        rulesDetail: {},
        refDetail: {},
        tempDel: {}, // 删除
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDetail: false,
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
    // 借贷方向 
    this.getSelectDict( "dic_drcrFlag").then(res => {
        this.drcrFlagOptions = res
    })
    // 币种标识 
    this.getSelectDict( "dic_currencyFlag").then(res => {
        this.currencyFlagOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0080')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0085')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0090')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0062')) { // 删除
                        this.delBtnFlag = true
                    } else {
                        this.delBtnFlag = false
                    }

                    
                }
            }
        })
    },
    // 列表
    getList() {
        this.config.loading = true
        let params = {
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_drcrFlag','dic_currencyFlag'],//查找数据字典所需参数
			transDict : ['drcrFlag','currencyFlag'],//翻译前后key
        }
        params = Object.assign(params, this.queryFormObj, this.config, )
        this.getTableList('/beta/betaService/COS.IQ.02.0080', params ,(res) => {
            if (res.returnCode == '000000') {
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    this.tableData = rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                    this.config.total = 0
                }
            }
        }, (err) => {
      		this.tableData = []
            this.config.total = 0
       		this.config.loading = false
        })

    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },
    // 新增 按钮
    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['refAdd'].clearValidate()
      })
    }, 
    createData() {
        this.$refs['refAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0085', this.tempAdd, (res) => {
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
    // 详情 按钮
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.$nextTick(() => {
            this.$refs['refDetail'].clearValidate()
        })
    },
    // 修改 按钮
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['refUp'].clearValidate()
        })
    }, 
    // 确定 修改
    updateData() {
        this.$refs['refUp'].validate((valid) => {
            if (valid) {
               this.tempUp.artifactInstanList = this.up_mediaInList
               this.tempUp.deletePcdInstanIdList = this.delePcdList
                this.post('/beta/betaService/COS.UP.02.0090', this.tempUp, (res) => {
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
    // 删除 按钮
    handleDelete(row) {
        console.log(row)
        this.tempDel = row
        this.$confirm('是否删除该内部帐类记账规则子表?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { // 是
            this.post('/beta/betaService/COS.UP.02.0062', this.tempDel, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                }
            })
        }).catch(() => { // 否   

        });
    },
    
    
  }
}
</script>

<style>
</style>
