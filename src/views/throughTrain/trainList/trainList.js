import { Row } from "iview";

export default {
    name: "list",
    data() {
        return {
            columns: [
                {
                    title: '操作',
                    slot: 'action',
                    align: "center",
                    width: 300
                },
                {
                    type: "index",
                    title: "序号",
                    width: 80,
                    align: "center"
                },
                {
                    title: '项目标题',
                    key: 'title'
                },
                {
                    title: '项目价格',
                    key: 'priceStr'
                },
                {
                    title: '项目图片',
                    slot: 'img'
                },
                {
                    title: '项目详情',
                    key: 'details'
                }
            ],
            listData: [],
            page: 1,
            page_size: 10,
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
        // 获取直通车列表
        getList(type) {
            if (type !== "page") {
                this.page = 1;
            }
            let params = {
                page: this.page,
                page_size: this.page_size
            }
            this.$fetch(`/admin/throughtrain/gets`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.total = res.data.total
                    let listData = res.data.ret
                    listData.map(item =>{
                        item.priceStr = (Number(item.price) / 100).toFixed(2)
                    })
                    this.listData = listData
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
                name: "trainAdd"
            })
        },
        bindDelete() {
            this.$fetch(`/admin/throughtrain/del`, { id: this.deleteId }).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("删除成功")

                    } else {
                        this.$Message.warning("删除失败")
                    }
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
        trainDetail(row, type) {
            this.$router.push({
                name: "trainDetail",
                query: {
                    type: type,
                    id: row.id
                }
            })
        }
    },
}