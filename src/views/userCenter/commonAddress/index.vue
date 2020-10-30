<template>
  <div class="commonAddress">
    <Table border :columns="columns12" :data="data6">
      <template slot-scope="{ row, index }" slot="address">{{row.district}}{{row.name}}</template>

    </Table>
  </div>
</template>

<script>
import commonAddress from './commonAddress'
export default commonAddress;
</script>
<style lang="less" scoped>
@import url('./commonAddress.less');
</style>