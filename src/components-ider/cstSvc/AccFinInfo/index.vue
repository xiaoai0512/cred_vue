<!-- \账户金融信息组件 -->
<template>
    <div class="" >
        <div class="text_title">账户余额汇总信息</div>
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="账户代码" prop="accountId" >
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="当前总余额" prop="totalBalance" >
                 <el-input v-model="formObj.totalBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当期本金余额" prop="currPrincipalBalance">
                <el-input v-model="formObj.currPrincipalBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账单本金余额" prop="billPrincipalBalance" >
                 <el-input v-model="formObj.billPrincipalBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当期利息余额" prop="currInterestBalance">
                <el-input v-model="formObj.currInterestBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账单利息余额" prop="billInterestBalance" >
                <el-input v-model="formObj.billInterestBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当期费用余额" prop="currCostBalance">
                <el-input v-model="formObj.currCostBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账单费用余额" prop="billCostBalance">
                <el-input v-model="formObj.billCostBalance" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
        <div class="text_title">账户余额利率信息</div>
        <v-table 
            :tableData = "tableData"
            :tableLabel="tableLabel"
            :config ="config"
            :btns="btns"
            :btnWidth= 100
            :event1 ="handleDetail"
            @changePage="getList"
        ></v-table>

        <div class="text_title">账户余额明细信息</div>
        <v-table 
            :tableData = "tableData2"
            :tableLabel="tableLabel2"
            :config ="config2"
            :btns="btns"
            :btnWidth= 100
            :event1 ="handleDetail2"
            @changePage="getList2"
        ></v-table>

        <div class="text_title">账户发生额明细信息</div>
        <v-table 
            :tableData = "tableData3"
            :tableLabel="tableLabel3"
            :config ="config3"
            :btns="btns"
            :btnWidth= 100
            :event1 ="handleDetail3"
            @changePage="getList3"
        ></v-table>
        

    </div>
</template>

<script>
  import VTable from '@/components-ider/VTable'


