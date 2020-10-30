import AMap from 'AMap'
import axios from 'axios'
export default {
  data() {
    return {
      map: {},
      points: [],
      address: '',
      addressList: [],
      showList: false,
      center: {},
      cityCode: '',
      marker: {}
    }
  },
  created() {
    let marker = new AMap.Marker({
      position: new AMap.LngLat(that.center.lng, that.center.lat),
      icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
      offset: new AMap.Pixel(-13, -30)
    });
    console.log("marker")
    console.log(marker)

  },
  computed: {
  },
  mounted() {
    this.MapInit()
  },
  watch: {
    address() {
      this.autoInput('')
      // this.addressSearch()
    }
  },
  methods: {
    // 设置中点图标
    setMarker(that) {
      let marker = new AMap.Marker({
        position: new AMap.LngLat(that.center.lng, that.center.lat),
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-13, -30)
      });
      that.map.add(marker);
    },
    // 发送位置信息
    sendPosition() {
      if (this.points.length > 0) {
        this.$Message.success('发送成功')
      } else {
        this.$Message.warning('请选择地点')
      }
    },
    // 选择地址
    chooseAddress(item) {
      let location = {
        lat: item.location.lat,
        lng: item.location.lng
      }
      this.center = location
      this.map.setCenter([item.location.lng, item.location.lat])
      this.showList = false
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
    // 地址关键字搜索
    addressSearch() {
      let _this = this
      axios
        .get('https://restapi.amap.com/v3/assistant/inputtips', {
          params: {
            key: '378e9c01b887d13383eba7dc7ef637b8',
            keywords: _this.address
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then(response => {
          console.log('地址搜索')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 初始化地图
    MapInit() {
      let _this = this
      var map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: 10
      })
      _this.getLocation(map)
      map.on('click', function (ev) {
        map.clearMap()
        let obj = {
          lat: ev.lnglat.lat,
          lng: ev.lnglat.lng
        }
        _this.points.push(obj)
        let locationArr = []
        _this.points.map((item, index) => {
          let point = new AMap.LngLat(item.lng, item.lat)
          locationArr.push(point)
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
      // _this.setMarker(_this)
    },
    // 上一步
    preStep() {
      if (this.points.length > 1) {
        let _this = this
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
      }
    },
    // 发送位置
    sendLocation() { },
    // 重新绘制
    reRender() {
      this.map.clearMap()
      this.points = []
    },
    getLocation(map) {
      let _this = this
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          // timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', onComplete)
        AMap.event.addListener(geolocation, 'error', onError)

        function onComplete(data) {
          _this.cityCode = data.addressComponent.citycode
          _this.center = {
            lng: data.position.lng,
            lat: data.position.lat
          }
          // map.center = data.position.lng + ',' + data.position.lat
          map.setCenter([data.position.lng, data.position.lat])
          let marker = new AMap.Marker({
            position: new AMap.LngLat(data.position.lng, data.position.lat),
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            offset: new AMap.Pixel(-13, -30)
          });
          console.log(marker)
          map.add(marker)
          // data是具体的定位信息
        }
        function onError(data) {
          // 定位出错
        }
      })
    }
  }
}
