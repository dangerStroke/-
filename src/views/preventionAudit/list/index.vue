<template>
  <div class="wrap">
    <Table border :columns="columns12" :data="data">
      <!-- 照片 -->
      <template slot-scope="{ row }" slot="auth_img">
        <img :src="row.auth_img" alt style="margin-top:4px;cursor:pointer;width:120px;height:100px" />
        <p
          style="font-size:12px;color:#18AFFF;cursor:pointer"
          @click="handleView(row.auth_img)"
        >查看大图</p>
      </template>

      <!-- 状态 -->
      <template slot-scope="{ row }" slot="status">
        <strong v-if="row.status == 0">待认证</strong>
        <strong v-else-if="row.status == 1">认证失败</strong>
        <strong v-else-if="row.status == 2">认证成功</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action" style="width:200px">
        <Button type="primary" size="small" style="margin-right: 5px" @click="detail(row)">详情</Button>
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="pass(row)"
          v-if="row.status == 0 || row.status == 1"
        >通过</Button>
        <Button
          type="error"
          size="small"
          @click="refuse(row)"
          v-if="row.status == 0 || row.status == 1"
        >拒绝</Button>
      </template>
    </Table>
    <!-- 查看大图 -->
    <Modal title="工作证照片" v-model="visible1"  width="700px" > 
        <img :src="bigImgUrl" v-if="visible1" style="width:600px;height:600px" ref="rotate"/>
         <Button type="primary" @click="rotate">旋转</Button>
        <div slot="footer"></div>
    </Modal>
    <!-- 详情弹窗 -->
    <div>
      <Modal v-model="modal1" title="医护人员详情">
        <Form :model="formLeft" label-position="left" :label-width="100">
          <FormItem label="姓名">
            <Input v-model="formLeft.name" disabled></Input>
          </FormItem>
          <FormItem label="职业">
            <Input v-model="formLeft.job" disabled></Input>
          </FormItem>
          <FormItem label="工作单位全称">
            <Input v-model="formLeft.work_unit" disabled></Input>
          </FormItem>
          <FormItem label="工作证照片">
            <!-- <Input v-model="formLeft.auth_img"></Input> -->
            <img :src="formLeft.auth_img" alt class="detailImg" style="width: 150px; height: 120px;"/>
          </FormItem>
          <FormItem label="状态">
            <!-- <Input v-model="formLeft.status"></Input> -->
            <strong v-if="formLeft.status == 0">待认证</strong>
            <strong v-else-if="formLeft.status == 1">认证失败</strong>
            <strong v-else-if="formLeft.status == 2">认证成功</strong>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
    </div>
    <div class="page_box">
      <div class="page_left">
        共{{ total }}条记录 第{{ page }}/{{
        Math.ceil(total / page_size)
        }}页
      </div>
      <div class="page_right">
        <Page :total="total" :page-size="page_size" :current="page" @on-change="changePage" />
      </div>
    </div>
  </div>
</template>


<script>
import list from "./list";
export default list;
</script>

<style lang="less" scoped>
@import "./list.less";
</style>
   



