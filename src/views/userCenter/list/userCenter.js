export default {
    data() {
        return {
            username: '',//用户姓名
            phone: null, //用户电话号码
            id: null, //用户id
            reg_type: '', //注册途径
            registrationRouteList: [],//注册途径列表

            columns1: [
                {
                    title: '用户编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '姓名',
                    slot: 'name',
                    align: 'center'
                },
                {
                    title: '手机号',
                    key: 'phone',
                    align: 'center'
                },
                {
                    title: '注册日期',
                    key: 'created_at',
                    align: 'center',
                    render: (h, params) => {
                        let time1 = params.row.created_at
                        let date = time1.substr(0,10)
                        return h('div', date)
                    }
                },
                {
                    title: '注册途径',
                    key: 'reg_type_name',
                    align: 'center'
                },
                {
                    title: '消费次数',
                    key: 'consume_times',
                    align: 'center'
                },
                {
                    title: '最近消费日期',
                    key: 'last_pay_time',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: 150,
                    slot: 'action',
                    align: 'center'
                }
            ],//table头部
            data1: [],
            detailModal: false, //详情的模态框
            voucherModal: false, //发券的模态框
            columns2: [
                {
                    title: '',
                    align: 'center',
                    type: 'selection'
                },
                {
                    title: '券类编码',
                    key: 'id',
                    align: 'center'
                }, {
                    title: '券名称',
                    slot: 'name',
                    align: 'center'
                }, {
                    title: '有效天',
                    key: 'validity_day',
                    align: 'center'
                }, {
                    title: '数量',
                    render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min: 0,
                                    value: params.row.couponNum
                                },
                                on: {
                                    // 编辑数量的时候,触发的事件
                                    'on-change': e => {
                                        params.row.couponNum = e
                                        this.data2[params.index] = params.row;
                                        this.voucherSelect.forEach((v, index) => { // 先循环选中的值,找到id,与所有data里的id进行比对
                                            if (v.id == params.row.id) {
                                                this.voucherSelect.splice(index, 1, params.row);
                                            }
                                        })
                                    }
                                }
                            })
                        ])
                    }
                }
            ],
            data2: [],
            coupon_num: 1, //模态框优惠卷数量
            page: 1,
            pagesize: 10,
            total: 0,
            voucherName: '', //发券人的名字
            voucherItem: {}, //券
            voucherSelect: [], //选中的优惠卷
            detailInfo: {}, //详情模态框内容
        }
    },
    components: {
    },
    created() {
    },
    mounted() {
        this.getUserList()
        this.getRegList()
    },

    watch: {
        '$route': 'getQuery'
    },

    methods: {
        // 注册途径的下拉
        getRegList() {
            this.$fetch('/admin/index/select-member-regtype').then(res => {
                if (res.code == 200) {
                    console.log(res.data)
                    let arr = []
                    res.data.map((value, index) => {
                        arr.push({ 'value': index, 'label': value })
                    })
                    this.registrationRouteList = arr
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide()
            })
        },
        //注册途径的下拉选择
        selectRegistrationRoute(e) {
            this.reg_type = e
        },
        //用户列表数据
        getUserList(type) {
            if (type !== "page") {
                this.page = 1
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize,
                phone: this.phone || '',
                username: this.username || '',
                id: this.id || '',
                reg_type: this.reg_type
            }

            this.$fetch('/admin/member/list', params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    console.log(res)
                    let data = res.data.data
                    this.data1 = data
                    this.total = res.data.total  // 总页数      
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //清空按钮
        clearSerach() {
            this.id = ''
            this.username = ''
            this.phone = ''
            this.reg_type = ''
            this.getUserList()
        },
        //获取url参数
        getQuery() {
            //从详情页发卷跳转回的发卷弹窗
            if (this.$route.query.id) {
                console.log('路由有变化', this.$route.query.id)
                this.voucherModal = true
                this.detailModal = false
                //获取优惠卷列表
                this.getCouponList()
                //获取该用户姓名
                this.$fetch('/admin/member/detail', {
                    uid: this.$route.query.id
                }).then(res => {
                    if (res.code == 200) {
                        if(res.data.username){
                            this.voucherName = res.data.username + "(" + res.data.nickname + ")"
                        }else{
                            this.voucherName =  "(" + res.data.nickname + ")"
                        }
                        this.voucherItem['id'] = this.$route.query.id
                    } else {
                        this.$Message.warning(res.error)
                    }
                }).catch(err => {
                    this.$Spin.hide();
                })

            } else {
                //不是从详情页跳转回的，路由无变化
                console.log('路由无变化')
            }
        },

        //详情模态框
        detail(row) {
            this.detailModal = true
            this.$fetch('/admin/member/detail', {
                uid: row.id
            }).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.detailInfo = res.data
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })

            this.$router.push({
                name: "userCoupon",
                params: {
                    id: row.id
                }
            })
        },
        //发卷弹窗里的优惠券列表
        getCouponList() {
            let params = {
                page: 1,
                page_size: 100,
                status: -1,
                route_id: 0
            }
            this.$fetch('/admin/coupon/list', params).then(res => {
                if (res.code == 200) {
                    let data = res.data.ret
                    data.forEach(element => {
                        element.couponNum = 0
                    });
                    this.data2 = data
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //发券模态框
        voucher(row) {
            this.voucherItem = row
            this.voucherModal = true
            console.log(row)

            if(row.username){
                console.log(row.username)
                this.voucherName = row.username + "(" + row.nickname + ")"
            }else{
                this.voucherName =  "(" + row.nickname + ")"
            }
            //获取优惠卷列表
            this.getCouponList()
        },
        //发券模态框赠送按钮
        voucherOk() {
            console.log(111)
            //voucherSelect 选中的优惠券列表
            // console.log(this.voucherSelect)
            console.log(this.voucherItem)
            let id = this.voucherItem.id

            if (this.voucherSelect.length >= 1) {
                let flag = false
                this.voucherSelect.map(item => {
                    if (item.couponNum > 0) {
                        flag = true
                    } else {
                        this.$Message.error('请填写数量')
                        flag = false
                    }
                })
                if (flag) {
                    console.log(222)
                    let couponList = this.voucherSelect
                    const arr = couponList.map(({ id, couponNum }) => ({ id, couponNum }))
                    let arr2 = []
                    arr.map((value, index) => {
                        arr2.push({ 'couponid': value.id, 'num': value.couponNum })
                    })
                    this.$post('/admin/coupon/grant', {
                        uid: id,
                        coupon: JSON.stringify(arr2)
                    }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info('赠送优惠卷成功')
                            this.voucherModal = false
                        } else {
                            this.$Message.warning(res.error)
                            this.voucherModal = true
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                    })
                }

            } else {
                this.$Message.error('请勾选赠送的优惠卷')
                this.voucherModal = true
            }

        },
        select(selection) {
            console.log(selection)
            //selection 已选中的项
            this.voucherSelect = selection;
        },
        //发券模态框的取消按钮
        voucherCancel() {
            this.voucherModal = false
        },



        //详情模态框的取消按钮
        detailCancel() {
            this.$router.push({
                path: '/userCenter',
            })
        },


        //页码
        changePage(e) {
            this.page = e;
            this.getUserList("page")
        },

    }
}