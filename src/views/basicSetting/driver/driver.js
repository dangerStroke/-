import driver from './driver.less'
export default {
    name: 'driver',
    data() {
        return {
            columns: [
                {
                    title: '状态',
                    slot: 'status',
                    align: 'center'
                },
                {
                    title: '司机编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '司机角色',
                    slot: 'role_id',
                    align: 'center'
                },
                {
                    title: '司机类型',
                    slot: 'type',
                    align: 'center'
                },
                {
                    title: '司机姓名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '司机手机号',
                    key: 'phone',
                    align: 'center'
                },
                {
                    title: '司机授权码',
                    key: 'invitation_code',
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
            modal: false, //新建弹出框的显示隐藏
            formLeft: {},
            name: '',//搜索框的姓名
            phoneNumber: '', //搜索框的手机号码
            idCard: '', //搜索框的身份证号
            carNumber: '', //搜索框的车牌号
            statusDropdown: '状态', //搜索框的下拉文字
            modalTitle: '', //模态框的标题
            page: 1,
            pagesize: 10,
            total: 0,
            driverPic: '',
            driverLicense: '',
            queryParams: {
                name: '',
                phoneNumber: '',
                idCard: '',
                model1: '' //model1是状态(停用或启用)
            }, //筛选的json数据
            statusList: [
                {
                    value: '全部',
                    label: '全部'
                },
                {
                    value: '启用',
                    label: '启用'
                },
                {
                    value: '停用',
                    label: '停用'
                }
            ],

            name: '',
            phoneNumber: '',
            idCard: '',
            model1: '', //model1是状态(停用或启用)
            uploadDriverImgUrl: '', //司机图片地址
            uploadXszImgUrl: '',//驾驶证图片地址
            roleId: '',
            roleList: [], //司机角色的列表
            siteList: [], //起始站点的列表
            bigKindList: [{
                value: 1,
                label: '城际接送'
            }, {
                value: 2,
                label: '司乘快客'
            },{
                value: 7,
                label: '直通车'
            }], //司机是城际接送的司机还是司乘快客的司机

            isMainList: [{
                value: 1,
                label: '主司机'
            }, {
                value: 0,
                label: '副司机'
            }], //司机是城际接送的主司机还是副司机
        }
    },
    watch: {
    },
    created() {
        this.$Spin.show();
        //获取司机数据列表
        this.getDriverDataList()
        this.getRoleId()
        this.getSite() //获取起始站点
    },

    methods: {
        //获取司机列表数据
        //获取司机角色的下拉列表
        getRoleId() {
            let that = this
            this.$fetch('/admin/index/select-driver-role').then(res => {
                console.log(res)
                if (res.code == 200) {
                    let list = Object.keys(res.data).map((item, index) => ({ value: item, label: res.data[item] }))
                    that.roleList = list
                    console.log(list)
                } else {
                    that.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
        },

        getSite() {
            let that = this
            //获取起始站点列表
            this.$fetch('/admin/citytransport/list-station').then(res => {
                console.log(res.data.data)
                if (res.code == 200) {
                    let list = res.data.data.map(({ id, name }) => ({ label: name, value: id }))
                    console.log(list)
                    that.siteList = list
                } else {
                    that.$Message.warning(res.error)
                }
            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
        },


        //清空按钮
        clearSerach() {
            // this.queryParams={}
            this.name = ''
            this.phoneNumber = ''
            this.idCard = ''
            this.model1 = ''
            this.getDriverDataList()
        },
        //搜索和获取司机数据列表的按钮
        getDriverDataList(type) {
            let status = ''
            if (this.model1 == '停用') {
                status = 0
            } else if (this.model1 == '启用') {
                status = 1
            } else if (this.model1 == '全部') {
                status = -1
            } else {
                status = -1
            }
            if (type !== "page") {
                this.page = 1
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize,
                name: this.name || '',
                phone: this.phoneNumber || '',
                id_card_number: this.idCard || '',
                status
            }
            this.$fetch('/admin/dispatch/list-driver', params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    console.log(res)
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

        //状态的按钮
        statusBtn(row) {
            let that = this
            console.log(row.status)
            let str = ''
            if (row.status == 0) {
                str = '启用'
            } else {
                str = '停用'
            }
            console.log(str)
            this.$Modal.confirm({
                title: `你确定要${str}该司机吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk: function () {
                    let newStatus = ''
                    if (row.status == 0) {
                        newStatus = 1
                    } else if (row.status == 1) {
                        newStatus = 0
                    }
                    //调用修改司机的方法,将状态传进去,改变状态
                    // that.editInfo(row, newStatus)
                    this.$fetch('/admin/dispatch/edit-driver', {
                        id: row.id,
                        status: newStatus
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            that.$Message.info('修改状态成功')
                            that.getDriverDataList()
                        } else {
                            that.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })

                },
                onCancel: function () {
                    console.log('点击了取消删除')
                }
            })
        },

        //新建和修改按钮
        newSite(row) {
            this.modal = true
            if (row.id) {
                //修改按钮
                this.modalTitle = '修改司机'
                // console.log(row.id)
                // this.formLeft = row
                this.$fetch('/admin/dispatch/get-driver', {
                    id: row.id
                }).then(res => {
                    console.log(res.data)
                    if (res.code == 200) {
                        //这一条数据获取成功
                        this.formLeft = res.data
                        let value = res.data.id_card_number
                        let birth = value.substring(6, 10) + "-" + value.substring(10, 12) + "-" + value.substring(12, 14)
                        //将身份证里面获取到的生日赋给生日框
                        this.formLeft.driverBirthDay = birth
                        this.uploadDriverImgUrl = res.data.driver_license_img  //驾驶证照片
                        this.uploadXszImgUrl = res.data.selfie_img //司机照片
                        this.formLeft.role_id = this.formLeft.role_id.toString()
                    } else {
                        this.$Message.warning(res.error)
                    }
                }).catch(err => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务器端异常")
                })
            } else {
                //新建按钮
                this.modalTitle = '新建司机'
                this.formLeft = {}
                this.uploadDriverImgUrl = ''
                this.uploadXszImgUrl = ''
                this.formLeft.role_id = ''
            }
        },
        //上传图片
        //司机照片
        handleUploadiconDriver(file) {
            let that = this
            this.$uploadImg(file, (file) => {
                // console.log(file)
                that.uploadDriverImgUrl = file
            })
        },
        //驾驶证照片
        handleUploadiconXsz(file) {
            let that = this
            this.$uploadImg(file, (file) => {
                // console.log(file)
                that.uploadXszImgUrl = file
            })
        },
        handleFormatError1(file) {
            this.$Message.info("图片格式不正确,请上传正确的图片格式");
        },

        // 表单内容验证
        validate(type, value) {
            // console.log(type, value)
            //手机号码验证
            if (type == 'phone') {
                if (value == '') {
                    this.$Message.error('手机号码不能为空！');
                    return false;
                }
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!myreg.test(value)) {
                    this.$Message.error('请输入有效的手机号码！');
                    return false;
                }
            } else if (type == 'id_card_number') {
                //身份证号码验证
                if (value == "") {
                    this.$Message.error("请输入身份证号！"); return false;
                }
                if (!(/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(value))) {
                    this.$Message.error("身份证号有误，请重新输入"); return false;
                }
                let birth = value.substring(6, 10) + "-" + value.substring(10, 12) + "-" + value.substring(12, 14)
                //将身份证里面获取到的生日赋给生日框
                this.formLeft.driverBirthDay = birth
            } else if (type == 'bank_card') {
                //银行卡号验证
                if (value == "") {
                    this.$Message.error("请输入银行卡号！"); return false;
                }
                if (!(/^([1-9]{1})(\d{15}|\d{18})$/).test(value)) {
                    this.$Message.error("银行卡号有误，请重新输入"); return false;
                }
            }
        },

        //模态框的确定按钮
        infoSure(type) {
            // console.log(type)
            if (type == '新建司机') {
                //是新建司机的确定按钮
                let upData = this.formLeft
                console.log(upData.park_id)
                console.log(upData.type)
                if (upData.type == 2) {
                    upData.is_main_driver = 1
                }
                console.log(upData.is_main_driver)
                let selfie_img = this.uploadDriverImgUrl //司机照片
                let driver_license_img = this.uploadXszImgUrl //驾驶证照片
                // console.log(selfie_img, driver_license_img)
                if (upData.name && upData.gender && upData.phone && upData.id_card_number && upData.addr
                    && upData.wechat && upData.type && selfie_img && driver_license_img  
                ) {
                    //全都填完
                    // console.log('全都填完')
                    let phone = upData.phone.toString()
                    let id_card_number = upData.id_card_number.toString()
                    this.$post('/admin/dispatch/add-driver', {
                        phone,
                        name: upData.name,
                        status: upData.status,
                        gender: upData.gender,
                        id_card_number,
                        role_id: upData.role_id,
                        addr: upData.addr,
                        wechat: upData.wechat,
                        bank_card: upData.bank_card,
                        bank_name: upData.bank_name,
                        comment: upData.comment,
                        selfie_img,
                        driver_license_img,
                        type: upData.type,
                        is_main_driver: upData.is_main_driver,
                        park_id: upData.park_id
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            this.$Message.info('新增司机成功')
                            this.modal = false
                            //刷新页面
                            this.getDriverDataList()
                            this.formLeft = {}
                        } else {
                            this.$Message.warning(res.error)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })

                }
                else if (!selfie_img) {
                    this.$Message.error('请上传司机照片')
                    return
                }
                else if (!driver_license_img) {
                    this.$Message.error('请上传驾驶证照片')
                    return
                }
                else if (!upData.name) {
                    this.$Message.error('请输入姓名')
                    return
                } else if (!upData.status) {
                    this.$Message.error('请选择司机状态')
                    return
                } else if (!upData.gender) {
                    this.$Message.error('请选择性别')
                    return
                } else if (!upData.role_id) {
                    this.$Message.error('请选择司机角色')
                    return
                } else if (!upData.addr) {
                    this.$Message.error('请填写家庭住址')
                    return
                } else if (!upData.wechat) {
                    this.$Message.error('请填写微信号')
                    return
                } else if (!selfie_img) {
                    this.$Message.error('请上传司机照片')
                    return
                } else if (!driver_license_img) {
                    this.$Message.error('请上传驾驶证照片')
                    return
                } else if (!upData.type) {
                    this.$Message.error('请选择司机类型')
                    return
                } else if (!upData.is_main_driver) {
                    this.$Message.error('请选择主司机')
                    return
                } 

            } else if (type == '修改司机') {
                //是修改司机的按钮
                this.editInfo(this.formLeft, this.formLeft.status)
            }
        },
        //修改司机信息的方法
        editInfo(data, status) {
            let upData = data
            let selfie_img = this.uploadDriverImgUrl //司机照片
            let driver_license_img = this.uploadXszImgUrl //驾驶证照片
            if (upData.type == 2) {
                upData.is_main_driver = 1
            }
            console.log(upData.is_main_driver)
            if (upData.name && upData.gender && upData.phone && upData.id_card_number && upData.addr && upData.wechat && selfie_img && driver_license_img && upData.type ) {
                let phone = upData.phone.toString()
                let id_card_number = upData.id_card_number.toString()
                this.$post('/admin/dispatch/edit-driver', {
                    id: upData.id,
                    phone,
                    name: upData.name,
                    status: status,
                    gender: upData.gender,
                    id_card_number,
                    role_id: upData.role_id,
                    addr: upData.addr,
                    wechat: upData.wechat,
                    bank_card: upData.bank_card,
                    bank_name: upData.bank_name,
                    comment: upData.comment,
                    selfie_img,
                    driver_license_img,
                    is_main_driver: upData.is_main_driver,
                    type: upData.type,
                    park_id: upData.park_id,
                    
                }).then(res => {
                    console.log('修改司机成功')
                    if (res.code == 200) {
                        this.$Message.info('修改司机成功')
                        this.modal = false
                        //刷新页面
                        this.getDriverDataList()
                        this.formLeft = {}
                    } else {
                        this.$Message.warning(res.error)
                    }
                }).catch(err => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务器端异常")
                })

            } else if (!upData.name) {
                this.$Message.error('请输入姓名')
                return
            }
            else if (!upData.gender) {
                this.$Message.error('请选择性别')
                return
            } else if (!upData.role_id) {
                this.$Message.error('请选择司机角色')
                return
            } else if (!upData.addr) {
                this.$Message.error('请填写家庭住址')
                return
            } else if (!upData.wechat) {
                this.$Message.error('请填写微信号')
                return
            } else if (!upData.type) {
                this.$Message.error('请选择司机类型')
                return
            } else if (!upData.is_main_driver) {
                this.$Message.error('请选择主司机')
            }

        },
        //模态框的取消按钮
        cancel(type) {
            console.log('取消', type)
            this.modal = false
            this.formLeft = {}
            console.log(this.formLeft)
            this.uploadDriverImgUrl = ''
            this.uploadXszImgUrl = ''
        },
        //页码
        changePage(e) {
            this.page = e;
            this.getDriverDataList("page")
        },


    }
}