export default {
    data() {
        return {
            data: '',
            page: 1,
            pagesize: 12,
            total: 0,
            modal: false,//对话框显示
            modelSelect: '',//选择器内容
            mainText: '',//评价内容
            modalTitle: '',
            ischange: '',
            id: '',
            columnsComment: [
                {
                    title: '满足程度',
                    key: 'type',
                    align: 'center',
                    width: '200'
                },
                {
                    title: '评价内容',
                    key: 'main',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                    width: '500'
                }
            ],//表头
            dataComment: [

            ],//表格内容
            SelectList: [
                {
                    value: '满意',
                    label: '满意'
                },
                {
                    value: '不满意',
                    label: '不满意'
                },
            ],//满意不满意选择
            satisfyNum: 0,
            unSatisfyNum: 0

        }
    },
    methods: {
        //修改
        show(index) {
            this.id = this.data[index].id
            this.ischange = false
            this.modalTitle = '修改评价'
            this.modal = true,
                this.modelSelect = this.dataComment[index].type
            this.mainText = this.dataComment[index].main
        },
        //删除
        remove(index) {
            this.$Modal.info({
                content: '你确定要删除该评价？',
                onOk: () => {
                    let params = {
                        id: this.data[index].id
                    }

                    this.$fetch('/admin/dispatch/del-evaluate', params).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            this.$Message.success({
                                content: '评价删除成功',
                                duration: 2
                            })
                            this.getDataList()
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })
                }
            })
        },
        //新增
        addOne() {
            console.log(this.satisfyNum, this.unSatisfyNum)
            if (this.satisfyNum >= 6 && this.unSatisfyNum >= 6) {
                this.$Message.error({
                    content: '已不能添加评价',
                    duration: 2
                })
                return
            } else if (this.satisfyNum >= 6) {
                this.SelectList = [
                    {
                        value: '不满意',
                        label: '不满意'
                    },
                ]
            } else if (this.unSatisfyNum >= 6) {
                this.SelectList = [
                    {
                        value: '满意',
                        label: '满意'
                    },
                ]
            } else {
                this.SelectList = [
                    {
                        value: '满意',
                        label: '满意'
                    },
                    {
                        value: '不满意',
                        label: '不满意'
                    },
                ]
            }
            this.ischange = true
            this.modelSelect = ''
            this.mainText = ''
            this.modalTitle = '添加评价'
            this.modal = true
        },
        //对话框确认
        ok() {
            console.log(this.mainText, this.modelSelect)
            if (this.ischange) {
                let is_satisfy = ''
                if (this.modelSelect === '满意') {
                    is_satisfy = 1
                } else {
                    is_satisfy = 0
                }
                this.modal = false
                let params = {
                    title: this.mainText,
                    is_satisfy
                }
                this.$fetch('/admin/dispatch/add-evaluate', params).then(res => {
                    if (res.code === 200) {
                        this.$Message.success({
                            content: '评价添加成功',
                            duration: 2
                        })
                        this.getDataList()
                    }
                }).catch(err => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务器端异常")
                })

            } else {
                let is_satisfy = ''
                if (this.modelSelect === '满意') {
                    is_satisfy = 1
                } else {
                    is_satisfy = 0
                }
                let params = {
                    title: this.mainText,
                    is_satisfy,
                    id: this.id
                }
                this.$fetch('/admin/dispatch/edit-evaluate', params).then(res => {
                    this.$Message.success({
                        content: '评价修改成功',
                        duration: 2
                    })
                    this.getDataList()
                }).catch(err => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务器端异常")
                })
            }
        },
        //对话狂取消
        cancel() {
            this.modal = false
        },
        //页码
        changePage(e) {
            this.dataComment = []
            this.page = e;
            this.getDataList("page");
        },
        //获取列表
        getDataList(type) {
            this.satisfyNum = 0
            this.unSatisfyNum = 0
            this.dataComment = []
            if (type !== "page") {
                this.page = 1;
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize,
                delflag: 0
            }
            this.$fetch('/admin/dispatch/list-evaluate', params).then(res => {
                this.$Spin.hide();
                console.log(res.data.data)
                if (res.code === 200) {
                    let data = res.data.data
                    this.data = data
                    this.total = res.data.total  // 总页数      

                    this.data.forEach(res => {
                        let dataList = {
                            type: '',
                            main: ''
                        }
                        if (res.is_satisfy) {
                            this.satisfyNum++
                            dataList.type = '满意'
                            dataList['main'] = res.title
                            this.dataComment.push(dataList)
                        } else {
                            this.unSatisfyNum++
                            dataList.type = '不满意'
                            dataList['main'] = res.title
                            this.dataComment.push(dataList)
                        }
                        console.log(this.satisfyNum)


                    })
                } else {
                    this.$Message.warning('暂无数据')
                }
            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })

        },
    },
    created: function () {
        this.$Spin.show()
        this.getDataList()
    }
}