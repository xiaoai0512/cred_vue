'<!-- 来源目录 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="来源目录" prop="operationMode">
                <el-select v-model="queryFormObj.originList" class="wd200">
                <el-option
                    v-for="(item, index ) in originListOptions"
                    :key="index"
                    :label="item.listDesc"
                    :value="item.originList"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>
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
            <el-table-column prop="originList" label="来源目录" align="center" />
            <el-table-column prop="listDesc" label="描述" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                <!-- <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)">详情</el-button> -->
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" >修改</el-button>
                <el-button size="mini" icon="el-icon-delete"   type="primary" @click="handleDelete(row)">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="系统单元新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="来源目录" prop="originList"
                :rules="[ { required: true, message: '来源目录不能为空'},
                    {max:4, message: '来源目录长度不能超过4个字符'}]" >
                    <el-input v-model="tempAdd.originList" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc"
                :rules="[ { required: true, message: '描述不能为空'} ]" >
                    <el-input v-model="tempAdd.listDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false"> 取消</el-button>
            <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
		<!-- 修改 -->
        <el-dialog title="系统单元修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp" >
                <el-form-item class="cl_td" label="来源目录" prop="originList"
                    :rules="[ { required: true, message: '来源目录不能为空'}]" >
                    <el-input v-model="tempUp.originList" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc">
                    <el-input v-model="tempUp.listDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
	            <el-button @click="dialogFormVisibleUp = false"> 取消</el-button>
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
      originListOptions:[],
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0011')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0011')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0011')) { // 修改
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
        this.getTableList('/beta/betaService/COS.IQ.02.0072', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading1 = false
                }
            } else {
                this.tableList = []
                this.tableTotal = 0
                this.listLoading1 = false
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
    //确认新增数据
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0169', this.tempAdd, (res) => {
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
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    //显示修改弹框
    handleUpdate(row) {
        console.log(row)
        this.tempUp = Object.assign({}, row)
      this.dialogFormVisibleUp = true
      this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    //确认修改数据
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0155', this.tempUp, (res) => {
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
    // 删除
    handleDelete(row) {
        
        console.log(row)
        this.$confirm('是否删除来源目录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.post('/beta/betaService/COS.UP.02.0156', row, (res) => {
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
    
    
  }
}
</script>

<style>
</style>