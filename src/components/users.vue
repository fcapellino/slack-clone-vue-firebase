<template>
    <div>
        <div class="mt-4 mb-4">
            <div class="text-light">
                <h5>Users</h5>
                <div class="mt-4 mb-4">
                    <button v-for="(user, index) in users" :key="index"
                            v-bind:class="[isActivePrivateChannel(user)?
                        'list-group-item list-group-item-action active' :
                        'list-group-item list-group-item-action']"
                            v-on:click.stop="setPrivateChannel(user)">
                        <img class="mr-2" style="height:25px;width:25px;" v-bind:src="user.avatar" />
                        {{ user.name }}
                        <small v-bind:class="[isUserOnline(user)? 'userOnline' : 'userOffline']">
                            [{{ user.status }}]
                        </small>
                    </button>
                </div>
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
                connectedRef: window.firebase.database().ref('.info/connected'),
                presenceRef: window.firebase.database().ref('userspresence'),
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
            },
            currentChannel: function () {
                const self = this
                return self.$store.getters.getCurrentChannel
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
                self.connectedRef.on('value', function (snapshot) {
                    if (snapshot.val() === true) {
                        var ref = self.presenceRef.child(self.currentUser.uid)
                        ref.set(true)
                        ref.onDisconnect().remove()
                    }
                })
                self.presenceRef.on('child_added', function (snapshot) {
                    self.addStatusToUser(snapshot.key, true)
                })
                self.presenceRef.on('child_removed', function (snapshot) {
                    self.addStatusToUser(snapshot.key, false)
                })
            },
            removeAllListeners: function () {
                const self = this
                self.connectedRef.off()
                self.presenceRef.off()
                self.usersRef.off()
            },
            addStatusToUser: function (userId, connected) {
                const self = this
                var index = self.users.findIndex(u => u.uid === userId)
                if (self.currentUser.uid !== userId && index !== -1) {
                    connected === true
                        ? self.users[index].status = status.ONLINE
                        : self.users[index].status = status.OFFLINE
                }
            },
            isUserOnline: function (user) {
                const self = this
                return utils.tryGet(() => user.status === status.ONLINE)
            },
            isActivePrivateChannel: function (user) {
                const self = this
                return utils.tryGet(() => {
                    return self.currentChannel.id.includes(user.uid)
                })
            },
            setPrivateChannel: function (user) {
                const self = this
                var channelId = [self.currentUser.uid, user.uid].sort().join('|');
                var newChannel = utils.tryGet(() => {
                    return {
                        id: channelId,
                        name: channelId.toUpperCase(),
                        private: true
                    }
                })

                self.$store.dispatch('setCurrentChannel', newChannel)
            }
        }
    }
</script>

<style scoped>
    .userOnline {
        color: lightgreen;
    }

    .userOffline {
        color: lightcoral;
    }
</style>
