<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav-bar" ref="detailNavBar" @titleClick="titleClick" />
    <scroll class="content" ref="scroll" @scroll="ContentScrollY" :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goodsInfo="goodsInfo"></detail-base-info>
      <detail-shop-info :shop="shopInfo"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :paramInfo="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <back-top v-show="isShowBackTop" @click.native="backClick" />
    <detail-bottom-bar @openShoppingCart="openShoppingCart"></detail-bottom-bar>
    <detail-shopping-cart
      :shopping-cart-info="ShoppingCartInfo"
      @addCart="addToCart"
      ref="detailShoppingCart"
    ></detail-shopping-cart>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'
import DetailShoppingCart from './childComps/DetailShoppingCart'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/common/backTop/BackTop'

import { itemImgListenerMixin, backTopMixin } from 'common/mixin'

import { getDetail, GoodsInfo, Shop, GoodsParam, getRecommend } from 'network/detail'
import { debounce } from 'common/util'

//mapActions辅助函数仅仅是将store中的Actions映射到局部methods
import { mapActions } from 'vuex'

// import Toast from 'components/common/toast/Toast'

export default {
  name: 'Detail',
  data() {
    return {
      iid: null,
      topImages: [],
      goodsInfo: {},
      shopInfo: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      titleCurrentIndex: 0,
      getThemeTopY: null,
      ShoppingCartInfo: {}
    }
  },
  mixins: [itemImgListenerMixin, backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
    BackTop,
    DetailBottomBar,
    DetailShoppingCart
    // Toast
  },
  methods: {
    //mapActions辅助函数仅仅是将store中的Actions映射到局部methods
    ...mapActions(['addShoppingCartGoods']),
    imageLoad() {
      //1)使用mixin中的保存的防抖动函数刷新页面
      this.mixinRefresh()

      //2)每张图片加载完后调用getThemeTopY赋值
      this.$nextTick(() => {
        this.getThemeTopY()
      })
    },
    ContentScrollY(position) {
      // 1)滑动到什么位置与顶部标题对应
      const positionY = -position.y
      for (let i = 0; i < this.themeTopYs.length - 1; i++) {
        if (this.titleCurrentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
          this.titleCurrentIndex = i
          //拿到子组件传下标值
          this.$refs.detailNavBar.currentIndex = this.titleCurrentIndex
        }
      }

      //2)、监听BackTop是否显示
      this.isShowBackTop = position.y < -1000
    },
    //点击头部标题滚动到对应位置
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    //5、显示商品属性旋转
    openShoppingCart() {
      // console.log(1)
      this.$refs.detailShoppingCart.isShowShoppingCart = true
    },

    //加入购物车
    addToCart() {
      // console.log(2)
      //1)获取购物车需要展示的信息
      const product = {}
      product.name = this.shopInfo.name
      product.desc = this.goodsInfo.desc
      product.iid = this.iid
      product.currentCounts = this.$refs.detailShoppingCart.currentCounts
      product.realPrice = this.$refs.detailShoppingCart.nowPrice
      product.productStyleMsg = this.$refs.detailShoppingCart.productStyleMsg
      product.productSizeMsg = this.$refs.detailShoppingCart.productSizeMsg
      product.image = this.$refs.detailShoppingCart.currentImg

      //2)将商品加入到购物车执行成功后调用then(Vuex)
      this.addShoppingCartGoods(product)
        .then(res => {
          //点击确定后关闭购物车，显示提示信息
          this.$refs.detailShoppingCart.isShowShoppingCart = false
          //直接调用我们自己封装的toast插件，显示提示信息
          this.$toast.showToast(res, 800)
          // console.log(res)
        })
        .catch(err => {
          //直接调用我们自己封装的toast插件，显示提示信息
          this.$toast.showToast(err, 800)
          // console.log(err)
        })
    }
    // this.$store.dispatch('addCart', product)
  },
  created() {
    //获取传入的商品id
    this.iid = this.$route.params.iid
    getDetail(this.iid).then(res => {
      const data = res.result
      // console.log(data)
      //抽离顶部轮播图数据
      this.topImages = data.itemInfo.topImages
      //抽离商品数据
      this.goodsInfo = new GoodsInfo(data.itemInfo, data.columns, data.shopInfo.services)
      //店铺数据
      this.shopInfo = new Shop(data.shopInfo)
      //详情数据
      this.detailInfo = data.detailInfo
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //保存评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      //7)保存购物车信息
      this.ShoppingCartInfo = data.skuInfo
      // console.log(data.skuInfo)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs)
      }, 50)
    })
    //3、获取推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted() {},
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background: #fff;
  height: 100vh;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
