 <!--管控项目 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
        <el-form-item class="cl_td" label="运营模式" prop="operationMode">
            <el-select v-model="queryFormObj.operationMode" class="wd200" >
            <el-option
                v-for="(item, index ) in operationModeOptions"
                :key="index"
                :label="item.modeName"
                :value="item.operationMode" />
            </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="管控项目编号" prop="controlProjectNo">
            <el-input v-model="queryFormObj.controlProjectNo" class="wd200" type="text" />
        </el-form-item>
        <div class="cl_tr text_center">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button><!--v-show="selBtnFlag"-->
            <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>
        </div>
    </el-form>
    <el-table
        v-loading = "listLoading1"
        :data="tableList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%;"
        border >
        <el-table-column prop="operationMode" label="运营模式" align="center" />
        <el-table-column prop="controlProjectNo" label="管控项目编号" align="center" />
        <el-table-column prop="controlDesc" label="描述" align="center" />
        <el-table-column prop="controlModeDesc" label="管控模式" align="center" />
        <el-table-column prop="" label="操作" align="center" width = "350">
            <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" >详情</el-button>
            <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" >修改</el-button><!--v-show="updBtnFlag"--><br />
            <el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)" v-show="selBtnFlag">复制</el-button>
            </template> 
        </el-table-column>
    </el-table>
    <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="管控项目新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :model="controlAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="controlAdd.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控项目编号" prop="controlProjectNo" 
                    :rules="[ { required: true, message: '管控项目编号不能为空'} ]">
                    <el-input v-model="controlAdd.controlProjectNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="controlDesc" >
                    <el-input v-model="controlAdd.controlDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="管控模式" prop="controlMode" 
                    :rules="[ { required: true, message: '管控模式不能为空'} ]">
                    <el-select v-model="controlAdd.controlMode" class="wd200" @change="controlModeChange">
                    <el-option
                        v-for="(item, index ) in controlModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="预定义管控类别" prop="preControlCategory" v-if="controlAdd.controlMode=='S'">
                    <el-select v-model="controlAdd.preControlCategory" class="wd200" clearable @change="preControlCategoryChange">
                    <el-option
                        v-for="(item, index ) in preControlCategoryOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td red" label="管控动作" prop="controlField" v-if="controlAdd.controlMode=='E'">
                    <el-select v-model="controlAdd.controlField" class="wd200" clearable >
                        <el-option
                            v-for="(item, index ) in controlFieldOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控项目编号" prop="authDenyIdentify" v-if="controlAdd.preControlCategory=='A'">
                <el-select v-model="controlAdd.authDenyIdentify" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in authDenyIdentifyOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"  /> 
                </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别" prop="transIdentifiNo" v-if="controlAdd.preControlCategory=='A'" >
                    <el-input v-model="controlAdd.transIdentifiNo" class="wd200" type="text"/>
                </el-form-item>
            </el-form>

            <!--选择事件-->
            <div v-if="controlAdd.controlMode=='E'">
                <div class="text_title">选择事件</div>
                <el-form ref="dataFormControlSearch" :model="controlSearchForm">
                    <el-form-item class="cl_td" label="事件编号" prop="operationMode">
                        <el-input v-model="controlSearchForm.eventId" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="事件描述" prop="activityDesc">
                        <el-input v-model="controlSearchForm.eventDesc" class="wd200" type="text" />
                    </el-form-item>
                </el-form>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="add_controlSearch()">搜索</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="add_controlHandle()">关联</el-button>
                </div>
                <el-table v-loading = "listLoading2" :data="controltableList"  class="mbtm20" fit highlight-current-row style="width: 100%;"  
                    border @selection-change="add_controlSelectChange">
                    
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="eventNo" label="事件编号" align="center" />
                    <el-table-column prop="eventDesc" label="事件描述" align="center" />
                </el-table>
                <pagination v-show="add_controlTotal>0" :total="add_controlTotal" :page.sync="controlSearchForm.pageNum" :limit.sync="controlSearchForm.pageSize" @pagination="getcontrolList" />
                <div class="text_title">已关联事件</div>
                <el-table v-loading = "listLoading3"  :data="add_associatedEventList" class="mbtm20" 
                    fit  highlight-current-row  style="width: 100%;" border >
                    <el-table-column prop="eventNo" label="事件编号" align="center" />
                    <el-table-column prop="eventDesc" label="事件描述" align="center" />
                    <el-table-column prop="" label="操作" align="center" width="200">
                        <template slot-scope="{row,$index}">
                            <!--<el-button size="mini" type="primary" @click="updateActivty(row,$index)" v-show="updBtnFlag">修改</el-button>-->
                            <el-button size="mini" type="primary" @click="deleteControl(row,$index)" >删除</el-button><!--v-show="selBtnFlag"-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
           
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">  取消</el-button>
                <el-button type="primary" @click="createData()">确定</el-button>
            </div>
        </el-dialog> 
         <!-- 详情 -->
        <el-dialog title="管控项目详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :model="controlDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="controlDetail.operationMode" class="wd200" disabled >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控项目编号" prop="controlProjectNo">
                    <el-input v-model="controlDetail.controlProjectNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="controlDesc" >
                    <el-input v-model="controlDetail.controlDesc" class="wd200" type="text" readonly />
                </el-form-item>
                
                <el-form-item class="cl_td" label="管控模式" prop="controlMode">
                    <el-select v-model="controlDetail.controlMode" class="wd200" disabled >
                    <el-option
                        v-for="(item, index ) in controlModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" 
                        /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="预定义管控类别" prop="preControlCategory" v-if="controlDetail.controlMode !='E'">
                    <el-select v-model="controlDetail.preControlCategory" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in preControlCategoryOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="管控动作" prop="controlField" v-if="controlDetail.controlMode=='E'">
                    <el-select v-model="controlDetail.controlField" class="wd200" disabled >
                    <el-option
                        v-for="(item, index ) in controlFieldOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权拒绝标识" prop="authDenyIdentify" v-if="controlDetail.preControlCategory=='A'">
                    <el-select v-model="controlDetail.authDenyIdentify" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in authDenyIdentifyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别" prop="transIdentifiNo" v-if="controlDetail.preControlCategory=='A'">
                    <el-input v-model="controlDetail.transIdentifiNo" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title">关联事件</div>
            <el-table
            v-loading = "listLoading4"
            :data="controlDetailList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="eventDesc" label="事件描述" align="center" />
            </el-table>
            <pagination v-show="detail_controlTotal>0" :total="detail_controlTotal" :page.sync="pageObj.pageNum" :limit.sync="pageObj.pageSize" @pagination="getDetailList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改管控项目信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :model="controlUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="controlUp.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控项目编号" prop="controlProjectNo" 
                    :rules="[ { required: true, message: '管控项目编号不能为空'} ]">
                    <el-input v-model="controlUp.controlProjectNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="controlDesc" >
                    <el-input v-model="controlUp.controlDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="管控模式" prop="controlMode" 
                    :rules="[ { required: true, message: '管控模式不能为空'} ]">
                    <el-select v-model="controlUp.controlMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in controlModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="预定义管控类别" prop="preControlCategory" v-if="controlUp.controlMode==S">
                    <el-select v-model="controlUp.preControlCategory" class="wd200" >
                    <el-option
                        v-for="(item, index ) in preControlCategoryOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控动作" prop="controlField" v-if="controlUp.controlMode=='E'">
                    <el-select v-model="controlUp.controlField" class="wd200" >
                    <el-option
                        v-for="(item, index ) in controlFieldOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权拒绝标识" prop="authDenyIdentify" v-if="controlUp.preControlCategory=='A'">
                    <el-select v-model="controlUp.authDenyIdentify" class="wd200" >
                    <el-option
                        v-for="(item, index ) in authDenyIdentifyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别" prop="transIdentifiNo" v-if="controlUp.preControlCategory=='A'" v-show="controlUp.controlMode !='S'">
                    <el-input v-model="controlUp.transIdentifiNo" class="wd200" type="text"/>
                </el-form-item>

                <div v-if="controlUp.controlMode !='S'">
                    <!--选择事件-->
                    <div class="text_title">选择事件</div>
                    <el-form-item class="cl_td" label="事件编号" prop="operationMode">
                        <el-input v-model="controlUp.eventId" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="事件描述" prop="activityDesc">
                        <el-input v-model="controlUp.eventDesc" class="wd200" type="text" />
                    </el-form-item>
                
                    <div class="cl_tr text_center">
                        <el-button size="medium" icon="el-icon-search" type="primary" @click="up_controlSearch()">搜索</el-button>
                        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="up_controlHandle()">关联</el-button>
                    </div>
                    <el-table
                        v-loading = "listLoading5"
                        :data="controlTableUpList"
                        class="mbtm20"
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        border
                        @selection-change="up_controlSelectChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="eventNo" label="事件编号" align="center" />
                        <el-table-column prop="eventDesc" label="事件描述" align="center" />
                    </el-table>
                    <pagination v-show="up_controlTotal>0" :total="up_controlTotal" :page.sync="controlFormUp.pageNum" :limit.sync="controlFormUp.pageSize" @pagination="getcontrolListUp" />
                    <div class="text_title">已关联活动</div>
                    <el-table v-loading = "listLoading6" :data="up_associatedEventList" class="mbtm20" 
                        fit  highlight-current-row style="width: 100%;" border>
                        <el-table-column prop="eventNo" label="事件编号" align="center" />
                        <el-table-column prop="eventDesc" label="事件描述" align="center" />
                        <el-table-column prop="" label="操作" align="center" width="200">
                            <template slot-scope="{row,$index}">
                                <el-button size="mini" type="primary" @click="updateActivty(row,$index)" v-show="updBtnFlag">修改</el-button>
                            <el-button size="mini" type="primary" @click="deleteControlUp(row,$index)" >删除</el-button><!--v-show="selBtnFlag"-->
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
                
            </el-form>  
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">  取消</el-button>
                <el-button type="primary" @click="updateData()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ApiService from '@/api/api-service'
