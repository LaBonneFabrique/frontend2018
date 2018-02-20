<template>
  <div>
    <q-input
      v-model="userData.email"
      />
      
    <q-input
      v-model="userData.mdp"
      type="password" float-label="Mot de passe"
      />
    <q-btn @click="signup(userData.email, userData.mdp)">
      Inscription
    </q-btn>
    <div v-if="isLoggedIn()">
      <q-btn flat @click="logout()">
        logout
      </q-btn>
    </div>
  </div>
</template>

<script>
import {QBtn, QInput} from 'quasar'
import {LISTE_USERS} from '../constants/userAuth'
import { authMixins } from '../utils/auth.js'

export default {
  mixins: [authMixins],
  components: {
    QBtn,
    QInput
  },
  data () {
    return {
      userData: {
        email: 'wcd@kj.fr',
        mdp: 'lulu'
      },
      token: ''
    }
  },
  apollo: {
    allUsers: {
      query: LISTE_USERS,
      result (result) {
        console.log(result)
      }
    }
  }
}
</script>

<style>
</style>
