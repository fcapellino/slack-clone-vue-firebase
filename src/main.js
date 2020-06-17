// the vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import appSettings from '../config/appsettings.json'
import vue from 'vue'
import app from './App'
import router from './router'
import firebase from 'firebase/app'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

vue.config.productionTip = false

// initialize firebase
var firebaseConfig = appSettings.firebaseConfig
firebase.initializeApp(firebaseConfig)
window.firebase = firebase
const unsubscribe = window.firebase.auth().onAuthStateChanged(function (user) {
  store.dispatch('setUser', user)
  startApplication()
  unsubscribe()
})

// custom directives
vue.directive('uppercase', {
  update(el) {
    if (el.value && typeof el.value === 'string') {
      el.value = el.value.trim().toUpperCase()
    }
  }
})

// main vue instance
function startApplication() {
  var mainModel = new vue({
    el: '#app',
    router,
    store,
    components: { app },
    template: '<app/>'
  })
}
