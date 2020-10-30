<template>
  <div class="content">
    <p>新人礼包活动配置</p>
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
        <b>新人（凡首次注册的微信号及手机号用户）</b>
      </div>

      <div class="main_item checkboxcss" style="font-size:12px">
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
        <Button type="primary" @click="editPack" v-if="isDataNull?false:true && idEdit?false:true" style="float:left">添加新人活动</Button>
        <Button type="primary" @click="editPack" v-if="isDataNull?true:false && idEdit?true:false ">修改</Button>

        <div v-else>
          <Button type="error" @click="cancel">取消</Button>
          <Button type="primary" @click="sureEditPack">保存</Button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import newcomerPack from "./newcomerPack.js";
export default newcomerPack;
</script>
<style lang="less" scoped>
@import "./newcomerPack.less";
</style>