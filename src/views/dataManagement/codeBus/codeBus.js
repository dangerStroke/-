export default{
    data() {
        return{
            columns: [
                {
                    title:"序号",
                    key:"index",
                    align:"center"
                },
                {
                    title: '路线',
                    key: 'route',
                    align: 'center'
                },
                {
                    title: '数量',
                    key: 'lock_num',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    align: 'center'
                }
            ],
            dataList:[],
            modal1:false,
            value:'',
        }
    },
    methods:{
        getList(){
            this.$post('/admin/scenic-area/get-lock').then(res => {
                if(res.code == 200 && res.data){
                   let list = res.data
                   console.log(list)
                   list.forEach((item,index) => {
                       item['route']="海螺沟-成都市",
                       item['index'] = index+1
                   });
                   this.dataList = list
                }
            })
        },
        bindDetail(e){
            this.modal1 = true
            let list = this.dataList
            list.forEach(res => {
                if(res.id == e.id){
                    this.value = res.lock_num
                    this.id = res.id
                }
            })
        },
        ok(){
            let param = {
                id:this.id,
                lock_num:Number(this.value)
            }
            this.$post('/admin/scenic-area/edit-lock',param).then(res => {
                if(res.code == 200 && res.data){
                    this.getList()
                }
            })
            this.modal1 = false
        },
        cancel(){
            this.modal1 = false
        }
    },
    created(){
        this.getList()
    }
}