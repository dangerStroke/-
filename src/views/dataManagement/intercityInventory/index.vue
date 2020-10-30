<template>
  <div class="intercityInventory_content">
    <div class="new_site">
      <div class="inputMsg">
        <DatePicker
          type="date"
          placeholder="发车日期"
          :options="options"
          style="width: 156px"
          @on-change="serachDepartureDate"
          v-model="serachDate"
         
        ></DatePicker>

        <Select v-model="one_way_route" style="width:200px" placeholder="搜索单程路线">
          <Option v-for="item in routeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="btns">
        <Button type="primary" @click="getCarList">搜索</Button>
        <Button type="error" @click="clearSerach">清空</Button>
      </div>
    </div>

    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="locking(row)">库存锁定</Button>
      </template>
    </Table>

    <!-- 库存锁定模态框 -->

    <div>
      <Modal v-model="modal1" title="库存锁定" @on-ok="makeSure" @on-cancel="cancel">
        <div class="modal_info" v-model="formLeft">
          <span style="margin-left:0px">{{formLeft.date}}</span>
          <span>{{formLeft.time}}</span>
          <span>{{formLeft.route}}</span>
          <span>{{formLeft.car_no}}</span>
        </div>
        <div class="modal_info">
          总座位数量:
          <span>{{formLeft.ridership}}</span>座
        </div>
        <div class="modal_info">
          畅游甘孜售出数量:
          <span>{{formLeft.order}}</span>座
        </div>
        <div class="modal_info" v-if="formLeft">
          需锁定座位数量:
          <InputNumber
            :max="formLeft.ticket_numbers"
            :min="0"
            v-model="formLeft.lock_numbers"
            style="width: 83px;margin-left:20px"
            @on-change="inputNum"
          ></InputNumber>
          <span style="font-size: 14px;">需锁定数量<=余票数量<=座位总数量</span>
        </div>
        <div class="modal_info">
          余票数量:
          <span>{{formLeft.ticket_numbers}}</span>座
        </div>
        <!-- <div slot="footer"></div> -->
      </Modal>
    </div>

    <!-- <div class="page_box">
      <div class="page_left">
        共{{ total }}条记录 第{{ page }}/{{
        Math.ceil(total / pagesize)
        }}页
      </div>
      <div class="page_right">
        <Page :total="total" :page-size="pagesize" :current="page" @on-change="changePage" />
      </div>
    </div>-->
  </div>
</template>

<script>
import intercityInventory from "./intercityInventory";
export default intercityInventory;
</script>
<style lang="less" scoped>
@import "./intercityInventory.less";
</style>