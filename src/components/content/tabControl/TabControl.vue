<template>
  <div class="tab-control">
    <div
      v-for="(item, index) in titles"
      :key="index"
      class="tab-item"
      :class="{ current: currentIndex === index }"
      @click="itemClick(index)"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabcontrol',
  data() {
    return {
      currentIndex: 0
    }
  },
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('tabClick', index)
    }
  }
}
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 15px;
  height: 30px;
  line-height: 30px;
  background: #fff;
}
.tab-control .tab-item {
  flex: 1;
}
.tab-control .tab-item span {
  padding: 0 5px 3px 5px;
}
.tab-control .current {
  color: pink;
}
.tab-control .current span {
  border-bottom: 2px solid pink;
}
</style>
