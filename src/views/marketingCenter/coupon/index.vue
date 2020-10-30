<template>
  <div>
    <div class="new_site">
      <div class="inputMsg">
        <Select v-model="queryParams.status" style="width:150px" placeholder="状态">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Select v-model="queryParams.route_id" style="width:150px" placeholder="可用路线">
          <Option v-for="item in routeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <div class="btns">
          <Button type="error" @click="clearSerach">清空</Button>
          <Button type="primary" @click="getTableData">搜索</Button>
        </div>
      </div>
      <Button type="primary" @click="newSite">
        <Icon type="md-add" />新建
      </Button>
    </div>

    <Table border :columns="columns12" :data="data6">
      <!-- 状态 -->
      <template slot-scope="{ row, index }" slot="status">
        <div v-if="row.status == 1">未上架</div>
        <div v-if="row.status == 2">上架</div>
        <div v-if="row.status == 3">已下架</div>
        <!-- <div v-if="row.status == 4">删除</div> -->
      </template>

      <!-- 限用线路 -->
      <template slot-scope="{ row, index }" slot="route_id">
        <div v-for="item in routeList" :value="item.value" :key="item.value">
          <div v-if="row.route_id == item.value">{{ item.label }}</div>
        </div>
      </template>
      <!-- 数量 -->
      <template slot-scope="{ row, index }" slot="is_limit">
        <div v-if="row.is_limit === 0">{{row.numbers}}</div>
        <div v-if="row.is_limit === 1">不限量</div>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="newSite(row)"
          v-if="row.status == 1 || row.status == 3"
        >修改</Button>
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="changeStatus(row,'onPutSelf')"
          v-if="row.status == 1 || row.status == 3"
        >上架</Button>
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="changeStatus(row,'offSelf')"
          v-if="row.status == 2"
        >下架</Button>
        <Button type="error" size="small" @click="changeStatus(row,'delete',index)" v-if="row.status == 1 || row.status == 3">删除</Button>
      </template>
    </Table>

    <!-- 新建或者修改的模态框 -->
    <Modal v-model="modal" :title="modalTitle" :mask-closable="false" :closable="false">
      <Form :model="formLeft" label-position="left" :label-width="100" ref="formLeft">
         <FormItem label="优惠卷编号" prop="id" v-if="formLeft.id">
          <Input v-model="formLeft.id" style="width:200px" disabled></Input>
        </FormItem>

        <FormItem label="金额(分)" prop="money" required>
          <Input v-model="formLeft.money" maxlength="4" style="width:200px"></Input>
        </FormItem>

        <FormItem label="有效天数" prop="validity_day" required>
          <div>
            <span>领券当日开始</span>
            <Input v-model="formLeft.validity_day" maxlength="4" style="width:100px"></Input>
            <span>天内有效</span>
          </div>
        </FormItem>

        <FormItem label="发放数量" prop="is_limit" required>
          <RadioGroup v-model="formLeft.is_limit">
            <Radio label="0">
              限量
              <Input
                v-model="formLeft.numbers"
                maxlength="4"
                style="width:100px"
                placeholder="限量数量"
                v-if="formLeft.is_limit === '0'"
              ></Input>
            </Radio>
            <Radio label="1">不限量</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="限用路线" prop="route_id" required>
          <Select v-model="formLeft.route_id" style="width:150px" placeholder="限用路线">
            <Option v-for="item in routeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Input v-model="formLeft.remark" maxlength="100" type="textarea"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel(modalTitle)">取消</Button>
        <Button type="primary" size="large" @click="infoSure(modalTitle)">确定</Button>
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
import coupon from "./coupon.js";
export default coupon;
</script>
<style lang="less" scoped>
@import "./coupon.less";
</style>