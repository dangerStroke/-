<template>
    <div class="throughOrder">
         <div class="search_box">
            <div class="search_left">
                <div class="search_single">
                    <Input v-model="orderId" placeholder="请输入订单编号" style="width: 180px" />
                </div>
                <div class="search_single">
                    <Input v-model="plate_no" placeholder="请输入车牌号" style="width: 180px" />
                </div>
                <div class="search_single">
                    <Select v-model="status" style="width:180px" placeholder="订单状态">
                        <Option
                            v-for="item in statusArr"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="search_single">
                    <DatePicker @on-change="dateChange"  :value="date" type="date"  placeholder="选择出发日期" style="width: 180px"></DatePicker>
                </div>
                <div class="search_single">
                    <DatePicker @on-change="created_atChange"  :value="created_at" type="date"  placeholder="选择下单日期" style="width: 180px"></DatePicker>
                </div>
            </div>
            <div class="search_right">
                <Button type="primary" @click="getOrderList('')">搜索</Button>
                <Button type="error" @click="initData">清空</Button>
            </div>
        </div>
        <div class="table_box">
             <Table border="" :columns="columns" :data="listData">
                <template slot-scope="{ row }" slot="status">
                    	
                    <div class="img_box" v-if="row.status == 1">
                       待支付
                    </div>
                    <div class="img_box" v-if="row.status == 2">
                      已支付
                    </div>
                    <div class="img_box" v-if="row.status == 3">
                       已取消
                    </div>
                    <div class="img_box" v-if="row.status == 4">
                       支付失败
                    </div>
                    <div class="img_box" v-if="row.status == 5">
                       已完成
                    </div>
                    <div class="img_box" v-if="row.status == 6">
                       已评价
                    </div>
                    <div class="img_box" v-if="row.status == 7">
                       已退款
                    </div>
                    <div class="img_box" v-if="row.status == 8">
                       退款中
                    </div>
                </template>
                <template slot-scope="{ row }" slot="ticket">
                    <div class="img_box" v-if="row.num > 0">
                       {{row.num}}张
                    </div>
                    <div class="img_box" v-else>
                       无
                    </div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" @click="bindDetail(row)">查看详情</Button>
                    <Button type="info" @click="modalChange('cancleId','show',row)" v-if="row.status === 1" >取消</Button>
                    <Button type="error" @click="modalChange('refundId','show',row)"  v-if="row.status === 2">退款</Button>
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
        <Modal
            class="delete_box"
            v-model="showModal"
            :mask-closable="false"
            :closable="false"
            width="400"
        >
            <div class="content" v-if="changeType === 'cancleId'">
                <p>您确定要取消选中的订单吗？</p>
            </div>
            <div class="content" v-if="changeType === 'refundId'">
                <p>您确定要对选中的订单进行退款吗？</p>
            </div>
            <div class="content" v-if="changeType === 'completeId'">
                <p>您确定要对选中的订单进行完成操作吗？</p>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="modalChange('refundId','cancle',row)">取消</Button>
                <Button type="primary" @click="bindConfirm">确定</Button>
            </div>
        </Modal>
        <Modal  class="detail_modal"
            v-model="showDetail"
            :mask-closable="false"
            :closable="false"
            title="景区快客订单"
            width="780">
            <div class="content">
                <div class="content_top">
                    <div class="single">
                        <p class="single_left">订单类型:</p>
                        <p class="single_right">景区快客</p>
                    </div>
                    <div class="single">
                        <p class="single_left">订单号:</p>
                        <p class="single_right">{{detailInfo.order_sn}}</p>
                    </div>
                    <div class="single">
                        <p class="single_left">订单状态:</p>
                        <p class="single_right" v-if="detailInfo.status === 1">待支付</p>
                        <p class="single_right" v-if="detailInfo.status === 2">已支付</p>
                        <p class="single_right" v-if="detailInfo.status === 3">已取消</p>
                        <p class="single_right" v-if="detailInfo.status === 4">支付失败</p>
                        <p class="single_right" v-if="detailInfo.status === 5">已完成</p>
                        <p class="single_right" v-if="detailInfo.status === 6">已评价</p>
                        <p class="single_right" v-if="detailInfo.status === 7">已退款</p>
                        <p class="single_right" v-if="detailInfo.status === 8">退款中</p>
                    </div>
                    <div class="single">
                        <p class="single_left">支付状态:</p>
                        <p class="single_right" v-if="detailInfo.status === 1 || detailInfo.status === 3||  detailInfo.status === 4 || detailInfo.status === 7">支付失败</p>
                        <p class="single_right" v-if="detailInfo.status === 2 || detailInfo.status === 5||  detailInfo.status === 6 ">支付成功</p>
                        <p class="single_right" v-if="detailInfo.status === 8">退款中</p>
                    </div>
                    <div class="single">
                        <p class="single_left">取消时间:</p>
                        <p class="single_right" v-if="detailInfo.cancel_time">{{detailInfo.cancel_time}}</p>
                    </div>
                    <div class="single">
                        <p class="single_left">创建时间:</p>
                        <p class="single_right">{{detailInfo.created_at}}</p>
                    </div>
                </div>
                <div class="content_bottom">
                    <div class="single">
                          <p class="single_left">预订人:</p>
                        <p class="single_right">{{detailInfo.name}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">电话:</p>
                        <p class="single_right">{{detailInfo.phone}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">身份证号:</p>
                        <p class="single_right">{{detailInfo.id_card_number}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">预约日期:</p>
                        <p class="single_right">{{detailInfo.date}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">上车地点:</p>
                        <p class="single_right">{{detailInfo.start_point}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">下车地点:</p>
                        <p class="single_right">{{detailInfo.end_point}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">价格:</p>
                        <p class="single_right">{{detailInfo.priceStr}}</p>
                    </div>
                    <div class="single">
                          <p class="single_left">司机:</p>
                            <p class="single_right" v-if="detailInfo.driver">{{detailInfo.driver}}</p>
                            <p class="single_right" v-else>无</p>
                    </div>

                </div>
                <div class="notice_box" >
                    <p class="notice_left">备注：</p>
                    <p v-if="detailInfo.remark">{{detailInfo.remark}}</p>
                    <p v-else>无</p>
                </div>
                <div class="table_box">
                     <Table border="" :columns="priceColum" :data="priceData"></Table>
                </div>
                <div class="table_box">
                     <Table border="" :columns="userColum" :data="userData"></Table>
                </div>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="closeDeatil">取消</Button>
                <Button type="primary" @click="bindCar" v-if="detailInfo.status ==2">确定</Button>
            </div>
            </Modal>
            <Button class="submitExcel" @click="subExcel">导出Excel</Button>
    </div>
</template>
<script>
import expressBusOrder  from './expressBusOrder'
export default expressBusOrder
</script>
<style lang="less">
@import url("./expressBusOrder.less");
</style>