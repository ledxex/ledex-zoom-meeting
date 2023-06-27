<template>
  <div id="app" >
    <router-view/>
    <BlockUI :message="loading_msg" :url="loading_img" v-if="is_loading"></BlockUI>

  </div>
</template>

<script>
import loadingImage from './assets/images/ajax-loader.gif'

import Vue from 'vue'
import BlockUI from 'vue-blockui'
Vue.use(BlockUI)

export default {
  name: 'App',
  data(){
    return {
      loading_img : loadingImage,   //It is important to import the loading image then use here
      loading_msg: 'Please wait..',
      is_loading: false
    }

  },
  components: {

  },
  created(){
    this.$root.$on('show-loader', ()=>{
      this.is_loading = true
    })

    this.$root.$on('hide-loader', ()=>{
      this.is_loading = false
    })
  }
}
</script>

<style>
#app {
  margin: auto;
}
#zmmtg-root {
  display: none;
}
</style>
