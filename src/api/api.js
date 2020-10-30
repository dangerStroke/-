import axios from "axios";
import Router from "../router";
import qs from "qs";
let host = window.location.host
let loginText = ""
console.log(host)
if (host == "localhost:8080" || host == "dev-admin.jd-gz.com") {
  axios.defaults.baseURL = "http://dev.jd-gz.com"; 
  loginText = "测试服"
} else if (host == "admin.jd-gz.com") {
  axios.defaults.baseURL = "http://api.jd-gz.com"; 
  loginText = "正式服"
} else {
  loginText = "本地服"
  axios.defaults.baseURL = "http://adminlocal/";
}
localStorage.setItem("loginText",loginText)
console.log(host)
console.log(axios.defaults.baseURL)

// axios.defaults.withCredentials = true;

//http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers.authorization = localStorage.getItem("loginTK");
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
//http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.error === "请先登录") {
      localStorage.removeItem("loginTK");
      Router.push({ name: "login" });
      return false;
    } 
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  // var param = new URLSearchParams();
// param.append("vCode",vcode);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        headers: {
           "Content-Type": "application/x-www-form-urlencoded" ,
      }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}
// /**
//  * 封装post请求传递fromDate
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */
export function form(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(data), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
      .then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err);
        }
      );
  });
}

// /**
//  * 时间格式化
//  * @param date
//  * @param fmt
//  * @returns fmt
//  */
export function formatDate(date, fmt) {
  if (date == "Invalid Date") {
    return null;
  }
  let o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

