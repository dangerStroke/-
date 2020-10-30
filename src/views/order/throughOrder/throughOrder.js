import { fetch } from "../../../api/api.js"
import { set } from "shelljs";
import axios from "axios";
export default {
  data() {
    return {
      page: 1,
      pagesize: 10,
      columns: [
        {
          title: '操作',
          slot: 'action',
          align: "center",
          width: 300
        },
        {
          type: "index",
          title: "序号",
          width: 80,
          align: "center"
        },
        {
          title: '订单状态',
          slot: 'status',
          width: 120

        },
        {
          title: '订单编号',
          key: 'order_sn',
          width: 180
        },
        {
          title: '预订人',
          key: 'name',
          width: 160
        },
        {
          title: '预订人电话',
          key: 'phone',
          width: 160
        },
        {
          title: '直通车项目',
          key: 'title',
          width: 200
        },
        {
          title: '门票信息',
          slot: 'ticket',
          width: 100
        },
        {
          title: '车辆',
          key: 'plate_no',
          width: 100
        },
        {
          title: '司机',
          key: 'driver',
          width: 100
        },

        {
          title: '发车时间',
          key: 'date',
          width: 180
        },
        {
          title: '订单创建时间',
          key: 'created_at',
          width: 180
        },
      ],
      listData: [],
      total: 0,
      refundId: '',
      cancleId: '',
      changeType: '',
      orderId: '',
      uid: "",
      modalText: "您确定要删除选中项目吗？",
      showModal: false,
      status: "",
      order_sn: "",
      date: "",
      statusArr: [{
        label: "待支付",
        value: 1
      }, {
        label: "已支付",
        value: 2
      }, {
        label: "已取消",
        value: 3
      }, {
        label: "支付失败",
        value: 4
      }, {
        label: "已完成",
        value: 5
      }, {
        label: "已评价",
        value: 6
      }, {
        label: "已退款",
        value: 7
      }, {
        label: "退款中",
        value: 8
      }],
      showDetail: false,
      detailInfo: {},
      priceData:[],
      priceColum:[{
        title: '类目',
        key: 'title',
      },{
        title: '金额',
        key: 'price',
      }],
      userColum:[
        {
          title:'姓名',
          key:"name",
        },
        {
          title:'身份证号',
          key:"id_card_number",
        }
      ],
      userData:[],
      carList:[]
    };
  },
  created() {
    this.getOrderList("")
    this.getCarList()
  },
  methods: {
    // 绑定车辆
    bindCar () {
      if (this.detailInfo.car_id) {
        let params = {
          order_sn: this.detailInfo.order_sn,
          car_id: this.detailInfo.car_id
        }
        this.$post(`/admin/throughtrain/attach-car`,params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.$Message.success("指派车辆成功")
              this.closeDeatil()
              this.getOrderList("")
            } else {
              this.$Message.warning(res.error)
            }
          } else {
            this.$Message.warning(res.error)
          }
        })
      } else {
        this.$Message.warning("请选择指派的车辆")
      }
    },
    // 关闭详情信心
    closeDeatil () {
      this.showDetail = false
      this.detailInfo = {}
    },
    // 获取车辆列表
    getCarList () {
      this.$fetch(`/admin/index/select-throughtrain-car`).then(res => {
        if (res.code === 200) {
          let listData = []
          if (res.data) {
            let data = res.data
            for (let key in data) {
              let obj = {
                value: key,
                label:data[key]
              }
              listData.push(obj)
            }
          }
          this.carList = listData
        }
      })
    },
    // 价格计算
    countPrice () {
      let now = new Date().getTime()
      let endTime = (new Date ('2020-08-10 23:59:59')).getTime()
      let subTime = endTime - now
      let ticketPrice = 0
      if (subTime > 0) {
        ticketPrice = 4500
      } else {
        ticketPrice = 9000
      }
      let projectPrice =  this.detailInfo.price - ticketPrice*this.detailInfo.num
      let dataArr = [{
        title:this.detailInfo.title,
        price: (projectPrice/100).toFixed(2)
      },{
        title: "海螺沟门票",
        price: ((ticketPrice*this.detailInfo.num)/100).toFixed(2)
      },{
        title: "总计",
        price: (this.detailInfo.price/100).toFixed(2)
      }]
      this.priceData = dataArr
      this.detailInfo.priceStr = (this.detailInfo.price/100).toFixed(2)
    },
    //用户信息统计
    getuserData(){
      console.log(this.detailInfo)
      if(this.detailInfo.cancel_time != 0){
        this.detailInfo.cancel_time =  new Date(this.detailInfo.cancel_time*1000).toLocaleDateString().replace(/\//g, "-") + " " +  new Date(this.detailInfo.cancel_time*1000).toTimeString().substr(0, 8)
      }
      let userData = JSON.parse(this.detailInfo.addon)
      this.userData = userData

    },
    // 查看详情
    bindDetail (row) {
      this.detailInfo = row
      this.showDetail = true
      this.countPrice()
      this.getuserData()
    },
    // 清空数据
    initData() {
      this.status = ""
      this.orderId = ""
      this.date = ""
      this.getOrderList("")
    },
    dateChange(e) {
      this.date = e
    },
    // 确认操作
    bindConfirm() {
      let { order_sn, uid, changeType } = this
      let params = {}
      let url = ""
      let text = ""
      if (changeType === 'cancleId') {
        params = { order_sn }
        url = "/admin/throughtrain/cancel"
        text = "取消成功"
      } else if (changeType === "refundId") {
        params = { order_sn, uid }
        url = "/admin/throughtrain/refund"
        text = "退款成功"
      } else {
        params.order_sn = order_sn
        url = "/admin/throughtrain/complete"
        text = "操作成功"
      }
      if (changeType !== "completeId") {
        this.$fetch(url, params).then(res => {
          this.modalChange("", "cancle", {})
          this.getOrderList("")
          if (res.code === 200) {
            this.$Message.success(text)
          } else {
            this.$Message.warning(res.error)
          }
        })
      } else {
        this.$post(url, params).then(res => {
          this.modalChange("", "cancle", {})
          this.getOrderList("")
          if (res.code === 200) {
            if (res.data) {
              this.$Message.success(text)
            } else {
              this.$Message.warning("操作失败")
            }
          } else {
            this.$Message.warning(res.error)
          }
        })
      }
    },
    // 显示弹窗
    modalChange(name, type, row) {
      if (type === 'show') {
        this.changeType = name
        this.order_sn = row.order_sn
        this.uid = row.uid
        this.showModal = true
      } else {
        this.showModal = false
        this.order_sn = ""
        this.uid = ""
        this.changeType = ""
      }
    },
    // 分页页码改变
    changePage(e) {
      this.page = e;
      this.getOrderList("page");
    },
    // 获取订单列表
    getOrderList(type) {
      if (type !== "page") {
        this.page = 1;
      }
      let { page, pagesize, status, orderId, date } = this
      let params = { page, pagesize, status, date }
      params.order_sn = orderId
      this.$fetch(`/admin/throughtrain/list-order`, params).then(res => {
        if (res.code === 200) {
          this.listData = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.warning(res.error)
        }
      })
    },
    //导出subMIn
    subExcel(){
      let { page, pagesize, status, orderId, date } = this
      let params = { page:1, pagesize:999999, status, date }
      let host = window.location.host
      let baseURL = ""
      if (host == "localhost:8080" || host == "dev-admin.jd-gz.com") {
        baseURL = "http://dev.jd-gz.com/admin/throughtrain/list-order-excel"; 
      } else if (host == "admin.jd-gz.com") {
        baseURL = "http://api.jd-gz.com/admin/throughtrain/list-order-excel"; 
      } else {
        baseURL = "http://adminlocal/admin/throughtrain/list-order-excel";
      }
      axios.get(baseURL, {
        params,
        responseType: 'blob'
      }).then(res => {
        const BLOB = res.data; // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
        const fileReader = new FileReader(); // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
        fileReader.readAsDataURL(BLOB); // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
        fileReader.onload = (event) => { // 处理load事件。该事件在读取操作完成时触发
          // 新建个下载的a标签，完成后移除。
          let a = document.createElement('a');
          a.download = `直通车订单报表.xls`;
          a.href = event.target.result; 
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }).catch(err => {
        console.log(err.message)
      });
    }
  },

};