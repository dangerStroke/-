export default {
    name: "flightsEdit",
    data() {
        return {
            detailInfo: {},
            type: "",
            state: "detail"
        }
    },
    created() {
        this.type = this.$route.query.type
        this.formatData()
    },
    methods: {
        // 保存修改
        saveEdit() {
            let data = this.detailInfo.cars
            let params = {
                route_id: this.detailInfo.station_route_id,
                timer: {}
            }
            for (let i = 0; i < data.length; i++) {
                let item = data[i]
                let starts = []
                let ends = []
                let startArr = item.startArr
                let endArr = item.endArr
                for (let j = 0; j < startArr.length; j++) {
                    if (!startArr[j].timer) {
                        this.$Message.warning("请选择班次时间")
                        return
                    } else {
                        starts.push(startArr[j].timer)
                    }
                }
                for (let m = 0; m < endArr.length; m++) {
                    if (!endArr[m].timer) {
                        this.$Message.warning("请选择班次时间")
                        return
                    } else {
                        ends.push(endArr[m].timer)
                    }
                }
                let newStart = Array.from(new Set(starts))
                let newEnd = Array.from(new Set(ends))
                if (newStart.length < starts.length || newEnd.length < ends.length) {
                    this.$Message.warning("班次不可选择相同时间")
                    return
                }
                let obj = {
                        start:item.start,
                        end:item.end,
                        timer: {
                            start:starts,
                            end: ends
                        }
                }
                params.timer[item.id] = obj
            }
            this.$post("admin/classes/edit",params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    localStorage.removeItem("flights")
                    this.$Message.success("修改成功")
                    setTimeout(() => {
                        this.$router.push({
                            name: "flightsList"
                        })
                    }, 1000);
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })
        },
        // 删除班次
        deleteFlights(type, item, index, startIndex) {
            item[type].splice(startIndex, 1)
            this.$set(this.detailInfo.cars, index, item)
        },
        // 新增班次
        addFlights(item, index, type) {
            let obj = {
                timer: ""
            }
            item[type].push(obj)
            this.$set(this.detailInfo.cars, index, item)
        },
        // 时间变化
        timeChange(item, index, start, startIndex, type) {
            if (type === "startArr") {
                start.pickupTime = this.getPickupTime(start.timer, item.start_pick_up_time)
            } else {
                start.pickupTime = this.getPickupTime(start.timer, item.end_pick_up_time)
            }
            this.$set(this.detailInfo.cars, index, item)
        },
        // 取消修改
        cancleEdit() {
            this.$router.push({
                name: "flightsList"
            })
            localStorage.removeItem("flights")
        },
        // 格式化数据
        formatData() {
            this.detailInfo = JSON.parse(localStorage.getItem("flights"))
            this.detailInfo.cars.map(item => {
                item.state = "normal"
                let startArr = []
                let endArr = []
                item.start_time.map(start => {
                    let obj = {
                        timer: this.getTime(start),
                        pickupTime: this.getPickupTime(start, item.start_pick_up_time)
                    }
                    startArr.push(obj)
                })
                item.end_time.map(end => {
                    let obj = {
                        timer: this.getTime(end),
                        pickupTime: this.getPickupTime(end, item.end_pick_up_time)
                    }
                    endArr.push(obj)
                })
                item.startArr = startArr
                item.endArr = endArr
            })
        },
        // 格式化时间
        getTime(time) {
            let timeStr = "1970-12-01 " + time
            let date = new Date(timeStr)
            let hour = date.getHours()
            let minute = date.getMinutes()
            if (hour < 10) {
                hour = `0${hour}`
            }
            if (minute < 10) {
                minute = `0${minute}`
            }
            let pickupTime = [hour, minute].join(":")
            return pickupTime
        },
        // 计算接送时间
        getPickupTime(time, pickTime) {
            let timeStr = "1970-12-01 " + time
            let date = new Date(timeStr)
            let subSeconds = date.getTime() - pickTime * 1000
            let newDate = new Date(subSeconds)
            let hour = newDate.getHours()
            let minute = newDate.getMinutes()
            let seconds = newDate.getSeconds()
            if (hour < 10) {
                hour = `0${hour}`
            }
            if (minute < 10) {
                minute = `0${minute}`
            }
            if (seconds < 10) {
                seconds = `0${seconds}`
            }
            let pickupTime = [hour, minute].join(":")
            return pickupTime
        },
    },
}