<template>
  <div>
    <nav-bar>
      <div slot="nav-bar-left" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="" class="backimg" />
      </div>
      <div slot="nav-bar-center" class="navbar">
        <div
          v-for="(item, index) in titles"
          :key="index"
          @click="itemClick(index)"
          class="navbaritem"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
export default {
  name: 'detailnavbar',
  components: {
    NavBar
  },
  data() {
    return {
      titles: ['商品', '参数', '评论', '推荐'],
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('titleClick', index)
    },
    backClick() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
}
.navbaritem {
  flex: 1;
  font-size: 14px;
}
.backimg {
  margin-top: 12px;
}
.current {
  color: var(--color-high-text);
}
</style>
