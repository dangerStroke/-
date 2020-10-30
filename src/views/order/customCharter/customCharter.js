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
          width: 200
        },
        {
          title: '车型',
          key: 'carName',
          width: 180
        },
        {
          title: '预订人',
          key: 'name',
          width: 160
        },
        {
          title:'座位数',
          key:'ridership',
          width:80
        },
        {
          title: '预订人电话',
          key: 'phone',
          width: 160
        },
        {
            title:'预定天数',
            key:'dayNum',
            width:100
        },
        {
          title: '出发日期',
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
      modalText: "您确定要删除选中订单吗？",
      showModal: false,
      status: "",
      order_sn: "",
      date: "",
      created_at:"",
      plate_no:"",
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
    // this.getCarList()
  },
  methods: {
    // 关闭
    bindCar () {
      this.closeDeatil()
    },
    // 关闭详情信心
    closeDeatil () {
      this.showDetail = false
      this.detailInfo = {}
    },
    // 价格计算
    countPrice () {
      let dataArr = [{
        title:'定制包车',
        price: (this.detailInfo.car_model.price/100).toFixed(2)+'/天'
      },{
        title: "总计",
        price: (this.detailInfo.price/100).toFixed(2)
      }]
      this.priceData = dataArr
      this.detailInfo.priceStr = (this.detailInfo.price/100).toFixed(2)
    },
    //用户信息统计
    // getuserData(){
    //   if(this.detailInfo.cancel_time != 0){
    //     this.detailInfo.cancel_time =  new Date(this.detailInfo.cancel_time*1000).toLocaleDateString().replace(/\//g, "-") + " " +  new Date(this.detailInfo.cancel_time*1000).toTimeString().substr(0, 8)
    //   }
    //   let userData = JSON.parse(this.detailInfo.addon)
    //   this.userData = userData

    // },
    // 查看详情
    bindDetail (row) {
      this.detailInfo = row
      this.showDetail = true
      this.countPrice()
    //   this.getuserData()
    },
    // 清空数据
    initData() {
      this.status = ""
      this.orderId = ""
      this.date = ""
      this.plate_no = ""
      this.created_at = ""
      this.getOrderList("")
    },
    dateChange(e) {
      this.date = e
    },
    created_atChange(e) {
      this.created_at = e
    },
    // 确认操作
    bindConfirm() {
      let { order_sn, uid, changeType } = this
      let params = {}
      let url = ""
      let text = ""
      if (changeType === 'cancleId') {
        params = { order_sn }
        url = "/admin/pay/cancel"
        text = "取消成功"
      } else if (changeType === "refundId") {
        params = { order_sn, uid }
        url = "/admin/pay/refund"
        text = "退款成功"
      }
      if (changeType !== "completeId") {
        this.$post(url, params).then(res => {
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
      console.log(type)
      if (type === 'show') {
        this.changeType = name
        this.order_sn = row.order_sn
        this.uid = String(row.uid)
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
      let { page, pagesize, status, orderId, date,created_at} = this
      let params = { page, page_size:pagesize,status,order_sn:orderId, stime:date,created_at}
      this.$fetch(`/admin/charter/list-order`, params).then(res => {
        if (res.code === 200) {
          res.data.data.map(item => {
            item['carName'] = item.car_model.name
            item['ridership'] = item.car_model.ridership
            item['dayNum'] = item.price/item.car_model.price+'天'
            item.date = item.stime.slice(0,10)
          })
          this.listData = res.data.data
          console.log(this.listData)
          this.total = res.data.total
        } else {
          this.$Message.warning(res.error)
        }
      })
    },

    //导出excel
        //导出subMIn
        subExcel(){
          let { page, pagesize, status, orderId, date, created_at,plate_no} = this
          let params = { page:1, page_size:999999, status, date,order_sn:orderId, created_at,plate_no}
          let host = window.location.host
          let baseURL = ""
          if (host == "localhost:8080" || host == "dev-admin.jd-gz.com") {
            baseURL = "http://dev.jd-gz.com/admin/scenic-area/gets-excel"; 
          } else if (host == "admin.jd-gz.com") {
            baseURL = "http://api.jd-gz.com/admin/scenic-area/gets-excel"; 
          } else {
            baseURL = "http://adminlocal/admin/scenic-area/gets-excel";
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
                a.download = `定制游订单报表.xls`;
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