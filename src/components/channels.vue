<template>
  <div>
    <button type="button" class="btn btn-outline-primary btn-sm" v-on:click="openModal()">Add a new channel</button>
    <div class="mt-4">
      <button v-for="(channel, index) in channels" :key="index" class="list-group-item list-group-item-action">{{ channel.name }}</button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="channelModal" data-backdrop="static" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-0">
          <div class="modal-header">
            <h5 class="modal-title">Add a new channel</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <input type="text" v-model.trim="newChannelName" v-uppercase class="form-control" id="newChannel" name="newChannel" placeholder="CHANNEL NAME">
              </div>
              <ul class="list-group" v-if="hasErrors">
                <li class="list-group-item text-danger" v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click.stop="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" v-on:click.stop="saveChannelToRef()">Accept</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '../common/utils'
  import database from 'firebase/database'
  import $ from 'jquery'

  export default {
    name: 'channels',
    data() {
      return {
        channelsRef: window.firebase.database().ref('channels'),
        channels: [],
        newChannelName: null,
        errors: []
      }
    },
    mounted: function () {
      const self = this
      self.addListeners()
    },
    beforeDestroy: function () {
      const self = this
      self.removeListeners()
    },
    computed: {
      hasErrors: function () {
        const self = this
        return !!self.errors.length
      }
    },
    methods: {
      openModal: function () {
        $('#channelModal').modal('show')
      },
      closeModal: function () {
        const self = this
        $('#channelModal').modal('hide')
        self.newChannelName = null
        self.errors = []
      },
      saveChannelToRef: function () {
        const self = this

        var key = self.channelsRef.push().key
        var newChannel = {
          id: utils.tryGet(() => key),
          name: utils.tryGet(() => self.newChannelName.toUpperCase()) || null
        }

        self.channelsRef.child(key).update(newChannel)
          .then(function () {
            self.newChannelName = null
            $('#channelModal').modal('hide')
          })
          .catch(function (error) {
            self.errors.push(error.message)
          })
      },
      addListeners: function () {
        const self = this
        self.channelsRef.on('child_added', function (snapshot) {
          if (!utils.isNullOrEmpty(snapshot.val().name)) {
            self.channels.push(snapshot.val())
            self.channels.sort(function (a, b) {
              return a.name.localeCompare(b.name)
            })
          }
        })
      },
      removeListeners: function () {
        const self = this
        self.channelsRef.off()
      }
    }
  }
</script>
