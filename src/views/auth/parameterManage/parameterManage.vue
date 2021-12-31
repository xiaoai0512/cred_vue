<!-- 国际组织参数管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            	:rules="[ { required: true, message: '运营模式不能为空'}]">
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
           		:rules="[ { required: true, message: '卡组织标识不能为空'}]">
                <el-select v-model="queryFormObj.cardAssociations" class="wd200">
                <el-option
                    v-for="(item, index ) in cardAssociationsOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
             	<el-button size="medium" icon="el-icon-edit" type="primary" @click="handleUp(queryFormObj)" >维护</el-button>
            </div>
        </el-form>
        <div v-if="showList">
        	<div class="mainname titleInfo" v-if='tempInfor.cardAssociations == "C"'>CUP网络详情</div>
        	<div class="mainname titleInfo" v-if='tempInfor.cardAssociations == "J"'>VISA网络详情</div>
        	<div class="mainname titleInfo" v-if='tempInfor.cardAssociations == "M"'>MC网络详情</div>
        	<div class="mainname titleInfo" v-if='tempInfor.cardAssociations == "V"'>VISA网络详情</div>
            <el-form ref="dataFormInfor" :rules="rulesInfor" :model="tempInfor" >
            	<div v-if="tempInfor.cardAssociations == 'C'">
	               	<el-form-item class="cl_td bnone" label="处理中心ID：" prop="instId" >
	                    <el-input v-model="tempInfor.instId" class="wd200" type="text" readonly/>
	                </el-form-item>
	           		<el-form-item class="cl_td bnone" label="报文保存标志：" prop="logIsoMsgIndInfoC" >
	                    <el-input v-model="tempInfor.logIsoMsgIndInfoC" class="wd200" type="text" readonly/>
	                </el-form-item>
	               	<el-form-item class="cl_td bnone" label="系统跟踪号：" prop="refNbr">
                    	<el-input v-model="tempInfor.refNbr" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="交易MAC验证标志：" prop="tranMacProcessIndInfoC" >
                    	<el-input v-model="tempInfor.tranMacProcessIndInfoC" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="密钥MAC验证标志：" prop="cipherMacProcessIndInfoC" >
                    	<el-input v-model="tempInfor.cipherMacProcessIndInfoC" class="wd200" type="text" readonly/>
                	</el-form-item>
                </div>
                <div v-if="tempInfor.cardAssociations == 'J'">
	               	<el-form-item class="cl_td bnone" label="处理中心ID：" prop="instId" >
	                    <el-input v-model="tempInfor.instId" class="wd200" type="text" readonly/>
	                </el-form-item>
	           		<el-form-item class="cl_td bnone" label="报文保存标志：" prop="logIsoMsgIndInfoJ" >
	                    <el-input v-model="tempInfor.logIsoMsgIndInfoJ" class="wd200" type="text" readonly/>
	                </el-form-item>
	               	<el-form-item class="cl_td bnone" label="支持联系发卡行：" prop="referralRespInInfoJ" >
	                    <el-input v-model="tempInfor.referralRespInInfoJ" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="发卡行预留信息：" prop="referralMsg">
                    	<el-input v-model="tempInfor.referralMsg" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="CAVV：" prop="cavvOptInfoJ" >
                    	<el-input v-model="tempInfor.cavvOptInfoJ" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="支持AVS验证：" prop="avsSupportIndInfoJ" >
                    	<el-input v-model="tempInfor.avsSupportIndInfoJ" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="系统跟踪号：" prop="refNbr">
                    	<el-input v-model="tempInfor.refNbr" class="wd200" type="text" readonly/>
                	</el-form-item>
                </div>
                <div v-if="tempInfor.cardAssociations == 'M'">
	               	<el-form-item class="cl_td bnone" label="处理中心ID：" prop="instId" >
	                    <el-input v-model="tempInfor.instId" class="wd200" type="text" readonly/>
	                </el-form-item>
	           		<el-form-item class="cl_td bnone" label="报文保存标志：" prop="logIsoMsgIndInfoM" >
	                    <el-input v-model="tempInfor.logIsoMsgIndInfoM" class="wd200" type="text" readonly/>
	                </el-form-item>
	               	<el-form-item class="cl_td bnone" label="支持联系发卡行：" prop="referralRespInInfoM" >
	                    <el-input v-model="tempInfor.referralRespInInfoM" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="发卡行预留信息：" prop="referralMsg">
                    	<el-input v-model="tempInfor.referralMsg" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="授权安全码：" prop="authSecCode" >
                    	<el-input v-model="tempInfor.authSecCode" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="文件安全码：" prop="fileSecCode" >
                    	<el-input v-model="tempInfor.fileSecCode" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="AVS使用方式：" prop="avsSupportIndInfoM">
                    	<el-input v-model="tempInfor.avsSupportIndInfoM" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="系统跟踪号：" prop="refNbr">
                    	<el-input v-model="tempInfor.refNbr" class="wd200" type="text" readonly/>
                	</el-form-item>
                </div>
                 <div v-if="tempInfor.cardAssociations == 'V'">
	               	<el-form-item class="cl_td bnone" label="处理中心ID：" prop="instId" >
	                    <el-input v-model="tempInfor.instId" class="wd200" type="text" readonly/>
	                </el-form-item>
	           		<el-form-item class="cl_td bnone" label="报文保存标志：" prop="logIsoMsgIndInfov" >
	                    <el-input v-model="tempInfor.logIsoMsgIndInfov" class="wd200" type="text" readonly/>
	                </el-form-item>
	               	<el-form-item class="cl_td bnone" label="支持联系发卡行：" prop="referralRespInInfoV" >
	                    <el-input v-model="tempInfor.referralRespInInfoV" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td bnone" label="发卡行预留信息：" prop="referralMsg">
                    	<el-input v-model="tempInfor.referralMsg" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="CAVV：" prop="cavvOptInfoV" >
                    	<el-input v-model="tempInfor.cavvOptInfoV" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="支持AVS验证：" prop="avsSupportIndInfoV" >
                    	<el-input v-model="tempInfor.avsSupportIndInfoV" class="wd200" type="text" readonly/>
                	</el-form-item>
                	<el-form-item class="cl_td bnone" label="系统跟踪号：" prop="refNbr">
                    	<el-input v-model="tempInfor.refNbr" class="wd200" type="text" readonly/>
                	</el-form-item>
                </div>
        		<div class="cl_tr text_center">
	                <el-button size="medium"  type="primary" @click="closeInfo()" >关闭</el-button>
	            </div>	
            </el-form>
		</div>
		<!-- 维护&&修改 -->
        <el-dialog :title="titleName" :visible.sync="dialogFormVisibleUp" width="65%">
        	<div class="mainname titleInfo" v-if='tempUp.cardAssociations == "C"'>CUP参数详情</div>
        	<div class="mainname titleInfo" v-if='tempUp.cardAssociations == "J"'>JCB参数详情</div>
        	<div class="mainname titleInfo" v-if='tempUp.cardAssociations == "M"'>MC参数详情</div>
        	<div class="mainname titleInfo" v-if='tempUp.cardAssociations == "V"'>VISA参数详情</div>
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
            	<div v-if="tempUp.cardAssociations =='C'">
	            	<el-form-item class="cl_td" label="处理中心ID" prop="instId"
	                     :rules="[ { required: true, message: '处理中心ID不能为空'}]" >
	                    <el-input v-model="tempUp.instId" class="wd200" type="text" />
	                </el-form-item>
	               	<el-form-item class="cl_td" label="报文保存标志" prop="logIsoMsgInd" 
	                   :rules="[ { required: true, message: '报文保存标志不能为空'}]">
	                    <el-select v-model="tempUp.logIsoMsgInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in logIsoMsgIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	                <el-form-item class="cl_td" label="系统跟踪号  " prop="refNbr">
	                    <el-input v-model="tempUp.refNbr" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="交易MAC验证标志" prop="tranMacProcessInd" 
	                   :rules="[ { required: true, message: '交易MAC验证标志不能为空'}]">
	                    <el-select v-model="tempUp.tranMacProcessInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in tranMacProcessIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	                 <el-form-item class="cl_td" label="密钥MAC验证标志" prop="cipherMacProcessInd" 
	                   :rules="[ { required: true, message: '密钥MAC验证标志不能为空'}]">
	                    <el-select v-model="tempUp.cipherMacProcessInd" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in cipherMacProcessIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
                </div>
                <div v-if="tempUp.cardAssociations =='J'"> 
                	<el-form-item class="cl_td" label="处理中心ID" prop="instId"
	                     :rules="[ { required: true, message: '处理中心ID不能为空'}]" >
	                    <el-input v-model="tempUp.instId" class="wd200" type="text"  />
	                </el-form-item>
                	<el-form-item class="cl_td" label="报文保存标志" prop="logIsoMsgInd" 
	                   :rules="[ { required: true, message: '报文保存标志不能为空'}]">
	                    <el-select v-model="tempUp.logIsoMsgInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in logIsoMsgIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
                	<el-form-item class="cl_td" label="支持联系发卡行" prop="referralRespIn"
                     	:rules="[ { required: true, message: '支持联系发卡行不能为空'}]" >
                     	<el-select v-model="tempUp.referralRespIn" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in referralRespInUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
                    </el-form-item>
	                <el-form-item class="cl_td" label="发卡行预留信息 " prop="referralMsg" 
	                	:rules="[ { required: true, message: '发卡行预留信息 不能为空'}]">
	                    <el-input v-model="tempUp.referralMsg" class="wd200" type="text" />
	                </el-form-item>
                	<el-form-item class="cl_td" label="CAVV" prop="cavvOpt" 
	                    :rules="[ { required: true, message: 'CAVV不能为空'}]">
	                    <el-select v-model="tempUp.cavvOpt" class="wd200" >
                    	<el-option
                        v-for="(item, index ) in cavvOptUOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    	</el-select>
                	</el-form-item>
                	<el-form-item class="cl_td" label="支持AVS验证" prop="avsSupportInd" 
	                    :rules="[ { required: true, message: '支持AVS验证不能为空'}]">
	                    <el-select v-model="tempUp.avsSupportInd" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in avsSupportIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
	                <el-form-item class="cl_td" label="系统跟踪号  " prop="refNbr">
	                    <el-input v-model="tempUp.refNbr" class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
                <div v-if="tempUp.cardAssociations =='M'">
                	<el-form-item class="cl_td" label="处理中心ID" prop="instId"
	                     :rules="[ { required: true, message: '处理中心ID不能为空'}]" >
	                    <el-input v-model="tempUp.instId" class="wd200" type="text"  />
	                </el-form-item>
                	<el-form-item class="cl_td" label="报文保存标志" prop="logIsoMsgInd" 
	                   :rules="[ { required: true, message: '报文保存标志不能为空'}]">
	                    <el-select v-model="tempUp.logIsoMsgInd" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in logIsoMsgIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
                	<el-form-item class="cl_td" label="支持联系发卡行" prop="referralRespIn"
                     	:rules="[ { required: true, message: '支持联系发卡行不能为空'}]" >
                     	<el-select v-model="tempUp.referralRespIn" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in referralRespInUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
                    </el-form-item>
	                <el-form-item class="cl_td" label="发卡行预留信息 " prop="referralMsg" 
	                	:rules="[ { required: true, message: '发卡行预留信息 不能为空'}]">
	                    <el-input v-model="tempUp.referralMsg" class="wd200" type="text" />
	                </el-form-item>
                	 <el-form-item class="cl_td" label="授权安全码 " prop="authSecCode" 
	                	:rules="[ { required: true, message: '授权安全码 不能为空'}]">
	                    <el-input v-model="tempUp.authSecCode" class="wd200" type="text" />
	                </el-form-item>
                	<el-form-item class="cl_td" label="授文件安全码 " prop="fileSecCode" 
	                	:rules="[ { required: true, message: '授文件安全码 不能为空'}]">
	                    <el-input v-model="tempUp.fileSecCode" class="wd200" type="text" />
	                </el-form-item>
                	<el-form-item class="cl_td" label="AVS使用方式" prop="avsSupportInd"
                     	:rules="[ { required: true, message: 'AVS使用方式不能为空'}]" >
                     	<el-select v-model="tempUp.avsSupportInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in avsSOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
                    </el-form-item>
                	<el-form-item class="cl_td" label="系统跟踪号  " prop="refNbr">
	                    <el-input v-model="tempUp.refNbr" class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
                <div v-if="tempUp.cardAssociations == 'V'">
                	<el-form-item class="cl_td" label="处理中心ID" prop="instId"
	                     :rules="[ { required: true, message: '处理中心ID不能为空'}]" >
	                    <el-input v-model="tempUp.instId" class="wd200" type="text"  />
	                </el-form-item>
                	<el-form-item class="cl_td" label="报文保存标志" prop="logIsoMsgInd" 
	                   :rules="[ { required: true, message: '报文保存标志不能为空'}]">
	                    <el-select v-model="tempUp.logIsoMsgInd" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in logIsoMsgIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
                	<el-form-item class="cl_td" label="支持联系发卡行" prop="referralRespIn"
                     	:rules="[ { required: true, message: '支持联系发卡行不能为空'}]" >
                     	<el-select v-model="tempUp.referralRespIn" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in referralRespInUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
                    </el-form-item>
	                <el-form-item class="cl_td" label="发卡行预留信息 " prop="referralMsg" 
	                	:rules="[ { required: true, message: '发卡行预留信息 不能为空'}]">
	                    <el-input v-model="tempUp.referralMsg" class="wd200" type="text" />
	                </el-form-item>
                	<el-form-item class="cl_td" label="CAVV" prop="cavvOpt" 
	                    :rules="[ { required: true, message: 'CAVV不能为空'}]">
	                    <el-select v-model="tempUp.cavvOpt" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in cavvOptUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>
                	<el-form-item class="cl_td" label="支持AVS验证" prop="avsSupportInd" 
	                    :rules="[ { required: true, message: '支持AVS验证不能为空'}]">
	                    <el-select v-model="tempUp.avsSupportInd" class="wd200" >
	                    <el-option
	                        v-for="(item, index ) in avsSupportIndUOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                    </el-select>
	                </el-form-item>	
                	<el-form-item class="cl_td" label="系统跟踪号  " prop="refNbr">
	                    <el-input v-model="tempUp.refNbr" class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
            </el-form>   
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()"> 确定</el-button>
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
            // 列表
            showList: false,
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            tableList: [],
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableTotal: 0,
            corporationEntityNo: '',
            // 下拉框
            operationModeOptions: [], //运营模式
            applicationRangeOptions: [],//应用范围
            cardAssociationsOptions: [],//卡组标识
            tempStatusOptions: [],//功能选择
            keyTypeOptions: [],//秘钥类型
            encryptTypeOptions   : [],//加密算法
            logIsoMsgIndUOptions: [],//报文保存标志
            cipherMacProcessIndUOptions: [],//秘钥MAC验证标志
            avsSupportIndUOptions: [],//AVC使用方式
            cavvOptUOptions: [],//支持cavv验证
            referralRespInUOptions: [],//支持联系发卡行
            /*----新增----*/
            tempInfor: {}, // 新增
            rulesInfor: {}, 
            dataFormInfor: {},
            
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            rulesUp: {},
            dataFormUp:{},
            titleName: '',
        }
    },
    created() {
       	let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
        this.getBtnAuth()
    },
    mounted() {
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            corporationEntityNo: this.corporationEntityNo,
            adminFlagLogin: '1',
		}
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //卡组织标识
       this.getSelectDict( "dic_recordType").then(res => {
       		res.splice(2,1)
       		this.cardAssociationsOptions = res
        })
       	//功能选择
       	this.getSelectDict( "dic_functionArray").then(res => {
       		//res.splice(0,1)
            this.tempStatusOptions = res
        })
       	//秘钥类型
       	this.getSelectDict( "dic_keyType").then(res => {
       		res.splice(1,1)
            this.keyTypeOptions = res
        })
       	//加密算法
       	this.getSelectDict( "dic_encryptType").then(res => {
       		this.encryptTypeOptions = res
        })
       	//报文保存标志
   	 	this.getSelectDict( "dic_saveType").then(res => {
       		this.logIsoMsgIndUOptions = res
        })
   	 	//交易MAC验证标志
   	 	this.getSelectDict( "dic_isYorN").then(res => {
       		this.tranMacProcessIndUOptions = res
        })
   	 	//密钥MAC验证标志、
   	 	this.getSelectDict( "dic_isYorN").then(res => {
       		this.cipherMacProcessIndUOptions = res
        })
   	 	//支持avs验证
   	 	this.getSelectDict( "dic_standByType").then(res => {
       		this.avsSupportIndUOptions = res
        })
   	 	//avs使用方式
   	 	this.getSelectDict( "dic_avsType").then(res => {
       		this.avsSOptions = res
        })
   	 	//支持cavv验证
   	 	this.getSelectDict( "dic_cavvType").then(res => {
       		this.cavvOptUOptions = res
        })
   	 	//支持联系发卡行
   	 	this.getSelectDict( "dic_standByType").then(res => {
       		this.referralRespInUOptions = res
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
                        if (this.eventList.includes('AUS.PM.04.0202')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0201')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0203')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
         //查询
        handleSearch() {
        	this.$refs['queryFormRef'].validate((valid) => {
            	if (valid) {
            		this.showList = true
            		this.queryFormObj.authDataSynFlag = '1'
		        	this.queryFormObj.authFlag = '1'
		        	let obj = {
		            	isTrans: true,//是否需要翻译数据字典
						transParams : ['dic_functionArray'],//查找数据字典所需参数
						transDict : ['procStatus'],//翻译前后key
		            }
		        	obj = Object.assign ( obj, this.queryFormObj )// 合并
        			if(this.queryFormObj.cardAssociations=='C'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0202', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempInfor = res.returnData.rows[0]
			                        if(this.tempInfor.logIsoMsgInd == 'Y'){
				                		this.tempInfor.logIsoMsgIndInfoC = '保存';   //'保存';
				                	}else if(this.tempInfor.logIsoMsgInd == 'N'){
				                		this.tempInfor.logIsoMsgIndInfoC = '不保存';   //'不保存';
				                	}
				            		if(this.tempInfor.tranMacProcessInd == "Y"){
				            			this.tempInfor.isMac = true;
				            			this.tempInfor.tranMacProcessIndInfoC = '是';   //'是';
				            		}
				            		else if(this.tempInfor.tranMacProcessInd == 'N'){
				            			this.tempInfor.isMac = false;
				            			this.tempInfor.tranMacProcessIndInfoC = '否';   //'否';
				            		}
				            		if(this.tempInfor.cipherMacProcessInd == "Y"){
				            			this.tempInfor.iscipherMac = true;
				            			this.tempInfor.cipherMacProcessIndInfoC = '是';   //'是';
				            		}
				            		else if(this.tempInfor.cipherMacProcessInd == 'N'){
				            			this.tempInfor.iscipherMac = false;
				            			this.tempInfor.cipherMacProcessIndInfoC = '否';   //'否';
				            		}
			                    }
			               	}
			           	})
            		}
		           if(this.queryFormObj.cardAssociations=='J'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0302', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempInfor = res.returnData.rows[0]
			                        if(this.tempInfor.logIsoMsgInd == 'Y'){
				                		this.tempInfor.logIsoMsgIndInfoJ = '保存';   //保存
				                		
				                	}else if(this.tempInfor.logIsoMsgInd == 'N'){
				                		this.tempInfor.logIsoMsgIndInfoJ = '不保存';   //'不保存';   
				                	}
				                	if(this.tempInfor.referralRespIn == 'Y'){
				                		this.tempInfor.referralRespInInfoJ = '支持';   //'支持';
				                	}else if(this.tempInfor.referralRespIn == 'N'){
				                		this.tempInfor.referralRespInInfoJ = '不支持';   //'不支持';
				                	}
				                	if(this.tempInfor.cavvOpt == '0'){
				                		this.tempInfor.cavvOptInfoJ = '不支持验证';   //'不支持验证';
				                	}else if(this.tempInfor.cavvOpt== '1'){
				                		this.tempInfor.cavvOptInfoJ = '支持VISA验证';   //'支持VISA验证';
				                	}else if(this.tempInfor.cavvOpt == '2'){
				                		this.tempInfor.cavvOptInfoJ = '发卡行验证';   //'发卡行验证';
				                	}
				                	if(this.tempInfor.avsSupportInd == 'Y'){
				                		this.tempInfor.avsSupportIndInfoJ = '支持';   //'支持';
				                	}else if(this.tempInfor.avsSupportInd == 'N'){
				                		this.tempInfor.avsSupportIndInfoJ = '不支持';   //'不支持';
				                	}
			                    }
			                }
		            	})
            		}
		            if(this.queryFormObj.cardAssociations=='M'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0102', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempInfor = res.returnData.rows[0]
			                         if(this.tempInfor.logIsoMsgInd == 'Y'){
				                		this.tempInfor.logIsoMsgIndInfoM = '保存';   //'保存';
				                	}else if(this.tempInfor.logIsoMsgInd == 'N'){
				                		this.tempInfor.logIsoMsgIndInfoM = '不保存';   //'不保存';
				                	}
				                	if(this.tempInfor.referralRespIn == 'Y'){
				                		this.tempInfor.referralRespInInfoM = '支持';   //'支持';
				                	}else if(this.tempInfor.referralRespIn == 'N'){
				                		this.tempInfor.referralRespInInfoM = '不支持';   //'不支持';
				                	}
				                	if(this.tempInfor.avsSupportInd == '0'){
				                		this.tempInfor.avsSupportIndInfoM = '不支持验证';   //'不支持验证';
				                	}else if(this.tempInfor.avsSupportInd == '1'){
				                		this.tempInfor.avsSupportIndInfoM = '验证完整信息';   //'验证完整信息';
				                	}else if(this.tempInfor.avsSupportInd == '2'){
				                		this.tempInfor.avsSupportIndInfoM = '验证前5位地址(全数字)';   //'验证前5位地址(全数字)';
				                	}else if(this.tempInfor.avsSupportInd == '3'){
				                		this.tempInfor.avsSupportIndInfoM = '验证首字符前5位地址(全数字)';   //'验证首字符前5位地址(全数字)';
				                	}else if(this.tempInfor.avsSupportInd == '4'){
				                		this.tempInfor.avsSupportIndInfoM = '验证前5位邮编(全数字)';   //'验证前5位邮编(全数字)';
				                	}
			                    }
			                }
		            	})
            		}
		              if(this.queryFormObj.cardAssociations=='V'){
            			this.getTableList('/beta/betaService/AUS.PM.10.0002', obj,(res) => {
			                if (res.returnCode == '000000') {
			                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
			                        this.tempInfor = res.returnData.rows[0]
			                        if(this.tempInfor.logIsoMsgInd == 'Y'){
				                		this.tempInfor.logIsoMsgIndInfov = '保存';   //保存
				                	}else if(this.tempInfor.logIsoMsgInd == 'N'){
				                		this.tempInfor.logIsoMsgIndInfov = '不保存';   //'不保存';   
				                	}
				                	if(this.tempInfor.referralRespIn == 'Y'){
				                		this.tempInfor.referralRespInInfoV = '支持';   //'支持';
				                	}else if(this.tempInfor.referralRespIn == 'N'){
				                		this.tempInfor.referralRespInInfoV = '不支持';   //'不支持';
				                	}
				                	if(this.tempInfor.cavvOpt == '0'){
				                		this.tempInfor.cavvOptInfoV = '不支持验证';   //'不支持验证';
				                	}else if(this.tempInfor.cavvOpt == '1'){
				                		this.tempInfor.cavvOptInfoV = '支持VISA验证';   //'支持VISA验证';
				                	}else if(this.tempInfor.cavvOpt == '2'){
				                		this.tempInfor.cavvOptInfoV = '发卡行验证';   //'发卡行验证';
				                	}
				                	if(this.tempInfor.avsSupportInd == 'Y'){
				                		this.tempInfor.avsSupportIndInfoV = '支持';   //'支持';
				                	}else if(this.tempInfor.avsSupportInd == 'N'){
				                		this.tempInfor.avsSupportIndInfoV = '不支持';   //'不支持';
				                	}
			                    }
			                }
		            	})
            		}
	          	}
	        })
        },
        //维护显示的弹框
        handleUp(row) {
        	this.tempUp = Object.assign({}, row)
        	this.dialogFormVisibleUp = true
        	if(this.tempUp.cardAssociations=='C'){
        		this.titleName = '维护CUP参数'
        	}else if(this.tempUp.cardAssociations == "J"){
        		this.titleName = '维护VISA参数'
        	}else if(this.tempUp.cardAssociations == "M"){
        		this.titleName = '维护MC参数'
        	}else if(this.tempUp.cardAssociations == "V"){
        		this.titleName = '维护VISA参数'
        	}
        	this.getUpInfo()
	        this.$nextTick(() => {
		        this.$refs['dataFormUp'].clearValidate()
	      	})
	    }, 
	    //基本信息
        getUpInfo(){
        	let obj = {
        		authDataSynFlag: '1',
        		operationMode: this.tempUp.operationMode,
        		cardAssociations: this.tempUp.cardAssociations,
        	}
        	if(this.tempUp.cardAssociations == 'J'){
        		this.post('/beta/betaService/AUS.PM.10.0302', obj ,(res) => {
		            if (res.returnCode == '000000') {
		                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                   	this.tempUp = res.returnData.rows[0]
		                }
		            }
	        	})
        	}
        	if(this.tempUp.cardAssociations == 'M'){
	    	 	this.post('/beta/betaService/AUS.PM.10.0102', obj ,(res) => {
		            if (res.returnCode == '000000') {
		                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                   	this.tempUp = res.returnData.rows[0]
		                }
		            }
	        	})
    	 	}
        	if(this.tempUp.cardAssociations == 'V'){
        		this.post('/beta/betaService/AUS.PM.10.0002', obj ,(res) => {
		            if (res.returnCode == '000000') {
		                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                   	this.tempUp = res.returnData.rows[0]
		                }
		            }
	        	})
        	}
        	if(this.tempUp.cardAssociations == 'C'){
        		this.post('/beta/betaService/AUS.PM.10.0202', obj ,(res) => {
		            if (res.returnCode == '000000') {
		                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                   	this.tempUp = res.returnData.rows[0]
		                }
		            }
	        	})
        	}
        },
       //执行
       	updateData(){
       		let  data = {
	       			authDataSynFlag: "1",
					authFlag: "1",
	       		}
       		data = Object.assign ( data, this.tempUp ) //合并
	       	if(this.tempUp.cardAssociations=='C'){
	       		this.post('/beta/betaService/AUS.PM.10.0203', data, (res) => {
                    if (res.returnCode == '000000') {
						this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.dialogFormVisibleUp = false
						this.showList = false
                    }
	        	})
	       	}
	       	if(this.tempUp.cardAssociations=='J'){
	       		this.post('/beta/betaService/AUS.PM.10.0303', data, (res) => {
                    if (res.returnCode == '000000') {
						this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.dialogFormVisibleUp = false
						this.showList = false
                    }
	        	})
	       	}
	      	if(this.tempUp.cardAssociations=='M'){
	       		this.post('/beta/betaService/AUS.PM.10.0102', data, (res) => {
                    if (res.returnCode == '000000') {
						 this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.dialogFormVisibleUp = false
						this.showList = false
                    }
	        	})
	       	}
	       	if(this.tempUp.cardAssociations=='V'){
	       		this.post('/beta/betaService/AUS.PM.10.0003', data, (res) => {
                    if (res.returnCode == '000000') {
						 this.$notify({
						title: 'Success',
						message: '执行成功',
						type: 'success',
						duration: 2000
						})
						this.handleSearch()
						this.dialogFormVisibleUp = false
						this.showList = false
                    }
	        	})
	       	}
        },
        //关闭按钮
        closeInfo(){
        	this.showList = false
        	this.tempInfor = {}
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
