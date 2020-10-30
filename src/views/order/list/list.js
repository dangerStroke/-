import { fetch } from "../../../api/api.js"
import { set } from "shelljs";
import axios from "axios";
export default {
  data() {
    return {
      columns12: [
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 200
        },
        {
          title: "序号",
          key: "num",
          align: "center",
          width: 70
        },
        {
          title: "订单类型",
          key: "orderType",
          align: "center",
          width: 100
        },
        {
          title: "订单状态",
          key: "status",
          align: "center",
          width: 100
        },
        {
          title: "支付标识",
          key: "payType",
          align: "center",
          width: 100
        },
        {
          title: "订单编号",
          key: "orderNum",
          align: "center",
          tooltip: true,
          width: 165
        },
        {
          title: "线路",
          key: "line",
          align: "center",
          width:130
        },
        {
          title: "预定人",
          key: "user_name",
          align: "center",
          width:100
        },
        {
          title: "乘车人",
          key: "name",
          align: "center",
          width:100
        },
        {
          title: "乘客电话",
          key: "userTel",
          align: "center",
          tooltip: true,
          width:130
        },
        {
          title: "发车日期",
          key: "date",
          align: "center",
          width:115,
        },
        {
          title: "发出时间",
          key: "time",
          align: "center",
          width:100
        },
        {
          title: "司机",
          key: "driverName",
          align: "center",
          width:110
        },
        {
          title: "车牌号",
          key: "carNum",
          align: "center",
          width:110
        },
        {
          title: "乘车人数",
          key: "userNum",
          align: "center",
          width:80
        }
      ],
      data6: [],//列表数据
      columns15: [
        {
          title: "类目",
          key: "name"
        },
        {
          title: "金额",
          key: "price"
        },
        {
          title: "司机佣金",
          key: "commission"
        }
      ],
      data11: [],//模态框表格
      modal1: false,//模态框
      line: '',//选择路线
      date: '',//发车日期
      status: -1,//订单状态id
      order: '',//订单状态
      orderTime: '',//订单创建时间
      carName: '',//司机
      orderId: '',//订单编号
      carId: '',//车牌号
      lineList: [],//路线列表
      dateList: [],//发车时间列表
      start_station_id: '',//起点ID
      end_station_id: '',//终点ID
      driver_id:'',//司机id
      orderType: [
        {
          value: '已取消',
          label: '已取消'
        },
        {
          value: '待出行',
          label: '待出行'
        },
        {
          value: '已完成',
          label: '已完成'
        },
        {
          value: '改签成功',
          label: '改签成功'
        },
        {
          value: '已支付',
          label: '已支付'
        },
        {
          value: '未支付',
          label: '未支付'
        },
        {
          value: '退票',
          label: '退票'
        }
      ],//订单状态列表
      orderDate: [],//订单创建时间列表
      orderList: [],//请求订单列表
      page: 1,//页码
      pagesize: 10,//条数
      total: 0,//总数
      detailInfo: '',//详情信息
      cityList: [],
      route_id: '', //线路ID
      book_name:'', //乘车人名称,后端返回的是name
    };
  },
  methods: {
    //详情
    show(index) {
      this.modal1 = true;
      this.$fetch('/admin/order/detail', {
        order_id: this.orderList[index].id
      }).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.detailInfo = res.data
          //计算取消订单时间
          if (this.detailInfo.cancel_time !== 0) {
            this.detailInfo.cancel_time = this.timestampToTime(this.detailInfo.cancel_time)
          } else if (this.detailInfo.refund_time !== 0) {
            //计算退款时间
            this.detailInfo.refund_time = this.timestampToTime(this.detailInfo.refund_time)
          }
          //计算改签时间
          if (this.detailInfo.change_ticket_time !== 0) {
            this.detailInfo.change_ticket_time = this.timestampToTime(this.detailInfo.change_ticket_time)
          }
          //计算发车时间
          this.detailInfo.ticket_time = this.timestampToTime(this.detailInfo.ticket_time)
          //判断订单状态
          if (this.detailInfo.status == 1) {
            this.detailInfo.status = '未支付'
            this.detailInfo['orderType'] = '未支付'
          } else if (this.detailInfo.status == 3 || this.detailInfo.status == 2) {
            this.detailInfo.status = '待出行'
            this.detailInfo['orderType'] = '已支付'
          } else if (this.detailInfo.status == 9) {
            this.detailInfo.status = '已完成'
            this.detailInfo['orderType'] = '已支付'
          } else if (this.detailInfo.status == 8) {
            this.detailInfo.status = '订单已取消'
            this.detailInfo['orderType'] = '未支付'
          } else if (this.detailInfo.status == 6) {
            this.detailInfo.status = '改签成功'
            this.detailInfo['orderType'] = '已支付'
          } else if (this.detailInfo.status == 5) {
            this.detailInfo.status = '已退票'
            this.detailInfo['orderType'] = '未支付'
          }else if(this.detailInfo.status === 11){
            this.detailInfo.status = '已完成',
            this.detailInfo['orderType'] = '已支付'
          }
          let data11=[
           
          ]
          res.data.order.forEach(res => {
            console.log(res)
            res.commission = (res.commission/100).toFixed(2)
            res.price = (res.price/100).toFixed(2)
           data11.push(res)
          })
          this.data11 = data11

        }
      }).catch(err => {
        this.$Spin.hide();
        // this.$Message.warning("服务器端异常")
    })
    },
    //取消
    remove(index) {
      console.log(index)
      console.log(this.orderList)
      if (this.orderList[index].status == 2 || this.orderList[index].status == 6) {
        if(this.orderList[index].price_pay != 0){
          console.log(this.orderList[index])
          this.$Modal.confirm({
            content: `你确定要删除该订单?<br>若确定取消,该订单金额将全部退还`,
            onOk: () => {
              let params = {
                order_sn: String(this.orderList[index].order_sn),
                uid: String(this.orderList[index].uid),
              }
              this.$fetch("/admin/order/refund", params).then(res => {
                 if (res.code == 200) {
                  this.getOrderList()
                  this.$Message.success({
                    content: '订单取消成功',
                    duration: 2
                  })
                }else{
                  this.$Message.error({
                    content: res.error,
                    duration: 2
                  })
                }
              }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
            }
          });
        }else{
          console.log(this.orderList[index])
          this.$Modal.confirm({
            content: `你确定要删除该订单?`,
            onOk: () => {
              let params = {
                order_sn: String(this.orderList[index].order_sn),
                uid: String(this.orderList[index].uid),
                is_free:1
              }
              this.$fetch("/admin/order/cancel", params).then(res => {
                 if (res.code == 200) {
                  this.getOrderList()
                  this.$Message.success({
                    content: '订单取消成功',
                    duration: 2
                  })
                }else{
                  this.$Message.error({
                    content: res.error,
                    duration: 2
                  })
                }
              }).catch(err => {
                this.$Spin.hide();
                // this.$Message.warning("服务器端异常")
            })
            }
          });
        }
      } else if (this.orderList[index].status == 8 || this.orderList[index].status == 5) {
        this.$Message.error({
          content: '订单已取消',
          duration: 2
        })
      }else if(this.orderList[index].status == 1){
        this.$Modal.confirm({
          content: `你确定要删除该订单?`,
          onOk: () => {
            let params = {
              order_sn: String(this.orderList[index].order_sn),
            }
            this.$fetch("/admin/order/cancel", params).then(res => {
               if (res.code == 200) {
                this.$Message.success({
                  content: '订单取消成功',
                  duration: 2
                })
              }else{
                this.$Message.error({
                  content: res.error,
                  duration: 2
                })
              }
            }).catch(err => {
              this.$Spin.hide();
              // this.$Message.warning("服务器端异常")
          })
          }
        });
      }
    },
    //清空
    clean() {
      this.line = ''
      this.order = ''
      this.orderId = ''
      this.carId = ''
      this.carName = ''
      this.status = -1
      this.date = ''
      this.orderTime = ''
      this.page = 1
      this.lineId = -1,
      this.route_id= '',
      this.driver_id = ''
      this.book_name= ''
      this.getOrderList()
      this.getLine()
    },
    //搜索
    search() {
      let carName = this.carName
      if(carName != ''){
        this.$fetch('/admin/dispatch/list-driver',{
          methods:'POST',
          name:carName
        }).then(res => {
          console.log(res)
          if(res.code == 200 && res.data.data.length > 0){
            
            this.driver_id = res.data.data[0].id
            console.log(this.driver_id)
          }
          this.data6 = []
          this.getOrderList()
        })
      }else{
        this.data6 = []
        this.getOrderList()
      }
      // this.orderList.forEach(res => {
      //   console.log(res)
      //   if(res.driver_name === this.carName){
      //     console.log(res.driver_id)
      //     this.driver_id = res.driver_id
      //   }else if(res.user_name == this.book_name){
      //     this.driver_id = res.driver_id
      //   }
      // })
    },
    //获取选择线路
    lineChange(value) {
      if (value !== undefined) {
        this.route_id = value.split(":")[0]
      }
    },
    //获取发车日期变化
    dateChange(value) {
      this.date = value
    },
    //订单状态变化
    orderTypeChange(value) {
      if (value == '已取消') {
        this.status = 8
      } else if (value == '待出行') {
        this.status = 3
      } else if (value == '已完成') {
        this.status = 9
      } else if (value == '改签成功') {
        this.status = 6
      } else if (value == '未支付') {
        this.status = 1
      } else if (value == '退票') {
        this.status = 5
      } else if(value == '已支付'){
        this.status = 2
      }
    },
    //获取订单创建时间变化
    orderDateChange(value) {
      this.orderTime = value
    },
    //页码改变
    changePage(e) {
      this.page = e;
      this.getOrderList("page");
    },
    //请求订单列表
    getOrderList(type) {
      if (type !== "page") {
        this.page = 1;
      }
      let params = {
        page: this.page,
        page_size: this.pagesize,
        status: this.status,
        route_id:this.route_id,
        date: this.date,
        created_at: this.orderTime,
        order_sn: this.orderId,
        driver_id:this.driver_id,
        name:this.book_name
      }
      this.$fetch('/admin/order/get-order', params).then(res => {
        this.$Spin.hide();
        if (res.code === 200) {
          this.data6 = []
          let data = res.data.ret
          this.orderList = data
          this.total = res.data.total  // 总页数      
          this.orderList.forEach((res, index) => {
            if (res.status == 2) {
              res.status_text = '待出行'
            }
            let orderData = {
              num: index + 1,
              orderType: res.type,
              status: res.status_text,
              payType: res.pay,
              orderNum: res.order_sn,
              line: res.from + '-' + res.to,
              name: res.name,
              userTel: res.phone,
              date: res.start_at.split(' ')[0],
              time: res.start_at.split(' ')[1],
              driverName: res.driver_name,
              carNum: res.car_no,
              user_name: res.user_name,
              userNum:res.adult_numbers+'人'
            }
            this.data6.push(orderData)
            // console.log(this.data6)
          })
        } else {
          this.$Message.warning('暂无数据')
        }
      }).catch(err => {
        this.$Spin.hide();
        // this.$Message.warning("服务器端异常")
    })
    },
    //日期获取
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate()<10 ? '0'+date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours()<10 ? '0'+date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds());
      return Y + M + D+h+m+s;
    },
    //获取线路
    getLine() {
      this.$fetch('/admin/index/select-route').then(res => {
        if (res.code == 200) {
          for (var item in res.data) {
            let line = {
              value: item + ':' + res.data[item],
              label: res.data[item],
            }
            this.lineList.push(line)
          }
        }else{
          this.$Message.error({
            content: res.error,
            duration: 2
          })
        }
      }).catch(err => {
        this.$Spin.hide();
        // this.$Message.warning("服务器端异常")
    })
    },
      //导出subMIn
      subExcel(){
        let params = {
          page: 1,
          page_size: 9999999,
          status: this.status,
          route_id:this.route_id,
          date: this.date,
          created_at: this.orderTime,
          order_sn: this.orderId,
          driver_id:this.driver_id,
          name:this.book_name
        }
        let baseURL = ""
        let host = window.location.host
        if (host == "localhost:8080" || host == "dev-admin.jd-gz.com") {
          baseURL = "http://dev.jd-gz.com/admin/order/get-order-excel"; 
        } else if (host == "admin.jd-gz.com") {
          baseURL = "http://api.jd-gz.com/admin/order/get-order-excel"; 
        } else {
          baseURL = "http://adminlocal/admin/order/get-order-excel";
        }
        axios.post(baseURL, {...params}, {
          responseType: 'blob'
        }).then(res => {
          const BLOB = res.data; // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
          const fileReader = new FileReader(); // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
          fileReader.readAsDataURL(BLOB); // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
          fileReader.onload = (event) => { // 处理load事件。该事件在读取操作完成时触发
            // 新建个下载的a标签，完成后移除。
            let a = document.createElement('a');
            a.download = `城际订单报表.xls`;
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

  //被创建时
  created: function () {
    this.$Spin.show();
    this.getOrderList()
    this.getLine()
  },

};