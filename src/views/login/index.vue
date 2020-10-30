<template>
  <div class="content">
    <!-- 背景图 -->
    <div class="bg_img">
      <img src="https://static2.jd-gz.com/login_bg1.jpg" alt />
    </div>
    <!-- 表单 -->
    <div class="formData">
      <div class="form_tit">极地运业后台管理系统({{loginText}})</div>
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
import login from "./login"
export default login
</script>
<style lang="less" scoped>
@import url("./login.less");
</style>