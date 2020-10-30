<template>
  <div class="content">
    <div class="bg_img">
      <img src="https://static2.jd-gz.com/404.png" alt />
    </div>
    <div class="info">
      <div>抱歉，你访问的页面不存在</div>
      <div>
        <Button type="primary" @click="goBack">返回上一页</Button>
      </div>
    </div>
  </div>
</template>

<script>
// import notFound from "./notFound";
// export default notFound;
export default {
  data() {
    return {};
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    }
  
  }
};
</script>
<style lang="less" scoped>
@import url("./notFound.less");
</style>