<!-- 卡号池请求 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                <el-input v-model="queryFormObj.corporationEntityNo" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                <el-input v-model="queryFormObj.binNo" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
            <el-table-column prop="binNo" label="发行卡BIN" align="center" />
            <el-table-column prop="enableIdentificationDesc" label="自动生成标识" align="center" />
            <el-table-column prop="surplusAvailableCardnum" label="剩余可用卡量" align="center" />
            <el-table-column prop="calorimeterValue" label="卡量阈值" align="center" />
            <el-table-column prop="everyTimeGenCardnum" label="   每次生成卡量" align="center" />
            <el-table-column prop="nextDate" label="下一生成日期" align="center" />
            <el-table-column prop="prevDate" label="上一生成日期" align="center" />
            <el-table-column prop="prevCardnum" label="上次生成卡量" align="center" />
            <el-table-column prop="generateCardnum" label="生成卡号总量 " align="center" />
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-more" type="primary" @click="detailInfo(row)" v-show="selBtnFlag">查询</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="卡号池请求建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <!-- :rules="[ { required: true, message: '法人实体编号不能为空'}]" -->
                <el-form-item class="cl_td red" label="法人实体编号" prop="corporationEntityNo" >
                    <el-input v-model="tempAdd.corporationEntityNo" @focus="chosecorporation()" class="wd200" type="text"/>
                </el-form-item>
                <!-- :rules="[ { required: true, message: '发行卡BIN不能为空'}]" -->
                <el-form-item class="cl_td red" label="发行卡BIN" prop="binNo">
                   <el-input v-model="tempAdd.binNo" class="wd200" type="text" @focus="choseCardBin()"/>
                </el-form-item>
                <el-form-item class="cl_td" label="是否启用" prop="enableIdentification" 
                    :rules="[ { required: true, message: '是否启用不能为空'}]">
                    <el-select v-model="tempAdd.enableIdentification" class="wd200">
                    <el-option
                        v-for="(item, index ) in enableIdentificationOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="自动生成标识" prop="automaticGenerateFlag"
                    :rules="[ { required: true, message: '自动生成标识不能为空'}]">
                    <el-select v-model="tempAdd.automaticGenerateFlag" class="wd200">
                        <el-option
                            v-for="(item, index ) in automaticGenerateFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡量阈值" prop="calorimeterValue"
                    :rules="[ { required: true, message: '卡量阈值不能为空'}]">
                   <el-input v-model="tempAdd.calorimeterValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="下一生成日期" prop="nextDate"
                    :rules="[ { required: true, message: '下一生成日期不能为空'}]">
                    <el-date-picker class="wd200"
                        v-model="tempAdd.nextDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="每次生成卡量" prop="everyTimeGenCardnum"
                    :rules="[ { required: true, message: '每次生成卡量不能为空'}]">
                   <el-input v-model="tempAdd.everyTimeGenCardnum" class="wd200" type="text" />
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
            <el-table 
                v-loading = "legalListLoading" 
                :data="legalTableList" 
                class="mbtm20" 
                fit 
                highlight-current-row  
                style="width: 100%;" 
                border
            
                @row-click="getTemplateRow1"
                @current-change="handleCurrentChosedChange1"
            >
                <el-table-column width="80" align="center" label="选择">
                    <template slot-scope="scope">
                        <!-- @change.native="getTemplateRow(scope.row)" -->
                        <el-radio v-model="templateRadio1" :label="scope.row.corporationEntityNo" >
                            <span class="el-radio__label"></span>
                        </el-radio>
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
        <!--选择发卡行卡BIN-->
        <el-dialog title="选择发卡行卡BIN" :visible.sync="dialogFormVisibleCardBin" width="65%">
            <el-form ref="dataFormCardBin" :rules="rulesCardBin" :model="tempCardBin" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                    <el-input v-model="tempCardBin.corporationEntityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-input v-model="tempCardBin.binNo" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchCardBin()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="delCardBinInfo()">重置</el-button>
                </div>
            </el-form>
            <el-table 
                v-loading = "cardBinListLoading" 
                :data="cardBinTableList" 
                class="mbtm20" 
                fit 
                highlight-current-row  
                style="width: 100%;" 
                border
                @current-change="handleCurrentChosedChange2"
                @row-click="getTempCardBinRow2"
            
            >
                <el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <!-- @change.native="getTempCardBinRow(scope.row)" -->
                        <el-radio v-model="templateRadio2" :label="scope.row.binNo" >
                            <span class="el-radio__label"></span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="binNo" label="发行卡BIN" align="center" />
                <el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
                <el-table-column prop="cardSchemeDesc" label="卡组织" align="center" />
                <el-table-column prop="cardTypDesc" label="卡类型" align="center" />
            </el-table>
            <pagination v-show="cardBinTotal>0" :total="cardBinTotal" :page.sync="cardBinFormObj.pageNum" :limit.sync="cardBinFormObj.pageSize" @pagination="getCardBinList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subCardBinData()"> 确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleCardBin = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!--end实体编号2-->
        <!-- 修改 -->
        <el-dialog title="卡号池请求修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo" 
                    :rules="[ { required: true, message: '法人实体编号不能为空'}]">
                    <el-input v-model="tempUp.corporationEntityNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo"
                    :rules="[ { required: true, message: '发行卡BIN不能为空'}]" >
                   <el-input v-model="tempUp.binNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="是否启用" prop="enableIdentification" 
                    :rules="[ { required: true, message: '是否启用不能为空'}]">
                    <el-select v-model="tempUp.enableIdentification" class="wd200">
                    <el-option
                        v-for="(item, index ) in enableIdentificationOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="自动生成标识" prop="automaticGenerateFlag"
                    :rules="[ { required: true, message: '自动生成标识不能为空'}]">
                    <el-select v-model="tempUp.automaticGenerateFlag" class="wd200">
                        <el-option
                            v-for="(item, index ) in automaticGenerateFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡量阈值" prop="calorimeterValue"
                    :rules="[ { required: true, message: '卡量阈值不能为空'}]">
                   <el-input v-model="tempUp.calorimeterValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="下一生成日期" prop="nextDate"
                    :rules="[ { required: true, message: '下一生成日期不能为空'}]">
                    <el-date-picker class="wd200"
                        v-model="tempUp.nextDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="每次生成卡量" prop="everyTimeGenCardnum"
                    :rules="[ { required: true, message: '每次生成卡量不能为空'}]">
                   <el-input v-model="tempUp.everyTimeGenCardnum" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="剩余可用卡量" prop="surplusAvailableCardnum"
                    :rules="[ { required: true, message: '剩余可用卡量不能为空'}]">
                   <el-input v-model="tempUp.surplusAvailableCardnum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="上次生成卡量" prop="prevCardnum"
                    :rules="[ { required: true, message: '上次生成卡量不能为空'}]">
                   <el-input v-model="tempUp.prevCardnum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="生成卡号总量" prop="generateCardnum"
                    :rules="[ { required: true, message: '生成卡号总量不能为空'}]">
                   <el-input v-model="tempUp.generateCardnum" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--查询-->
        <el-dialog title="卡号池请求详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityNo">
                    <el-input v-model="tempDetail.corporationEntityNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                   <el-input v-model="tempDetail.binNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="是否启用" prop="enableIdentification">
                    <el-select v-model="tempDetail.enableIdentification" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in enableIdentificationOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="自动生成标识" prop="automaticGenerateFlag">
                    <el-select v-model="tempDetail.automaticGenerateFlag" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in automaticGenerateFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡量阈值" prop="calorimeterValue">
                   <el-input v-model="tempDetail.calorimeterValue" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="上一生成日期" prop="prevDate">
                    <el-date-picker class="wd200"
                        v-model="tempDetail.prevDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" readonly disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="下一生成日期" prop="nextDate">
                    <el-date-picker class="wd200"
                        v-model="tempDetail.nextDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" readonly disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="每次生成卡量" prop="everyTimeGenCardnum">
                   <el-input v-model="tempDetail.everyTimeGenCardnum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="剩余可用卡量" prop="surplusAvailableCardnum">
                   <el-input v-model="tempDetail.surplusAvailableCardnum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="上次生成卡量" prop="prevCardnum">
                   <el-input v-model="tempDetail.prevCardnum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="生成卡号总量" prop="generateCardnum">
                   <el-input v-model="tempDetail.generateCardnum" class="wd200" type="text" readonly/>
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
            templateRadio1: '', // 新增 选择的法人实体
            templateRadio2: '', // 新增 选择的发卡行BIN 

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
            originListOptions:[],// 运营模式 
            enableIdentificationOptions: [],//是否启用
            automaticGenerateFlagOptions: [],//自动生成标识
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
            //发行卡BIN选择法人实体编号
            dialogFormVisibleCardBin: false,
            tempCardBin: {},    
            dataFormCardBin: {},
            cardBinTotal: 0,  
            cardBinFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            rulesCardBin: {},
            cardBinTableList: [],   
            cardBinListLoading: false,
            newCardBin: '',
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
//          /console.log(this.logininfo)
            this.getList()
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
            //是否启用
            this.getSelectDict( "dic_enableFlag").then(res => {
                this.enableIdentificationOptions = res
            })
            //自动生成标识
            this.getSelectDict( "dic_automaticGenerateFlag").then(res => {
                this.automaticGenerateFlagOptions = res
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
                            if (this.eventList.includes('COS.IQ.02.0121') != -1) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                            if (this.eventList.includes('COS.AD.02.0106') != -1) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.eventList.includes('COS.UP.02.0106') != -1) { // 维护
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
                let params = {
                    autoQuery: false,
                    // corporationEntityNo: this.logininfo.corporationEntityNo,
                    isTrans: true,//是否需要翻译数据字典
                    transParams : ['dic_prefabCardFlag','dic_cardType','dic_enableFlag'],//查找数据字典所需参数
                    transDict : ['applyFlag','cardTyp','enableIdentification'],//翻译前后key
                }
                params = Object.assign(this.queryFormObj, params)   //合并
                this.getTableList('/beta/betaService/COS.IQ.02.0121', params,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tableList = res.returnData.rows
                            this.tableTotal = res.returnData.totalCount
                            this.listLoading1 = false
                            this.tableList.forEach(item =>{
                                item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productObjectCodeDesc
                                item.newMediaObjectCodeDesc = item.mediaObjectCode+ ' '+ item.mediaObjectCodeDesc
                                item.newFormatCodeDesc =item.formatCodeDesc + '' + item.formatCode
    
                            })
                        } else {
                            this.tableList = []
                            this.tableTotal = 0
                            this.listLoading1 = false
                        }
                    }
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
            closeAdd(){
                this.dialogFormVisibleAdd = false
                this.$nextTick(() => {
                    this.$refs['dataFormAdd'].resetFields()
                })
            },
            //显示选择法人实体编号弹框
            chosecorporation(){
                if (this.tempAdd.corporationEntityNo) {
                    this.templateRadio1 = this.tempAdd.corporationEntityNo
                } else {
                    this.templateRadio1 = ''
                }
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
                            
                        } else {
                            this.legalTableList = []
                            this.legalTotal = 0
                        }
                    }
                }, (err) => {
                    this.legalTableList = []
                    this.legalTotal = 0
                    this.legalListLoading = false
                })
            },
            //获取单选数据
            getTemplateRow1(row){
                this.newLegal = row
                this.templateRadio1 = row.corporationEntityNo
                // this.newLegal = JSON.parse(JSON.stringify(row));
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
            /*显示发卡行卡BIN法人实体编号弹框*/
           //显示选择法人实体编号弹框
            choseCardBin(){
                if (this.tempAdd.binNo) {
                    this.templateRadio2 = this.tempAdd.binNo
                } else {
                    this.templateRadio2 = ''
                }
                this.dialogFormVisibleCardBin = true
                this.getCardBinList()
                this.$nextTick(() => {
                    this.$refs['dataFormCardBin'].clearValidate()
                })
            },
            //卡BIN查询法人实体编号
            searchCardBin(){
                this.getCardBinList()
            },
            //卡BIN法人实体编号列表
            getCardBinList(){
                this.cardBinListLoading = true
                let obj = {
                    pageNum: this.cardBinFormObj.pageNum,
                    pageSize: this.cardBinFormObj.pageSize,
                    corporationEntityNo: this.tempCardBin.corporationEntityNo,
                    corporationEntityName: this.tempCardBin.corporationEntityName,
                    isTrans: true,
                    transParams:['dic_cardScheme','dic_cardType'],
                    transDict : ['cardScheme','cardTyp']
                }
                this.getTableList('/beta/betaService/COS.IQ.02.0011', obj,(res) => {
                    if (res.returnCode == '000000') {
                        this.cardBinListLoading = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.cardBinTableList = res.returnData.rows
                            this.cardBinTotal = res.returnData.totalCount
                            
                        } else {
                            this.cardBinTableList = []
                            this.cardBinTotal = 0
                        }
                    }
                }, (err) => {
                    this.cardBinTableList = []
                    this.cardBinTotal = 0
                    this.cardBinListLoading = false
                })
            },
            //卡BIN获取单选数据
            getTempCardBinRow2(row){
                this.newCardBin = row
                this.templateRadio2 = row.binNo
                //  this.newCardBin = JSON.parse(JSON.stringify(row));
            },
            //确认提交法人实体编号
            subCardBinData(){
                this.tempAdd.binNo = this.newCardBin.binNo
                this.dialogFormVisibleCardBin = false
            },
            //重置
            delCardBinInfo(){
                this.tempCardBin={}
            },
            //确认新增数据 
            createData() {
               this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        if (!this.tempAdd.corporationEntityNo) {
                            this.$message({
                                title: "提示",
                                message: "法人实体编号不能为空",
                                type: "warning",
                                duration: 2000
                            })
                            return
                        }
                        if (!this.tempAdd.binNo) {
                            this.$message({
                                title: "提示",
                                message: "发行卡BIN不能为空",
                                type: "warning",
                                duration: 2000
                            })
                            return
                        }
                        this.post('/beta/betaService/COS.AD.02.0106',this.tempAdd, (res) => {
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
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            }, 
            //确认修改数据
            updateData() {
               this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/COS.UP.02.0106', this.tempUp, (res) => {
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
            //查询详情
            detailInfo(row) {
                this.tempDetail = Object.assign({}, row)
                this.detail_segmentNumber=row.formatCode
                this.dialogFormVisibleDetail = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
            }, 
            // 法人实体
            handleCurrentChosedChange1(row) {
                this.newLegal  = row
            },
            // 发卡
            handleCurrentChosedChange2(row) {
                this.newCardBin  = row
            },
           
    }
}
</script>

<style>
</style>
