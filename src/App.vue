<template>
  <b-container fluid>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand>BootstrapVue</b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/" :active="'/' === activeLink">Table</b-nav-item>
        <b-nav-item to="/about" :active="'/about' === activeLink"
          >About</b-nav-item
        >
      </b-navbar-nav>
    </b-navbar>

    <router-view></router-view>
  </b-container>
</template>

<script>
export default {
  name: "App",
  computed: {
    activeLink() {
      return this.$route.path;
    },
  },
};
</script>

<style>
</style>
