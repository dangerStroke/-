<template>
  <div class="orderHistory">
    <Table border :columns="columns12" :data="data6">
      <!-- 订单类型 -->
      <template slot-scope="{ row, index }" slot="type">
        <div v-if="row.type == 1">城际接送</div>
        <div v-if="row.type == 2">司乘快客</div>
      </template>

      <!-- 线路 -->
      <template slot-scope="{ row, index }" slot="route">
        <div>{{row.from}}->{{row.to}}</div>
      </template>

      <!-- 订单金额 -->
      <template slot-scope="{ row, index }" slot="price_pay">
        <div>{{row.price_pay/100}}元</div>
      </template>
    </Table>
  </div>
</template>

<script>
import orderHistory from "./orderHistory";
export default orderHistory;
</script>
<style lang="less" scoped>
@import url("./orderHistory.less");
</style>