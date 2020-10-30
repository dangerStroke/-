// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import axios from 'axios'
import { post, fetch, formatDate,form} from "./api/api";
import {uploadImg} from './api/uploadImg'  //上传图片
import echarts from 'echarts'
import FullCalendar from 'vue-full-calendar'
import '../static/UEditor/ueditor.config'
import '../static/UEditor/ueditor.all.js'
import '../static/UEditor/lang/zh-cn/zh-cn.js'
import '../static/UEditor/ueditor.parse.min.js'
import '../static/UEditor/third-party/jquery-1.10.2'
import 'fullcalendar/dist/fullcalendar.css'
Vue.prototype.$echarts = echarts
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$formatDate = formatDate
Vue.prototype.$form = form
Vue.prototype.$uploadImg = uploadImg

Vue.config.productionTip = false
Vue.use(ViewUI, axios)
Vue.use(FullCalendar)
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
