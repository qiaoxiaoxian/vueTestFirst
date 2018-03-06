<template>
  <div class="appContent-box" id="appContent">
    <div class="appContent-header">
      <div class="appHeader-my " v-on:click="showLeftList()"><h6 class="icon-user"></h6></div>
      <ul class="appHeader-tap">
        <router-link to="/peopleCar" tag="li" active-class="current">人找车</router-link>
        <router-link to="/carPeople" tag="li" active-class="current">车找人</router-link>
        <router-link to="/product/pao" tag="li" active-class="current">找跑腿</router-link>
        <router-link to="/product/xiao" tag="li" active-class="current">发小件</router-link>
        <!--<li v-bind:class="{current:index==currentItem}" v-on:click="addCurrent(index)" v-for="(item,index) in tapNav" >{{item.name}}</li>-->
      </ul>
    </div>
    <div class="appContent-list">
      <transition name="appListBck">
        <div v-show="show" v-on:click="showLeftList($event)" class="appListBck"></div>
      </transition>
      <transition name="appList">
        <div v-show="show"  class="appList-box">
          <div v-on:click="showLeftList()" class="appListTop">
            <em class="icon-user"></em>
            <span>15093162164</span>
          </div>
          <div class="appList-center">
            <dl>
              <dd v-for="(item,index) in listNav"><em v-bind:class="item.icon"></em><span>{{item.name}}</span></dd>
            </dl>
          </div>
          <div class="appList-bottom">
            <em class="icon-exit"></em><span>退出</span>
          </div>
        </div>
      </transition>
    </div>
    <div class="appContent-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
//export default {
//  name: 'app'
//}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
