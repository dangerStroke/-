export default {
    data() {
        return {
            name: '', //搜索商家姓名
            columns1: [
                {
                    title: '商家编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '商家名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '地址',
                    key: 'address',
                    align: 'center'
                },
                {
                    title: '负责人',
                    key: 'user_name',
                    align: 'center'
                },
                {
                    title: '联系电话',
                    key: 'phone',
                    align: 'center'
                },
                {
                    title: '商家性质',
                    key: 'nature',
                    align: 'center'
                },
                {
                    title: '每单佣金(元)',
                    key: 'commission',
                    align: 'center',
                   
                },
                {
                    title: '关联二维码',
                    slot: 'qr_code',
                    align: 'center',
                    width: 150,
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'

                },
            ],
            data1: [],
            page: 1,
            pagesize: 10,
            total: 0,
            newSiteModal: false, //新建或者详情的模态框
            title: '', //模态框的title
            formItem: {}, //模态框里面的内容formItem
        }
    },
    mounted() {
        this.getMerChantList()
    },

    methods: {
        //获取商家列表
        getMerChantList(type) {
            if (type !== "page") {
                this.page = 1
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize,
                name: this.name || ''
            }

            this.$fetch('/admin/business/get', params).then(res => {
                console.log(res)
                if (res.code == 200) {
                    let data = res.data.data
                    this.total = res.data.total  // 总页数      
                    data.map(item => {
                        item.commission = (Number(item.commission) / 100).toFixed(2)
                    })
                    
                    this.data1 = data
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //清空按钮
        clearSerach() {
            this.name = ''
            this.getMerChantList()
        },
        //新建按钮
        newSite(e, row) {
            console.log(row)
            this.newSiteModal = true
            if (e == 'edit') {
                //修改
                this.title = '修改商家'
                this.formItem = row
                // this.formItem.commission = this.formItem.commission/100
                
            } else {
                this.title = '新建商家'
                this.formItem ={}
            }
        },
        //模态框的确定按钮
        infoSure() {
            console.log("模态框的确定按钮")
            let upDate = this.formItem
            console.log(upDate)
            upDate.commission = upDate.commission * 100
            if (upDate.name) {
                this.$post('/admin/business/add-edit', upDate).then(res => {
                    if (res.code == 200) {
                        this.$Message.info('操作成功')
                        this.getMerChantList() // 刷新页面
                        this.newSiteModal = false // 关闭弹窗
                    } else {
                        this.$Message.warning(res.error)
                    }
                }).catch(err => {
                    this.$Spin.hide();
                })

            } else {
                this.$Message.error('请填写商家名称')
                this.newSiteModal = true
            }
        },

        //模态框的取消按钮
        cancel() {
            this.formItem = {}
            this.newSiteModal = false
        },
        //操作里面的删除按钮
        remove(id,index){
            let that = this
            this.$Modal.confirm({
                title: '你确定要删除该商家吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: function () {
                    this.$post('/admin/business/del', {
                        id
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            //删除成功
                            this.$Message.info('删除商家成功')
                            that.data1.splice(index, 1);
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
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
            this.getMerChantList("page");
        },
    },
}