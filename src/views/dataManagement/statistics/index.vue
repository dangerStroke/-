<template>
  <div class="content">
    <!-- <p>数据统计</p>
    <div class="main">

    <div id="registeredChart" :style="{width: '1000px', height: '600px'}"></div>

    </div>-->

    <!-- 用户数据 -->

    <div class="content_item">
      <div class="title">
        <div class="shu"></div>
        <h4>用户数据</h4>
      </div>

      <div class="item">
        <div class="item_one">
          <div class="icon">
            <Icon type="ios-person-add" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>注册人数（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="member.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="member.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="member.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="member.diff<0"></span>
              <span v-else></span>
              <span
                :style="{color:(member.diff>0?'#FF4B3B':member.diff==0?'#99999':'#25BF25'),'font-weight':'bold'}"
              >{{member.diff}}</span>
            </div>
          </div>
          <div class="num">{{member.total}}</div>
        </div>

        <div class="item_one">
          <div class="icon">
            <Icon type="md-contacts" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>今日日活（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="active_member.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="active_member.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="active_member.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="active_member.diff<0"></span>
              <span v-else></span>
              <span
                :style="{color:active_member.diff>0?'#FF4B3B':active_member.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{active_member.diff}}</span>
            </div>
          </div>
          <div class="num">{{active_member.total}}</div>
        </div>

        <div class="item_one">
          <div class="icon" style="background-color:#5BC0FF">
            <Icon type="md-body" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>实名认证（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="real_mem.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="real_mem.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="real_mem.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="real_mem.diff<0"></span>
              <span v-else></span>
              <span
                :style="{color:(real_mem.diff>0?'#FF4B3B':real_mem.diff==0?'#99999':'#25BF25'),'font-weight':'bold'}"
              >{{real_mem.diff}}</span>
            </div>
          </div>
          <div class="num">{{real_mem.total}}</div>
        </div>

        <div class="item_one">
          <div class="icon" style="background-color:#FF0000">
            <Icon type="md-card" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>新人礼包领数（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="mem_activity.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="mem_activity.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="mem_activity.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="mem_activity.diff<0"></span>
              <span v-else></span>
              <span
                :style="{color:mem_activity.diff>0?'#FF4B3B':mem_activity.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{mem_activity.diff}}</span>
            </div>
          </div>
          <div class="num">{{mem_activity.total}}</div>
        </div>

        <div class="item_one">
          <div class="icon" style="background-color:#FF2D46">
            <Icon type="md-thumbs-up" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>推荐人数（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="recommend.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="recommend.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="recommend.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="recommend.diff<0"></span>
              <span v-else></span>
               <span
                :style="{color:recommend.diff>0?'#FF4B3B':recommend.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{recommend.diff}}</span>
            </div>
          </div>
          <div class="num">{{recommend.total}}</div>
        </div>

        <div class="item_one">
          <div class="icon" style="background-color:#FF5D61">
            <Icon type="md-checkbox" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>推荐成功人数（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="recommend_success.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="recommend_success.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="recommend_success.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="recommend_success.diff<0"></span>
              <span v-else></span>
                <span
                :style="{color:recommend_success.diff>0?'#FF4B3B':recommend_success.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{recommend_success.diff}}</span>
            </div>
          </div>
          <div class="num">{{recommend_success.total}}</div>
        </div>

        <div class="item_one">
          <div class="icon" style="background-color:#25BF25">
            <Icon type="md-medkit" style="font-size:20px;color:#fff" />
          </div>
          <div class="info">
            <p>防疫认证人数（人）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="hero_member.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="hero_member.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="hero_member.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="hero_member.diff<0"></span>
              <span v-else></span>
               <span
                :style="{color:hero_member.diff>0?'#FF4B3B':hero_member.diff===0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{hero_member.diff}}</span>
            </div>
          </div>
          <div class="num">{{hero_member.total}}</div>
        </div>
      </div>
    </div>

    <!-- 注册人数增长 -->
    <div class="content_item">
      <div class="title">
        <div class="shu"></div>
        <h4>注册人数增长</h4>
      </div>
      <!-- 折线图 -->
      <div class="main">
        <div id="registeredChart" class="minw"></div>
      </div>
    </div>

    <!-- 用户分析 -->
    <div class="content_item">
      <div class="title">
        <div class="shu"></div>
        <h4>用户分析</h4>
      </div>

      <!-- 饼状图 -->
      <div class="pie_chart">
        <!-- 年龄饼状图 -->
        <div class="pie_chart_item">
          <div id="agePieChart" :style="{width: '400px', height: '250px'}"></div>
        </div>

        <!-- 性别饼状图 -->
        <div class="pie_chart_item">
          <div id="genderPieChart" :style="{width: '400px', height: '250px'}"></div>
        </div>

        <!-- 地区占比 -->
        <div class="pie_chart_item">
          <div id="areaPieChart" :style="{width: '400px', height: '250px'}"></div>
        </div>
      </div>
    </div>

    <!-- 订单数据 -->
    <div class="content_item">
      <div class="title">
        <div class="shu"></div>
        <h4>订单数据</h4>
      </div>

      <div class="item">
        <div class="item_one_shu"></div>
        <div class="item_one item_order">
          <div class="info">
            <p>总订单数（单）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="order.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="order.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="order.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="order.diff<0"></span>
              <span v-else></span>
                 <span
                :style="{color:order.diff>0?'#FF4B3B':order.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{order.diff}}</span>
            </div>
          </div>
          <div class="num">{{order.total}}</div>
        </div>

        <div class="item_one_shu" style="background-color:#FF8B32"></div>
        <div class="item_one item_order">
          <div class="info">
            <p>本月订单数（单）</p>
            <div>
              <span class="litle">比上月</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="month_order.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="month_order.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="month_order.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="month_order.diff<0"></span>
              <span v-else></span>
              <span
                :style="{color:month_order.diff>0?'#FF4B3B':month_order.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{month_order.diff}}</span>
            </div>
          </div>
          <div class="num">{{month_order.total}}</div>
        </div>

        <div class="item_one_shu" style="background-color:#FF4B3B"></div>
        <div class="item_one item_order">
          <div class="info">
            <p>本月取消订单数（单）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="cancel_order.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="cancel_order.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="cancel_order.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="cancel_order.diff<0"></span>
              <span v-else></span>
              <span
                :style="{color:cancel_order.diff>0?'#FF4B3B':cancel_order.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{cancel_order.diff}}</span>
            </div>
          </div>
          <div class="num">{{cancel_order.total}}</div>
        </div>

        <div class="item_one_shu" style="background-color:#25BF25"></div>
        <div class="item_one item_order">
          <div class="info">
            <p>今日订单数（单）</p>
            <div>
              <span class="litle">比昨日</span>
              <Icon
                type="md-trending-up"
                style="font-size:16px;margin-right:5px;color:red"
                v-if="today_order.diff>0"
              />
              <Icon
                type="md-trending-down"
                style="font-size:16px;margin-right:5px;color:#19be6b"
                v-else-if="today_order.diff<0"
              />
              <Icon type="md-swap" style="font-size:16px;margin-right:5px;color:#18AFFF" v-else />
              <span v-if="today_order.diff>0" style="font-weight:bold;color:#FF4B3B">+</span>
              <span v-else-if="today_order.diff<0"></span>
              <span v-else></span>
                <span
                :style="{color:today_order.diff>0?'#FF4B3B':today_order.diff==0?'#99999':'#25BF25','font-weight':'bold'}"
              >{{today_order.diff}}</span>
            </div>
          </div>
          <div class="num">{{today_order.total}}</div>
        </div>

        <!-- 订单总数增长折线图 -->
        <div class="content_item">
          <div class="title" style="margin-top:40px">
            <div class="shu"></div>
            <h4>订单总数增长</h4>
          </div>
          <div class="chart">
            <!-- 不能id相同 -->
            <div id="totalOrdersChart" class="aa"></div>
          </div>
        </div>

        <!-- 取消原因柱状图 -->
        <div class="content_item">
          <div class="title" style="margin-top:40px">
            <div class="shu"></div>
            <h4>取消原因统计</h4>
          </div>
          <div class="chart">
            <!-- 不能id相同 -->
            <div id="cancelReasonChart" class="aa"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import statistics from "./statistics.js";
export default statistics;
</script>
<style lang="less" scoped>
@import "./statistics.less";
</style>