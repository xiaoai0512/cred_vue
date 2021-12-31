<!-- 运营机构 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="机构号" prop="organNo" >
               <el-input v-model="queryFormObj.organNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="机构名称" prop="organName">
                <el-input v-model="queryFormObj.organName" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-if="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" border stripe style="width: 100%">
            <el-table-column prop="organNo" label="机构号" width="180" align="center">
                <template slot-scope="scope">
                    <span >{{scope.row.organNo}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="organName" label="机构名称" width="180" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.organName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="upperOrganNo" label="上级机构号" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.upperOrganNo}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="operationMode" label="运营模式" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.operationMode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-search" type="primary" @click="handleDetail(scope.row)" v-show="selBtnFlag">查询</el-button>
                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-show="updBtnFlag">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="tableList.pageNum" :limit.sync="tableList.pageSize" @pagination="getList" />
       <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="机构号" prop="organNo"
                    :rules="[ { required: true, message: '机构号不能为空'}]">
                    <el-input v-model="tempAdd.organNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="机构名" prop="organName"
                    :rules="[ { required: true, message: '机构名称不能为空'} ]" >
                    <el-input v-model="tempAdd.organName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="机构层级" prop="organLevel" >
                    <el-select v-model="tempAdd.organLevel" class="wd200" clearable @change="getOrganNoChangeAdd(tempAdd.organLevel)">
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="上级机构号" prop="upperOrganNo">
                    <el-select v-model="tempAdd.upperOrganNo" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in upperOrganNoOptions"
                        :key="index"
                        :label="item.organName"
                        :value="item.organNo" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempAdd.operationMode" class="wd200" :disabled="tempAdd.organLevel=='B0' ? true : false" clearable>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"  />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式层级" v-if="tempAdd.organLevel=='B0'"
                     prop="operationModeLevel" :rules="[ { required: true, message: '运营模式层级不能为空'}]">
                    <el-select v-model="tempAdd.operationModeLevel" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in operationModeLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="所属法人实体"  prop="corporationEntityNo" >
                    <el-select v-model="tempAdd.corporationEntityNo" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in corporationEntityNoOptions"
                        :key="index"
                        :label="item. corporationEntityName"
                        :value="item.corporationEntityNo"  />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="所属国家" prop="country" >
                    <el-input v-model="tempAdd.country" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="城市" prop="city" >
                    <el-input v-model="tempAdd.city" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="机构号" prop="organNo">
                    <el-input v-model="tempDetail.organNo" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="机构名" prop="organName" >
                    <el-input v-model="tempDetail.organName" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="机构层级" prop="organLevel" >
                    <el-select v-model="tempDetail.organLevel" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" disabled/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="上级机构号" prop="upperOrganNo">
                    <el-select v-model="tempDetail.upperOrganNo" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in upperOrganNoOptions"
                        :key="index"
                        :label="item.organName"
                        :value="item.organNo" disabled/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempDetail.operationMode" class="wd200" 
                        :disabled="tempDetail.organLevel=='B0'  ? true : false " disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" disabled/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式层级" v-if="tempDetail.organLevel=='B0'"
                     prop="operationModeLevel" >
                    <el-select v-model="tempDetail.operationModeLevel" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" disabled/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="所属法人实体"  prop="corporationEntityNo" >
                    <el-select v-model="tempDetail.corporationEntityNo" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in corporationEntityNoOptions"
                        :key="index"
                        :label="item.corporationEntityName"
                        :value="item.corporationEntityNo" disabled/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="所属国家" prop="country" >
                    <el-input v-model="tempDetail.country" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="城市" prop="city" >
                    <el-input v-model="tempDetail.city" class="wd200" type="text" disabled/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false" type="primary">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp" >
                <el-form-item class="cl_td" label="机构号" prop="organNo"
                    :rules="[ { required: true, message: '机构号不能为空'}]">
                    <el-input v-model="tempUp.organNo" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="机构名" prop="organName">
                    <el-input v-model="tempUp.organName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="机构层级" prop="organLevel" >
                    <el-select v-model="tempUp.organLevel" class="wd200"  clearable @change="getOrganNoChangeUp(tempUp.organLevel)">
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="上级机构号" prop="upperOrganNo">
                    <el-select v-model="tempUp.upperOrganNo" class="wd200" clearable >
                    <el-option
                        v-for="(item, index ) in upperOrganNoOptions"
                        :key="index"
                        :label="item.organName"
                        :value="item.organNo" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式层级" v-if="tempUp.organLevel=='B0'"
                     prop="operationModeLevel" :rules="[ { required: true, message: '运营模式层级不能为空'}]">
                    <el-select v-model="tempUp.operationModeLevel" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in operationModeLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="所属法人实体"  prop="corporationEntityNo" >
                    <el-select v-model="tempUp.corporationEntityNo" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in corporationEntityNoOptions"
                        :key="index"
                        :label="item. corporationEntityName"
                        :value="item.corporationEntityNo" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="所属国家" prop="country" >
                    <el-input v-model="tempUp.country" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="城市" prop="city" >
                    <el-input v-model="tempUp.city" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleUp = false">取消</el-button>
            <el-button type="primary" @click="updateData()">确定 </el-button>
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
        productObjectCodeOptions: [],//机构层级
        operationMode: [],
        upperOrganNoOptions:[],//上层机构号
        operationModeLevelOptions:[],//运营模式层级
        corporationEntityNoOptions:[],//所属法人实体
        // 增删改查
        tempAdd: {}, // 新增
        tempUp: {}, // 修改
        tempDetail: {}, // 详情
        upperOrganNoAdd: 0,
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
        //运营模式
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //法人实体
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037").then(res => {
            this.corporationEntityNoOptions = res
        })
        // 运营模式 层级
        this.getSelectDict( "dic_institutionalHierarchy").then(res => {
            this.operationModeLevelOptions = res
        })
        //机构层级
        this.getSelectDict( "dic_institutionalHierarchy").then(res => {
            this.productObjectCodeOptions = res
        })
        //上层机构号
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
            this.upperOrganNoOptions = res
        })
    },
    methods: {
        //机构层级关联上层机构号
        getOrganNoChangeAdd(organLevel) { // 新增
            if (this.tempAdd.upperOrganNo) {
                this.tempAdd.upperOrganNo = ''
            }
            this.upperOrganNoQuery(organLevel)
        },
        getOrganNoChangeUp(organLevel) { // 修改
            if (this.tempUp.upperOrganNo) {
                this.tempUp.upperOrganNo = ''
            }
            this.upperOrganNoQuery(organLevel)
        },
        //上层机构号
        upperOrganNoQuery(organLevel){
            // if (this.dialogFormVisibleAdd) {
            //     this.tempAdd.upperOrganNo = ''
            // } 
            // if (this.dialogFormVisibleUp) {
            //     this.tempUp.upperOrganNo = ''
            // } 
            // if (this.dialogFormVisibleDetail) {
            //     this.tempDetail.upperOrganNo = ''
            // } 
            this.upperOrganNoOptions = []
            let obj = {
                organLevel: organLevel 
            }
            this.post( "/beta/betaService/COS.IQ.02.0005", obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rowss = res.returnData.rows
                        this.upperOrganNoAdd=rowss[0].organNo
                        this.corporationEntityNoAdd=rowss[0].corporationEntityNo
                        console.log(this.corporationEntityNoAdd)
                        rowss.forEach(item => {
                            item.label = item.organNo+ ' '+ item.organName
                        })
                        this.upperOrganNoOptions = rowss
                    } else {
                        this.upperOrganNoOptions = []
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0005')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0005')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0005')) { // 维护
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
        this.getTableList('/beta/betaService/COS.IQ.02.0005', this.queryFormObj ,(res) => {
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
    //查询
    handleSearch() {
        this.queryFormObj.pageNum =1
        this.getList()
    },
    //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //确认提交新增数据
    createData() {
        this.tempAdd.upperOrganNo = this.upperOrganNoAdd;//上层机构
        if(this.tempAdd.upperOrganNo==0 ){
            this.tempAdd.upperOrganNo = "";
        }
        this.tempAdd.corporationEntityNo = this.corporationEntityNoAdd//法人实体
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0005', this.tempAdd, (res) => {
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
        this.tempDetail = Object.assign({}, row)
        // this.getOrganNoChange(this.tempDetail.organLevel)
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
        })
    },
    //显示修改弹框
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        // this.getOrganNoChange(this.tempUp.organLevel)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    //提交修改数据
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
