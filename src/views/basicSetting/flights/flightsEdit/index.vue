<template>
    <div class="flightsEdit_box">
        <p class="line_text">线路：{{detailInfo.station1}}-->{{detailInfo.station2}}</p>
        <div class="timer_box">
            <div class="single_timer" v-for="(item,index) in detailInfo.cars" :key="index">
                <p class="driver_info">
                    <span>车辆：{{item.plate_no}}</span>
                    <span>司机：{{item.driver_name}}</span>
                    <span>站点：{{item.park_name}}</span>
                </p>
                <div class="single_inner">
                    <div class="timer_start">
                        <p class="title">班次（往）</p>
                        <div
                            class="timer_box"
                            v-for="(start,startIndex) in item.startArr"
                            :key="startIndex"
                        >
                            <TimePicker
                                type="time"
                                format="HH:mm"
                                placeholder="请选择发车时间"
                                style="width: 168px"
                                v-model="start.timer"
                                :disabled="type==='detail'"
                                 @on-change="timeChange(item,index,start,startIndex,'startArr')"
                            ></TimePicker>
                            <p class="pick_uptime">预计接人时间：{{start.pickupTime}}</p>
                            <p class="delete_btn" v-if="type=='edit'" @click="deleteFlights('startArr',item,index,startIndex)">删除</p>
                        </div>
                        <div class="add_box" v-if="type==='edit'">
                            <Button type="primary" class="add_btn" @click="addFlights(item,index,'startArr')">
                                <Icon type="md-add"/>新增班次
                            </Button>
                        </div>
                    </div>
                    <div class="timer_start timer_end">
                        <p class="title">班次（返）</p>
                        <div
                            class="timer_box"
                            v-for="(end,endIndex) in item.endArr"
                            :key="endIndex"
                        >
                            <TimePicker
                                type="time"
                                format="HH:mm"
                                placeholder="请选择发车时间"
                                style="width: 168px"
                                 v-model="end.timer"
                                :disabled="type==='detail'"
                                @on-change="timeChange(item,index,end,endIndex,'ednArr')"
                            ></TimePicker>
                            <p class="pick_uptime">预计接人时间：{{end.pickupTime}}</p>
                            <p class="delete_btn" v-if="type==='edit'" @click="deleteFlights('endArr',item,index,endIndex)">删除</p>
                        </div>
                        <div class="add_box" v-if="type==='edit'">
                            <Button type="primary" class="add_btn" @click="addFlights(item,index,'endArr')">
                                <Icon type="md-add"/>新增班次
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="edit_btn"  v-if="type==='edit'">
                <Button type="primary" class="add_btn" @click="saveEdit">
                    保存
                </Button>
                <Button type="error" class="add_btn" @click="cancleEdit">
                    取消
                </Button>
            </div>
        </div>
    </div>
</template>
<script>
import flightsEdit from "./flightsEdit";
export default flightsEdit;
</script>
<style lang="less" scoped>
@import url("./flightsEdit.less");
</style>


