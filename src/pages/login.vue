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
    import utils from '../common/utils'
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
                        self.storeUser(response.user)
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
                        self.storeUser(response.user)
                        self.$router.push('/')
                    })
                    .catch(function (error) {
                        self.errors.push(error.message)
                        self.loading = false
                    })
            },
            storeUser: function (loggedUser) {
                const self = this
                var user = {
                    name: utils.tryGet(() => loggedUser.providerData[0].displayName),
                    avatar: utils.tryGet(() => loggedUser.photoURL)
                }

                self.usersRef.child(loggedUser.uid).set(user)
                self.$store.dispatch('setUser', loggedUser)
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
