<template>
  <div class="userCoupon">
    <Button type="primary" class="btn" @click="toVounder">发券</Button>

    <Table border :columns="columns12" :data="data6">
      <template slot-scope="{ row }" slot="name">{{row.money/100}}元优惠券</template>
      <template slot-scope="{ row }" slot="status">
        <div v-if="row.status == 1 && row.is_use == 1">已使用</div>
        <div v-if="row.status == 1 && row.is_use == 0">已过期</div>
        <div v-if="row.status == 0">未使用</div>
        <div v-if="row.status == 2">上架</div>
      </template>
    </Table>
  </div>
</template>

<script>
import userCoupon from "./userCoupon";
export default userCoupon;
</script>
<style lang="less" scoped>
@import url("./userCoupon.less");
</style>