<template>
    <div class="flights_list">
        <div class="search_box">
            <div class="search_left">
                <div class="search_single">
                    <Select v-model="route_id" style="width:180px" placeholder="请选择路线">
                        <Option
                            v-for="item in routeList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="search_single">
                    <Select v-model="car_id" style="width:180px" placeholder="请选择车辆">
                        <Option
                            v-for="item in carList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="search_single">
                    <Select v-model="driver_id" style="width:180px" placeholder="请选择司机">
                        <Option
                            v-for="item in driverList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.name }}</Option>
                    </Select>
                </div>
            </div>
            <div class="search_right">
                <Button type="primary" @click="getTimerList('')">搜索</Button>
                <Button type="error" @click="initData">清空</Button>
                <Button type="primary" class="add_btn" @click="addFlights">
                    <Icon type="md-add"/>新建
                </Button>
            </div>
        </div>
        <div class="table_box">
            <Table border="" :columns="columns10" :data="listData">
                <template slot-scope="{ row,index }" slot="station">
                    <p>{{row.station1}} --> {{row.station2}}</p>
                </template>
                <template slot-scope="{ row,index }" slot="car">
                    <p>{{row.cars.length}}辆</p>
                </template>
                <template slot-scope="{ row,index }" slot="driver">
                    <p>{{row.cars.length}}人</p>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div class="btn_box">
                        <!-- <Button type="primary" @click="bindDetail('detail',row)">查看详情</Button> -->
                        <!-- <Button type="primary" @click="bindDetail('edit',row)">修改</Button> -->
                        <Button type="error" @click="deleteRecord(row,'')">删除</Button>
                    </div>
                </template>
            </Table>
        </div>
         <Modal
            class="delete_box"
            v-model="showDelete"
            :mask-closable="false"
            :closable="false"
            width="400"
        >
            <div class="content">
                <p>您确定要删除选中班次吗？</p>
            </div>
            <div slot="footer" class="footer">
                <Button type="default" class="cancle_btn" @click="modelChange('cancle')">取消</Button>
                <Button type="primary" @click="submitDelete">确定</Button>
            </div>
        </Modal>

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
    </div>
</template>
<script>
import list from "./list";
export default list;
</script>
<style lang="less" scoped>
@import url("./list.less");
</style>


