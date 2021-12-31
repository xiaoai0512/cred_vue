<!-- 预制卡申请 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                <el-input v-model="queryFormObj.corporationEntityNo" class="wd200" type="text" disabled/>
            </el-form-item>
            <el-form-item class="cl_td" label="产品对象" prop="productObjectCode">
                <el-select v-model="queryFormObj.productObjectCode" 
                @change="productObjectCodeChange($event)" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.productDesc"
                        :value="item.productObjectCode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="媒介对象" prop="mediaObjectCode">
                <el-select v-model="queryFormObj.mediaObjectCode" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in mediaObjectCodeOptions"
                        :key="index"
                        :label="item.mediaObjectDesc"
                        :value="item.mediaObjectCode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="卡版代码" prop="formatCode">
                 <el-select v-model="queryFormObj.formatCode" class="wd200" clearable :disabled="disabled1">
                    <el-option
                        v-for="(item, index ) in formatCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="申请日期" prop="cardNumber">
                <el-date-picker class="wd200"
                    v-model="tempAdd.nextDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
            <el-table-column prop="productObjectCodeDesc" label="产品对象" align="center" />
            <el-table-column prop="newMediaObjectCodeDesc" label="媒介对象" align="center" />
            <el-table-column prop="newFormatCodeDesc" label="卡版代码" align="center" />
            <el-table-column prop="applyNumber" label="申请数量" align="center" />
            <el-table-column prop="applyFlagDesc" label="生成标识" align="center" />
            <el-table-column prop="applyDate" label="申请日期" align="center" />
            <el-table-column prop="applyTime" label="申请时间" align="center" />
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-more" type="primary" @click="detailInfo(row)" v-show="selBtnFlag">详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" 
                    :rules="[ { required: true, message: '法人实体编号不能为空'}]">
                    <el-input v-model="tempAdd.corporationEntityNo" class="wd200" @focus="chosecorporation()" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品对象" prop="productObjectCode">
                <el-select v-model="tempAdd.productObjectCode" @change="add_cardBinChange($event)" class="wd200">
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.productDesc"
                        :value="item.productObjectCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介对象" prop="mediaObjectCode">
                    <el-select v-model="tempAdd.mediaObjectCode" class="wd200">
                        <el-option
                            v-for="(item, index ) in mediaObjectCodeOptions"
                            :key="index"
                            :label="item.mediaObjectDesc"
                            :value="item.mediaObjectCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版代码" prop="formatCode">
                 <el-select v-model="tempAdd.formatCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in formatCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="申请数量" prop="applyNumber">
                   <el-input v-model="tempAdd.applyNumber" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAdd()"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--选择法人实体编号-->   
        <el-dialog title="选择法人实体编号" :visible.sync="dialogFormVisibleLegal" width="65%">
            <el-form ref="dataFormLegal" :rules="rulesLegal" :model="tempLegal" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                    <el-input v-model="tempLegal.corporationEntityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人实体名称" prop="corporationEntityName">
                    <el-input v-model="tempLegal.corporationEntityName" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchInfo()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="delInfo()">重置</el-button>
                </div>
            </el-form>
            <el-table v-loading = "legalListLoading" :data="legalTableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                
                <el-table-column width="80" align="center" label="选择">
                    <template slot-scope="{row, $index}">
                        <el-radio v-model="templateRadio" :label="$index" @change.native="getTemplateRow(row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
                <el-table-column prop="corporationEntityName" label="法人实体名称" align="center" />
            </el-table>
            <pagination v-show="legalTotal>0" :total="legalTotal" :page.sync="legalFormObj.pageNum" :limit.sync="legalFormObj.pageSize" @pagination="getlegalList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subLegalData()"> 确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleLegal = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" 
                    :rules="[ { required: true, message: '法人实体编号不能为空'}]">
                    <el-input v-model="tempUp.corporationEntityNo" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品对象" prop="productObjectCode">
                <el-select v-model="tempUp.productObjectCode" @change="up_cardBinChange($event)" class="wd200">
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.productDesc"
                        :value="item.productObjectCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介对象" prop="mediaObjectCode">
                    <el-select v-model="tempUp.mediaObjectCode" class="wd200">
                        <el-option
                            v-for="(item, index ) in mediaObjectCodeOptions"
                            :key="index"
                            :label="item.mediaObjectDesc"
                            :value="item.mediaObjectCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版代码" prop="formatCode">
                 <el-select v-model="tempUp.formatCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in formatCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="申请数量" prop="applyNumber">
                   <el-input v-model="tempUp.applyNumber" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--查询-->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" 
                    :rules="[ { required: true, message: '法人实体编号不能为空'}]">
                    <el-input v-model="tempDetail.corporationEntityNo" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品对象" prop="productObjectCode">
                <el-select v-model="tempDetail.productObjectCode" @change="up_cardBinChange($event)" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in productObjectCodeOptions"
                        :key="index"
                        :label="item.productDesc"
                        :value="item.productObjectCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="媒介对象" prop="mediaObjectCode">
                    <el-select v-model="tempDetail.mediaObjectCode" class="wd200" disabled>
                        <el-option
                            v-for="(item, index ) in mediaObjectCodeOptions"
                            :key="index"
                            :label="item.mediaObjectDesc"
                            :value="item.mediaObjectCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡版代码" prop="formatCode">
                 <el-select v-model="tempDetail.formatCode" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in formatCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="申请日期" prop="applyNumber">
                   <el-input v-model="tempDetail.applyDate" class="wd200" type="text" disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="申请数量" prop="applyNumber">
                   <el-input v-model="tempDetail.applyNumber" class="wd200" type="text" disabled/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
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
            list_formatCode: '',
            // 下拉框
            disabled1: true,
            originListOptions:[],// 运营模式 
            productObjectCodeOptions: [],//产品对象
            mediaObjectCodeOptions: [],//媒介对象
            cardBinOptions: [],//卡BIN
            formatCodeOptions: [],//卡板代码
            //formatCodeOptions: [],
            cardStatusOptions: [],//预留卡号状态
            /*----新增----*/
            tempAdd: {}, // 新增
            newLegal: '',
            dialogFormVisibleAdd: false,
            rulesAdd: {},
            rulesUp: {},
            //选择法人实体编号
            dataFormLegal: {},
            tempLegal: {},
            rulesLegal: {},
            legalTableList: [],
            legalTotal: 0,
            legalFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            legalListLoading: false,
            dialogFormVisibleLegal: false,
            //修改
            dataFormUp:{},
            tempUp: {}, // 修改
            up_segmentNumber: '',
            dialogFormVisibleUp: false,
            //查询
            tempDetail: {}, // 详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            rulesDetail: {},
            detail_segmentNumber: '',
        }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            console.log(this.logininfo)
            this.getList()
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
            //产品对象
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0013").then(res => {
                res.forEach(item=>{
                     item.productDesc = item.productDesc+ ' '+ item.productObjectCode
                })
                this.productObjectCodeOptions = res
            })
            //媒介对象
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0017").then(res => {
                res.forEach(item =>{
                    item.mediaObjectDesc = item.mediaObjectCode+ ' '+ item.mediaObjectDesc
                })
                this.mediaObjectCodeOptions = res
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
                            this.eventList += item.eventNo+','
                        })
                        if (this.eventList.includes('COS.IQ.02.0163') != -1){ // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('COS.AD.02.0167') != -1) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('COS.UP.02.0154') != -1) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
        //监听产品对象
        productObjectCodeChange(val){
            this.formatCodeOptions = []
            this.list_formatCode = val
            //console.log(this.list_formatCode)
            this.getSegmentNumberOptions()
        },
        //管控场景代码
        getSegmentNumberOptions() {
            let params = {
                productObjectCode: this.list_formatCode,
            }
            this.post('/beta/betaService/COS.IQ.02.0054', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.disabled1 = false 
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.formatCodeDesc = item.formatCode+ '' +item.formatDescribe
                            arr[index] = {
                                label: item.formatCodeDesc,
                                value: item.formatCode
                            }
                        })
                        this.formatCodeOptions = arr
                    } else {
                        this.formatCodeOptions = []
                        this.disabled1 = true
                    }
                }
            })
        },
       // 列表
        getList() {
            this.listLoading1 = true
            let params = {
                autoQuery: false,
                corporationEntityNo: this.logininfo.corporationEntityNo,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_prefabCardFlag'],//查找数据字典所需参数
                transDict : ['applyFlag'],//翻译前后key
            }
            params = Object.assign(this.queryFormObj, params)   //合并
            this.getTableList('/beta/betaService/COS.IQ.02.0163', params,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoading1 = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                        this.tableList.forEach(item =>{
                            item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productObjectCodeDesc
                            item.newMediaObjectCodeDesc = item.mediaObjectCode+ ' '+ item.mediaObjectCodeDesc
                            item.newFormatCodeDesc =item.formatCodeDesc + '' + item.formatCode

                        })
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
        closeAdd(){
            this.dialogFormVisibleAdd = false
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].resetFields()
            })
        },
        
        //监听卡BIN
        add_cardBinChange(val){
            this.formatCodeOptions = []
            this.add_segmentNumber = val
            //console.log(val)
            this.add_getSegmentNumberOptions()
        },
        //特殊号码段号
        add_getSegmentNumberOptions() {
            let params = {
                productObjectCode: this.add_segmentNumber,
            }
            //console.log(23)
            this.post('/beta/betaService/COS.IQ.02.0054', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.formatCodeDesc = item.formatCode+ '' +item.formatDescribe
                            arr[index] = {
                                label: item.formatCodeDesc,
                                value: item.formatCode
                            }
                        })
                        this.formatCodeOptions = arr
                    } else {
                        this.formatCodeOptions = []
                    }
                }
            })
        },
        //显示选择法人实体编号弹框
        chosecorporation(){
            this.dialogFormVisibleLegal = true
            this.getlegalList()
            this.$nextTick(() => {
                this.$refs['dataFormLegal'].clearValidate()
            })
        },
        //查询法人实体编号
        searchInfo(){
            this.getlegalList()
        },
        //法人实体编号列表
        getlegalList(){
            this.legalListLoading = true
            let obj = {
                pageNum: this.legalFormObj.pageNum,
                pageSize: this.legalFormObj.pageSize,
                corporationEntityNo: this.tempLegal.corporationEntityNo,
                corporationEntityName: this.tempLegal.corporationEntityName
            }
            this.getTableList('/beta/betaService/COS.IQ.02.0037', obj,(res) => {
                if (res.returnCode == '000000') {
                    this.legalListLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.legalTableList = res.returnData.rows
                        this.legalTotal = res.returnData.totalCount
                        
                    }
                }
            }) 
        },
        //获取单选数据
        getTemplateRow(row){
            this.newLegal = row
        },
        //确认提交法人实体编号
        subLegalData(item){
            this.tempAdd.corporationEntityNo = this.newLegal.corporationEntityNo
            this.dialogFormVisibleLegal = false
        },
        //重置
        delInfo(){
            this.tempLegal={}
        },
        //确认新增数据 
        createData() {
           this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/COS.AD.02.0167',this.tempAdd, (res) => {
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
            this.dialogFormVisibleUp = true
            this.up_getSegmentNumberOptions()
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //监听产品对象
        up_cardBinChange(val){
            this.formatCodeOptions = []
            this.up_segmentNumber = val
            this.add_getSegmentNumberOptions()
        },
        //卡板代码
        up_getSegmentNumberOptions() {
            let params = {
                productObjectCode: this.up_segmentNumber,
            }
            this.post('/beta/betaService/COS.IQ.02.0054', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.formatCodeDesc = item.formatCode+ '' +item.formatDescribe
                            arr[index] = {
                                label: item.formatCodeDesc,
                                value: item.formatCode
                            }
                        })
                        this.formatCodeOptions = arr
                    } else {
                        this.formatCodeOptions = []
                    }
                }
            })
        },
        //确认修改数据
        updateData() {
           this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/COS.UP.02.0154', this.tempUp, (res) => {
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
//      //查询详情
        detailInfo(row) {
            this.tempDetail = Object.assign({}, row)
            this.detail_segmentNumber=row.formatCode
            this.dialogFormVisibleDetail = true
            this.detail_getSegmentNumberOptions()
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
//      //特殊号码段号
        detail_getSegmentNumberOptions() {
            let params = {
                productObjectCode: this.detail_segmentNumber,
            }
            this.post('/beta/betaService/COS.IQ.02.0054', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.formatCodeDesc = item.formatCode+ '' +item.formatDescribe
                            arr[index] = {
                                label: item.formatCodeDesc,
                                value: item.formatCode
                            }
                        })
                        this.formatCodeOptions = arr
                    } else {
                        this.formatCodeOptions = []
                    }
                }
            })
        },
    }
}
</script>

<style>
</style>
