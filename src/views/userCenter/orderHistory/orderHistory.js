export default {
    data() {
        return {
            columns12: [
                {
                    title: '订单编号',
                    key:'order_sn',
                    align: 'center'
                },{
                    title: '订单类型',
                    slot:'type',
                    align: 'center',
                    width:100
                },{
                    title: '订单状态',
                    key:'status_text',
                    align: 'center'
                },{
                    title: '路线',
                    slot:'route',
                    align: 'center',
                    width:140
                },{
                    title: '发车日期',
                    render: (h, params) => {
                        return h('div', [
                            params.row.start_at.substr(0,10)
                        ])
                    }
                },{
                    title: '发车时间',
                    render: (h, params) => {
                        return h('div', [
                            params.row.start_at.substr(11,8)
                        ])
                    }
                },{
                    title: '订单金额',
                    slot:'price_pay',
                    align: 'center',
                    width:100
                },{
                    title: '订单创建时间',
                    key:'created_at',
                    align: 'center',
                    width:120
                }
            ],
            data6: []
        }
    },
    mounted() {
        console.log(this.$route.params.id)
        let params = {
            page:1,
            pagesize:100,
            uid:this.$route.params.id,
            status:-1
        }
        this.$fetch('/admin/member/get-order',params).then(res=>{
            console.log(res)
            if (res.code == 200) {
                this.data6 = res.data
                
            } else {
                this.$Message.warning(res.error)
            }
        }).catch(err => {
            this.$Spin.hide();
        })

    }
}