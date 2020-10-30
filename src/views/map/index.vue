<template>
    <div class="container">
        <div id="map"></div>
        <div class="btn_box">
            <div class="search_box">
                <Input v-model="address" placeholder="请输入地址" style="width: 300px" id="tipinput" />
                <Button type="primary" @click="autoInput('search')">搜索</Button>
                <div class="result_box" v-if="addressList.length > 0 && showList">
                    <div class="single_result" v-for="(item,index) in addressList" :key="index" @click="chooseAddress(item)">
                        <p class="name">{{item.name}}</p>
                        <p class="detail">{{item.address}}</p>
                    </div>
                </div>
            </div>
            <div class="points_box">
                <Button type="primary" v-if="points.length > 1" @click="preStep">上一步</Button>
                <Button type="primary" v-if="points.length > 0" @click="reRender">重新绘制</Button>
                <Button type="primary" v-if="points.length > 0"  @click="sendPosition">发送位置信息</Button>
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
import map from './index'
export default map
</script>
<style lang="less" scoped>
.container{
    display: flex;
    flex-direction: row;
    height: 100vh;
    #map{
        width: calc(100% - 400px);
    }
    .btn_box{
        width:  400px;
        padding-top: 40px;
        overflow-y: scroll;
        .search_box{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-left: 20px;
            position: relative;
            .result_box{
                position: absolute;
                top: 32px;
                width: 300px;
                max-height: 300px;
                overflow-y: scroll;
                left: 20px;
                box-shadow:0px 0px 10px 0px rgba(0,0,0,0.08);
                z-index: 9999;
                background: #ffffff;
                .single_result{
                    width: 100%;
                    // height: 50px;
                    text-align: left;
                    padding: 5px 10px;
                    cursor: pointer;
                    .name{
                        font-size: 16px;
                        font-weight: bold;
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow:ellipsis;

                    }
                    .detail {
                        font-size: 12px;
                    }
                }
            }
        }
        .points_box{
            margin-top: 40px
        }
    }
    .location_box{
        margin-top: 40px;
        .single{
            padding: 10px;
        }
    }
}
</style>
