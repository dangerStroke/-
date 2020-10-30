export default {
    data() {
        return {
            columns12: [
                {
                    type: 'index',
                    title: '序号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '职业',
                    key: 'job',
                    align: 'center'
                },
                {
                    title: '工作单位全称',
                    key: 'work_unit',
                    align: 'center'
                },
                {
                    title: '工作证照片',
                    slot: 'auth_img',
                    align: 'center'
                },
                {
                    title: '状态',
                    slot: 'status',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    minWidth: 100
                }
            ],
            data: [],
            page: 1,
            page_size: 10,
            total: 0,
            modal1: false,
            formLeft: {},
            visible1: false,//查看大图
            bigImgUrl: '', //大图路径
            deg: 0 //旋转角度
        }
    },
    created() {
        this.$Spin.show();
        this.getDataList()
    },
    methods: {
        //获取列表数据
        getDataList(type) {
            if (type !== "page") {
                this.page = 1;
            }
            let params = {
                page: this.page,
                page_size: this.page_size
            }
            this.$fetch('admin/hero/gets', params).then(res => {
                this.$Spin.hide();
                console.log(res.data)
                if (res.code === 200) {
                    let data = res.data.ret
                    this.data = data
                    this.total = res.data.total  // 总页数      
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
        },
        //详情
        detail(row) {
            this.modal1 = true
            console.log(row)
            this.formLeft = row
        },
        
        //修改状态
        changeStatus(data, status) {
            let that = this
            console.log(data.id, status)
            let html = ""
            if (status === 1) {
                html = `<div>您确定要拒绝<strong>${data.name}</strong>的防疫认证吗？</div>`
            } else {
                html = `<div>您确定要审核通过，通过后<strong>${data.name}</strong>将享受城际全年免单</div>`
            }
            //如果是通过status == 2
            this.$Modal.confirm({
                title: html,
                onOk: () => {
                    //点击了通过，修改他的状态
                    this.$post('admin/hero/change-status', {
                        id: data.id,
                        status
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            //认证成功
                            that.getDataList()
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })
                }
            })
        },

        //通过
        pass(row) {
            this.changeStatus(row, 2)
        },
        //拒绝
        refuse(row) {
            this.changeStatus(row, 1)
        },
        //查看大图
        handleView(e) {
            console.log(e)
            this.visible1 = true
            this.bigImgUrl = e
        },
        //旋转
        rotate() {
            this.deg += 90
            if (this.deg >= 360) {
                this.deg = 0
            }
            this.$refs.rotate.style.transform = `rotate(${this.deg}deg)`
        },

        //页码
        changePage(e) {
            this.page = e;
            // this.getDriverDataList("page");
            this.getDataList("page")
        }
    }
}