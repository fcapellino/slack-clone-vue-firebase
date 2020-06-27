<template>
    <div>
        <div class="messages-list" id="messagesDiv">
            <message v-for="(message, index) in messages" :key="index" :current-message="message"></message>
        </div>
        <div class="new-message-form">
            <div class="progress mb-1" style="height:5px;">
                <div class="progress-bar progress-bar-striped" role="progressbar" v-bind:style="{ width: fileUploadTaskPercentage }" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="input-group">
                <input type="text" v-model.trim="newMessageText" class="form-control mb-2 mr-1" placeholder="MESSAGE">
                <button v-on:click.stop="sendTextMessage" class="btn btn-primary mb-2 mr-1">Send</button>
                <button v-on:click.stop="openFileDialog" v-bind:disabled="!!fileUploadTaskPercentage" class="btn btn-warning mb-2 mr-0">Upload</button>
            </div>
        </div>
        <div style="display:none">
            <input type="file" v-on:change="uploadFile" class="form-control" id="newFile" name="newFile" accept="image/*">
        </div>
    </div>
</template>

<script>
    import utils from '../common/utils'
    import storage from 'firebase/storage'
    import $ from 'jquery'
    import { v4 as uuidv4 } from 'uuid'
    import mime from 'mime-types'
    import message from './message'

    export default {
        name: 'chat',
        components: {
            message
        },
        data() {
            return {
                messagesRef: window.firebase.database().ref('messages'),
                privateMessagesRef: window.firebase.database().ref('privateMessages'),
                storageRef: window.firebase.storage().ref(),
                messages: [],
                newMessageText: null,
                authorizedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                fileUploadTask: null,
                fileUploadTaskPercentage: null,
                listeners: []
            }
        },
        mounted: function () {
            const self = this
            document.onkeypress = function (e) {
                if (e.key === 'Enter') {
                    self.sendTextMessage()
                }
            }
        },
        beforeDestroy: function () {
            const self = this
            self.removeAllListeners()
            self.cancelFileUploadTask()
        },
        computed: {
            currentChannel: function () {
                const self = this
                return self.$store.getters.getCurrentChannel
            },
            currentMessagesRef: function () {
                const self = this
                var privateChannel = utils.tryGet(() => self.currentChannel.private)
                return (privateChannel === true)
                    ? self.privateMessagesRef
                    : self.messagesRef
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
            },
            fileUploadTaskPercentage: {
                deep: true,
                handler: function (value) {
                    const self = this
                    if (value === '100%') {
                        setTimeout(() => self.fileUploadTaskPercentage = null, 1000)
                    }
                }
            }
        },
        methods: {
            sendTextMessage: function () {
                const self = this
                self.sendMessage({ text: self.newMessageText })
                self.newMessageText = null
            },
            sendMessage: function (message) {
                const self = this
                // #region VALIDATIONS
                if (!message || !self.$store.getters.getCurrentChannel) {
                    return
                }
                if (utils.isNullOrEmpty(message.text) && utils.isNullOrEmpty(message.fileUrl)) {
                    return
                }
                // #endregion

                var newMessage = $.extend({}, {
                    content: utils.tryGet(() => message.text.trim()),
                    fileUrl: utils.tryGet(() => message.fileUrl.trim()),
                    timestamp: window.firebase.database.ServerValue.TIMESTAMP,
                    user: {
                        id: utils.tryGet(() => self.$store.getters.getCurrentUser.uid),
                        name: utils.tryGet(() => self.$store.getters.getCurrentUser.providerData[0].displayName),
                        avatar: utils.tryGet(() => self.$store.getters.getCurrentUser.photoURL)
                    }
                });

                var channelId = self.currentChannel.id
                self.newMessage = {}
                self.currentMessagesRef.child(channelId).push().set(newMessage)
                    .then(function (response) { })
                    .catch(function (error) {
                        self.$toast.error(error.message, { position: 'top' })
                    })
            },
            openFileDialog: function () {
                const self = this
                document.getElementById('newFile').click()
            },
            uploadFile: function (event) {
                const self = this
                // #region VALIDATIONS
                var files = event.target.files
                if (files.length !== 1) {
                    return
                }

                if (!self.$store.getters.getCurrentChannel) {
                    return
                }

                var selectedFile = files[0]
                document.getElementById('newFile').value = null;
                var index = self.authorizedFileTypes.indexOf(mime.lookup(selectedFile.name))
                if (index === -1) {
                    return
                }
                // #endregion

                var channelId = utils.tryGet(() => self.currentChannel.id)
                var privateChannel = utils.tryGet(() => self.currentChannel.private)

                var filePath = privateChannel
                    ? `files/private/${channelId}/${uuidv4()}.jpg`
                    : `files/public/${uuidv4()}.jpg`

                var metadata = {
                    contentType: mime.lookup(selectedFile.name)
                }

                self.fileUploadTask = self.storageRef.child(filePath).put(selectedFile, metadata)
                self.fileUploadTask.on('state_changed', {
                    next: function (snapshot) {
                        var percentage = `${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
                        self.fileUploadTaskPercentage = percentage
                    },
                    error: function (error) {
                        self.$toast.error(error.message, { position: 'top' })
                        self.fileUploadTask = null
                        self.fileUploadTaskPercentage = null
                    },
                    complete: function () {
                        self.fileUploadTask.snapshot.ref.getDownloadURL().then(function (fileUrl) {
                            self.sendMessage({ fileUrl: fileUrl })
                        })
                    }
                })
            },
            addListeners: function () {
                const self = this
                var channelId = self.currentChannel.id
                var currentMessagesRef = self.currentMessagesRef

                self.messages = []
                self.addToListenersArray(channelId, self.currentMessagesRef)
                currentMessagesRef.child(channelId).on('child_added', function (snapshot) {
                    var snapshotVal = snapshot.val()
                    var message = Object.assign({
                        id: snapshot.key
                    }, snapshotVal)

                    self.messages.push(message)
                    self.$nextTick(function () {
                        var objDiv = $('#messagesDiv').get(0);
                        objDiv.scrollTop = objDiv.scrollHeight;
                    })
                })
            },
            addToListenersArray: function (id, ref) {
                const self = this
                var index = self.listeners.findIndex(x => x.id === id)
                if (index === -1) {
                    self.listeners.push({ id, ref })
                }
            },
            removeAllListeners: function () {
                const self = this
                self.listeners.forEach((x) => x.ref.child(x.id).off())
                self.listeners = []
            },
            cancelFileUploadTask: function () {
                const self = this
                if (!!self.fileUploadTask) {
                    self.fileUploadTask.cancel()
                    self.fileUploadTask = null
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
