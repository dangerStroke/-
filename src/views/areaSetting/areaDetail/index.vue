<template>
    <div class="detail_container">
        <div id="map"></div>
        <div class="map_content">
            <div class="name_box">
                <Input placeholder="请输入默认上车点" v-model="defaultAddress" />
            </div>
            <div class="search_box">
                <Input v-model="address" placeholder="请输入地址" style="width: 300px" id="tipinput" />
                <Button type="primary" @click="autoInput('search')" class="search_btn">搜索</Button>
                <div class="result_box" v-if="addressList.length > 0 && showList">
                    <div class="single_result" v-for="(item,index) in addressList" :key="index" @click="chooseAddress(item)">
                        <p class="name">{{item.name}}</p>
                        <p class="detail">{{item.address}}</p>
                    </div>
                </div>
            </div>
            <div class="name_box">
                <Input placeholder="请输入区域名称" v-model="name" />
            </div>
            <div class="coo_box">
                <Button type="primary" v-if="points.length > 0" @click="reRender">重新绘制</Button>
                <Button type="primary" v-if="points.length > 1" @click="preStep">上一步</Button>
                <Button type="primary" v-if="points.length > 0"  @click="sendPosition">修改区域信息</Button>
            </div>
            <div class="location_box">
                <p v-if="points.length > 0">已添加的点</p>
                <template v-for="(item,index) in points" >
                    <p class="single" :key="index">{{item.lng}},{{item.lat}}</p>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import areaDetail from "./areaDetail"
export default areaDetail
</script>
<style lang="less">
@import url("./areaDetail.less");
</style>

