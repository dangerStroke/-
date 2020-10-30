export default {
    name: 'car',
    data() {
        return {
            columns: [
                {
                    title: '车辆编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '车牌号',
                    key: 'plate_no',
                    align: 'center'
                },
                {
                    title: '车辆品牌',
                    slot: 'brand_id',
                    align: 'center'
                },
                {
                    title: '车辆型号',
                    key: 'car_model',
                    align: 'center'
                },
                {
                    title: '车辆颜色',
                    key: 'color',
                    align: 'center'
                },
                {
                    title: '车辆分类',
                    slot: 'belong_id',
                    align: 'center'
                },
                {
                    title: '车辆座位数',
                    slot: 'ridership',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            data: [],
            page: 1,
            pagesize: 10,
            total: 0,
            plate_no: '', //车牌号
            id: '', //车辆编号
            brand_id: '', //车辆品牌
            ridership: '',//座位数
            modalTitle: '', //模态框的标题
            carPic: '', //车辆照片
            goCarPic: '',//行驶证照片
            formLeft: {},
            editinfo: {},
            modal: false, //遮罩层的隐藏显示
            carbelong: '', //车辆分类
            carBelongList: [], //车辆分类从后端拿到的分类
            color: '', //车辆颜色
            carColorList: [],//车辆颜色从后端拿到的颜色
            brand: '', //车辆品牌
            carBrandList: [],
            ridership: '',//座位数
            ridershipList: [],
            park_id: '', //停放站点
            siteList: [], //停放站点列表
            main_driver_id: '',//司机的id
            driverList: [], //司机配置列表
            uploadXszImgUrl: '', //上传成功之后的行驶证图片地址
            uploadCarImgUrl: '', //上传成功之后的车辆图片地址
            uploadImgUrl: '',
            bigKindList: [{
                value: 1,
                label: '城际接送'
            }, {
                value: 2,
                label: '司乘快客'
            }, {
                value: 7,
                label: '直通车'
            },], //城际接送的车还是司乘快客的车

            mainDirverList: [], //城际接送主司机列表
            coDriverList: [], //城际接送副司机列表
            coDriver: [], //副司机多选框
            driverPassengerList: [], //司乘快客司机列表
            assistant_driver_id: '', //副司机id
        }
    },
    watch: {
        coDriver(newval, olaval) {
            console.log("司机数据改变")
            console.log(newval)
        }
    },
    created() {
        this.$Spin.show();
        //获取车辆列表,表格的全部信息
        this.getCarList()
        //获取车辆分类
        this.getSelectList('/admin/index/select-car-belong', "carBelongList")
        //获取颜色分类
        this.getSelectList('/admin/index/select-car-color', "carColorList")
        //获取座位数
        this.getSelectList('/admin/index/select-car-ridership', "ridershipList")
        //获取品牌
        this.getSelectList('/admin/index/select-car-brand', "carBrandList")

    },
    methods: {
        // 获取直通车司机

        //获取下拉的数据
        getSelectList(url, selectList) {
            this.$fetch(url).then(res => {
                if (res.code == 200) {
                    this.$Spin.hide();
                    // this.carBelongList = res.data
                    //对返回的json对象进行处理转成数组list value是id label是每个数据值
                    let list = Object.keys(res.data).map((item, index) => ({ value: item, label: res.data[item] }))
                    this[selectList] = list
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },

        //选择车辆用途的下拉
        carUse(e) {
            if (this.formLeft.park_id) {
                // console.log('ok')
                this.$fetch('/admin/dispatch/gets-driver', {
                    type: e,
                    park_id: this.formLeft.park_id
                }).then(res => {
                    this.mainDirverList = res.mainDriver//城际接送主司机列表
                    this.coDriverList = res.otherDriver//城际接送副司机列表
                    this.driverPassengerList = res.mainDriver //司乘快客司机列表
                    if (this.formLeft.type === 7) {
                        this.driverPassengerList = res.otherDriver
                    }
                })
            } else {
                this.formLeft.type = ''
                // this.$Message.error('请先选择停放站点')
            }

        },

        //选择城际接送副司机的多选框
        coDriverChange(e) {
            this.coDriver = e
        },

        changeParkId(e) {
            this.$fetch('/admin/dispatch/gets-driver', {
                type: this.formLeft.type,
                park_id: e
            }).then(res => {
                this.mainDirverList = res.mainDriver//城际接送主司机列表
                this.coDriverList = res.otherDriver//城际接送副司机列表
                this.driverPassengerList = res.mainDriver //司乘快客司机列表
                if (this.formLeft.type === 7) {
                    this.driverPassengerList = res.otherDriver
                }
            })
        },

        //新建和修改按钮
        newSite(row) {
            let that = this
            this.modal = true
            if (row.id) {
                //修改
                this.modalTitle = '修改车辆'
                //获取某一条车辆信息
                this.$fetch('/admin/dispatch/get-car', {
                    id: row.id
                }).then(res => {
                    if (res.code == 200) {
                        this.formLeft = res.data
                        this.formLeft.brand_id = this.formLeft.brand_id.toString()
                        this.formLeft.carbelong = this.formLeft.belong_id.toString()
                        this.formLeft.ridership = this.formLeft.ridership.toString()
                        this.uploadCarImgUrl = this.formLeft.car_img
                        this.uploadXszImgUrl = this.formLeft.permit_img

                        let arr = res.data.assistant_driver_id.split(",")
                        let list = arr.map((item, index) => {
                            if (item !== 0) {
                                return Number(item)
                            }
                        })
                        //城际接送或者司乘快客
                        this.$fetch('/admin/dispatch/gets-driver', {
                            type: res.data.type,
                            park_id: this.formLeft.park_id
                        }).then(res => {
                            this.mainDirverList = res.mainDriver//城际接送主司机列表
                            this.coDriverList = res.otherDriver//城际接送副司机列表
                            this.driverPassengerList = res.mainDriver //司乘快客司机列表
                            if (this.formLeft.type === 7) {
                                this.driverPassengerList = res.otherDriver
                            }
                            setTimeout(() => {
                                this.coDriver = list
                            }, 1)
                        })
                    }
                }).catch(err => {
                    this.$Spin.hide();
                })
                this.getDriverAndStation()
            } else {
                //新建按钮
                this.modalTitle = '新建车辆'
                this.formLeft = {}
                this.uploadCarImgUrl = ''
                this.uploadXszImgUrl = ''
                this.getDriverAndStation()
            }
        },
        //获取司机和站点下拉列表的数据
        getDriverAndStation() {
            let that = this
            //获取停车站点列表
            this.$fetch('/admin/citytransport/list-station').then(res => {
                // console.log(res.data.data)
                if (res.code == 200) {
                    that.siteList = res.data.data
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
            //获取司机匹配
            this.$fetch('/admin/dispatch/list-driver').then(res => {
                if (res.code == 200) {
                    let data = res.data.data
                    let dataList = []
                    data.map(item => {
                        if (item.status === 1) {
                            dataList.push(item)
                        }
                    })
                    that.driverList = dataList


                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //上传行驶证
        handleUploadiconXsz(file) {
            let that = this
            this.$uploadImg(file, (file) => {
                // console.log(file)
                that.uploadXszImgUrl = file
            })
        },

        //上传车辆照片
        handleUploadiconCar(file) {
            let that = this
            this.$uploadImg(file, (file) => {
                // console.log(file)
                that.uploadCarImgUrl = file
            })
        },

        handleFormatError1(file) {
            this.$Message.info("图片格式不正确,请上传正确的图片格式");
        },
        //获取车辆列表和搜索按钮
        getCarList() {
            let params = {
                page: this.page,
                pagesize: this.pagesize,
                id: this.id || '',
                plate_no: this.plate_no || '',
                color: this.color || '',
                belong_id: this.carbelong || '',
                brand_id: this.brand_id || '',
                ridership: this.ridership || ''
            }
            this.$fetch('/admin/dispatch/list-car', params).then(res => {
                this.$Spin.hide();
                // console.log(res.data.data)
                if (res.code === 200) {
                    let data = res.data.data
                    this.data = data
                    this.total = res.data.total  // 总页数      
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
            })
        },
        //清空按钮
        clearSerach() {
            // this.queryParams={}
            this.id = ''
            this.plate_no = ''
            this.color = ''
            this.carbelong = ''
            this.brand_id = ''
            this.ridership = ''
            this.getCarList()
        },

        //常用路线格式校验
        changeRouteName(e) {
            // console.log(e)
            let n = (this.formLeft.route_name.split('-')).length - 1;
            if (n != 1) {
                //请输入正确格式不包含-
                this.$Message.error('输入正确的常用路线格式')
                return false
            } else {
                //请输入正确格式包含-
                let firstStr = this.formLeft.route_name.substring(0, 1)
                let endStr = this.formLeft.route_name.substr(-1)
                let ret = /^[\u4e00-\u9fa5]+$/i  //只能输入汉字
                if(ret.test(firstStr) && ret.test(endStr)){
                    //输入格式正确
                    // var routeName= this.formLeft.route_name
                }else{
                    this.$Message.error('输入正确的常用路线格式')
                    return false
                }
            }

        },

        //新建的确定按钮
        infoSure(type) {
            if (type == '新建车辆') {
                //新建车辆的确定按钮
                let upData = this.formLeft

                let list = []
                this.coDriver.map((item, index) => {
                    if (item !== 0) {
                        list.push(item)
                    }
                })
                let assistant_driver_id = list.toString() //城际接送副司机

                if (upData.plate_no && upData.brand_id &&
                    upData.car_model && upData.carbelong
                    && upData.ridership &&
                    upData.color && upData.main_driver_id
                    && upData.park_id && 1 <= list.length <= 3
                ) {
                    //如果都填完

                    let ridership = parseInt(upData.ridership)
                    let belong_id = parseInt(upData.carbelong)
                    let brand_id = parseInt(upData.brand_id)
                    let car_img = this.uploadCarImgUrl
                    let permit_img = this.uploadXszImgUrl
                    this.$post('/admin/dispatch/add-car', {
                        plate_no: upData.plate_no,
                        brand_id: brand_id,
                        car_model: upData.car_model,
                        belong_id: belong_id,
                        ridership: ridership,
                        color: upData.color,
                        main_driver_id: upData.main_driver_id,
                        park_id: upData.park_id,
                        remark: upData.remark,
                        car_img,
                        permit_img,
                        assistant_driver_id,
                        type: upData.type,
                        route_name: upData.route_name
                    }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info('新建车辆成功')
                            this.modal = false
                            this.getCarList()
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })

                } else if (!upData.plate_no) {
                    this.$Message.error('请填写车牌号')
                    return
                } else if (!upData.brand_id) {
                    this.$Message.error('请选择车辆品牌')
                    return
                } else if (!upData.car_model) {
                    this.$Message.error('请填写车辆类型')
                    return
                } else if (!upData.carbelong) {
                    this.$Message.error('请选择车辆分类')
                    return
                } else if (!upData.ridership) {
                    this.$Message.error('请选择车辆座位数')
                    return
                } else if (!upData.color) {
                    this.$Message.error('请选择车辆颜色')
                    return
                } else if (!upData.main_driver_id) {
                    if (this.formLeft.type !=7) {
                        this.$Message.error('请选择匹配司机')
                        return
                    }
                } else if (!upData.park_id) {
                    this.$Message.error('请选择停放站点')
                    return
                } else if (list.length > 3 || list.length < 1) {
                    this.$Message.error('副司机数量至少一个，至多3个')
                    return
                }


            } else if (type == '修改车辆') {
                let upData = this.formLeft
                let car_img = this.uploadCarImgUrl
                let permit_img = this.uploadXszImgUrl
                let list = []
                this.coDriver.map((item, index) => {
                    if (item !== 0) {
                        list.push(item)
                    }
                })
                let assistant_driver_id = list.toString() //城际接送副司机

                if (upData.plate_no && upData.brand_id &&
                    upData.car_model && upData.carbelong
                    && upData.ridership &&
                    upData.color && upData.main_driver_id
                    && upData.park_id && 1 <= list.length <= 3
                ) {
                    //如果都填完

                    let ridership = parseInt(upData.ridership)
                    let belong_id = parseInt(upData.carbelong)
                    let brand_id = parseInt(upData.brand_id)
                    this.$post('/admin/dispatch/edit-car', {
                        id: upData.id,
                        plate_no: upData.plate_no,
                        brand_id: brand_id,
                        car_model: upData.car_model,
                        belong_id: belong_id,
                        ridership: ridership,
                        color: upData.color,
                        main_driver_id: upData.main_driver_id,
                        park_id: upData.park_id,
                        remark: upData.remark,
                        car_img,
                        permit_img,
                        assistant_driver_id,
                        type: upData.type,
                        route_name: upData.route_name
                    }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info('修改车辆成功')
                            this.modal = false
                            this.getCarList()
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })

                } else if (!upData.plate_no) {
                    this.$Message.error('请填写车牌号')
                    return
                } else if (!upData.brand_id) {
                    this.$Message.error('请选择车辆品牌')
                    return
                } else if (!upData.car_model) {
                    this.$Message.error('请填写车辆类型')
                    return
                } else if (!upData.carbelong) {
                    this.$Message.error('请选择车辆分类')
                    return
                } else if (!upData.ridership) {
                    this.$Message.error('请选择车辆座位数')
                    return
                } else if (!upData.color) {
                    this.$Message.error('请选择车辆颜色')
                    return
                } else if (!upData.main_driver_id) {
                    this.$Message.error('请选择匹配司机')
                    return
                } else if (!upData.park_id) {
                    this.$Message.error('请选择停放站点')
                    return
                } else if (list.length > 3 || list.length < 1) {
                    this.$Message.error('最多只能选择三个副司机')
                    return
                }
            }
        },

        //操作里面的删除
        remove(id, index) {
            let that = this
            this.$Modal.confirm({
                title: '你确定要删除该车辆吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: function () {
                    this.$post('/admin/dispatch/del-car', {
                        id
                    }).then(res => {
                        if (res.code == 200) {
                            //删除成功
                            this.$Message.info('删除车辆成功')
                            that.data.splice(index, 1);
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })

                },
                onCancel: function () {
                }
            })
        },
        //模态框的取消按钮
        cancel(type) {
            this.formLeft = {}
            this.modal = false
            this.uploadCarImgUrl = ''
            this.uploadXszImgUrl = ''
        },
        //页码
        changePage(e) {
            this.page = e;
            this.getCarList("page");
        },
    }
}