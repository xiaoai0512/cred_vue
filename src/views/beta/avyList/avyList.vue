<!-- 活动清单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="activitySearchForm" :model="activitySearchForm" :rules="activitySearchFormRules">
        <el-form-item class="cl_td" :label="$t('avyList.activityNo')" prop="activityNo">
            <el-input v-model="activitySearchForm.activityNo" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('avyList.activityDesc')" prop="activityDesc">
            <el-input v-model="activitySearchForm.activityDesc" class="wd200" type="text" />
        </el-form-item>
        <div class="cl_tr text_center">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">{{$t('search.query')}}</el-button>
            <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">{{$t('search.add')}}</el-button>
        </div>
    </el-form>
    <el-table
        v-loading = "listLoading1"
        :data="activityList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%;"
        border
      >
        <el-table-column prop="activityNo" :label="$t('avyList.activityNo')" align="center" />
        <el-table-column prop="activityDesc" :label="$t('avyList.activityDesc')" align="center" />
        <el-table-column prop="logLevelDesc" :label="$t('avyList.logLevel')" align="center" />
        <el-table-column prop="logTypeDesc" :label="$t('avyList.logType')" align="center" />
        <el-table-column prop="lifecycleNode" :label="$t('avyList.lifecycleNode')" align="center" />
        <el-table-column prop="" :label="$t('table.action')" align="center" width="400">
            <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-arrow-right" type="primary" @click="handleArtifact(row)" v-show="selBtnFlag">{{$t('avyList.query_artifact')}}</el-button>
                <el-button size="mini" icon="el-icon-arrow-right" type="primary" @click="handleEvent(row)" v-show="selBtnFlag">{{$t('avyList.query_event')}}</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">{{$t('table.edit')}}</el-button>
            </template>
        </el-table-column>
      </el-table>
      <pagination v-show="activityTotal>0" :total="activityTotal" :page.sync="activitySearchForm.pageNum" :limit.sync="activitySearchForm.pageSize" @pagination="getActivityList" />
  
        
        <!-- 新增 -->
        <el-dialog :title="$t('avyList.add_activity')" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" :label="$t('avyList.activityNo')" prop="activityNo"
                :rules="[ { required: true, message: $t('avyList.validate_activityNo')} ]" >
                    <el-input v-model="tempAdd.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.activityDesc')" prop="activityDesc" :rules="[ { required: true, message: '活动描述不能为空'} ]">
                    <el-input v-model="tempAdd.activityDesc" class="wd200" type="text" />
                </el-form-item>

                <el-form-item class="cl_td" :label="$t('avyList.logLevel')" prop="logLevel" :rules="[ { required: true, message: '日志层级不能为空'} ]">
                    <el-select v-model="tempAdd.logLevel" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in logLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.logType')" prop="logType" :rules="[ { required: true, message: '日志类型不能为空'} ]">
                    <el-select v-model="tempAdd.logType" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in logTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.lifecycleNode')" prop="lifecycleNode">
                    <el-select v-model="tempAdd.lifecycleNode" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in lifecycleNodeOptions"
                        :key="index"
                        :label="item.nodeTypNumbr"
                        :value="item.nodeTypNumbr"
                      />
                    </el-select>
                </el-form-item>
                <div class="text_title">{{$t('avyList.choose_artifact')}}</div>
                <div style="margin-left: 12%;">
                    <el-transfer 
                        filterable
                        :filter-method="filterMethod"
                        :titles="[ $t('avyList.can_choose_artifact'), $t('avyList.choosed_artifact')]"
                        :filter-placeholder="$t('avyList.input_artifact')"
                        v-model="tempAdd.listAddPage"
                        @change="handleAddComponent"
                        :data="add_allComponentData">
                    </el-transfer>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="createData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog :title="$t('avyList.edit_activity')" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" :label="$t('avyList.activityNo')" prop="activityNo">
                    <el-input v-model="tempUp.activityNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.activityDesc')" prop="activityDesc" >
                    <el-input v-model="tempUp.activityDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.logLevel')" prop="logLevel">
                    <el-select v-model="tempUp.logLevel" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in logLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.logType')" prop="logType">
                    <el-select v-model="tempUp.logType" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in logTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.lifecycleNode')" prop="lifecycleNode">
                    <el-select v-model="tempUp.lifecycleNode" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in lifecycleNodeOptions"
                        :key="index"
                        :label="item.nodeTypNumbr"
                        :value="item.nodeTypNumbr"
                      />
                    </el-select>
                </el-form-item>
                <div class="text_title">{{$t('avyList.choose_artifact')}}</div>
                <div style="margin-left: 12%;">
                    <el-transfer 
                        filterable
                        :filter-method="filterMethod"
                        :titles="[ this.$t('avyList.can_choose_artifact'), this.$t('avyList.choosed_artifact')]"
                        :filter-placeholder="$t('avyList.input_artifact')"
                        v-model="havedComponentValues"
                        @change="handleChangeComponent"
                        :data="up_allComponentData">
                    </el-transfer>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="up_cancel">
                    {{$t('avyList.cancel')}}
                </el-button>
                <el-button type="primary" @click="updateData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>


        <!-- 查询构件 -->
        <el-dialog :title="$t('avyList.activity_query_artifact')" :visible.sync="dialogFormVisibleArtifact" width="65%">
            <el-form ref="dataFormArtifact" :rules="rulesArtifact" :model="tempArtifact" >
                <el-form-item class="cl_td" :label="$t('avyList.activityNo')" prop="activityNo"
                :rules="[ { required: true, message: $t('avyList.validate_activityNo')} ]" >
                    <el-input v-model="tempArtifact.activityNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.activityDesc')" prop="activityDesc" >
                    <el-input v-model="tempArtifact.activityDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.logLevel')" prop="logLevel">
                    <el-select v-model="tempArtifact.logLevel" class="wd200" clearable  disabled>
                      <el-option
                        v-for="(item, index ) in logLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.logType')" prop="logType">
                    <el-select v-model="tempArtifact.logType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in logTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.lifecycleNode')" prop="lifecycleNode">
                    <el-input v-model="tempArtifact.lifecycleNode" class="wd200" type="text"  readonly />
                </el-form-item>
                <div class="text_title">{{$t('avyList.activity_related_artifact')}}</div>
                <el-table
                    :data="detai_componentList"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                <el-table-column prop="artifactNo" :label="$t('elmList.artifactNo')" align="center" />
                <el-table-column prop="artifactDesc" :label="$t('elmList.artifactDesc')" align="center" />
              </el-table>
              <pagination v-show="artifactTotal>0" class="page-name" :total="artifactTotal" :page.sync="artifactList.pageNum" :limit.sync="artifactList.pageSize" @pagination="handleArtifact(tempArtifact)" />
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleArtifact = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>


        <!-- 查询事件 -->
        <el-dialog :title="$t('avyList.activity_query_event')" :visible.sync="dialogFormVisibleEvent" width="65%">
            <el-form ref="dataFormEvent" :rules="rulesEvent" :model="tempEvent" >
                <el-form-item class="cl_td" :label="$t('avyList.activityNo')" prop="activityNo"
                :rules="[ { required: true, message: $t('avyList.validate_activityNo')} ]" >
                    <el-input v-model="tempEvent.activityNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.activityDesc')" prop="activityDesc" >
                    <el-input v-model="tempEvent.activityDesc" class="wd200" type="text" readonly />
                </el-form-item>
                 <el-form-item class="cl_td" :label="$t('avyList.logLevel')" prop="logLevel">
                    <el-select v-model="tempEvent.logLevel" class="wd200" clearable  disabled>
                      <el-option
                        v-for="(item, index ) in logLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.logType')" prop="logType">
                    <el-select v-model="tempEvent.logType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in logTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('avyList.lifecycleNode')" prop="lifecycleNode">
                    <el-input v-model="tempEvent.lifecycleNode" class="wd200" type="text"  readonly />
                </el-form-item>
                <div class="text_title">{{$t('avyList.activity_related_event')}}</div>
                <el-table
                    :data="detai_eventList"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                <el-table-column prop="eventNo" :label="$t('evLstList.eventId')" align="center" />
                <el-table-column prop="eventDesc" :label="$t('evLstList.eventDesc')" align="center" />
              </el-table>
              <pagination v-show="eventTotal>0" class="page-name" :total="eventTotal" :page.sync="eventList.pageNum" :limit.sync="eventList.pageSize" @pagination="handleEvent(tempEvent)" />
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEvent = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'avyList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    const generateData = _ => {
        const componentData = [] // 相当于data
        const componentNoList = [] // 
        const componentList = []
        this.post('/beta/betaService/COS.IQ.02.0007', {} ,(res) => {
            res.returnData.rows.forEach((item, i) => {
                componentList.push(item.artifactNo+' '+item.artifactDesc)
                componentNoList.push(item.artifactNo)
            })
            componentList.forEach((component, index) => {
                componentData.push({
                    label: component,
                    // key: index,
                    key: component.split(' ')[0],
                    artifactNo: componentNoList[index]
                });
            });
        })
        return componentData;  
    };
    return {
        activitySearchForm: {
            pageNum: 1,
            pageSize:10,
        },
        eventList:{
            pageNum: 1,
            pageSize:10,
        },
        artifactList:{
            pageNum: 1,
            pageSize:10,
        },
      activitySearchFormRules: {},
      activityList: [],
      activityTotal: 0,
      eventTotal: 0,
      artifactTotal:0,
      listLoading1: false,
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      btnAuthStr: '',
      tempAdd: {}, // 新增
      tempUp: {}, // 修改
      tempDetail: {}, // 详情
      tempArtifact: {},
      tempEvent: {}, 
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      dialogFormVisibleArtifact: false,
      dialogFormVisibleEvent: false,
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},
      rulesArtifact: {},
      rulesEvent: {},
      logLevelOptions: [], // 日志层级
      logTypeOptions: [], // 日志类型
      lifecycleNodeOptions: [] , // 生命周期节点代码
      add_allComponentData: generateData(),
      filterMethod(query, item) {
        return item.artifactNo.indexOf(query) > -1;
      },
      up_allComponentData: generateData(),
      havedComponentValues: [], // 选中构件
      detai_componentList: [],
      detai_eventList: []
    }
  },
  created() {
    // this.init()
    this.getBtnAuth()
  },
  mounted() {
    this.getActivityList()

    // 生命周期节点代码
    this.post("/beta/betaService/COS.IQ.02.0024", {}, (res) => {
      this.lifecycleNodeOptions = res.returnData.rows
    })
    // 日志层级
    this.getSelectDict('dic_logHierarchy').then((res) => {
      this.logLevelOptions = res
    })

    // 日志类型
    this.getSelectDict('dic_logType').then((res) => {
      this.logTypeOptions = res
    })
  },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        //console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.activitySearchForm = Object.assign(this.activitySearchForm,params)
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0003')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0003')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0003')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 活动清单
    getActivityList() {
        this.listLoading1 = true
        let obj = {
            isTrans: true,
            transParams:['dic_logHierarchy' , 'dic_logType'],
            transDict : ['logLevel', 'logType']
        }
        this.activitySearchForm = Object.assign(this.activitySearchForm, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0003', this.activitySearchForm ,(res) => {
            this.listLoading1 = false
    	 	if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.activityList = res.returnData.rows
                    this.activityTotal = res.returnData.totalCount
				}else{
                	this.activityList = []
                	this.activityTotal = 0
                }
            }
        }, (err) => {
        	if(err) {
        		this.activityList = []
            	this.activityTotal = 0
            	this.listLoading1 = false
        	}
        })
	},
    handleSearch() {
        this.activitySearchForm.pageNum = 1
        this.activitySearchForm.pageSize = 10
        this.getActivityList()
    },
    handleArtifact(row) {
        this.tempArtifact = Object.assign({}, row)
        this.post('/beta/betaService/COS.IQ.02.0004', {activityNo: row.activityNo}, (res) => {
            if( res.returnData && res.returnData.rows) {
                this.detai_componentList = res.returnData.rows
                this.artifactTotal = res.returnData.totalCount
                this.dialogFormVisibleArtifact = true
                this.$nextTick(() => {
                    this.$refs['dataFormArtifact'].clearValidate()
                })
            } else {
                this.detai_componentList = []
                this.artifactTotal = 0
                this.dialogFormVisibleArtifact = true
                this.$nextTick(() => {
                    this.$refs['dataFormArtifact'].clearValidate()
                })
            }
            
        })
    },
    handleEvent(row) {
        this.tempEvent = row
        //console.log(row)
        this.post('/beta/betaService/COS.IQ.02.0002', {activityNo: row.activityNo,pageNum:this.eventList.pageNum,pageSize:this.eventList.pageSize}, (res) => {
            if( res.returnData && res.returnData.rows) {
                this.detai_eventList = res.returnData.rows
                this.eventTotal = res.returnData.totalCount
                this.dialogFormVisibleEvent = true
                this.$nextTick(() => {
                    this.$refs['dataFormEvent'].clearValidate()
                })
            } else {
                this.detai_componentList = []
                this.eventTotal = 0
                this.dialogFormVisibleEvent = true
                this.$nextTick(() => {
                    this.$refs['dataFormEvent'].clearValidate()
                })
            }
            
        })
    },
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        // 查询已有构件
        this.post('/beta/betaService/COS.IQ.02.0004', {activityNo: row.activityNo}, (res) => {
            if( res.returnData && res.returnData.rows) {
                res.returnData.rows.forEach((item , k) => {
                    this.havedComponentValues.push(item.artifactNo)
                })
                this.tempUp.listUpdaPage = this.havedComponentValues
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            } else {
                this.havedComponentValues = []
                this.tempUp.listUpdaPage  = []
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            }
            
        })
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.tempUp.list = []
			    this.tempUp.listUpdaPage.forEach((item , k) => {
                    this.tempUp.list.push({"artifactNo":item})
                })
                delete this.tempUp.listUpdaPage
                this.post('/beta/betaService/COS.UP.02.0003', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                        message: this.$t('table.up_success'),
                        type: 'success',
                        })
                        this.getActivityList()
                        this.tempUp = {}
                    }
                })
            }
        })
    },
    up_cancel() {
        this.dialogFormVisibleUp = false
        this.havedComponentValues = []
    },
    handleChangeComponent(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys)
        this.tempUp.listUpdaPage = value
    },
    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    },
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.tempAdd.list = []
            if(this.tempAdd.listAddPage){
			    this.tempAdd.listAddPage.forEach((item , k) => {
                    this.tempAdd.list.push({"artifactNo":item})
                })
                delete this.tempAdd.listAddPage
            }
          this.post('/beta/betaService/COS.AD.02.0003', this.tempAdd, (res) => {
              if(res.returnCode == '000000'){
                  this.dialogFormVisibleAdd = false
                  this.$notify({
                    message: this.$t('table.add_success'),
                    type: 'success',
                  })
                  this.getActivityList()
                  this.tempAdd = {}
              }
          })
        }
      })
    },
    handleAddComponent(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys)
        this.tempAdd.listAddPage = value
    },
  },
}
</script>

<style>
/* 穿梭框样式 */
    .el-transfer-panel {
        width: 37%;
    }
</style>
