export default {
    data() {
        return {
            columns12: [{
                title: '券类编码',
                key: 'coupon_id',
                align: 'center'
            }, {
                title: '券名称',
                slot: 'name',
                align: 'center'
            }, {
                title: '状态',
                slot: 'status',
                align: 'center'
            }, {
                title: '使用时间',
                key: 'use_time',
                align: 'center'
            }, {
                title: '过期时间',
                key: 'expire_time',
                align: 'center'
            }, {
                title: '使用订单号',
                key: 'order_sn',
                align: 'center'
            }],
            data6: [],
            value1: 1,
            user_id: null

        }
    },
    mounted() {
        // this.getQuery()
        console.log(this.$route.params.id)
        this.user_id = this.$route.params.id
        this.getCouponList()
    },

    methods: {
        getCouponList(){
            let params = {
                page:1,
                pagesize:100,
                uid:this.user_id,
                status:-1,
                route_id:0
            }
            this.$fetch('/admin/member/counpon',params).then(res=>{
                console.log(res)
                if(res.code == 200){
                    this.data6 = res.data.ret

                }else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //点击发券按钮
        toVounder() {
            console.log(111)
            this.$router.push({
                path: '/userCenter',
                query: {
                    id: this.user_id
                }
            })
        },
    }
}