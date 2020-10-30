<template>
  <div>
    <div class="new_site">
      <Button type="primary" @click="newSite">
        <Icon type="md-add" />新建
      </Button>
    </div>
    <Table border :columns="columns12" :data="data6">
      <template
        slot-scope="{ row, index }"
        slot="location"
      >{{row.location.name? row.location.name :'--'}}</template>

      <template slot-scope="{ row, index }" slot="pick_up_time">{{ row.pick_up_time/3600}}h</template>

      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="newSite(row)">修改</Button>
        <Button type="error" size="small" @click="remove(row.id,index)">删除</Button>
      </template>
    </Table>
    <!-- 新建按钮的弹窗 -->
    <Modal v-model="modal" :title="modalTitle" :mask-closable="false" :closable="false">
      <Form :model="formLeft" label-position="left" :label-width="100" ref="formLeft">
        <!-- <FormItem label="站点编号" prop="id">
          <Input v-model="formLeft.id" type="number"></Input>
        </FormItem>-->
        <FormItem label="站点名称" prop="name" required>
          <Input v-model="formLeft.name" maxlength="10"></Input>
        </FormItem>

        <FormItem label="站点范围" required>
          <RadioGroup v-model="radioValue">
            <Radio :label="item.id" v-for="(item,index) in quyuData" :key="index">{{item.name}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="城市" required>
          <!-- <Cascader :data="citydata" v-model="cityvalue" @on-change="cityChange"></Cascader> -->
          <Select v-model="proviceValue" style="width:100px" @on-change="proviceChange(proviceValue)">
            <Option v-for="item in proviceList" :value="item.adcode" :key="item.adcode">
              {{ item.name }}
            </Option>
          </Select>

          <Select v-model="cityValue" style="width:100px" @on-change="cityChange">
            <Option v-for="item in cityList" :value="item.adcode" :key="item.adcode">
              {{ item.name }}
            </Option>
          </Select>

          <Select v-model="areaValue" style="width:100px"  @on-change="areaChange">
            <Option v-for="item in areaList" :value="item.adcode" :key="item.adcode">
              {{ item.name }}
            </Option>
          </Select>


        </FormItem>

        <FormItem label="接人时间" prop="pickUpTimeValue" required>
          <RadioGroup v-model="pickUpTimeValue">
            <Radio :label="item" v-for="(item,index) in pickUpTimeValueData" :key="index">{{item}}h</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel(modalTitle)">取消</Button>
        <Button type="primary" size="large" @click="infoSure(modalTitle)">确定</Button>
      </div>
    </Modal>

    <!-- <div class="pages">
      共{{totalData}}条记录
      <Page :total="totalData"/>
    </div>-->
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
import site from "./site";
export default site;
</script>
<style lang="less" scoped>
@import "./site.less";
</style>