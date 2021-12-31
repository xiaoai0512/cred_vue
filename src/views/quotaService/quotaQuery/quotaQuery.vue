<!--客户额度查询-->
<template>
    <div class="allContent">
        <el-form ref="transForm" :model="tableList">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="tableList.idType" class="wd200">
                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc"
                        :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="tableList.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="tableList.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <!-- <div class="cl_td clearboth"></div> -->
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" type="primary" @click="cusQuotaTree()">客户额度关系</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!-- 汇总节点列表 -->
        <div v-if="isShow" class="text_title">汇总节点</div>
        <el-table v-if="isShow" v-loading="listLoading" :data="quotaListL" border fit highlight-current-row>
            <el-table-column align="center" label="额度节点" prop="creditDesc" />
            <el-table-column align="center" label="币种" prop="currencyCode" />
            <el-table-column align="center" label="授信额度" prop="creditAmt" />
            <el-table-column align="center" label="额度占用金额" prop="occupyAmt" />
        </el-table>
        <!-- 业务节点列表 -->
        <div v-if="isShow" class="text_title">业务节点</div>
        <el-table v-if="isShow" v-loading="listLoading" :data="quotaListB" border fit highlight-current-row>
            <el-table-column align="center" label="额度节点" prop="creditDesc" />
            <el-table-column align="center" label="币种" prop="currencyCode" />
            <el-table-column align="center" label="固定额度" prop="permLimit" />
            <el-table-column align="center" label="容差额度" prop="toleranceAmt" />
            <el-table-column align="center" label="临时额度" prop="tempLimit" />
            <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
            <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
            <el-table-column align="center" label="还款未入账金额" prop="paymentOutstandingAmt" />
            <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
            <el-table-column align="center" label="已入账授权金额 " prop="balance" />
            <el-table-column align="center" label="额度占用 金额" prop="occupyAmt" />
            <el-table-column width="200" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <a icon="el-icon-more" type="primary" @click="getBusAvaQuotaInfo(row,$index)">
                        [可用额度]
                    </a>
                    <span v-if="row.creditNodeTyp == 'B'">
                        <a icon="el-icon-more" type="primary" @click="getAppQuotaInfo(row)">
                            [应用节点]
                        </a>
                    </span>
                    <span v-if="row.creditNodeTyp != 'B'"></span>
                </template>
            </el-table-column>
        </el-table>
        <!--业务节点的可用额度-->
        <div v-if="showBusAvaQuota" class="text_title">可用额度</div>
        <el-table v-if="showBusAvaQuota" v-loading="listLoading2" :data="busAvaQuotaList" border fit
            highlight-current-row>
            <el-table-column align="center" label="取现额度应用对象2323" prop="productObjectCodeDesc" />
            <el-table-column align="center" label="币种" prop="currencyCode" />
            <el-table-column align="center" label="固定额度" prop="permLimit" />
            <el-table-column align="center" label="容差额度" prop="toleranceLimit" />
            <el-table-column align="center" label="临时额度" prop="tempLimit" />
            <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
            <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
            <el-table-column align="center" label="还款未入账金额" prop="paymentOutstandingAmt" />
            <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
            <el-table-column align="center" label="已入账授权金额 " prop="balance" />
            <el-table-column align="center" label="额度占用 金额" prop="occupyAmt" />
            <el-table-column align="center" label="可用额度" prop="availableLimit" />
        </el-table>
        <!--应用节点：取现额度-->
        <div v-if="showAppQuotaInfo" class="text_title">应用节点：{{appQuotaInfoName}}</div>
        <el-table v-if="showAppQuotaInfo" v-loading="listLoading3" :data="appQuotaInfoList" border fit
            highlight-current-row>
            <el-table-column align="center" label="币种" prop="currencyCode" />
            <el-table-column align="center" label="应用对象" prop="productObjectCodeDesc" />
            <el-table-column align="center" label="固定额度" prop="permLimit" />
            <el-table-column align="center" label="容差额度" prop="toleranceAmt" />
            <el-table-column align="center" label="临时额度" prop="tempLimit" />
            <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
            <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
            <el-table-column align="center" label="还款未入账金额" prop="paymentOutstandingAmt" />
            <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
            <el-table-column align="center" label="已入账授权金额 " prop="balance" />
            <el-table-column align="center" label="额度占用 金额" prop="occupyAmt" />
            <el-table-column width="200" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <a icon="el-icon-more" type="primary" @click="getNodeAvaCredit(row,$index)">[可用额度]</a>
                </template>
            </el-table-column>
        </el-table>
        <!--应用节点的可用额度-->
        <div v-if="showNodeAvaCredit" class="text_title">可用额度</div>
        <el-table v-if="showNodeAvaCredit" v-loading="listLoading4" :data="nodeAvaCreditList" border fit
            highlight-current-row>
            <el-table-column align="center" :label="nodeAvaCreditName" prop="productObjectCodeDesc" />
            <el-table-column align="center" label="币种" prop="currencyCode" />
            <!--<el-table-column   align="center" label="应用对象" prop="currencyCode" />-->
            <el-table-column align="center" label="固定额度" prop="permLimit" />
            <el-table-column align="center" label="容差额度" prop="toleranceLimit" />
            <el-table-column align="center" label="临时额度" prop="tempLimit" />
            <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
            <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
            <el-table-column align="center" label="还款未入账金额" prop="paymentOutstandingAmt" />
            <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
            <el-table-column align="center" label="已入账授权金额 " prop="balance" />
            <el-table-column align="center" label="额度占用 金额" prop="occupyAmt" />
            <el-table-column align="center" label="可用额度" prop="availableLimit" />

        </el-table>

        <el-dialog title="额度网用信" :visible.sync="dialogFormCusTree" width="95%" style="height:95%">
            <div>
                <div style="width: calc(100% - 2px);height:calc(100vh - 50px);">
                    <div style="position: absolute;left: 4%;top: 3%;">
                        <!--<div style="display: flex;width: 180px;">
                            <hr
                                style="background-color: #ff0000;display: inline-block;width: 50%;height:2px;margin-right: 10%;">
                            <span style="color:red;font-size: 16px;">检查</span>
                        </div>-->
                        <div style="display: flex;width: 180px;">
                            <hr
                                style="background-color: #00db00;display: inline-block;width: 50%;height:2px;margin-right: 10%;">
                            <span style="color:#00db00;font-size: 16px;">占用</span>
                        </div>
                        <div style="display: flex;width: 180px;">
                            <hr
                                style="background-color: #ec8e00;display: inline-block;width: 50%;height:2px;margin-right: 10%;">
                            <span style="color:#ec8e00;font-size: 16px;">共享</span>
                        </div>
                        <div style="display: flex;width: 180px;">
                            <hr
                                style="background-color: #666666;display: inline-block;width: 50%;height:2px;margin-right: 10%;">
                            <span style="color:#666;font-size: 16px;">汇总</span>
                        </div>
                    </div>
                    <div style="color:#555555;font-size:12px;position: absolute;left: 25%;top: 5%;">
                        <span style="font-size:14px">关系筛选：</span>
                        <el-checkbox-group style="padding-left:45px" :options="all_rel_type" v-model="rel_checkList"
                            @change="doFilter">
                            <el-checkbox v-for="all in all_rel_type" :label="all" :key="all">{{all}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
                        :on-line-click="onLineClick">
                        <div slot="node" slot-scope="{ node }" @mouseover="showNodeTips(node,$event)"
                            @mouseout="hideNodeTips(node,$event)">
                            <div style="height:64px; line-height:64px; border-radius:32px; cursor:pointer">
                                {{ node.text }}
                            </div>
                        </div>
                    </SeeksRelationGraph>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormCusTree = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import SeeksRelationGraph from 'relation-graph'
    import ApiService from '@/api/api-service'
    import Pagination from '@/components/Pagination'
    const linkList = []; //取额度节点之间的关系===links
    const nodeList = [];
    export default {
        name: 'CusInfo',
        components: {
            Pagination,
            SeeksRelationGraph
        },
        data() {
            return {
                list: {},
                tableList: {},
                quoteTreeCus: {},
                idTypeList: [],
                dialogFormCusTree: false, //客户额度关系展示
                listLoading: false, //汇总节点&&业务节点列表
                quotaListL: [], //汇总节点data
                quotaListB: [], //业务节点data
                isShow: false, // 汇总节点&&业务节点列表
                listLoading2: false, //业务节点可用额度
                listLoading3: false,
                listLoading4: false,
                showBusAvaQuota: false, //业务节点可用额度
                busAvaQuotaList: [], //可用业务节点额度data
                showAppQuotaInfo: false, //应用节点： 取现额度
                appQuotaInfoList: [], //应用节点： 取现额度data
                appQuotaInfoName: '',
                showNodeAvaCredit: false,
                nodeAvaCreditList: [], //应用节点的可用额度data
                nodeAvaCreditName: '',
                //客户额度节点展示参数配置
                isShowCodePanel: false,
                isShowNodeTipsPanel: false,
                focusNodeAadjacency: true,
                hoverAnimation: true,
                nodeMenuPanelPosition: {
                    x: 0,
                    y: 0
                },
                currentNode: {},
                isHideThisLine: true,
                rel_checkList: ['汇总', '占用', '共享'],
                all_rel_type: ['汇总', '占用', '共享'],
                graphOptions: {
                    hoverAnimation: true,
                    focusNodeAadjacency: true,
                    defaultNodeBorderWidth: 0,
                    defaultLineWidth: 1.5,
                    defaultNodeColor: 'rgb(25,107,158)',
                    allowShowMiniToolBar: false,
                    allowSwitchLineShape: true,
                    allowSwitchJunctionPoint: true,
                    layouts: [{
                        'label': '手工',
                        'layoutName': 'fixed',
                        'layoutClassName': 'seeks-layout-fixed',
                        'defaultJunctionPoint': 'border',
                        'defaultNodeShape': 0,
                        'defaultLineShape': 1
                    },],
                },
                links: [],
                nodes: [],
            }
        },
        created() {

        },
        mounted() {
            this.getSelectDict('dic_certificateType').then((res) => {
                this.idTypeList = res
            })
        },
        methods: {
            init() {
                this.tableList = {
                    idType: '',
                    idNumber: '',
                    externalIdentificationNo: '',
                }
			},
            // 重置
            reset() {
                this.init()
            },
            // 点击查询按钮
            handleSearch() {
                if (!this.tableList.externalIdentificationNo && !this.tableList.idType && !this.tableList.idNumber) {
                    this.$message('请输入查询信息')
                    return;
                    this.init()
                } else {
                    if (this.tableList.idType) {
                        if (!this.tableList.idNumber) {
                        	this.$message('请输入证件号码')
                        	return
                        } else {
                            this.getList()
                        }
                    } else if (this.tableList.idNumber) {
                        if (!this.tableList.idType) {
                        	this.$message('请输入证件类型')
                            return
                        } else {
                            this.getList()
                        }
                    } else {
                        this.getList()
                    }
                }
            },
            // 查询列表
            getList() {
                this.listLoading = true
                this.quotaListL = []
                this.quotaListB = []
                const obj = {
                    externalIdentificationNo: this.tableList.externalIdentificationNo,
                    idType: this.tableList.idType,
                    idNumber: this.tableList.idNumber
                }
                this.tableList = Object.assign(this.tableList, obj)
                this.getTableList('/auth/authService/LMS.IQ.01.0001', this.tableList, (res) => {
                    if (res.returnCode == '000000') {
                        this.isShow = true
                        if (res.returnData.rows && res.returnData.rows.length > 0) {
                            this.list = res.returnData.rows
                            this.list.forEach((item, index) => {
                                if (item.creditNodeTyp == 'L') {
                                    this.quotaListL.push(item)
                                } else {
                                    this.quotaListB.push(item)
                                }
                            })
                        } else {
                            this.quotaListL = []
                            this.quotaListB = []
                        }
                    }
                    this.listLoading = false
                } , (err) => {
                    if (err) {
                        this.listLoading = false
                        this.quotaListL = []
                        this.quotaListB = []
                    }
                })
            },

            //业务节点可用额度
            getBusAvaQuotaInfo(row) {
                this.showBusAvaQuota = true
                this.showAppQuotaInfo = false
                this.showNodeAvaCredit = false
                this.listLoading2 = true
                const obj1 = {
                    externalIdentificationNo: this.tableList.externalIdentificationNo,
                    idType: this.tableList.idType,
                    idNumber: this.tableList.idNumber,
                    creditNodeNo: row.creditNodeNo
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0005', obj1, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData.rows && res.returnData.rows.length > 0) {
                            this.busAvaQuotaList = res.returnData.rows
                            this.busAvaQuotaList.forEach(item => {
                                if (item.productObjectCode != null) {
                                    item.productObjectCodeDesc = item.productObjectCode + '' + item.productDesc
								} else {
                                    item.productObjectCodeDesc = ''
                                }
							})
                            this.listLoading2 = false
                            this.$forceUpdate()
                        } else {
                            this.listLoading2 = false
                            this.busAvaQuotaList = []
                        }
                    }
                } , (err) => {
                    if (err) {
                        this.listLoading2 = false
                        this.busAvaQuotaList = []
                    }
                })
            },
            //应用节点： 取现额度
            getAppQuotaInfo(row) {
                this.showAppQuotaInfo = true
                this.showBusAvaQuota = false
                this.showNodeAvaCredit = false
                this.listLoading3 = true
                this.appQuotaInfoName = row.creditDesc
                const obj2 = {
                    externalIdentificationNo: this.tableList.externalIdentificationNo,
                    idType: this.tableList.idType,
                    idNumber: this.tableList.idNumber,
                    creditNodeNo: row.creditNodeNo
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0001', obj2, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData.rows && res.returnData.rows.length > 0) {
                            this.appQuotaInfoList = res.returnData.rows
                            this.appQuotaInfoList.forEach(item => {
                                if (item.productObjectCode != null) {
                                    item.productObjectCodeDesc = item.productObjectCode + '' + item.productDesc

                                } else {
                                    item.productObjectCodeDesc = ''
                                }

                            })
                            this.listLoading3 = false
                            this.$forceUpdate()
                        } else {
                            this.listLoading3 = false
                            this.appQuotaInfoList = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.listLoading3 = false
                        this.appQuotaInfoList = []
                    }
                })
            },
            //应用节点取现额度里面的可用额度
            getNodeAvaCredit(row) {
                this.showNodeAvaCredit = true
                this.showAppQuotaInfo = true
                this.showBusAvaQuota = false
                this.listLoading4 = true
                let nameObj = '应用对象'
                this.nodeAvaCreditName = this.appQuotaInfoName + '' + nameObj
                const obj3 = {
                    externalIdentificationNo: this.tableList.externalIdentificationNo,
                    idType: this.tableList.idType,
                    idNumber: this.tableList.idNumber,
                    creditNodeNo: row.creditNodeNo,
                    availableClass: row.availableClass,
                    currencyCode: row.currencyCode,
                    productObjectCode: row.productObjectCode
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0005', obj3, (res) => {
                    if (res.returnCode == '000000') {
                        this.listLoading4 = false
                        if (res.returnData.rows && res.returnData.rows.length > 0) {
                            this.nodeAvaCreditList = res.returnData.rows
                            this.nodeAvaCreditList.forEach(item => {
                                if (item.productObjectCode != null) {
                                    item.productObjectCodeDesc = item.productObjectCode + '' + item.productDesc
                                } else {
                                    item.productObjectCodeDesc = ''
                                }
                            })
                        } else {
                            this.nodeAvaCreditList = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.listLoading4 = false
                        this.nodeAvaCreditList = []
                    }
                })
            },

            // 客户额度节点详情按钮
            cusQuotaTree() {
            	if(!this.tableList.externalIdentificationNo && !this.tableList.idType && !this.tableList.idNumber){
            		this.$message('请输入查询信息')
            		return
                }else {
            		if (this.tableList.idType) {
                        if (!this.tableList.idNumber) {
                        	this.$message('请输入证件号码')
                        	return
                        } 
                    } else if (this.tableList.idNumber) {
                        if (!this.tableList.idType) {
                        	this.$message('请输入证件类型')
                        	return
                        } 
                    } 
                }
                this.dialogFormCusTree = true
                this.$nextTick(() => {
                    this.quoteTreeCus.authDataSynFlag = '1'
                    this.quoteTreeCus.externalIdentificationNo = this.tableList.externalIdentificationNo
                    ApiService.post("/auth/authService/LMS.IQ.01.0006", this.quoteTreeCus, (data) => {
                        var linkStr = {}; //取额度节点之间的关系===links
                        //取额度节点之间的关系===links  ,x:100+i*100,y:200+i*100

                        for (var i = 0; i < data.returnData.rows[0].authCreditUnitMeshDtoList.length; i++) {
                            ///组合关系
                            if (data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'R') { //汇总
                                linkStr = {
                                    from: data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditNodeNo,
                                    to: data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeNo,
                                    color: '#666',
                                    data: {
                                        type: '汇总'
                                    },
                                    text: ''
                                    // lineStyle:{width:2,curveness:0}
                                };
                                linkList.push(linkStr);
                            } else if (data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'O') { //占用
                                linkStr = {
                                    from: data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditNodeNo,
                                    to: data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeNo,
                                    color: '#00db00',
                                    data: {
                                        type: '占用'
                                    },
                                    text: ''
                                    // lineStyle:{width:2,curveness:0}
                                };
                                linkList.push(linkStr);
                            } else if (data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'S') { //共享
                                linkStr = {
                                    from: data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditNodeNo,
                                    to: data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeNo,
                                    color: '#ec8e00',
                                    data: {
                                        type: '共享'
                                    },
                                    text: ''
                                    //lineStyle:{curveness: -0.3}
                                };
                                linkList.push(linkStr);
                            } 
                            /*else if (data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeTyp == 'C') { //检查
                                linkStr = {
                                    from: data.returnData.rows[0].authCreditUnitMeshDtoList[i].creditNodeNo,
                                    to: data.returnData.rows[0].authCreditUnitMeshDtoList[i].relativeNodeNo,
                                    color: '#ff0000',
                                    data: {
                                        type: '检查'
                                    },
                                    text: ''
                                    //lineStyle:{width:2,curveness:0}
                                };
                                linkList.push(linkStr);
                            }*/
                        }
                        // 开始组装数据
                        var creditListStr = {};
                        if (data.returnData.rows[0].authCreditNodeVoList.length > 0) {
                            let obj01 = {};
                            var nodeLevel = [];
                            for (var m = 0; m < data.returnData.rows[0].authCreditNodeVoList.length; m++) {
                                nodeLevel.push(data.returnData.rows[0].authCreditNodeVoList[m].creditNodeNoLevel);
                            }
                            //console.log(nodeLevel)
                            for (let i = 0; i < nodeLevel.length; i++) {
                                let key = nodeLevel[i];
                                if (obj01[key]) {
                                    obj01[key]++;
                                } else {
                                    obj01[key] = 1;
                                }
                            }
                            //console.log(obj01)
                            //得到最多的一层有几个节点
                            let maxCount = 0;
                            for (let key in obj01) {
                                if (obj01[key] > maxCount) {
                                    maxCount = obj01[key];
                                }
                            }
                            //console.log(maxCount)
                            var arrList = data.returnData.rows[0].authCreditNodeVoList;
                            //console.log(arrList)
                            for (var j = 0; j < arrList.length; j++) {
                                // debugger
                                if (nodeList.length > 0) {
                                    for (var k = j - 1; k < nodeList.length; k++) {
                                        //判断是否同一层，相等则为同一层
                                        if (nodeList[k].nodeLevel === arrList[j].creditNodeNoLevel) {
                                            creditListStr = {
                                                id: arrList[j].creditNodeNo,
                                                name: arrList[j].creditDesc,
                                                nodeLevel: arrList[j].creditNodeNoLevel,
                                                nodNodLyeY: nodeList[k].nodNodLyeY,
                                                nodNodLye: arrList[j].creditNodeNoLevel,
                                                x: parseInt(nodeList[k].x + (150 * maxCount) / (obj01[arrList[j].creditNodeNoLevel] +
                                                    1) + arrList[j].creditNodeNoLevel),
                                                y: parseInt(nodeList[k].nodNodLyeY),
                                            }
                                            nodeList.push(creditListStr)
                                        } else {
                                            // 不相等，则为新的一层
                                            creditListStr = {
                                                id: arrList[j].creditNodeNo,
                                                name: arrList[j].creditDesc,
                                                nodeLevel: arrList[j].creditNodeNoLevel,
                                                nodNodLyeY: nodeList[k].nodNodLyeY + 150,
                                                nodNodLye: arrList[j].creditNodeNoLevel,
                                                x: parseInt((150 * maxCount) / (obj01[arrList[j].creditNodeNoLevel] + 1) + arrList[j]
                                                    .creditNodeNoLevel),
                                                y: parseInt(nodeList[k].nodNodLyeY + 150),
                                            }
                                            nodeList.push(creditListStr)
                                        }
                                        break;
                                    }
                                } else {
                                    //第一层节点
                                    creditListStr = {
                                        id: arrList[j].creditNodeNo,
                                        name: arrList[j].creditDesc,
                                        nodeLevel: arrList[j].creditNodeNoLevel,
                                        nodNodLyeY: arrList[j].creditNodeNoLevel + 10,
                                        nodNodLye: arrList[j].creditNodeNoLevel,
                                        x: parseInt((150 * maxCount) / (obj01[arrList[j].creditNodeNoLevel] + 1) + arrList[j]
                                            .creditNodeNoLevel),
                                        y: parseInt(arrList[j].creditNodeNoLevel + 10),
                                    }
                                    nodeList.push(creditListStr)
                                }
                            }
                            var jsondata = {
                                rootId: 'a',
                                nodes: nodeList,
                                links: linkList
                            }
                            // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
                            this.$refs.seeksRelationGraph.setJsonData(jsondata, (seeksRGGraph) => {
                                // 这些写上当图谱初始化完成后需要执行的代码
                                console.log(seeksRGGraph)
                            })
                        }
                    })
                })
            },
            showNodeTips(nodeObject) {
                const allNodes = this.$refs.seeksRelationGraph.getNodes();
                //console.log(allNodes);
                const linksArys = [];
                const fromList = [];
                linkList.filter(item => {
                    if (item.to === nodeObject.id) {
                        if (item.data.type != '共享') {
                            linksArys.push(item);
                            fromList.push(item);
                        }
                    }
                });
                for (var m = 0; m < fromList.length; m++) {
                    for (var n = 0; n < linkList.length; n++) {
                        if (linkList[n].to === fromList[m].from) {
                            if (fromList[m].data.type === '占用') {
                                if (linkList[n].data.type != '共享') {
                                    linksArys.push(linkList[n]);
                                    fromList.push(linkList[n]);
                                }
                            }
                        }
                    }
                }
                const linksAry = [];
                for (const k in linksArys) {
                    if (linksAry.indexOf(linksArys[k].from) === -1) {
                        linksAry.push(linksArys[k].from);
                    }
                }
                const otherLinksAry = [];
                for (const j in allNodes) {
                    if (linksAry.indexOf(allNodes[j].id) === -1) {
                        otherLinksAry.push(allNodes[j]);
                    }
                }
                for (const f in otherLinksAry) {
                    otherLinksAry[f].color = 'rgb(25,107,158,0.3)';
                }
                this.currentNode = nodeObject;
            },
            hideNodeTips() {
                const allNodes = this.$refs.seeksRelationGraph.getNodes();
                this.isShowNodeTipsPanel = false;
                this.$nextTick(() => {
                    for (const node in allNodes) {
                        allNodes[node].borderColor = undefined;
                        allNodes[node].borderWdith = undefined;
                        allNodes[node].color = undefined;
                        allNodes[node].backgroundColor = undefined;
                    }
                });
            },
            //筛选
            doFilter() {
                var _all_Lines = this.$refs.seeksRelationGraph.getLines();
                _all_Lines.forEach(thisLine => {
                    this.isHideThisLine = true;
                    thisLine.relations.forEach(thisLink => {
                        if (this.rel_checkList.indexOf(thisLink.data['type']) === -1) {
                            thisLink.isHide = true;
                        } else {
                            this.isHideThisLine = false;
                            thisLink.isHide = false;
                        }
                    })
                });
            },
            onNodeClick(nodeObject, $event) {
                console.log('onNodeClick:', nodeObject)
            },
            onLineClick(lineObject, $event) {
                console.log('onLineClick:', lineObject)
            }
        }
    }

</script>

<style lang="scss" scoped>
    .c-node-menu-item {
        line-height: 30px;
        padding-left: 10px;
        cursor: pointer;
        color: #444444;
    }
</style>