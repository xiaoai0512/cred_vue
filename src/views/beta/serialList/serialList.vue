<template>
    <div class="allContent">
        <el-form :model="sequencePage" ref="lifeCycleForm" >
            <el-form-item class="cl_td" :label="$t('serialList.serialType')" prop="serialType" >
                <el-select clearable  v-model="sequencePage.serialType" class="wd200" :placeholder="$t('table.select')">
                    <el-option v-for="(item, index) in sequenceNumber" :key="index" :label="item.text" :value="item.value" />
                </el-select>
            </el-form-item>
            <div class="cl_tr text-centent">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="searchInfo()">{{$t('search.query')}}</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="resetInfo()">{{$t('search.reset')}}</el-button>
            </div>
        </el-form>
        <el-table :data="orderList" border stripe>
            <el-table-column prop="serialType" :label="$t('serialList.serialType')" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.serialType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nextSerialNo" :label="$t('serialList.nextSerialNo')" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.nextSerialNo}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" class="page-name" :total="total" :page.sync="sequencePage.pageNum" :limit.sync="sequencePage.pageSize" @pagination="getSerialList" />
    </div>
</template>
<script>
    import ApiService from '@/api/api-service'
    import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination },
        data() {
            return {
                orderList: null,
                total: 0,
                sequencePage: {
                    pageNum: 1,
                    pageSize: 10
                },
                sequenceNumber: [{value: 'CUS', text: this.$t('serialList.cust_no')}],
            }
        },
            created() {
                this.getSerialList();
            },
            methods: {
                getSerialList() {
                    this.listLoading = true
                    this.post('/beta/betaService/COS.IQ.02.0029', this.sequencePage, (res) => {
                    	this.listLoading = false
                        if (res.returnCode == '000000') {
                			if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                        this.orderList = res.returnData.rows
		                        this.total = res.returnData.totalCount
	                       	}else{
	                       		this.orderList = []
		                        this.total = 0
	                      	}
                       	}
                  	}, (err) => {
                  		this.orderList = []
                        this.total = 0
                    	this.listLoading = false
                    })
                },
               //筛选查询
                searchInfo() {
                    this.sequencePage.pageNum = 1
                    this.sequencePage.pageSize = 10
                    this.getSerialList()
                },
                //重置
                resetInfo() {
                    this.sequencePage.serialType = ""; 
                 },
            }
    }
</script>

<style scoped>
    .cl_td {
        width: 50%;
        float: left;
        height: 36px;        
        line-height: 36px;
        margin-bottom: 8px;
    }
    .allContent .el-table--medium td {
        padding: 6px 0;
    }
    .el-table--medium th{
        padding: 10px 0;
    }
    .text-right {
        text-align: right;
    }
   .col4 {
        width: 40%;
        float: left;
        font-size: 12px;
        line-height: 36px;
    }
    .allContent {
        width: 100%;
        padding: 1%;
        background: #FFFFFF;
        margin-bottom: 20px;
    }
   .allContent .el-input--medium .el-input__inner {
        height: 36px;
        line-height: 36px;
    }
   .allContent .el-input--medium .el-input__icon {
        line-height: 36px;
    }
    .cl-tr {
        width: 100%;
        line-height: 36px;
        height: 36px;
        margin-bottom: 8px;
        float: left;
    }
    .text-centent {
        text-align: center;
    }
    .allContent .w-input .el-input__inner{
        padding: 0 23px;
    }
    .page-name .el-input--medium .el-input__inner{
        height: 28px;
        line-height: 28px;
    }
    .fol-left{
        float: left;
    }
</style>