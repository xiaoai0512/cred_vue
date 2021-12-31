<template>
  <div class="homeDiv">
    <v-header class="vheader"></v-header>
    <v-first-menu class="vFirstMenu"></v-first-menu>
  </div>
</template>

<script>
  import vHeader from './header'
  import vFirstMenu from './firstMenu'
  // import vLeftNav from './LeftNav.vue'
  // import vTags from './Tags.vue'

  export default {
    components:{
    	vHeader,
      vFirstMenu
      // vLeftNav,vTags
    },
    
  }
</script>

<style>
.vheader {
  height: 60px;
  padding: 0 25px;
}
</style>
