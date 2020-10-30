import route from './route.less'
export default {
    name: 'route',
    data() {
        return {
            columns12: [
                {
                    title: '线路编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '起始站点',
                    key: 'station1_name',
                    align: 'center'
                },
                {
                    title: '终止站点',
                    key: 'station2_name',
                    align: 'center'
                },
                {
                    title: '线路价格',
                    key: 'priceText',
                    align: 'center'
                },
                {
                    title: '儿童价',
                    key: 'child_price',
                    align: 'center'
                },
                {
                    title: '线路原价',
                    key: 'originPrice',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            formLeft: {
                routeId: '',
                siteStart: '',
                siteEnd: '',
                sitePrice: ''
            }, //新建站点的输入框的内容
            showEdit: false,
            title: "新建路线",
            page: 1,
            pagesize: 10,
            total: 0,
            routeList: [],
            stationList: [],
            editInfo: {
                id: "",
                station1: null,
                station2: null,
                price: null,
                child_price:null,
                adult_original_price: null
            },
            showDelete: false,
            deleteId: ""
        }
    },
    created() {
        this.$Spin.show();
        this.getRouteList("")
        this.getStation()
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e
            this.getRouteList("page")
        },
        // 确认删除
        submitDelete () {
            this.$fetch(`admin/citytransport/del-route?id=${this.deleteId}`).then(res => {
                this.$Spin.hide();
                this.deleteModalChange("hide","")
                if (res.code === 200) {
                    this.$Message.success("删除成功")
                    this.getRouteList("")
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
            })
        },
        // 删除弹窗
        deleteModalChange(type, id) {
            if (type === "show") {
                this.deleteId = id
                this.showDelete = true
            } else {
                this.deleteId = ""
                this.showDelete = false
            }
        },
        // 新建/修改线路
        editRoute() {
            console.log(this.editInfo.child_price)
            let text = ""
            if (!this.editInfo.station1) {
                this.$Message.warning("请选择起始站点")
                return
            }
            if (!this.editInfo.station2) {
                this.$Message.warning("请选择终止站点")
                return
            }
            if (!this.editInfo.price) {
                this.$Message.warning("请填写线路价格")
                return
            } 
            if (!this.editInfo.child_price) {
                this.$Message.warning("请填写儿童价")
                return
            }
            if (!this.editInfo.adult_original_price) {
                this.$Message.warning("请填写线路原价")
                return
            }
            let params = this.editInfo
            let url = ""
            if (this.title === "新建路线") {
                params.id = ""
                url = "admin/citytransport/add-route"
                text = "添加成功"
            } else {
                url = "admin/citytransport/edit-route"
                text = "修改成功"
            }
            // params.price = parseInt(Number(this.editInfo.price) * 100)
            params.price = (Number(this.editInfo.price)) * 1000000 / 10000
            params.child_price = (Number(this.editInfo.child_price)) * 1000000 / 10000
            params.adult_original_price = (Number(this.editInfo.adult_original_price)) * 1000000 / 10000
            this.$post(url, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.$Message.success(text)
                } else {
                    this.$Message.warning(res.error)
                  
                }
                this.getRouteList("")
                this.modalChange("add", "cancle", {})
            })
            .catch(res => {
                this.$Spin.hide();
            })
        },
        // 弹窗控制
        modalChange(name, type, row) {
            if (name === "add") {
                this.title = "新建路线"
            } else {
                this.title = "编辑路线"

            }
            if (type === "cancle") {
                this.showEdit = false
                this.editInfo = {
                    station1: null,
                    station2: null,
                    price: null,
                    child_price:null,
                    adult_original_price: null
                }
            } else {
                this.showEdit = true
                if (row) {
                    this.editInfo.id = row.id
                    this.editInfo.station1 = row.station1
                    this.editInfo.station2 = row.station2
                    this.editInfo.price = row.priceText
                    this.editInfo.adult_original_price = row.originPrice
                    this.editInfo.child_price = row.child_price
                }
            }
        },
        // 获取站点列表
        getStation() {
            this.$fetch(`/admin/index/select-station`).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        let data = res.data
                        let stationList = []
                        for (let key in data) {
                            let obj = {
                                name: data[key],
                                value: Number(key)
                            }
                            stationList.push(obj)
                        }
                        this.stationList = stationList
                    }
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })
        },
        // 获取线路列表
        getRouteList(type) {
            if (type !== "page") {
                this.page = 1
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize
            }
            this.$fetch(`admin/citytransport/list-route`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.total = res.data.total
                    let data = res.data.data
                    data.map(item => {
                        item.priceText = (Number(item.price) / 100).toFixed(2)
                        item.child_price = (Number(item.child_price) / 100).toFixed(2)
                        item.originPrice = (Number(item.adult_original_price) / 100).toFixed(2)
                    })
                    this.routeList = data
                }else{
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })
        },
    }

}