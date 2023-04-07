<template>
    <div>
        <div class="media">
            <img :src="currentMessage.user.avatar" style="height:50px;width:50px;"
                 class="align-self-start mr-3"
                 v-bind:class="[wasMessageSentByMe()? 'my-message' : '']" />
            <div class="media-body">
                <h6 class="mt-0">
                    <a href="#" style="pointer-events:none;">{{ currentMessage.user.name }}</a> - {{ fromNow(currentMessage.timestamp) }}
                </h6>
                <p v-if="currentMessage.content">
                    <mark> {{ currentMessage.content }} </mark>
                </p>
                <img class="file-message mb-3" v-else-if="currentMessage.fileUrl" :src="currentMessage.fileUrl" />
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '../assets/js/utils'
    import moment from 'moment'

    export default {
        name: 'message',
        props: {
            currentMessage: {
                type: Object,
                required: true
            }
        },
        computed: {
            currentUser: function () {
                const self = this
                return self.$store.getters.getCurrentUser
            }
        },
        methods: {
            fromNow: function (timestamp) {
                return moment(timestamp).fromNow()
            },
            wasMessageSentByMe: function () {
                const self = this
                return utils.tryGet(() => self.currentUser.uid === self.currentMessage.user.id)
            }
        }
    }
</script>

<style scoped>
    .my-message {
        border: 3px solid #007bff;
    }

    .file-message {
        height: 150px;
        border: 1px solid lightblue;
    }
</style>