import Pagination from '@/components/Pagination'
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
      queryFormObj: {
          pageNum: 1,
          pageSize:10,
      },
      listLoading1: false,
      queryFormRef: {},
      queryFormRules: {},      
      tableList: [],
      tableTotal: 0,
       /*----下拉框-----*/
      operationModeOptions: [], //运营模式
      preControlCategoryOptions: [],//预定义管控项目
      controlModeOptions: [],//管控模式
      authDenyIdentifyOptions:[],//管控项目编号
      controlFieldOptions: [],
      /*-----增删改查-----*/
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},
        /*-----新增-----*/
        controlSearchForm:{//事件列表对象
            pageNum: 1,
            pageSize:10,
        },
        dataFormControlSearch: {},
        controlAdd: {}, // 新增
        dataFormAdd: {},
        controltableList: 0,
        listLoading2: false,//事件列表暂无数据
        listLoading3:false,//已关联活动暂无数据
        dialogFormVisibleAdd: false,//新增弹框
        add_controlTotal:0,//事件列表总条数
        add_associatedEventList: [],//关联事件的list
        add_listNew:[],//事件关联临时数组
        /*-----详情列表-----*/
        controlDetail: {}, 
        pageObj: {
          pageNum: 1,
          pageSize:10,
        },
        dialogFormVisibleDetail: false,//详情弹框
        controlDetailList: [],//列表
        listLoading4: false,//关联事件暂无数据
        detail_controlTotal: 0,//分页总数
        multipleSelection: [],
        select_order_number: '',
        dataFormDetail: {},
        /*-----修改-----*/
        S:0,
        controlUp: {}, // 修改
        controlTableUpList:[],
        dialogFormVisibleUp: false,//修改弹框
        up_associatedEventList: [],//关联事件的list
        up_controlTotal:0,//事件列表总条数
        listLoading5: false,//事件列表暂无数据
        listLoading6:false,//已关联活动暂无数据
        up_listNew:[],//事件关联临时数组
        controlFormUp:{
            pageNum: 1,
            pageSize:10,
        }
    }
  },
    created() {
        this.getBtnAuth()
    },
    mounted() {
        this.getList()
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    //预定义管控类别
    this.getSelectDict( "dic_controlCategory").then(res => {
        this.preControlCategoryOptions = res
    })
    //管控模式
    this.getSelectDict( "dic_controlAndControl").then(res => {
        this.controlModeOptions = res
    })
    //管控动作
    this.getSelectDict( "dic_controlAction").then(res => {
        this.controlFieldOptions = res
    })
    //管控项目编号
    this.getSelectDict( "dic_controlItemNo").then(res => {
        this.authDenyIdentifyOptions = res
    })
        
  },
    methods: {
//      handleSelectionChange(rows) {
//          this.multipleSelection = rows;
//          this.select_order_number = this.multipleSelection.length;
//          this.selectArr = [];
//          if (rows) {
//              rows.forEach(row => {
//                  if (row) {
//                      this.selectArr.push(row.id);
//                  //console.log(this.selectArr)
//                  }
//              });
//          }
//      },
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
    // 列表
    getList() {
        this.listLoading1 = true
        let params = {
            isTrans: true,
            transParams:['dic_controlAndControl'],
            transDict : ['controlMode']
        }
       params = Object.assign(this.queryFormObj, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0047', params ,(res) => {
            if (res.returnCode == '000000') {
                    this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        }, (err) => {
      		this.tableList = []
       		this.tableTotal = 0
       		this.listLoading1 = false
        })

    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },
    //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.getcontrolList()
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    add_controlSearch(){
       this.getcontrolList()
    },
    // 管控模式change
    controlModeChange(val) {
        if(val == 'E') { // 
            if(this.controlAdd.preControlCategory) {
                this.controlAdd.preControlCategory = ''
            }
            if(this.controlAdd.authDenyIdentify) {
                this.controlAdd.authDenyIdentify = ''
            }
            if(this.controlAdd.transIdentifiNo) {
                this.controlAdd.transIdentifiNo = ''
            }
        } else if(val == 'S') {
            if(this.controlAdd.controlField) {
                this.controlAdd.controlField = ''
            }
        } 
    },
    // 预定义管控类别 change
    preControlCategoryChange(val) {
        if(val == 'I') { // 利息
            if(this.controlAdd.authDenyIdentify) {
                this.controlAdd.authDenyIdentify = ''
            }
            if(this.controlAdd.transIdentifiNo) {
                this.controlAdd.transIdentifiNo = ''
            }
        } 
    },
    //新增选择事件列表
    getcontrolList() {
        let obj = {
            eventCircleType:"1"
        }
        obj = Object.assign(obj, this.controlSearchForm)
        this.getTableList('/beta/betaService/COS.IQ.02.0001', obj,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.controltableList = res.returnData.rows
                    this.add_controlTotal = res.returnData.totalCount
                } else {
                    this.controltableList = []
                    this.add_controlTotal = 0
                }
            }
        }, (err) => {
      		this.controltableList = []
       		this.add_controlTotal = 0
       		this.listLoading2 = false
        })
    },
    //新增关联数据
    // 新增 关联
    add_controlHandle(val) {
        var that = this;
        if(this.add_associatedEventList == undefined || this.add_associatedEventList.length <= 0){
        this.add_associatedEventList = this.add_listNew;
        }else{
        let newList = [];  //保存遍历时要留下的项
        for(let len = 0; len<that.add_listNew.length;len++){
            let item = that.add_listNew[len]
            let isExist = false;
            for(var j = 0; j <  that.add_associatedEventList.length; j++){
            var id = that.add_associatedEventList[j].eventNo;
            if(item.eventNo== id){
                isExist = true;
                break;
            }
        }
        if(!isExist){
           newList.push(item);
            }
        }
        that.add_associatedEventList  = that.add_associatedEventList.concat(newList)
        }
        this.add_listNew = [];
    },
    // 新增弹窗中 选择事件
    add_controlSelectChange(val) {
        this.add_listNew = val;
    },
    //删除关联数据
    deleteControl(row,index){
       this.add_associatedEventList.splice(index,1)
    },
    //提交新增数据
    createData() {
        if(!this.controlAdd.controlField) {
            this.$message({
                title: '提示',
                message: '管控动作不能为空',
                type: 'warning',
                duration: 2000
            })
            return
        }
        this.controlAdd.CoreEvent=this.add_associatedEventList
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0041 ', this.controlAdd, (res) => {
                if (res.returnCode == '000000') {
                  
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                    title: 'Success',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getList()
                    this.controlAdd = {}
                }

          })
        }
      })
    }, 
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.controlDetail = Object.assign({}, row)
        this.getDetailList(row)
        this.$nextTick(() => { 
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    //详情关联事件列表
    getDetailList(row) {                       
        let obj = Object.assign({},this.controlDetail, this.pageObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0048', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading4 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.controlDetailList = res.returnData.rows
                    this.detail_controlTotal = res.returnData.totalCount
                } else {
                    this.controlDetailList = []
                    this.detail_controlTotal = 0
                }
            }
        }, (err) => {
      		this.controlDetailList = []
            this.detail_controlTotal = 0
       		this.listLoading4 = false
      })
    },
    //显示修改弹框
   handleUpdate(row) {
        this.controlUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.getcontrolListUp()
        this.upassociatedEventList()
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    up_controlSearch(){
        this.getcontrolListUp()
    },
    //修改选择事件列表
    getcontrolListUp() {
        let params = {
            operationMode:this.controlUp.operationMode,
            eventCircleType:"1",
            eventId: this.controlUp.eventId,
            eventDesc: this.controlUp.eventDesc,
            
        }
        params = Object.assign(this.controlFormUp, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0001',  params,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading5 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.controlTableUpList = res.returnData.rows
                    this.up_controlTotal = res.returnData.totalCount
                } else {
                    this.controlTableUpList = []
                    this.up_controlTotal = 0
                }
            }
        })
    },
    //修改已关联活动列表
     upassociatedEventList() {
       let params={
            operationMode:this.controlUp.operationMode,
            controlProjectNo:this.controlUp.controlProjectNo,
        }
        this.getTableList('/beta/betaService/COS.IQ.02.0048',  params,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading6 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.up_associatedEventList = res.returnData.rows
                } else {
                    this.up_associatedEventList = []
                }
            }
        })
    },
    //修改关联数据
    up_controlHandle() {
        //console.log(this.up_associatedEventList)
        var that = this;
        
        if(this.up_associatedEventList == undefined || this.up_associatedEventList.length <= 0){
           this.up_associatedEventList = this.up_listNew;
        }else{

        let newList = [];  //保存遍历时要留下的项
        for(let len = 0; len<that.up_listNew.length;len++){
            let item = that.up_listNew[len]
            let isExist = false;
            for(var j = 0; j <  that.up_associatedEventList.length; j++){
                var id = that.up_associatedEventList[j].eventNo;
                if(item.eventNo== id){
                    isExist = true;
                break;
                }
             }
            if(!isExist){
               newList.push(item);
            }
        }
        that.up_associatedEventList  = that.up_associatedEventList.concat(newList)
     }
        this.up_listNew = [];
    },
    // 修改弹窗中 选择事件
    up_controlSelectChange(val) {
        this.up_listNew = val;
    },
    //删除关联数据
    deleteControlUp(row,index){
        this.up_associatedEventList.splice(index,1)
    },
    //提交修改数据
    updateData() {
        this.controlUp.CoreEvent=this.up_associatedEventList
        this.$refs['dataFormUp'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.UP.02.0044', this.controlUp, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                    title: 'Success',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getList() 
                    this.dialogFormVisibleUp = false
                    this.controlUp = {}
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
