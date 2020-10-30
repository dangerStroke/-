<template>
    <div class="add_container">
        <div class="add_top">
            <p class="line_text">线路：{{detailInfo.station1}}-->{{detailInfo.station2}} <span>车辆：{{detailInfo.car_no  }} </span> <span> 司机: {{detailInfo.driver_name}}</span></p>
        </div>
        <div class="timerType_box">
            <p class="type_text">班次类型：</p>
            <div class="radio_box">
                <RadioGroup v-model="timerType" >
                    <Radio :label="1" :disabled="type==='detail'">按天循环</Radio>
                    <Radio :label="2" :disabled="type==='detail'">按周循环</Radio>
                    <Radio :label="3" :disabled="type==='detail'">日期内循环</Radio>
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
                            :disabled="type==='detail'"
                        ></TimePicker>
                        <p class="pick_uptime" v-if="item.pickupTime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('startArr',index)"  v-if="type==='edit'">删除</p>
                    </div>
                    <div class="add_box"  v-if="type==='edit'">
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
                        <p class="delete_btn" @click="deleteFlights('endArr',index)"  v-if="type==='edit'">删除</p>
                    </div>
                    <div class="add_box"  v-if="type==='edit'">
                        <Button type="primary" class="add_btn" @click="addFlights('endArr',0,'day')">
                            <Icon type="md-add"/>新增班次
                        </Button>
                    </div>
                </div>
            </div>
            <div class="btn_Box" v-if="type==='edit'">
                <Button type="primary" class="add_btn" @click="saveTimer">保存</Button>
                <Button type="dashed" class="add_btn" @click="cancleModify">取消</Button>
            </div>
        </div>
        <div class="add_content" v-if="timerType === 2">
            <div class="single_week" v-for="(item,index) in weeksInfo" :key="index">
                <div class="week_box">
                    <Input v-model="item.label" placeholder="请选择班次时间" style="width: 250px" type="text" readonly/>
                    <!-- <Select
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
                    </Select> -->
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
                                :disabled="type==='detail'"
                                @on-change="weekTimeChange($event,item,index,timer,timerIndex,'startArr')"
                            ></TimePicker>
                            <p class="pick_uptime" v-if="timer.pickupTime">预计接人时间：{{timer.pickupTime}}</p>
                            <p class="delete_btn" @click="deleteWeeksFlights('startArr',item,index,timer,timerIndex)" v-if="type==='edit'">删除</p>
                        </div>
                        <div class="add_box" v-if="type==='edit'">
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
                                :disabled="type==='detail'"
                                @on-change="weekTimeChange($event,item,index,timer,timerIndex,'endArr')"
                            ></TimePicker>
                            <p class="pick_uptime">预计接人时间：{{timer.pickupTime}}</p>
                            <p class="delete_btn" @click="deleteWeeksFlights('endArr',item,index,timer,timerIndex)" v-if="type==='edit'">删除</p>
                        </div>
                        <div class="add_box" v-if="type==='edit'">
                            <Button type="primary" class="add_btn" @click="addFlights('endArr',index,'week')">
                                <Icon type="md-add"/>新增班次
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn_Box" v-if="type==='edit'">
                <Button type="primary" class="add_btn" @click="saveWeeksTimer">保存</Button>
                <Button type="dashed" class="add_btn" @click="cancleModify">取消</Button>
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
                    :disabled="type==='detail'"
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
                            :disabled="type==='detail'"
                            @on-change="timeChange($event,item,index,'dateStart')"
                        ></TimePicker>
                        <p class="pick_uptime" v-if="item.pickupTime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('dateStart',index)" v-if="type==='edit'">删除</p>
                    </div>
                    <div class="add_box" v-if="type==='edit'">
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
                            :disabled="type==='detail'"
                            @on-change="timeChange($event,item,index,'dateEnd')"
                        ></TimePicker>
                        <p class="pick_uptime">预计接人时间：{{item.pickupTime}}</p>
                        <p class="delete_btn" @click="deleteFlights('dateEnd',index)" v-if="type==='edit'">删除</p>
                    </div>
                    <div class="add_box" v-if="type==='edit'">
                        <Button type="primary" class="add_btn" @click="addFlights('dateEnd',0,'day')">
                            <Icon type="md-add"/>新增班次
                        </Button>
                    </div>
                </div>
            </div>
            <div class="btn_Box" v-if="type==='edit'">
                <Button type="primary" class="add_btn" @click="saveDateTimer">保存</Button>
                <Button type="dashed" class="add_btn" @click="cancleModify">取消</Button>
            </div>
        </div>
    </div>
</template>
<script>
import modifyFlights from "./modifyFlights";
export default modifyFlights;
</script>
<style lang="less">
@import url("./modifyFlights.less");
</style>


