<!-- 客户联系人信息查询维护 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select clearable  v-model="queryFormObj.idType" class="wd200">
                    <el-option v-for="item in idTypeOptions" :key="item.codes" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
            </div>
        </el-form>
        <div v-show="showTable">
            <div class="text_title">客户联络人信息</div>
			<el-table  v-loading = "config.loading" :data="tableData"  class="mbtm20"   fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="contactCategoryDesc" label="联络人类别 " align="center" />
                <el-table-column prop="name" label="姓名" align="center" />
                <el-table-column prop="relation" label="与持卡人关系" align="center" />                
                <el-table-column prop="handphone" label="手机" align="center" />
				<el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(row)" v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleDetail(row)" v-if="selBtnFlag">查询</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
        </div>
       	<!-- 新增 -->
        <el-dialog title="新增联络人信息" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="refAdd" :model="tempAdd" :rules="rulesAdd">
              	<el-form-item class="cl_td" label="联络人类别" prop="contactCategory"
               		:rules="[ { required: true, message: '联络人类别不能为空'}]">
	                <el-select clearable  v-model="tempAdd.contactCategory" class="wd200">
                    	<el-option v-for="item in contactCategoryOptions" 
                    		:key="item.codes" 
                    		:label="item.detailDesc" 
                    		:value="item.codes" />
                	</el-select>
	            </el-form-item>
               	<el-form-item class="cl_td" label="姓名" prop="name"
                	:rules="[ { required: true, message: '证件号码不能为空'}]">
                    <el-input v-model="tempAdd.name" class="wd200" type="text" maxlength="30"/>
                </el-form-item>
                <el-form-item class="cl_td" label="与持卡人关系" prop="relation"
                	:rules="[ { required: true, message: '证件国别代码不能为空'}]">
                    <el-input v-model="tempAdd.relation" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
                <el-form-item class="cl_td" label="手机" prop="handphone"
                	:rules="[ { required: true, message: '发证机关不能为空'}]">
                    <el-input v-model="tempAdd.handphone" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
                <el-form-item class="cl_td" label="电话国家区号" prop="telephoneCountry">
                    <el-input v-model="tempAdd.telephoneCountry" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
                <el-form-item class="cl_td" label="电话城市区号" prop="telephoneZone">
                    <el-input v-model="tempAdd.telephoneZone" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
                <el-form-item class="cl_td" label="电话号码" prop="telephoneNo">
                    <el-input v-model="tempAdd.telephoneNo" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="电话分机号  " prop="telephoneNoExt">
                     <el-input v-model="tempAdd.telephoneNoExt" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
               	<el-form-item class="cl_td" label="有效性标识 " prop="validFlag"
               		:rules="[ { required: true, message: '有效性标识不能为空'}]">
                    <el-select clearable  v-model="tempAdd.validFlag" class="wd200">
                    	<el-option v-for="item in validFlagOptions" 
                    		:key="item.codes" 
                    		:label="item.detailDesc" 
                    		:value="item.codes" />
                	</el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button @click="addClose">关闭 </el-button>
            </div>
        </el-dialog>
		<!-- 修改 -->
        <el-dialog title="修改联络人信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="refUp" :model="tempUp" :rules="rulesUp">
              	<el-form-item class="cl_td" label="联络人类别" prop="contactCategory"
               		:rules="[ { required: true, message: '联络人类别不能为空'}]">
	                <el-select clearable  v-model="tempUp.contactCategory" class="wd200">
                    	<el-option v-for="item in contactCategoryOptions" 
                    		:key="item.codes" 
                    		:label="item.detailDesc" 
                    		:value="item.codes" />
                	</el-select>
	            </el-form-item>
               	<el-form-item class="cl_td" label="姓名" prop="name"
                	:rules="[ { required: true, message: '证件号码不能为空'}]">
                    <el-input v-model="tempUp.name" class="wd200" type="text" maxlength="30"/>
                </el-form-item>
                <el-form-item class="cl_td" label="与持卡人关系" prop="relation"
                	:rules="[ { required: true, message: '证件国别代码不能为空'}]">
                    <el-input v-model="tempUp.relation" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
                <el-form-item class="cl_td" label="手机" prop="handphone"
                	:rules="[ { required: true, message: '发证机关不能为空'}]">
                    <el-input v-model="tempUp.handphone" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
                <el-form-item class="cl_td" label="电话国家区号" prop="telephoneCountry">
                    <el-input v-model="tempUp.telephoneCountry" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
                <el-form-item class="cl_td" label="电话城市区号" prop="telephoneZone">
                    <el-input v-model="tempUp.telephoneZone" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
                <el-form-item class="cl_td" label="电话号码" prop="telephoneNo">
                    <el-input v-model="tempUp.telephoneNo" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
             	<el-form-item class="cl_td" label="电话分机号  " prop="telephoneNoExt">
                     <el-input v-model="tempUp.telephoneNoExt" class="wd200" type="text" maxlength="70"/>
                </el-form-item>
               	<el-form-item class="cl_td" label="有效性标识 " prop="validFlag"
               		:rules="[ { required: true, message: '有效性标识不能为空'}]">
                    <el-select clearable  v-model="tempUp.validFlag" class="wd200">
                    	<el-option v-for="item in validFlagOptions" 
                    		:key="item.codes" 
                    		:label="item.detailDesc" 
                    		:value="item.codes" />
                	</el-select>
                </el-form-item>
            </el-form>    
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button @click="dialogFormVisibleUp = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!--详情-->
        <el-dialog title="证件详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="refDetail" :model="tempDetail" :rules="rulesDetail">
          		<el-form-item class="cl_td" label="联络人类别" prop="contactCategory">
	                <el-select clearable  v-model="tempDetail.contactCategory" class="wd200" disabled   readonly >
                    	<el-option v-for="item in contactCategoryOptions" 
                    		:key="item.codes" 
                    		:label="item.detailDesc" 
                    		:value="item.codes" />
                	</el-select>
	            </el-form-item>
               	<el-form-item class="cl_td" label="姓名" prop="name">
                    <el-input v-model="tempDetail.name" class="wd200" type="text" maxlength="30" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="与持卡人关系" prop="relation">
                    <el-input v-model="tempDetail.relation" class="wd200" type="text" maxlength="3" readonly  />
                </el-form-item>
                <el-form-item class="cl_td" label="手机" prop="handphone">
                    <el-input v-model="tempDetail.handphone" class="wd200" type="text" maxlength="70" readonly  />
                </el-form-item>
                <el-form-item class="cl_td" label="电话国家区号" prop="telephoneCountry">
                    <el-input v-model="tempDetail.telephoneCountry" class="wd200" type="text" maxlength="70" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="电话城市区号" prop="telephoneZone">
                    <el-input v-model="tempDetail.telephoneZone" class="wd200" type="text" maxlength="70" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="电话号码" prop="telephoneNo">
                    <el-input v-model="tempDetail.telephoneNo" class="wd200" type="text" maxlength="70" readonly />
                </el-form-item>
             	<el-form-item class="cl_td" label="电话分机号  " prop="telephoneNoExt">
                     <el-input v-model="tempDetail.telephoneNoExt" class="wd200" type="text" maxlength="70" readonly />
                </el-form-item>
               	<el-form-item class="cl_td" label="有效性标识 " prop="validFlag">
                    <el-select clearable  v-model="tempDetail.validFlag" class="wd200" disabled   readonly >
                    	<el-option v-for="item in validFlagOptions" 
                    		:key="item.codes" 
                    		:label="item.detailDesc" 
                    		:value="item.codes" />
                	</el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false"> 关闭</el-button>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import Pagination from "@/components/Pagination";


