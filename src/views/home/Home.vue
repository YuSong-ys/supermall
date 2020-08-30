<template>
  <div id="home">
    <nav-bar class="home-nav-bar">
      <div slot="nav-bar-center">购物街</div>
    </nav-bar>
    <tab-control
      v-show="isTabFixed"
      class="tab-control1"
      :titles="['综合', '新品', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="ContentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad" />
      <recommend-view :recommends="recommends" />
      <home-feature-view />
      <tab-control class="tab-control2" :titles="['综合', '新品', '精选']" @tabClick="tabClick" ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top v-show="isShowBackTop" @click.native="backClick" />
  </div>
</template>

<script>
import { getHomeMultidata, getHomeGoods } from 'network/home'

//子组件
import HomeSwiper from './childcomps/HomeSwiper'
import RecommendView from './childcomps/RecommendView'
import HomeFeatureView from './childcomps/HomeFeatureView'

//公共组件
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/common/backTop/BackTop'
import Scroll from 'components/common/scroll/Scroll'

import { itemImgListenerMixin } from 'common/mixin'
// import { debounce } from 'common/util'

export default {
  name: 'home',
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    HomeFeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  mixins: [itemImgListenerMixin],
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    //点击切换tab
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index

      //判断在哪个位置点击tab栏会回到tab栏位置
      if (this.isTabFixed) {
        this.$refs.scroll.scrollTo(0, -this.tabOffsetTop, 0)
      }
    },
    ContentScroll(position) {
      this.isShowBackTop = -position.y > 1000
      //3)、判断tabControl是否需要吸顶显示
      this.isTabFixed = this.tabOffsetTop <= -position.y
    },
    //3、监听上拉事件（使用scroll组件传过来的事件）
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImgLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    //网络请求部分
    getHomeMultidata() {
      //1、请求多个数据
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      //2、请求商品数据
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullUp()
      })
    }
  },
  created() {
    // console.log(this.goods[this.currentType].list);
    //1.请求多个数据
    this.getHomeMultidata()

    //2、请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  activated() {
    //一进入组件就滚动到离开时保存的位置
    this.$refs.scroll && this.$refs.scroll.scrollTo(0, this.saveY, 10)
    //refresh():重新计算 better-scroll,
    this.$refs.scroll && this.$refs.scroll.refresh()
  },
  deactivated() {
    //1、保存离开时的位置
    this.saveY = this.$refs.scroll.scroll.y
    //取消全局事件监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  mounted() {}
}
</script>

<style scoped>
#home {
  padding-top: 44px;
  position: relative;
  height: 100vh;
}
.home-nav-bar {
  color: #fff;
  background: var(--color-tint);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
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
