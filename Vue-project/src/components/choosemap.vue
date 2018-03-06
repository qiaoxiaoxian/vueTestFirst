<template>
  <div>
    <div class="appContent-mapHead">
      <input type="text" placeholder="你在哪儿上车" v-model="address">
      <button type="button" v-on:click="showMapBox">确定</button>
    </div>
    <div class="mapBox">
      <div id="allmap"></div>
    </div>
  </div>
</template>
<style>
  .mapBox {
    width: 100vw;
    height: 100vh;
  }

  #allmap {
    width: 100%;
    height: 100%;
    margin: 0;
  }
</style>
<script>
  //  import BMap from 'BMap'
  import {MP} from '../js/map'
  export default {
    props: ['position'],
    data: function () {
      return {
        address: this.position,
        coords: {
          longitude: 0,
          latitude: 0
        },
        firstStatus: 1
      }
    },
    methods: {
      showMapBox: function () {
        this.$emit('currentInp')
      },
      con: function () {
        this.$store.commit('showUserName')
      }
    },
    watch: {
      address: function () {
        var inpNum = this.$store.state.pageName
        if (this.firstStatus === 1) {
          for (var i = 1; i < 7; i += 2) {
            this.$store.commit('setPosition' + i, this.address)
            this.$store.commit('setCoords' + i, this.coords)
          }
        } else {
          this.$store.commit('setPosition' + inpNum, this.address)
          this.$store.commit('setCoords' + inpNum, this.coords)
        }
      }
    },
    mounted: function () {
      var that = this;

      this.$nextTick(function () {
        MP('O1bvQ9wk5VG7WVerj9UYte6HcfWtOcWy').then(BMap => {
          // 创建百度地图对象
          var map = new BMap.Map('allmap')
          // 初始化点
          var point = new BMap.Point(116.331398, 39.897445)
          // 中心点
          map.centerAndZoom(point, 16)
          map.enableScrollWheelZoom()
          map.enableContinuousZoom()
          map.panBy(305, 165)
          var geolocation = new BMap.Geolocation()
          var geoc = new BMap.Geocoder()

          // 定义一个控件类
          function ZoomControl () {
            this.defaultOffset = new BMap.Size(10, 10)
          }

          // 通过JavaScript的prototype属性继承于BMap.Control
          ZoomControl.prototype = new BMap.Control()

          // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
          // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
          ZoomControl.prototype.initialize = function (map) {
            // 创建一个DOM元素
            var div = document.createElement('div')
            // 设置样式
            div.style.cssText = ';width:30px;height:30px;border-radius:50%;border:1px solid #ebebeb;background-color:white;text-align:center;line-height:30px;font-size:20px;color:#e04f56;margin:20px 10px 0;box-shadow:0 1px 2px 0px rgba(0,0,0,.2);'
            div.setAttribute('class', 'icon-location')
            // 绑定事件
            div.onclick = function (e) {
              geolocation.getCurrentPosition(function (r) {
                geoc.getLocation(r.point, function (rs) {
                  map.centerAndZoom(r.point, 16)
                  map.clearOverlays()
                  var mk = new BMap.Marker(r.point)
                  map.addOverlay(mk)
                  map.panTo(r.point)
                  var titleBox = rs.surroundingPois[0].title ? rs.surroundingPois[0].title : ''
                  that.address = rs.address + titleBox
                  that.coords = rs.point
                })
              })
            }
            // 添加DOM元素到地图中
            map.getContainer().appendChild(div)
            // 将DOM元素返回
            return div
          }
          // 创建控件
          var myZoomCtrl = new ZoomControl()
          // 添加到地图当中
          map.addControl(myZoomCtrl)
          // 地图加载
          geolocation.getCurrentPosition(function (r) {
            function locationGet (position) {
              geoc.getLocation(position, function (rs) {
                var titleBox = rs.surroundingPois.length ? rs.surroundingPois[0].title : ''
                that.address = rs.addressComponents.province + rs.addressComponents.city + rs.addressComponents.district + rs.addressComponents.street + titleBox
                that.coords = rs.point
                map.clearOverlays()
                var clickMk = new BMap.Marker(position)
                map.addOverlay(clickMk)
              })
            }
            if (this.getStatus() === 0) {
              var mk = new BMap.Marker(r.point)
              map.addOverlay(mk)
              map.panTo(r.point)
              locationGet(r.point)
              var clickPosition = r.point
              map.addEventListener('click', function (e) {
                that.firstStatus = 2
                locationGet(e.point)
                map.panTo(e.point)
                clickPosition = e.point
              })
              map.addEventListener('resize', function (e) {
                map.clearOverlays()
                var clickMk = new BMap.Marker(clickPosition)
                map.addOverlay(clickMk)
                map.centerAndZoom(clickPosition, 16)
              })
            } else {
              alert('failed' + this.getStatus())
            }
          }, {enableHighAccuracy: true})
        })
      })
    }
  }
</script>
