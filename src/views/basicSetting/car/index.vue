<template>
  <div>
    <div class="new_site">
      <div class="inputMsg">
        <Input type="number" v-model="id" placeholder="搜索车辆编号" style="width:120px" />
        <Input type="text" v-model="plate_no" placeholder="搜索车牌号" style="width:120px" />

        <Select v-model="color" style="width:120px" placeholder="搜索颜色">
          <Option
            v-for="item in carColorList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <Select v-model="carbelong" style="width:120px" placeholder="搜索车辆分类">
          <Option
            v-for="item in carBelongList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <Select v-model="brand_id" style="width:120px" placeholder="搜索品牌">
          <Option
            v-for="item in carBrandList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <Select v-model="ridership" style="width:120px" placeholder="搜索座位数">
          <Option
            v-for="item in ridershipList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
      <div class="btns">
        <Button type="primary" @click="getCarList">搜索</Button>
        <Button type="error" @click="clearSerach">清空</Button>
        <Button type="primary" @click="newSite" class="newBtn">
          <Icon type="md-add" />新建
        </Button>
      </div>
    </div>

    <Table border :columns="columns" :data="data">
      <!-- 车辆品牌 -->
      <template slot-scope="{ row, index }" slot="brand_id">
        <div v-for="item in carBrandList" :value="item.value" :key="item.value">
          <div v-if="row.brand_id == item.value">{{ item.label }}</div>
        </div>
      </template>

      <!-- 车辆分类 -->
      <template slot-scope="{ row, index }" slot="belong_id">
        <div v-for="item in carBelongList" :value="item.value" :key="item.value">
          <div v-if="row.belong_id == item.value">{{ item.label }}</div>
        </div>
      </template>

      <!-- 车辆座位数 -->
      <template slot-scope="{ row, index }" slot="ridership">{{row.ridership}}座</template>

      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="newSite(row)">修改</Button>
        <Button type="error" size="small" @click="remove(row.id,index)">删除</Button>
      </template>
    </Table>

    <!-- 新建按钮的弹窗 -->
    <div class="driver_model">
      <Modal
        v-model="modal"
        :title="modalTitle"
        :transfer="false"
        :mask-closable="false"
        :closable="false"
      >
        <Form :model="formLeft" label-position="left" :label-width="100" ref="formLeft">
          <!-- 上传图片 -->
          <FormItem label="行驶证照片:" prop="goCarPic">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError1"
              :before-upload="handleUploadiconXsz"
              multiple
              type="drag"
              name="file"
              action
              style="display: inline-block;"
            >
              <div style="width: 130px;height:100px;">
                <img :src="uploadXszImgUrl" alt class="upload_img_css" />
              </div>
            </Upload>
          </FormItem>

          <!-- 上传图片 -->
          <FormItem label="车辆照片:" prop="carPic">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError1"
              :before-upload="handleUploadiconCar"
              multiple
              type="drag"
              name="file"
              action
              style="display: inline-block;"
            >
              <div style="width: 130px;height:100px;">
                <img :src="uploadCarImgUrl" alt class="upload_img_css" />
              </div>
            </Upload>
          </FormItem>

          <FormItem label="车牌号" prop="plate_no" required>
            <Input v-model="formLeft.plate_no" maxlength="10"></Input>
          </FormItem>

          <FormItem label="停放站点" prop="park_id" required>
            <Select v-model="formLeft.park_id" style="width:200px;float:left" @on-change="changeParkId">
              <Option v-for="item in siteList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="车辆品牌" prop="brand_id" required>
            <Select v-model="formLeft.brand_id" style="width:120px;float:left" placeholder="车辆品牌">
              <Option
                v-for="item in carBrandList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <!-- 车辆用途是城际接送还是司乘快客 -->
          <FormItem label="车辆用途" prop="type" required>
            <Select
              v-model="formLeft.type"
              style="width:140px;float:left"
              placeholder="车辆用途"
              @on-change="carUse"
            >
              <Option
                v-for="item in bigKindList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>

            <!-- 如果选择的是城际接送,选择主副司机 -->
            <div v-if="formLeft.type == 1">
              <Select
                v-model="formLeft.main_driver_id"
                style="width:140px;float:left;margin-left:2px"
                placeholder="主司机"
              >
                <Option
                  v-for="item in mainDirverList"
                  :value="item.id"
                  :key="item.id"
                  :disabled="item.is_bind==1?true:false"
                >{{ item.name }}</Option>
              </Select>

              <div class="checkbox">
                <span style="font-size:16px;">副司机：</span>
                <CheckboxGroup v-model="coDriver" @on-change="coDriverChange">
                  <template  v-for="(item,index) in coDriverList">
                  <Checkbox
                    :label="item.id"
                    :key="index"
                  >{{item.name}}</Checkbox>
                  </template>
                </CheckboxGroup>
              </div>
            </div>

            <!-- 如果选择的是司乘快客,选择主司机 -->
            <div v-if="formLeft.type == 2 || formLeft.type == 7">
              <Select
                v-model="formLeft.main_driver_id"
                style="width:140px;float:left;margin-left:2px"
                placeholder="匹配司机"
              >
                <Option
                  v-for="item in driverPassengerList"
                  :value="item.id"
                  :key="item.id"
                  :disabled="item.is_bind==1?true:false"
                >{{ item.name }}</Option>
              </Select>

              <div style="float:left;text-align: left;">
                常用路线：(例如：成都-康定)
                <Input v-model="formLeft.route_name" maxlength="10" placeholder="例如：成都-康定" @on-change="changeRouteName"></Input>
              </div>
            </div>
          </FormItem>

          <FormItem label="车辆型号" prop="car_model" required>
            <Input v-model="formLeft.car_model" maxlength="10"></Input>
          </FormItem>

          <FormItem label="车辆分类" prop="carbelong" required>
            <Select v-model="formLeft.carbelong" style="width:120px;float:left" placeholder="车辆分类">
              <Option
                v-for="item in carBelongList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="车辆座位数" prop="ridership" required>
            <Select v-model="formLeft.ridership" style="width:120px;float:left" placeholder="车辆座位数">
              <Option
                v-for="item in ridershipList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="颜色" prop="color" required>
            <Select v-model="formLeft.color" style="width:120px;float:left" placeholder="颜色">
              <Option
                v-for="item in carColorList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <!-- <FormItem label="匹配司机" prop="main_driver_id" required>
            <Select v-model="formLeft.main_driver_id" style="width:200px;float:left">
              <Option
                v-for="item in driverList"
                :value="item.id"
                :key="item.id"
                :disabled="item.car_id>0?true:false"
              >{{ item.name }}({{item.phone}})</Option>
            </Select>
          </FormItem>-->

          <!-- </FormItem> -->

          <FormItem label="备注" prop="remark">
            <Input v-model="formLeft.remark" maxlength="100" type="textarea"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel(modalTitle)">取消</Button>
          <Button type="primary" size="large" @click="infoSure(modalTitle)">确定</Button>
        </div>
      </Modal>
    </div>

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
import car from "./car";
export default car;
</script>
<style lang="less" scoped>
@import "./car.less";
</style>