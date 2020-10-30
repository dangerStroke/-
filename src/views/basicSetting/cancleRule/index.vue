<template>
    <div class="cancle_box">
        <div class="inner_box">
            <div class="cancle_single">
                <p>免费取消：发车</p>
                <Input type="number" :disabled="type==='normal'"  v-model="ruleInfo.free"/>
                <p>小时之内可免费取消</p>
            </div>
            <div class="cancle_single">
                <p>扣费取消：发车</p>
                <Input type="number" :disabled="type==='normal'" v-model="ruleInfo.fee.small" />
                <p>~</p>
                <Input type="number"  :disabled="type==='normal'" v-model="ruleInfo.fee.big" />
                <p>小时之内扣费取消</p>
            </div>
            <div class="cancle_single">
                <p>不可取消：发车</p>
                <Input type="number" :disabled="type==='normal'" v-model="ruleInfo.not" />
                <p>小时之内不可取消</p>
            </div>
            <div class="btn_box">
                 <Button type="primary" v-if="type==='normal'" @click="showBtn('edit')">修改</Button>
                 <Button type="primary" @click="savaCancleRule" v-if="type==='edit'">保存</Button>
                 <Button type="error" v-if="type==='edit'" @click="showBtn('normal')">取消</Button>
            </div>
        </div>
    </div>
</template>
<script>
import cancleRule from "./cancleRule"
export default cancleRule
</script>
<style lang="less" scoped>
@import url("./cancleRule.less");
</style>


