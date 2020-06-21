<template>
  <div id="app">
    <img class="logo" src="../public/gtagdebugger.svg" alt="" />
    <Card
      v-for="(item, index) in gtagData"
      :gtag-data="item"
      :key="numberOfCards - index"
    />
  </div>
</template>

<script>
import browser from 'webextension-polyfill';
import Card from './components/Card';

export default {
  name: 'App',
  components: {
    Card
  },

  data() {
    return {
      rawGtagData: []
    };
  },

  created() {
    browser.runtime.onMessage.addListener((request) => {
      if (request.type === 'gtag-to-panel') {
        this.rawGtagData = JSON.parse(request.data) || [];
      }
    });
  },

  computed: {
    gtagData() {
      return this.rawGtagData
        .filter((data) => data[0] && data[0] === 'event')
        .map((data) => {
          return {
            event: data[1],
            ...data[2]
          };
        })
        .reverse();
    },

    numberOfCards() {
      return this.gtagData.length;
    }
  },

  methods: {
    getProps(item) {
      return Object.entries(item);
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: 'Source Sans Pro' Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 30px;
}

.logo {
  width: 100%;
  max-width: 230px;
  margin-bottom: 20px;
}
</style>
