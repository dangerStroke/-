import axios from "axios";
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
export default{
    data(){
        return {
            stime:'',//搜索框开始时间
            etime:'',//搜索框结束时间
            plate_no:'',//搜索车牌号
            columns: [
                {
                    type: "index",
                    title: "序号",
                    align: "center"
                },
                {
                    title: '车牌号',
                    key: 'plate_no',
                    align: "center",
                },
                {
                    title: '车辆品牌',
                    slot: 'brand',
                    align: "center",
                },
                {
                    title: '车辆型号',
                    key: 'car_model',
                    align: "center",
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
                    width: 200
                },
                {
                    title: '车型描述',
                    key: 'car_text',
                    align: "center",
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: "center",
                    width:300
                },
              ],
              listData:[],//表格数据
              page:1,//页码
              pagesize:10,//单页条数
              total:0,//总条数
              showDetail:false,//详情模态框
              carDetail:'',//订单详情
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
                    label: '已取消'
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
              brandList:"",//车型列表
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
              events: []
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
                    let event = []
                    res.data.data.map((item,index) => {
                        console.log(item)
                        let date = new Date(new Date(item.etime.slice(0,10).replace(/-/g, "/")).getTime()+24*60*60*1000)
                        item.etime = date.getFullYear() + '-'+(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'+date.getDate();
                        let backgroundColor = ''
                        events.push({
                            id:item.id,
                            title:item.plate_no,
                            start: item.stime.slice(0,10),
                            end:item.etime,
                            backgroundColor:backgroundColor,
                            borderColor:backgroundColor,
                            car_id:item.car_id
                        })
                    })
                    events[0].backgroundColor = 'red'
                    events[0].borderColor = 'red'
                    for(let i = 0;i<events.length;i++){
                        for(let j = i+1;j<events.length;j++){
                            if(events[i].car_id == events[j].car_id){
                                events[j].backgroundColor = events[i].backgroundColor
                                events[j].borderColor =  events[i].borderColor
                            }else{
                               if(events[j].backgroundColor == ''){
                                var r=Math.floor(Math.random()*255);
                                var g=Math.floor(Math.random()*255);
                                var b=Math.floor(Math.random()*255);
                                events[j].backgroundColor = "rgb("+r+','+g+','+b+")"
                                events[j].borderColor = "rgb("+r+','+g+','+b+")"
                               }
                            }
                        }
                    }
                    this.events = events
                    
                }
            })
        },
        //日历点击
        eventClick(e){
            console.log(e)
        },
        //日期点击
        dayClick(e){
            console.log(e)
        },
        //点击页码
        changePage(e) {
            this.page = e;
            this.getcarList()
        },
        //清除
        eliminate(){
            console.log(123)
            this.plate_no = ''
            this.getTime()
            this.getcarList()
        },
        //分配订单
        modifyOrder(data){
          this.carDetail = data
          this.formLeft.car_id = data.id
          this.showDetail = true
        },
        //订单详情
        detailOrder(data){
            console.log(data)
            this.$router.push({
                name:'carDispatch',
                query:{
                    id:data.id,
                    stime:this.stime,
                    etime:this.etime,
                    plate_no:data.plate_no
                }
            })
        },
        //选择框
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
        //车辆列表
        getcarList(){
            let {stime,etime,plate_no,page,pagesize} = this
            let param = {stime,etime,plate_no,page,pagesize}
            this.$fetch('/admin/car-manage/list-car',param).then(res => {
                if(res.code == 200 && res.data){
                    this.total = res.data.total
                    res.data.data.map(item => {
                        item['car_text'] = item.color+'色'
                        item.free_time = item.free_time.join('')
                    })
                    this.listData = res.data.data
                    this.getListOrder()
                }else{
                    this.$Message.warning(res.error)
                }
            })
        },
        //获取车型
        getcarBrand(){
            this.$fetch('/admin/index/select-car-brand').then(res => {
               if(res.code == 200 && res.data){
                   this.brandList = res.data
               }
            })
        },  
        //分配订单确认
        distributionOrder(){
            let { order_status, stime, etime, slocation, elocation, passenger_nums, id_card_num, phone} = this.formLeft
            this.formLeft.edistance = (this.formLeft.edistance ? this.formLeft.edistance : 0)
            this.formLeft.sdistance = (this.formLeft.sdistance ? this.formLeft.sdistance : 0)
            if(order_status&&stime&&etime&&slocation&&elocation&&passenger_nums){
                let param = this.formLeft
                this.$post('/admin/car-manage/add-order',param).then(res =>{
                    if(res.code == 200&&res.data){
                        this.$Message.warning('分配订单成功')
                        this.getcarList()
                        this.cancel()
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
        //取消按钮
        cancel(){
            this.formLeft = {}
            this.showDetail = false
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
            //导出subMIn
    subExcel(){
        let {stime,etime,plate_no,page} = this
        let params = {stime,etime,plate_no,page,pagesize:999999}
        let host = window.location.host
        let baseURL = ""
        if (host == "localhost:8080" || host == "dev-admin.jd-gz.com") {
          baseURL = "http://dev.jd-gz.com/admin/car-manage/list-car-excel"; 
        } else if (host == "admin.jd-gz.com") {
          baseURL = "http://api.jd-gz.com/admin/car-manage/list-car-excel"; 
        } else {
          baseURL = "http://adminlocal/admin/car-manage/list-car-excel";
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
    created(){
        this.getTime()
        this.getcarBrand()
        this.getDriver()
    },
    mounted(){
        this.getcarList()
    },
    
}