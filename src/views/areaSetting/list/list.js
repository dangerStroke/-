export default {
    name: "list",
    data() {
        return {
            columns: [
                {
                    type: "index",
                    title: "序号",
                    width: 80,
                    align: "center"
                },
                {
                    title: '区域名称',
                    key: 'name'
                },
                {
                    title: '默认上车地址',
                    key: 'addr'
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: "center"
                },
            ],
            listData: [],
            page: 1,
            pagesize: 10,
            total: 0,
            deleteId: "",
            showDeleta: false,
        }
    },
    created() {
        this.$Spin.show();
        this.getList()
    },
    methods: {
        // 分页页码改变
        changePage(e) {
            this.page = e;
            this.getList("page");
        },
        // 获取区域列表
        getList(type) {
            if (type !== "page") {
                this.page = 1;
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize
            }
            this.$fetch(`/admin/dispatch/list-location`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.total = res.data.total
                    this.listData = res.data.data
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                this.$Message.warning("服务端异常")
            })
        },
        // 跳转到新建页面
        bindAdd() {
            this.$router.push({
                name: "map"
            })
        },
        bindDelete() {
            this.$post(`/admin/dispatch/del-location`, { id:this.deleteId }).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.$Message.success("删除成功")
                    this.getList("")
                    this.deleteArea("")
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                this.$Message.warning("服务端异常")
            })
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