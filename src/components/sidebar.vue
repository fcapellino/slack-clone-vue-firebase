<template>
    <div>
        <h3 class="text-light mt-2">#MY-SLACK-CLONE#</h3>
        <hr style="border-top: 1px solid white;">
        <span>
            <img class="mr-2" style="height:50px;width:50px;" v-bind:src="currentUser.photoURL" />
            <span class="text-light">{{ currentUser.providerData[0].displayName }}</span>
        </span>
        <hr style="border-top: 1px solid white;">
        <button type="button" class="btn btn-outline-light btn-sm" v-on:click.stop="logout">Logout</button>
        <hr style="border-top: 1px solid white;">
        <channels></channels>
        <users></users>
    </div>
</template>

<script>
    import utils from '../common/utils'
    import auth from 'firebase/auth'
    import channels from './channels'
    import users from './users'

    export default {
        name: 'sidebar',
        components: {
            channels,
            users
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
