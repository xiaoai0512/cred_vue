<!-- 技术参数 -->
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
            <el-form-item class="cl_td" label="构件编号" prop="artifactNo">
                <el-input v-model="queryFormObj.artifactNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <!-- <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button> -->
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
            <el-table-column prop="" label="构件编号及描述" align="center" width="350">
                <template slot-scope="{row}">
                    <span class="tdDivL">{{row.artifactNo}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <span class="tdDivR">{{row.artifactDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="元件编号及描述" align="center">
                <template slot-scope="{row}">
                    <span class="tdDivL">{{row.elementNo}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <span class="tdDivR">{{row.elementDesc}}</span>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />

        
        <!-- 新增 -->
        <!-- <el-dialog title="系统单元新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="系统单元编号" prop="systemUnitNo"
                :rules="[ { required: true, message: '系统单元编号不能为空'},
                {max:3, message: '系统单元编号长度不能超过3个字符'}]" >
                    <el-input v-model="tempAdd.systemUnitNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="系统单元名称" prop="systemUnitName"
                :rules="[ { required: true, message: '系统单元名称不能为空'} ]" >
                    <el-input v-model="tempAdd.systemUnitName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="上一处理日期" prop="lastProcessDate"
                :rules="[ { required: true, message: '请选择时间'} ]" >
                    <el-date-picker class="wd200" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="tempAdd.lastProcessDate"></el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="当前处理日期" prop="currProcessDate"
                :rules="[ { required: true, message: '请选择时间'} ]" >
                    <el-date-picker class="wd200" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="tempAdd.currProcessDate"></el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="下一处理日期" prop="nextProcessDate"
                :rules="[ { required: true, message: '请选择时间'} ]" >
                    <el-date-picker class="wd200" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="tempAdd.nextProcessDate"></el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="系统运行状态" prop="systemOperateState"
                :rules="[ { required: true, message: '系统运行状态不能为空'} ]" >
                    <el-select v-model="tempAdd.systemOperateState" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in systemOperateStateOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="当前日志标志" prop="currLogFlag"
                :rules="[ { required: true, message: '当前日志标志不能为空'} ]" >
                    <el-select v-model="tempAdd.currLogFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in currLogFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="下一日志标志" prop="nextLogFlag"
                :rules="[ { required: true, message: '下一日志标志不能为空'} ]" >
                    <el-select v-model="tempAdd.nextLogFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in currLogFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="假日表编号" prop="holidayNo" >
                    <el-select v-model="tempAdd.holidayNo" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in holidayNoOptions"
                        :key="index"
                        :label="item.holidayNo"
                        :value="item.holidayNo"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="系统环境标识" prop="systemEnvironmentFlag" >
                    <el-select v-model="tempAdd.systemEnvironmentFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in systemEnvironmentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="非营业日批次标识" prop="nonProDayBatchFlag"
                :rules="[ { required: true, message: '非营业日批次标识不能为空'} ]" >
                    <el-select v-model="tempAdd.nonProDayBatchFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in nonProDayBatchFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="PAN是否加密标志" prop="panEncryptFlag" >
                    <el-select v-model="tempAdd.panEncryptFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in YorNOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <div class="cl-tr">
                    <label  class="el-form-item__label">系统营业日标识</label>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周一</div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio1">
                                <el-radio  style="line-height: 26px"
                                v-for="(item, index ) in radioOptions"
                                :key="index"
                                :label="item.id"
                                >{{item.name}}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周二</div>
                        <div class="wdper90 float_left">
                                <el-radio-group v-model="tempAdd.radio2">
                                    <el-radio  style="line-height: 26px"
                                    v-for="(item, index ) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周三</div>
                        <div class="wdper90 float_left">
                                <el-radio-group v-model="tempAdd.radio3">
                                    <el-radio  style="line-height: 26px"
                                    v-for="(item, index ) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周四</div>
                        <div class="wdper90 float_left">
                                <el-radio-group v-model="tempAdd.radio4">
                                    <el-radio  style="line-height: 26px"
                                    v-for="(item, index ) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周五</div>
                        <div class="wdper90 float_left">
                                <el-radio-group v-model="tempAdd.radio5">
                                    <el-radio style="line-height: 26px"
                                    v-for="(item, index ) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周六</div>
                        <div class="wdper90 float_left">
                                <el-radio-group v-model="tempAdd.radio6">
                                    <el-radio style="line-height: 26px"
                                    v-for="(item, index ) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%;">周日</div>
                        <div class="wdper90 float_left">
                                <el-radio-group v-model="tempAdd.radio7">
                                    <el-radio style="line-height: 26px;"
                                    v-for="(item, index ) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                        </div>
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
        </el-dialog> -->


        <!-- 详情 -->
        <el-dialog title="系统单元详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleDetail = false">
                关闭
            </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="系统单元修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp" >
                
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
  name: 'tableList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    return {
      // 权限
      selBtnFlag: true,
      addBtnFlag: true,
      updBtnFlag: true,
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
    // this.getBtnAuth()
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0018')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
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
        this.getTableList('/beta/betaService/COS.IQ.02.0078', this.config ,(res) => {
            if (res.returnCode == '000000') {
                this.loading = false
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
       		this.loading = false
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
          this.post('/beta/betaService/COS.AD.02.0033', this.tempAdd, (res) => {
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
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
      this.dialogFormVisibleUp = true
      this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0037', this.tempUp, (res) => {
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
