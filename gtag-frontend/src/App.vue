<template>
  <div id="app">
    <div class="header-wrapper">
      <img class="logo" src="../public/gtagdebugger.svg" alt="" />
      <button type="button" class="reset" @click="reset">reset</button>
    </div>
    <template v-if="globalDataObject">
      <p
        v-for="(key, index) in Object.keys(globalDataObject)"
        :key="index"
        class="global-gtag-property"
      >
        <strong>{{ key }}:</strong> {{ globalDataObject[key] }}
      </p>
    </template>
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
      rawGtagData: [],
      rawGtagGlobalData: []
    };
  },

  created() {
    browser.runtime.onMessage.addListener(this.listeners);
  },

  mounted() {
    browser.runtime.sendMessage({
      type: 'app-opened',
      tabId: browser.devtools.inspectedWindow.tabId
    });
  },

  computed: {
    gtagData() {
      return this.rawGtagData
        .filter((data) => data[0] && data[0] === 'event')
        .map((data) => {
          return {
            event_action: data[1],
            ...data[2]
          };
        })
        .reverse();
    },

    numberOfCards() {
      return this.gtagData.length;
    },

    globalDataObject() {
      if (this.rawGtagGlobalData.length < 1) return null;
      const objectList = this.rawGtagGlobalData.filter((item) =>
        this.isObject(item)
      );
      return Object.assign(...objectList);
    }
  },

  methods: {
    isObject(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },

    reset() {
      browser.runtime.sendMessage({
        type: 'app-reset',
        tabId: browser.devtools.inspectedWindow.tabId
      });
    },

    listeners(request) {
      if (request.type === 'gtag-to-panel') {
        this.rawGtagData = JSON.parse(request.data) || [];
      } else if (request.type === 'gtag-global-data') {
        this.rawGtagGlobalData = JSON.parse(request.data || {});
      } else if (request.type === 'panel-shown') {
        browser.runtime.sendMessage({
          type: 'app-opened',
          tabId: browser.devtools.inspectedWindow.tabId
        });
      }
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
  color: #2c3e50;
  padding: 30px;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reset {
  display: none;
  padding: 4px 10px;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  background-color: rgb(151, 0, 0);
  border-radius: 5px;
  border: none;
}

.logo {
  width: 100%;
  max-width: 230px;
  margin-bottom: 20px;
}

.global-gtag-property {
  margin: 2px 0;
}
</style>
