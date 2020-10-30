export default {
    name:"cancleRule",
    data() {
        return {
            type: "normal",
            ruleInfo: {
                free:null,
                fee:{
                    small:null,
                    big:null
                },
                not:null
            }
        }
    },
    created() {
        this.$Spin.show();
        this.getCancleRule()
    },
    methods: {
        // 添加编辑
        showBtn (type) {
            this.type = type
        },
        // 保存配置
        savaCancleRule () {
            this.$post(`admin/config/saveCancel`,this.ruleInfo).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    this.$Message.success("保存成功")
                    this.showBtn("normal")
                }else {
                    this.$Message.success(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                // this.$Message.warning("服务端异常")
            })
        },
        // 获取配置
        getCancleRule () {
            this.$fetch(`admin/config/getCancel`).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.ruleInfo = JSON.parse(res.data.config)
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