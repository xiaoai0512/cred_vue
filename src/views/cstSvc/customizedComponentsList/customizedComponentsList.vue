<!--客户个性化元件-->
<template>
    <div class="allContent">
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
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAdddate(queryForm)">新增</el-button>
            </div>
        </el-form>
        <!-- 列表 -->
        <div v-if="showDiv">
            <div class="text_title">客户基本信息</div>
            <el-form ref="cstInfRef" :model="cstInf">
                <el-form-item class="cl_td" label="证件类型" prop="idType">
                    <el-select v-model="cstInf.idType" class="wd200">
                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                    <el-input v-model="cstInf.idNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="客户姓名" prop="customerName">
                    <el-input v-model="cstInf.customerName" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <div class="text_title">已设置个性化元件</div>
            <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index" width="70px">
                </el-table-column>
                <el-table-column align="center" label="元件编号" prop="elementNo" />
                <el-table-column align="center" label="元件描述" prop="elementDesc" />
                <el-table-column align="center" label="生效日期" prop="effectDate" />
                <el-table-column align="center" label="失效日期" prop="uneffectDate" />
                <el-table-column align="center" label="设置日期" prop="setDate" />
                <el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="medium" icon="el-icon-edit" type="primary" @click="handleUp(row)">修改</el-button>
                        <el-button size="medium" icon="el-icon-edit" type="primary" @click="delList1(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination  v-show="total1>0" :total="total1" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize"  @pagination="getList" />
        </div>
        <!--新增-->
        <el-dialog title="新增定价标签" :visible.sync="dialogFormVisibleAddView" width='70%'>
            <div class="text_title">客户基本信息</div>
            <el-form ref="tempAddRef1" :model="tempAddInfo1">
                <el-form-item class="cl_td" label="证件类型" prop="idType">
                    <el-select v-model="tempAddInfo1.idType" class="wd200">
                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                    <el-input v-model="tempAddInfo1.idNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="客户姓名" prop="customerName">
                    <el-input v-model="tempAddInfo1.customerName" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <el-form ref="tempAddRef2" :model="tempAddInfo2">
                <div class="clearboth"></div>
                <div class="text_title">选择个性化元件</div>
                <el-form-item class="cl_td" label="元件编号" prop="elementNo">
                    <el-input v-model="tempAddInfo2.elementNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="元件描述" prop="elementDesc">
                    <el-input v-model="tempAddInfo2.elementDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchelmList()">搜索</el-button>
                    <el-button size="medium" icon="el-icon-plus" type="primary" @click="relationInfo()">关联</el-button>
                </div>
            </el-form>
            <el-table v-loading = "addlistLoading1" :data="tampAddList1"  class="mbtm20" fit highlight-current-row style="width: 100%;"  
                border @selection-change="add_controlSelectChange">
                <el-table-column type="selection" label="序号" width="55"></el-table-column>
                <el-table-column align="center"  label="元件编号" prop="elementNo" />
                <el-table-column align="center" label="元件描述" prop="elementDesc" />
            </el-table>
            <pagination  v-show="addTotal1>0" :total="addTotal1" :page.sync="tampAddPage1.pageNum" :limit.sync="tampAddPage1.pageSize"  @pagination="getAddList" />
            <div class="clearboth"></div>
            <div class="text_title">已选个性化元件</div>
            <el-table  v-loading="addlistLoading2" :data="tampAddList2" border fit highlight-current-row style="width: 100%;">
                <el-table-column align="center" label="元件编号" prop="elementNo" />
                <el-table-column align="center" label="生效日期" prop="effectDate" />
                <el-table-column align="center" label="失效日期" prop="uneffectDate" />
                <el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="medium" icon="el-icon-search" type="primary" @click="upList2(row)">修改</el-button>
                        <el-button size="medium"  type="primary" @click="delList2(row)">删除</el-button>
                      
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAddView = false">关闭</el-button>
                <el-button type="primary" @click="createData()">确认</el-button>
            </div>
        </el-dialog>  
        <!--客户定制元件信息-->
        <el-dialog title="客户定制元件信息" :visible.sync="dialogFormVisibleViewCustom" width='70%'>
            <el-form ref="customInfoRef" :model="customInfo">
                <template >
                    <el-form-item class="cl_td" label="标签生效日期" prop="effectDate" >
                        <el-date-picker
                            v-model="customInfo.effectDate"
                            type="date"
                            class="wd200"
                            value-format="yyyy-MM-dd" 
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="cl_td" label="标签失效日期" prop="uneffectDate" >
                        <el-date-picker
                            v-model="customInfo.uneffectDate"
                            align="right"
                            type="date"
                            class="wd200"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd" 
                            >
                        </el-date-picker>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subCustomData()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleViewCustom = false">关闭</el-button>
            </div>
        </el-dialog> 
        <!--修改-->
        <el-dialog title="修改客户定制元件信息" :visible.sync="dialogFormVisibleUpView" width='70%'>
            <el-form ref="tempUpRef" :model="tempUp">
                <el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="tempUp.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="元件号" prop="pricingLevel" >
                    <el-input v-model="tempUp.pricingLevel" class="wd200" type="text" readonly/>
                </el-form-item>
                <template >
                    <el-form-item class="cl_td" label="标签生效日期" prop="effectDate" >
                        <el-date-picker  
                            v-model="tempUp.effectDate"
                            type="date"
                            class="wd200"
                            value-format="yyyy-MM-dd" 
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="cl_td" label="标签失效日期" prop="uneffectDate" >
                        <el-date-picker     
                            v-model="tempUp.uneffectDate"
                            align="right"
                            type="date"
                            class="wd200"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd" 
                            >
                        </el-date-picker>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUpView = false">关闭</el-button>
                 <el-button type="primary" @click="subUpData()">确认</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
