<!-- 车辆信息查询维护 -->
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
                <el-button size="medium" icon="el-icon-search" type="primary"  @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
            </div>
        </el-form>
        <div v-show="showTable">
            <div class="text_title">客户车辆信息</div>
			<el-table  v-loading = "config.loading" :data="tableData"  class="mbtm20"   fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="licencePlateNumber" label="车辆号码 " align="center" />
                <el-table-column prop="vehicleType" label="车辆类型" align="center" />
                <el-table-column prop="vehicleBrand" label="车辆品牌" align="center" />
                <el-table-column prop="vehicleRegisterDate" label="车辆登记年月" align="center" / >
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
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="refAdd" :model="tempAdd" :rules="rulesAdd">
              	<el-form-item class="cl_td red" label="车辆号码" prop="licencePlateNumber"
					:rules="[ { required: true, message: '车辆号码不能为空'}]">
                    <el-input v-model="tempAdd.licencePlateNumber" class="wd200" type="text" maxlength="16"/>
               	</el-form-item>
                <el-form-item class="cl_td" label="车辆类型" prop="vehicleType"
                	:rules="[ { required: true, message: '车辆类型不能为空'}]">
                    <el-input v-model="tempAdd.vehicleType" class="wd200" type="text" maxlength="10"/>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆品牌" prop="vehicleBrand"
                	:rules="[ { required: true, message: '车辆品牌不能为空'}]">
                    <el-input v-model="tempAdd.vehicleBrand" class="wd200" type="text" maxlength="4"/>
                </el-form-item>
                <el-form-item class="cl_td" label="排量" prop="vehicleEmission">
                    <el-input class="wd200" v-model="tempAdd.vehicleEmission" type="text" maxlength="2"></el-input>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆颜色" prop="vehicleColor">
                    <el-input v-model="tempAdd.vehicleColor" class="wd200" type="text" maxlength="10"/>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆登记年月" prop="vehicleRegisterDate">
                    <el-input class="wd200" v-model="tempAdd.vehicleRegisterDate" type="text" maxlength="4"></el-input>
                </el-form-item>
				<el-form-item class="cl_td" label="车架号" prop="vin">
                    <el-input v-model="tempAdd.vin" class="wd200" type="text" maxlength="20"/>
                </el-form-item>
                <el-form-item class="cl_td" label="发动机号" prop="vehicleEngineNumber">
                    <el-input class="wd200" v-model="tempAdd.vehicleEngineNumber" type="text"maxlength="20" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button @click="addClose">关闭 </el-button>
            </div>
        </el-dialog>
		<!-- 修改 -->
        <el-dialog title="修改车辆信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="refUp" :model="tempUp" :rules="rulesUp">
              	<el-form-item class="cl_td" label="车辆号码" prop="licencePlateNumber">
                    <el-input v-model="tempUp.licencePlateNumber" class="wd200" type="text" maxlength="16"/>
               	</el-form-item>
                <el-form-item class="cl_td" label="车辆类型" prop="vehicleType">
                    <el-input v-model="tempUp.vehicleType" class="wd200" type="text" maxlength="10"/>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆品牌" prop="vehicleBrand">
                    <el-input v-model="tempUp.vehicleBrand" class="wd200" type="text" maxlength="4"/>
                </el-form-item>
                <el-form-item class="cl_td" label="排量" prop="vehicleEmission">
                    <el-input class="wd200" v-model="tempUp.vehicleEmission" type="text" maxlength="2"></el-input>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆颜色" prop="vehicleColor">
                    <el-input v-model="tempUp.vehicleColor" class="wd200" type="text" maxlength="10"/>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆登记年月" prop="vehicleRegisterDate">
                    <el-input class="wd200" v-model="tempUp.vehicleRegisterDate" type="text" maxlength="4"></el-input>
                </el-form-item>
				<el-form-item class="cl_td" label="车架号" prop="vin">
                    <el-input v-model="tempUp.vin" class="wd200" type="text" maxlength="20"/>
                </el-form-item>
                <el-form-item class="cl_td" label="发动机号" prop="vehicleEngineNumber">
                    <el-input class="wd200" v-model="tempUp.vehicleEngineNumber" type="text"maxlength="20" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button @click="dialogFormVisibleUp = false"> 关闭</el-button>
            </div>
        </el-dialog>
		<!--查询-->
		<el-dialog title="车辆信息详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="refDetail" :model="tempDetail" :rules="rulesDetail">
              	<el-form-item class="cl_td" label="车辆号码" prop="licencePlateNumber">
                    <el-input v-model="tempDetail.licencePlateNumber" class="wd200" type="text" maxlength="16" readonly />
               	</el-form-item>
                <el-form-item class="cl_td" label="车辆类型" prop="vehicleType">
                    <el-input v-model="tempDetail.vehicleType" class="wd200" type="text" maxlength="10"readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="车辆品牌" prop="vehicleBrand">
                    <el-input v-model="tempDetail.vehicleBrand" class="wd200" type="text" maxlength="4" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="排量" prop="contactAddress">
                    <el-input class="wd200" v-model="tempDetail.contactAddress" type="text" maxlength="2" readonly></el-input>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆颜色" prop="vehicleColor">
                    <el-input v-model="tempDetail.vehicleColor" class="wd200" type="text" maxlength="10" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="车辆登记年月" prop="vehicleRegisterDate">
                    <el-input class="wd200" v-model="tempDetail.vehicleRegisterDate" type="text" maxlength="4" readonly></el-input>
                </el-form-item>
				<el-form-item class="cl_td" label="车架号" prop="vin">
                    <el-input v-model="tempDetail.vin" class="wd200" type="text" maxlength="20" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发动机号" prop="vehicleEngineNumber">
                    <el-input class="wd200" v-model="tempDetail.vehicleEngineNumber" type="text"maxlength="20" readonly></el-input>
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
        typeOptions: [], // 地址类型
        
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
		tempDetail: {},
		refDetail: {},

    }
  },
  created() {
   
  },
  mounted() {
    // 证件类型
    this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeOptions = res
    })
    // 地址类型
    this.getSelectDict('dic_addressType').then((res) => {
        this.typeOptions = res
    })
    
    // this.init()
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
                           if (this.btnAuthStr.includes('BSS.IQ.01.0134') != -1) { // 查询
                               this.selBtnFlag = true
                           } else {
                               this.selBtnFlag = false
                           }
