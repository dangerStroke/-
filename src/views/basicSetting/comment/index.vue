<template>
     <div class="box">
         <!-- 新增 -->
        <div class="addBox">
            <Button type="primary" @click="addOne"><Icon type="md-add" />新建</Button>
        </div>
        <!-- 表格 -->
         <Table border :columns="columnsComment" :data="dataComment">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">修改</Button>
                <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
        </Table>

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

        <!-- model -->
        <Modal
            v-model="modal"
            :title="modalTitle"
            @on-ok="ok"
            @on-cancel="cancel">
            <div>相同类型的评价最多只能添加6条</div>
            <Select v-model="modelSelect" style="width:200px" placeholder='满意程度'>
                <Option v-for="item in SelectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="mainText" placeholder="请输入评价内容" style="width: 300px" maxlength='6'/>
        </Modal>
     </div>
</template>

<script>
import comment from "./comment.js";
export default comment;
</script>


<style lang="less" scoped>
@import url("./comment.less");
</style>
