import UE from '../../../component/UE';
export default {
    name: "addProduct",
    components: {UE},
    data() {
        return {
            content: "",
            upData: {
                token: ""
            },
            projectInfo: {
                top:'',
                title:"",
                desc:"",
                cover:"",
                imgs:"",
                location_start:"",
                location_assemble:"",
                location_dismiss:"",
                focus:"",
                location_travel:"",
                price_info:"",
                notice:"",
                price:"",
                desc2:'',
                price_child:""
            },
            img_json:[],
            change:false,
            isDetail:false,
            detail:"",
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 300
              },
              defaultMsg: 'container',
        }
    },
    created() {
        // this.defaultMsg =JSON.parse( this.$route.query.detail).location_travel
        if(this.$route.query.type == 'modify'){
            let detail = this.$route.query.detail
            if(detail){
                console.log(JSON.parse(detail).imgs)
                this.projectInfo = JSON.parse(detail)
                this.img_json = JSON.parse(JSON.parse(detail).imgs)
                this.change = true
                this.detail = JSON.parse(detail)
            }
        }else if(this.$route.query.type == 'detail'){
            let detail = this.$route.query.detail
            if(detail){
                this.projectInfo = JSON.parse(detail)
                this.img_json = JSON.parse(JSON.parse(detail).imgs)
                this.isDetail = true
                this.detail = JSON.parse(detail)
            }
        }
    },
    mounted() {
        this.getToken()
    },
    methods: {
        submit () {
            if(!this.isDetail){
                let content = this.$refs.ue.getUEContent() // 调用子组件方法
                this.projectInfo.location_travel = content
                console.log(content)
                let param = this.projectInfo
                param['imgs'] = JSON.stringify(this.img_json)
                param.price = Number(param.price)
                param.price_child = Number(param.price_child)
                if(!param.title){
                    this.$Message.warning("请填写项目标题")
                }else if(!param.desc){
                    this.$Message.warning("请填写项目副标题")
                }else if(!param.cover){
                    this.$Message.warning("请上传封面图片")
                }else if(!param.imgs){
                    this.$Message.warning("请上传详情图片")
                }else if(param.price_info<0){
                    this.$Message.warning("活动费用必须大于0")
                }else if(!param.notice){
                    this.$Message.warning("项目须知不能为空")
                }else if(!param.price<0){
                    this.$Message.warning("成人票价不能小于0")
                }else if(!param.price_child<0){
                    this.$Message.warning("儿童票价不能小于0")
                }else if(!param.location_start){
                    this.$Message.warning("出发地点不能为空")
                }else if(!param.location_dismiss){
                    this.$Message.warning("解散地点不能为空")
                }else if(!param.location_assemble){
                    this.$Message.warning("集合地点不能为空")
                }else if(!param.focus){
                    this.$Message.warning("两点不能为空")
                }else if(!param.desc2){
                    this.$Message.warning("出游地详情不能为空")
                }else{
                    console.log(this.change)
                    if(!this.change){
                        this.$post("/admin/travel-around-add",param).then(res => {
                            if(res.code == 200&&res.data){
                                this.$Message.warning("保存成功")
                                window.history.back(-1); 
                            }else{
                                this.$Message.warning(res.error)
                            }
                        })
                    }else{
                        param['id'] = this.detail.id
                        this.$post("/admin/travel-around-edit",param).then(res => {
                            if(res.code == 200&&res.data){
                                this.$Message.warning("修改成功")
                                window.history.back(-1); 
                            }else{
                                this.$Message.warning(res.error)
                            }
                        })
                    }
                }
    
            }else if(this.isDetail){
                window.history.back(-1); 
            }
        },
        //获取七牛云token
        getToken() {
            this.$fetch(`/admin/index/get-upload-token`).then(res => {
                if (res.code === 200) {
                    this.upData.token = res.data
                } else {
                    this.$Message.warning(res.error)
                }
            })
        },
        //封面图片上传成功回调
        handleSuccess(res){
            console.log(res)
            let imgUrl = "http://static2.jd-gz.com/" + res.key;
            this.projectInfo.cover = imgUrl
        },
        //详情图片上传成功回调
        handleSuccessList(res){
            if(this.img_json.length<8){
                let imgUrl = "http://static2.jd-gz.com/" + res.key;
                this.img_json.push(imgUrl)
            }else{
                this.$Message.warning("不能超出八张")
            }
        },
        //取消按钮
        goback(){
            console.log(123)
            window.history.back(-1); 
        },
        // 删除图片
        deletaImg(index) {
            this.img_json.splice(index, 1);
        },
        // 显示图片删除按钮
        showDelete(index, type) {
            let refName = "delete" + index;
            let element = document.getElementById(refName);
            if (type === "enter") {
                element.style.opacity = 1;
            } else {
                element.style.opacity = 0;
            }
        },
        isOK(){
            let content = this.$refs.ue.getUEContent() // 调用子组件方法
            this.projectInfo.location_travel = content
            console.log(content)
        }
    },
}