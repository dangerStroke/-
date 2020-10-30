<template>
  <div class="content">
    <p>推荐有礼活动配置</p>
    <div class="main">
      <div class="main_item">
        <span>活动日期:</span>
        <DatePicker
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期"
          style="width: 300px"
          @on-ok="selectTime(timevalue)"
          :confirm="true"
          v-model="timevalue"
          :disabled="isDisabled"
          :clearable="false"
          @on-clear="clearTime"
        ></DatePicker>
      </div>

      <div class="main_item">
        <span>发放人群:</span>
        <b>推荐成功（凡每次推荐新用户注册并30天内下单的用户）</b>
      </div>

      <div class="main_item checkboxcss">
        <span>优惠礼包:</span>

        <h2 style="padding-left:70px" v-if="packList.length<=0">暂无上架礼包，请先上架礼包再配置活动</h2>

        <CheckboxGroup v-model="selectPack" v-else>
          <Checkbox
            v-for="(item,index) in packList"
            :key="item.id"
            :disabled="isDisabled"
            :label="item.id"
          >
            优惠卷编号<b>{{ item.id }}</b>,面值<b>{{ item.money }}</b>(分)
            <Input
              type="number"
              maxlength="1"
              placeholder="券数量"
              class="coupon_num"
              :disabled="isDisabled"
              v-model="item.numbers"
            ></Input>
          </Checkbox>
        </CheckboxGroup>
      </div>

      <div class="main_item main_item_btn">
        <Button type="primary" @click="editPack" v-if="isDataNull?false:true && idEdit?false:true" style="float:left">添加推荐有礼活动</Button>
        <Button type="primary" @click="editPack" v-if="isDataNull?true:false && idEdit?true:false">修改</Button>

        <div v-else>
          <Button type="error" @click="cancel">取消</Button>
          <Button type="primary" @click="sureEditPack">保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recommend from "./recommend.js";
export default recommend;
</script>
<style lang="less" scoped>
@import "./recommend.less";
</style>