//                         if (this.btnAuthStr.includes('COS.AD.02.0021')) { // 新增
//                             this.addBtnFlag = true
//                         } else {
//                             this.addBtnFlag = false
//                         }
                           if (this.btnAuthStr.includes('BSS.UP.01.0134') != -1) { // 维护
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
	        let params = {}
	        params = Object.assign( params, this.config, this.queryFormObj)
	        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0134', params ,(res) => {
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
                    this.config.loading = false
	                this.showTable = false
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
    	//新增车辆信息
	    createData() {
	    	this.tempAdd.customerNo = this.dataInfo.customerNo
			this.tempAdd.eventId = 'BSS.AD.01.0134'
	    	this.tempAdd = Object.assign (this.tempAdd,this.queryFormObj ) //合并
	    	this.$refs['refAdd'].validate((valid) => {
	        	if (valid) {
		           	this.post('/nonfi/nonfinanceService/BSS.AD.01.0134', this.tempAdd, (res) => {
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
	       this.post('/nonfi//nonfinanceService/BSS.UP.01.0134', this.tempUp, (res) => {
	            if (res.returnCode == '000000') {
	                this.dialogFormVisibleUp = false
	                this.$notify({
	                    title: 'Success',
	                    message: '修改成功',
	                    type: 'success',
	                    duration: 2000
	                })
	                this.getList()
	            }
	        })
		},
		//查询
		handleDetail(row){
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
