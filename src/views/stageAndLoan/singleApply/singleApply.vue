<!-- 无账期消贷申请 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form :model="queryForm" ref="queryForm" :rules="queryForm">
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId">
                <el-input v-model="queryForm.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
        <el-form-item class="cl_td" label="申请金额" prop="ecommTransAmount">
            <el-input v-model="queryForm.ecommTransAmount" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="申请币种" prop="ecommTransPostingCurr"
            :rules="[ { required: true, message: '申请币种不能为空'} ]" >
            <el-select v-model="queryForm.ecommTransPostingCurr" class="wd200" clearable>
                <el-option
                v-for="(item, index ) in ecommTransPostingCurrOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"/>
            </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="用途" prop="purpose"
            :rules="[ { required: true, message: '用途不能为空'} ]" >
            <el-select v-model="queryForm.purpose" class="wd200" clearable>
                <el-option
                v-for="(item, index ) in purposeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"/>
            </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="收款账户" prop="receiveAccount">
            <el-input v-model="queryForm.receiveAccount" class="wd200" type="text" />
        </el-form-item>
        
        <el-form-item class="cl_td" label="收款账户所属银行 " prop="accountBankNo">
            <el-input v-model="queryForm.accountBankNo" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="交易来源" prop="ecommSourceCde"
            :rules="[ { required: true, message: '交易来源不能为空'} ]" >
            <el-select v-model="queryForm.ecommSourceCde" class="wd200" clearable>
                <el-option
                v-for="(item, index ) in ecommSourceCdeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"/>
            </el-select>
        </el-form-item>
        <div class="cl_tr text_center" >
           <el-button size="medium" round icon="el-icon-plus" type="primary" @click="getList()" >确认</el-button>
        </div>
        </el-form>
     
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'queryForm',
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
        queryForm: {},
        queryFormRef: {},
        // 下拉框
        ecommTransPostingCurrOptions:[],//交易币种
        ecommSourceCdeOptions: [],//交易来源
        purposeOptions: [],//用途

    }
  },
    created() {
        this.getBtnAuth()
    },
    mounted() {
       //币种
        this.getSelectDict( "dic_creditCurrency").then(res => {
            this.ecommTransPostingCurrOptions = res
        })
        //分期期数
        this.getSelectDict( "dic_stageTerm").then(res => {
            this.ecommInstallmentPeriodOptions = res
        })
         //交易来源
        this.getSelectDict( "dic_tradingSource").then(res => {
            this.ecommSourceCdeOptions = res
           
        })
        //用途
        this.getSelectDict( "dic_purpose").then(res => {
            this.purposeOptions = res
           
        })
        
    },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0018')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 点击查询按钮
    handleSearch() {
        this.getList()
    },
    // 列表
    getList() {
        this.$refs['queryForm'].validate((valid) => {
            if (valid) {
                this.post('/card/cardService/ILS.RT.40.0002', this.queryForm, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '申请成功',
                            type: 'success',
                            duration: 2000
                        })
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
