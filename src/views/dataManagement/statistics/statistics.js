export default {
    name: 'statistics',
    data() {
        return {
            xAxisData: [], //x轴数据
            register_member_change_data_xArr: [], //注册人数增长x轴数据
            register_member_change_data_yArr: [], //注册人数增长x轴数据
            member: {}, //注册人数
            active_member: {}, //今日日活
            real_mem: {}, //实名认证人数
            mem_activity: {}, //新人礼包领取数
            recommend: {}, //推荐人数
            recommend_success: {}, //推荐成功人数
            hero_member: {}, //防疫认证人数
            order: {}, //总订单数
            month_order: {}, //本月订单数
            cancel_order: {}, //本月取消订单数
            today_order: {}, //今日订单数
            order_change_data_xArr: [], //订单总数增长x轴数据
            order_change_data_yArr: [], //订单总数增长y轴数据
        }
    },
    mounted() {
        //获取全部数据
        this.$fetch('/admin/index/full-stats').then(res => {
            let that = this
            console.log(res)
            if (res.code == 200) {
                //注册人数数据
                this.member = res.data.member
                //今日日活
                this.active_member = res.data.active_member
                //实名认证人数
                this.real_mem = res.data.real_mem
                //新人礼包领取数
                this.mem_activity = res.data.mem_activity
                //推荐人数
                this.recommend = res.data.recommend
                //推荐成功人数
                this.recommend_success = res.data.recommend_success
                //防疫认证人数
                this.hero_member = res.data.hero_member
                //总订单数
                this.order = res.data.order
                //本月订单数
                this.month_order = res.data.month_order
                //本月取消订单数
                this.cancel_order = res.data.cancel_order
                //今日订单数
                this.today_order = res.data.today_order

                //注册人数增长折线图数据
                let arr1 = []
                res.data.register_member_change.map((item, index) => {
                    arr1.push(item.name)
                })
                this.register_member_change_data_xArr = JSON.parse(JSON.stringify(arr1))
                let arr2 = []
                res.data.register_member_change.map((item, index) => {
                    arr2.push(item.value)
                })
                this.register_member_change_data_yArr = JSON.parse(JSON.stringify(arr2))
                //注册时人数折线图
                this.getRegistered()

                //订单总数增长折线图数据
                let arr3 = []
                res.data.order_change.map((item, index) => {
                    arr3.push(item.name)
                })
                this.order_change_data_xArr = JSON.parse(JSON.stringify(arr3))
                let arr4 = []
                res.data.order_change.map((item, index) => {
                    arr4.push(item.value)
                })
                this.order_change_data_yArr = JSON.parse(JSON.stringify(arr4))
                //订单总数增长折线图
                this.getTotalOrdersChart()


                //取消原因统计柱状图
                let arr5 = []
                res.data.cancel_cause.map((item, index) => {
                    arr5.push(item.name)
                })
                let arr6 = []
                res.data.cancel_cause.map((item, index) => {
                    arr6.push(item.value)
                })
                this.getCancelReasonChart(JSON.parse(JSON.stringify(arr5)), JSON.parse(JSON.stringify(arr6)))

                //年龄饼图
                let agePieChart = this.$echarts.init(document.getElementById('agePieChart'))
                this.pieChart(agePieChart, '年龄比', res.data.retult_age)

                //性别饼状图
                let genderPieChart = this.$echarts.init(document.getElementById('genderPieChart'))
                this.pieChart(genderPieChart, '性别比', res.data.gender)

                //地区比饼状图
                let areaPieChart = this.$echarts.init(document.getElementById('areaPieChart'))
                this.pieChart(areaPieChart, '地区比', res.data.region)
            } else {
                that.$Message.warning(res.error)
            }
        }).catch(err => {
            console.log(err)
        })
    },


    methods: {
        //折线图
        lineChart(id, xArr, yArr) {
            id.setOption({
                // title: { text: '在Vue中使用echarts' },
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params, ticket, callback) {
                        let htmlStr = '';
                        let valMap = {};
                        for (let i = 0; i < params.length; i++) {
                            let param = params[i];
                            // let xName = param.name; //x轴的名称  
                            // let seriesName = param.seriesName; //图例名称  
                            let seriesName = param.name; //图例名称  
                            let value = param.value; //y轴值  
                            let color = param.color; //图例颜色  

                            //过滤无效值
                            if (value == '-') {
                                continue;
                            }
                            //过滤重叠值
                            if (valMap[seriesName] == value) {
                                continue;
                            }
                            htmlStr += '<div>';
                            //为了保证和原来的效果一样，这里自己实现了一个点的效果  
                            htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';

                            //圆点后面显示的文本  
                            htmlStr += seriesName + '：' + value;

                            htmlStr += '</div>';
                            valMap[seriesName] = value;
                        }
                        return htmlStr;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(30,30,30,0.3)', //左边线的颜色
                            }
                        },
                        axisLabel: {
                            show: true,
                            color: 'rgba(30,30,30,0.67)',

                        },
                        axisTick: {
                            show: false
                        },
                        data: xArr
                    }

                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: 'rgba(30,30,30,0.3)'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(30,30,30,0.3)', //左边线的颜色
                            }
                        },
                        lineStyle: {
                            type: 'solid',
                            color: 'rgba(30,30,30,0.3)',
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        data: yArr,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    position: 'top', //在上方显示
                                    textStyle: { //数值样式
                                        color: 'black',
                                        fontSize: 16
                                    }
                                }
                            }
                        },
                        areaStyle: {  //覆盖区域的渐变色
                            normal: {
                                // color: '#091e3b', //改变区域颜色
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#0F89D7' // 0% 处的颜色
                                }, {
                                    offset: 0.5, color: '#29BFF7' // 100% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }]
                                ),  //背景渐变色
                            }
                        }
                    }

                ]

            })
        },

        //注册时人数折线图
        getRegistered() {
            let registeredChart = this.$echarts.init(document.getElementById('registeredChart'))
            this.lineChart(registeredChart, this.register_member_change_data_xArr, this.register_member_change_data_yArr)
        },

        //饼状图
        pieChart(id, title, data) {
            id.setOption({
                // color: ['#3398DB'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} :{d}%'
                },
                color: ['#0073FF', '#6DCCFF', '#C2EAFF'],   //环形颜色
                graphic: {       //图形中间文字
                    type: "text",
                    left: "center",
                    top: "center",
                    style: {
                        text: title,
                        textAlign: "center",
                        fill: "#333",
                        fontSize: 16
                    }
                },

                series: [
                    {
                        type: 'pie',
                        radius: ['30%', '60%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: { color: "#3c4858", fontSize: "12", fontWeight:'bold' },
                                    formatter: function (val) {
                                        //让series 中的文字进行换行
                                        return val.name + "(" + val.percent + "%)";
                                    }
                                },
                                labelLine: {
                                    show: true,
                                    lineStyle: { color: "#3c4858" }
                                }
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                            textColor: "#000"
                        },
                        labelLine: {
                            show: true
                        },
                        data: data.filter(function (a) {
                            return a.value > 0
                        })
                    }
                ]
            })
        },

        //订单总数增长折线图
        getTotalOrdersChart() {
            let totalOrdersChart = this.$echarts.init(document.getElementById('totalOrdersChart'))
            this.lineChart(totalOrdersChart, this.order_change_data_xArr, this.order_change_data_yArr)
        },

        //取消原因统计柱状图
        getCancelReasonChart(xArr, yArr) {
            let cancelReasonChart = this.$echarts.init(document.getElementById('cancelReasonChart'))
            cancelReasonChart.setOption({
                color: ['#6DCCFF'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xArr,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: '60%',
                        data: yArr,
                        itemStyle: {        //上方显示数值
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    position: 'top', //在上方显示
                                    textStyle: { //数值样式
                                        color: 'black',
                                        fontSize: 16
                                    }
                                }
                            }
                        }
                    }
                ]
            })
        }
    }
}