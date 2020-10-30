<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang='less'>
body {
  min-width: 1366px;
  overflow: visible;
  .home_container .layout-header-bar {
    position: sticky !important;
    top: 0;
    // .home_container .header-wapper {
    //   position: sticky;
    //   top: 0;
    // }
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;  
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  min-height: 100vh;
}
</style>
