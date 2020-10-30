<template>
  <div class="home_container">
    <div class="layout">
      <Layout>
        <Header class="layout-header-bar">
          <div class="header-wapper">
            <div class="header-left">
              <div class="header-left-avatar">
                <Avatar icon="ios-person" size="large"/>
                <span class="user-name">{{user.nickname}}</span>
              </div>
              <!-- <Icon type="md-menu" size="28"></Icon> -->
              <span class="header-title">极地运业后台管理系统</span>
            </div>
            <div class="header-right">
              <div type="text" icon="md-exit" class="btn-blue" size="large">
                <div class="editUser" @click="editPwdModel = true">
                  <Icon type="md-exit" class="exit_icon"/>修改密码
                </div>
                <div class="editUser" @click="quit">
                  <Icon type="md-power" class="exit_icon"/>退出系统
                </div>
              </div>
            </div>
          </div>
        </Header>
        <!-- 修改密码的弹窗 -->
        <Modal v-model="editPwdModel" title="修改密码" :mask-closable="false" :closable="false">
          <Form ref="formInline" :model="formInline">
            <FormItem prop="old_password" required label="旧密码">
              <Input type="password" v-model="formInline.old_password" placeholder="旧密码" />
            </FormItem>
            <FormItem prop="new_password" required label="新密码">
              <Input type="password" v-model="formInline.new_password" placeholder="新密码" />
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="editPwdOk">确定</Button>
          </div>
        </Modal>
        <Layout>
          <Sider hide-trigger :style="{background: '#fff'}">
            <div class="menuItem">
              <div
                class="itemGroup"
                v-for="(menuItem, index) in menuList"
                :class="menuItem.state ? 'act' : ''"
                :key="index"
              >
                <div class="item" @click="selMenu(menuItem, index)">
                  <div class="itemIcon">
                    <Icon :type="menuItem.icon" size="22" :class="menuItem.state?'activeIcon':''"></Icon>
                    <span>{{menuItem.name}}</span>
                  </div>
                  <Icon
                    type="ios-arrow-forward"
                    size="18"
                    v-if="menuItem.list.length >0&&!menuItem.state"
                    :class="menuItem.state?'activeIcon':''"
                  >></Icon>
                  <Icon
                    type="ios-arrow-down"
                    size="18"
                    v-if="menuItem.list.length >0&&menuItem.state"
                    :class="menuItem.state?'activeIcon':''"
                  ></Icon>
                </div>
                <div class="itemList">
                  <p
                    @click="linkTo(listItem, index, listIndex)"
                    :class="listItem.state ? 'active_submenu' : 'normal_submenu'"
                    v-for="(listItem, listIndex) in menuItem.list"
                    :key="listIndex"
                  >{{listItem.name}}</p>
                </div>
              </div>
            </div>
          </Sider>
          <!-- 面包屑 -->
          <!-- <Breadcrumb class="breadcrumb" separator=">">
             <BreadcrumbItem  class="breadcrumb_item"  v-for="(item,index) in listarr" :key="index" :to="item.path" >{{item.title}}
             </BreadcrumbItem>
          </Breadcrumb>-->
          <div class="right_content">
            <div class="bread_box">
              <span @click="toLink(item)" :style="{color:index === routeList.length - 1 ? '#18AFFF' : 'rgba(0,0,0,0.65)'}" v-for="(item, index) in routeList" :key="index" v-if="item.name !== 'home'">
                {{ item.meta.name}}
                <span v-if="index !== routeList.length - 1" style="padding:0 5px;"
            >/</span
          >
              </span>
            </div>
            <!-- 右边的区域内容 -->
            <Layout :style="{padding: '24px 24px 24px',width: '100%'}">
              <!-- <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}"> -->
              <Content :style="{padding: '24px',height: '100%', background: '#fff'}">
                <router-view/>
              </Content>
            </Layout>
          </div>
        </Layout>
      </Layout>
    </div>
  </div>
</template>
<script>
import home from "./home";
export default home;
</script>

<style lang="less" scoped>
@import "./home.less";
</style>
