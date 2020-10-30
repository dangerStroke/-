export default {
    name: "changeRule",
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
                    title: '改签时间',
                    slot: 'time',
                    align:"center"
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 300
                },
            ],
            data: []
        }
    },
    created() {
        this.$Spin.show();
        this.getRules()
    },
    methods: {
        // 获取改签规格
        getRules () {
            this.$fetch(`admin/config/getTicketConfig`).then(res => {
                this.$Spin.hide();
                if (res.data) {
                    let obj = {
                        time: res.data.scope_time,
                        timeStr:res.data.scope_time/60/60,
                        type:"normal",
                        inputValue: res.data.scope_time/60/60
                    } 
                    let data = [obj]
                    this.data = data
                }else {
                    let obj = {
                        time: null,
                        type:"edit",
                        editTime: null,
                        inputValue:null
                    }
                    let data = [obj]
                    
                    this.data = data
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })
        },
        inputChange (e,row,index) {
            row.inputValue = e.currentTarget.value
            this.$set(this.data,index,row)
        },
        // 修改按钮
        bindEdit (row,index,type) {
            if (type==="edit") {
                row.type = "edit"
            } else {
                if (row.time) {
                    row.type = "normal"
                }
            }
            this.$set(this.data,index,row)
        },
        // 提交修改
        submitEdit () {
            let time = Number(this.data[0].inputValue)*60*60
            this.$fetch(`admin/config/saveTicket?time=${time}`).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.$Message.success("配置成功")
                    this.getRules()
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })

        }
    },
}