export default{
    name:'carList',
    data (){
        return {
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'index'
                },
                {
                    title: '车型名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '车型座位数',
                    key: 'ridership',
                    align: 'center'
                },
                {
                    title: '车型价格',
                    key: 'price',
                    align: 'center'
                },
                {
                    title:'车型库存',
                    key:'cars',
                    align:'center'
                },
                {
                    title:'车型描述',
                    key:'intro',
                    align:'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            page: 1,
            pagesize: 10,
            total: 0,
            data: [],
            name:'',//车型型号
            ridership:"",//车型座位数
            image:"",//上传成功之后的车型图片地址
            cars:'',//库存车型数
            price:'',//价格 
            index:'',//排序值
            modal:false,//模态框
            modalTitle:'',//模态框标题
            upData: {
                token: ""//七牛token

            },
            id:'',
            describe:''
        }
    },
    created(){
        this.getCarList()
    },
    mounted(){
        this.getToken()
    },
    methods:{
        //搜索
        getCarList(){
            this.$fetch('/admin/list-model').then(res => {
                if(res.code == 200){
                    this.data = res.data.map(item => {
                        item.price = (item.price/100).toFixed(2)
                        console.log(item)
                        return item
                    })
                }
            })
        },
        //清空
        clearSerach(){
            console.log(1)
        },
        //新建
        newSite(row){
            this.modal = true
            if (row.id) {
                console.log(row)
                //修改
                this.image = row.image
                this.cars = row.cars
                this.name = row.name
                this.ridership = row.ridership
                this.price = row.price
                this.id = row.id
                this.describe = row.intro
                this.modalTitle = '修改车型'
              
            } else {
                //新建按钮
                this.modalTitle = '新建车型'
            }
        },
        //添加车型
        infoSure(type){
            let {image, cars, price, name,ridership,id,describe} = this
            if(image != '' && cars != '' && price != '' && name != '' && ridership != ''&&describe != ''){
                if(type == '新建车型'){
                    this.$post('/admin/add-model',{
                        image,
                        cars,
                        price:price*100,
                        name,
                        ridership,
                        intro:describe
                    }).then(res => {
                        console.log(res)
                        if(res.code == 200){
                            this.modal = false
                            this.image = ''
                            this.cars = ''
                            this.price = ''
                            this.name = ''
                            this.ridership = ''
                            this.id = ''
                            this.describe = ''
                            this.getCarList()
                            this.$Message.info('新建车型成功')
                        }
                    })
                }else{
                    this.$post('/admin/edit-model',{
                        id,
                        image,
                        cars,
                        price,
                        name,
                        ridership,
                        intro:describe
                    }).then(res => {
                        if(res.code == 200){
                            this.image = '',
                            this.cars = '',
                            this.price = '',
                            this.name = '',
                            this.ridership = '',
                            this.id = ''
                            this.modal = false
                            this.describe = ''
                            this.getCarList()
                            this.$Message.info('修改车型成功')
                        }
                    })
                }
            }else if(image == ''){
                this.$Message.error('请上传车辆图片')
                return
            }else if(cars == ''){
                this.$Message.error('请填写车型库存')
                return
            }else if(price == ''){
                this.$Message.error('请填写价格')
                return
            }else if(ridership == ''){
                this.$Message.error('请填写座位数')
                return
            }else if(this.describe == ''){
                this.$Message.error('请填写描述')
            }     
        },
        //取消模态框
        cancel(){
            this.image = '',
            this.cars = '',
            this.price = '',
            this.name = '',
            this.ridership = '',
            this.id = ''
            this.modal = false
        },
        //删除
        remove(row){
            console.log(row)
            this.$post('/admin/delete-model',{id:row}).then(res => {
                if(res.code == 200 && res.data){
                    this.$Message.info('删除成功')
                    this.getCarList()
                }
            })
        },
        //上传车型图片
        handleSuccessList(file) {
            let image = "http://static2.jd-gz.com/" + file.key;
            this.image = image
            console.log(image)
        }, 
        //页码
        changePage(e) {
            this.page = e;
            this.getCarList();
        }, 
        // 获取七牛token
        getToken() {
            this.$fetch(`/admin/index/get-upload-token`).then(res => {
                if (res.code === 200) {
                    this.upData.token = res.data
                } else {
                    this.$Message.warning(res.error)
                }
            })
        },
    }
}