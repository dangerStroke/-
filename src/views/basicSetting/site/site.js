import api from '../../../api/api.js'
import site from './site.less'
export default {
    name: 'site',
    data() {
        return {
            columns12: [
                {
                    title: '站点编号',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '站点名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '区域范围',
                    slot: 'location',
                    align: 'center'
                },
                {
                    title: '接人时间(h)',
                    slot: 'pick_up_time',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            data6: [], //页面数据
            modal: false, //新建弹出框的显示隐藏
            formLeft: {},
            modalTitle: '', //模态框的标题
            quyuData: [], //新建站点的区域范围
            radioValue: "",//站点范围的单选按钮
            pickUpTimeValue: '',
            // pickUpTimeValueData: [], //后台请求的接人时间放进一个数组
            pickUpTimeValueData: [
                0.5,
                1,
                1.5,
                2
            ],
            makeSureEditId: '', //确认修改的某一条数据的id
            page: 1,
            pagesize: 10,
            total: 0,

            proviceList: [],
            cityList: [],
            areaList: [],
            proviceValue: '',
            cityValue: '',
            areaValue: '',
            code: [],
            area: []
        }
    },
    created() {
        this.$Spin.show();
        //在这里面进行数据请求
        this.getTableData()
        //获取区域范围
        this.$fetch('/admin/dispatch/list-location').then(res => {
            this.$Spin.hide();
            if (res) {
                if (res.code == 200) {
                    this.quyuData = res.data.data
                }
                else {
                    this.$Message.warning(res.error)
                }
            }

        }).catch(err => {
            this.$Spin.hide();
            // this.$Message.warning("服务器端异常")
        })

        //获取area省份的json文件
        this.$fetch('https://static2.jd-gz.com/area.json').then(res => {
            console.log(res)
            this.area = res
            let proList = []
            res.map((item, index) => {
                let resultObj = {}
                resultObj.name = res[index].name
                resultObj.adcode = res[index].adcode
                proList.push(resultObj)
                return proList
            })
            this.proviceList = proList
        })
    },
    watch: {
        radioValue(newVal, oldVal) {
            // console.log(newVal)
        }
    },
    methods: {
        //选取的城市列表
        proviceChange(e) {
            this.proviceValue = e
            let cityListCopy = []
            this.area.map((item, index) => {
                if (item.adcode == e) {
                    // console.log(item.districts)
                    item.districts.map((itemDis, indexDis) => {
                        let resultObj = {}
                        resultObj.name = item.districts[indexDis].name
                        resultObj.adcode = item.districts[indexDis].adcode
                        resultObj.citycode = item.districts[indexDis].citycode
                        cityListCopy.push(resultObj)
                        return cityListCopy
                    })

                }
            })
            console.log(cityListCopy)
            this.cityList = cityListCopy
        },
        cityChange(e) {
            console.log(e)
            this.cityValue = e
            // this.code = 
            let list = []
            this.cityList.map((item, index) => {
                if (item.adcode == e) {
                    let obj = {}
                    obj.citycode = item.citycode
                    obj.adcode = item.adcode
                    obj.name = item.name
                    list.push(obj)
                }
            })
            this.code = list

            //获取区县列表
            let areaListCopy = []
            // console.log(area)
            this.area.map((item, index) => {
                if (item.adcode == this.proviceValue) {
                    //省份adcode相同
                    item.districts.map((itemDis, indexDis) => {
                        if (itemDis.adcode == e) {
                            // console.log(itemDis)
                            itemDis.districts.map((itemArea, indexArea) => {
                                let resultObj = {}
                                // console.log(itemArea)
                                resultObj.name = itemArea.name
                                resultObj.adcode = itemArea.adcode
                                areaListCopy.push(resultObj)
                                return areaListCopy
                            })
                        }
                    })
                }
            })
            console.log(areaListCopy)
            this.areaList = areaListCopy

        },
        areaChange(e) {
            console.log(e)
            this.areaValue = e
        },

        // 获取站点列表数据
        getTableData(type) {
            //table数据
            if (type !== "page") {
                this.page = 1;
            }
            let params = {
                page: this.page,
                pagesize: this.pagesize
            }
            this.$fetch('/admin/citytransport/list-station', params).then(res => {
                console.log(res.data.data)
                if (res) {
                    if (res.code == 200) {
                        let data = res.data.data
                        this.data6 = data
                        this.total = res.data.total  // 总页数
                        // let arr = []
                        // data.map(item => {
                        //     //将后台的接人时间由秒变成分
                        //     let time = Math.round(item.pick_up_time / 60)
                        //     //对time进行去重
                        //     arr.push(time)
                        // })
                        // this.pickUpTimeValueData = new Set(arr)
                    }
                    else {
                        this.$Message.warning(res.error)
                    }
                }

            }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
        },
        //操作里面的修改
        newSite(row) {
            console.log(row)
            let that = this
            this.modal = true
            if (row.id) {
                //修改
                this.modalTitle = '修改站点'
                //获取某一站点(row.id)数据
                this.$fetch('/admin/citytransport/get-station', {
                    id: row.id
                }).then(res => {
                    // console.log(res)
                    if (res) {
                        if (res.code == 200) {
                            //请求成功
                            // console.log(res.data)
                            this.formLeft = res.data
                            this.radioValue = res.data.location_id
                            this.pickUpTimeValue = res.data.pick_up_time / 3600
                            this.makeSureEditId = res.data.id

                            this.area.map((item, index) => {
                                // console.log(item)
                                //匹配省份
                                if (item.adcode.substring(0, 2) == res.data.ad_code.substring(0, 2)) {
                                    // console.log(item)
                                    that.proviceValue = item.adcode
                                    // console.log(item.districts)
                                    //匹配城市
                                    let cityListCopy = []
                                    item.districts.map((itemDis, indexDis) => {
                                        // console.log(itemDis)
                                        let resultObj = {}
                                        resultObj.name = item.districts[indexDis].name
                                        resultObj.adcode = item.districts[indexDis].adcode
                                        resultObj.citycode = item.districts[indexDis].citycode
                                        cityListCopy.push(resultObj)
                                        // console.log(itemDis.adcode)
                                        if (itemDis.citycode == res.data.city_code) {
                                            that.cityValue = itemDis.adcode
                                            console.log(that.cityValue)
                                            let areaArr = []
                                            itemDis.districts.map((itemArea, indexArea) => {
                                                // console.log(itemArea)
                                                let obj = {}
                                                obj.name = itemArea.name,
                                                    obj.adcode = itemArea.adcode,
                                                    areaArr.push(obj)
                                                if (itemArea.adcode == res.data.ad_code) {
                                                    that.areaValue = res.data.ad_code
                                                }
                                                return areaArr
                                            })
                                            that.areaList = areaArr

                                        }
                                        return cityListCopy
                                    })
                                    // console.log(cityListCopy)
                                    that.cityList = cityListCopy
                                }
                            })
                            // console.log(this.cityList)
                        }
                        else {
                            this.$Message.warning(res.error)
                        }
                    }

                }).catch(err => {
                    this.$Spin.hide();
                })
            } else {
                //新建
                this.modalTitle = '新建站点'
                this.formLeft = {}
                this.radioValue = ''
                this.pickUpTimeValue = ''
                this.proviceValue = '',
                this.cityValue = '',
                this.areaValue = '',
                this.code = []
            }
        },
        //操作里面的删除
        remove(id, index) {
            let that = this
            this.$Modal.confirm({
                title: '你确定要删除该站点吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: function () {
                    console.log('确定删除', id)
                    this.$post('/admin/citytransport/del-station', {
                        id
                    }).then(res => {
                        console.log(res)
                        if (res) {
                            if (res.code == 200) {
                                //删除成功
                                this.$Message.info('删除站点成功')
                                that.data6.splice(index, 1);
                            } else {
                                this.$Message.warning(res.error)
                            }
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
        //新建和修改模态框点击确定
        infoSure(type) {
            // this.$Message.info('点击确定');
            if (type == '新建站点') {
                console.log("citycode", this.code[0].citycode)
                console.log("adcode", this.areaValue)
                // 新建站点
                if (this.formLeft.name && this.radioValue && this.pickUpTimeValue && this.cityValue) {
                    // console.log(this.pickUpTimeValue)
                    let time = this.pickUpTimeValue * 3600
                    // console.log(time)
                    //所有数据填完,进行站点添加

                    this.$post('/admin/citytransport/add-station', {
                        name: this.formLeft.name,
                        pick_up_time: time,
                        location_id: this.radioValue,
                        city_code: this.code[0].citycode,
                        ad_code: this.areaValue
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            this.$Message.info('新建站点成功')
                            //刷新页面
                            this.modal = false
                            this.getTableData()
                        } else if (res.code == 502) {
                            this.$Message.warning(`${res.error}`)
                            this.getTableData()
                        }
                        else {
                            this.$Message.warning(`${res.error}`)
                        }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })

                } else if (!this.formLeft.name) {
                    this.$Message.warning('请填写站点名称');
                    return
                } else if (!this.radioValue) {
                    this.$Message.warning('请选择区域范围');
                    return
                } else if (!this.pickUpTimeValue) {
                    this.$Message.warning('请选择接人时间');
                    return
                } else if (!this.cityValue) {
                    this.$Message.warning('请选择城市');
                    return
                }
            } else if (type == '修改站点') {
                //修改站点的确定
                console.log(this.formLeft.name, this.radioValue, this.pickUpTimeValue, this.makeSureEditId)
                if (this.formLeft.name && this.radioValue && this.pickUpTimeValue && this.makeSureEditId) {
                    let time = this.pickUpTimeValue * 3600
                    this.$post('/admin/citytransport/edit-station', {
                        id: this.makeSureEditId,
                        name: this.formLeft.name,
                        pick_up_time: time,
                        location_id: this.radioValue,
                        city_code: this.code[0].citycode,
                        ad_code: this.areaValue
                    }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                            this.$Message.info('修改站点成功')
                            this.modal = false
                            //重新刷新页面
                            this.getTableData()
                        }
                        else {
                            this.$Message.warning(res.error)
                        }
                        // else if(res.code == 502){
                        //     this.$Message.warning(res.error + '已恢复该站点')
                        // }
                    }).catch(err => {
                        this.$Spin.hide();
                        // this.$Message.warning("服务器端异常")
                    })
                }
            }
        },
        //新建和修改模态框点击取消
        cancel(type) {
            // this.$Message.info('点击取消');
            if (type == '新建站点') {
                //如果是新建站点，就把之前的内容清空
                this.formLeft.name = ''
            }
            this.modal = false

        },
        //选择接人时间
        chooseTime(time) {
            console.log(time)
            //time即是选择的时间
        },
        //页码
        changePage(e) {
            this.page = e;
            this.getTableData("page");
        },
    }
}