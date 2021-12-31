<!-- 交易识别码 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo">
                <el-input v-model="queryFormObj.transIdentifiNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center"><!--v-show="selBtnFlag"-->
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()" v-show="addBtnFlag">新增</el-button>
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
            <el-table-column prop="transIdentifiNo" label="交易识别代码" align="center" />
            <el-table-column prop="transIdentifiDesc" label="交易识别描述" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row,$index}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)"  >复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!--新增交易识别-->
        <el-dialog title="交易识别" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :model="transldentyAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="transldentyAdd.operationMode" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNoHalf" :rules="[ { required: true, message: '交易识别代码不能为空'} ]">
                    <el-input v-model="transldentyAdd.transIdentifiNoHalf" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别描述" prop="transIdentifiDesc">
                    <el-input v-model="transldentyAdd.transIdentifiDesc" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">关闭</el-button>
                <el-button type="primary" @click="addData()">确定</el-button>
            </div>
        </el-dialog>
        <!--修改交易识别-->
        <el-dialog title="修改交易识别" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :model="transldentyUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td">
                    <el-select v-model="transldentyUp.operationMode" class="filter-item" placeholder="请选择" clearable disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo">
                    <el-input v-model="transldentyUp.transIdentifiNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别描述" prop="transIdentifiDesc">
                    <el-input v-model="transldentyUp.transIdentifiDesc" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">关闭</el-button>
                <el-button type="primary" @click="upData()">确定</el-button>
            </div>
        </el-dialog>
        <!--详情交易识别-->
        <el-dialog title="交易识别详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :model="transldentyDetails" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td">
                    <el-select v-model="transldentyDetails.operationMode" class="filter-item" placeholder="请选择" clearable disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo">
                    <el-input v-model="transldentyDetails.transIdentifiNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别描述" prop="transIdentifiDesc">
                    <el-input v-model="transldentyDetails.transIdentifiDesc" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
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
        transldentyAdd: {}, // 新增
        transldentyUp: {}, // 修改
        transldentyDetails: {}, // 详情
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
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        this.getList()
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0044')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0038')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0041')) { // 维护
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
        this.getTableList('/beta/betaService/COS.IQ.02.0044', this.queryFormObj ,(res) => {
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
    //提交新增数据
    addData() {
        this.transldentyAdd.transIdentifiNo = this.transldentyAdd.transIdentifiNoHalf;
       this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0038', this.transldentyAdd, (res) => {
                if (res.returnCode == '000000') {
                     this.dialogFormVisibleAdd = false
                    this.$notify({
                    title: 'Success',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getList()
                    this.transldentyAdd = {}
                }
            })
        }
      })
    },  
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.transldentyDetails = Object.assign({}, row) // 
        this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    //显示修改弹框
    handleUpdate(row) {
        this.transldentyUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    //确认提交修改数据
    upData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0041', this.transldentyUp, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                        this.transldentyUp = {}
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
