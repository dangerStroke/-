export default {
    name: "commission",
    data() {
        return {
            type: "normal",
            params: {
                autotrophy_car_free: null,
                autotrophy_have_car: null,
                non_autotrophy: null
            }
        }
    },
    created() {
        this.$Spin.show();
        this.getCommission()
    },
    methods: {
        // 保存配置
        saveCommission() {
            this.$post('admin/commission/save', this.params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.$Message.success("保存成功")
                    this.showBtn("normal")
                } else {
                    this.$Message.success(res.error)
                }
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })
        },
        // 添加编辑
        showBtn(type) {
            this.type = type
        },
        // 获取配置
        getCommission() {
            this.$fetch(`admin/commission/get`).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.params.autotrophy_car_free = res.data.autotrophy_car_free
                        this.params.autotrophy_have_car = res.data.autotrophy_have_car
                        this.params.non_autotrophy = res.data.non_autotrophy
                    }
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