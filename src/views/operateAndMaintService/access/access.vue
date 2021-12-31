<!-- 设置权限 -->
<template>
	<div class="allContent">
		<!-- 表单验证demo: -->
		<el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
			<el-form-item class="cl_td" label="运营机构" prop="organNo"  style="width:30%">
				<el-select v-model="queryForm.organNo" class="wd200">
					<el-option v-for="(item, index) in organNameOptions" 
						:key="index" 
						:label="item.organName" 
						:value="item.organNo" />
				</el-select>
			</el-form-item>
			<el-form-item class="cl_td" label="部门名称" prop="departmentNo"  style="width:30%">
				<el-select v-model="queryForm.departmentNo" class="wd200">
					<el-option v-for="(item, index) in departmentNoOptions" 
						:key="index" 
						:label="item.departmentName" 
						:value="item.departmentNo" />
				</el-select>
			</el-form-item>
			<el-form-item class="cl_td" label="岗位名称" prop="postNo"  style="width:30%">
				<el-select v-model="queryForm.postNo" class="wd200">
					<el-option v-for="(item, index) in postNoOptions" 
						:key="index" 
						:label="item.postName" 
						:value="item.postNo" />
				</el-select>
			</el-form-item>
			<div class="cl_tr text_center"><!--v-if="selBtnFlag"    v-show="checkBtnFlag"       -->
				<el-button size="medium" icon="el-icon-search"  type="primary" @click="handleSearch()"  v-show="selBtnFlag">查询</el-button>
			</div>
		</el-form>
		<el-table v-loading="listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
			<el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
			<el-table-column prop="operationOrgan" label="运营机构" align="center" />
			<el-table-column prop="departmentName" label="部门名称" align="center" />
			<el-table-column prop="postName" label="岗位名称" align="center" />
			<el-table-column prop="" label="操作" align="center" width="250px">
				<template slot-scope="{row}"><!--v-if="checkBtnFlag"-->
					<el-button size="mini" icon="el-icon-arrow-right" type="primary" @click="handleDetail(row)" v-show="setBtnFlag">设置权限</el-button>
					<el-button size="mini" icon="el-icon-info" type="primary" @click="handleInfo(row)" v-show="checkBtnFlag">查看权限</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
		<!--新增-->
		<el-dialog title="设置权限" :visible.sync="dialogFormVisibleSet" width="65%">
      		<div id="areaTree">
				<div class="tree-box">
					<div class="zTreeDemoBackground left">
						<ul id="treeAccess" class="ztree"></ul>
					</div>
				</div>
			</div>
	    	<div slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="subAddData()">确认</el-button>
	            <el-button type="primary" @click="dialogFormVisibleSet = false">取消</el-button>
	        </div>
        </el-dialog>
		<!--详情-->
		<el-dialog title="权限组详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <div id="areaTree">
				<div class="box-title" v-if="accessList.length == 0">
					<a href="#">该权限组暂无设置权限<i class="fa  fa-refresh"></i></a>
				</div>
				<div class="tree-box">
					<div class="zTreeDemoBackground left">
						<ul id="treeDetail" class="ztree"></ul>
					</div>
				</div>
			</div>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
	        </div>
        </el-dialog>
	</div>
</template>

