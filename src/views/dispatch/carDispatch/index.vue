<template>
  <div>
      <div class="head">
          <div class="inputBox">
            <Select v-model="car_id" style="width:200px" :placeholder='carName' :label-in-value="true" @on-change="platenoChange">
                <Option v-for="item in carList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="inputBox">
            <Col span="12">
              <DatePicker type="date" placeholder="开始时间" style="width: 200px" :value="stime"  @on-change="timeChange('stime',$event)"></DatePicker>
            </Col>
          </div>
          <div class="inputBox">
            <Col span="12">
              <DatePicker type="date" placeholder="结束时间" style="width: 200px" :value="etime"  @on-change="timeChange('etime',$event)"></DatePicker>
            </Col>
          </div>
          <div class="inputBox">
             <Button type="primary" @click="getcarInfo">搜索</Button>
          </div>
          <div class="inputBox">
             <Button type="error" @click="eliminate">清除</Button>
          </div>
          <div class="inputBox">
             <Button type="primary" @click="modifyOrder">分配订单</Button>
          </div>
      </div>
      <div class="tableBox">
        <Table border="" :columns="columns" :data="listData">
          <template slot="action" slot-scope="{ row }" >
              <Button type="primary" @click="chengeOrder(row)">修改订单</Button>
              <Button type="error" @click="cancelOrder(row)">撤销订单</Button>
          </template>
          <template slot-scope="{ row }" slot="status">   	
            <div class="img_box" v-if="row.order_status == 1">
              待支付
            </div>
            <div class="img_box" v-if="row.order_status == 2">
              待出行
            </div>
            <div class="img_box" v-if="row.order_status == 3">
              已取消
            </div>
            <div class="img_box" v-if="row.order_status == 4">
              支付失败
            </div>
            <div class="img_box" v-if="row.order_status == 5">
              已完成
            </div>
            <div class="img_box" v-if="row.order_status == 6">
              已评价
            </div>
            <div class="img_box" v-if="row.order_status == 7">
              已退款
            </div>
            <div class="img_box" v-if="row.order_status == 8">
              退款中
            </div>
            <div class="img_box" v-if="row.order_status == 9">
              进行中
            </div>
            <div class="img_box" v-if="row.order_status == 10">
              待审核
            </div>
          </template>
           <template slot="orderPrice" slot-scope="{ row }" >
             <div>{{row.deposit+row.remaining}}</div>
          </template>
        </Table>
      </div>
      <div class="driver_model">
         <Modal
            v-model="showDetail"
            :transfer="false"
            :mask-closable="false"
            :closable="false"
            title="分配订单">
            <Form :model="formLeft" label-position="left" :label-width="100" ref="formLeft">
                <FormItem label="车辆品牌:" prop="plate_model">
                  <div>{{brandList[orderDetail.brand_id]}}</div>
                </FormItem>
                <FormItem label="车牌号:" prop="plate_no">
                  <div>{{orderDetail.plate_no}}</div>
                </FormItem>
                <FormItem label="关联订单号:" prop="order_sn" >
                 <Input v-model="formLeft.order_sn" maxlength="50" placeholder="请输入关联订单号"></Input>
                </FormItem>
                <FormItem label="订单状态:" prop="order_status" required :show-message="false">
                    <Select v-model="formLeft.order_status" style="width:200px" @on-change="timeChange('formLeft.order_status',$event)" :placeholder="formLeft.statusName">
                      <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="订单类型:" prop="order_type" >
                 <Input v-model="formLeft.order_type" maxlength="20" placeholder="请输入订单类型"></Input>
                </FormItem>
                <FormItem label="定金:" prop="deposit" >
                 <Input v-model="formLeft.deposit" maxlength="20" placeholder="请输入定金"></Input>
                </FormItem>
                <FormItem label="定金支付时间:" prop="deposit_time" >
                 <Col span="12">
                     <DatePicker type="date" placeholder="请选择支付时间" style="width: 200px" :value="formLeft.deposit_time"  @on-change="timeChange('formLeft.deposit_time',$event)"></DatePicker>
                  </Col>
                </FormItem>
                <FormItem label="尾款:" prop="remaining" >
                 <Input v-model="formLeft.remaining" maxlength="20" placeholder="请输入尾款"></Input>
                </FormItem>
                <FormItem label="尾款支付时间:" prop="remaining_time" >
                 <Col span="12">
                     <DatePicker type="date" placeholder="请选择支付时间" style="width: 200px" :value="formLeft.remaining_time" @on-change="timeChange('formLeft.remaining_time',$event)"></DatePicker>
                  </Col>
                </FormItem>
                <FormItem label="出发日:" prop="stime" required :show-message="false">
                  <Col span="12">
                     <DatePicker type="date" placeholder="选择出发日期" style="width: 200px" :value="formLeft.stime" @on-change="timeChange('formLeft.stime',$event)"></DatePicker>
                  </Col>
                </FormItem>
                <FormItem label="到达日:" prop="etime" required :show-message="false">
                  <Col span="12">
                     <DatePicker type="date" placeholder="选择到达日期" style="width: 200px" :value="formLeft.etime" @on-change="timeChange('formLeft.etime',$event)"></DatePicker>
                  </Col>
                </FormItem>
                <FormItem label="出发地:" prop="plate_no" required :show-message="false">
                   <Input v-model="formLeft.slocation" maxlength="20" placeholder="请输入出发地"></Input>
                </FormItem>
                <FormItem label="目的地:" prop="plate_no" required :show-message="false">
                   <Input v-model="formLeft.elocation" maxlength="20" placeholder="请输入目的地"></Input>
                </FormItem>
                <FormItem label="出发公里数:" prop="sdistance" >
                   <Input v-model="formLeft.sdistance" maxlength="20" placeholder="请输入公里数"></Input>
                </FormItem>
                <FormItem label="到达公里数:" prop="edistance" >
                   <Input v-model="formLeft.edistance" maxlength="20" placeholder="请输入公里数"></Input>
                </FormItem>
                <FormItem label="司机:" prop="plate_no" >
                    <Select v-model="formLeft.driver_id" style="width:200px" :placeholder="formLeft.driverName">
                      <Option v-for="item in driverList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="乘客数:" prop="passenger_nums" required :show-message="false">
                   <Input v-model="formLeft.passenger_nums" maxlength="20" placeholder="请输入乘客数"></Input>
                </FormItem>
                <FormItem label="乘客电话:" prop="phone" :show-message="false">
                   <Input v-model="formLeft.phone" maxlength="20"  placeholder="请输入乘客电话"></Input>
                </FormItem>
                <FormItem label="乘客身份证:" prop="id_card_num" :show-message="false">
                   <Input v-model="formLeft.id_card_num" maxlength="20" placeholder="请输入乘客身份证"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" size="large" @click="cancel">取消</Button>
              <Button type="primary" size="large" @click="distributionOrder">确定</Button>
            </div>
        </Modal>     
      </div> 
      <Button class="submitExcel" @click="subExcel">导出Excel</Button>
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
      <Modal  class="detail_modal"
            v-model="showCar"
            :mask-closable="false"
            :closable="false"
            title="选择需要分配的车辆"
            width="780"
            ok-text="取消"
            cancel-text="">
        <div>{{stime}}~{{etime}}</div>
        <Table border="" :columns="column2" :data="carData">
          <template slot-scope="{ row }" slot="brand">
            <div>{{brandList[row.brand_id]}}</div>
          </template>
          <template slot-scope="{ row }" slot="action">
             <Button type="primary" @click="chooseCar(row)">选择</Button>
          </template>
        </Table>
      </Modal>     
       <Modal
            class="delete_box"
            v-model="showModal"
            :mask-closable="false"
            :closable="false"
            width="400"
        >
            <div class="content">
                <p>您确定要撤销选中的订单吗？</p>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="modalChange">取消</Button>
                <Button type="primary" @click="bindConfirm">确定</Button>
            </div>
        </Modal> 
      
      <full-calendar  
        :config="config" 
        :events="events"
        ref="calendar" 
        >
      </full-calendar> 
  </div>
</template>

<script>
import carDispatch from "./carDispatch";
export default carDispatch;
</script>

<style lang="less" scoped>
@import "./carDispatch.less";
</style>