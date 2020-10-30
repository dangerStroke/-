export default {
    name: 'newComerPack',
    data() {
        return {
            packList: [], //优惠券列表
            selectPack: [], //选择礼包
            timevalue: '', //选择时间的值
            numbers: '', //优惠卷数量
            isDisabled: true, //页面输入框是否禁用
            start_date: '', //开始日期
            end_date: '', //结束日期
            isDataNull: false, //第一次进来是否有数据
            selectPackid: [], //首次进来选中的优惠卷id
            idEdit: false,
        }
    },
    created() {
        this.$Spin.show()
        // this.getRegisterActivity() //获取新人活动
        this.getCouponList() //获取优惠卷列表
    },
    methods: {
        //获取新人活动
        getRegisterActivity() {
            this.$fetch('/admin/register-activity/get').then(res => {
                this.$Spin.hide()
                if (res.code == 200) {
                    if (res.data.id) {
                        //有数据就是出现修改按钮
                        this.isDataNull = true
                        //将时间显示在页面上
                        this.timevalue = res.data.start_date + " - " + res.data.end_date
                        this.start_date = res.data.start_date
                        this.end_date = res.data.end_date
                        //将优惠卷展示在页面上
                        // console.log(JSON.parse(res.data.coupon))
                        let couponList = JSON.parse(res.data.coupon)
                        let checkedList = []
                        let checkIdArr = []
                        couponList.map((item, index) => {
                            this.packList.map((packItem, packIndedx) => {
                                if (item.coupon_id == packItem.id) {
                                    checkedList.push(item)
                                    checkIdArr.push(item.coupon_id)
                                    packItem.numbers = item.numbers
                                    packItem.checked = true
                                }
                            })
                        })
                        this.selectPack = checkIdArr
                        this.packList.map(item => {
                            if (!item.checked) {
                                item.numbers = null
                            }
                        })

                    } else {
                        //没数据出现新建按钮
                        this.isDataNull = false
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
        },
        //获取优惠卷列表
        getCouponList() {
            let params = {
                page: 1,
                page_size: 1000,
                status: -1,
                route_id: 0
            }
            this.$fetch('/admin/coupon/list', params).then(res => {
                console.log(res)
                let list1 = []
                let list = res.data.ret.map(item => {
                    if (item.status == 2) {
                        list1.push(item)
                    }
                    return list1
                })
                // console.log(list[0])
                this.packList = list[0]
                this.getRegisterActivity()
                this.selectPack = this.packList
                console.log(this.selectPack)

            })
        },
        //选中的数组
        changeGroup(e) {
            console.log(e)
        },
        //选择的时间
        selectTime(e) {
            console.log(e)
            this.start_date = this.getTimeMe(e[0])
            this.end_date = this.getTimeMe(e[1])
        },
        //转换时间格式
        getTimeMe(time) {
            const d = new Date(time)
            const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
            const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
            return resDate + ' ' + resTime
        },
        //时间补0操作
        p(s) {
            return s < 10 ? '0' + s : s
        },
        //修改按钮
        editPack(type) {
            let that = this
            console.log(type)
            if (type == 'new') {
                //新建按钮
                that.isDisabled = false
                that.idEdit = true
                that.isDataNull = false
            } else {
                this.$Modal.confirm({
                    title: '你确定修改礼包？修改后注册的用户礼包将更新',
                    onOk() {
                        //输入框可填
                        that.isDisabled = false
                        that.idEdit = true
                        that.isDataNull = false
                    },
                    onCancel() {
                        //输入框不可填
                        that.isDisabled = true
                        that.idEdit = false
                    }
                })
            }


        },
        //保存按钮
        sureEditPack() {
            let that = this
            let list = [] //list为选中之后的优惠卷列表
            console.log(this.selectPack)
            console.log(this.packList)
            this.packList.map((item, index) => {
                this.selectPack.map((selectItem, selectIndex) => {
                    // console.log(index, selectIndex)
                    if (item.id === selectItem) {
                        let itemObj = {
                            coupon_id: item.id,
                            numbers: Number(item.numbers)
                        }
                        list.push(itemObj)
                    }
                })
            })
            console.log(this.start_date)
            console.log(this.end_date)
            console.log(list)
            if (list.length > 5) {
                this.$Message.warning("最多只能选择5种优惠卷")
            } else {
                if (this.start_date && this.end_date && list.length > 0) {
                    let listNum = []
                    list.map((listItem, listIndex) => {
                        listNum.push(Number(listItem.numbers))
                    })
                    if (listNum.every(function (itemN, index) {
                        return itemN > 0
                    })) {
                        //全部填完,发送请求
                        console.log('可以发请求')
                        console.log(list)
                        this.$post('/admin/register-activity/save', {
                            start_date: this.start_date,
                            end_date: this.end_date,
                            coupon: list
                        }).then(res => {
                            console.log(res)
                            if (res.code == 200) {
                                //修改成功
                                this.$Message.info('操作成功')
                                this.getRegisterActivity()
                                that.isDisabled = true
                                this.idEdit = false
                            }

                        }).catch(err => {
                            this.$Spin.hide();
                            // this.$Message.warning("服务器端异常")
                        })

                    } else {
                        this.$Message.warning("请输入每人限领的优惠卷数量>=1")
                        return
                    }

                } else if (!this.start_date) {
                    this.$Message.warning("请选择开始日期")
                    return
                } else if (!this.end_date) {
                    this.$Message.warning("请选择结束日期")
                    return
                } else if (list.length === 0) {
                    this.$Message.warning("请选择优惠礼包")
                    return
                }
            }
        },
        //取消按钮
        cancel() {
            this.isDisabled = true
            this.getRegisterActivity()
            this.idEdit = false
        },
        //清空时间按钮
        clearTime() {
            this.start_date = ''
            this.end_date = ''
        }
    }
}