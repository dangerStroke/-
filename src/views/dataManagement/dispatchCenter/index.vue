<template>
  <!-- 有内容 -->
  <div class="dispatchCenter" v-if="isExport">
    <div class="title">
      <div class="shu"></div>
      <h4>今日待出行订单 ({{currentDate}})</h4>
    </div>

    <div class="select_route">
      <div class="select_item">
        <Select
          v-model="model1"
          style="width:150px"
          @on-change="routeClassChange"
          :label-in-value="true"
        >
          <Option v-for="item in routeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="people_num">
        已完成：
        <span>
          <b>{{success_number}}</b>单
        </span>
      </div>
      <div class="people_num">
        待出行：
        <span>
          <b>{{wait_number}}</b>单
        </span>
      </div>
    </div>

    <div class="route_time">
      <!--  点击加上背景为白色 .click_bg -->

      <div v-if="classData.length > 0" style="display: flex; align-items: center;">
        <div
          :class="['route_time_item', {'click_bg':index==clickIndex}]"
          @click="clickRouteTime(index,item)"
          v-for="(item,index) in classData"
          :key="index"
        >
          <div>
            <p>{{item.route}}</p>
            <p>{{item.time}}</p>
          </div>
          <div class="order_num">{{item.number}}</div>
        </div>
      </div>

      <div v-else class="route_time_item">暂无班次信息</div>
    </div>

    <div class="btns">
      <Button @click="refresh">刷新</Button>
      <Button type="primary" @click="exportImg">导出</Button>
    </div>

    <!-- table表 -->
    <Table :columns="columns1" :data="data1" border>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" @click="show(row)">详情</Button>
        <Button type="error" size="small" @click="remove(index,row)">取消</Button>
      </template>
    </Table>

    <!-- 详情模态框 -->
    <Modal v-model="detailInfoModal" title="订单详情" ok-text="关闭" cancel-text width="800">
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
              <div>{{detailInfo.status}}</div>
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
  </div>

  <!-- 导出内容 -->
  <div v-else class="export_class">
    <div ref="pic">
      <div class="title_info">
        <div class="info_item">
          <p>发车时间：{{exportInfo.ticket_time}}</p>
          <p>预计接人：{{exportInfo.pick_up_time}}</p>
        </div>

        <div class="info_item">
          <p>司机：{{exportInfo.driver_name}}</p>
          <p style="margin-left:110px">线路：{{exportInfo.route}}</p>
        </div>

        <div class="info_item">车辆：{{exportInfo.car_no}}</div>
      </div>
      <!-- table表 -->
      <Table :columns="columns2" :data="data2" border>
      
      </Table>
    </div>

    <div class="export_btn" @click="exportPic('pic')">导出</div>
  </div>
</template>

<script>
import dispatchCenter from "./dispatchCenter";
export default dispatchCenter;
</script>
<style lang="less" scoped>
@import "./dispatchCenter.less";
</style>