<template>
    <div class="list_container">
        <div class="btn_box">
            <Button type="primary" @click="bindAdd">
                <Icon type="md-add"/>新增
            </Button>
        </div>
        <div class="table_box">
            <Table border="" :columns="columns" :data="listData">
                <template slot-scope="{ row }" slot="img">
                    <div class="img_box">
                        <img :src="row.image" alt="">
                    </div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" @click="trainDetail(row,'detail')">查看详情</Button>
                    <Button type="info" @click="trainDetail(row,'modify')">修改</Button>
                    <Button type="error" @click="deleteArea(row.id)">删除</Button>
                </template>
            </Table>
            <div class="page_box">
                <div class="page_left">
                    共{{ total }}条记录 第{{ page }}/{{
                    Math.ceil(total / page_size)
                    }}页
                </div>
                <div class="page_right">
                    <Page
                        :total="total"
                        :page-size="page_size"
                        :current="page"
                        @on-change="changePage"
                    />
                </div>
            </div>
        </div>
        <Modal
            class="delete_box"
            v-model="showDeleta"
            :mask-closable="false"
            :closable="false"
            width="400"
        >
            <div class="content">
                <p>您确定要删除选中项目吗？</p>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="deleteArea('')">取消</Button>
                <Button type="primary" @click="bindDelete">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import trainList from "./trainList";
export default trainList;
</script>
<style lang="less" >
@import url("./trainList.less");
</style>


