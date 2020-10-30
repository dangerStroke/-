<template>
  <div class="userCenter">
    <div class="new_site">
      <div class="inputMsg">
        <Input type="text" v-model="username" placeholder="用户姓名" style="width:120px;margin-right:20px" />
        <Input
          v-model="phone"
          placeholder="手机号码"
          style="width:120px;margin-right:20px"
        />
        <Input type="number" v-model="id" placeholder="用户编号" style="width:120px;margin-right:20px" />
        <Select v-model="reg_type" style="width:120px" placeholder="注册途径" @on-change="selectRegistrationRoute" >
          <Option
            v-for="item in registrationRouteList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
      <div class="btns">
        <Button type="primary" @click="getUserList">搜索</Button>
        <Button type="error" @click="clearSerach">清空</Button>
      </div>
    </div>

    <Table :columns="columns1" :data="data1" border>
      <template slot-scope="{ row, index }" slot="name">{{row.username}}({{row.nickname}})</template>

      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="detail(row)">详情</Button>
        <Button type="success" size="small" @click="voucher(row)">发券</Button>
      </template>
    </Table>

    <!-- 发券modal -->
    <Modal v-model="voucherModal" title="发券" :styles="{width:'800px'}">
      <div v-model="voucherItem">
        <h2>{{voucherName}}</h2>
        <div style="margin-top:10px">
          <Table :columns="columns2" :data="data2" border @on-selection-change="select">
            <template slot-scope="{ row }" slot="name">{{row.money/100}}元优惠券</template>
          </Table>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="voucherCancel">取消</Button>
        <Button type="primary" size="large" @click="voucherOk">赠送</Button>
      </div>
    </Modal>

    <!-- 详情modal -->
    <Modal
      v-model="detailModal"
      title="用户信息"
      :styles="{width:'1000px'}"
      @on-cancel="detailCancel"
      @on-ok="detailCancel"
    >
      <div class="head" v-model="detailInfo">
        <div class="avatar">
          <img :src="detailInfo.avatar_image" alt />
        </div>
        <div class="info">
          <div class="name">{{detailInfo.username}}({{detailInfo.nickname}})</div>
          <div class="info_detail">
            <div>
              用户编号:
              <span>{{detailInfo.id}}</span>
            </div>
            <div class="padleft">
              手机号码:
              <span>{{detailInfo.phone}}</span>
            </div>
            <div class="padleft">
              身份证号:
              <span>{{detailInfo.id_card_number}}</span>
            </div>
            <div class="padleft">
              生日:
              <span>{{detailInfo.birthday}}</span>
            </div>
            <div class="padleft">
              所属区域:
              <span>{{detailInfo.province}}{{detailInfo.city}}</span>
            </div>
            <div class="padleft">
              注册日期:
              <span>{{detailInfo.created_at}}</span>
            </div>
            <div class="padleft" style="border-right: none;">
              注册途径:
              <span>{{detailInfo.reg_type_name}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal_center">
        <div class="center_item">
          <div class="title">消费次数(次)</div>
          <div>{{detailInfo.consume_times}}</div>
        </div>

        <div class="center_item">
          <div class="title">消费总金额(元)</div>
          <div>{{(Number(detailInfo.consume_sum) / 100).toFixed(2)}}</div>
        </div>

        <div class="center_item">
          <div class="title">最近消费日期</div>
          <div>{{detailInfo.last_pay_time}}</div>
        </div>

        <div class="center_item">
          <div class="title">推荐次数(次)</div>
          <div>{{detailInfo.recommend_times}}</div>
        </div>

        <div class="center_item">
          <div class="title">推荐成功人数(数)</div>
          <div>{{detailInfo.recommend_member}}</div>
        </div>

        <div class="center_item">
          <div class="title">推荐转换人数</div>
          <div>{{detailInfo.recommend_pay}}</div>
        </div>

        <div class="center_item">
          <div class="title">被推荐人</div>
          <div>{{detailInfo.recommend_uid}}</div>
        </div>
      </div>

      <!-- 跳转 -->
      <div class="tav_content">
        <ul class="tav_title" v-if="detailInfo.id">
          <li>
            <router-link
              :to="{name:'userCoupon',params:{id:detailInfo.id}}"
              tag="div"
              class="tag_item"
            >
              <span class="tab_link">优惠卷</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{name:'orderHistory',params:{id:detailInfo.id}}"
              tag="div"
              class="tag_item"
            >
              <span class="tab_link">订单记录</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{name:'commonAddress',params:{id:detailInfo.id}}"
              tag="div"
              class="tag_item"
            >
              <span class="tab_link">常用地址</span>
            </router-link>
          </li>
        </ul>
        <div class="route_class">
          <router-view></router-view>
        </div>
      </div>
    </Modal>

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
  </div>
</template>

<script>
import userCenter from "./userCenter";
export default userCenter;
</script>
<style lang="less" scoped>
@import url("./userCenter");
</style>