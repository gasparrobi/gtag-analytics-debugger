<template>
  <div class="gtag-card">
    <span class="card-index">{{ $vnode.key }}</span>
    <div class="gtag-event">
      <GtagItem
        v-for="(prop, index) in getProps(gtagData)"
        :key="index"
        :gtag-item="prop"
        depth="0"
      />
    </div>
  </div>
</template>

<script>
import GtagItem from './GtagItem';

export default {
  name: 'Card',

  components: {
    GtagItem
  },

  props: {
    gtagData: {
      type: Object,
      required: true
    }
  },

  methods: {
    getProps(item) {
      return Object.entries(item);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gtag-card {
  position: relative;
  padding: 20px;
  background-color: #fff;
  margin: 15px 0;
  border-radius: 10px;
  box-shadow: 0px 0px 13px 5px rgba(0, 0, 0, 0.05);
}

.card-index {
  position: absolute;
  left: -30px;
  top: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #000;
  color: #fff;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: -1;
  font-size: 11px;
}

.gtag-event {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