import ApiService from '@/api/api-service'
import Pagination from '@/components/Pagination'
export default {
    name: 'InterestQueryNew',
    components: {
        Pagination
    },
    data() {
        return {
            logininfo: '',
            queryForm: {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                pageNum: 1,
                pageSize: 10
            },
            showDiv: false, // 结息交易列表
            cstInf: {},
            cstInfRef: {},
            listLoading: true,
            list: null, // 列表
            total1: 0,
            //下拉
            idTypeList: [],
            pricingObjectOptions: [],//定价类型
            pricingTypeOptions: [],//定价区域
            pricingLevelOptions: [],//定价层级
            pricingLevelCodeOptions: [],//定价层级代码
            currencyArrOptions: [],//币种
            pcdTypeOptions: [],//取值类型
            pricingMethodOptions: [],//定价方式
            stateOptions: [],//状态
            //新增
            dialogFormVisibleAddView: false,
            tempAddInfo1: {},
            tempAddRef1: {},
            tempAddInfo2: {},
            tempAddRef2: {},
            addlistLoading1: false,
            tampAddList1: [],
            addTotal1: 0,
            tampAddPage1:{
                pageNum: 1,
                pageSize: 10
            },
            addlistLoading2: false,
            tampAddList2: [],
            add_listNew:[],//事件关联临时数组
            addTotal2: 0,
            newPricingLevelCode: '',
            mewForm: {},
            //新增修改关联个性化元件信息
            customInfoRef: {},
            dialogFormVisibleViewCustom: false,
            customInfo: {},
            //修改
            dialogFormVisibleUpView: false,
            tempUpRef: {},
            tempUp: {},
        }
    },
    created() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
    },
    mounted() {
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        //定价类型
        this.getSelectDict('dic_pricingType').then((res) => {
            this.pricingObjectOptions = res
        })
        //定价区域
        this.getSelectDict('dic_priceArea').then((res) => {
            this.pricingTypeOptions = res
        })
        //定价层级
        this.getSelectDict('dic_pricingLevel').then((res) => {
            this.pricingLevelOptions = res
        })
        //币种
        let obj = {
            operationMode: this.logininfo.operationMode
        }
        this.getSelectDict('/beta/betaService/COS.IQ.02.0034', obj).then((res) => {
            this.currencyArrOptions = res
        })
        //取值类型
        this.getSelectDict('dic_valueType').then((res) => {
            this.pcdTypeOptions = res
        })
        //定价方式
        this.getSelectDict('dic_priceModel').then((res) => {
           this.pricingMethodOptions = res
        })
    },
    methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                pageNum: 1,
                pageSize: 10
            }
            this.showDiv = false // 结息交易列表
            this.showTransUint = false // 交易单元计息明细 三级表格
        },
        // 重置
        reset() {
          this.init()
        },
        // 点击查询按钮
        handleSearch() {
            if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                this.$message({
                  message: '请输入查询信息',
                  type: 'warning'
                })
                this.searcheHandlee()
            } else {
                if (this.queryForm.idType) {
                    if (!this.queryForm.idNumber) {
                        this.$message({
                        message: '请输入证件号码',
                        type: 'warning'
                    })
                } else {
                    this.searcheHandlee()
                }
            } else if (this.queryForm.idNumber) {
                if (!this.queryForm.idType) {
                    this.$message({
                      message: '请输入证件类型',
                      type: 'warning'
                    })
                } else {
                    this.searcheHandlee()
                }
                } else {
                    this.searcheHandlee()
                }
            }
        },
        //查询执行函数获取基本信息
        searcheHandlee(){
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryForm, (res) => {
                if(res.returnCode == '000000') {
                   this.showDiv = true
                    if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.cstInf.idType = res.returnData.rows[0].idType;
                        this.cstInf.idNumber = res.returnData.rows[0].idNumber;
                        this.cstInf.customerName = res.returnData.rows[0].customerName;
                        this.cstInf.customerNo = res.returnData.rows[0].customerNo;
                        this.getList()
                    } 
                }else{
                    this.showDiv = false;
                }
            })
        },
        // 查询列表
        getList() {
            this.listLoading = true
            this.showDiv = true
            const obj = {
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_pricingLevel'],//查找数据字典所需参数
                transDict : ['pricingLevel'],//翻译前后key
            }
            this.queryForm = Object.assign(this.queryForm, obj)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0110', this.queryForm, (res) => {
                if(res.returnCode == '000000') {
                    this.listLoading = false
                    if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.list = res.returnData.rows
                        this.total1 = res.returnData.totalCount
                        
                    }else{
                        this.showDiv = false
                         this.list = []
                    }
                }
            })
        },
        //删除
        delList1(item){
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.post('/nonfi/nonfinanceService/BSS.UP.01.0045', item, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnMsg =='OK') {
                            this.$notify({
                              title: 'Success',
                              message: '删除成功',
                              type: 'success',
                              duration: 2000
                            })
                            this.getList()
                        } 
                    }
                })
            })
            
        },
        // 新增 按钮
        handleAdddate(row) {
            this.dialogFormVisibleAddView = true
            this.mewForm=row
            this.getAddList()
            this.getAddForm()
            this.getQueryDate()
            this.$nextTick(() => {
                this.$refs['tempAddRef1'].clearValidate()
            })
        }, 
         //搜索
        searchAddData(){
            this.getAddList()
        },
        //重置
        resetData(){
            this.tempAddObjInfo1={}
        },
        //新增表单基本信息
        getAddForm(){
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.mewForm, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.tempAddInfo1 = res.returnData.rows[0]
                    } 
                }
            })
        },
        //列表数据
        getAddList() {
            this.addlistLoading1 = true
            let obj = {
                isSpecialFlag: "Y",
                operationMode: this.logininfo.operationMode,
            }
            obj = Object.assign(this.tampAddPage1, obj)
            this.getTableList('/beta/betaService/COS.IQ.02.0009', obj, (res) => {
                this.addlistLoading1 = false
                if(res.returnCode == '000000'){
                    if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.tampAddList1 = res.returnData.rows
                        this.addTotal1 = res.returnData.totalCount
                    }
                }
            })
        },
        //新增关联数据
        // 新增 关联
        relationInfo(val) {
            var that = this;
            if(this.tampAddList2 == undefined || this.tampAddList2.length <= 0){
            this.tampAddList2 = this.add_listNew;
            }else{
            let newList = [];  //保存遍历时要留下的项
            for(let len = 0; len<that.add_listNew.length;len++){
                let item = that.add_listNew[len]
                let isExist = false;
                for(var j = 0; j <  that.tampAddList2.length; j++){
                var id = that.tampAddList2[j].elementNo;
                if(item.elementNo== id){
                    isExist = true;
                    break;
                }
            }
            if(!isExist){
               newList.push(item);
                }
            }
            that.tampAddList2  = that.tampAddList2.concat(newList)
            
            }
            this.add_listNew = [];
        },
        // 新增弹窗中 选择事件
        add_controlSelectChange(val) {
            this.add_listNew = val;
        },
        //删除关联数据
        delList2(row,index){
           this.tampAddList2.splice(index,1)
        },
        //修改个性化元件日期显示弹框
        upList2(row) {
            this.dialogFormVisibleViewCustom = true
            this.customInfo=row
            this.$nextTick(() => {
                this.$refs['customInfoRef'].clearValidate()
            })
        },
        subCustomData(){
           if( this.customInfo.effectDate < this.customInfo.uneffectDate){
                this.$message("失效日期不能小于生效日期")
                return;
            }
            this.tampAddList2.forEach(item => {
                if(item.elementNo==this.customInfo.elementNo){
                    this.tampAddList2[item]=this.customInfo
                }
            })
            this.dialogFormVisibleViewCustom = false
        },
        //提交新增数据
        createData() {
            let  params = {
                customerName: this.tempAddInfo1.customerName,
                customerNo: this.tempAddInfo1.customerNo,
                externalIdentificationNo: this.tempAddInfo1.externalIdentificationNo,
                idNumber: this.tempAddInfo1.idNumber,
                idType: this.tempAddInfo1.idType,
                list: this.tampAddList2,
            }
            this.$refs['tempAddRef1'].validate((valid) => {
            if (valid) {
                this.post('/nonfi/nonfinanceService/BSS.AD.01.0020', params, (res) => {
                    if (res.returnCode == '000000') {
                          this.dialogFormVisibleAdd = false
                        this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.dialogFormVisibleAddView = false
                        this.getList()
                        this.searcheHandlee()
                    }
                })
            }
          })
        }, 
        //运营模式监听
        pricingLevelChange(val) {
            this.pricingLevelCodeOptions = []
            this.newPricingLevelCode = val
            this.getPricingLevelCodeOptions()
        },
        /*----修改----*/
        handleUp(row) {
            this.dialogFormVisibleUpView = true
            this.tempUp = Object.assign({}, row)
            this.$nextTick(() => {
                this.$refs['tempUpRef'].clearValidate()
            })
        }, 
        subUpData(){
            if( this.tempUp.uneffectDate < this.tempUp.effectDate){
                this.$message("失效日期不能小于生效日期")
                return;
            }
            this.$refs['tempUpRef'].validate((valid) => {
                if (valid) {
                    this.post('/nonfi/nonfinanceService/BSS.UP.01.0040',  this.tempUp,(res) => {
                        
                        if (res.returnCode == '000000') {
                             this.dialogFormVisibleUpView = false
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
