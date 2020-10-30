<template>
    <div class="list_container">
        <div class="search_box">
            <div class="search_left">
                <div class="search_single">
                    <Input v-model="name" placeholder="请输入乘客姓名" style="width: 180px" />
                </div>
                <div class="search_single">
                    <Select v-model="status" style="width:180px" placeholder="订单状态">
                        <Option
                            v-for="item in statusList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="search_single">
                    <DatePicker @on-change="dateChange($event,'ticket_time')"  :value="ticket_time" type="date"  placeholder="选择出发日期" style="width: 180px"></DatePicker>
                </div>
            </div>
            <div class="search_right">
                <Button type="primary" @click="getList('')">搜索</Button>
                <Button type="error" @click="initData">清空</Button>
                <Button type="primary" class="add_btn" @click="bindAdd('add',{})">
                    <Icon type="md-add"/>新建
                </Button>
            </div>
        </div>
        <!-- <div class="btn_box">
            <Button type="primary" @click="bindAdd('add')">
                <Icon type="md-add"/>新增
            </Button>
        </div> -->
        <div class="table_box">
            <Table border="" :columns="columns" :data="listData">
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary"  @click="bindAdd('detail',row)">查看详情</Button>
                    <Button type="warning" @click="bindAdd('edit',row)" v-if="row.status ==1 || row.status ==2">修改</Button>
                    <Button type="info" @click="changeStatus(row.id,2)" v-if="row.status ==1" >确认</Button>
                    <Button type="success" @click="changeStatus(row.id,3)" v-if="row.status ==1 || row.status ==2">完成</Button>
                    <Button type="error" @click="changeStatus(row.id,4)" v-if="row.status != 3 && row.status != 4">取消</Button>
                </template>
            </Table>
            <div class="page_box">
                <div class="page_left">
                    共{{ total }}条记录 第{{ page }}/{{
                    Math.ceil(total / pagesize)
                    }}页
                </div>
                <div class="page_right">
                    <Page
                        :total="total"
                        :page-size="pagesize"
                        :current="page"
                        @on-change="changePage"
                    />
                </div>
            </div>
        </div>
        <Modal class="detail_box" v-model="showDetail" title="咨询详情" :footer-hide="true" width="600" @on-visible-change="modalChange($event,'detail')">
            <div class="content">
                <div class="single_info">
                    <p class="single_left">姓名：</p>
                    <p>{{editInfo.name}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">电话：</p>
                    <p>{{editInfo.phone}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">线路：</p>
                    <p>{{editInfo.route_text}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">班次：</p>
                    <p>{{editInfo.class}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">出发日期：</p>
                    <p>{{editInfo.ticket_time_string}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">人数：</p>
                    <p>{{editInfo.member_number}}人</p>
                </div>
                <div class="single_info">
                    <p class="single_left">上车地址：</p>
                    <p>{{editInfo.start_name}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">下车地址：</p>
                    <p>{{editInfo.end_name}}</p>
                </div>
                <div class="single_info">
                    <p class="single_left">备注：</p>
                    <p v-if="editInfo.remark">{{editInfo.remark}}</p>
                    <p v-else>无</p>
                </div>
            </div>
        </Modal>
        <Modal class="add_box" v-model="showAdd" :mask-closable="false" :closable="false" width="800" :title="modalTitle">
            <div class="content">
                <div class="input_single">
                    <Input v-model="editInfo.name" placeholder="客户姓名" style="width: 250px" />
                    <InputNumber :min="1" v-model="editInfo.member_number" placeholder="人数" style="width: 250px" class="number_input" ></InputNumber>
                    <!-- <Input type="number"  :min="1" v-model="editInfo.member_number" placeholder="人数" style="width: 250px" class="number_input" /> -->
                </div>
                <div class="input_single">
                    <Input v-model="editInfo.phone" placeholder="手机号码" style="width: 250px" />
                </div>
                <div class="input_single">
                     <Select
                    v-model="editInfo.route"
                    style="width:250px;margin-right:40px"
                    placeholder="请选择路线"
                    @on-change="dateChange($event,'route')"
                >
                    <Option
                        v-for="item in routeList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.name }}</Option>
                </Select>
                   <DatePicker @on-change="dateChange($event,'date')" :value="editInfo.ticket_time" type="date" :options="options3" placeholder="选择出发日期" style="width: 250px;margin-right:40px"></DatePicker>
                </div>
                <div class="input_single">
                     <Select
                     ref="resetSelect"
                     clearable
                    v-model="editInfo.class"
                    style="width:250px;margin-right:40px"
                    placeholder="请选择班次"
                    :disabled="!editInfo.route || !editInfo.ticket_time"
                >
                    <Option
                        v-for="item in timerList"
                        :value="item.start_time"
                        :key="item.start_time"
                    >{{ item.class_text }}</Option>
                </Select>
                <Input v-model="editInfo.start_name" placeholder="上车详细地址" style="width: 400px" />
                </div>
                <div class="input_single">
                    <Input  v-model="editInfo.end_name" placeholder="下车详细地址" style="width: 400px;margin-left:290px;"  />
                </div>
                <div class="input_single">
                    <Input type="textarea" v-model="editInfo.remark" placeholder="备注"  class="notice" />
                </div>
            </div>
            <div slot="footer" class="footer" v-if="modalTitle != '咨询详情'">
                <Button type="default" class="cancle_btn" @click="cancleEdit('cancle')">取消</Button>
                <Button type="primary" @click="cancleEdit('edit')">确定</Button>
            </div>
        </Modal>
        <Modal
            class="delete_box"
            v-model="showDeleta"
            :mask-closable="false"
            :closable="false"
            width="400"
        >
            <div class="content">
                <p>您确定要取消选中的咨询吗？</p>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="deleteArea('')">取消</Button>
                <Button type="primary" @click="bindDelete(deleteId,4)">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import bookingList from "./bookingList";
export default bookingList;
</script>
<style lang="less" >
@import url("./bookingList.less");
</style>


