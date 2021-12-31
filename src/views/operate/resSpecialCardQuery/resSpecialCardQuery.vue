<!-- 预留号码清单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                <el-input v-model="queryFormObj.corporationEntityNo" class="wd200" type="text" disabled/>
            </el-form-item>
            <el-form-item class="cl_td" label="卡BIN" prop="cardBin">
                <el-select v-model="queryFormObj.cardBin" class="wd200" @change="cardBinChange($event)" clearable>
                    <el-option
                        v-for="(item, index ) in cardBinOptions"
                        :key="index"
                        :label="item.binNo"
                        :value="item.binNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber">
                <el-select v-model="queryFormObj.segmentNumber" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="预留号码段" prop="cardNumber">
                <el-input v-model="queryFormObj.cardNumber" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="handleReset" >重置</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="cardBin" label="卡BIN" align="center" />
            <el-table-column prop="segmentNumber" label="特殊号码段号" align="center" />
            <el-table-column prop="cardNumber" label="预留卡号" align="center" />
            <el-table-column prop="cardStatusDesc" label="预留卡号状态" align="center" />
            <el-table-column prop="startDate" label="启用日期" align="center" />
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
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" 
                    :rules="[ { required: true, message: '法人实体编号不能为空'}]">
                    <el-input v-model="tempAdd.corporationEntityNo" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡BIN" prop="binNo" 
                    :rules="[ { required: true, message: '卡BIN不能为空'}]">
                <el-select v-model="tempAdd.binNo" class="wd200" @change="add_cardBinChange($event) ">
                    <el-option
                        v-for="(item, index ) in cardBinOptions"
                        :key="index"
                        :label="item.binNo"
                        :value="item.binNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber" >
                <el-select v-model="tempAdd.segmentNumber" class="wd200">
                    <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
                <el-form-item class="cl_td" label="卡量阈值" prop="calorimeterValue">
                   <el-input v-model="tempAdd.calorimeterValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="预生成卡量" prop="createCalorimeter">
                   <el-input v-model="tempAdd.createCalorimeter" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="下一生成日期" prop="nextDate">
                    <el-date-picker class="wd200"
                        v-model="tempAdd.nextDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAdd()"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="修改预留号码信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" >
                    <el-input v-model="tempUp.corporationEntityNo" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡BIN" prop="cardBin">
                    <el-input v-model="tempUp.cardBin" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber" >
                     <el-input v-model="tempUp.segmentNumber" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="预留卡号" prop="cardNumber">
                   <el-input v-model="tempUp.cardNumber" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="启用日期" prop="startDate">
                    <el-input v-model="tempUp.startDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="预留卡号状态" prop="codes">
                    <el-select v-model="tempUp.codes" class="wd200">
                        <el-option
                            v-for="(item, index ) in cardStatusOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
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
            logininfo: '',
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
            list_segmentNumber: '',
            // 下拉框
            originListOptions:[],// 运营模式 
            cardBinOptions: [],//卡BIN
            segmentNumberOptions: [],//特殊号码段
            cardStatusOptions: [],//预留卡号状态
            /*----新增----*/
            tempAdd: {}, // 新增
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
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            this.getList()
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
            //卡BIN
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0011").then(res => {
                this.cardBinOptions = res
            })
            //预留卡号状态
            this.getSelectDict( "dic_reservedCardNoStatus").then(res => {
                this.cardStatusOptions = res
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
                        if (this.btnAuthStr.includes('COS.IQ.02.0011') != -1){ // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('COS.IQ.02.0011') != -1) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('COS.UP.02.0011') != -1) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
        //监听卡BIN
        cardBinChange(val){
            this.segmentNumberOptions = []
            this.list_segmentNumber = val
            this.getSegmentNumberOptions()
        },
        //管控场景代码
        getSegmentNumberOptions() {
            let params = {
                cardBin: this.list_segmentNumber,
            }
            this.post('/beta/betaService/COS.IQ.02.0045', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.segmentNumberDesc = item.segmentNumber
                            arr[index] = {
                                label: item.segmentNumberDesc,
                                value: item.segmentNumber
                            }
                        })
                        this.segmentNumberOptions = arr
                    } else {
                        this.segmentNumberOptions = []
                    }
                }
            })
        },
        // 列表
        getList() {
            this.listLoading1 = true
            let params = {
                corporationEntityNo: this.logininfo.corporationEntityNo,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_reservedCardNoStatus'],//查找数据字典所需参数
                transDict : ['cardStatus'],//翻译前后key
            }
            params = Object.assign(this.queryFormObj, params)   //合并
            this.getTableList('/beta/betaService/COS.IQ.02.0057', params,(res) => {
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
            this.tempAdd.corporationEntityNo = this.logininfo.corporationEntityNo
            this.getSegmentNumberOptions()
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
        }, 
         // 重置
         handleReset() {
            this.queryFormObj.cardBin = ''
            this.queryFormObj.segmentNumber = ''
            this.queryFormObj.cardNumber = ''
        }, 
        closeAdd(){
            this.dialogFormVisibleAdd = false
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].resetFields()
            })
        },
        //监听卡BIN
        add_cardBinChange(val){
            this.segmentNumberOptions = []
            this.add_segmentNumber = val
            this.add_getSegmentNumberOptions()
        },
        //特殊号码段号
        add_getSegmentNumberOptions() {
            let params = {
                cardBin: this.add_segmentNumber,
            }
            this.post('/beta/betaService/COS.IQ.02.0045', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.segmentNumberDesc = item.segmentNumber
                            arr[index] = {
                                label: item.segmentNumberDesc,
                                value: item.segmentNumber
                            }
                        })
                        this.segmentNumberOptions = arr
                    } else {
                        this.segmentNumberOptions = []
                    }
                }
            })
        },
        //确认新增数据 
        createData() {
            this.tempAdd.cardBin = this.tempAdd.binNo
            this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/COS.AD.02.0050',this.tempAdd, (res) => {
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
            this.tempUp.codes = row.cardStatusDesc
            this.dialogFormVisibleUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //确认修改数据
        updateData() {
            let  newObj = {
                cardStatus: this.tempUp.codes,
            }
            newObj = Object.assign(this.tempUp, newObj)
            this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/COS.UP.02.0085', newObj, (res) => {
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
