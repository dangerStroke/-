import { major } from "semver"
export default {
    name: "trainAdd",
    data() {
        return {
            projectInfo: {
                title: "",
                details: "",
                project: "",
                image: "",
                price: "",
                map: [],
                unit_price: "",

            },
            data4: [
                {
                    title: 'parent 1',
                    expand: true,
                    selected: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1',
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1',
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
            treeData: [],
            upData: {
                token: ""
            },
            img_json: []
        }
    },
    created() {
        this.getTimers()
    },
    mounted() {
        this.getToken()
    },
    methods: {
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
        // 取消保存
        cancleSubmit() {
            this.$router.push({
                name: "trainList"
            })
        },
        // 提交保存
        saveSetting() {
            let data = new Object()
            data = JSON.parse(JSON.stringify(this.treeData))
            let dataArr = []
            data.map((item, index) => {
                if (item.checked && item.children.length === 0) {
                    dataArr.push(item)
                } else {
                    if (item.children.length > 0) {
                        item.children.map((child, childIndex) => {
                            child.children = child.children.filter((lastNode) => {
                                return child.children.length > 0
                            })
                        })
                        dataArr.push(item)
                    }
                }
            })
            dataArr.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    item.children.map(child => {
                        if (child.children && child.children.length > 0) {
                            child.children = child.children.filter((lastNode) => {
                                return lastNode.checked
                            })
                        }
                    })
                }
            })
            let map = []
            let carCount = []
            let timerCount = []
            dataArr.map((item, index) => {
                item.children.map((car, carIndex) => {
                    if (car.children.length <= 0) {
                        carCount.push(carIndex)
                    }
                })
                for (let i = 0; i < carCount.length; i++) {
                    item.children.map((car, carIndex) => {
                        if (carIndex === carCount[i] || car.children.length === 0) {
                            item.children.splice(carIndex, 1)
                        }
                    })
                }

                // if (item.children.length === 0) {
                //     dataArr.splice(index, 1)
                // }
            })
            let mapArr = []
            dataArr.map(item=> {
               if (item.checked || item.children.length > 0) {
                mapArr.push(item)
               }
            })
            let params = this.projectInfo
            if (!params.title) {
                this.$Message.warning("请填写项目标题")
                return
            }
            if (!params.details) {
                this.$Message.warning("请填写详情宣言")
                return
            }
            if (!params.project) {
                this.$Message.warning("请填写项目详情")
                return
            }
            if (!params.image) {
                this.$Message.warning("请上传项目图片")
                return
            }
            if (this.img_json.length === 0) {
                this.$Message.warning("请上传banner图片")
                return
            }
            if (!params.price) {
                this.$Message.warning("请填写项目价格")
                return
            }
            if (!params.unit_price) {
                this.$Message.warning("请填写人均价格")
                return
            }
            if (Number(params.price) <= 0) {
                this.$Message.warning("项目价格必须大于0")
                return
            }
            if (Number(params.unit_price) <= 0) {
                this.$Message.warning("人均价格必须大于0")
                return
            }

            params.map = mapArr
            params.price = (Number(params.price)) * 1000000 / 10000
            params.unit_price = (Number(params.unit_price)) * 1000000 / 10000
            params.img_json = JSON.stringify(this.img_json)
            this.$post(`/admin/throughtrain/add`, params).then(res => {
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("添加成功")
                        setTimeout(() => {
                            this.$router.push({
                                name: "trainList"
                            })
                        }, 1000);
                    } else {
                        this.$Message.warning("添加失败")
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })

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
        // 上传图片回调
        handleSuccess(res) {
            let imgUrl = "http://static2.jd-gz.com/" + res.key;
            this.projectInfo.image = imgUrl
        },
        // banner上传成功回调
        handleSuccessList(res) {
            let imgUrl = "http://static2.jd-gz.com/" + res.key;
            this.img_json.push(imgUrl)
        },
        // 班次选择事件
        treeChange(e) {
            // console.log(e)
        },
        // 获取班次信息
        getTimers() {
            this.$fetch(`/admin/classes/getClasses`, { type: 2 }).then(res => {
                if (res.code === 200) {
                    let treeData = []
                    let data = res.data
                    data.map((item, index) => {
                        item.title = item.route_name
                        let firstChildren
                        if (item.children) {
                            item.children.map((child, childIndex) => {
                                child.title = child.plate_no
                                if (child.children) {
                                    child.children.map(lastNode => {
                                        lastNode.title = lastNode.time
                                    })
                                }
                            })
                        }
                    })
                    this.treeData = data
                } else {
                    this.$Message.warning(res.error)
                }
            })
        },
    },
}