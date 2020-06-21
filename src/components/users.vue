<template>
    <div>
        <div class="mt-4 mb-4">
            <div class="text-light">
                <h5>Users</h5>
                <ul class="nav flex-column">
                    <li v-for="(user, index) in users" :key="index">
                        <img :src="user.avatar" style="height:20px;width:20px;" />
                        <span class="text-primary">{{ user.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '../common/utils'
    import database from 'firebase/database'

    const status = {
        ONLINE: 'online',
        OFFLINE: 'offline'
    }
    export default {
        name: 'users',
        data() {
            return {
                usersRef: window.firebase.database().ref('users'),
                users: []
            }
        },
        mounted: function () {
            const self = this
            self.addListeners()
        },
        beforeDestroy: function () {
            const self = this
            self.removeAllListeners()
        },
        computed: {
            currentUser: function () {
                const self = this
                return self.$store.getters.getCurrentUser
            }
        },
        methods: {
            addListeners: function () {
                const self = this
                self.usersRef.orderByChild("name").on('child_added', function (snapshot) {
                    if (self.currentUser.uid !== snapshot.key) {
                        var snapshotVal = snapshot.val()
                        var user = Object.assign({
                            uid: snapshot.key,
                            status: status.OFFLINE
                        }, snapshotVal)

                        self.users.push(user)
                    }
                })
            },
            removeAllListeners: function () {
                const self = this
                self.usersRef.off()
            }
        }
    }
</script>
