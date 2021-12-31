<!--客户额度授信-->
<template>
    <div class="allContent">
        <el-form ref="dataFormCustomer" :rules="formRules" :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200" clearable placeholder="请选择">
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
                <div class="search_button">
                    <el-button size="medium" icon="el-icon-arrow-down" type="primary" v-if="isshow" @click="showControlBtn()">额度节点</el-button>
                    <el-button size="medium" icon="el-icon-arrow-up" type="primary" v-else @click="elseBtn()">额度节点</el-button>
               </div>
            </div>
            <div v-if="showDiv" >
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-select v-model="queryForm.creditNodeNo" class="wd200" @change="refsh($event)">
                        <el-option v-for="(item, index) in creditNodeNoOptions" 
                            :key="index" 
                            :label="item.label" 
                            :value="item.value"/>
                    </el-select>&nbsp;&nbsp;
                </el-form-item>
                <div class="cl_tr text_center">
                	<el-button size="medium" class=" text_center" type="primary" @click="getCreditcurrencyArray()">确定</el-button>
                </div>
            </div>
            <div class="clearboth"></div>
            <div class="allcontent" style="margin-top: 20px;">
                <div  v-if="showInfo">
                <el-form ref="dataFormCredit" :rules="formItem" :model="creditContent">
                    <el-form-item class="cl_td" label="客户号码" prop="customerNo">
                        <el-input v-model="creditContent.customerNo" class="wd200" type="text" readonly/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                        <el-input v-model="creditContent.externalIdentificationNo" class="wd200" type="text" readonly/>
                    </el-form-item>
                   <el-form-item class="cl_td" label="授信币种" prop="currencyCodeInfo" :rules="[ { required: true, message: '授信币种不能为空'} ]">
                        <el-select v-model="creditContent.currencyCodeInfo" class="wd200" >
                            <el-option v-for="(item, index) in creditTwocurrencyOptions" 
                                :key="index" 
                                :label="item.currencyDesc" 
                                :value="item.currencyCode"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="授信额度" prop="creditLimit" :rules="[ { required: true, message: '授信额度不能为空'} ]">
                        <el-input v-model="creditContent.creditLimit" class="wd200" type="text"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="是否首次授信" prop="firstCreditFlag"  
	                 	:rules="[ { required: true, message: '是否首次授信不能为空'} ]">
	                    <el-select v-model="creditContent.firstCreditFlag" class="wd200" clearable>
	                        <el-option v-for="(item, index) in firstCreditFlagOptions" 
	                            :key="index" 
	                            :label="item.detailDesc" 
	                            :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
                    <template v-if="showDate">
                      <el-form-item :rules="[ { required: true, message: '生效日期不能为空'} ]"  class="cl_td" label="生效日期" prop="startDate">
                        <el-date-picker
                          v-model="creditContent.startDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd"  
                          style="width: 200px;"  >
                        </el-date-picker>
                       </el-form-item >
                        <el-form-item :rules="[ { required: true, message: '失效日期不能为空'} ]"  class="cl_td" label="失效日期" prop="startDate">
                           <el-date-picker 
                              v-model="creditContent.endDate" 
                              align="right"
                              type="date"
                              placeholder="选择日期" value-format="yyyy-MM-dd"
                              :picker-options="pickerOptions" style="width: 200px;">
                            </el-date-picker>
                           </el-form-item >
                    </template>
                    <div class="cl_tr text_center">
                        <el-button size="medium" round icon="el-icon-plus" type="primary" @click="confirmInfo(creditContent)" >确定</el-button>
                        <el-button size="medium" round icon="el-icon-plus" type="primary" @click="closeInfo()" >关闭</el-button>
                    </div>
                    </el-form>
                </div>
            </div>
        </el-form>
         <!--授信结果信息-->
        <el-dialog title="授信结果信息" :visible.sync="dialogFormVisibleInfo" width="65%">
             <el-form   :data="creditInfo" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                 <el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="creditInfo.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="creditInfo.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授信类型" prop="creditTwoTypeInfo" >
                    <el-input v-model="creditInfo.creditTwoTypeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授信币种" prop="currencyCodeInfo" >
                    <el-input v-model="creditInfo.currencyCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授信额度" prop="creditLimit" >
                    <el-input v-model="creditInfo.creditLimit" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="生效日期" prop="startDateInfo" v-if="showDateInfo">
                    <el-input v-model="creditInfo.startDateInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="失效日期" prop="endDataInfo" v-if="showDateInfo">
                    <el-input v-model="creditInfo.endDataInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授信结果" prop="returnCodeInfo" >
                    <el-input v-model="creditInfo.returnCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form >
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleInfo = false"> 关闭</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'creditContent',
    components: {},
    data() {
      return {
         pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }, 
        },  
        value1: '',
        value2: '',
        queryForm: {},
        idTypeList: [],
        baseInfoObj: {},
        showInfo: false,//客户号
        showDiv: false,//额度节点下拉
        isshow:true,//额度节点按钮小三角
        creditNodeNoAll:[],
        creditInfo: {},
        creditContent:{},
        dialogFormVisibleInfo:false,
        formRules: {},
        formItem: {},
        creditNodeNoVal: '',
        creditNodeNoOptions: [],//额度节点
        creditTwocurrencyOptions: [],//授信币种
        firstCreditFlagOptions: [],//是否首次授信
        showDate: false,//基本信息生效日期与失效日期显示隐藏
        showDateInfo:false//授信結果信息日期显示隐藏
      }
    },
    created() { },
    mounted() { 
        //额度节点
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        }) 
        //是否首次授信
        this.getSelectDict('dic_irstCreditFlag').then((res) => {
            this.firstCreditFlagOptions = res
        })
    },
    methods: {
    	//额度节点展示箭头向上
    	showControlBtn(){
            if((this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) ){
                this.$message('证件类型不能为空！');
                return;
            }
            if((this.queryForm.idType != "" && this.queryForm.idType != null && this.queryForm.idType != undefined)){
                if(this.queryForm.idNumber == "" && this.queryForm.idNumber == null && this.queryForm.idNumber == undefined){   
                  	this.$message('证件号码不能为空！');
                    return;
                }
            }
            if ((this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) &&
                (this.queryForm.externalIdentificationNo == "" || this.queryForm.externalIdentificationNo == null || 
                this.queryForm.externalIdentificationNo == undefined)){
                this.$message('请输入条件进行查询');
                return;
            }else if((this.queryForm.idNumber) && (this.queryForm.externalIdentificationNo)){
                this.$message('证件号和外部识别号只能选择输入一种！');
                return;
            }
            this.isshow=!this.isshow
            this.showDiv=!this.showDiv
            this.getCreditNode()
        },
        //关闭向下
        elseBtn(){
        	this.isshow=!this.isshow
            this.showDiv=!this.showDiv
        },
        refsh(val){
        	this.creditNodeNoVal=val
            this.$forceUpdate()
        },
         //额度节点
        getCreditNode() {
        	this.queryForm.creditNodeNo= '';
          	let  obj={
                creditFlag: "Y",
                operationMode: "A01"
            }
            obj = Object.assign(obj, this.queryForm)
            this.post('/auth/authService/LMS.IQ.01.0021', obj, (res) => {
            	if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.creditNodeDesc,
                                value: item.creditNodeNo
                            }
                        })
                        this.creditNodeNoOptions = arr
                    } else {
                        this.creditNodeNoOptions = []
                    }
                }
            })
        }, 
        //额度节点确认
        getCreditcurrencyArray() {
          	this.showInfo=true
         	let  obj={
                operationMode: "A01",
                grantAdjustFlag: 'G',
            }
            obj = Object.assign(obj, this.queryForm)
            this.post('/auth/authService/LMS.IQ.01.0020', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.creditContent = res.returnData.rows[0]
                        this.creditTwocurrencyOptions = res.returnData.rows;  // 授信币种
                        if (null != res.returnData.rows[0]) {
							if (res.returnData.rows[0].creditType == "P") {
								this.showDate = false;
								this.creditInfo.startDate = "";
								this.creditInfo.endDate = "";
								this.creditTwoType = 'P';
							}else if(res.returnData.rows[0].creditType == "T"){
								this.showDate = true;
								this.creditTwoType = 'T';
							}
						}
                    }
                }
            })
        },
        //关闭客户号码授信币种信息
        closeInfo(){
            this.showInfo=false
            this.creditContent={}
        },
        //确定授信信息btn
        confirmInfo(row){
        	this.$refs['dataFormCredit'].validate((valid) => {
               	if (valid) {
            		let  obj={
		                authDataSynFlag:'1',
		                creditLimit: this.creditContent.creditLimit,
		                creditNodeNo: this.creditNodeNoVal,
		                creditType: this.creditContent.creditType,
		                currencyCode: this.creditContent.currencyCodeInfo,
		                customerNo: this.creditContent.customerNo,
		                externalIdentificationNo: this.creditContent.externalIdentificationNo,
		                limitEffectvDate: this.creditContent.startDate,
		                limitExpireDate: this.creditContent.endDate,
		                operationMode: this.creditContent.operationMode,
		                firstCreditFlag: this.creditContent.firstCreditFlag
		            }
		          	this.post('/auth/authService/LMS.OP.01.0001', obj,(res) => {
		             	if (res.returnCode =='000000' && res.returnMsg =='OK') {
		             		this.dialogFormVisibleInfo = true;
		             		this.creditInfo = Object.assign({}, row)
		                    this.creditInfo.returnCodeInfo = "成功"
		                    this.creditInfo.startDateInfo=this.creditInfo.startDate//生效日期
				            this.creditInfo.endDataInfo=this.creditInfo.endDate//失效日期
				           	if(this.creditInfo.creditType=='T'){
				                this.creditInfo.creditTwoTypeInfo='临时额度'
				                this.showDateInfo=true
				            }else if(this.creditInfo.creditType=='P'){
				                this.creditInfo.creditTwoTypeInfo='永久额度'
				                this.showDateInfo=false
				            }
		                    this.$forceUpdate()
		                }else{
		                	this.dialogFormVisibleInfo = false
		                    //this.creditInfo.returnCodeInfo = "失败"
		                    this.$forceUpdate()
		                }
		            })
            	}
        	})
        },
    }
  }
</script>

<style>
.cl-span{
    width: 40%;
    float: left;
    text-align: right;
    font-size: 14px;
    padding: 0 12px 0 0;
    line-height: 36px;
    color: #606266;
    font-weight: 500;   
}
</style>
