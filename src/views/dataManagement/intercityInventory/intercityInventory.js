export default {
    data() {
        return {
            columns: [
                {
                    title: '发车日期',
                    key: 'date',
                    align: 'center'
                },
                {
                    title: '单程路线',
                    key: 'route',
                    align: 'center'
                },
                {
                    title: '班次时间',
                    key: 'time',
                    align: 'center',
                },
                {
                    title: '车辆',
                    key: 'car_no',
                    align: 'center'
                },
                {
                    title: '总座位数量',
                    key: 'ridership',
                    align: 'center',
                },
                {
                    title: '余票数量',
                    key: 'ticket_numbers',
                    align: 'center',
                },
                {
                    title: '畅游甘孜售出数量',
                    key: 'order',
                    align: 'center',
                },
                {
                    title: '锁定座位数量',
                    key: 'lock_numbers',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    align: 'center'
                }
            ],
            data: [],
            page: 1,
            pagesize: 10,
            total: 0,
            one_way_route: '', //搜索单程路线
            serachDate: '', //搜索框的选择日期的值
            routeList: [], // 线路下拉的数据
            modal1: false, //锁定库存按钮的弹窗显示
            input_locking_num: 0, //模态框库存锁定里面的输入锁定数量
            options: {
                disabledDate(date) {
                    // let today = new Date();
                    // let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * 3;
                    // today.setTime(targetday_milliseconds); //注意，这行是关键代码
                    // let tYear = today.getFullYear();
                    // let tMonth = today.getMonth() + 1;
                    // let tDate = today.getDate();
                    // if (tMonth.toString().length == 1) {
                    //     tMonth = "0" + tMonth
                    // }
                    // if (tDate.toString().length == 1) {
                    //     tDate = "0" + tDate
                    // }
                    // let dataDis = tYear + "-" + tMonth + "-" + tDate;
                    // let chooseTime = dataDis + ' 00:00:00' //需要拼接00:00:00
                    // let date11 = new Date(chooseTime.replace(/-/g, '/')); //3天之后的时间
                    return date && date.valueOf() >= new Date().getTime() + 1000 * 60 * 60 * 24 * (2) || date.valueOf() < new Date().getTime() + 1000 * 60 * 60 * 24 * (-1);
                }
            },
            formLeft: {}
        }
    },
    created() {
        this.$Spin.show();
    },
    mounted() {
        //table数据
        this.getTableData()
        //获取选择线路下拉数据
        this.selectRouteList()
    },
    methods: {
        //搜索框的日期选择变化
        serachDepartureDate(e) {
            console.log(e)
            this.serachDate = e
        },
        //选择线路下拉数据
        selectRouteList() {
            let that = this
            this.$fetch("/admin/index/select-route").then(res => {
                console.log(res)
                let list = Object.keys(res.data).map((item, index) => ({ value: item, label: res.data[item] }))
                that.routeList = list
                console.log(list)
            })
        },
        //搜索按钮
        getCarList() {
            console.log('搜索按钮')
            this.getTableData()
        },

        //table数据
        getTableData(type) {
            let that = this
            let params = {
                date: this.serachDate || '',
                route_id: this.one_way_route || ''
            }

            this.$fetch("/admin/stock/gets", params).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$Spin.hide();
                    console.log(res.data)
                    this.data = res.data
                } else {
                    that.$Message.warning(res.error)
                }
            })
        },


        //清空按钮
        clearSerach() {
            console.log('清空按钮')
            this.serachDate = ''
            this.one_way_route = ''
            this.shift_time = ''
            this.getTableData()
        },

        //库存锁定按钮
        locking(row) {
            this.modal1 = true
            console.log(row)
            this.formLeft = row

        },

        //锁定数量的变化
        inputNum() {
            // console.log(this.lock_numbers)
            if (this.formLeft.lock_numbers > this.formLeft.ticket_numbers) {
                this.$Message.error('需锁定数量大于了余票数量')
                return false
            } 
        },

        //模态框的确定按钮
        makeSure() {
            console.log(this.formLeft)
            console.log(this.formLeft.lock_numbers)

            this.$post("/admin/stock/edit",{
                id:this.formLeft.id,
                lock_numbers:this.formLeft.lock_numbers
            }).then(res=>{
                // console.log(res)
                if(res.code == 200){
                    this.$Message.info("锁定数量成功")
                    this.getTableData()
                }else{
                    this.$Message.error(res.error)
                }
            })


        },
        //模态框的取消按钮
        cancel() {
            console.log('取消')
            this.formLeft = {}
            this.getTableData()
        },

        //页码
        changePage(e) {
            this.page = e;
            this.getTableData("page")
        },

    }

}