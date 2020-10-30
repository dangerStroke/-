<template>
  <div>
    <div class="new_site">
      <Button type="primary"  @click="modalChange('add','add')"><Icon type="md-add"/>新建</Button>
    </div>
    <div class="table_box">
    <Table border="" :columns="columns12" :data="routeList">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="modalChange('edit','edit',row)">修改</Button>
        <Button type="error" size="small" @click="deleteModalChange('show',row.id)">删除</Button>
      </template>
    </Table>
     <div class="page_box">
                <div class="page_left">
                    共{{ total }}条记录 第{{ page }}/{{
                    Math.ceil(total / pagesize)
                    }}页
                </div>
                <div class="page_right">
                    <Page
                        :total="total"
                        :page-size="pagesize"
                        :current="page"
                        @on-change="changePage"
                    />
                </div>
            </div>
    </div>
    <!-- 新建按钮的弹窗 -->
    <Modal v-model="showEdit" :title="title" class="edit_modal" :mask-closable="false"
            :closable="false">
      <div class="edit_box">
        <div class="edit_single">
          <p><span class="inclued">*</span>起始站点：</p>
          <Select v-model="editInfo.station1" style="width:200px" placeholder="请选择路线" :disabled="title==='编辑路线'">
            <Option v-for="item in stationList" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="edit_single">
          <p><span class="inclued">*</span>终止站点：</p>
          <Select v-model="editInfo.station2" style="width:200px" placeholder="请选择路线"  :disabled="title==='编辑路线'">
            <Option v-for="item in stationList" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="edit_single">
          <p><span class="inclued">*</span>路线价格：</p>
          <Input type="number" style="width:200px" v-model="editInfo.price"/>
          <p class="price_text">元</p>
        </div>
         <div class="edit_single">
          <p><span class="inclued">*</span>儿童价：</p>
          <Input type="number" style="width:200px" v-model="editInfo.child_price"/>
          <p class="price_text">元</p>
        </div>
        <div class="edit_single">
          <p><span class="inclued">*</span>路线原价：</p>
          <Input type="number" style="width:200px" v-model="editInfo.adult_original_price"/>
          <p class="price_text">元</p>
        </div>
      </div>
      <div slot="footer" class="footer">
          <Button type="default" class="cancle_btn"  @click="modalChange('add','cancle')">取消</Button>
          <Button type="primary"  @click="editRoute">确定</Button>
      </div>
    </Modal>
     <Modal
            class="delete_box"
            v-model="showDelete"
            :mask-closable="false"
            :closable="false"
            width="400"
        >
            <div class="content">
                <p>您确定要删除选中线路吗？</p>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="deleteModalChange('cancle','')">取消</Button>
                <Button type="primary" @click="submitDelete">确定</Button>
            </div>
        </Modal>
    <!-- <Page :total="100" class="pages" /> -->
  </div>
</template>

<script>
import route from "./route.js";
export default route;
</script>
<style lang='less' scoped>
@import "./route.less";
</style>