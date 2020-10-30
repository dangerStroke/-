<template>
  <div class="driver_css">
    <div class="new_site">
      <div class="inputMsg">
        <Input type="text" v-model="name" placeholder="搜索姓名" />
        <!-- <Input type="text" v-model="queryParams.name" placeholder="搜索姓名" /> -->

        <Input type="number" v-model="phoneNumber" placeholder="搜索手机号" />
        <!-- <Input
          type="number"
          v-model="queryParams.phoneNumber"
          placeholder="搜索手机号"
        />-->
        <Input v-model="idCard" placeholder="搜索身份证号" />
        <!-- <Input v-model="queryParams.idCard" placeholder="搜索身份证号"  /> -->

        <!-- 状态搜索 -->
        <Select v-model="model1" style="width:150px" placeholder="选择司机状态">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="btns">
        <Button type="primary" @click="getDriverDataList">搜索</Button>
        <Button type="error" @click="clearSerach">清空</Button>
        <Button type="primary" @click="newSite" class="newBtn">
          <Icon type="md-add" />新建
        </Button>
      </div>
    </div>

    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="status">{{ row.status == 0?'停用':'启用'}}</template>

      <template slot-scope="{ row, index }" slot="role_id">
        <div v-for="item in roleList" :value="item.value" :key="item.value">
          <div v-if="row.role_id == item.value">{{ item.label }}</div>
        </div>
      </template>

      <!-- 司机类型：城际接送还是司乘快客 -->
      <template slot-scope="{ row, index }" slot="type">
        <div v-for="item in bigKindList" :value="item.value" :key="item.value">
          <div v-if="row.type == item.value">
            {{ item.label }}
            <div v-if="row.type == 1">
              <span v-if="row.is_main_driver == 0">(副司机)</span>
              <span v-if="row.is_main_driver == 1">(主司机)</span>
            </div>
          </div>
        </div>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="newSite(row)">修改</Button>
        <!-- <Button type="error" size="small" @click="statusBtn(row.status)">{{row.status == '停用'? '启用': '停用'}}</Button> -->
        <Button type="error" size="small" @click="statusBtn(row)">{{row.status == 0? '启用':'停用'}}</Button>
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
          <FormItem label="司机照片:" prop="driverPic" required>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError1"
              :before-upload="handleUploadiconDriver"
              multiple
              type="drag"
              name="file"
              action
              style="display: inline-block;"
            >
              <div style="width: 130px;height:100px;">
                <img :src="uploadDriverImgUrl" alt class="upload_img_css" />
              </div>
            </Upload>
          </FormItem>

          <!-- 上传图片 -->
          <FormItem label="驾驶证照片:" prop="driverLicense" required>
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

          <FormItem label="司机状态" prop="status" required>
            <!-- <Input v-model="formLeft.status"></Input> -->
            <RadioGroup v-model="formLeft.status" class="sex_class">
              <Radio :label="0">停用</Radio>
              <Radio :label="1">启用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="司机姓名" prop="name" required>
            <Input v-model="formLeft.name" maxlength="10"></Input>
          </FormItem>

          <FormItem label="性别" prop="gender" required>
            <RadioGroup v-model="formLeft.gender" class="sex_class">
              <Radio :label="2">男</Radio>
              <Radio :label="1">女</Radio>
            </RadioGroup>
          </FormItem>

          <!-- 司机类型(城际或司乘) -->
          <FormItem label="司机类型" prop="type" required>
            <!-- 选择是城际接送还是司乘快客 -->
            <Select v-model="formLeft.type" style="width:150px;float:left">
              <Option
                v-for="item in bigKindList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>

            <!-- 选择了城际接送之后，选择主副司机 -->
            <Select
              v-model="formLeft.is_main_driver"
              v-if="formLeft.type == 1"
              style="width:100px;float:left;margin-left:20px"
            >
              <Option
                v-for="item in isMainList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="司机电话号码" prop="phone" required>
            <Input
              v-model="formLeft.phone"
              type="number"
              @on-blur="validate('phone',formLeft.phone)"
            ></Input>
          </FormItem>
          <FormItem label="司机身份证号" prop="id_card_number" required>
            <Input
              v-model="formLeft.id_card_number"
              @on-blur="validate('id_card_number',formLeft.id_card_number)"
            ></Input>
          </FormItem>
          <FormItem label="司机生日" prop="driverBirthDay">
            <Input v-model="formLeft.driverBirthDay" type="text" disabled></Input>
          </FormItem>
          <FormItem label="司机角色" prop="role_id" required>
            <Select v-model="formLeft.role_id" class="sex_class">
              <Option
                v-for="item in roleList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="起始站点" prop="park_id" required>
            <Select v-model="formLeft.park_id" class="sex_class">
              <Option
                v-for="item in siteList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="家庭住址" prop="addr" required>
            <Input v-model="formLeft.addr" maxlength="30"></Input>
          </FormItem>
          <FormItem label="微信号" prop="wechat" required>
            <Input v-model="formLeft.wechat" maxlength="20"></Input>
          </FormItem>

          <!-- <FormItem label="常用路线" prop="route_name" required>
            <Input v-model="formLeft.route_name" maxlength="10" placeholder="例如：成都-康定"></Input>
          </FormItem> -->


          <FormItem label="银行卡账户" prop="bank_card">
            <Input
              v-model="formLeft.bank_card"
              type="number"
              @on-blur="validate('bankCard',formLeft.bank_card)"
            ></Input>
          </FormItem>

          <FormItem label="银行卡开户行" prop="bank_name">
            <RadioGroup v-model="formLeft.bank_name" class="sex_class">
              <Radio label="chinaGsBank">中国工商银行</Radio>
              <Radio label="chinaNyBank">中国农业银行</Radio>
              <Radio label="chinaNsBank">中国农商银行</Radio>
              <Radio label="chinaZsBank">中国招商银行</Radio>
              <Radio label="chinaYzBank">中国邮政银行</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="备注" prop="comment">
            <Input v-model="formLeft.comment" maxlength="100" type="textarea"></Input>
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
import driver from "./driver";
export default driver;
</script>
<style lang="less" scoped>
@import "./driver.less";
@deep: ~">>>";
</style>