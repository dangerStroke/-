<template>
    <div class="add_container">
        <div class="add_top">
            <div class="search_single">
                <Select
                    v-model="routeId"
                    style="width:250px"
                    placeholder="请选择路线"
                    @on-change="getCarList"
                >
                    <Option
                        v-for="item in routeList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.name }}</Option>
                </Select>
            </div>
            <div class="search_single">
                <Select
                    v-model="carId"
                    style="width:250px"
                    placeholder="请选择车辆"
                    :disabled="carList.length === 0"
                >
                    <Option
                        v-for="item in carList"
                        :value="item.id"
                        :key="item.id"
                        :disabled="item.is_bind === 1"
                    >{{ item.plate_no }}</Option>
                </Select>
                <span class="driver_info" v-if="carId">司机：{{carInfo.driver_name}}</span>
                <span class="driver_info" v-if="carId">站点：{{carInfo.park_name}}</span>
            </div>
        </div>
        <div class="timerType_box">
            <p class="type_text">班次类型：</p>
            <div class="radio_box">
                <RadioGroup v-model="timerType">
                    <Radio :label="1">按天循环</Radio>
                    <Radio :label="2">按周循环</Radio>
                    <Radio :label="3">日期内循环</Radio>
                </RadioGroup>
            </div>
        </div>
        <div class="add_content" v-if="timerType === 1">
            <div class="single_timer">
                <div class="timer_start">
                    <p class="title">班次（往）</p>
                    <div class="timer_box" v-for="(item,index) in startArr" :key="index">
                        <TimePicker
                            type="time"
                            format="HH:mm"
                            v-model="item.timer"
                            placeholder="请选择发车时间"
                            style="width: 168px"
                            @on-change="timeChange($event,item,index,'startArr')"
                        ></TimePicker>
                        <p class="pick_uptime" v-if="item.pickupTime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('startArr',index)">删除</p>
                    </div>
                    <div class="add_box">
                        <Button type="primary" class="add_btn" @click="addFlights('startArr',0,'day')">
                            <Icon type="md-add"/>新增班次
                        </Button>
                    </div>
                </div>
                <div class="timer_start timer_end">
                    <p class="title">班次（返）</p>
                    <div class="timer_box" v-for="(item,index) in endArr" :key="index">
                        <TimePicker
                            type="time"
                            format="HH:mm"
                            v-model="item.timer"
                            placeholder="请选择发车时间"
                            style="width: 168px"
                            @on-change="timeChange($event,item,index,'endArr')"
                        ></TimePicker>
                        <p class="pick_uptime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('endArr',index)">删除</p>
                    </div>
                    <div class="add_box">
                        <Button type="primary" class="add_btn" @click="addFlights('endArr',0,'day')">
                            <Icon type="md-add"/>新增班次
                        </Button>
                    </div>
                </div>
            </div>
            <div class="btn_Box">
                <Button type="primary" class="add_btn" @click="saveTimer">保存</Button>
            </div>
        </div>
        <div class="add_content" v-if="timerType === 2">
            <div class="single_week" v-for="(item,index) in weeksInfo" :key="index">
                <div class="week_box">
                    <Select
                        v-model="item.weekName"
                        style="width:250px"
                        placeholder="请选择班次时间"
                    >
                        <Option
                            v-for="item in weeks"
                            :value="item.value"
                            :key="item.value"
                            :disabled="item.checked"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="single_timer">
                    <div class="timer_start">
                        <p class="title">班次（往）</p>
                        <div class="timer_box" v-for="(timer,timerIndex) in item.startArr" :key="timerIndex">
                            <TimePicker
                                type="time"
                                format="HH:mm"
                                v-model="timer.timer"
                                placeholder="请选择发车时间"
                                style="width: 168px"
                                @on-change="weekTimeChange($event,item,index,timer,timerIndex,'startArr')"
                            ></TimePicker>
                            <p class="pick_uptime" v-if="timer.pickupTime">预计接人时间：{{timer.pickupTime}}</p>
                            <p class="delete_btn" @click="deleteWeeksFlights('startArr',item,index,timer,timerIndex)">删除</p>
                        </div>
                        <div class="add_box">
                            <Button type="primary" class="add_btn" @click="addFlights('startArr',index,'week')">
                                <Icon type="md-add"/>新增班次
                            </Button>
                        </div>
                    </div>
                    <div class="timer_start timer_end">
                        <p class="title">班次（返）</p>
                        <div class="timer_box" v-for="(timer,timerIndex) in item.endArr" :key="timerIndex">
                            <TimePicker
                                type="time"
                                format="HH:mm"
                                v-model="timer.timer"
                                placeholder="请选择发车时间"
                                style="width: 168px"
                                @on-change="weekTimeChange($event,item,index,timer,timerIndex,'endArr')"
                            ></TimePicker>
                            <p class="pick_uptime">预计接人时间：{{timer.pickupTime}}</p>
                            <p class="delete_btn" @click="deleteWeeksFlights('endArr',item,index,timer,timerIndex)">删除</p>
                        </div>
                        <div class="add_box">
                            <Button type="primary" class="add_btn" @click="addFlights('endArr',index,'week')">
                                <Icon type="md-add"/>新增班次
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn_Box">
                <Button type="primary" class="add_btn" @click="saveWeeksTimer">保存</Button>
            </div>
        </div>
        <div class="add_content" v-if="timerType === 3">
            <div class="date_box">
                <DatePicker
                    :value="dateArray"
                    format="yyyy-MM-dd"
                    type="daterange"
                    placement="bottom-end"
                    placeholder="请选择日期范围"
                    style="width: 250px;text-align:center"
                    @on-change="dateChange"
                ></DatePicker>
            </div>
            <div class="single_timer">
                <div class="timer_start">
                    <p class="title">班次（往）</p>
                    <div class="timer_box" v-for="(item,index) in dateStart" :key="index">
                        <TimePicker
                            type="time"
                            format="HH:mm"
                            v-model="item.timer"
                            placeholder="请选择发车时间"
                            style="width: 168px"
                            @on-change="timeChange($event,item,index,'dateStart')"
                        ></TimePicker>
                        <p class="pick_uptime" v-if="item.pickupTime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('dateStart',index)">删除</p>
                    </div>
                    <div class="add_box">
                        <Button type="primary" class="add_btn" @click="addFlights('dateStart',0,'day')">
                            <Icon type="md-add"/>新增班次
                        </Button>
                    </div>
                </div>
                <div class="timer_start timer_end">
                    <p class="title">班次（返）</p>
                    <div class="timer_box" v-for="(item,index) in dateEnd" :key="index">
                        <TimePicker
                            type="time"
                            format="HH:mm"
                            v-model="item.timer"
                            placeholder="请选择发车时间"
                            style="width: 168px"
                            @on-change="timeChange($event,item,index,'dateEnd')"
                        ></TimePicker>
                        <p class="pick_uptime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('dateEnd',index)">删除</p>
                    </div>
                    <div class="add_box">
                        <Button type="primary" class="add_btn" @click="addFlights('dateEnd',0,'day')">
                            <Icon type="md-add"/>新增班次
                        </Button>
                    </div>
                </div>
            </div>
            <div class="btn_Box">
                <Button type="primary" class="add_btn" @click="saveDateTimer">保存</Button>
            </div>
        </div>
    </div>
</template>
<script>
import addFlights from "./addFlights";
export default addFlights;
</script>
<style lang="less">
@import url("./addFlights.less");
</style>


