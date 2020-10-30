import html2canvas from 'html2canvas';
export default {
    name: 'dispatchCenter',
    data() {
        return {
            model1: '', //线路下拉框
            routeList: [],
            success_number: null, //当前已完成订单数量
            wait_number: null, //当前待出行订单数量
            columns1: [
                {
                    title: '订单编号',
                    key: 'order_sn',
                    tooltip: true,
                    align: 'center'
                },
                {
                    title: '线路',
                    key: 'route',
                    align: 'center',
                },
                {
                    title: '乘车人',
                    key: 'name',
                    render: (h, params) => {
                        let len = params.row.name.length - 1;
                        let xing = '';
                        for (let i = 0; i < len; i++) {
                            xing += '*';
                        }
                        let name1 = params.row.name.substring(0, 1) + xing
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'person'
                                }
                            }),
                            h('strong', name1)
                        ]);
                    },
                    align: 'center',
                },
                {
                    title: '乘客电话',
                    key: 'phone',
                    tooltip: true,
                    align: 'center'
                },
                {
                    title: '发车日期',
                    key: 'date',
                    align: 'center'
                },
                {
                    title: '发车时间',
                    key: 'time',
                    align: 'center',
                },
                {
                    title: '司机',
                    key: 'driver_name',
                    align: 'center',
                },
                {
                    title: '车牌号',
                    key: 'car_no',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ], //未导出table title

            columns15: [
                {
                    title: "类目",
                    key: "name"
                },
                {
                    title: "金额",
                    key: "price"
                },
                {
                    title: "司机佣金",
                    key: "commission"
                }
            ],//订单详情的模态框title

            columns2: [
                {
                    title: '订单编号',
                    key: 'order_sn',
                    tooltip: true,
                    align: 'center',
                    width: 200
                },
                {
                    title: '线路',
                    key: 'route',
                    align: 'center',
                },
                {
                    title: '乘车人',
                    key: 'name',
                    render: (h, params) => {
                        let len = params.row.name.length - 1;
                        let xing = '';
                        for (let i = 0; i < len; i++) {
                            xing += '*';
                        }
                        let name1 = params.row.name.substring(0, 1) + xing
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'person'
                                }
                            }),
                            h('strong', name1)
                        ]);
                    },
                    align: 'center',
                    width: 80
                },
                {
                    title: '乘客电话',
                    key: 'phone',
                    tooltip: true,
                    align: 'center'
                },
                {
                    title: '发车日期',
                    key: 'date',
                    align: 'center'
                },
                {
                    title: '发车时间',
                    key: 'time',
                    align: 'center',
                },
                {
                    title: '司机',
                    key: 'driver_name',
                    align: 'center',
                },
                {
                    title: '车牌号',
                    key: 'car_no',
                    align: 'center'
                }
            ],//导出table title
            data11: [],//模态框表格
            data1: [],  //未导出table数据
            data2: [],  //导出table数据
            currentDate: '', //当前日期
            classData: [], //班次数据
            clickIndex: 0, //当前点击的index
            firstClassDataId: null, //班次默认的id
            getOrderListId: null, //获取订单信息的id
            detailInfoModal: false, //详情模态框
            detailContent: {}, //订单详情的内容
            detailInfo: {},
            routeId: null,
            isExport: true, //是否导出
            exportInfo: {}, //导出的头部信息

        }
    },
    components: {
        html2canvas
    },
    created() {
        this.$Spin.show();
    },
    mounted() {
        //获取今日日期
        this.getDay()
        //获取选择线路下拉数据
        this.selectRouteList()
        //默认成都-康定的数据
    },
    methods: {
        //获取今日日期
        getDay() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let currentdate = year + '-' + month + '-' + strDate;
            this.currentDate = currentdate;
            this.$Spin.hide();
        },
        //获取线路下拉
        selectRouteList() {
            let that = this
            this.$fetch("/admin/index/select-route").then(res => {
                let list = Object.keys(res.data).map((item, index) => ({ value: item, label: res.data[item] }))
                that.routeList = list
                console.log(list)
                that.model1 = list[0].value
                that.firstClassDataId = list[0].value
                this.routeId = list[0].value
                //将默认线路id传给获取班次接口
                this.getRouteClass(list[0].value)

            })
        },

        //请求线路班次
        getRouteClass(route_id) {
            let that = this
            this.$fetch('/admin/index/get-dispatch-classes', {
                route_id
            }).then(res => {
                console.log(res)
                console.log(res.data.order)
                if (res.code == 200) {
                    that.success_number = res.data.order.success_number //当前已完成订单数量
                    that.wait_number = res.data.order.wait_number //当前待出行订单数量
                    if(res.data.list.length>0){
                        //如果订单列表有数据
                        that.classData = res.data.list
                        //默认的第一个班次
                        //默认为第一个班次的订单信息
                        console.log(that.classData[0])
    
                        this.getOrderListId = that.classData[0].id
                        console.log(this.getOrderListId)
                        console.log(that.classData[0].id)
                        this.$fetch('/admin/index/get-dispatch-order', {
                            id: that.classData[0].id
                        }).then(res => {
                            console.log(res)
                            if (res.code == 200) {
                                that.data1 = res.data
                            } else {
                                that.$Message.warning(res.error)
                            }
                        })

                    }else{
                        that.$Message.info('该路线暂无班次')
                        that.classData = []
                        that.data1 = []
                    }

                } else {
                    that.$Message.warning(res.error)
                }

            })
        },

        //线路下拉改变
        routeClassChange(e) {
            console.log(e) //e是value和label
            let route_id = parseInt(e.value)
            this.routeId = route_id
            this.getOrderListId = null
            //改变班次下拉,获取班次信息
            this.getRouteClass(route_id)
        },

        //点击班次时间,获取table数据
        clickRouteTime(index, item) {
            let that = this
            console.log(item.id)
            this.clickIndex = index
            this.getOrderListId = item.id
            this.$fetch('/admin/index/get-dispatch-order', {
                id: item.id
            }).then(res => {
                console.log(res)
                if (res.code == 200) {
                    that.data1 = res.data
                } else {
                    that.$Message.warning(res.error)
                }
            })
        },
        //刷新按钮
        refresh() {
            console.log(this.routeId)
            let that = this
            // this.getRouteClass(this.routeId)
            // 默认的id 点击班次之后的id: this.getOrderListId

            console.log(this.getOrderListId)
            this.$Spin.show();
            if(this.getOrderListId == null){
                //没有班次信息，所以班次信息的id为null
                this.$Spin.hide();
                this.$Message.info('暂无班次信息')
            }else{
                this.$fetch('/admin/index/get-dispatch-order', {
                    id: this.getOrderListId
                }).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        that.data1 = res.data
                        this.$Spin.hide();
                    } else {
                        this.$Spin.hide();
                        that.$Message.warning(res.error)
                    }
                })
                console.log(this.routeId)
                this.$fetch('/admin/index/get-dispatch-classes', {
                    route_id: that.routeId
                }).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        that.success_number = res.data.order.success_number //当前已完成订单数量
                        that.wait_number = res.data.order.wait_number //当前待出行订单数量
                        that.classData = res.data.list
                    } else {
                        that.$Message.warning(res.error)
                    }
    
                })
            }

        },

        //详情按钮
        show(row) {
            console.log(row)
            this.detailInfoModal = true
            // this.detailInfo = row
            this.modal1 = true;
            this.$fetch('/admin/order/detail', {
                order_id: row.id
            }).then(res => {
                if (res.code === 200) {
                    console.log(res)
                    this.detailInfo = res.data
                    //计算取消订单时间
                    if (this.detailInfo.cancel_time !== 0) {
                        this.detailInfo.cancel_time = this.timestampToTime(this.detailInfo.cancel_time)
                    } else if (this.detailInfo.refund_time !== 0) {
                        //计算退款时间
                        this.detailInfo.refund_time = this.timestampToTime(this.detailInfo.refund_time)
                    }
                    //计算改签时间
                    if (this.detailInfo.change_ticket_time !== 0) {
                        this.detailInfo.change_ticket_time = this.timestampToTime(this.detailInfo.change_ticket_time)
                    }
                    //计算发车时间
                    this.detailInfo.ticket_time = this.timestampToTime(this.detailInfo.ticket_time)
                    //判断订单状态
                    if (this.detailInfo.status == 1) {
                        this.detailInfo.status = '未支付'
                        this.detailInfo['orderType'] = '未支付'
                    } else if (this.detailInfo.status == 3 || this.detailInfo.status == 2) {
                        this.detailInfo.status = '待出行'
                        this.detailInfo['orderType'] = '已支付'
                    } else if (this.detailInfo.status == 9) {
                        this.detailInfo.status = '已完成'
                        this.detailInfo['orderType'] = '已支付'
                    } else if (this.detailInfo.status == 8) {
                        this.detailInfo.status = '订单已取消'
                        this.detailInfo['orderType'] = '未支付'
                    } else if (this.detailInfo.status == 6) {
                        this.detailInfo.status = '改签成功'
                        this.detailInfo['orderType'] = '已支付'
                    } else if (this.detailInfo.status == 5) {
                        this.detailInfo.status = '已退票'
                        this.detailInfo['orderType'] = '未支付'
                    } else if (this.detailInfo.status === 11) {
                        this.detailInfo.status = '已完成',
                            this.detailInfo['orderType'] = '已支付'
                    }
                    let data11 = [

                    ]
                    res.data.order.forEach(res => {
                        console.log(res)
                        res.commission = (res.commission / 100).toFixed(2)
                        res.price = (res.price / 100).toFixed(2)
                        data11.push(res)
                    })
                    this.data11 = data11
                    console.log(this.detailInfo)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //取消
        remove(index, row) {
            console.log(row)
            console.log(this.routeId)
            this.$fetch('/admin/order/detail', {
                order_id: row.id
            }).then(res => {
                console.log(res)
                if (res.code == 200) {
                    let row = res.data
                    if (row.status == 2) {
                        this.$Modal.confirm({
                            content: `你确定要删除该订单?<br>若确定取消,该订单金额将全部退还`,
                            onOk: () => {
                                let params = {
                                    order_sn: String(row.order_sn),
                                    uid: String(row.uid)
                                }
                                this.$fetch("/admin/order/refund", params).then(res => {
                                    if (res.code == 200) {
                                        this.$Message.success({
                                            content: '订单取消成功',
                                            duration: 2
                                        })
                                        this.refresh()
                                        // this.getRouteClass(this.routeId)

                                    } else {
                                        this.$Message.error({
                                            content: res.error,
                                            duration: 2
                                        })
                                    }
                                }).catch(err => {
                                    this.$Spin.hide();
                                    // this.$Message.warning("服务器端异常")
                                })
                            }
                        });
                    } else if (row.status == 8 || row.status == 5) {
                        this.$Message.error({
                            content: '订单取消成功',
                            duration: 2
                        })
                        this.refresh()
                        // this.getRouteClass(this.routeId)
                    } else if (row.status == 1) {
                        this.$Modal.confirm({
                            content: `你确定要删除该订单?`,
                            onOk: () => {
                                let params = {
                                    order_sn: String(row.order_sn),
                                }
                                this.$fetch("/admin/order/cancel", params).then(res => {
                                    if (res.code == 200) {
                                        this.$Message.success({
                                            content: '订单取消成功',
                                            duration: 2
                                        })
                                        this.refresh()
                                        // this.getRouteClass(this.routeId)
                                    } else {
                                        this.$Message.error({
                                            content: res.error,
                                            duration: 2
                                        })
                                    }
                                }).catch(err => {
                                    this.$Spin.hide();
                                })
                            }
                        });
                    }

                } else {
                    this.$Message.error(res.error)
                }
            })


        },

        //日期获取
        timestampToTime(timestamp) {
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y + M + D + h + m + s;
        },

        //导出按钮
        exportImg() {
            console.log(this.getOrderListId)
            if(this.data1.length<=0){
                //没有班次信息,阻止它显示导出
                this.$Message.info('暂无可导出班次订单')
            }else{
                this.isExport = false
                //班次id传给后端
                this.$fetch('/admin/index/export-dispatch-data', {
                    id: this.getOrderListId
                }).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.exportInfo = res.data.info //导出数据的信息头
                        this.data2 = res.data.list
                    } else {
                        that.$Message.warning(res.error)
                    }
                })
            }
        },

        //导出成图片的导出按钮
        exportPic() {
            html2canvas(this.$refs.pic, {
                backgroundColor: '#fff',
                scale: 2,
                dpi: window.devicePixelRatio // 设备像素比
            }).then((canvas) => {
                // console.log(canvas)
                let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                // console.log(image)
                let userAgent = navigator.userAgent;
                //导出图片的文件名
                let name = this.exportInfo.ticket_time
                console.log(name)
                // 兼容ie
                if (userAgent.includes("Trident")) {
                    let arr = image.split(',');
                    let mime = arr[0].match(/:(.*?);/)[1];
                    let bstr = atob(arr[1]);
                    let n = bstr.length;
                    let u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    window.navigator.msSaveBlob(new Blob([u8arr], { type: mime }), `${name}.jpg`);
                } else {
                    let imgData = canvas.toDataURL("image/jpeg");
                    let aLink = document.createElement("a");
                    aLink.style.display = "none";
                    aLink.href = imgData;
                    aLink.download = `${name}.jpg`;
                    document.body.appendChild(aLink);
                    aLink.click();
                    document.body.removeChild(aLink);

                }

             

                // let url = canvas.toDataURL('image/png');
                // // console.log(url)
                // // 生成一个a元素
                // let a = document.createElement('a')
                // // 创建一个单击事件
                // let event = new MouseEvent('click')
                // // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                // a.download = name || '下载当前班次订单'
                // // 将生成的URL设置为a.href属性
                // a.href = url
                // // 触发a的单击事件
                // a.dispatchEvent(event)
            })
        }


    }
}