<template>
  <div class="main">
    <div class="topbar bg-black py-2 px-3 d-flex ai-center">
      <router-link tag="div" to="/" style="border: none"><img src="../assets/images/logo.png" height="35"></router-link>
      <div class="px-2 flex-1">
        <div class="text-white">王者荣耀</div>
        <div class="text-grey-1 fs-xxs">团队成就更多</div>
      </div>
<!--      <router-link tag="button" to="/login" class="btn" style="background-color: #db9e3f; border: none">登录</router-link>-->
    </div>
    <div class="pt-3 pb-2" style="background-color: #db9e3f">
      <div class="nav nav-inverse jc-around pb-1" style="cursor: pointer">
        <div class="nav-item">
          <router-link class="nav-link" to="/" tag="div">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/content" tag="div">攻略中心</router-link>
        </div>
        <div class="nav-item">
          <router-link class="nav-link" to="/game" tag="div">赛事中心</router-link>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>

</template>


<style lang="scss">
  .main{
    min-width: 320px;
    max-width: 640px;
    .topbar{
      position:sticky;
      top: 0;
      z-index: 999;
    }
      .router-link-exact-active{
          border-bottom:3px solid white;
      }
  }

</style>