<!-- 汇率目录 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="rateQueryList" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="rateQueryList.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNo">
                <el-input v-model="rateQueryList.businessProgramNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>
            </div>
        </el-form>
        <!--列表-->
        <el-table :data="tableList"  v-loading = "listLoading1"  border stripe style="width: 100%">
            <el-table-column prop="operationMode" label="运营模式" width="180" align="center">
                <template slot-scope="scope">
                     <span class="">{{scope.row.operationMode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nodeSerialNumbr" label="报价货币" width="180" align="center">
                <template slot-scope="scope">
                    <span class="tdDivL">{{scope.row.referCurrency}}&nbsp;</span>
                    <span class="tdDivR">{{scope.row.referCurrencyDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nodeDesc" label="基准货币" align="center">
                <template slot-scope="scope">
                    <span class="tdDivL">{{scope.row.baseCurrency}}&nbsp;</span>
                    <span class="tdDivR">{{scope.row.baseCurrencyDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="rateIssueDate" label="日期" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.rateIssueDate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="buyingPrice" label="买入价" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.buyingPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sellingPrice" label="卖出价" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.sellingPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="170">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="rateQueryList.pageNum" :limit.sync="rateQueryList.pageSize" @pagination="getList" />
        <!--新增-->
        <el-dialog title="汇率详情" :visible.sync="dialogFormVisibleAdd" width="75%">
            <el-form  ref="dataFormAdd"  :model="rateQueryAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式" prop="operationMode" class="cl_td"  :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select  clearable v-model="rateQueryAdd.operationMode" class="filter-item " placeholder="请选择">
                        <el-option v-for="(item, index) in operationModeOptions"  
                            :key="index" :label="item.modeName" :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="rateIssueDate" class="cl_td" :rules="[ { required: true, message: '日期不能为空'} ]">
                   <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="rateQueryAdd.rateIssueDate"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker >
                    </div>
                </el-form-item>
                <el-form-item label="法人实体编号" prop="corporationEntityNo" class="cl_td" 
                    :rules="[ { required: true, message: '法人实体编号不能为空'} ]"><!--corporationEntityName-->
                    <el-select v-model="rateQueryAdd.corporationEntityNo" class="filter-item " clearable placeholder="请选择">
                        <el-option v-for="(item, index) in corporationEntityNoOptions"  
                            :key="index" :label="item.corporationEntityName" :value="item.corporationEntityNo" />
                    </el-select>
                </el-form-item>
                <el-form-item label="报价货币" prop="referCurrency" class="cl_td" 
                    :rules="[ { required: true, message: '报价货币不能为空'} ]"><!--corporationEntityName-->
                    <el-select v-model="rateQueryAdd.referCurrency" class="filter-item" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in referCurrencyOptions"  
                            :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="基准货币" prop="baseCurrency" class="cl_td"  
                    :rules="[ { required: true, message: '基准货币不能为空'} ]">
                    <el-select v-model="rateQueryAdd.baseCurrency" class="filter-item" clearable placeholder="请选择" >   <!--currencyDesc-->
                        <el-option v-for="(item, index) in referCurrencyOptions"  
                            :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="买入价" prop="buyingPrice" class="cl_td">
                    <el-input class="wd200 " v-model="rateQueryAdd.buyingPrice"  />
                </el-form-item>
                <el-form-item label="卖出价" prop="sellingPrice" class="cl_td">
                    <el-input class="wd200" v-model="rateQueryAdd.sellingPrice" />
                </el-form-item>
                <el-form-item label="Mark up" prop="markUp" class="cl_td">
                    <el-input class="wd200" v-model="rateQueryAdd.markUp"  />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false" size="medium"  type="primary">取消</el-button>
                <el-button @click="addData()" size="medium"    type="primary">确定</el-button>
            </div>
        </el-dialog>     
         <!--修改汇率详情-->
        <el-dialog title="汇率详情" :visible.sync="dialogFormVisibleUp" >
            <el-form  ref="dataFormUp"  :model="rateQueryUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式" prop="operationMode" class="cl_td">
                    <el-input class="wd200 " v-model="rateQueryUp.operationMode" disabled/>
                </el-form-item>
                <el-form-item label="日期" prop="rateIssueDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="rateQueryUp.rateIssueDate"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期" disabled readonly>
                        </el-date-picker >
                    </div>
                </el-form-item>
                <el-form-item label="法人实体编号" prop="corporationEntityNo" class="cl_td">
                    <el-select  clearable v-model="rateQueryUp.corporationEntityNo" class="filter-item " placeholder="请选择" disabled>
                        <el-option v-for="(item, index) in corporationEntityNoOptions"   
                            :key="index" :label="item.corporationEntityName" :value="item.corporationEntityNo" />
                    </el-select>
                </el-form-item>
                <el-form-item label="报价货币" prop="referCurrency" class="cl_td">
                    <!-- <el-input class="wd200" v-model="rateQueryUp.referCurrency"  /> -->
                    <el-select v-model="rateQueryUp.referCurrency" class="filter-item" clearable placeholder="请选择" disabled>
                        <el-option v-for="(item, index) in referCurrencyOptions"  
                            :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="基准货币" prop="baseCurrency" class="cl_td">
                    <!-- <el-input class="wd200" v-model="rateQueryUp.baseCurrency" disabled/> -->
                    <el-select v-model="rateQueryUp.baseCurrency" class="filter-item" clearable placeholder="请选择" disabled>   <!--currencyDesc-->
                        <el-option v-for="(item, index) in referCurrencyOptions"  
                            :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="买入价" prop="buyingPrice" class="cl_td">
                    <el-input class="wd200" v-model="rateQueryUp.buyingPrice"  />
                </el-form-item>
                <el-form-item label="卖出价" prop="sellingPrice" class="cl_td">
                    <el-input class="wd200" v-model="rateQueryUp.sellingPrice" />
                </el-form-item>
                <el-form-item label="Mark up" prop="markUp" class="cl_td">
                    <el-input class="wd200" v-model="rateQueryUp.markUp"  />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false" size="medium"  type="primary">取消</el-button>
                <el-button @click="updateData()" size="medium"    type="primary">确定</el-button>
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
        total: 0,
        rateQueryList: {
            pageNum: 1,
            pageSize: 10,
        },
        // 权限
        selBtnFlag: false,
        addBtnFlag: false,
        updBtnFlag: false,
        btnAuthStr: '',
    
        listLoading1: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList: [],
        tableTotal: 0,
    
    
        // 下拉框法人实体编号
      corporationEntityNoOptions: [], 
      //运营模式
      operationModeOptions: [],
      //报价货币
      referCurrencyOptions: [],
      //基准货币
    //  baseCurrencyOptions: [],
      // 增删改查
      rateQueryAdd: {// 新增
        //   rateIssueDate:'',
        //   corporationEntityNo:'',
        //   referCurrency:'',  
        //   baseCurrency:'',
        //   buyingPrice:'',
        //   sellingPrice:'',
        //   markUp:"",
      }, 
        rateQueryUp: {}, // 修改
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
       //this.getBtnAuth()
    },
    mounted() {
        this.getList()
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //法人实体编号
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037").then(res => {
            this.corporationEntityNoOptions = res
        })
        //报价货币环球影城
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
            this.referCurrencyOptions = res
            console.log(res)
        })
    },
    methods: {
    getRefresh() {
        this.$forceUpdate()
    },
        // 列表
        getList() {
            this.listLoading1 = true
            this.getTableList('/beta/betaService/COS.IQ.02.0022', this.rateQueryList ,(res) => {
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
        //查询
        handleSearch() {
            this.rateQueryList.pageNum = 1
            this.rateQueryList.pageSize = 10
            this.getList()
        },
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.rateQueryAdd = {}
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
        }, 
        //提交新增数据
        addData() {
           	this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0022', this.rateQueryAdd, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleAdd = false
                        this.$notify({
                        message: '新增成功',
                        type: 'success',
                        })
                        this.getList()
                        this.rateQueryAdd = {}
                    }
              })
            }
          })
        },  
        //显示修改弹框
        handleUpdate(row) {
            //法人实体编号
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0037").then(res => {
                this.corporationEntityNoOptions = res
            })
            this.rateQueryUp = {}
            this.rateQueryUp = Object.assign({}, row)
            this.dialogFormVisibleUp = true
            this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
          })
        }, 
        //提交修改
        updateData() {
            this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                  	this.post('/beta/betaService/COS.UP.02.0022', this.rateQueryUp, (res) => {
                        if (res.returnCode == '000000') {
                            this.dialogFormVisibleUp = false
                            this.$notify({
                                message: '修改成功',
                                type: 'success',
                            })
                            this.getList()
                            this.rateQueryUp = {}
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
