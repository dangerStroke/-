export default {
    name: "list",
    data() {
        return {
            statusList: [
                {
                    label: "全部",
                    value: 0
                },
                {
                    label: "咨询中",
                    value: 1
                },
                {
                    label: "已确认",
                    value: 2
                },
                {
                    label: "已完成",
                    value: 3
                },
                {
                    label: "已取消",
                    value: 4
                }
            ],
            columns: [
                {
                    title: '操作',
                    slot: 'action',
                    align: "center",
                    width: 400
                },
                {
                    type: "index",
                    title: "序号",
                    width: 80,
                    align: "center"
                },
                {
                    title: '咨询状态',
                    key: 'status_text',
                    width: 100
                },
                {
                    title: '姓名',
                    key: 'name',
                    width: 140
                },
                {
                    title: '电话',
                    key: 'phone',
                    width: 130
                },
                {
                    title: '线路',
                    key: 'route_text',
                    width: 160
                },
                {
                    title: '出发日期',
                    key: 'ticket_time_string',
                    width: 130
                },
                {
                    title: '人数',
                    key: 'member_number',
                    width: 80
                },
                {
                    title: '上车地址',
                    key: 'start_name',
                    width: 250
                },
                {
                    title: '下车地址',
                    key: 'end_name',
                    width: 250
                },
                {
                    title: '备注',
                    key: 'remark',
                    width: 200
                }
                
            ],
            listData: [],
            page: 1,
            pagesize: 10,
            total: 0,
            deleteId: "",
            name: "",
            status: -1,
            ticket_time: "",
            showDeleta: false,
            showAdd: false,
            routeList: [],
            modalTitle: "新建咨询",
            editInfo: {
                name: "",
                member_number: null,
                phone: "",
                route: "",
                class: "",
                start_name: "",
                end_name: "",
                remark: "",
                ticket_time: "",
                id: ""
            },
            options3: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            timerList: [],
            editType: "add",
            showDetail: false
        }
    },
    watch: {
        editInfo: {
            handler() {
                // this.$refs.resetSelect.clearSingleSelect()
                if (this.editType != 'detail') {
                    if (this.editInfo.route && this.editInfo.ticket_time) {
                        this.getTimers()
                        console.log(123)
                        console.log(this.editInfo)
                    }
                }
            },
            deep: true
        }
    },
    created() {
        this.getRouteList()
        this.getList()
    },
    methods: {
        // 修改咨询状态
        changeStatus (id,status) {
            let params = {
                id,
                status
            }
            if (status === 4) {
                this.deleteArea(id)
            } else {
                this.bindDelete(id,status)
            }
            
        },
        bindDelete(id,status) {
            let params = {
                id,
                status
            }
            this.$post(`/admin/tel-reserve/change-status`, params).then(res => {
                if (res.code === 200) {
                    if (status === 4) {
                        this.deleteArea("")
                        this.$Message.success("取消成功")
                    } else {
                        this.$Message.success("修改成功")
                    }
                    this.getList("")
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                this.$Message.warning("服务端异常")
            })
        },
        // 确认修改
        confirmChange (params) {
            this.$post(`/admin/tel-reserve/change-status`,params).then(res => {
                if (res.code === 200) {}
            })
        },
        // 弹窗变化
        modalChange(e,type) {
            if (!e) {
                this.editType = ""
                this.editInfo = {
                    name: "",
                    member_number: null,
                    phone: "",
                    route: "",
                    class: "",
                    start_name: "",
                    end_name: "",
                    remark: "",
                    ticket_time: "",
                    id: ""
                }
            }
        },
        // 日期比较
        compareDate (time) {
            let now = new Date()
            let year = now.getFullYear()
            let month = now.getMonth() + 1
            let day = now.getDate()
            let timer = new Date(`${this.editInfo.ticket_time} ${time}`).getTime()
            let nowTimer = now.getTime()
            if (nowTimer >= timer) {
                return false
            } else {
                return true
            }
        },
        //日期选择
        dateChange (e,type) {
            if (type === "ticket_time") {
                this.ticket_time = e
            } else {
                this.$refs.resetSelect.clearSingleSelect()
                if (type === "date") {
                    this.editInfo.ticket_time = e
                }
            }
        },
        // 确认提交
        confirmSubmit (type) {
            let params = this.editInfo
            let title = ""
            if (this.editType==="edit") {
                title = "修改成功"
            } else {
                title = "添加成功"
            }
            let reg = /^1[3456789]\d{9}$/;
            if (!params.name) {
                this.$Message.warning("请填写乘客姓名")
                return
            }
            if (!params.member_number) {
                this.$Message.warning("请填写坐车人数（人数必须大于0）")
                return
            }
            if (!reg.test(params.phone)) {
                this.$Message.warning("请填写正确的手机号码")
                return
            }
            if (!params.route) {
                this.$Message.warning("请选择线路")
                return
            }
            if (!params.ticket_time) {
                this.$Message.warning("请选择出发日期")
                return
            }
            if (!params.class) {
                this.$Message.warning("请选择班次")
                return
            }
            if (!params.start_name) {
                this.$Message.warning("请填写上车地点")
                return
            }
            if (!params.end_name) {
                this.$Message.warning("请填写下车地点")
                return
            }
            params.ticket_time = new Date(params.ticket_time).getTime() / 1000
            this.$post(`/admin/tel-reserve/add`,params).then(res => {
                if (res.code === 200) {
                    this.$Message.success(title)
                    this.cancleEdit("cancle")
                    this.getList("")
                } else {
                    this.$Message.warning(res.error)
                }
            })
            
        },
        // 取消编辑 
        cancleEdit (type) {
            if (type==="cancle") {
                this.showAdd = false
                this.modalTitle = ""
                this.editInfo = {
                    name: "",
                    member_number: null,
                    phone: "",
                    route: "",
                    class: "",
                    start_name: "",
                    end_name: "",
                    remark: "",
                    ticket_time: "",
                    id: ""
                }
            } else {
                this.confirmSubmit(type)
            }
        },
        // 获取班次
        getTimers () {
            this.$fetch(`/admin/tel-reserve/get-class?station_route_id=${this.editInfo.route}&date=${this.editInfo.ticket_time}`).then(res => {
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        let data = res.data
                        let timerList = []
                        data.map(item => {
                            if (this.compareDate(item.start_time)) {
                                timerList.push(item)
                            }
                            if (this.editType === "edit" && this.editInfo.class === item.start_time) {
                                timerList.push(item)
                            }
                        })
                        this.timerList = timerList


                        // if (this.editType === 'edit') {
                        //     this.editInfo.class = this.editInfo.class
                        // }
                    }
                }
            })
        },
        // 获取线路列表
        getRouteList() {
            this.$fetch(`/admin/index/select-route`).then(res => {
                if (res.data) {
                    let data = res.data
                    let routeList = []
                    for (let key in data) {
                        let obj = {
                            name: data[key],
                            value: key
                        }
                        routeList.push(obj)
                    }
                    this.routeList = routeList
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })
        },
        // 分页页码改变
        changePage(e) {
            this.page = e;
            this.getList("page");
        },
        // 清空操作
        initData () {
            this.name = ""
            this.status = -1
            this.ticket_time = ""
            this.getList("")
        },
        // 获取区域列表
        getList(type) {
            let {page,pagesize,name,status,ticket_time} = this
            if (type !== "page") {
                this.page = 1;
            }
            let params = {page,pagesize,name,status,ticket_time}
            if (params.status <= 0) {
                params.status = ""
            }
            if (params.ticket_time) {
                params.ticket_time = new Date(params.ticket_time).getTime() / 1000
            }
            this.$fetch(`/admin/tel-reserve/get`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.total = res.data.total
                    let listData = res.data.data
                    listData.map(item => {
                        item.ticket_time_string = this.$formatDate(new Date(item.ticket_time * 1000),"yyyy-MM-dd")
                    })
                    this.listData = listData
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Message.warning("服务端异常")
            })
        },
        // 跳转到新建页面
        bindAdd(type,item) {
            this.editType = type
            if (type === "add") {
                this.showAdd = true
                this.modalTitle = "新建咨询"
            } else if (type === "edit") {
                this.showAdd = true
                this.modalTitle = "修改咨询"
                let {id,name,phone,member_number,route,start_name,end_name,remark} = item
                this.editInfo = {id,name,phone,member_number,route,start_name,end_name,remark}
                this.editInfo.ticket_time = item.ticket_time_string
                this.editInfo.class = item.class
            } else if (type === 'detail') {
                this.modalTitle = "咨询详情"
                item.ticket_time = item.ticket_time_string
                this.editInfo = item
                this.showAdd = false
                this.showDetail = true
            }
        },
        // 删除区域
        deleteArea(id) {
            if (id) {
                this.deleteId = id
                this.showDeleta = true
            } else {
                this.showDeleta = false
                this.deleteId = ""
            }
        },
        // 查看详情
        areaDetail(id) {
            this.$router.push({
                name: "areaDetail",
                params: {
                    id: id
                }
            })
        }
    },
}