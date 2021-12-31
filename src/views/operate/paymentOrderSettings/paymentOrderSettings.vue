'<!-- 还款顺序设置 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
           <el-form-item class="cl_td" label="事件编号" prop="instanCode1">
                <el-input v-model="queryFormObj.instanCode1" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="核算状态" prop="instanCode2" >
                <el-select v-model="queryFormObj.instanCode2" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in instanCode2Options"
                    :key="index"
                    :label="item.accountingDesc"
                    :value="item.accountingStatus"
                />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button> 
            </div>
        </el-form>
        <div class="mainname" style="font-weight: 100;">统一还款分配顺序</div>
        <el-table
            v-loading = "listLoading1"
            :data="tableList1"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column label="事件编号" width="350" align="center">
                <template slot-scope="{row}">{{ row.instanCode1 }}&nbsp;&nbsp;{{ row.instanDesc1 }}</template>
            </el-table-column>
            <el-table-column label="核算状态" width="350" align="center">
                <template slot-scope="{row}">{{row.instanCode2 }}&nbsp;&nbsp;{{ row.instanDesc2 }}</template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}"><!--v-show="selBtnFlag"-->
                    <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail1(row)" >分配顺序</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                    <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getListTable201" />
        <!--单独账户还款分配顺序-->
        <div class="mainname" style="font-weight: 100;">单独账户还款分配顺序</div>
        <el-table
            v-loading = "listLoading2"
            :data="tableList2"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column label="事件编号" width="350" align="center">
                <template slot-scope="{row}">{{ row.instanCode1 }}&nbsp;&nbsp;{{ row.instanDesc1 }}</template>
            </el-table-column>
            <el-table-column label="核算状态" width="350" align="center">
                <template slot-scope="{row}">{{ row.instanCode2 }}&nbsp;&nbsp;{{ row.instanDesc2 }}</template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}"><!--v-show="selBtnFlag"-->
                    <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail2(row)" >分配顺序</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate2(row)" >修改</el-button><!--v-show="updBtnFlag"-->
                    <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="queryFormObj02.pageNum" :limit.sync="queryFormObj02.pageSize" @pagination="getListTable202" />
        <!-- 新增 -->
        <el-dialog title="还款顺序建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable>
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="事件编号" prop="instanCode1">
                    <el-input v-model="tempAdd.instanCode1" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="核算状态" prop="instanCode2" >
                    <el-select v-model="tempAdd.instanCode2" class="wd200" clearable>
                        <el-option
                            v-for="(item, index ) in instanCode2Options"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
            </el-form>

            <!--账户间还款分配顺序-->
            <div class="mainname" style="font-weight: 100;">账户间还款分配顺序</div>
            <el-table
                :data="add_payOderList201"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                <el-table-column prop="performOrder" label="执行顺序" align="center" />
                <el-table-column prop="elementNo" label="元件编号及描述" align="center" >
                    <template slot-scope="{row}">
                        {{ row.elementNo }}&nbsp;&nbsp;{{ row.elementDesc }}
                    </template>
                </el-table-column>
                <el-table-column label="上下移动" align="center">
                    <template slot-scope="{row,$index}">
                        <div class="table_arrow">
                            <a class="arrow_up" @click="add_exchangeSeqNoUp($index,row)"></a> <a
                                class="arrow_down" @click="add_exchangeSeqNoDown($index,row)"></a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" type="primary"  @click="replaceParamClick1(row,$index)">替换参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="addTableTotal201>0" :total="addTableTotal201" :page.sync="tempAdd201.pageNum" :limit.sync="tempAdd201.pageSize" @pagination="getSetList201" />


            <!-- <set-param-option
                :colunm3="add_colunm3201"
                :textTitle="add_textTitle201"
                :list="add_payOderList201"
                @replaceParamClick="replaceParamClick1(arguments)"
                @setParamClick="setParamClick(arguments)">
            </set-param-option> -->
            <!-- <pagination v-show="addTableTotal201>0" :total="addTableTotal201" :page.sync="tempAdd201.pageNum" :limit.sync="tempAdd201.pageSize" @pagination="getSetList201" /> -->
            
            
            <div class="mainname" style="font-weight: 100;">账户内还款分配顺序</div>
            <el-table
                :data="add_payOderList202"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                <el-table-column prop="performOrder" label="执行顺序" align="center" />
                <el-table-column prop="elementNo" label="元件编号及描述" align="center" >
                    <template slot-scope="{row}">
                        {{ row.elementNo }}&nbsp;&nbsp;{{ row.elementDesc }}
                    </template>
                </el-table-column>
                <el-table-column label="上下移动" align="center">
                    <template slot-scope="{row,$index}">
                        <div class="table_arrow">
                            <a class="arrow_up" @click="add_exchangeSeqNoUp2($index,row)"></a> <a
                                class="arrow_down" @click="add_exchangeSeqNoDown2($index,row)"></a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" type="primary"  @click="replaceParamClick2(row,$index)">替换参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="addTableTotal202>0" :total="addTableTotal202" :page.sync="tempAdd202.pageNum" :limit.sync="tempAdd202.pageSize" @pagination="getSetList202" />

            <!-- <set-param-option
                :colunm3="add_colunm3202"
                :textTitle="add_textTitle202"
                :list="add_payOderList202"
                @replaceParamClick="replaceParamClick2(arguments)"
                @setParamClick="setParamClick(arguments)">
            </set-param-option> -->
            <!--余额类型内还款分配顺序-->
            <div class="mainname" style="font-weight: 100;">余额类型内还款分配顺序</div>
            <el-table
                :data="add_payOderList282"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                <el-table-column prop="performOrder" label="执行顺序" align="center" />
                <el-table-column prop="elementNo" label="元件编号及描述" align="center" >
                    <template slot-scope="{row}">
                        {{ row.elementNo }}&nbsp;&nbsp;{{ row.elementDesc }}
                    </template>
                </el-table-column>
                <el-table-column label="上下移动" align="center">
                    <template slot-scope="{row,$index}">
                        <div class="table_arrow">
                            <a class="arrow_up" @click="add_exchangeSeqNoUp3($index,row)"></a> <a
                                class="arrow_down" @click="add_exchangeSeqNoDown3($index,row)"></a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" type="primary"  @click="replaceParamClick3(row,$index)">替换参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <set-param-option
                :colunm3="add_colunm3282"
                :textTitle="up_textTitle282"
                :list="add_payOderList282"
                @replaceParamClick="replaceParamClick3(arguments)"
                @setParamClick="setParamClick(arguments)">
            </set-param-option> -->
            <pagination v-show="addTableTotal282>0" :total="addTableTotal282" :page.sync="tempAdd282.pageNum" :limit.sync="tempAdd282.pageSize" @pagination="getSetList282" />
        
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消 </el-button>
                <el-button type="primary" @click="createData()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 替换参数 弹窗 -->
        <el-dialog title="选择参数选项":visible.sync="replcaeParam_dialog" width="65%">
        <replace-param
            :replaceObj="replaceParamObj"
            :replaceIndex="replaceIndex"
            :defalutVal="defalutChoseVal"
            @childByElementVal="childByElementVal">
        </replace-param>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="replcaeParam_dialog = false">关闭</el-button>
            <el-button type="primary" @click="sureReplaceData()">确定</el-button>
        </div>
        </el-dialog>
        <!--新增结束-->
        <!-- 详情 -->
        <!--统一还款分配顺序信息-->
        <el-dialog title="统一还款分配顺序信息" :visible.sync="dialogFormVisibleDetail1" width="75%">
            <el-table
                v-loading = "listLoading3"
                :data="detailList1"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border>
                <el-table-column prop="performOrder" label="分配顺序" align="center" />
                <el-table-column prop="" label="顺序描述"  align="center">
                    <template slot-scope="{row}" >
                        <span class=" ">{{row.elementNo}}&nbsp;&nbsp;{{row.elementDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="事件编号" align="center">
                    <template slot-scope="{row}" >
                        <span class=" ">{{row.instanCode1}}&nbsp;&nbsp;{{row.instanDesc1}}</span>
                        
                    </template>
                </el-table-column>
                <el-table-column label="核算状态"  align="center" prop="">
                    <template slot-scope="{row}">{{row.instanCode2 }}&nbsp;&nbsp;{{row.instanDesc2 }}</template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalDetail1>0" :total="tableTotalDetail1" :page.sync="tempDetailPage01.pageNum" :limit.sync="tempDetailPage01.pageSize" @pagination="getDetailListTable201" />
            <div class="text_title padLf10">余额类型内还款分配顺序信息</div>
            <el-table
                v-loading = "listLoading4"
                :data="detailList2"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border>
                    <el-table-column prop="performOrder" label="分配顺序" align="center" />
                    <el-table-column prop="" label="顺序描述"  align="center" >
                        <template slot-scope="{row}" >
                            <span class=" ">{{row.elementNo}}&nbsp;&nbsp;{{row.elementDesc}}</span>
                           
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="事件编号"  align="center">
                        <template slot-scope="{row}" >
                            <span class=" ">{{row.instanCode1}}&nbsp;&nbsp;{{row.instanDesc1}}</span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column label="核算状态" align="center" prop="">
                        <template slot-scope="{row}">{{row.instanCode2 }}&nbsp;&nbsp;{{ row.instanDesc2 }}</template>
                    </el-table-column>
                </el-table>
                <pagination v-show="tableTotalDetail2>0" :total="tableTotalDetail2" :page.sync="tempDetailPage02.pageNum" :limit.sync="tempDetailPage02.pageSize" @pagination="getDetailListTable282" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail1 = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--单独账单还款分配顺序信息-->
        <el-dialog title="单独账单还款分配顺序信息" :visible.sync="dialogFormVisibleDetail2" width="85%">
            <el-table v-loading = "listLoading5" :data="detailList3" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="performOrder" label="分配顺序" align="center" />
                <el-table-column prop="" label="顺序描述"  align="center">
                    <template slot-scope="{row}" >
                        <span class=" ">{{row.elementNo}}&nbsp;&nbsp;{{row.elementDesc}}</span>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="transIdentifiDesc" label="事件编号" align="center">
                    <template slot-scope="{row}" >
                        <span class="">{{row.instanCode1}}&nbsp;&nbsp;{{row.instanDesc1}}</span>
                        
                    </template>
                </el-table-column>
                <el-table-column label="核算状态" width="350" align="center">
                    <template slot-scope="{row}">{{row.instanCode2 }}&nbsp;&nbsp;{{row.instanDesc2 }}</template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalDetail3>0" :total="tableTotalDetail3" :page.sync="tempDetailPage03.pageNum" :limit.sync="tempDetailPage03.pageSize" @pagination="bill_getDetailListTable202" />
            
            <div class="text_title padLf10">余额类型内还款分配顺序信息</div>
            <el-table v-loading = "listLoading5" :data="detailList4"  class="mbtm20" fit  highlight-current-row style="width: 100%;" border>
                <el-table-column prop="performOrder" label="分配顺序" align="center" />
                <el-table-column prop="transIdentifiNo" label="顺序描述"  align="center">
                    <template slot-scope="{row}" >
                        <span class=" ">{{row.elementNo}}&nbsp;&nbsp;{{row.elementDesc}}</span>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="transIdentifiDesc" label="事件编号"  align="center">
                    <template slot-scope="{row}" >
                        <span class=" ">{{row.instanCode1}}&nbsp;&nbsp;{{row.instanDesc1}}</span>
                        
                    </template>
                </el-table-column>
                <el-table-column label="核算状态" width="350" align="center">
                    <template slot-scope="{row}">{{ row.instanCode2 }}&nbsp;&nbsp;{{row.instanDesc2 }}</template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalDetail4>0" :total="tableTotalDetail4" :page.sync="tempDetailPage04.pageNum" :limit.sync="tempDetailPage04.pageSize" @pagination="bill_getDetailListTable282" />
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail2 = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="统一还款分配顺序修改" :visible.sync="dialogFormVisibleUp" width="85%">
            <!--账户间还款分配顺序-->
            <el-table
                :data="up_payOrderList201"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                <el-table-column prop="performOrder" label="分配顺序" align="center" />
                <el-table-column prop="elementNo" label="顺序描述" align="center" >
                    <template slot-scope="{row}">
                        {{ row.elementNo }}&nbsp;&nbsp;{{ row.elementDesc }}
                    </template>
                </el-table-column>

                <el-table-column prop="instanCode1" label="事件编号" align="center" >
                    <template slot-scope="{row}">
                        {{ row.instanCode1 }}&nbsp;&nbsp;{{ row.instanDesc1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="instanCode2" label="核算状态" align="center" >
                    <template slot-scope="{row}">
                        {{ row.instanCode2 }}&nbsp;&nbsp;{{ row.instanDesc2 }}
                    </template>
                </el-table-column>
                <el-table-column label="上下移动" align="center">
                    <template slot-scope="{row,$index}">
                        <div class="table_arrow">
                            <a class="arrow_up" @click="up_exchangeSeqNoUp($index,row)"></a> <a
                                class="arrow_down" @click="up_exchangeSeqNoDown($index,row)"></a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" type="primary"  @click="up_replaceParamClick1(row,$index)">替换参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="upTableTotal201>0" :total="upTableTotal201" :page.sync="tempUp201.pageNum" :limit.sync="tempUp201.pageSize" @pagination="up_getSetList201" />

            <!-- <set-param-option
                :colunm3="up_colunm3201"
                :textTitle="up_textTitle201"
                :list="up_payOrderList201"
                @replaceParamClick="up_replaceParamClick1(arguments)">
            </set-param-option>
            <pagination v-show="upTableTotal201>0" :total="upTableTotal201" :page.sync="tempUp201.pageNum" :limit.sync="tempUp201.pageSize" @pagination="up_getSetList201" />
            -->
           
            <!--余额类型内还款分配顺序-->
            <el-table
                :data="up_payOrderList282"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                <el-table-column prop="performOrder" label="分配顺序" align="center" />
                <el-table-column prop="elementNo" label="顺序描述" align="center" >
                    <template slot-scope="{row}">
                        {{ row.elementNo }}&nbsp;&nbsp;{{ row.elementDesc }}
                    </template>
                </el-table-column>

                <el-table-column prop="instanCode1" label="事件编号" align="center" >
                    <template slot-scope="{row}">
                        {{ row.instanCode1 }}&nbsp;&nbsp;{{ row.instanDesc1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="instanCode2" label="核算状态" align="center" >
                    <template slot-scope="{row}">
                        {{ row.instanCode2 }}&nbsp;&nbsp;{{ row.instanDesc2 }}
                    </template>
                </el-table-column>
                <el-table-column label="上下移动" align="center">
                    <template slot-scope="{row,$index}">
                        <div class="table_arrow">
                            <a class="arrow_up" @click="up_exchangeSeqNoUp2($index,row)"></a> <a
                                class="arrow_down" @click="up_exchangeSeqNoDown2($index,row)"></a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" type="primary"  @click="up_replaceParamClick3(row,$index)">替换参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="upTableTotal282>0" :total="upTableTotal282" :page.sync="tempUp282.pageNum" :limit.sync="tempUp282.pageSize" @pagination="up_getSetList282" />

            <!-- <set-param-option
                :colunm3="up_colunm3282"
                :textTitle="up_textTitle282"
                :list="up_payOrderList282"
                @replaceParamClick="up_replaceParamClick3(arguments)">
            </set-param-option>
            <pagination v-show="upTableTotal282>0" :total="upTableTotal282" :page.sync="tempUp282.pageNum" :limit.sync="tempUp282.pageSize" @pagination="up_getSetList282"/>
         -->
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData1()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="单独账户还款分配顺序修改" :visible.sync="dialogFormVisibleUp2" width="65%">
           <!--账户间还款分配顺序-->
            <set-param-option
                :colunm3="aloneUp_colunm3201"
                :textTitle="aloneUp_textTitle201"
                :list="aloneUp_mediaInList201"
                @replaceParamClick="aloneUp_replaceParamClick1(arguments)">
            </set-param-option>
            <pagination v-show="aloneUpTableTotal201>0" :total="aloneUpTableTotal201" :page.sync="aloneUpTempUp201.pageNum" :limit.sync="aloneUpTempUp201.pageSize" @pagination="aloneUp_getSetList202" />
            <!--余额类型内还款分配顺序-->
            <set-param-option
                :colunm3="aloneUp_colunm3282"
                :textTitle="aloneUp_textTitle282"
                :list="aloneUp_mediaInList282"
                @replaceParamClick="aloneUp_replaceParamClick3(arguments)">
            </set-param-option>
            <pagination v-show="aloneUpTableTotal282>0" :total="aloneUpTableTotal282" :page.sync="aloneUpTempUp282.pageNum" :limit.sync="aloneUpTempUp282.pageSize" @pagination="aloneUp_getSetList282" />
        
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp2 = false">取消</el-button>
                <el-button type="primary" @click="updateData2()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import SomeParamOption from "@/components-ider/SomeParamOption"; // 查看参数
import ViewPcd from "@/components-ider/ViewPcd";
import SetParamOption from "@/components-ider/SetParamOption";
import ReplaceParam from "@/components-ider/ReplaceParam";
import SetPcd from "@/components-ider/SetPcd";
export default {
  name: 'tableList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    SomeParamOption,
    SomeParamOption,
    ViewPcd,
    SetParamOption,
    ReplaceParam,
    SetPcd
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
        queryFormObj02: {
            pageNum : 1,
            pageSize: 10
        },
        listLoading1: false,//统一账户还款分配顺序
        listLoading2:false,//单独账户还款分配顺序
        listLoading3:false,
        
        actionFlag: '', // 新增 修改flag
        
        queryFormRef: {},
        queryFormRules: {},      
        tableList1: [],//统一账户还款分配顺序的Data
        tableList2: [],//单独账户还款分配顺序Data
        tableTotal1: 0,//统一账户还款分配顺序总条数
        tableTotal2: 0,//单独账户还款分配顺序总条数
        
      // 下拉框
      operationModeOptions: [], 
      instanCode2Options:[],
      // 增删改查
        tempAdd: {}, // 新增
      tempUp: {}, // 修改
      tempDetail: {}, // 详情
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleUp2: false,
      dialogFormVisibleDetail1: false,
      dialogFormVisibleDetail2: false,
      
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},
      rulesUp1:{},
      rulesUp2:{},
      rulesDetail2: {},
      /*-----新增-----*/
        tempAdd201:{
            pageNum : 1,
            pageSize: 10
        },
        tempAdd202:{
            pageNum : 1,
            pageSize: 10
        },
        tempAdd282:{
            pageNum : 1,
            pageSize: 10
        },
        //账户间还款分配顺序201
        addTableTotal201: 0,
        replcaeParam_dialog: false,
        add_payOderList201: [], // 媒介参数设置
        add_textTitle201: "账户间还款分配顺序",
        add_colunm3201: false,
        //账户内还款分配顺序202
        addTableTotal202: 0,
        add_payOderList202: [], // 媒介参数设置
        add_textTitle202: "账户内还款分配顺序",
        add_colunm3202: false,
        //余额类型内还款分配顺序282
        addTableTotal282: 0,
        add_payOderList282: [], // 媒介参数设置
        add_textTitle282: "余额类型内还款分配顺序",
        add_colunm3282: false,
        /**/
        // 替换参数
        //replcaeParam_dialog: false,
        replaceParamObj: {},
        istLoading1: false,
        replaceIndex: "",
        defalutChoseVal: "",
        choosedVal: "",
        up_intanceFlag: '',
        /*-----详情-----*/
        tempDetailPage01: {
            pageNum : 1,
            pageSize: 10
        },
        tempDetailPage02: {
            pageNum : 1,
            pageSize: 10
        },
        tempDetailPage03: {
            pageNum : 1,
            pageSize: 10
        },
        tempDetailPage04: {
            pageNum : 1,
            pageSize: 10
        },
        rulesDetail3:{},
        rulesDetail4: {},
        listLoading4:false,//单独账单分配顺序信息
        listLoading5:false,
        tableTotalDetail1: 0,//统一还款分配顺序总条数
        tableTotalDetail2: 0,//余额类型内还款分配顺序总条数
        tableTotalDetail3: 0,//单独账单还款分配顺序总
        tableTotalDetail4:0,//余额类型内还款分配顺序信息
        detailList1: [],
        detailList2: [],
        detailList3:[],
        detailList4:[],
        tempDetail2:{},
        tempDetail3:{},
        tempDetail4:{},
        /*-----统一还款分配顺序修改-----*/
       tempUp201:{
            pageNum : 1,
            pageSize: 10
        },
        tempUp202:{
            pageNum : 1,
            pageSize: 10
        },
        tempUp282:{
            pageNum : 1,
            pageSize: 10
        },
        //账户间还款分配顺序201
        upTableTotal201: 0,
        replcaeParam_dialog: false,
        up_payOrderList201: [], // 媒介参数设置
        up_textTitle201: "",
        up_colunm3201: false,
        //账户内还款分配顺序202
        upTableTotal202: 0,
        up_payOrderList202: [], // 媒介参数设置
        up_textTitle202: "账户内还款分配顺序",
        up_colunm3202: false,
        //余额类型内还款分配顺序282
        upTableTotal282: 0,
        up_payOrderList282: [], // 媒介参数设置
        up_textTitle282: "余额类型内还款分配顺序",
        up_colunm3282: false,
        /*-----单独账户还款分配顺序修改-----*/
       aloneUpTempUp201:{
            pageNum : 1,
            pageSize: 10
        },
        aloneUpTempUp202:{
            pageNum : 1,
            pageSize: 10
        },
        aloneUpTempUp282:{
            pageNum : 1,
            pageSize: 10
        },
        //账户间还款分配顺序201
        
        aloneUpTableTotal201: 0,
        replcaeParam_dialog: false,
        aloneUp_mediaInList201: [], // 媒介参数设置
        aloneUp_textTitle201: "",
        aloneUp_colunm3201: false,
        //账户内还款分配顺序202
        aloneUpTableTotal202: 0,
        aloneUp_mediaInList202: [], // 媒介参数设置
        aloneUp_textTitle202: "账户内还款分配顺序",
        aloneUp_colunm3202: false,
        //余额类型内还款分配顺序282
        aloneUpTableTotal282: 0,
        aloneUp_mediaInList282: [], // 媒介参数设置
        aloneUp_textTitle282: "余额类型内还款分配顺序",
        aloneUp_colunm3282: false,
    }
  },
  created() {
    this.getBtnAuth()
  },
    mounted() {
        this.getListTable201()
        this.getListTable202()
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        // 核算状态
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0051", {Flag:'Y'}).then(res => {
            let rows = res
            rows.forEach((item, i) => {
                item.accountingDesc = item.accountingStatus+ ' ' + item.accountingDesc
            })
            this.instanCode2Options = rows
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0015')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0165')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0068')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 统一还款分配顺序列表
    getListTable201() {
        this.listLoading1 = true
        let params = {
            "specialArtifact":"1",
            "artifactNo":'201',
            "flag":'1',
            operationMode: this.queryFormObj.operationMode,
            instanCode1: this.queryFormObj.instanCode1,
            instanCode2: this.queryFormObj.instanCode2,
        }
        params = Object.assign( params, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', params ,(res) => {
            this.listLoading1 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList1 = res.returnData.rows
                    this.tableTotal1 = res.returnData.totalCount

                } else {
                    this.tableList1 = []
                    this.tableTotal1 = 0
                }
            }
        }, (err) => {
      		this.tableList1 = []
            this.tableTotal1 = 0
       		this.listLoading1 = false
        })
    },
    //单独账户还款分配顺序
    getListTable202() {
       this.listLoading2 = true
        let params = {
            "specialArtifact":"1",
            "artifactNo":'202',
            "flag":'1',
            // operationMode: this.queryFormObj.operationMode,
            // instanCode1: this.queryFormObj.instanCode1,
            // instanCode2: this.queryFormObj.instanCode2,

        }
        params = Object.assign(params, this.queryFormObj02 ,this.queryFormObj)
        
        this.getTableList('/beta/betaService/COS.IQ.02.0015', params,(res) => {
            this.listLoading2 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList2 = res.returnData.rows
                    this.tableTotal2 = res.returnData.totalCount
                    
                } else {
                    this.tableList2 = []
                    this.tableTotal2 = 0
                }
            }
        }, (err) => {
      		this.tableList2 = []
            this.tableTotal2 = 0
       		this.listLoading2 = false
        })
    },
    //查询需要条件判断未加
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getListTable201()
        this.getListTable202()
    },
    //新增显示的弹框
    handleCreate() {
        this.actionFlag = 'add'
        this.dialogFormVisibleAdd = true
        this.getSetList201();
        this.getSetList202();
        this.getSetList282();
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    // 替换参数
    replaceParamClick1(row,index) {
      this.up_intanceFlag = '201'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = row;
      this.replaceIndex = index;
      this.defalutChoseVal = row.elementNo;
    },
    // 替换参数
    replaceParamClick2(row , index) {
      this.up_intanceFlag = '202'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = row;
      this.replaceIndex = index;
      this.defalutChoseVal = row.elementNo;
    //   this.up_replacedList1.push(replaceParamObj)
    },
    // 替换参数
    replaceParamClick3(row , index) {
      this.up_intanceFlag = '202'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = row;
      this.replaceIndex = index;
      this.defalutChoseVal = row.elementNo;
    },
    getSetList201() {
        let obj = {
            artifactNo: '201',
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0008", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.add_payOderList201 = res.returnData.rows
                    this.addTableTotal201 = res.returnData.totalCount
                } else {
                    this.add_payOderList201 = []
                    this.addTableTotal201 = 0
                }
            }
        })
    },
    getSetList202() {
        let obj = {
            artifactNo: '202',
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0008", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.add_payOderList202 = res.returnData.rows
                    this.addTableTotal202 = res.returnData.totalCount
                } else {
                    this.add_payOderList202 = []
                    this.addTableTotal202 = 0
                }
            }
        })
    },
    getSetList282() {
        let obj = {
            artifactNo: '282',
        }
        this.getTableList( "/beta/betaService/COS.IQ.02.0008", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.add_payOderList282 = res.returnData.rows
                    this.addTableTotal282 = res.returnData.totalCount
                }  else {
                    this.add_payOderList282 = []
                    this.addTableTotal282 = 0
                }
            }
        })
    },
    //  确定替换参数
    sureReplaceData() {
      // 对象实例化
      if (this.actionFlag == 'up') {
         if(this.up_intanceFlag=='201'){
            this.$set(
                this.up_payOrderList201[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
        }else if(this.up_intanceFlag=='202') {
            this.$set(
                this.up_payOrderList202[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
        }else if(this.up_intanceFlag=='282') {
            this.$set(
                this.up_payOrderList282[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
        }
      
      } else if(this.actionFlag == 'add'){
         if(this.add_intanceFlag=='201'){
            this.$set(
                this.add_payOderList201[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
        }else if(this.add_intanceFlag=='202') {
            this.$set(
                this.add_payOderList202[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
        }else if(this.add_intanceFlag=='282') {
            this.$set(
                this.add_payOderList282[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
        }
      }
      else if(this.add_intanceFlag=='202'){
            this.$set(
              this.add_payOderList202[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
            this.$set(
              this.add_payOderList202[this.replaceIndex],"elementDesc",this.choosedVal.split("_")[1]
            );
        }else if(this.add_intanceFlag=='282'){
            this.$set(
              this.add_payOderList282[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
            );
            this.$set(
              this.add_payOderList282[this.replaceIndex],"elementDesc",this.choosedVal.split("_")[1]
            );
        }
        this.replcaeParam_dialog = false;
    },
     childBySetVal(val) {
      this.pcdList = val;
    },
    childByDeletPcd(val) {
      this.delePcdList = val;
    },
    childByElementVal(val) {
      this.choosedVal = val;
    },
    //新增
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                let obj={}
                let repaymentA=''
                let repaymentB=''
                let repaymentC=''
                let needData1 = [] ;
                let needData2 = [] ;
                let needData3 = [] ;
                this.add_payOderList201.forEach(item => {
                    needData1.push({
                        artifactNo: '201',
    					operationMode : this.tempAdd.operationMode,
                        elementNo: item.elementNo,
                        instanCode1: this.tempAdd.instanCode1,
                        instanCode2: this.tempAdd.instanCode2,
                    })
                })
                this.add_payOderList202.forEach(item => {
                    needData2.push({
                        artifactNo: '202',
                        operationMode : this.tempAdd.operationMode,
                        elementNo: item.elementNo,
                        instanCode1: this.tempAdd.instanCode1,
                        instanCode2: this.tempAdd.instanCode2,
                    })
                })
                this.add_payOderList282.forEach(item => {
                    needData3.push({
                        artifactNo: '282',
                        operationMode : this.tempAdd.operationMode,
                        elementNo: item.elementNo,
                        instanCode1: this.tempAdd.instanCode1,
                        instanCode2: this.tempAdd.instanCode2,
                    })
                })
                this.repaymentA = needData1
                this.repaymentB = needData2
                this.repaymentC = needData3
                obj.repaymentA=this.repaymentA
                obj.repaymentB=this.repaymentB
                obj.repaymentC=this.repaymentC
                obj.eventNo=this.tempAdd.instanCode1
                this.post('/beta/betaService/COS.AD.02.0165', obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleAdd = false
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                        this.tempAdd = {}
                    }
                    
                })
            }
        })
    },  
    //详情显示弹框
    handleDetail1(row) {
        this.dialogFormVisibleDetail1 = true
        this.tempDetail = Object.assign({}, row) // 
        this.getDetailListTable201()
        this.getDetailListTable282()
       
    },
   handleDetail2(row) {
        this.dialogFormVisibleDetail2 = true
        this.tempDetail = Object.assign({}, row) // 
        this.bill_getDetailListTable202()
        this.bill_getDetailListTable282()

    },
    // 排序
    compar(array, key) {
        return array.sort( (a,b) => {
            const x = a[key]
            const y = b[key]
            return x > y ? 1 : x < y ?-1 : 0
        })
    },
    // 详情统一还款分配顺序列表
    getDetailListTable201() {
        this.dialogFormVisibleDetail1 = true
        let params = {
            "operationMode" : this.tempDetail.operationMode,
            "instanCode1" :this.tempDetail.instanCode1,
            "instanCode2" : this.tempDetail.instanCode2,
            "artifactNo":'201',
        }
        params = Object.assign(this.tempDetailPage01, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', params,(res) => {
            if (res.returnCode == '000000') {
               if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detailList1 = this.compar(res.returnData.rows, 'performOrder')
                    this.tableTotalDetail1 = res.returnData.totalCount
                } else {
                    this.detailList1 = []
                    this.tableTotalDetail1 = 0
                }
            }
        }, (err) => {
      		this.detailList1 = []
            this.tableTotalDetail1 = 0
        })
    },
    //余额类型内还款分配顺序信息
    getDetailListTable282() {
        this.dialogFormVisibleDetail1 = true
        let params = {
            "operationMode" : this.tempDetail.operationMode,
            "eventNumber" : this.tempDetail.instanCode1,
            "artifactNo":'282',
        }
        this.tempDetailPage02 = Object.assign(this.tempDetailPage02, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.tempDetailPage02,(res) => {
            //this.listLoading4 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detailList2 = res.returnData.rows
                    this.tableTotalDetail2 = res.returnData.totalCount
                } else {
                    this.detailList2 = []
                    this.tableTotalDetail2 = 0
                }
            }
        }, (err) => {
      		this.detailList2 = []
            this.tableTotalDetail2 = 0
        })
    },
    bill_getDetailListTable201() {
        this.dialogFormVisibleDetail2 = true
        let params = {
            "operationMode" : this.tempDetail.operationMode,
            "instanCode1" :this.tempDetail.instanCode1,
            "instanCode2" : this.tempDetail.instanCode2,
            "artifactNo":'201',
            
        }
        this.tempDetailPage03 = Object.assign(this.tempDetailPage03, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.tempDetailPage03,(res) => {
            if (res.returnCode == '000000') {
               if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detailList3 = res.returnData.rows
                    this.tableTotalDetail3 = res.returnData.totalCount
                    //this.listLoading3 = false
                } else {
                    this.detailList3 = []
                    this.tableTotalDetail3 = 0
                }
            }
        }, (err) => {
      		this.detailList3 = []
            this.tableTotalDetail3 = 0
        })
    },
    //202
    bill_getDetailListTable202() {
        this.dialogFormVisibleDetail2 = true
        let params = {
            "operationMode" : this.tempDetail.operationMode,
            "instanCode1" : this.tempDetail.instanCode1,
            "instanCode2" : this.tempDetail.instanCode2,
            "artifactNo":'202',
           
        }
        this.tempDetailPage03= Object.assign(this.tempDetailPage03, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.tempDetailPage03,(res) => {
            //this.listLoading4 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detailList3 = res.returnData.rows
                    //console.log(this.detailList4)
                    this.tableTotalDetail3 = res.returnData.totalCount
                } else {
                    this.detailList3 = []
                    this.tableTotalDetail3 = 0
                }
            }
        }, (err) => {
      		this.detailList3 = []
            this.tableTotalDetail3 = 0
        })
    },
    //余额类型内还款分配顺序信息
    bill_getDetailListTable282() {
        this.dialogFormVisibleDetail2 = true
        let params = {
            "operationMode" : this.tempDetail.operationMode,
            "eventNumber" : this.tempDetail.instanCode1,
            "artifactNo":'282',
           
        }
        this.tempDetailPage04= Object.assign(this.tempDetailPage04, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.tempDetailPage04,(res) => {
            //this.listLoading4 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detailList4 = res.returnData.rows
                    //console.log(this.detailList4)
                    this.tableTotalDetail2 = res.returnData.totalCount
                } else {
                    this.detailList4 = []
                    this.tableTotalDetail2 = 0
                }
            }
        }, (err) => {
      		this.detailList4 = []
            this.tableTotalDetail4 = 0
        })
    },
    //修改显示弹框
    handleUpdate(row) {
        this.actionFlag = 'up'
        
        this.up_getSetList201(row)
        //this.up_getSetList202()
        this.up_getSetList282(row)
        this.dialogFormVisibleUp = true
//      this.$nextTick(() => {
//          this.$refs['dataFormUp1'].clearValidate()
//      })
    }, 
    // 替换参数
    up_replaceParamClick1(row,index) {
        this.up_intanceFlag = '201'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = row;
      this.replaceIndex = index;
      this.defalutChoseVal = row.elementNo;
//    /console.log(this.defalutChoseVal)
    //   this.up_replacedList1.push(replaceParamObj)replcaeParam_dialog
    },
    // 替换参数
    up_replaceParamClick2(e) {
      //this.up_intanceFlag = '202'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = e[0];
      this.replaceIndex = e[1];
      this.defalutChoseVal = e[0].elementNo;
    },
    // 替换参数
    up_replaceParamClick3(row, index) {
      //this.up_intanceFlag = '202'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = row;
      this.replaceIndex = index;
      this.defalutChoseVal = row.elementNo;
//    /console.log(this.defalutChoseVal)
   },
   // 修改 表1 
    up_getSetList201(row) {
        let obj = {
            artifactNo: '201',
            instanCode1: row.instanCode1,
            instanCode2: row.instanCode2,
            operationMode: row.operationMode
        }
        obj= Object.assign(this.tempUp201, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    // this.up_payOrderList201 = res.returnData.rows
                    this.up_payOrderList201 = this.compar(res.returnData.rows, 'performOrder')
                    this.upTableTotal201 = res.returnData.totalCount
                } else {
                    this.up_payOrderList201 = []
                    this.upTableTotal201 = 0
                }
            }
        })
    },
    up_getSetList282(row) {
        let obj = {
            artifactNo: '282',
            "pageSize":10,
            "indexNo":0,
            eventNumber: row.instanCode1,
            operationMode: row.operationMode
        }
        obj= Object.assign(this.tempUp282, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_payOrderList282 = res.returnData.rows
                    this.upTableTotal282 = res.returnData.totalCount
                } else {
                    this.up_payOrderList282 = []
                    this.upTableTotal282 = 0
                }
            }
        })
    },
    //------单独账户还款分配顺序修改-----
    //单独账户还款分配顺序修改显示弹框
    handleUpdate2(row) {
        this.tempUp2 = Object.assign({}, row)
        this.aloneUp_getSetList202()
        this.aloneUp_getSetList282()
        this.dialogFormVisibleUp2 = true
        // this.$nextTick(() => {
        //     this.$refs['dataFormUp2'].clearValidate()
        // })
    }, 
    // 替换参数
    aloneUp_replaceParamClick1(e) {
     // this.up_intanceFlag = '201'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = e[0];
      this.replaceIndex = e[1];
      this.defalutChoseVal = e[0].elementNo;
      //console.log(this.defalutChoseVal)
    //   this.up_replacedList1.push(replaceParamObj)
    },
    // 替换参数
    aloneUp_replaceParamClick2(e) {
      //this.up_intanceFlag = '202'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = e[0];
      this.replaceIndex = e[1];
      this.defalutChoseVal = e[0].elementNo;
    },
    // 替换参数
    aloneUp_replaceParamClick3(e) {
      //this.up_intanceFlag = '202'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = e[0];
      this.replaceIndex = e[1];
      this.defalutChoseVal = e[0].elementNo;
      console.log(this.defalutChoseVal)
   },
    aloneUp_getSetList202() {
        let obj = {
            artifactNo: '202',
            instanCode1: this.tempUp2.instanCode1,
            instanCode2: this.tempUp2.instanCode2,
            operationMode: this.tempUp2.operationMode
        }
         obj= Object.assign(this.aloneUpTempUp201, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.aloneUp_mediaInList201 = res.returnData.rows
                    this.aloneUpTableTotal201 = res.returnData.totalCount
                }
            }
        })
    },
    aloneUp_getSetList282() {
        let obj = {
            artifactNo: '282',
             eventNumber: this.tempUp2.instanCode1,
            operationMode: this.tempUp2.operationMode
        }
        
        obj= Object.assign(this.aloneUpTempUp282, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", obj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.aloneUp_mediaInList282 = res.returnData.rows
                    this.aloneUpTableTotal282 = res.returnData.totalCount
                } else {
                    this.aloneUp_mediaInList282 = []
                    this.aloneUpTableTotal282 = 0
                }
            }
        })
    },