<script>
	import Pagination from "@/components/Pagination";
	export default {
		name: 'tableList',
		components: {
			Pagination,
		},
		data() {
			return {
				//权限
				checkBtnFlag: false,
				selBtnFlag: false,
				setBtnFlag: false,
				btnAuthStr: '',
				logininfo: '',
				// 列表
				queryForm: {
					pageNum: 1,
					pageSize: 10,
				},
				listLoading1: false,
				queryFormRef: {},
				queryFormRules: {},
				tableList: [],
				tableTotal: 0,
				//下拉
				organNameOptions: [],//运营机构
				postNoOptions: [], //岗位名称
				departmentNoOptions: [],//部门名称
				//权限设置
				dialogFormVisibleSet: false,	
				//详情
				dialogFormVisibleDetail: false,
				allMenuList: {},
				allEventList: {},
				departmentNo: '',
				postNo: '',
				operationOrgan : '',
				setting:{},
				nodes: [],
				accessList: [],
				settingDetail:{}
			}
		},
		created() {
			this.getBtnAuth()
			
		},
		watch:{
			filterdept(val) {
		      this.$refs.deptref.filter(val);
		     }
		},
		mounted() {
			this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo')) //获取用户登录权限
			//运营模式
			this.getSelectDict("/beta/betaService/COS.IQ.02.0005").then(res => {
				this.organNameOptions = res
			})
			//部门名称
			this.getSelectDict("/beta/betaService/COS.CS.01.0004").then(res => {
				this.departmentNoOptions = res
			})
			//岗位名称
			this.getSelectDict("/beta/betaService/COS.CS.01.0007").then(res => {
				this.postNoOptions = res
			})
		},
	methods: {
		loadperson() {
			let _this = this;
			let comapi = new apicom();
			//获取人员数据
			comapi.getDataByGet("organperson.do", {}, res => {
				_this.deptlist = res.data.data;
			});
    	},
		//打开部门模态框
		opendept() {
		this.ischoosedept = true;
		},
		//确认选择部门
		choosedept() {
		this.ischoosedept = false;
		},
		//筛选所属部门
		deptfilter(value, data) {
		if (!value) return true;
		return data.label.indexOf(value) !== -1;
		},
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
							if (this.btnAuthStr.includes('COS.CS.01.0013')) { // 查询
								this.selBtnFlag = true
							} else {
								this.selBtnFlag = false
							}
							if (this.btnAuthStr.includes('COS.CS.01.0016')) { // 查看
								this.checkBtnFlag = true
							} else {
								this.checkBtnFlag = false
							}
							if (this.btnAuthStr.includes('COS.CS.01.0014')) { // 设置
								this.setBtnFlag = true
							} else {
								this.setBtnFlag = true
						}
					}
				}
			})
		},			
		//搜索
		handleSearch() {
			if((this.queryForm.organNo == "" && this.queryForm.organNo == null && this.queryForm.organNo == undefined) &&
			(this.queryForm.departmentNo == "" || this.queryForm.departmentNo == null || this.queryForm.departmentNo == undefined) &&
			(this.queryForm.postNo == "" || this.queryForm.postNo == null || this.queryForm.postNo == undefined)) {
				this.$message('请输入查询条件！');
				return;
			}
			this.getList()
		},
		// 列表
		getList() {
			this.listLoading1 = true
			let params = {
				operatorId: 'iderlevel',
				operationOrgan: this.queryForm.organNo,
			}
			params = Object.assign(params, this.queryForm)
			this.getTableList('/beta/betaService/COS.CS.01.0013', params, (res) => {
				if(res.returnCode == '000000') {
					this.listLoading1 = false
					if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
						this.tableList = res.returnData.rows	
					}else{
						this.tableList = []
					}
				}
			})
		},
		//查看权限
		handleInfo(data) {
			this.dialogFormVisibleDetail = true
			this.$nextTick(() => {
				this.settingDetail = {
					data:{
						check:{
							enable:false
						},
						key:{
							name: 'menuName',//节点名称
						},
						simpleData:{
							enable:true,
							idKey: 'menuNo',//节点id
							pIdKey: 'upperMenuNo'
						}
					}
				}
				let  paramsDetail = {
					departmentNo : data.departmentNo,
					postNo : data.postNo,
					operationOrgan : data.operationOrgan,
				}
				this.post('/beta/betaService/COS.CS.01.0016', paramsDetail, (res) => {
					if(res.returnCode == '000000'){
						this.accessList = res.returnData.coreGrantsList;
						$.fn.zTree.init($("#treeDetail"), this.settingDetail, res.returnData.coreGrantsList);
					}
				})
			})
		},
		//设置权限
		handleDetail(data) {
			this.dialogFormVisibleSet = true
			this.departmentNo = data.departmentNo;
			this.postNo = data.postNo;
			this.operationOrgan = data.operationOrgan;
			this.setting = {
				data:{
					key:
						{
						name: 'menuName',//节点名称
						checked: "isChecked"
						},
					simpleData:{
						enable:true,
						idKey: 'menuNo',//节点id
						pIdKey: 'upperMenuNo'
					}
				},
				check:{
					enable:true
				},
			}
			this.$nextTick(() => {
				let  params = {}
				this.post('/beta/betaService/COS.CS.01.0029', params, (res) => {
					if(res.returnCode == '000000') {
						this.allMenuList = res.returnData.coreMenuList;
						this.alleventList = res.returnData.coreMenuEventList;
						for(var i=0;i<this.allMenuList.length;i++){
							if(this.allMenuList[i].lowerMenuFlag == 0){
								for(var j=0;j<this.alleventList.length;j++){
									if(this.alleventList[j].upperMenuNo == this.allMenuList[i].menuNo){
										this.allMenuList.push(this.alleventList[j]);
									}
								}
							}
						}
						let  paramsCheck = {
							departmentNo : this.departmentNo,
							postNo : this.postNo,
							operationOrgan : this.operationOrgan,
						}
						this.post('/beta/betaService/COS.CS.01.0016', paramsCheck, (res) => {
							if(res.returnCode == '000000'){
								const getMenuListArr = res.returnData.coreGrantsList;
								const getzTree = $.fn.zTree.getZTreeObj("treeAccess");
								getMenuListArr.forEach(item =>{
									getzTree.checkNode(getzTree.getNodeByParam("menuNo" ,item.menuNo), true);//反选
	// 	        					getzTree.expandNode(getzTree.getNodeByParam("menuNo" ,item.menuNo), true);  //展开已勾选
								});
							}
						})
						$.fn.zTree.init($("#treeAccess"), this.setting, this.allMenuList);
					}
				})
			})
		},
		// 暂时无用
		zTreeOnCheck(event, treeId, treeNode) {
			const treeObj = $.fn.zTree.getZTreeObj("treeAccess");
			this.nodes = treeObj.getCheckedNodes(true);
			console.log(this.nodes)
		},
		subAddData (){
			const treeObj = $.fn.zTree.getZTreeObj("treeAccess");
			this.nodes = treeObj.getCheckedNodes(true);
			if(this.nodes.length > 0){
				const paramsSet = {
					departmentNo : this.departmentNo,
					postNo : this.postNo,
					operationOrgan : this.operationOrgan,
					coreMenuEventList : []
				}
				for( var i = 0; i < this.nodes.length; i++){
					if(this.nodes[i].eventNo == "" || this.nodes[i].eventNo == undefined || this.nodes[i].eventNo == null){
						paramsSet.coreMenuEventList.push({'menuNo':this.nodes[i].menuNo,'menuName':this.nodes[i].menuName,'upperMenuNo':this.nodes[i].upperMenuNo});
					}
					else{
						paramsSet.coreMenuEventList.push({'menuNo':this.nodes[i].eventNo+this.nodes[i].upperMenuNo,'menuName':this.nodes[i].menuName,'eventNo':this.nodes[i].eventNo,'upperMenuNo':this.nodes[i].upperMenuNo});
					}
				}
				this.post('/beta/betaService/COS.CS.01.0014', paramsSet, (res) => {
                    if (res.returnCode == '000000') {
						this.$notify({
						title: 'Success',
						message: '设置成功',
						type: 'success',
						duration: 2000
						})
						this.getList()
                    }
                })
			}
			this.dialogFormVisibleSet = false
		}
	}
}
</script>

<style>
    @import '../../../plugins/ztree/css/zTreeStyle/zTreeStyle.css';
    #areaTree{
        border:1px solid #e5e5e5;    margin-bottom: 2px;border-radius: 4px;overflow: hidden;
    } 
    .box-title{
        border-radius: 3px 3px 0 0;background-color: #f5f5f5;
    }
    .box-title a{
        color: #2fa4e7;
        text-decoration: none;font-size:14px;    display: block;
        padding: 8px 15px;cursor: pointer;
    }
    .box-title .fa{
        float:right;line-height: 20px;
    }
</style>