<template>
  <div class="recommend">
    <div v-for="item in recommends" :key="item.sort" class="recommend_item">
      <a :href="item.link">
        <img :src="item.image" alt="" />
        <div class="title">{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recommends: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.recommend {
  display: flex;
  padding: 5px 0 10px 0;
}
.recommend .recommend_item {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.recommend .recommend_item img {
  height: 80px;
  width: 80px;
}
</style>
