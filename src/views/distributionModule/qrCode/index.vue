<template>
  <div class="qrCode">
    <div class="new_site">
      <div class="btns">
        <Button type="primary" class="newBtn" @click="addQrCode">
          <Icon type="md-add" />添加二维码
        </Button>
      </div>
    </div>

    <Table :columns="columns1" :data="data1" border>
      <template slot-scope="{ row, index }" slot="image">
        <div class="pic" ref="pic">
          <img :src="row.image" alt ref="pic" v-if="row.image"/>
           <div v-else style="color:red">请先关联商家</div>
        </div>
      </template>

      <template slot-scope="{ row, index }" slot="business">
        <div v-if="row.business.business_name">{{row.business.business_name}}</div>
        <div v-else style="color:red">请先关联商家</div>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="downLoad(row)">下载</Button>
        <Button type="error" size="small" @click="linkMerchantClick(row.id)">关联商家</Button>
      </template>
    </Table>

    <!-- 添加二维码的弹窗 -->
    <Modal v-model="addQrCodeModal" title="添加二维码">
      <Form :label-width="80">
        <FormItem label="添加个数" required>
          <InputNumber :max="10" :min="1" v-model="addQrCodeNum"></InputNumber>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" size="large" @click="addQrCodeCancel">取消</Button>
        <Button type="primary" size="large" @click="addQrCodeClick">确定</Button>
      </div>
    </Modal>

    <!-- 关联商家的弹窗 -->
    <Modal v-model="linkMerchantModal" :title="`二维码编号:${linkMerchantTitle}`">
      <Form :label-width="80">
        <FormItem label="关联商家" required>
          <Select
            v-model="linkMerchant"
            style="width:120px"
            placeholder="关联商家"
            @on-change="selectLinkMerchant"
          >
            <Option v-for="item in linkMerchantList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" size="large" @click="linkMerchantCancel">取消</Button>
        <Button type="primary" size="large" @click="linkMerchantSure">确定</Button>
      </div>
    </Modal>
    <div class="page_box">
      <div class="page_left">
        共{{ total }}条记录 第{{ page }}/{{
        Math.ceil(total / pagesize)
        }}页
      </div>
      <div class="page_right">
        <Page :total="total" :page-size="pagesize" :current="page" @on-change="changePage" />
      </div>
    </div>
  </div>
</template>

<script>
import qrCode from "./qrCode.js";
export default qrCode;
</script>
<style lang="less" scoped>
@import url("./qrCode.less");
</style>