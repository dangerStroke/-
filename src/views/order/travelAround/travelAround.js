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
          title: '周边游项目',
          key: 'title',
          width: 200
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
      let projectPrice =  (this.detailInfo.price/100).toFixed(2)
      let dataArr = []
      if(this.detailInfo.status == 8){
         dataArr = [{
          title: "周边游费用",
          price: projectPrice
        },
        {
          title: "退款",
          price: projectPrice
        },{
          title: "总计",
          price: 0
        }]
      }else{
        dataArr = [{
          title: this.detailInfo.title,
          price: projectPrice
        },{
          title: "总计",
          price: (this.detailInfo.price/100).toFixed(2)
        }]
      }
      this.priceData = dataArr
      this.detailInfo.priceStr = (this.detailInfo.price/100).toFixed(2)
    },
    // 查看详情
    bindDetail (row) {
      this.detailInfo = row
      this.showDetail = true
      this.countPrice()
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
      console.log(changeType)
      if (changeType === 'cancleId') {
        params = { order_sn }
        url = "/admin/travel-around-cancel"
        text = "取消成功"
        this.$fetch(url,params).then(res => {
          console.log(res)
          if(res.code == 200){
            this.modalChange("", "cancle", {})
            this.getOrderList("")
            this.$Message.success(text)
          }else {
            this.modalChange("", "cancle", {})
            this.getOrderList("")
            this.$Message.warning(res.error)
          }
        })
      } else if (changeType === "refundId") {
        params = { order_sn }
        url = "/admin/travel-around-refund"
        text = "退款成功"
        this.$fetch(url,params).then(res => {
          if(res.code == 200){
            this.modalChange("", "cancle", {})
            this.getOrderList("")
            this.$Message.success(text)
          }else {
            this.modalChange("", "cancle", {})
            this.getOrderList("")
            this.$Message.warning(res.error)
          }
        })
      }else if(changeType === 'completeId'){
        params = { order_sn }
        url = "/admin/travel-around-complete"
        text = "订单完成"
        this.$fetch(url,params).then(res => {
          console.log(res)
          if(res.code == 200){
            this.modalChange("", "cancle", {})
            this.getOrderList("")
            this.$Message.success(text)
          }else {
            this.modalChange("", "cancle", {})
            this.getOrderList("")
            this.$Message.warning(res.error)
          }
        })
      }
      // if (changeType !== "completeId") {
      //   this.$fetch(url, params).then(res => {
      //     this.modalChange("", "cancle", {})
      //     this.getOrderList("")
      //     if (res.code === 200) {
      //       this.$Message.success(text)
      //     } else {
      //       this.$Message.warning(res.error)
      //     }
      //   })
      // } else {
      //   this.$post(url, params).then(res => {
      //     this.modalChange("", "cancle", {})
      //     this.getOrderList("")
      //     if (res.code === 200) {
      //       if (res.data) {
      //         this.$Message.success(text)
      //       } else {
      //         this.$Message.warning("操作失败")
      //       }
      //     } else {
      //       this.$Message.warning(res.error)
      //     }
      //   })
      // }
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
      let params = { page:1, pagesize:999999, status, date }
      params.order_sn = orderId
      this.$fetch(`/admin/travel-around-order-list`, params).then(res => {
        if (res.code === 200) {
          res.data.data.forEach(ele => {
            ele['title'] = ele.travel_around.title
          })
          this.listData = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.warning(res.error)
        }
      })
    },
  },

};