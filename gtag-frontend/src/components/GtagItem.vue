<template>
  <div class="flex-start">
    <template v-if="isObject(gtagItem)">
      <GtagItem
        v-for="(item, index) in getProps(gtagItem)"
        :gtag-item="item"
        :key="index"
        :depth="1"
      />
    </template>
    <div
      v-else-if="gtagItem && !isArray(gtagItem[1])"
      class="gtag-item"
      :style="listStyle"
    >
      <strong>{{ gtagItem[0] }}:</strong> {{ gtagItem[1] }}
    </div>
    <template v-else-if="isArray(gtagItem[1])">
      <div class="accordion" @click="isOpen = !isOpen">
        <strong>{{ gtagItem[0] }}:</strong>
        <span>{{ isOpen ? 'close' : 'open' }}</span>
      </div>
      <GtagItem
        v-show="isOpen"
        class="gtag-item-list"
        v-for="(item, index) in gtagItem[1]"
        :gtag-item="item"
        :key="index"
        :depth="1"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'GtagItem',
  props: {
    gtagItem: {
      type: [Object, Array],
      required: true
    },

    depth: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      isOpen: false
    };
  },

  computed: {
    listStyle() {
      return {
        margin: `3px 0 3px ${this.depth * 15}px`,
        'max-width': `calc(100% - ${this.depth * 15}px)`
      };
    }
  },

  methods: {
    isObject(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },

    isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },

    getProps(item) {
      return Object.entries(item);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-start {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.gtag-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
}

.gtag-item-list {
  margin: 15px 0;
}

.accordion {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.accordion span {
  padding: 3px 10px;
  background: #000;
  border-radius: 5px;
  color: #fff;
}
</style>
