<template>
  <div class="merChant">
    <div class="new_site">
      <div class="inputMsg">
        <Input type="text" v-model="name" placeholder="商家名称" style="width:120px;margin-right:20px" />
      </div>
      <div class="btns">
        <Button type="primary" @click="getMerChantList">搜索</Button>
        <Button type="error" @click="clearSerach">清空</Button>
        <Button type="primary" class="newBtn" @click="newSite('new')">
          <Icon type="md-add" />新建
        </Button>
      </div>
    </div>

    <!-- table -->
    <Table :columns="columns1" :data="data1" border>

      <template slot-scope="{ row, index }" slot="qr_code">
        <div style="padding:10px 0">
          <img :src="row.qr_code" alt="" style="width:100px;height:100px">
        </div>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="newSite('edit',row)"
        >修改</Button>
        <Button type="error" size="small" @click="remove(row.id,index)">删除</Button>
      </template>
    </Table>

    <!-- 新建或者修改的模态框 -->
    <Modal v-model="newSiteModal" :title="title" >
      <Form :model="formItem" :label-width="80">
        <FormItem label="商家名称" required>
          <Input v-model="formItem.name" placeholder="输入商家名称"></Input>
        </FormItem>

        <FormItem label="地址">
          <Input v-model="formItem.address" placeholder="输入商家地址"></Input>
        </FormItem>

        <FormItem label="负责人">
          <Input v-model="formItem.user_name" placeholder="输入负责人"></Input>
        </FormItem>

        <FormItem label="联系电话">
          <Input v-model="formItem.phone" placeholder="输入联系电话"></Input>
        </FormItem>

        <FormItem label="商家性质">
          <Input v-model="formItem.nature" placeholder="输入商家性质"></Input>
        </FormItem>

        <FormItem label="每单佣金(元)">
          <Input v-model="formItem.commission" placeholder="输入每单佣金"></Input>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="infoSure">确定</Button>
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
import merChant from "./merChant.js";
export default merChant;
</script>
<style lang="less" scoped>
@import url("./merChant.less");
</style>