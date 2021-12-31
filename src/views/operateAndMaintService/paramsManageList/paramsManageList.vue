<!-- 参数管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
            <el-form-item class="cl_td" label="类型名称" prop="groupsCodeDescber" > 
                <el-input v-model="queryForm.groupsCodeDesc" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="类型代码" prop="groupsCode" >
                <el-input v-model="queryForm.groupsCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
            </div>
        </el-form>
       	<el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
          	<el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="groupsCodeDesc" label="类型名称" align="center"/>
             <el-table-column prop="groupsCode" label="类型代码" align="center"/>
            <el-table-column prop="type" label="参数种类" align="center"/>
            <el-table-column align="center" label="操作" width="280">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-search" type="primary" @click="handleDetail(scope.row)">详情</el-button>
                    <el-button size="mini" icon="el-icon-search" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="新增参数" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               	<el-form-item class="cl_td" label="类型名称" prop="groupsCodeDesc"
               		:rules="[ { required: true, message: '类型名称不能为空'}]">
                    <el-input v-model="tempAdd.groupsCodeDesc" class="wd200" type="text" />
                </el-form-item>
            	<el-form-item class="cl_td" label="类型代码" prop="groupsCode"
            		:rules="[ { required: true, message: '类型代码不能为空'}]">
                    <el-input v-model="tempAdd.groupsCode" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--参数详细信息-->
            <div class="clearboth"></div>
            <div class="text_title" style="display: inline;">参数详细信息</div>
            <div  class="layui-inline text_right" style="position: relative; float: right;">
                <el-button type="primary" @click="addInfo()">新增</el-button>
            </div>
            <el-table  :data="addTableList"  border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column label="参数名称"  align="center" >
                    <template slot-scope="scope" >    
                      	<el-input v-model="scope.row.detailDesc"  class="w200"/>
                    </template>
                </el-table-column>
                <el-table-column label="参数值"  align="center" >
                    <template slot-scope="scope" >    
                      	<el-input v-model="scope.row.codes"  class="w200"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="addDelBtn(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeAddBtn()">取消</el-button>
                <el-button type="primary" @click="createAddData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
               	<el-form-item class="cl_td" label="类型名称" prop="groupsCodeDesc"
               		:rules="[ { required: true, message: '类型名称不能为空'}]">
                    <el-input v-model="tempDetail.groupsCodeDesc" class="wd200" type="text" />
                </el-form-item>
            	<el-form-item class="cl_td" label="类型代码" prop="groupsCode"
            		:rules="[ { required: true, message: '类型代码不能为空'}]">
                    <el-input v-model="tempDetail.groupsCode" class="wd200" type="text" />
                </el-form-item>
            </el-form>
      		<div class="clearboth"></div>
            <div class="text_title" style="display: inline;">参数详细信息</div>
           	<el-table  :data="tempDetailList"  border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column label="参数名称"  align="center" >
                    <template slot-scope="scope" >    
                      	<el-input v-model="scope.row.detailDesc"  class="w200"/>
                    </template>
                </el-table-column>
                <el-table-column label="参数值"  align="center" >
                    <template slot-scope="scope" >    
                      	<el-input v-model="scope.row.codes"  class="w200"/>
                    </template>
                </el-table-column>
           	</el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
               <el-form-item class="cl_td" label="类型名称" prop="groupsCodeDesc"
               		:rules="[ { required: true, message: '类型名称不能为空'}]">
                    <el-input v-model="tempUp.groupsCodeDesc" class="wd200" type="text" />
                </el-form-item>
            	<el-form-item class="cl_td" label="类型代码" prop="groupsCode"
            		:rules="[ { required: true, message: '类型代码不能为空'}]">
                    <el-input v-model="tempUp.groupsCode" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--参数详细信息-->
            <div class="clearboth"></div>
            <div class="mainname" style="display: inline;">参数详细信息</div>
            <div  class="layui-inline text_right" style="position: relative; float: right;">
                <el-button type="primary" @click="upInfo()">新增</el-button>
               
            </div>
            <el-table  :data="tempUpList"  border stripe style="width: 100%">
                  <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column label="参数名称"  align="center" >
                    <template slot-scope="scope" >    
                      	<el-input v-model="scope.row.detailDesc"  class="w200"/>
                    </template>
                </el-table-column>
                <el-table-column label="参数值"  align="center" >
                    <template slot-scope="scope" >    
                      	<el-input v-model="scope.row.codes"  class="w200"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="upDelBtn(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="submitUpInfo()">确认</el-button>
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
           // 列表
            queryFormRef: {},
            queryFormRules: {},   
           	queryForm: {
           		pageNum: 1,
                pageSize:10,
            },
            listLoading: false,
          	tableList: [],
            tableTotal: 0,
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dataFormAdd: {},
            dialogFormVisibleAdd: false,
            addTableList: [],//列表
           	/*----修改----*/
            tempUp: {},
            dialogFormVisibleUp: false,
            tempUpList: [],
            rulesUp: {},
            dataFormUp:{},
            /*----详情----*/
            dataFormDetail: {},
            dialogFormVisibleDetail: false,
            tempDetail: {}, // 
            rulesDetail: {},
            tempDetailList: [], // 修改
        }
    },
    created() {
    },
   	mounted() {
    	this.getList()
    },
    methods: {
    	 //重置
        reset(){
            this.queryForm.groupsCodeDesc = "";
            this.queryForm.groupsCode = "";
            this.getList();
        },
    	// 点击查询按钮
        handleSearch() {
        	this.queryForm.pageNum = 1
   			this.queryForm.pageSize = 10
   			this.getList()
        },
        // 列表
        getList() {
           	this.listLoading = true
           	this.getTableList('/beta/betaService/COS.IQ.02.0150', this.queryForm ,(res) => {
                this.listLoading = false
               if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }, (err) => {
                if (err) {
                    this.listLoading = false
                    this.tableList = []
                    this.tableTotal = 0
                }
            })
        },
        //显示新增弹框
        handleCreate() {
            this.tempAdd = {}
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
          })
        }, 
        //关闭弹框清空数据
        closeAddBtn(){
    	 	this.dialogFormVisibleAdd = false
    	 	this.addTableList = []
    	    this.$nextTick(() => {
            	this.$refs['dataFormAdd'].resetFields()
          	})
        },
        //新增删除单条数据
        addDelBtn(val){
            this.addTableList.splice(val,1);
        },
       	addInfo(){
            let itemList={
                detailDesc: '',
                codes: '',
            };
            this.addTableList.push(itemList);
        },
        //确认提交新增数据
        createAddData() {
        	let paramsAddPa = {}
        	paramsAddPa = Object.assign ( paramsAddPa, this.tempAdd ) 
        	paramsAddPa.langList = this.addTableList
        	paramsAddPa.type = 'DROPDOWNBOX'
        	this.post('/beta/betaService/COS.AD.02.0150', paramsAddPa, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                        message: '新增成功',
                        type: 'success',
                    }) 
                    this.getList()
                    this.addTableList = []
                    this.tempAdd = {}
                }
	        })
        },
        //显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.tempDetail={}
            this.tempDetail = Object.assign({}, row)
            this.getDetailList()
        },
        getDetailList() {
        	let paramsDetailPa = {
        		groupsCode: this.tempDetail.groupsCode,
				queryFlag: 'children',
				type: 'DROPDOWNBOX',
        	}
          	this.getTableList('/beta/betaService/COS.IQ.02.0150', paramsDetailPa ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tempDetailList = res.returnData.rows
                    }else{
                        this.tempDetailList = []
                    }
                }
            })
       	},
        /*----显示修改弹框----*/
        handleUpdate(row) {
            this.tempUp = {}
            this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp= true
            this.getUpInfo()
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
		//查询修改列表数据
        getUpInfo() {
            let itemUpList = {
                queryFlag: "children",
				type: "DROPDOWNBOX",
				groupsCode: this.tempUp.groupsCode,
            }
           this.getTableList('/beta/betaService/COS.IQ.02.0150', itemUpList ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tempUpList = res.returnData.rows
                    }else{
                        this.tempUpList = []
                    }
                }
            })
        },
        //新增 参数详细信息
        upInfo(){
        	let upList={
                detailDesc: '',
                codes: '',
            };
            this.tempUpList.push(upList);
     	},
        //修改删除单条数据
        upDelBtn(index,val){
			this.tempUpList.splice(index,1);
        },
       //确认提交修改数据
        submitUpInfo() {
        	let paramsUpPa = {}
        	paramsUpPa = Object.assign ( paramsUpPa, this.tempUp ) 
        	paramsUpPa.langList = this.tempUpList
        	paramsUpPa.type = 'DROPDOWNBOX'
        	this.post('/beta/betaService/COS.UP.02.0150', paramsUpPa, (res) => {
                if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                    this.$notify({
                        message: '修改成功',
                        type: 'success',
                    }) 
                    this.getList()
                }
           	})
        },
    }
}   
</script>

<style>
.w-input{
    width: 70px !important;
    display: inline-block;
    padding-right: 5px;
}
</style>
