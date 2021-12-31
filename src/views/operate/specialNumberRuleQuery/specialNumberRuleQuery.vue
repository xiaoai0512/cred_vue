<!-- 特殊号码规则 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="法人实体" prop="corporationEntityNo">
                <el-input v-model="queryFormObj.corporationEntityNo" class="wd200" type="text" disabled/>
            </el-form-item>
            <el-form-item class="cl_td" label="卡BIN" prop="binNo">
                <el-select v-model="queryFormObj.binNo" class="wd200" @change="cardBinChange($event)">
                    <el-option
                        v-for="(item, index ) in cardBinOptions"
                        :key="index"
                        :label="item.binNo"
                        :value="item.binNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber">
                <el-select v-model="queryFormObj.segmentNumber" class="wd200">
                    <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.segmentNumber"
                        :value="item.segmentNumber"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="特殊号码方式" prop="numberType">
                <el-select v-model="queryFormObj.numberType" class="wd200">
                    <el-option
                        v-for="(item, index ) in numberTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="cardBin" label="卡BIN" align="center" />
            <el-table-column prop="segmentNumber" label="特殊号码段号" align="center" />
            <el-table-column prop="numberType" label="特殊号码方式" align="center" />
            <el-table-column prop="numberBit" label="特殊号码位数" align="center" />
            <el-table-column prop="numberRange" label="特殊号码排列" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
               		<el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
         <el-dialog title="特殊号码规则建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="法人实体" prop="corporationEntityNo" 
                    :rules="[ { required: true, message: '法人实体不能为空'}]">
                    <el-input v-model="tempAdd.corporationEntityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo" 
                        :rules="[ { required: true, message: '发行卡BIN不能为空'}]">
                    <el-select v-model="tempAdd.binNo" class="wd200" @change="cardBinChange($event)">
                        <el-option
                            v-for="(item, index ) in cardBinOptions"
                            :key="index"
                            :label="item.binNo"
                            :value="item.binNo"/> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber" 
                    :rules="[ { required: true, message: '特殊号码段号不能为空', trigger: 'blur' },
            		{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]">
                    <el-input v-model="tempAdd.segmentNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码方式" prop="numberType" 
                    :rules="[ { required: true, message: '特殊号码方式不能为空'}]">
                    <el-select v-model="tempAdd.numberType" class="wd200">
                        <el-option
                            v-for="(item, index ) in numberTypeOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select> 
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码位数" prop="numberBit"
                    :rules="[ { required: true, message: '特殊号码位数不能为空'},
                    { min: 1, max: 1, message: '长度为1个字符', trigger: 'blur' }
                    ]">
                   <el-input v-model="tempAdd.numberBit" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码排列" prop="numberRange"
                    :rules="[ { required: true, message: '特殊号码排列不能为空'},
                    { max: 10, message: '长度最多为10个字符', trigger: 'blur' }
                    ]">
                   <el-input v-model="tempAdd.numberRange" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="紧急号段标识" prop="criticalFlag" 
                    :rules="[ { required: true, message: '紧急号段标识不能为空'}]">
                    <el-select v-model="tempAdd.criticalFlag" class="wd200">
                        <el-option
                            v-for="(item, index ) in criticalFlagOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select> 
                </el-form-item>
                <div  class="cl_tr text_center">
                <el-button icon="el-icon-plus" type="primary" @click="addRule()">规则</el-button>
            </div>
            </el-form>
            <div class="clearboth"></div>
            <div class="text_title">特殊号码排列新增</div>
            <el-table v-loading = "addlistLoading" :data="addTableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column prop="cardBin" label="卡BIN" align="center"/>
                <el-table-column prop="segmentNumber" label="特殊号码段号" align="center"/>
                <el-table-column prop="numberType" label="特殊号码方式" align="center"/>
                <el-table-column prop="numberBit" label="特殊号码位数" align="center" />
                <el-table-column prop="numberRange" label="特殊号码排列" align="center"/>
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row,$index}">
                        <el-button type="primary" @click="addCardBtn(row,$index)">新增特殊号码段</el-button>
                        <el-button type="primary" @click="delAddList(row,$index)">删除</el-button>
                    </template>
	            </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="closeAdd()"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--新增特殊号码段-->
        <el-dialog title="特殊号码规则建立" :visible.sync="dialogFormVisibleCard" width="65%">
            <el-form ref="dataFormNum" :rules="rulesNum" :model="numItem" >
                <el-form-item class="cl_td" label="特殊号码方式" prop="corporationEntityNo">
                    <el-input v-model="numItem.numberType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码位数" prop="numberBit">
                    <el-input v-model="numItem.numberBit" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码排列" prop="numberRange">
                    <el-input v-model="numItem.numberRange" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <div class="text_title" style="display: inline;">新增特殊号码信息</div>
            <div  class="layui-inline text_right" style="position: relative; float: right;">
                <el-button type="primary" @click="addNum()">新增</el-button>
            </div>
            <el-table  :data="cardNumItem" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="cardNumber" label="特殊号码段号" align="center" >
                	<template slot-scope="scope" >    
                	 	<el-input v-model="scope.row.cardNumber" maxlength="1" class="wd200" type="text"/>
                	</template >    
                </el-table-column>	
                <el-table-column prop="" label="操作" align="center" width = "350">
                	<template slot-scope="{row,$index}">
                    	<el-button type="primary" @click="delCardNum(row,$index)">删除</el-button>
                	</template>
            	</el-table-column>
         	</el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subCard()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleCard=false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="发卡BIN" prop="cardBin">
                    <el-input v-model="tempUp.cardBin" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码方式" prop="numberType">
                   <el-input v-model="tempUp.numberType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码位数" prop="numberBit">
                   <el-input v-model="tempUp.numberBit" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号排列" prop="numberRange">
                   <el-input v-model="tempUp.numberRange" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="紧急号段标识" prop="updatecriticalFlag">
                    <el-select v-model="tempUp.updatecriticalFlag" class="wd200" >
                        <el-option
                            v-for="(item, index ) in criticalFlagOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select> 
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <!-- <div class="text_title">维护特殊号码信息</div> -->
            <div  class="cl_tr text_center">
                <el-button icon="el-icon-plus" type="primary" @click="addInfo()">新增</el-button>
            </div>
            <el-table  :data="cardNumUp" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="cardNumber" label="特殊号码段号" align="center" >
                	<template slot-scope="scope">
                		<el-input v-model="scope.row.cardNumber"  class="wd200" type="text"/>
                	</template >    
                </el-table-column>	
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row,$index}">
                    	<el-button type="primary" @click="delCardNumUp(row,$index)">删除</el-button>
                	</template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--查询-->
         <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="发卡BIN" prop="cardBin">
                    <el-input v-model="tempDetail.cardBin" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码方式" prop="numberType">
                   <el-input v-model="tempDetail.numberType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码位数" prop="numberBit">
                   <el-input v-model="tempDetail.numberBit" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号排列" prop="numberRange">
                   <el-input v-model="tempDetail.numberRange" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="紧急号段标识" prop="updatecriticalFlag">
                    <el-select v-model="tempDetail.updatecriticalFlag" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in criticalFlagOptions"
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select> 
                </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <!-- <div class="text_title">维护特殊号码信息</div> -->
           	<el-table  :data="cardNumDetail" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="cardNumber" label="特殊号码段号" align="center" >
                	<template slot-scope="scope">
                		<el-input v-model="scope.row.cardNumber"  class="wd200" type="text" readonly/>
                	</template >    
                </el-table-column>	
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
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
            valBinNo: '',
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            list_segmentNumber: '',
            // 下拉框
            originListOptions:[],// 运营模式 
            cardBinOptions: [],//卡BIN
            criticalFlagOptions: [],
            segmentNumberOptions: [],//特殊号码段
            cardStatusOptions: [],//预留卡号状态
            numberTypeOptions: [],//特殊号码方式
            /*----新增----*/
            tempAdd: {}, // 新增
            newLegal: '',
           	dialogFormVisibleAdd: false,
            dialogFormVisibleUp: false,
            dialogFormVisibleDetail: false,
            rulesAdd: {},
           	rulesUp: {},
            addlistLoading:false,
            addTableList: [],
            addFormObj: {},
            addTableTotal: 0,
            //新增特殊号码
            numItem: {},
            rulesNum: {},
            dataFormNum: {},  
            cardNumItem: [],
            dialogFormVisibleCard: false,   
            tableListIndex: '',
            //修改
            tempUp: {}, 
           	dataFormUp: {},
           	rulesUp: {},
            cardNumUp: [],
            //详情
            tempDetail: {}, // 详情
            rulesDetail: {},
            dataFormDetail: {},
            cardNumDetail: [],
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
            //特殊号码方式
            this.getSelectDict( "dic_numberType").then(res => {
                this.numberTypeOptions = res
            })
            //预留卡号状态
            this.getSelectDict( "dic_reservedCardNoStatus").then(res => {
                this.cardStatusOptions = res
            })
            //segmentNumberOptions
            //紧急号段标识
            this.getSelectDict( "dic_isYorN").then(res => {
                this.criticalFlagOptions = res
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
            this.getTableList('/beta/betaService/COS.IQ.02.0045', params,(res) => {
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
        handleSearch() {
            this.queryFormObj.pageNum = 1
            this.getList()
        },
        cardBinChange(val){
        	this.valBinNo = val
        	this.segmentNumberOptions = []
        	this.getSegmentNumber()
        },
        getSegmentNumber(){
        	let  obj={
        		cardBin: this.valBinNo
        	}
			this.post('/beta/betaService/COS.IQ.02.0045', obj, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                       	this.segmentNumberOptions = res.returnData.rows
                    } 
                }
            })
        },
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.tempAdd.corporationEntityNo = this.logininfo.corporationEntityNo
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
        //规则
        addRule(){
        	this.$refs['dataFormAdd'].validate((valid) => {
        		if (valid) {
        		    //JSON.stringify()对象转为串，JSON.parse()串转为对象，JSON操作是深拷贝操作解决数据不互相干扰
        		    let addRowList = JSON.parse(JSON.stringify(this.tempAdd));
        		  	addRowList.cardBin = addRowList.binNo
      		        this.addTableList.push(addRowList)
      		    }
        	})
        },
        //删除
        delAddList(row,index){
			let checkId = row;
			this.addTableList.splice(checkId, 1);
		},
        //新增特殊号码弹框
        addCardBtn(row,index){
        	this.dialogFormVisibleCard = true;
        	this.tableListIndex = index
            this.numItem = Object.assign({}, row)
            this.numItem.tableListIndex =index
            this.$nextTick(() => {
                this.$refs['dataFormNum'].clearValidate()
            })
        },
        //新增特殊号码
       	addNum(){
       		this.cardNumItem.push({
				cardNumber: ''
			})
		},
		//删除
		delCardNum(row,index){
			let cardNumId = row;
			this.addTableList.splice(cardNumId, 1);
		},
        //确认
        subCard(){
            let itemIndex = this.tableListIndex;
			this.addTableList[itemIndex].arranges = this.cardNumItem;
        	this.dialogFormVisibleCard = false;
        },
		 //确认新增数据 
        createData() {
			let params = {}
        	params.rules=this.addTableList
           	this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/COS.AD.02.0039',params, (res) => {
                        if (res.returnCode == '000000') {
                            this.dialogFormVisibleAdd = false
                            this.$notify({
                                title: 'Success',
                                message: '新增成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.getList()
                        }
                        
                    })
                }
            })
        },  
       	//显示修改弹框
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.tempUp.updatecriticalFlag = row.criticalFlag
            this.getUpList()
           	this.dialogFormVisibleUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //新增
        addInfo(){
        	this.cardNumUp.push({
				cardNumber: ''
			})
        },
        delCardNumUp(row,index){
        	let cardNumId = row;
			this.cardNumUp.splice(cardNumId, 1);
        },
        //列表
        getUpList() {
            let params = {
                corporationEntityNo: this.logininfo.corporationEntityNo,
            }
           params = Object.assign(this.tempUp, params)   //合并
            this.getTableList('/beta/betaService/COS.IQ.02.0058', params,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.cardNumUp = res.returnData.rows
                    } else {
                        this.cardNumUp = []
                    }
                }
            })
        },
      	//确认修改数据
        updateData() {
        	let params = {}
        	this.tempUp.arranges = this.cardNumUp
        	params.rule = this.tempUp
       		 this.post('/beta/betaService/COS.UP.02.0042', params, (res) => {
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
        },
        //查询显示修改的弹框
        handleDetail(row){
        	this.tempDetail= Object.assign({}, row)
            this.tempDetail.updatecriticalFlag = row.criticalFlag
            this.dialogFormVisibleDetail = true
            this.getDetailList()
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        },
         getDetailList() {
            let params = {
                corporationEntityNo: this.logininfo.corporationEntityNo,
            }
           params = Object.assign(this.tempDetail, params)   //合并
            this.getTableList('/beta/betaService/COS.IQ.02.0058', params,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.cardNumDetail = res.returnData.rows
                        
                    }
                }
            })
        },
    }
}
</script>

<style>
</style>
