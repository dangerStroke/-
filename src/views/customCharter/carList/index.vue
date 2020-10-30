<template>
  <div>
    <div class="custom_search">
      <!-- <div class="inputMsg">
          <Input type="text" v-model="name" placeholder="搜索车型" style="width:120px" />
          <Input type="text" v-model="ridership" placeholder="搜索座位数" style="width:120px" />
      </div> -->
      <div class="adctive">
         <!-- <Button type="primary" @click="getCarList">搜索</Button>
        <Button type="error" @click="clearSerach">清空</Button> -->
        <Button type="primary" @click="newSite" class="newBtn">
          <Icon type="md-add" />新建
        </Button>
      </div>
    </div>
    <Table border :columns="columns" :data="data">
       <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="newSite(row)">修改</Button>
        <Button type="error" size="small" @click="remove(row.id,index)">删除</Button>
      </template>
    </Table> 


    <div class="driver_model">
      <Modal
        v-model="modal"
        :title="modalTitle"
        :transfer="false"
        :mask-closable="false"
        :closable="false"
      >
        <div class="upLoadimg">
          <div class="text">车辆图片：</div>
          <Upload ref="upload" :format="['jpg', 'jpeg', 'png']" accept="'jpg', 'jpeg', 'png'"  name="file" :data="upData" :on-success="handleSuccessList" action="http://up-z0.qiniup.com" class="upload_btn"    :show-upload-list="false"  >                  
            <div style="width: 130px;height:100px;" class="upload_img_css">
                <img :src="image" alt class="upload_img_css" />
            </div>          
          </Upload>
        </div>
        <div class="carInfo">
          <div class="input_info">车型名称:<Input type="text" v-model="name" placeholder="车型名称" style="width:150px;" /></div>
          <div class="input_info">座位数:<Input type="text" v-model="ridership" placeholder="座位数" style="width:150px;" /></div>
          <div class="input_info">库存:<Input type="text" v-model="cars" placeholder="库存" style="width:150px;" /></div>
          <div class="input_info">价格:<Input type="text" v-model="price" placeholder="价格" style="width:150px;" /></div>
          <div class="input_info">描述:<Input type="text" v-model="describe" placeholder="请填写描述(例：自动｜5座｜1.5L)" style="width:300px;" /></div>
        </div>
        <div slot="footer">
          <Button type="text"  @click="cancel(modalTitle)">取消</Button>
          <Button type="primary"  @click="infoSure(modalTitle)">确定</Button>
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
import carList from "./carList";
export default carList;
</script>
<style lang="less" scoped>
@import "./carList.less";
</style>