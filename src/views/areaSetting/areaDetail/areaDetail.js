import AMap from 'AMap'
import axios from 'axios'
import markerIcon from "./../../../assets/images/location.png"
import startIcon from "./../../../assets/images/start.png"
export default {
    name: "areaDetail",
    data() {
        return {
            map: {},
            name: "",
            points: [],
            areaId: "",
            address: "",
            addressList: [],
            showList: false,
            center: {},
            cityCode: '',
            defaultAddress: "",
            defaultLng: null,
            defaultLat: null
        }
    },
    created() {
        this.areaId = this.$route.params.id
        
    },
    watch: {
        defaultAddress () {
            this.geoCode()
            
        }
    },
    mounted() {
        this.getDetail()
        
    },
    methods: {
        // 根据地址获取经纬度
        geoCode() {
            let _this = this
            let geocoder = new AMap.Geocoder({
                city: "", //城市设为北京，默认：“全国”
            });
            geocoder.getLocation(_this.defaultAddress, function(status, result) {
                console.log("获取经纬度")
                console.log(status)
                console.log(result)
                if (status === "complete") {
                    _this.defaultLng = result.geocodes[0].location.lng
                    _this.defaultLat = result.geocodes[0].location.lat
                    // _this.defaultLocation = `${result.geocodes.location.lng},${result.geocodes.location.lat}`
                }
            });
        },
        // 发送位置信息
        sendPosition() {
            if (!this.defaultAddress || !this.defaultLat || !this.defaultLng) {
                this.$Message.warning("请默认上车地址")
                return
            }
            if (!this.name) {
                this.$Message.warning("请填写区域名称")
                return
            }
            if (this.points.length === 0) {
                this.$Message.warning("请选择区域位置")
                return
            }
            let pointsArr = []
            this.points.map(item => {
                let arr=[]
                arr.push(item.lng)
                arr.push(item.lat)
                pointsArr.push(arr)
            })
            let params = {
                name:this.name,
                point: JSON.stringify(pointsArr),
                id: this.areaId,
                lng: this.defaultLng,
                lat: this.defaultLat,
                addr: this.defaultAddress
            }
            this.$post(`/admin/dispatch/edit-location`,params).then(res => {
                if (res.code === 200) {
                    this.$Message.success("修改成功")
                    setTimeout(() => {
                        this.$router.push({
                            name:"areaList"
                        })
                    },1000)
                    
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                this.$Message.warning("服务端异常")
            })
        },
        // 初始化地图
        MapInit() {
            let _this = this
            var map = new AMap.Map('map', {
                resizeEnable: true,
                zoom: 15
            })
            map.on('click', function (ev) {
                map.clearMap()
                if (_this.center.lat && _this.center.lng) {
                    _this.setMarker(_this)
                }
                let obj = {
                    lat: ev.lnglat.lat,
                    lng: ev.lnglat.lng
                }
                _this.points.push(obj)
                let locationArr = []
                _this.points.map((item, index) => {
                    let point = new AMap.LngLat(item.lng, item.lat)
                    locationArr.push(point)
                    if (index === 0) {
                        _this.setStart(_this, item.lng, item.lat)
                    }
                })
                var polygon = new AMap.Polygon({
                    path: locationArr,
                    fillOpacity: '0.5',
                    fillColor: '#fff', // 多边形填充颜色
                    borderWeight: 0.2, // 线条宽度，默认为 1
                    strokeColor: 'red' // 线条颜色
                })
                map.add(polygon)
            })
            _this.map = map
            if (_this.points.length > 0) {
                let locationArr =[]
                _this.points.map((item, index) => {
                    let point = new AMap.LngLat(item.lng, item.lat)
                    locationArr.push(point)
                    if (index === 0) {
                        _this.setStart(_this, item.lng, item.lat)
                    }
                })
                var polygon = new AMap.Polygon({
                    path: locationArr,
                    fillOpacity: '0.5',
                    fillColor: '#fff', // 多边形填充颜色
                    borderWeight: 0.2, // 线条宽度，默认为 1
                    strokeColor: 'red' // 线条颜色
                })
                map.add(polygon)
            }
            map.setCenter(new AMap.LngLat(_this.center.lng, _this.center.lat))
        },
         // 上一步
         preStep() {
            let _this = this
            if (this.points.length > 0) {
                _this.map.clearMap()
                _this.points.pop()
                let locationArr = []
                _this.points.map((item, index) => {
                    let point = new AMap.LngLat(item.lng, item.lat)
                    locationArr.push(point)
                })
                var polygon = new AMap.Polygon({
                    path: locationArr,
                    fillColor: '#fff', // 多边形填充颜色
                    borderWeight: 0.2, // 线条宽度，默认为 1
                    strokeColor: 'red' // 线条颜色
                })
                _this.map.add(polygon)
                _this.setStart(_this, _this.points[0].lng, _this.points[0].lat)
            } else {
                _this.map.clearMap()
            }
            _this.setMarker(_this)
        },
        // 重新绘制
        reRender() {
            this.map.clearMap()
            this.setMarker(this)
            this.points = []
        },
        // 获取输入提示信息
        autoInput(type) {
            if (type === 'search') {
                this.showList = false
            }
            let _this = this
            if (_this.address) {
                AMap.plugin('AMap.Autocomplete', function () {
                    // 实例化Autocomplete
                    var autoOptions = {
                        // city: _this.cityCode
                    }
                    var autoComplete = new AMap.Autocomplete(autoOptions)
                    autoComplete.search(_this.address, function (status, result) {
                        if (result.tips) {
                            _this.showList = true
                            _this.addressList = result.tips
                        }
                    })
                })
            } else {
                _this.getLocation(_this.map)
            }
        },
        // 设置起点
        setStart(that, lng, lat) {
            let icon = new AMap.Icon({
                size: new AMap.Size(30, 30),    // 图标尺寸
                image: startIcon,  // Icon的图像
                // imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
                imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
            });
            let marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),
                icon: icon,
                offset: new AMap.Pixel(-13, -30)
            });
            that.map.add(marker);
        },
        // 选择地址
        chooseAddress(item) {
            let location = {
                lat: item.location.lat,
                lng: item.location.lng
            }
            this.center = location
            this.map.setCenter([item.location.lng, item.location.lat])
            this.setMarker(this)
            this.showList = false
        },
        // 地址关键字搜索
        addressSearch() {
            let _this = this
            axios
                .get('https://restapi.amap.com/v3/assistant/inputtips', {
                    params: {
                        key: '1f3c1c376736a472b55797bf1c03d6f0',
                        keywords: _this.address
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .then(response => {
                })
                .catch(err => {
                })
        },
        // 设置中点图标
        setMarker(that) {
            let icon = new AMap.Icon({
                size: new AMap.Size(30, 30),    // 图标尺寸
                image: markerIcon,  // Icon的图像
                // imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
                imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
            });
            let marker = new AMap.Marker({
                position: new AMap.LngLat(that.center.lng, that.center.lat),
                icon: icon,
                offset: new AMap.Pixel(-13, -30)
            });
            that.map.add(marker);
        },
        // 获取区域详情
        getDetail() {
            this.$post(`/admin/dispatch/get-location`, { id: this.areaId }).then(res => {
                if (res.code === 200) {
                    let points = res.data.point
                    if (points.length > 0) {
                        let pointArr = []
                        let totlaLng = 0
                        let totalLat = 0
                        let center = {}
                        points.map(item => {
                            let obj = {
                                lat: item[1],
                                lng: item[0]
                            }
                            totlaLng += item[0]
                            totalLat += item[1]
                            pointArr.push(obj)
                        })
                        center.lng = (totlaLng / points.length).toFixed(6)
                        center.lat = (totalLat / points.length).toFixed(6)
                        this.center = center
                        this.points = pointArr
                        this.name = res.data.name
                        this.defaultAddress = res.data.addr
                        this.defaultLat = res.data.lat
                        this.defaultLng = res.data.lng
                    }
                    this.MapInit()
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                this.$Spin.hide();
                this.$Message.warning("服务端异常")
            })
        },
    },
}
