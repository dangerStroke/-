import html2canvas from 'html2canvas';

export default {
    data() {
        return {
            columns1: [
                {
                    title: '二维码编码',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '二维码图片',
                    slot: 'image',
                    align: 'center'
                },
                {
                    title: '关联商家',
                    slot: 'business',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 200,
                    align: 'center'
                }

            ],
            data1: [],
            addQrCodeModal: false, //添加二维码的弹窗
            addQrCodeNum: 1, //添加个数
            linkMerchantModal: false, //关联商家的弹窗
            linkMerchantList: [],
            linkMerchant: '',
            page: 1,
            pagesize: 10,
            total: 0,
            linkMerchantTitle: null, //关联商家的标题
            linkMerchantId:null, //关联商家的id

        }
    },
    mounted() {
        this.getQrCodeList()
    },

    methods: {
        //获取二维码列表
        getQrCodeList(type) {
            if (type !== "page") {
                this.page = 1
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize
            }
            this.$fetch('/admin/distribution-qr-code/get', params).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.data1 = res.data.data
                    this.total = res.data.total  // 总页数

                } else {
                    this.$Message.warning(res.error)
                }

            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //添加二维码按钮
        addQrCode() {
            this.addQrCodeModal = true
        },
        //添加二维码弹窗的确定按钮
        addQrCodeClick() {
            console.log(this.addQrCodeNum)
            if (this.addQrCodeNum) {
                this.$post('/admin/distribution-qr-code/add', {
                    quantity: this.addQrCodeNum
                }).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.$Message.info('批量添加二维码成功')
                        this.addQrCodeModal = false
                        this.getQrCodeList()
                    } else {
                        this.$Message.warning(res.error)
                    }
                }).catch(err => {
                    this.$Spin.hide();
                })

            } else {
                this.$Message.warning('请填写二维码个数')
            }

        },
        addQrCodeCancel() {
            this.addQrCodeModal = false
        },

        //下载按钮
        downLoad(row) {
            console.log(row)
            if(row.business.business_id){
                let url = row.image
                let imgName = `${row.business.business_name}.png`
                this.getUrlBase64(url).then(base64 => {
                    //window.navigator.msSaveOrOpenBlob判断是否是ie浏览器
                    if (window.navigator.msSaveOrOpenBlob) {
                        let bstr = atob(base64.split(',')[1])
                        let n = bstr.length
                        let u8arr = new Uint8Array(n)
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n)
                        }
                        let blob = new Blob([u8arr])
                        window.navigator.msSaveOrOpenBlob(blob, imgName)
                    } else {
                        // 这里就按照chrome等新版浏览器来处理
                        const alink = document.createElement('a')
                        alink.href = base64
                        alink.download = imgName;
                        document.body.appendChild(alink);
                        alink.click()
                        document.body.removeChild(alink)
                    }
    
                })
            }else{
                this.$Message.warning('请先关联商家')
            }
            
            
        },
        //将图片链接转换成base64
        getUrlBase64(url) {
            return new Promise(resolve => {
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let img = new Image()
                img.crossOrigin = 'Anonymous' //允许跨域
                img.src = url
                img.onload = function () {
                    canvas.height = 300
                    canvas.width = 300
                    ctx.drawImage(img, 0, 0, 300, 300)
                    let dataURL = canvas.toDataURL('image/png')
                    canvas = null
                    resolve(dataURL)
                }
            })
        },

        //关联商家按钮
        linkMerchantClick(id) {
            this.linkMerchantModal = true
            this.linkMerchantTitle =  id
            //获取可关联的商家列表
            this.$fetch('/admin/distribution-qr-code/get-business').then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.linkMerchantList = res.data
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //关联商家模态框的取消按钮
        linkMerchantCancel() {
            this.linkMerchantModal = false
        },
        //关联商家模态框的确定按钮
        linkMerchantSure() {
            // id为二维码id
            if(this.linkMerchantId){
                this.$post('/admin/distribution-qr-code/bind-business',{
                    id:this.linkMerchantTitle,
                    business_id:this.linkMerchantId
                }).then(res=>{
                    console.log(res)
                    if (res.code == 200) {
                        this.$Message.info('关联商家成功')
                        this.linkMerchantModal = false
                        this.getQrCodeList()
                    } else {
                        this.$Message.warning(res.error)
                    }
                })

            }else{
                this.$Message.warning('请先选择关联商家')
                this.linkMerchantModal = true
            }
            
        },
        selectLinkMerchant(e) {
            console.log(e)
            this.linkMerchantId = e
        },
        //页码
        changePage(e) {
            this.page = e;
            this.getQrCodeList("page");
        },

    }
}