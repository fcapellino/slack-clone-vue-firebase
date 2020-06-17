<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 sidebar">
          <sidebar></sidebar>
        </div>
        <div class="col-md-8 content">
          CONTENT
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sidebar from '../components/sidebar'
  export default {
    name: 'chat',
    components: {
      sidebar
    }
  }
</script>

<style scoped>
  .sidebar {
    overflow: scroll;
    height: 100vh;
    background: rgb(63, 63, 63);
  }
</style>