export default {
  name: 'accProcesseList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  	data() {
	    return {
	        baseInfoObj: {}, // 客户基本信息
	        // 列表
	        selBtnFlag: false,
	        updBtnFlag: false,
	        queryFormObj: {},
	        loading: false,
	        queryFormRef: {},
	        queryFormRules: {},      
	        tableData: [],
	        showTable: false,
	        config: {
	            loading: false,
	            pageNum: 1,
	            pageSize: 10,
	            total: 0
	        },
			// 下拉框
	        idTypeOptions: [], // 证件类型
	        validFlagOptions: [],//证件有效性标识
	        contactCategoryOptions: [],//联络人类别
	        // 新增
	        dialogFormVisibleAdd: false,
	        showGuarantDiv: false,
	        refAdd: {},
	        tempAdd: {}, 
	        rulesAdd: {},
			dataInfo: {},
			// 修改
	        dialogFormVisibleUp: false,
	        rulesUp: {},
	        refUp: {},
	        tempUp: {},
	        //详情
	        dialogFormVisibleDetail: false,
	        rulesDetail: {},
	        refDetail: {},
	        tempDetail: {},
		}
  	},
  	created() {
	   
  	},
  	mounted() {
    	// 证件类型
	    this.getSelectDict('dic_certificateType').then((res) => {
	        this.idTypeOptions = res
	    })
	    // 联络人类别
	    this.getSelectDict('dic_contactCategory').then((res) => {
	        this.contactCategoryOptions = res
	    })
	    //有效标识
	    this.getSelectDict('dic_invalidFlag').then((res) => {
	        this.validFlagOptions = res
	    })
  	},
  	methods: {
  		// 查询按钮权限
        getBtnAuth() {
            let params= {
                menuNo : window.sessionStorage.getItem('menuNo')
            }
            this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.length > 0 ) {
                        res.returnData.forEach(item => {
                            this.btnAuthStr += item.eventNo+','
                        })
                        if(this.btnAuthStr.includes('BSS.IQ.01.0132') != -1){    //查询
                            this.selBtnFlag = true;
                        }
                        else{
                            this.selBtnFlag = false;
                        }
                       if (this.btnAuthStr.includes('BSS.UP.01.0131') != -1) { // 维护
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
	        this.config.loading = true
	        let params = {
	        	isTrans: true,//是否需要翻译数据字典
	            transParams : ['dic_invalidFlag','dic_certificateType'],//查找数据字典所需参数
	            transDict : ['idValidFlag','idType'],//翻译前后key
	        }
	       params = Object.assign( params, this.config, this.queryFormObj)
	        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0132', params ,(res) => {
	            if (res.returnCode == '000000') {
	                this.config.loading = false
	                this.showTable = true
	                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                    let rows = res.returnData.rows
	                    this.tableData = rows
	                    this.config.total = res.returnData.totalCount
	                } else {
	                    this.tableData = []
	                    this.config.total = 0
	                }
	            } else {
	                this.showTable = false
	            }
	        }, (err) => {
               if(err) {
					this.tableData = []
					this.config.total = 0
					this.showTable = false
					this.config.loading = false
               }
            })
	    },
	    handleSearch() {
	        if (!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
	          this.$message({
	            message: '请输入查询信息',
	            type: 'warning'
	          })
	        } else {
				this.config.pageNum = 1
	          if (this.queryFormObj.idType) {
	            if (!this.queryFormObj.idNumber) {
	              this.$message({
	                message: '请输入证件号码',
	                type: 'warning'
	              })
	            } else {
	                this.getList()
	            }
	          } else if (this.queryFormObj.idNumber) {
	            if (!this.queryFormObj.idType) {
	              this.$message({
	                message: '请输入证件类型',
	                type: 'warning'
	              })
	            } else {
	              this.getList()
	            }
	          } else {
	            this.getList()
	          }
	        }
	    },
	    handleCreate() {
	    	if (!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
	          	this.$message('请输入查询信息')
          		return;
        	} 
    		this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryFormObj, (res) => {
                if (res.returnCode == '000000') {
                   	this.dialogFormVisibleAdd = true
                   	this.dataInfo = res.returnData.rows[0]
			        this.$nextTick(() => {
			            this.$refs['refAdd'].clearValidate()
			        })
               	}
          	})	
	    },
    	//新增信息
	    createData() {
	    	this.tempAdd.customerNo = this.dataInfo.customerNo
			this.tempAdd = Object.assign (this.tempAdd,this.queryFormObj ) //合并
	    	this.$refs['refAdd'].validate((valid) => {
	        	if (valid) {
		           	this.post('/nonfi/nonfinanceService/BSS.AD.01.0132', this.tempAdd, (res) => {
		                if (res.returnCode == '000000') {
		                   	this.$notify({
		                        title: 'Success',
		                        message: '新增成功',
		                        type: 'success',
		                        duration: 2000
		                    })
		                    this.dialogFormVisibleAdd = false
		                    this.getList()
							this.tempAdd = {}
		                }
		            })
	        	}
	      	})
	    }, 
	    //关闭
	    addClose() {
	        this.dialogFormVisibleAdd = false
	        this.$refs["refAdd"].resetFields()
	    },
	    // 修改 按钮
	    handleUpdate(row) {
	        this.tempUp = Object.assign({}, row)
	        this.dialogFormVisibleUp = true
	        this.$nextTick(() => {
	            this.$refs['refUp'].clearValidate()
	        })
	    }, 
    	// 确定 修改
    	updateData() {
	       this.post('/nonfi/nonfinanceService/BSS.UP.01.0132', this.tempUp, (res) => {
	            if (res.returnCode == '000000') {
	               	this.$notify({
	                    title: 'Success',
	                    message: '修改成功',
	                    type: 'success',
	                    duration: 2000
	                })
	                this.dialogFormVisibleUp = false
	                this.getList()
	            }
	        })
		},
		//  详情
		handleDetail(row) {
	        this.tempDetail = Object.assign({}, row)
	        this.dialogFormVisibleDetail = true
	        this.$nextTick(() => {
	            this.$refs['refDetail'].clearValidate()
	        })
	    }, 
	}
}
</script>

<style>
    .tdDivL {
        width: 65%;
    }
    .tdDivR {
        width: 30%;
    }
    .cl_tr label.el-form-item__label {
        width: 20%;
    }
</style>
