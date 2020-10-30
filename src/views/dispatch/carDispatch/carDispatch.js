import axios from "axios";
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
export default{
    data(){
        return {
            stime:'',//搜索框开始时间
            etime:'',//搜索框结束时间
            carList:[],//车型选择
            columns: [
                {
                  title: '操作',
                  slot: 'action',
                  align: "center",
                  width: 250
                },
                {
                  title: '业务类型',
                  key: 'order_type',
                  width: 120
                },
                {
                  title: '订单状态',
                  slot: 'status',
                  width: 120,
                },
                {
                  title: '关联订单号',
                  key: 'order_sn',
                  width: 180
                },
                {
                  title: '下单时间',
                  key: 'created_at',
                  width: 180
                },
                {
                  title: '订单金额',
                  slot: 'orderPrice',
                  width: 160
                },
                {
                  title:'定金',
                  key:'deposit',
                  width:160
                },
                {
                  title: '定金付款日期',
                  key: 'deposit_time',
                  width: 160
                },
                {
                  title: '尾款',
                  key: 'remaining',
                  width: 160
                },
                {
                  title: '尾款付款日期',
                  key: 'remaining_time',
                  width: 180
                },
                {
                    title: '实际付款',
                    slot: 'orderPrice',
                    width: 100
                },
                {
                    title: '司机',
                    key: 'driverName',
                    width: 220
                },
                {
                    title: '出发日',
                    key: 'stime',
                    width: 180
                },
                {
                    title: '到达日',
                    key: 'etime',
                    width: 180
                },
                {
                    title: '行程天数',
                    key: 'timeNum',
                    width: 180
                },
                {
                    title: '出发地',
                    key: 'slocation',
                    width: 180
                },
                {
                    title: '目的地',
                    key: 'elocation',
                    width: 180
                },
                {
                    title: '出发公里数',
                    key: 'sdistance',
                    width: 180
                },
                {
                    title: '到达公里数',
                    key: 'edistance',
                    width: 180
                },
                {
                    title: '乘客数',
                    key: 'passenger_nums',
                    width: 180
                },
                {
                    title: '乘身份证',
                    key: 'id_card_num',
                    width: 180
                },
                {
                    title: '乘客电话',
                    key: 'phone',
                    width: 180
                },
              ],
              listData:[],//表格数据
              page:1,//页码
              pagesize:10,//单页条数
              total:0,//总条数
              showDetail:false,//详情模态框
              showCar:false,//车辆分配模态框
              column2:[
                {
                    title: '车牌号',
                    key: 'plate_no',
                    align: "center",
                    width: 110
                },
                {
                  title: '车辆品牌',
                  slot: 'brand',
                  align: "center",
                  width: 125
                },
                {
                  title: '车辆型号',
                  key: 'car_model',
                  align: "center",
                  width: 125
                },
                {
                  title: '车辆状态',
                  key: 'free_type',
                  align: "center",
                  width: 125
                },
                {
                  title: '空闲情况',
                  key: 'free_time',
                  align: "center",
                  width: 160
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: "center",
                    width: 100
                },
              ],//车辆分配模态框列表
              carData:[],//车辆分配数据
              orderDetail:'',//订单详情
              driverName:'',//司机姓名
              driverList:[],//司机列表
              orderStatus:'',//订单状态
              statusList:[
                {
                    value: 1,
                    label: '未支付'
                },
                {
                    value: 2,
                    label: '待出行'
                },
                {
                    value: 3,
                    label: '取消'
                },
                {
                    value: 4,
                    label: '支付失败'
                },
                {
                    value: 5,
                    label: '已完成'
                },
                {
                    value: 6,
                    label: '已评价'
                },
                {
                    value: 7,
                    label: '已退款'
                },
                {
                    value: 8,
                    label: '退款中'
                },
                {
                    value: 9,
                    label: '进行中'
                },
                {
                    value: 10,
                    label: '待审核'
                },
                {
                  value:12,
                  label:'全款支付'
                }
              ],//订单状列表
              formLeft:{},//表单
              car_id:'',//车辆ID
              stime:'',//搜索框开始时间
              etime:'',//搜索框结束时间
              brandList:"",//车型列表
              carName:'选择车辆',//车型名称
              showModal:false,//撤销弹框
              order_id:'',//订单id
              plate_no:'',//车牌号
              isAdd:'',
              config: {
                firstDay: "0", //以周日为每周的第天
                // weekends; true,// 是否在日历中显示周未
                locale: "zh-cn", //语言
                defaultView: "month", //默认按月显示
                height: "auto", //高度
                fixedweekCount: false, //足否固定显示六周
                // weekMode: "Liquid",//周数不定，每周的高度可变， 整个日历高度不变
                allDaySlot: false,
                // allDay:true,
                header: {
                  //表头信息
                  left: " prev, next, today",
                  center: "title",
                  right: "custom"
                }
              },
              events: [
                {
                  id: 1,
                  title: "川404000",
                  start: " 2020-10-25",
                  end:'2020-10-30'
                },
              ]
            }    
    },
    components : { FullCalendar },
    methods:{
       //车辆订单
       getListOrder(){
        let {plate_no} = this
        let sday = new Date(new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
        let stime = sday.getFullYear() + '-'+(sday.getMonth() + 1 < 10 ? '0' + (sday.getMonth() + 1) : sday.getMonth() + 1) + '-'+sday.getDate();
        let eday = new Date(new Date().setTime(new Date((new Date().getMonth+1<=12 ? new Date().getFullYear() : new Date().getFullYear()+1), (new Date().getMonth()+1 <= 12 ? new Date().getMonth()+1 : 1), 1))-24*60*60*1000)
        let etime = eday.getFullYear() + '-'+(eday.getMonth() + 1 < 10 ? '0' + (eday.getMonth() + 1) : eday.getMonth() + 1) + '-'+eday.getDate();
        let params = {stime,etime,plate_no,page_size:999999}
        this.$fetch('/admin/car-manage/list-order',{...params}).then(res =>{
            if(res.code == 200){
                let events = []
                res.data.data.map(item => {
                  let date = new Date(new Date(item.etime.slice(0,10).replace(/-/g, "/")).getTime()+24*60*60*1000)
                  item.etime = date.getFullYear() + '-'+(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'+date.getDate() + ' ';
                    events.push({
                        id:item.car_id,
                        title:item.plate_no,
                        start: item.stime.slice(0,10),
                        end:item.etime,
                    })
                })
                this.events = events
            }
        })
    },
       getDays(strDateStart,strDateEnd){
            var strSeparator = "-"; //日期分隔符
            var oDate1;
            var oDate2;
            var iDays;
            oDate1= strDateStart.split(strSeparator);
            oDate2= strDateEnd.split(strSeparator);
            var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
            var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
           return iDays+1 ;
        },
        //点击页码
        changePage(e) {
            this.page = e;
            this.getcarInfo()
        },
        //车辆列表
        getCarList(){
          this.$fetch('/admin/index/select-car').then(res =>{
            if(res.code == 200 && res.data){
              this.carName = res.data[this.car_id]
              for(let i in res.data){
                  this.carList.push({
                         value: i,
                         label: res.data[i]
                     })
              }
            }else{
              this.$Message.warning(res.error)
              }
         })
        },
        //修改订单
        chengeOrder(data){
          console.log(data)
          this.formLeft = data
          this.showDetail = true
          this.isAdd = false
        },
        //取消按钮
        cancel(){
          this.formLeft = {}
          this.showDetail = false
      },
        //获取车辆订单详情
        getcarInfo(){
          let {car_id, plate_no, stime, etime,page,pagesize} = this
          let param = {car_id, plate_no, stime, etime,page,pagesize}
          this.$fetch('/admin/car-manage/list-order',param).then(res => {
           if(res.code == 200 && res.data){
             this.total = res.data.total
             res.data.data.map(item => {
                item.deposit_time = (item.deposit_time ? item.deposit_time.slice(0,10) : item.deposit_time)
                item.etime = (item.etime ? item.etime.slice(0,10) : item.etime)
                item.remaining_time = (item.remaining_time ? item.remaining_time.slice(0,10) : item.remaining_time)
                item.stime = (item.stime ? item.stime.slice(0,10) : item.stime)
                item.created_at = (item.created_at ? item.created_at.slice(0,10) : item.created_at)
                item['timeNum'] = this.getDays(item.stime,item.etime)
                console.log(this.driverList)
                console.log(this.driverList[6])
                console.log(Number(item.driver_id))
                item['driverName'] = (item.driver_id ? this.driverList[Number(item.driver_id)-1].label : '')
                switch(item.order_status){
                  case '1':
                  item['statusName'] = '待支付'
                  break;
                  case '2':
                  item['statusName'] = '待出行'
                  break;
                  case '3':
                  item['statusName'] = '已取消'
                  break;
                  case '4':
                  item['statusName'] = '支付失败'
                  break;
                  case '5':
                  item['statusName'] = '已完成'
                  break;
                  case '6':
                  item['statusName'] = '已评价'
                  break;
                  case '7':
                  item['statusName'] = '已退款'
                  break;
                  case '8':
                  item['statusName'] = '退款中'
                  break;
                  case '9':
                  item['statusName'] = '进行中'
                  break;
                  case '10':
                  item['statusName'] = '待审核'
                  break;
                  case '12':
                  item['statusName'] = '全款支付'
                  break;
                }
                // item.created_at = item.created_at.slice(0,10)
             })
             this.listData = res.data.data
             this.getListOrder()
           }
          })
        }, 
        //获取车型
        getcarBrand(){
            this.$fetch('/admin/index/select-car-brand').then(res => {
               if(res.code == 200 && res.data){
                   this.brandList = res.data
               }else{
                this.$Message.warning(res.error)
                }
            })
        },
        //获取司机列表
        getDriver(){
          this.$fetch('/admin/index/select-driver').then(res =>{
             if(res.code == 200 && res.data){
               for(let i in res.data){
                   this.driverList.push({
                          value: i,
                          label: res.data[i]
                      })
                    
               }
             }else{
              this.$Message.warning(res.error)
              }
          })
      },
        //时间选择 
        timeChange(data,event){
          switch(data){
              case 'stime':
                  this.stime = event
                  break;
              case 'etime':
                  this.etime = event  
                  break  
              case 'formLeft.deposit_time':
                  this.formLeft.deposit_time = event
                  break;
              case 'formLeft.remaining_time':
                  this.formLeft.remaining_time =  event
                  break;
              case 'formLeft.stime':
                  this.formLeft.stime = event
                  break;
              case 'formLeft.etime':
                  this.formLeft.etime = event
                  break;
              case 'formLeft.order_status':
                  this.formLeft.order_status = event
                  break;                  
          }
      },
      //修改订单确认
      distributionOrder(){
        let url = ''
        if(this.isAdd){
          url='/admin/car-manage/add-order'
        }else{
          url = '/admin/car-manage/edit-order'
        }
        let { order_status, stime, etime, slocation, elocation, passenger_nums, id_card_num, phone} = this.formLeft
        this.formLeft.edistance = (this.formLeft.edistance ? this.formLeft.edistance : 0)
        this.formLeft.sdistance = (this.formLeft.sdistance ? this.formLeft.sdistance : 0)
        if(order_status&&stime&&etime&&slocation&&elocation&&passenger_nums){
            console.log(this.formLeft)
            this.$post(url,this.formLeft).then(res =>{
                if(res.code == 200&&res.data){
                   if(this.isAdd){
                    this.$Message.warning('分配订单成功')
                   }else{
                    this.$Message.warning('修改订单成功')
                   }
                    this.cancel()
                    this.getcarInfo()
                    this.getListOrder()
                }else{
                  this.$Message.warning(res.error)
                }
            })
        }else if(!order_status){
            this.$Message.warning("请选择订单状态")
        }else if(!stime){
            this.$Message.warning("请选择出发时间")
        }else if(!etime){
            this.$Message.warning('请选择到达时间')
        }else if(!slocation){
            this.$Message.warning('请选择出发地')
        }else if(!elocation){
            this.$Message.warning('请选择目的地')
        }else if(!passenger_nums){
            this.$Message.warning('请填写乘客数量')
        }
    },
      //清除搜索框
      eliminate(){
        this.getTime()
        this.plate_no = ''
        this.car_id = ''
        this.carName = '请选择车辆'
        this.getcarInfo()
      },
      //撤销订单
      cancelOrder(data){
        this.showModal = true
        this.order_id = data.id
      },
      //撤销弹窗取消
      modalChange(){
        this.order_id = ''
        this.showModal = false
      },
      //撤销确定
      bindConfirm(){
        this.$post('/admin/car-manage/del-order',{id:this.order_id}).then(res => {
          this.showModal = false
          if(res.code == 200 && res.data){
           this.$Message.warning("撤销成功")
           this.getcarInfo()
          }else{
            this.$Message.warning(res.error)
          }
        })
      },
      //分配订单
      modifyOrder(){
        this.isAdd = true
        let { plate_no,stime,etime } = this
        let param = { plate_no,stime,etime }
        this.$fetch('/admin/car-manage/list-car',param).then(res => {
          if(res.code == 200 && res.data){
            res.data.data.map(item => {
              item.free_time = item.free_time.join('')
            })
            this.showCar = true
            this.carData = res.data.data
          }else{
            this.$Message.warning(res.error)
            }
        })
      },
      //搜索车牌号选择
      platenoChange(event){
        this.plate_no = event.label
      },
      //获取日期
      getTime(){
        let stemplate = new Date(new Date(new Date().toLocaleDateString()).getTime()).toLocaleDateString().replace(/\//g, "-")
        let etemplate = new Date(new Date(new Date().toLocaleDateString()).getTime()+10*24*60*60*1000).toLocaleDateString().replace(/\//g, "-")
        let stime = ''
        let etime = ''
        stemplate.split('-').map(res => {
            res = (Number(res)<10 ? '0'+res : res)
            stime += '-'+res
        })
        etemplate.split('-').map(res => {
            res = (Number(res)<10 ? '0'+res : res)
            etime += '-'+res
        })
        this.stime = stime.slice(1)
        this.etime = etime.slice(1)
    },
      //选择车辆
      chooseCar(data){
        console.log(data)
        this.showDetail = true
        this.orderDetail =data
        this.formLeft.car_id = data.id
      },
        //导出subMIn
        subExcel(){ 
          let {stime,etime,plate_no,page} = this
          let params = {stime,etime,plate_no,page,pagesize:999999}
          let host = window.location.host
          let baseURL = ""
          if (host == "localhost:8080" || host == "dev-admin.jd-gz.com") {
            baseURL = "http://dev.jd-gz.com/admin/car-manage/list-order-excel"; 
          } else if (host == "admin.jd-gz.com") {
            baseURL = "http://api.jd-gz.com/admin/car-manage/list-order-excel"; 
          } else {
            baseURL = "http://adminlocal/admin/car-manage/list-order-excel";
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
              a.download = `车辆订单报表.xls`;
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
    created(){
      console.log(this.$route)
      this.car_id = Number(this.$route.query.id)
      this.etime = this.$route.query.etime
      this.stime = this.$route.query.stime
      this.plate_no = this.$route.query.plate_no
      this.getcarBrand()
      this.getDriver()
      this.getCarList()
    },
    mounted(){
      this.getcarInfo()
    }
}