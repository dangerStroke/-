<template>
    <div class="change_box">
         <!-- <div class="search_box" v-if="data.length === 0">
             <Button type="primary" class="add_btn" ><Icon type="md-add" />新建</Button>
         </div> -->
        <Table border :columns="columns" :data="data">
             <template slot-scope="{ row,index }" slot="time">
                 <div class="input_box">
                     <p>发车</p>
                     <p class="change_time" v-if="row.type === 'normal'">{{row.timeStr}}</p>
                     <Input type="number" :value="row.inputValue" placeholder="请填写改签时间"  style="width: 200px"  v-if="row.type==='edit'" @on-change="inputChange($event,row,index)" />
                     <!-- <Input type="text" placeholder="请填写改签时间"  v-model="row.inputValue" @on-change="inputChange($event,row,index)" /> -->
                     <p>小时之前可以改签</p>
                 </div>
            </template>
             <template slot-scope="{ row,index }" slot="action">
                <Button type="primary" v-if="row.type === 'normal'" @click="bindEdit(row,index,'edit')">修改</Button>
                <Button type="primary" v-if="row.type === 'edit'" @click="submitEdit">保存</Button>
                <Button type="error" v-if="row.type === 'edit'" @click="bindEdit(row,index,'cancle')">取消</Button>
            </template>
         </Table>
    </div>
</template>
<script>
import changeRule from "./changeRule"
export default changeRule
</script>
<style lang="less" scoped>
@import url("./changeRule.less");
</style>