<!-- 货币清单 -->
<template>
  <div class="allContent">
    <el-form ref="currencyForm" :inline="true" :model="currencyList">
    <el-form-item class="cl_td" :label="$t('currencyQuery.currencyCode')" prop="currencyCode">
        <el-input v-model="currencyList.currencyCode" class="wd200" type="text" />
    </el-form-item>
    <div class="cl_tr text_center">
        <el-button type="primary" icon="el-icon-search" @click="handleFilter" v-if="selBtnFlag">{{$t('search.query')}}</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate" v-if="addBtnFlag">{{$t('search.add')}}</el-button>
    </div>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="currencyCode" :label="$t('currencyQuery.currencyCode')" align="center" />
      <el-table-column prop="currencyDesc" :label="$t('currencyQuery.currencyDesc')" align="center" />
      <el-table-column prop="decimalPosition" :label="$t('currencyQuery.decimalPosition')" align="center" />
      <el-table-column prop="referred" :label="$t('currencyQuery.referred')"  align="center" />
      <el-table-column prop="freeExchangeFlagDesc" :label="$t('currencyQuery.freeExchangeFlag')"  align="center" />
      <el-table-column prop="countryCode" :label="$t('currencyQuery.countryCode')" align="center"/>
      <el-table-column :label="$t('table.action')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(row,$index)" v-if="updBtnFlag">
            {{$t('table.edit')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="currencyList.pageNum" :limit.sync="currencyList.pageSize" @pagination="getList" />

    <!-- 新增 -->
    <el-dialog :title="$t('table.add')" :visible.sync="dialogFormVisible" width="65%">
      <el-form ref="dataForm" :rules="rules" :model="temp" >
        <el-form-item class="cl_td" :label="$t('currencyQuery.currencyCode')" prop="currencyCode"
        :rules="[ { required: true, message: this.$t('currencyQuery.validate_currencyCode1'), trigger: 'blur' },
          {max: 3, message: this.$t('currencyQuery.validate_currencyCode2'),trigger: 'blur' } ]">
            <el-input v-model="temp.currencyCode" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('currencyQuery.currencyDesc')" prop="currencyDesc">
            <el-input v-model="temp.currencyDesc" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('currencyQuery.decimalPosition')" prop="decimalPosition">
            <el-input v-model="temp.decimalPosition" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('currencyQuery.referred')" prop="referred">
            <el-input v-model="temp.referred" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('currencyQuery.freeExchangeFlag')" prop="freeExchangeFlag">
            <el-select v-model="temp.freeExchangeFlag" class="wd200" clearable>
              <el-option
                v-for="(item, index ) in freeExchangeFlagOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('currencyQuery.countryCode')" prop="countryCode">
            <el-input v-model="temp.countryCode" class="wd200" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{$t('table.cancel')}}
        </el-button>
        <el-button type="primary" @click="createData()">
          {{$t('table.sure')}}
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :title="$t('table.edit')" :visible.sync="dialogFormVisibleUp" width="65%">
        <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
          <el-form-item class="cl_td" :label="$t('currencyQuery.currencyCode')" prop="currencyCode">
              <el-input v-model="tempUp.currencyCode" class="wd200" type="text" disabled/>
          </el-form-item>
          <el-form-item class="cl_td" :label="$t('currencyQuery.currencyDesc')" prop="currencyDesc">
              <el-input v-model="tempUp.currencyDesc" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" :label="$t('currencyQuery.decimalPosition')" prop="decimalPosition">
              <el-input v-model="tempUp.decimalPosition" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" :label="$t('currencyQuery.referred')" prop="referred">
              <el-input v-model="tempUp.referred" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" :label="$t('currencyQuery.freeExchangeFlag')" prop="freeExchangeFlag">
              <el-select v-model="tempUp.freeExchangeFlag" class="wd200" clearable>
                <el-option
                  v-for="(item, index ) in freeExchangeFlagOptions"
                  :key="index"
                  :label="item.detailDesc"
                  :value="item.codes"
                />
              </el-select>
          </el-form-item>
          <el-form-item class="cl_td" :label="$t('currencyQuery.countryCode')" prop="countryCode">
              <el-input v-model="tempUp.countryCode" class="wd200" type="text" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleUp = false">
              {{$t('table.cancel')}}
          </el-button>
          <el-button type="primary" @click="updateData()">
             {{$t('table.sure')}}
          </el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'CurrencyQuery',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      selBtnFlag:false,
      addBtnFlag:false,
      updBtnFlag:false,
      btnAuthStr: '',
      currencyList: {
        pageNum: 1,
        pageSize: 10,
      },
      freeExchangeFlagList: [],
      freeExchangeFlagOptions: [], // 下拉框
      showReviewer: false,
      temp: {
        currencyCode: '',
        currencyDesc: '',
        decimalPosition: '',
        referred: '',
        freeExchangeFlag: '',
        countryCode: ''
      },
      tempUp: {},
      dialogFormVisible: false,
      dialogFormVisibleUp: false,
      pvData: [],
      downloadLoading: false,
      rulesUp:  {},
      rules:  {},
    }
  },
  created() {},
  mounted() {
    this.getList() // 查询列表
    this.getBtnAuth()
    this.getSelectDict('dic_exchangeMark').then((res) => {
      this.freeExchangeFlagList = res
      this.freeExchangeFlagOptions = res
    })
    this.local = window.sessionStorage.getItem('language')
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0012') != -1) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0012') != -1) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0012') != -1) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 查询列表
    getList() {
      this.listLoading = true
      const obj = {
        isTrans: true,
        transParams: ['dic_exchangeMark'],
        transDict: ['freeExchangeFlag']
      }
      this.currencyList = Object.assign(this.currencyList, obj)
      this.getTableList('/beta/betaService/COS.IQ.02.0012', this.currencyList ,(res1) => {
      	this.listLoading = false
      	if (res1.returnCode == '000000') {
          if (res1.returnData && res1.returnData.rows && res1.returnData.rows.length > 0) {
			        this.list = res1.returnData.rows
			        this.total = res1.returnData.totalCount
			    }else {
	       		this.list = []
	       		this.total = 0
	       	}
     		}
      }, (err) => {
      		this.list = []
       		this.total = 0
       		this.listLoading = false
      })
    },
    // 查询
    handleFilter() {
      this.currencyList.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        currencyCode: '',
        currencyDesc: '',
        decimalPosition: '',
        referred: '',
        freeExchangeFlag: '',
        countryCode: '',
      }
    },
    // 新增按钮
    handleCreate() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.post('/beta/betaService/COS.AD.02.0012', this.temp, (res) => {
            if (res.returnCode == '000000') {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: this.$t('table.add_success'),
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.temp = {}
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.tempUp = Object.assign({}, row) // copy obj
    //   this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogFormVisibleUp = true
      this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataFormUp'].validate((valid) => {
          let _this = this
        if (valid) {
          const tempData = Object.assign({}, this.tempUp)
          this.post('/beta/betaService/COS.UP.02.0012', tempData, (res) => {
            if (res.returnCode == '000000') {
              const index = this.list.findIndex(v => v.id === this.tempUp.id)
              this.dialogFormVisibleUp = false
              this.$notify({
                title: 'Success',
                message: this.$t('table.up_success'),
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
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: this.$t('table.delete_success'),
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }
  }
}
</script>
