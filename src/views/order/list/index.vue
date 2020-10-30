<template>
  <div class="wrap">
    <div class="searchBox">
      <div class="boxList">
        <Select
          v-model="line"
          style="width:200px"
          placeholder="选择线路"
          class="searchBox1"
          @on-change="lineChange"
          value="dsadgash"
        >
          <Option v-for="(item,index) in lineList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <DatePicker
          type="date"
          placeholder="发车日期"
          style="width: 200px"
          class="searchBox1"
          placement="bottom-end"
          @on-change="dateChange"
          :value="date"
        ></DatePicker>
      </div>
      <div class="boxList">
        <Select
          v-model="order"
          style="width:200px"
          placeholder="订单状态"
          class="searchBox1"
          @on-change="orderTypeChange"
        >
          <Option
            v-for="(item,index) in orderType"
            :value="item.value"
            :key="index"
          >{{ item.label }}</Option>
        </Select>
        <DatePicker
          type="date"
          placeholder="订单创建时间"
          style="width: 200px"
          class="searchBox1"
          placement="bottom-end"
          @on-change="orderDateChange"
          :value="orderTime"
        ></DatePicker>
      </div>
      <div class="boxList">
        <Input v-model="orderId" placeholder="订单编号" style="width: 200px" class="searchBox1" />
        <Input v-model="carId" placeholder="车牌号" style="width: 200px" class="searchBox1" />
      </div>
      <div class="boxList lastList">
        <Input v-model="carName" placeholder="司机" style="width: 200px" class="searchBox1" />
        <Input v-model="book_name" placeholder="乘车人" style="width: 200px" class="searchBox1" />
        <!-- <div class="btnBox searchBox1">
                    <Button type="primary" @click="search">搜索</Button>
                    <Button type="error" @click="clean">清空</Button>
        </div>-->
      </div>

      <div class="btnBox searchBox1">
        <Button type="primary" @click="search">搜索</Button>
        <Button type="error" @click="clean">清空</Button>
      </div>
    </div>
    <Table border :columns="columns12" :data="data6">
      <!-- <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template> -->
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">详情</Button>
        <Button type="error" size="small" @click="remove(index)">取消</Button>
      </template>
    </Table>
    <!-- 页码 -->
    <div class="page_box">
      <div class="page_left">
        共{{ total }}条记录 第{{ page }}/{{
        Math.ceil(total / pagesize)
        }}页
      </div>
      <div class="page_right">
        <Page :total="total" :page-size="pagesize" :current="page" @on-change="changePage" />
      </div>
    </div>
    <!-- 详情弹出框 -->
    <Modal v-model="modal1" title="订单详情" ok-text="关闭" cancel-text width="800" class="Modal">
      <div class="ModalBox">
        <div class="boxLine">
          <div class="boxList">
            <div class="listItem">
              <div style="white-space: nowrap;">订单号:</div>
              <div>{{detailInfo.order_sn}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">改签时间:</div>
              <div>{{detailInfo.change_ticket_time || ''}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">订单创建时间:</div>
              <div>{{detailInfo.created_at}}</div>
            </div>
          </div>
          <div class="boxList">
            <div class="listItem">
              <div style="white-space: nowrap;">订单状态:</div>
              <div>{{this.detailInfo.status}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">取消时间:</div>
              <div>{{detailInfo.cancel_time || detailInfo.refund_time || ''}}</div>
            </div>
          </div>
          <div class="boxList">
            <div class="listItem">
              <div style="white-space: nowrap;">支付状态:</div>
              <div>{{detailInfo.orderType}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">取消原因:</div>
              <div>{{detailInfo.cancel_reason}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ModalBox">
        <div class="boxLine">
          <div class="boxList">
            <div class="listItem">
              <div style="white-space: nowrap;">路线:</div>
              <div>{{detailInfo.from}}-{{detailInfo.to}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">预定人:</div>
              <div>{{detailInfo.name}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">司机:</div>
              <div>{{detailInfo.driver_name}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">上车地点:</div>
              <div>{{detailInfo.start_name}}</div>
            </div>
          </div>
          <div class="boxList">
            <div class="listItem">
              <div style="white-space: nowrap;">发车时间:</div>
              <div>{{detailInfo.ticket_time}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">电话:</div>
              <div>{{detailInfo.phone}}</div>
            </div>
            <div class="listItem" v-if="detailInfo.user">
              <div style="white-space: nowrap;">身份证号码:</div>
              <div>{{detailInfo.user.id_card_number}}</div>
            </div>

            <div class="listItem">
              <div style="white-space: nowrap;">车牌号:</div>
              <div>{{detailInfo.car_no}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">下车地点:</div>
              <div>{{detailInfo.end_name}}</div>
            </div>
          </div>
          <div class="boxList">
            <div class="listItem">
              <div style="white-space: nowrap;">预计接人时间:</div>
              <div>{{detailInfo.pick_up_time}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">乘车人数:</div>
              <div>{{detailInfo.adult_numbers}}人</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">备注:</div>
              <div>{{detailInfo.remark}}</div>
            </div>
            <div class="listItem">
              <div style="white-space: nowrap;">代金券:</div>
              <div>{{detailInfo.coupon_money/100}}元代金券</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ModalBox">
        <Table :columns="columns15" :data="data11" border></Table>
      </div>
    </Modal>
    <Button class="submitExcel" @click="subExcel">导出Excel</Button>
  </div>
</template>
<script>
import order from "./list.js";
export default order;
</script>

<style lang="less" scoped>
@import url("./list.less");
</style>



