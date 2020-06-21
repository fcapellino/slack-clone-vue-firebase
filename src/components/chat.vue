<template>
    <div>
        <div class="messages-list" id="messagesDiv">
            <message v-for="(message, index) in messages" :key="index" :current-message="message"></message>
        </div>
        <div class="new-message-form">
            <div class="input-group">
                <input type="text" v-model.trim="newMessage" class="form-control mb-2 mr-1" placeholder="MESSAGE">
                <button v-on:click.stop="sendMessage" class="btn btn-primary mb-2 mr-1">Send</button>
                <button v-on:click.stop="" class="btn btn-warning mb-2 mr-1">Upload</button>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '../common/utils'
    import $ from 'jquery'
    import message from './message'

    export default {
        name: 'chat',
        components: {
            message
        },
        data() {
            return {
                messagesRef: window.firebase.database().ref('messages'),
                messages: [],
                newMessage: null,
                errors: []
            }
        },
        beforeDestroy: function () {
            const self = this
            self.removeAllListeners()
        },
        computed: {
            currentChannel: function () {
                const self = this
                return self.$store.getters.getCurrentChannel
            }
        },
        watch: {
            currentChannel: {
                deep: true,
                handler: function () {
                    const self = this
                    self.removeAllListeners()
                    self.addListeners()
                }
            }
        },
        methods: {
            sendMessage: function (event) {
                const self = this
                event.preventDefault()

                if (!self.$store.getters.getCurrentChannel ||
                    utils.isNullOrEmpty(self.newMessage)) {
                    return
                }

                var newMessage = {
                    content: self.newMessage,
                    timestamp: window.firebase.database.ServerValue.TIMESTAMP,
                    user: {
                        id: utils.tryGet(() => self.$store.getters.getCurrentUser.uid),
                        name: utils.tryGet(() => self.$store.getters.getCurrentUser.providerData[0].displayName),
                        avatar: utils.tryGet(() => self.$store.getters.getCurrentUser.photoURL)
                    }
                }

                var channelId = self.currentChannel.id
                self.messagesRef.child(channelId).push().set(newMessage)
                    .then(function (response) {
                        self.newMessage = null
                    })
                    .catch(function (error) {
                        self.errors.push(error.message)
                    })
            },
            addListeners: function () {
                const self = this
                var channelId = self.currentChannel.id

                self.messages = []
                self.messagesRef.child(channelId).on('child_added', function (snapshot) {
                    self.messages.push(snapshot.val())
                    window.setTimeout(function () {
                        var objDiv = $('#messagesDiv').get(0);
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, undefined)
                });
            },
            removeAllListeners: function () {
                const self = this
                if (!!self.currentChannel) {
                    var channelId = self.currentChannel.id
                    self.messagesRef.child(channelId).off()
                }
            }
        }
    }
</script>

<style scoped>
    input, button {
        height: 50px;
    }

    .messages-list {
        margin-top: 10px;
        overflow-y: scroll;
        height: 85vh;
    }

    .new-message-form {
        position: fixed;
        bottom: 0;
        width: 65%;
    }
</style>
