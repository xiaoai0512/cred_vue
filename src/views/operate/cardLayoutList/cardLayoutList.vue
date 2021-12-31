<!-- 卡版管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryFormObj.operationMode" class="wd200" >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="卡版面代码" prop="formatCode">
                <el-input v-model="queryFormObj.formatCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="cardBoardAddBtn()" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "listLoading1"
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="formatCode" label="卡版面代码" align="center" />
            <el-table-column prop="formatDescribe" label="卡版面描述" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)" >复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="卡版面建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="cardBoardAdd" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="cardBoardAdd.operationMode" class="wd200">
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版面代码" prop="formatCode" :rules="[ { required: true, message: '卡版面代码不能为空'} ]" >
                    <el-input v-model="cardBoardAdd.formatCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="卡版面描述" prop="formatDescribe" >
                    <el-input v-model="cardBoardAdd.formatDescribe" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createCardBoardData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="卡版面详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="cardBoardDetail" >
                 <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="cardBoardDetail.operationMode" class="wd200" clearable  disabled>
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版面代码" prop="formatCode" :rules="[ { required: true, message: '卡版面代码不能为空'} ]" >
                    <el-input v-model="cardBoardDetail.formatCode" class="wd200" type="text" clearable  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版面描述" prop="formatDescribe" >
                    <el-input v-model="cardBoardDetail.formatDescribe" class="wd200" type="text" clearable  readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="卡版面修改详情" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="cardBoardUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="cardBoardUp.operationMode" class="wd200" clearable  disabled>
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版面代码" prop="formatCode" :rules="[ { required: true, message: '卡版面代码不能为空'} ]" >
                    <el-input v-model="cardBoardUp.formatCode" class="wd200" type="text" clearable  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版面描述" prop="formatDescribe" >
                    <el-input v-model="cardBoardUp.formatDescribe" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()"> 确定</el-button>
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
      
      // 增删改查
      cardBoardAdd: {}, // 新增
      cardBoardUp: {}, // 修改
      cardBoardDetail: {}, // 详情
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0054')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0046')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0049')) { // 维护
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
        this.getTableList('/beta/betaService/COS.IQ.02.0054', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        })

    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },
    //显示新增弹框
    cardBoardAddBtn() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //确认新增成功
    createCardBoardData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
          this.post('/beta/betaService/COS.AD.02.0046', this.cardBoardAdd, (res) => {
            if (res.returnCode == '000000') {
                this.dialogFormVisibleAdd = false
                this.$notify({
                title: 'Success',
                message: '新增成功',
                type: 'success',
                duration: 2000
                })
                this.getList()
                this.cardBoardAdd = {}
            }
          })
        }
      })
    },  
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.cardBoardDetail = Object.assign({}, row) // 
        this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    //显示修改弹框
    handleUpdate(row) {
        this.cardBoardUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
        })
    }, 
    //提交修改数据
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0049', this.cardBoardUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                        this.cardBoardUp = {}
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
