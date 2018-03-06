<template>
  <div>
    <div class="peopleCarBox">
      <!--<tel-content v-bind:message.sync="tel"></tel-content>-->
      <div class="peopleCar-time">
        <em class="icon-alarm"></em>
        <input type="datetime-local" v-model="timesNow" v-bind:value="setDate" v-on:click="setTime">
      </div>
      <div class="peopleCar-start">
        <input type="text" placeholder="你在哪出发" v-on:click="postData(3)" v-bind:value="setStartPosition"
               readonly="readonly">
      </div>
      <div class="peopleCar-end">
        <input type="text" placeholder="你要去哪儿" v-on:click="postData(4)" v-bind:value="setEndPosition"
               readonly="readonly">
      </div>
      <div class="peopleCar-more">
        <div class="peopleCar-to">是否接送</div>
        <btn-box v-bind:isChoose.sync="choose"></btn-box>
      </div>
      <div class="peopleCar-btn">
        <button type="button" v-on:click="showPriceBox">车找人</button>
      </div>
    </div>
    <transition name="priceBox">
      <div class="peopleCar-price" v-show="priceBox" v-on:click.self="showPrice">
        <transition name="price">
          <div class="peopleCar-priceBox" v-show="priceBox">
            <div class="peopleCar-priceTotal">
              <h6>价格预算</h6>
              <ul>
                <li><em>距离</em><span>{{priceTotal.priceDistance}}</span></li>
                <li><em>行程</em><span>{{priceTotal.priceTime}}</span></li>
                <li><em>参考金额</em><span>{{priceTotal.price}}</span></li>
              </ul>
            </div>
            <div class="peopleCar-priceInp">
              <div class="peopleCar-people">
                <span>座位数量：</span>
                <input type="number" placeholder="请输入座位数量" v-model="peopleNum">
              </div>
              <div class="peopleCar-people">
                <span>服务金额：</span>
                <input type="number" placeholder="请输入服务金额(元)" v-model="serverPrice">
              </div>
              <div class="peopleCar-people" v-if="choose">
                <span>接送金额：</span>
                <input type="number" placeholder="请输入接送金额(元)" v-model="shuttle">
              </div>
            </div>
            <div class="peopleCar-priceBtn">
              <button type="button">确定</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <div id="carPeopleMAP" v-show="false"></div>
  </div>
</template>
<script>
  import BMap from 'BMap'
  // 电话模板
  var tel = {
    props: ['message'],
    template: '<div class="peopleCar-tel"><em class="icon-phone"></em><input type="number" v-bind:class="{\'border-danger\':borderDanger}" v-model="tel" v-focus placeholder="联系电话" v-on:input="changeInp"><div class="clearInp" v-on:click="clearInp"><span>&times;</span></div></div>',
    data: function () {
      return {
        tel: this.message,
        borderDanger: false
      }
    },
    methods: {
      clearInp: function () {
        this.tel = ''
        this.borderDanger = true
        this.$emit('update:message', this.tel)
      },
      changeInp: function () {
        if (this.tel.length === 11) {
          this.borderDanger = false
          this.$emit('update:message', this.tel)
        } else {
          this.borderDanger = true
          this.$emit('update:message', '')
        }
      }
    },
    directives: {
      focus: {
        update: function (el) {
          el.focus()
        }
      }
    }
  }
  // 按钮模板
  var btnBox = {
    props: ['isChoose'],
    template: '<transition name="btn"><div class="btnBox" v-bind:class="{current:isCurrent}" v-on:click="changeChoose"></div></transition>',
    data: function () {
      return {
        isCurrent: this.isChoose
      }
    },
    methods: {
      changeChoose: function () {
        this.isCurrent = !this.isCurrent
        this.$emit('update:isChoose', this.isCurrent)
      }
    }
  }

  export default {
    name: 'peopleCar',
    data: function () {
      return {
        tel: '15093162164',
        focusStart: false,
        timesNow: '',
        choose: false,
        priceBox: false,
        username: 'dddd',
        priceTotal: {
          priceDistance: 0,
          priceTime: 0,
          price: 0
        },
        // 服务金额
        serverPrice: 0,
        // 人数
        peopleNum: 3,
        // 接送费用
        shuttle: 0,
        // 位置信息
        coordsNum: {},
        // 起始位置信息
        startPosition: '',
        // 起始位置坐标
        startCoords: '',
        // 终点位置信息
        endPosition: '',
        // 终点位置坐标
        endCoords: ''
      }
    },
    methods: {
      setTime: function () {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        let h = date.getHours()
        h = h < 10 ? '0' + h : h
        let m = date.getMinutes()
        m = m < 10 ? '0' + m : m
        this.timesNow = year + '-' + month + '-' + d + 'T' + h + ':' + m
      },
      con: function () {
        console.log(this.coordsNum)
      },
      postData: function (inpNum) {
        this.$store.commit('setPageName', inpNum)
        this.$emit('currentInp')
      },
      showPriceBox: function () {
        if (this.startPosition !== '' && this.endPosition !== '' && this.tel !== '') {
          this.priceBox = !this.priceBox
        }
      },
      showPrice: function () {
        this.priceBox = !this.priceBox
      },
      getLongitude: function () {
        var that = this
        if (this.startCoords !== '' && this.endCoords !== '') {
          var map2 = new BMap.Map('carPeopleMAP')
          var options = {
            onSearchComplete: function (results) {
              if (driving.getStatus() === 0) {
                // 获取第一条方案
                let plan = results.getPlan(0)
                that.priceTotal.priceDistance = plan.getDistance(true)
                that.priceTotal.priceTime = plan.getDuration(true)
                let long = plan.getDistance(false)
                if (long < 10000) {
                  that.priceTotal.price = 4 + '元'
                  that.serverPrice = 4
                } else if (long >= 10000 && long <= 30000) {
                  let price = Math.round((long / 1000) * 0.4 * 100) / 100
                  that.priceTotal.price = price + '元'
                  that.serverPrice = price
                } else if (long > 30000) {
                  let price = Math.round((long / 1000) * 0.3 * 100) / 100
                  that.priceTotal.price = price + '元'
                  that.serverPrice = price
                }
              }
            }
          }
          var driving = new BMap.DrivingRoute(map2, options)
          driving.search(that.startCoords, that.endCoords)
        }
      }
    },
    computed: {
      setDate: function () {
        this.setTime()
      },
      setStartPosition: function () {
        let startAPosition = this.$store.state.b.position3
        this.startPosition = startAPosition
        this.startCoords = this.$store.state.b.coords3
        return startAPosition
      },
      setEndPosition: function () {
        let endAPosition = this.$store.state.b.position4
        this.endPosition = endAPosition
        this.endCoords = this.$store.state.b.coords4
        return endAPosition
      }
    },
    watch: {
      timesNow: function () {
        var timeNow = new Date()
        var changeTime = new Date(this.timesNow).getTime()
        if (timeNow >= changeTime || this.timesNow === '') {
          this.setTime()
        }
      },
      choose: function () {
        this.shuttle = 0
      },
      startCoords: {
        handler: function () {
          this.getLongitude()
        },
        deep: true
      },
      endCoords: {
        handler: function () {
          this.getLongitude()
        },
        deep: true
      }
    },
    components: {
      'tel-content': tel,
      'btn-box': btnBox
    }
  }
</script>
<style type="text/css" src="../css/peoplecar.css"></style>
