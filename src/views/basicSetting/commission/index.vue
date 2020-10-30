<template>
    <div class="commission_box">
            <p class="title">佣金比例配置</p>
        <div class="inner_box">
            <div class="cancle_single">
                <p class="title_p">自营无车司机：</p>
                <Input type="number" v-model="params.autotrophy_car_free" :disabled="type==='normal'" />
                <p>%</p>
            </div>
            <div class="cancle_single">
                <p  class="title_p">自营带车司机：</p>
                <Input type="number" v-model="params.autotrophy_have_car" :disabled="type==='normal'"  />
                <p>%</p>
            </div>
            <div class="cancle_single">
                <p  class="title_p">非自营带车司机：</p>
                <Input type="number" v-model="params.non_autotrophy"  :disabled="type==='normal'"  />
                <p>%</p>
            </div>
            <div class="btn_box">
                 <Button type="primary" v-if="type==='normal'" @click="showBtn('edit')" class="edit_btn" >修改</Button>
                 <Button type="primary" @click="saveCommission" v-if="type==='edit'">保存</Button>
                 <Button type="error" v-if="type==='edit'" @click="showBtn('normal')" class="edit_btn">取消</Button>
            </div>
        </div>
    </div>
</template>
<script>
import commission from "./commission"
export default commission
</script>
<style lang="less" scoped>
@import url("./commission.less");
</style>