export default {
  name: 'AccFinInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
  },
  components: {
    VTable,
  },
  created() {},
  activated() {},
  mounted() {},
  watch: {
      formObj () {}
  },
  data() {
    return { 
        formRef: {},
        formRules: {},
        // 账户余额利率信息
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData: [],
        tableLabel: [
            {
                label: '余额对象',
                prop: 'balanceObjectCode_concat',
                width: '200',
            },{
                label: '币种',
                prop: 'currencyCode_concat',
            },{
                label: '生效利率',
                prop: 'interestRate'
            },{
                label: '利率变更标志',
                prop: 'rateChangeFlagDesc'
            },{
                label: 'pending生效利率',
                prop: 'pendingInterestRate'
            },{
                label: '溢缴款利率变动标志',
                prop: 'overpayRateChangeFlagDesc'
            }
        ],
        btns: ['详情'],
        curRowRadio: '',
        curRow: {},
        // 账户余额明细信息
        config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData2: [],
        tableLabel2: [
            {
                label: '周期号',
                prop: 'cycleNumber',
            },{
                label: '余额对象',
                prop: 'balanceObjectCode_concat',
                width: '220'
            },{
                label: '余额单元代码',
                prop: 'balanceUnitCode',
                width: '200',

            },{
                label: '币种',
                prop: 'currencyCode_concat'
            },{
                label: '余额类型',
                prop: 'balanceTypeDesc'
            },{
                label: '余额',
                prop: 'balance'
            },{
                label: '年利率',
                prop: 'annualInterestRate'
            }
        ],
        curRowRadio2: '',
        curRow2: {},
        // 账户发生额明细信息
        config3: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData3: [],
        tableLabel3: [
            {
                label: '周期号',
                prop: 'currentCycleNumber',
            },{
                label: '币种',
                prop: 'currencyCode_concat',
            },{
                label: '期初宽限余额',
                prop: 'beginGraceBalance'
            },{
                label: '当前宽限余额',
                prop: 'graceBalance'
            },{
                label: '宽限日前还款金额',
                prop: 'paymentWithinGrace'
            },{
                label: '宽限日后还款金额	',
                prop: 'paymentAfterGrace'
            },{
                label: '贷方调整金额',
                prop: 'creditAdjustAmount'
            },{
                label: '还款还原宽限日前还款',
                prop: 'paymentRevWithinGrace',
            },{
                label: '还款还原宽限日后还款',
                prop: 'paymentRevAfterGrace',
            }
        ],
        curRowRadio3: '',
        curRow3: {},

    }
  },
  created() {
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
      this.queryTimeBalance() // 查询实时余额
      this.getList() // 账户余额利率信息
      this.getList2() // 账户余额明细信息
      this.getList3() // 账户发生额明细信息

  },
  methods: {
    // 查询实时余额
    queryTimeBalance() {
        let params = {
            authDataSynFlag: "1",
			requestType: "1"
        }
        params = Object.assign(params , this.formObj )
        this.post('/nonfi/nonfinanceService/ISS.IQ.01.0050', params, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.formObj.accountId = res.returnData.rows[0].accountId;// 账号
                    this.formObj.totalBalance = res.returnData.rows[0].totalBalance;//交易账户 
                    this.formObj.billCostBalance = res.returnData.rows[0].feeForBill;
                    this.formObj.billPrincipalBalance = res.returnData.rows[0].principalForBill;
                    this.formObj.billInterestBalance = res.returnData.rows[0].interestForBill;
                    this.formObj.currCostBalance = res.returnData.rows[0].feeForCurrent;
                    this.formObj.currPrincipalBalance = res.returnData.rows[0].principalForCurrent;
                    this.formObj.currInterestBalance = res.returnData.rows[0].interestForCurrent;
                }
                
            }
        })
    },
    // 账户余额利率信息
    getList() {
        this.config.loading = true
        let params = {
            idNumber: this.formObj.idNumber,
            externalIdentificationNo: this.formObj.externalIdentificationNo,
            accountId: this.formObj.accountId,
            currencyCode: this.formObj.currencyCode,
            operationMode: this.formObj.operationMode,
            isTrans: true,
            transParams: ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],
            transDict: ['rateChangeFlag','overpayRateChangeFlag'],
        }
        params = Object.assign(params, this.config )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0025', params, (res) => {
            if (res.returnCode == '000000') {
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(ele => {
                        ele.balanceObjectCode_concat = ele.balanceObjectCode+ele.balanceObjectDesc
                        ele.currencyCode_concat = ele.currencyCode+' '+ele.currencyDesc
                    })
                    this.tableData = rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                }
            }
        })
    },
    // 账户余额明细信息
    getList2() {
        this.config2.loading = true
        let params = {
            idType: this.formObj.idType,
            idNumber: this.formObj.idNumber,
            externalIdentificationNo: this.formObj.externalIdentificationNo,
            accountId: this.formObj.accountId,
            currencyCode: this.formObj.currencyCode,
            operationMode: this.formObj.operationMode,
            isTrans: true,
            transParams: ['dic_balanceType'],
            transDict: ['balanceType'],
        }
        params = Object.assign(params, this.config2 )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0030', params, (res) => {
            if (res.returnCode == '000000') {
                this.config2.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(ele => {
                        ele.balanceObjectCode_concat = ele.balanceObjectCode+ele.balanceObjectDesc
                        ele.currencyCode_concat = ele.currencyCode+' '+ele.currencyDesc
                    })
                    this.tableData2 = rows
                    this.config2.total = res.returnData.totalCount
                } else {
                    this.tableData2 = []
                }
            }
        })
    },
    // 账户发生额明细信息
    getList3() {
        this.config3.loading = true
        let params = {
            idType: this.formObj.idType,
            idNumber: this.formObj.idNumber,
            externalIdentificationNo: this.formObj.externalIdentificationNo,
            accountId: this.formObj.accountId,
            currencyCode: this.formObj.currencyCode,
            operationMode: this.formObj.operationMode,
        }
        params = Object.assign(params, this.config3 )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0045', params, (res) => {
            if (res.returnCode == '000000') {
                this.config3.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(ele => {
                        ele.balanceObjectCode_concat = ele.balanceObjectCode+ele.balanceObjectDesc
                        ele.currencyCode_concat = ele.currencyCode+' '+ele.currencyDesc
                    })
                    this.tableData3 = rows
                    this.config3.total = res.returnData.totalCount
                } else {
                    this.tableData3 = []
                }
            }
        })
    },

    // 账户余额利率信息 查询 按钮
    handleDetail(row) {
        console.log(row)
    },
    // 账户余额明细信息 查询 按钮
    handleDetail2(row) {
        console.log(row)
    },
    // 账户发生额明细信息 查询 按钮
    handleDetail3(row) {
        console.log(row)
    },

  }


}
</script>

<style>

</style>
