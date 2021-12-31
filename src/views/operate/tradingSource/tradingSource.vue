<!-- 交易来源 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="交易来源" prop="transOrigin">
                <el-select v-model="queryFormObj.transOrigin" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in transOriginOptions"
                        :key="index"
                        :label="item.transOrigin"
                        :value="item.transOrigin"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="来源目录" prop="originList">
                <el-select v-model="queryFormObj.originList" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in originListOptions"
                        :key="index"
                        :label="item.listDesc"
                        :value="item.originList"
                    />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button <!---->
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
            border
        >
            <el-table-column prop="transOrigin" label="交易来源" align="center" />
            <el-table-column prop="originDesc" label="描述" align="center" />
            <el-table-column prop="listDesc" label="来源目录" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <!--<el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" >详情</el-button>--><!--v-show="selBtnFlag"-->
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!---->
                    <el-button size="mini" icon="el-icon-delete"   type="primary" @click="handleDelete(row)">删除</el-button>
                    <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)" v-show="updBtnFlag">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
    
        
        <!-- 新增 -->
        <el-dialog title="交易来源新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="transactionAdd" style="margin-left: 100px;">
                <el-form-item label="交易来源"  prop="transOrigin" class="cl_tr" :rules="[ { required: true, message: '交易来源不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionAdd.transOrigin"/>
                </el-form-item>
                <el-form-item class="cl_tr" label="来源目录" prop="originList" :rules="[ { required: true, message: '来源目录不能为空'} ]">
                    <el-select v-model="transactionAdd.originList" class="wd200" >
                      <el-option
                        v-for="(item, index ) in originListOptions"
                        :key="index"
                        :label="item.listDesc"
                        :value="item.originList"
                      />
                    </el-select>
                    <el-button size="mini" type="primary" @click="sourceAdd()">+ 新增来源目录</el-button>
                </el-form-item>
               <el-form-item label="描述"  prop="originDesc" class="cl_tr describe_tr" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionAdd.originDesc"/>
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
        <!--来源目录-->
        <el-dialog title="来源目录" :visible.sync="dialogFormVisiblesourceAdd" width="65%">
            <el-form ref="catalogFormAdd" :rules="rulescatalogformAdd" :model="catalogform">
                <el-form-item label="来源目录"  prop="originList" class="cl_tr" 
                :rules="[ { required: true, message: '来源目录不能为空'} ,
                {max: 4, message: '长度最多 4 个字符', trigger: 'blur'}]">
                    <el-input class="wd200 " v-model="catalogform.originList "   />
                </el-form-item>
                <el-form-item label="描述"  prop="listDesc" class="cl_tr describe_tr" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input class="wd200 " v-model="catalogform.listDesc"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblesourceAdd = false"> 取消</el-button>
                <el-button type="primary" @click="catalogBtnAdd()"> 确定</el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleDetail = false">
                关闭
            </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%" >
            <el-form ref="dataFormUp" :rules="rulesUp" :model="transactionUp" style="margin-left: 100px;">
                <el-form-item label="交易来源"  prop="transOrigin" class="col_tr cl_tr" :rules="[ { required: true, message: '交易来源不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionUp.transOrigin"    />
                </el-form-item>
                <el-form-item class="col_tr cl_tr" label="来源目录" prop="originList" :rules="[ { required: true, message: '来源目录不能为空'} ]">
                    <el-select v-model="transactionUp.originList" class="wd200" >
                      <el-option
                        v-for="(item, index ) in originListOptions"
                        :key="index"
                        :label="item.listDesc"
                        :value="item.originList"
                      />
                    </el-select>
                    <el-button type="primary" @click="sourceUp()">+ 新增来源目录</el-button>
                </el-form-item>
               <el-form-item label="描述"  prop="originDesc" class="col_tr cl_tr describe_tr" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionUp.originDesc"/>
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
        <!--修改中 -->
        <!--新增来源目录-->
        <el-dialog title="新增来源目录" :visible.sync="dialogFormVisiblesourceUp" width="50%" >
            <el-form ref="catalogFormUp" :rules="rulescatalogformUp" :model="catalogInfoUp" >
                <el-form-item label="来源目录"  prop="originList" class="cl_tr" 
                :rules="[ { required: true, message: '来源目录不能为空'},
                {max: 4, message: '长度最多 4 个字符', trigger: 'blur'} ]">
                    <el-input class="wd200" v-model="catalogInfoUp.originList " />
                </el-form-item>
                <el-form-item label="描述"  prop="listDesc" class="cl_tr describe_tr" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input class="wd200 " v-model="catalogInfoUp.listDesc"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblesourceUp = false"> 取消</el-button>
                <el-button type="primary" @click="catalogBtnAdd2()"> 确定</el-button>
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
        loginInfo: {},
        corporationEntityNo: '',
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
      originListOptions: [],//来源目录
      transOriginOptions: [],
      // 增删改查
      transactionAdd: {}, // 新增
      transactionUp: {}, // 修改
      catalogInfoUp:{},//修改来源目录
      tempDetail: {}, // 详情
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      dialogFormVisiblesourceAdd:false,//新增交易来源目录
      dialogFormVisibleUp:false,//修改
      dialogFormVisiblesourceUp:false,//修改来源目录
      catalogform: {},

      rulescatalogformAdd:{},
      rulescatalogformUp:{},
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},

    }
  },
  created() {
    this.getBtnAuth()
    this.getCorporationEntityNo()
  },
  mounted() {
    this.getList()
    //运营模式
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })

   

    
    this.loginInfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
    	
  },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        // console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0069')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0166')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0152')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 查询法人实体
    getCorporationEntityNo() {
        let obj = {
            organNo : this.loginInfo.organization
        }
        this.post('/beta/betaService/COS.IQ.02.0005', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.corporationEntityNo = res.returnData.rows[0].corporationEntityNo;
                    //交易来源
                    this.getSelectDict( "/beta/betaService/COS.IQ.02.0069" , {corporationEntityNo: this.corporationEntityNo,}).then(res1 => {
                        this.transOriginOptions = res1
                    })
                    // 来源目录
                    this.getSelectDict( "/beta/betaService/COS.IQ.02.0072", {corporationEntityNo: this.corporationEntityNo,}).then(res => {
                        this.originListOptions = res
                    })
                }
            }
        })
    },
    // 列表
    getList() {
        this.listLoading1 = true
        let obj = this.queryFormObj
        for(let i in obj) {
            if(obj[i] == '') {
                delete obj[i]
            }
        }
        this.getTableList('/beta/betaService/COS.IQ.02.0069', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading1 = false
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                    this.listLoading1 = false
                }
            }
        })

    },
    //列表查询
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },
    //删除
    handleDelete(row,index){
        console.log(row)
        this.$confirm('是否删除交易来源?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.post('/beta/betaService/COS.UP.02.0153', row, (res) => {
                if (res.returnCode == '000000') {
                        this.$notify({
                            message: '删除成功',
                            type: 'success',
                        }) 
                        // this.tableList.splice(index,1);
                        this.getList()
                    }
                })
        }).catch(() => {});
    },
    //显示新增
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 

    //确认提交新增
    // transactionData() {
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.transactionAdd.corporationEntityNo = this.corporationEntityNo
            this.post('/beta/betaService/COS.AD.02.0166', this.transactionAdd, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                    title: 'Success',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getList()
                    this.transactionAdd = {}
                }
          })
        }
      })
    },  
    //新增显示来源目录sourceAdd
    sourceAdd(){
        this.dialogFormVisiblesourceAdd = true
        this.$nextTick(() => {
        this.$refs['catalogFormAdd'].clearValidate()
        })
    },
    // 新增中 确认新增显示来源目录
    catalogBtnAdd(){
        // this.getSelectDict()
        // 来源目录
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0072", {corporationEntityNo: this.corporationEntityNo,}).then(res => {
            this.originListOptions = res
        })
        this.catalogform.corporationEntityNo = this.corporationEntityNo
        this.$refs['catalogFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0169', this.catalogform, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.dialogFormVisiblesourceAdd = false;
                    // 来源目录
                    this.getSelectDict( "/beta/betaService/COS.IQ.02.0072", {corporationEntityNo: this.corporationEntityNo,}).then(res => {
                        this.originListOptions = res
                    })
                }
            
          })
        }
      })
    },
     // 修改 确认新增显示来源目录
     catalogBtnAdd2(){
        // this.getSelectDict()
        // 来源目录
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0072", {corporationEntityNo: this.corporationEntityNo,}).then(res => {
            this.originListOptions = res
        })
        this.catalogInfoUp.corporationEntityNo = this.corporationEntityNo
        this.$refs['catalogFormUp'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0169', this.catalogInfoUp, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.dialogFormVisiblesourceUp = false;
                    // 来源目录
                    this.getSelectDict( "/beta/betaService/COS.IQ.02.0072", {corporationEntityNo: this.corporationEntityNo,}).then(res => {
                        this.originListOptions = res
                    })
                }
            
          })
        }
      })
    },
    //显示详情
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
          this.tempDetail = Object.assign({}, row) // 
          this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
          })
    },
    //显示修改
    handleUpdate(row) {
        this.transactionUp = Object.assign({}, row)
      this.dialogFormVisibleUp = true
      this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    //显示修改来源目录弹框
    sourceUp(row) {
        this.catalogInfoUp = Object.assign({}, row)
        this.dialogFormVisiblesourceUp = true
        this.$nextTick(() => {
        this.$refs['catalogFormUp'].clearValidate()
      })
    }, 
    //修改来源目录
    sourceInfoUp() {
        this.$refs['catalogFormUp'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0169', this.catalogInfoUp, (res) => {
                if (res.returnCode == '000000') {
                     this.dialogFormVisibleAdd = false
                    this.$notify({
                    title: 'Success',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getSelectDict()
                    this. catalogInfoUp = {}
                }
          })
        }
      })
    }, 
    //确认提交修改数据
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0152', this.transactionUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                        this.transactionUp = {}
                    }
                })
            }
        })
    },
  }
}
</script>
    
<style>
 .describe_tr .el-form-item__label{
        width:12%;
    }

    .cl_tr label.el-form-item__label {
        width: 20%;
    }
</style>
