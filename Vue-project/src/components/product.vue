<template>
  <div>
    <div class="peopleCarBox">
      <tel-content v-bind:message="tel1" v-on:changeInp="changeInp1"></tel-content>
      <tel-content v-bind:message="tel2" v-on:changeInp="changeInp2"></tel-content>
      <div class="peopleCar-time">
        <em class="icon-alarm"></em>
        <input type="datetime-local" v-model="timesNow" v-bind:value="setDate" v-on:click="setTime">
      </div>
      <div class="peopleCar-start">
        <input type="text" placeholder="你在哪发货" v-on:click="postData(5)" v-bind:value="setStartPosition"
               readonly="readonly">
      </div>
      <div class="peopleCar-end">
        <input type="text" placeholder="货要到哪儿" v-on:click="postData(6)" v-bind:value="setEndPosition"
               readonly="readonly">
      </div>
      <div class="peopleCar-more">
        <div class="peopleCar-to">是否保价</div>
        <btn-box v-bind:isChoose.sync="choose"></btn-box>
      </div>
      <div class="peopleCar-btn">
        <button type="button" v-on:click="showPriceBox">货找车</button>
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
                <span>乘车人数：</span>
                <input type="number" placeholder="请输入乘车人数" v-model="peopleNum" v-on:input="setPeopleNum">
              </div>
              <div class="peopleCar-people">
                <span>服务金额：</span>
                <input type="number" placeholder="请输入服务金额(元)" v-model="serverPrice">
              </div>
              <div class="peopleCar-people" v-if="choose">
                <span>保价金额：</span>
                <input type="number" placeholder="请输入保价金额(元)" v-model="shuttle">
              </div>
              <div class="uploadImgBox">
                <div class="imgFile">
                  <div class="productBtn" v-on:click="showInfo">信息</div>
                  <input type="file"  id="uploadBtn" class="uploadBtn" v-on:change="setImg($event)">
                  <img v-bind:src="imgSrc" id="uploadImg" class="uploadImg">
                </div>
                <transition name="productList"
                            v-on:after-enter="enterProInfo"
                            v-on:before-leave="leaveProInfo"
                >
                  <div class="productList" v-show="productInfo">
                    <div class="productInfo" contenteditable="true" v-text="proTextBind" v-on:click="getInfo" v-on:input="setInfo"></div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="peopleCar-priceBtn">
              <button type="button">确定</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <div id="peopleCarMAP" v-if="false"></div>
  </div>
</template>
<script>
  import BMap from 'BMap'
  // 电话模板
  var tel = {
    props: ['message'],
    template: '<div class="peopleCar-tel"><em class="icon-phone"></em><input type="number" v-bind:class="{\'border-danger\':borderDanger}" v-model="tel" v-focus v-bind:placeholder="this.message.place" v-on:input="changeInp"><div class="clearInp" v-on:click="clearInp"><span>&times;</span></div></div>',
    data: function () {
      return {
        tel: this.message.tel,
        borderDanger: false
      }
    },
    methods: {
      clearInp: function () {
        this.tel = ''
        this.borderDanger = true
        this.$emit('changeInp', this.tel)
      },
      changeInp: function () {
        if (this.tel.length === 11) {
          this.borderDanger = false
          this.$emit('changeInp', this.tel)
        } else {
          this.borderDanger = true
          this.$emit('changeInp', this.tel)
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
        tel1: {
          tel: '15093162164',
          place: '请输入发货人的电话'
        },
        tel2: {
          tel: '15093162163',
          place: '请输入接受货物的人电话'
        },
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
        // 图片路径
        imgSrc: '../static/images/box.png',
        // 服务金额
        serverPrice: 0,
        // 人数
        peopleNum: 1,
        // 打赏
        reward: 0.1,
        // 保价费用
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
        endCoords: '',
        // 展示信息
        productInfo: false,
        // 展示信息内容储存
        proTextStore: '',
        // 展示信息内容绑定
        proTextBind: ''
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
      setImg: function (e) {
        let readFile = new FileReader()
        let imgFile = e.target.files[0]
        let _this = this
        let canvas = document.createElement('canvas')
        let img = document.createElement('img')
        let cont = canvas.getContext('2d')
        if (imgFile) {
          readFile.readAsDataURL(imgFile)
        }
        // 压缩图片
        readFile.addEventListener('load', function () {
          // 图片的
          img.src = readFile.result
          img.onload = function () {
            _this.peopleNum = 3
            var w = img.width
            var h = img.height
            canvas.width = w
            canvas.height = h
            cont.drawImage(img, 0, 0)
            let imgR = canvas.toDataURL('image/jpeg', 0.4)
            // 获取图片BASE64
            _this.imgSrc = imgR
          }
        })
      },
      con: function (e) {
        console.log(this.proTextStore)
      },
      changeInp1: function (tel) {
        this.tel1.tel = tel
      },
      changeInp2: function (tel) {
        this.tel2.tel = tel
      },
      postData: function (inpNum) {
        this.$store.commit('setPageName', inpNum)
        this.$emit('currentInp')
      },
      showInfo: function () {
        this.productInfo = !this.productInfo
      },
      showPriceBox: function () {
        if (this.startPosition !== '' && this.endPosition !== '' && this.tel1.tel !== '' && this.tel2.tel !== '') {
          this.priceBox = !this.priceBox
        }
      },
      showPrice: function () {
        this.priceBox = !this.priceBox
      },
      setPeopleNum: function () {
        this.peopleNum = parseInt(this.peopleNum)
        this.serverPrice = Math.round(parseInt(this.peopleNum, 10) * parseFloat(this.priceTotal.price) * 100) / 100
      },
      getLongitude: function () {
        var that = this
        this.peopleNum = 1
        if (this.startCoords !== '' && this.endCoords !== '') {
          var map = new BMap.Map('peopleCarMAP')
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
          var driving = new BMap.DrivingRoute(map, options)
          driving.search(this.startCoords, this.endCoords)
        }
      },
      limitTip: function (e) {
        var reward1 = this.reward.split('.')[1]
        if (reward1 !== undefined && reward1.length > 2) {
          this.reward = (Math.floor(this.reward * 100)) / 100
        }
      },
      enterProInfo: function (e) {
        if (this.proTextStore === '') {
          this.proTextBind = '点击编辑和查看物品信息'
        } else {
          this.proTextBind = this.proTextStore
        }
      },
      leaveProInfo: function (e) {
        this.proTextBind = ''
      },
      getInfo: function (e) {
        if (this.proTextStore === '') {
          this.proTextBind = ''
        }
      },
      setInfo: function (e) {
        this.proTextBind = this.proTextStore = e.target.innerHTML
      }
    },
    computed: {
      setDate: function () {
        this.setTime()
      },
      setStartPosition: function () {
        let startAPosition = this.$store.state.c.position5
        this.startPosition = startAPosition
        this.startCoords = this.$store.state.c.coords5
        return startAPosition
      },
      setEndPosition: function () {
        let endAPosition = this.$store.state.c.position6
        this.endPosition = endAPosition
        this.endCoords = this.$store.state.c.coords6
        return endAPosition
      },
      getImg: function () {
        return this.imgSrc
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
    directives: {},
    components: {
      'tel-content': tel,
      'btn-box': btnBox
    }
  }
</script>
<style type="text/css" src="../css/peoplecar.css"></style>