//  //  确定替换参数
//  sureReplaceData() {
//    // 媒介对象实例化
//    if(this.up_intanceFlag=='201'){
//          this.$set(
//              this.up_payOrderList201[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
//          );
//          this.$set(
//            this.up_payOrderList201[this.replaceIndex],"elementDesc",this.choosedVal.split("_")[1]
//          );
//      }else if(this.up_intanceFlag=='202'){
//          this.$set(
//            this.up_payOrderList202[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
//          );
//          this.$set(
//            this.up_payOrderList202[this.replaceIndex],"elementDesc",this.choosedVal.split("_")[1]
//          );
//      }else if(this.up_intanceFlag=='282'){
//          this.$set(
//            this.up_payOrderList282[this.replaceIndex],"elementNo",this.choosedVal.split("_")[0]
//          );
//          this.$set(
//            this.up_payOrderList282[this.replaceIndex],"elementDesc",this.choosedVal.split("_")[1]
//          );
//      }
//      this.replcaeParam_dialog = false;
//  },
     childBySetVal(val) {
      this.pcdList = val;
//    console.log(this.pcdList)
    },
    childByDeletPcd(val) {
      this.delePcdList = val;
    },
    childByElementVal(val) {
      this.choosedVal = val;
    },
    //修改
    createData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                let obj={}
                let repaymentA=''
                let repaymentB=''
                let repaymentC=''
                let needData1 = [] ;
                let needData2 = [] ;
                let needData3 = [] ;
                this.up_payOrderList201.forEach(item => {
                    needData1.push({
                        artifactNo: '201',
                        operationMode : this.tempUp2.operationMode,
                        elementNo: item.elementNo,
                        instanCode1: this.tempUp2.instanCode1,
                        instanCode2: this.tempUp2.instanCode2,
                    })
                })
                this.up_payOrderList202.forEach(item => {
                    needData2.push({
                        artifactNo: '202',
                        operationMode : this.tempUp.operationMode,
                        elementNo: item.elementNo,
                        instanCode1: this.tempU2p.instanCode1,
                        instanCode2: this.tempUp2.instanCode2,
                    })
                })
                this.up_payOrderList282.forEach(item => {
                    needData3.push({
                        artifactNo: '282',
                        operationMode : this.tempUp2.operationMode,
                        elementNo: item.elementNo,
                        instanCode1: this.tempUp2.instanCode1,
                        instanCode2: this.tempUp2.instanCode2,
                    })
                })
                this.repaymentA = needData1
                this.repaymentB = needData2
                this.repaymentC = needData3
                obj.repaymentA=this.repaymentA
                obj.repaymentB=this.repaymentB
                obj.repaymentC=this.repaymentC
                obj.eventNo=this.tempAdd2.instanCode1
                this.post('/beta/betaService/COS.AD.02.0165', obj, (res) => {
                    if (res.returnCode == '000000') {
                  
                         this.dialogFormVisibleAdd = false
                            this.$notify({
                                title: 'Success',
                                message: '修改成功',
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
    updateData1() {
        this.$refs['dataFormUp1'].validate((valid) => {
            if (valid) {
                let list={}
                list=this.aloneUp_mediaInList201
                this.post('/beta/betaService/COS.UP.02.0068', {}, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp1 = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                    }
                })
            }
        })
    },
    updateData2() {
        this.$refs['dataFormUp2'].validate((valid) => {
            if (valid) {
              
                this.post('/beta/betaService/COS.UP.02.0068', {}, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp2 = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                    }
                })
            }
        })
    }, 


     // 新增 
    // 上移
    add_exchangeSeqNoUp(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.add_payOderList201[index - 1]

            //将执行顺序交换
            let performOrderValue = dataMap.performOrder
            this.$set(this.add_payOderList201[index - 1], 'performOrder', this.add_payOderList201[index].performOrder)
            this.$set(this.add_payOderList201[index], 'performOrder', performOrderValue)
            // 交换参数
            this.$set(this.add_payOderList201, index - 1, this.add_payOderList201[index])
            this.$set(this.add_payOderList201, index, dataMap)
        }
    },
    // 下移
    add_exchangeSeqNoDown(index,row){    
        if (index === (this.add_payOderList201.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.add_payOderList201[index + 1]
            //将执行顺序交换
            let performOrderValue =  i.performOrder
            this.$set(this.add_payOderList201[index + 1], 'performOrder', this.add_payOderList201[index].performOrder)
            this.$set(this.add_payOderList201[index], 'performOrder', performOrderValue)

            this.$set(this.add_payOderList201, index + 1, this.add_payOderList201[index])
            this.$set(this.add_payOderList201, index, i)
        }
    },
    // 上移
    add_exchangeSeqNoUp2(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.add_payOderList202[index - 1]

            //将执行顺序交换
            let performOrderValue = dataMap.performOrder
            this.$set(this.add_payOderList202[index - 1], 'performOrder', this.add_payOderList202[index].performOrder)
            this.$set(this.add_payOderList202[index], 'performOrder', performOrderValue)
            // 交换参数
            this.$set(this.add_payOderList202, index - 1, this.add_payOderList202[index])
            this.$set(this.add_payOderList202, index, dataMap)
        }
    },
    // 下移
    add_exchangeSeqNoDown2(index,row){    
        if (index === (this.add_payOderList202.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.add_payOderList202[index + 1]
            //将执行顺序交换
            let performOrderValue =  i.performOrder
            this.$set(this.add_payOderList202[index + 1], 'performOrder', this.add_payOderList202[index].performOrder)
            this.$set(this.add_payOderList202[index], 'performOrder', performOrderValue)

            this.$set(this.add_payOderList202, index + 1, this.add_payOderList202[index])
            this.$set(this.add_payOderList202, index, i)
        }
    },

    // 上移
    add_exchangeSeqNoUp3(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.add_payOderList282[index - 1]

            //将执行顺序交换
            let performOrderValue = dataMap.performOrder
            this.$set(this.add_payOderList282[index - 1], 'performOrder', this.add_payOderList282[index].performOrder)
            this.$set(this.add_payOderList282[index], 'performOrder', performOrderValue)
            // 交换参数
            this.$set(this.add_payOderList282, index - 1, this.add_payOderList282[index])
            this.$set(this.add_payOderList282, index, dataMap)
        }
    },
    // 下移
    add_exchangeSeqNoDown3(index,row){    
        if (index === (this.add_payOderList282.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.add_payOderList282[index + 1]
            //将执行顺序交换
            let performOrderValue =  i.performOrder
            this.$set(this.add_payOderList282[index + 1], 'performOrder', this.add_payOderList282[index].performOrder)
            this.$set(this.add_payOderList282[index], 'performOrder', performOrderValue)

            this.$set(this.add_payOderList282, index + 1, this.add_payOderList282[index])
            this.$set(this.add_payOderList282, index, i)
        }
    },

    // 修改
     // 上移
     up_exchangeSeqNoUp(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.up_payOrderList201[index - 1]

            //将执行顺序交换
            let performOrderValue = dataMap.performOrder
            this.$set(this.up_payOrderList201[index - 1], 'performOrder', this.up_payOrderList201[index].performOrder)
            this.$set(this.up_payOrderList201[index], 'performOrder', performOrderValue)
            // 交换参数
            this.$set(this.up_payOrderList201, index - 1, this.up_payOrderList201[index])
            this.$set(this.up_payOrderList201, index, dataMap)
        }
    },
    // 下移
    up_exchangeSeqNoDown(index,row){    
        if (index === (this.up_payOrderList201.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.up_payOrderList201[index + 1]
            //将执行顺序交换
            let performOrderValue =  i.performOrder
            this.$set(this.up_payOrderList201[index + 1], 'performOrder', this.up_payOrderList201[index].performOrder)
            this.$set(this.up_payOrderList201[index], 'performOrder', performOrderValue)

            this.$set(this.up_payOrderList201, index + 1, this.up_payOrderList201[index])
            this.$set(this.up_payOrderList201, index, i)
        }
    },

    // 余额类型内还款分配顺序信息
    // 上移
    up_exchangeSeqNoUp2(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.up_payOrderList282[index - 1]

            //将执行顺序交换
            let performOrderValue = dataMap.performOrder
            this.$set(this.up_payOrderList282[index - 1], 'performOrder', this.up_payOrderList282[index].performOrder)
            this.$set(this.up_payOrderList282[index], 'performOrder', performOrderValue)
            // 交换参数
            this.$set(this.up_payOrderList282, index - 1, this.up_payOrderList282[index])
            this.$set(this.up_payOrderList282, index, dataMap)
        }
    },
    // 下移
    up_exchangeSeqNoDown2(index,row){    
        if (index === (this.up_payOrderList282.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.up_payOrderList282[index + 1]
            //将执行顺序交换
            let performOrderValue =  i.performOrder
            this.$set(this.up_payOrderList282[index + 1], 'performOrder', this.up_payOrderList282[index].performOrder)
            this.$set(this.up_payOrderList282[index], 'performOrder', performOrderValue)

            this.$set(this.up_payOrderList282, index + 1, this.up_payOrderList282[index])
            this.$set(this.up_payOrderList282, index, i)
        }
    },
    
    
  }
}
</script>

<style>
</style>
