<template>

<div>
    <Table border :columns="columns" :data="dataList">
        <template slot-scope="{ row }" slot="action">
             <Button type="primary" @click="bindDetail(row)">修改</Button>
        </template>
    </Table>

     <Modal
        v-model="modal1"
        title="库存数量"
        @on-ok="ok"
        @on-cancel="cancel">
        <div> 数量：</div>
        <Input v-model="value" placeholder="" style="width: 300px" />
    </Modal>
</div>

</template>
<script>
import codeBus from "./codeBus";
export default codeBus;
</script>
<style lang="less" scoped>
@import "./codeBus.less";
</style>