export default {
    data(){
        return{
            columns12: [
                {
                    title: '城市',
                    key:'city_name',
                    align: 'center'
                },{
                    title: '详细地址',
                    slot:'address',
                    align: 'center'
                }
            ],
            data6: []
        }
    },
    mounted(){
        console.log(this.$route.params.id)
        let params = {
            page:1,
            pagesize:100,
            uid:this.$route.params.id
        }
        this.$fetch('/admin/member/get-address',params).then(res=>{
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