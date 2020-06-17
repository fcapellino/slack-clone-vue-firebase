<template>
  <div>
    <h3 class="text-light mt-2">#MY-SLACK-CLONE#</h3>
    <hr style="border-top: 1px solid white;">
    <span>
      <img class="mr-2" style="height:50px;width:50px;" v-bind:src="currentUser.photoURL" />
      <span class="text-light">{{ currentUser.displayName }}</span>
    </span>
    <hr style="border-top: 1px solid white;">
    <button type="button" class="btn btn-outline-light btn-sm" v-on:click.stop="logout">Logout</button>
    <hr style="border-top: 1px solid white;">
    <channels></channels>
  </div>
</template>

<script>
  import auth from 'firebase/auth'
  import channels from './channels'

  export default {
    name: 'sidebar',
    components: {
      channels
    },
    computed: {
      currentUser: function () {
        const self = this
        return self.$store.getters.getCurrentUser
      }
    },
    methods: {
      logout: function () {
        const self = this
        window.firebase.auth().signOut()
        self.$store.dispatch('setUser', null)
        self.$router.push('/login')
      }
    }
  }
</script>
