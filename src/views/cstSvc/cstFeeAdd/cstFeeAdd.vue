<!-- 客户增值服务费 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="transForm" :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200">
                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="查询类型" prop="codes">
                <el-select v-model="queryForm.codes" class="wd200">
                    <el-option v-for="(item, index) in periodicFeeIdentifierOptions" 
                        :key="index" 
                        :label="item.concat" 
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div v-if="isShow">
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                    <el-input v-model="addInfo.productObjectCode" class="wd200" type="text" />
                </el-form-item>
            </div>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!--客户定价标签信息-->
        <div v-if='isShow'>
            <el-form ref="addInfoRef" :model="addInfo">
                 <div class="leftmenu_navtitle ">增值服务费</div>
                 <div class="clearboth"></div>
                <div class="text_title">1. 客户基本信息</div>
                <el-form-item class="cl_td" label="账户代码" prop="customerNo">
                    <el-input v-model="addInfo.customerNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="客户名称" prop="customerName">
                    <el-input v-model="addInfo.customerName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                    <el-input v-model="addInfo.idNumber" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--利息累计信息-->
            <div class="text_title">2. 选择费用项目</div>
             <el-form :model="chooseCost">
                <el-form-item class="cl_td" label="收费项目 " prop="feeItemNo">
                    <el-input v-model="chooseCost.feeItemNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收费项目描述" prop="feeDesc">
                    <el-input v-model="chooseCost.feeDesc" class="wd200" type="text" />
                </el-form-item>
             </el-form>    
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">搜索</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="saveSelect()">关联</el-button>
            </div>   
            <el-table class="mbtm20 " border v-loading="listLoading1" ref="multipleTable" :data="chooseCostList1"
                tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange2">
                <el-table-column  type="selection"  width="55">
                </el-table-column>
                <el-table-column prop="feeItemNo" label="收费项目编号" align="center" width="230"/>
                <el-table-column prop="feeTypeDesc" label="费用类别" align="center"  width='120'/>
                <el-table-column prop="feeDesc" label="费用描述" align="center" width="150" />
                <el-table-column prop="instanCode1Desc" label="实例维度1" align="center" width="120"/>
                <el-table-column prop="instanCode2Desc" label="实例维度2" align="center" />
            </el-table>
            <pagination v-show="tableTotal1 > 0" :total="tableTotal1" :page.sync="listPage1.pageNum" :limit.sync="listPage1.pageSize" @pagination="getChoiceCost" />
            <div class="text_title">3.已选择收费项目</div>
            <el-table v-loading="listLoading2" :data="chooseCostList2" class="mbtm20 " border fit highlight-current-row 
                 style="width: 100%;" row-key="id" lazy >
                <el-table-column prop="feeItemNo" label="收费项目编号" align="center"  />
                <el-table-column prop="feeDesc" label="费用描述" align="center" />
                <el-table-column prop="periodicFeeIdentifier" label="增值服务费标识" align="center" />
                <el-table-column prop="expirationDate" label="失效时间" align="center" />
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="deleteControl(row)">删除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <div  slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="addFeeItem()"> 确定 </el-button>
             </div>
        </div>
        <!--基本账户信息-->
        <el-dialog title="基本账户信息" :visible.sync="dialogFormVisibleInterest" width='80%'>
            <el-table v-loading="interestLoading" :data="tablesList" class="mbtm20 " border fit highlight-current-row 
                tooltip-effect="dark" style="width: 100%;" row-key="id" lazy >
                <el-table-column label="选择" width="65">
                    <template scope="scope">
                         <el-radio :label="scope.$index" v-model="curRowRadio" @change="getCurrentRow(scope.row)"><i></i></el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="productObjectCode" label="客户号" align="center"  />
                <el-table-column prop="productDesc" label="收费维度1" align="center" />
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
            <div  slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="getAccountInfo()"> 确定 </el-button>
                <el-button type="primary" @click="dialogFormVisibleInterest = false"> 关闭 </el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
    import Pagination from "@/components/Pagination";
    export default {
        name: 'tableList',
        components: {
            Pagination,
        },
        data() {
            return {
                radio: '1',
                btnAuthStr: '',
                queryForm: {},
                price: {},//账户基本信息form
                interestInfoList: [],//利息累计列表
                accountRef: {},
                isShow: false,
                operationMode: '',
                //1. 增值服务费
                addInfo: {},
                //2.选择费用项目
                chooseCostList1: [],
                tableTotal1: 0,
                listLoading1: false,
                listPage1:{
                    pageNum: 1,
                    pageSize: 10,
                },
                //3.已选择费用项目 chooseCost
                chooseCost: {},
                chooseCostList2: [],
                tableTotal2: 0,
                listLoading2: false,
                listPage2:{
                    pageNum: 1,
                    pageSize: 10,
                },
                
                // 弹框主账户&&子账户列表
                tablesList: [],//主账户列表
                multipleSelection: [],
                multipleList: [],
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                interestLoading: false,
                total: 0,
                dialogFormVisibleInterest: false,
                curRowRadio: "",
                curRow: {},
                //下拉
                idTypeList: [],
                periodicFeeIdentifierOptions: [],
            }
        },
        created() {
            let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
            this.operationMode=logininfo.operationMode;
        },
        mounted() {
            //证件类型
            this.getSelectDict('dic_certificateType').then((res) => {
                this.idTypeList = res
            })
            //查询类型
            let obj={
                groupsCode: "dic_periodArray2",
                queryFlag: "1",
                type: "DROPDOWNBOX",
            }
            this.getSelectDict('/beta/betaService/COS.IQ.02.0150',obj).then((res) => {
                res.forEach(item => {
                    item.concat = item.codes + ' ' + item.detailDesc
                });
                this.periodicFeeIdentifierOptions = res
            })

        },
        methods: {
            init() {
                this.queryForm = {
                    idType: '',
                    idNumber: '',
                    externalIdentificationNo: '',
                    codes: '',
                    //      pageNum: 1,
                    //      pageSize: 10
                }
                this.isShow = false // 结息交易列表
                this.showDetail = false // 结息明细
                this.showTransUint = false // 交易单元计息明细 三级表格
            },
            // 重置
            reset() {
                this.init()
            },
            // 点击查询按钮
            handleSearch() {
                if(!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                    this.$message({
                        message: '请输入查询信息',
                        type: 'warning'
                    })
                    this.init()
                }else {
                    if(this.queryForm.idType) {
                        if(!this.queryForm.idNumber) {
                            this.$message({
                                message: '请输入证件号码',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    } else if(this.queryForm.idNumber) {
                        if(!this.queryForm.idType) {
                            this.$message({
                                message: '请输入证件类型',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    }else if(!this.queryForm.externalIdentificationNo) {
                        if(!this.queryForm.codes || this.queryForm.codes==undefined) {
                            this.$message({
                                message: '请输入查询类型',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    }else if(this.queryForm.idType !='' && this.queryForm.idNumber !='') {
                       if(!this.queryForm.codes || this.queryForm.codes==undefined) {
                            this.$message({
                                message: '请输入查询类型',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    }
                    else {
                        this.getList()
                    }
                }
            },
            // 查询列表
            getList() {
                this.interestLoading = true
                this.dialogFormVisibleInterest = true
                let obj = {
                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                    idNumber: this.queryForm.idNumber,
                    idType: this.queryForm.idType,
                    falg: "2" ,
                    periodicFeeIdentifier:  this.queryForm.codes,
                }
                this.queryForm = Object.assign(this.queryForm, this.queryFormObj, obj);
                delete this.queryForm.codes
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0004', this.queryForm, (res) => {
                    if(res.returnCode == '000000') {
                        this.interestLoading = false
                        if(res.returnData != null) {
                            if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                this.tablesList = res.returnData.rows
                                this.tablesList.periodicFeeIdentifier = obj.periodicFeeIdentifier
                                this.total = res.returnData.totalCount
                             } else {
                                this.tablesList = []
                            }
                        }
                    }
                })
            },
            handleSelectionChange2(val){
                this.multipleList = val;
            },
            //选择费用项目 
            getCurrentRow(val) {
                this.multipleSelection = val;
            },
            //确认基本账户信息
            getAccountInfo () {
                this.isShow = true
                this.dialogFormVisibleInterest = false
                let obj = {
                    falg: '2',
                    periodicFeeIdentifier:  this.tablesList.periodicFeeIdentifier,
                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                    idType: this.queryForm.idType,
                    idNumber: this.queryForm.idNumber,
                }
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0001', obj, (res) => {
                    if(res.returnCode == '000000') {
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.addInfo = res.returnData.rows[0]//form
                            this.addInfo.productObjectCode= this.multipleSelection.productObjectCode
                            this.getChoiceCost()
                            this.getAlreadyCost()
                        } 
                    }
                })
            },
            //2.选择费用项目
            getChoiceCost(){
                this.listLoading1 = true
                let obj = {
                    periodicFeeIdentifier:  this.tablesList.periodicFeeIdentifier,
                }
                obj = Object.assign(obj, this.listPage1);
                this.getTableList('/beta/betaService/COS.IQ.02.0031', obj, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoading1 = false
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.chooseCostList1 = res.returnData.rows//list
                            this.tableTotal1 = res.returnData.totalCount//条数
                        } 
                    }
                })
            },
            //3.已选择收费项目
            getAlreadyCost(){
                this.listLoading2 = true
                let obj= {
                    falg: '2',
                    periodicFeeIdentifier:  this.tablesList.periodicFeeIdentifier,
                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                    idType: this.queryForm.idType,
                    idNumber: this.queryForm.idNumber,
                }
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0065', obj, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoading2 = false
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                           this.chooseCostList2 = res.returnData.rows//list
                            this.tableTotal2 = res.returnData.totalCount//条数

                        } 
                        
                    }
                }) 
            },
            //关联
            saveSelect() {
                //console.log(this.chooseCostList2)
                var that = this;
                if(this.chooseCostList2 == undefined || this.chooseCostList2.length <= 0){
                   this.chooseCostList2 = this.multipleList;
                }else{
                let tipStr = '收费项目编号已存在，不在添加！';
                let newList = [];  //保存遍历时要留下的项
                for(let len = 0; len<that.multipleList.length;len++){
                    let item = that.multipleList[len]
                    let isExist = false;
                    for(var j = 0; j <  that.chooseCostList2.length; j++){
                        var id = that.chooseCostList2[j].feeItemNo;
                        if(item.feeItemNo== id){
                            tipStr += item.feeItemNo + ',';
                           // tipStr = tipStr + items.feeItemNo + ",";
                            this.$message({
                                message: tipStr,
                                type: 'warning'
                            })
                            isExist = true;
                            break;
                        }
                     }
                    if(!isExist){
                       newList.push(item);
                    }
                }
                that.chooseCostList2  = that.chooseCostList2.concat(newList)
             }
                this.multipleList = [];
            },
            //删除关联数据
            deleteControl(row,index){
               this.chooseCostList2.splice(index,1)
            },
            addFeeItem() {
                let controlAdd = {
                    //corporation: "1000102"
                    customerNo: this.addInfo.customerNo,
                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                    operationMode: this.operationMode,
                    productObjectCode: this.addInfo.productObjectCode,
                    coreFeeItemList: this.chooseCostList2,
                }
                this.post('/nonfi/nonfinanceService/BSS.AD.01.0007', controlAdd, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleAdd = false
                        this.$notify({
                        title: 'Success',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.chooseCostList2 = [];
                        this.queryForm = {};
                        this.addInfo = {}
                        this.chooseCostList1 = []
                        this.chooseCost = {}
                        this.isShow =false
                    }
                })
            }
        }
    }
</script>

<style>

</style>