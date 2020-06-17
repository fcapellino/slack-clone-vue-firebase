<template>
  <div>
    <div class="jumbotron bg-primary text-white text-center">
      <h2 class="lead display-3">#MY SLACK CLONE#</h2>
      <p>Slack brings all your communication together!</p>
    </div>
    <div class="container-fluid">
      <div class="row mt-3">
        <div class="col text-center">
          <button type="button" class="btn btn-outline-danger" v-on:click.stop="loginWithGoogle()">Login with Google</button>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col text-center">
          <button type="button" class="btn btn-outline-dark" v-on:click.stop="loginWithGitHub()">Login with GitHub</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="alert alert-info" role="alert" style="margin:5px;" v-if="loading">
        Processing...
      </div>
      <div class="alert alert-danger" role="alert" style="margin:5px;" v-if="hasErrors">
        <span v-for="(error, index) in errors" :key="index">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from 'firebase/auth'
  import database from 'firebase/database'

  export default {
    name: 'login',
    data() {
      return {
        usersRef: window.firebase.database().ref('users'),
        errors: [],
        loading: false
      }
    },
    computed: {
      hasErrors: function () {
        const self = this
        return !!self.errors.length
      }
    },
    methods: {
      loginWithGoogle: function () {
        const self = this
        self.loading = true
        self.errors = []

        var provider = new window.firebase.auth.GoogleAuthProvider()
        window.firebase.auth().signInWithPopup(provider)
          .then(function (response) {
            self.saveUserToRef(response.user)
            self.$store.dispatch('setUser', response.user)
            self.$router.push('/')
          })
          .catch(function (error) {
            self.errors.push(error.message)
            self.loading = false
          })
      },
      loginWithGitHub: function () {
        const self = this
        self.loading = true
        self.errors = []

        var provider = new window.firebase.auth.GithubAuthProvider()
        window.firebase.auth().signInWithPopup(provider)
          .then(function (response) {
            self.saveUserToRef(response.user)
            self.$store.dispatch('setUser', response.user)
            self.$router.push('/')
          })
          .catch(function (error) {
            self.errors.push(error.message)
            self.loading = false
          })
      },
      saveUserToRef: function (user) {
        const self = this
        return self.usersRef.child(user.uid).set({
          name: user.displayName,
          avatar: user.photoURL
        })
      }
    }
  }
</script>

<style scoped>
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
</style>
