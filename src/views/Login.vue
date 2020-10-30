<template>
  <div class="content">
    <!-- 背景图 -->
    <div class="bg_img">
      <img src="../assets/login_bg.jpg" alt />
    </div>
    <!-- 表单 -->
    <div class="formData">
      <div class="form_tit">极地运业后台管理系统</div>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit(formInline)">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import api from "../api/api";
// import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { type: "string", min: 1, message: "", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { type: "string", min: 1, message: "", trigger: "blur" }
        ]
      },
      administratorRole: "" //管理员角色  0为超级管理员 1为系统管理员  2为城际管理员  3为紧急救援人员  4为调度管理员
    };
  },
  methods: {
    handleSubmit(prop) {
      console.log(prop.user, prop.password);
      let user = prop.user;
      let password = prop.password;
      //  console.log(user,password)
      let data = {
        name: user,
        password: password
      };
      //请求登录接口
      this.$form("/admin/index/login", data).then(res => {
        console.log(res.data);
        if (res.code == 200) {
          if (res.data.role == "超级管理员") {
            this.administratorRole = 0;
          } else if (res.data.role == "系统管理员") {
            this.administratorRole = 1;
          } else if (res.data.role == "城际管理员") {
            this.administratorRole = 2;
          } else if (res.data.role == "紧急救援人员") {
            this.administratorRole = 3;
          } else if (res.data.role == "调度管理员") {
            this.administratorRole = 4;
          }
        } else {
          //登录失败
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100vh;
  position: relative;
  .bg_img {
    background-color: #fafafa;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }

  // 表单
  .formData {
    width: 400px;
    height: 285px;
    // border: 1px solid #999;
    position: absolute;
    left: 60%;
    top: 35%;
    background: url("../assets/form_bg.png");
    background-size: 400px 285px;
    .form_tit {
      font-size: 24px;
      color: #fff;
      padding-top: 15px;
    }
    form {
      width: 100%;
      height: 100%;
      .ivu-form-item {
        width: 70%;
        margin-top: 15px;
        .ivu-form-item-content {
          .ivu-input-wrapper {
            .ivu-input-group-prepend {
              font-size: 21px !important;
            }
          }
        }
      }
    }
  }
}
</style>