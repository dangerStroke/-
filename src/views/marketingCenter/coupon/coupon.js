export default {
    name: 'coupon',
    data() {
        return {
            columns12: [
                {
                    title: '状态',
                    slot: 'status',
                    align: 'center'
                },
                {
                    title: '优惠卷编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '面值金额(分)',
                    key: 'money',
                    align: 'center'
                },
                {
                    title: '数量(张)',
                    slot: 'is_limit',
                    align: 'center'
                },
                {
                    title: '限用线路',
                    slot: 'route_id',
                    align: 'center'
                },
                {
                    title: '发放有效期(天)',
                    key: 'validity_day',
                    align: 'center'
                },
                {
                    title: '备注',
                    key: 'remark',
                    align: 'center'
                },
                {
                    title: '上架时间',
                    key: 'updated_at',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 200,
                    align: 'center'
                }
            ],
            data6: [], //页面数据
            queryParams: {
                status: '', //状态(上架或下架)
                route_id: ''
            }, //筛选的json数据
            statusList: [
                {
                    value: 1,
                    label: '未上架'
                },
                {
                    value: 2,
                    label: '上架'
                }, {
                    value: 3,
                    label: '已下架'
                },
                // {
                //     value: 4,
                //     label: '删除'
                // }
            ], //状态的列表
            routeList: [], //路线选择的下拉
            modal: false, //新建或者修改的模态框的显示隐藏
            modalTitle: '', //模态框的标题
            formLeft: {},
            limitedRouteList: [], //限用路线
            page: 1,
            pagesize: 10,
            total: 0,
            makeSureEditId: '', //确认修改的某一条数据的id
        }
    },
    created() {
        this.$Spin.show()
        this.getRouteList() // 获取线路下拉数据
        this.getTableData() // 获取数据
    },
    methods: {
        //获取数据和搜索按钮
        getTableData(type) {
            //table数据
            if (type !== "page") {
                this.page = 1;
            }
            let params = {
                page: this.page,
                page_size: this.pagesize,
                status: this.queryParams.status || -1,
                route_id: this.queryParams.route_id || 0
            }
            this.$fetch('/admin/coupon/list', params).then(res => {
                this.$Spin.hide();
                // console.log(res)
                if (res.code == 200) {
                    let list1 = []
                    let list = res.data.ret.map(item => {
                        if (item.status !== 4) {
                            list1.push(item)
                        }
                        return list1
                    })
                    // console.log(list[0])
                    this.data6 = list[0]
                    this.total = res.data.total  // 总页数

                } else {
                    this.$Message.warning(res.error)
                }
            })
                .catch(err => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务器端异常")
                })
        },
        //获取线路数据
        getRouteList() {
            this.$fetch('/admin/index/select-route').then(res => {
                if (res.code == 200) {
                    // this.carBelongList = res.data
                    //对返回的json对象进行处理转成数组list value是id label是每个数据值
                    let list = Object.keys(res.data).map((item, index) => ({ value: item, label: res.data[item] }))
                    console.log(list)
                    let listCopy = JSON.parse(JSON.stringify(list))
                    listCopy.unshift({ value: "0", label: '全部路线' })
                    console.log(listCopy)
                    this.routeList = listCopy
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
        },
        //新建或修改的按钮
        newSite(row) {
            this.modal = true
            if (row.id) {
                //如果传了当前数据就是修改
                this.modalTitle = '修改优惠卷'
                this.formLeft = row
                this.formLeft.route_id = row.route_id.toString()
                this.formLeft.is_limit = row.is_limit.toString()
                this.makeSureEditId = row.id
            } else {
                //新建
                this.modalTitle = '新建优惠卷'
                this.formLeft = {}
            }
        },
        //新建或修改弹窗的确定按钮
        infoSure(type) {
            console.log(type)
            if (type == "新建优惠卷") {
                //新建优惠卷
                let updateData = this.formLeft
                // console.log(updateData)
                if (updateData.money && updateData.validity_day && updateData.is_limit && updateData.route_id) {
                    //全部填完
                    if (updateData.is_limit === "0" && updateData.numbers) {
                        //发送请求
                        this.$post('/admin/coupon/add', updateData).then(res => {
                            console.log(res)
                            if (res.code == 200) {
                                //新增成功,给出提示，刷新页面
                                this.$Message.info('新增优惠卷成功')
                                this.getTableData()
                                this.modal = false
                            } else {
                                this.$Message.warning(res.error)
                            }
                        }).catch(err => {
                            this.$Spin.hide();
                            // this.$Message.warning("服务器端异常")
                        })
                    } else if (updateData.is_limit === "0" && !updateData.numbers) {
                        this.$Message.warning("请填写限量数量")
                        return
                    }
                    if (updateData.is_limit === "1") {
                        updateData.numbers = 0
                        //发送请求
                        this.$post('/admin/coupon/add', updateData).then(res => {
                            // console.log(res)
                            if (res.code == 200) {
                                //新增成功,给出提示，刷新页面
                                this.$Message.info('新增优惠卷成功')
                                this.getTableData()
                                this.modal = false
                            }
                        }).catch(err => {
                            this.$Spin.hide();
                            // this.$Message.warning("服务器端异常")
                        })
                    }
                } else if (!updateData.money) {
                    this.$Message.warning("请输入面值金额")
                    return
                } else if (!updateData.validity_day) {
                    this.$Message.warning("请输入有效天数")
                    return
                } else if (!updateData.is_limit) {
                    this.$Message.warning("请选择发放数量")
                    return
                } else if (!updateData.route_id) {
                    this.$Message.warning("请选择限用路线")
                    return
                }
            } else if (type == "修改优惠卷") {
                //修改优惠卷
                let updateData = this.formLeft
                // console.log(updateData)
                if (updateData.money && updateData.validity_day && updateData.is_limit && updateData.route_id) {
                    //全部填完
                    if (updateData.is_limit === "0" && updateData.numbers) {
                        //发送请求
                        this.$post('/admin/coupon/save', updateData).then(res => {
                            console.log(res)
                            if (res.code == 200) {
                                //新增成功,给出提示，刷新页面
                                this.$Message.info('修改优惠卷成功')
                                this.getTableData()
                                this.modal = false
                            } else {
                                this.$Message.warning(res.error)
                            }
                        }).catch(err => {
                            this.$Spin.hide();
                            // this.$Message.warning("服务器端异常")
                        })
                    } else if (updateData.is_limit === "0" && !updateData.numbers) {
                        this.$Message.warning("请填写限量数量")
                        return
                    }
                    if (updateData.is_limit === "1") {
                        updateData.numbers = 0
                        //发送请求
                        this.$post('/admin/coupon/save', updateData).then(res => {
                            // console.log(res)
                            if (res.code == 200) {
                                //新增成功,给出提示，刷新页面
                                this.$Message.info('修改优惠卷成功')
                                this.getTableData()
                                this.modal = false
                            }
                        }).catch(err => {
                            this.$Spin.hide();
                            // this.$Message.warning("服务器端异常")
                        })
                    }
                } else if (!updateData.money) {
                    this.$Message.warning("请输入面值金额")
                    return
                } else if (!updateData.validity_day) {
                    this.$Message.warning("请输入有效天数")
                    return
                } else if (!updateData.is_limit) {
                    this.$Message.warning("请选择发放数量")
                    return
                } else if (!updateData.route_id) {
                    this.$Message.warning("请选择限用路线")
                    return
                }
            }
        },
        //清空的按钮
        clearSerach() {
            this.queryParams.status = ''
            this.queryParams.route_id = ''
            this.getTableData()
        },
        //新建或修改弹窗的取消按钮
        cancel(type) {
            //如果是新建站点，就把之前的内容清空
            this.formLeft = {}
            this.modal = false
            this.getTableData()
        },
        //修改状态的按钮
        changeStatus(row, type, index) {
            console.log(row)
            if (type == 'onPutSelf') {
                //上架按钮
                this.changeStatusMethod(row, 'onPutSelf')
            } else if (type == 'offSelf') {
                //下架按钮
                this.changeStatusMethod(row, 'offSelf')
            } else if (type == 'delete') {
                //删除按钮
                this.changeStatusMethod(row, 'delete', index)
            }
        },
        //修改状态的方法
        changeStatusMethod(row, type, index) {
            let that = this
            let typeMsg = ''
            if (type == 'onPutSelf') {
                typeMsg = '上架'
            } else if (type == 'offSelf') {
                typeMsg = '下架'
            } else if (type == 'delete') {
                typeMsg = '删除'
            }
            this.$Modal.confirm({
                title: `你确定要${typeMsg}编号为${row.id}的优惠卷吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk: function () {
                    let status = ''
                    if (typeMsg == '上架') {
                        status = 2
                    } else if (typeMsg == '下架') {
                        status = 3
                    } else if (typeMsg == '删除') {
                        status = 4
                    }
                    this.$post('/admin/coupon/change-status', {
                        id: row.id,
                        status
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            //修改成功
                            this.$Message.info(typeMsg + '成功')
                            that.getTableData()
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })
                },
                onCancel: function () {
                    console.log('点击了取消删除')
                }
            })
        },
        //页码
        changePage(e) {
            this.page = e;
            this.getTableData("page");
        },
    }

}