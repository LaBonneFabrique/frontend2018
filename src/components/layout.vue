<template>
    <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    :header-class="{'no-shadow': true}"
  >
  <q-toolbar slot="header" color="amber-8" inverted class="no-shadow">
    <q-toolbar-title></q-toolbar-title>
    <q-btn flat v-if="!estIdentifie" color="light-green-8" @click="menuInscription = true">
      <q-icon name="fa-user-plus"  style="margin-right: 5px"/> S'inscrire
      <q-popover ref="menuInscription" style="padding: 20px" v-model="menuInscription">
        <h5>Formulaire d'inscription</h5>
        <hr />
        <q-input float-label="Nom" v-model="nom" @input="$v.nom.$touch" :error="$v.nom.error" />
        <span v-if="!$v.nom.required">Votre nom est requis.</span>
        <q-input float-label="Prénom" v-model="prenom" />
        <q-input type="email" float-label="adresse mail" v-model="email" @input="$v.email.$touch" :error="$v.email.$error"/>
        <span v-if="!$v.email.email">L'adresse entrée n'est pas valide</span><span v-if="!$v.email.required">L'adresse mail est requise</span>
        <q-input type="password" float-label = "mot de passe" v-model="password" @input="$v.password.$touch" :error="$v.password.$error"/>
        <span v-if="!$v.password.required">Le mot de passe est requis</span>
        <span v-if="!$v.password.minLength">Minimum 6 caractères de long</span>
        <q-input type="password" float-label = "confirmer le mode passe" v-model="repeatPassword" @input="$v.repeatPassword.$touch" :error="$v.repeatPassword.$error"/>
        <span v-if="!$v.repeatPassword.sameAsPassword">Les mots de passe ne correspondent pas.</span><br />
        <q-btn flat inverted color="amber-8" @click="$refs.menuInscription.close()">Annuler</q-btn>
        <q-btn flat inverted color="light-green-8" @click="inscription()">S'enregistrer</q-btn>
      </q-popover>
    </q-btn>
    <q-btn flat v-if="!estIdentifie" color="amber-8" @click=" menuIdentification = true">
      <q-icon name="fa-sign-in" style="margin-right: 5px"/> S'identifier
      <q-popover ref="menuIdentification" style="padding: 20px" v-model="menuIdentification">
        <h5>Connexion</h5>
        <hr />
        <q-input type="email" float-label="adresse mail" v-model="email" />
        <q-input type="password" float-label = "mot de passe" v-model="password" />
        <q-btn flat inverted color="amber-8" @click="$refs.menuIdentification.close()">Annuler</q-btn>
        <q-btn flat inverted color="light-green-8" @click="connexion()">Connexion</q-btn>
      </q-popover>
    </q-btn>
    <q-btn
      flat
      v-if="estIdentifie"
      @click="menuGauche = false"
      >
      <q-icon name="fa-ellipsis-v" />
               <q-popover v-model="menuGauche" touch-position style="padding: 10px" class="shadow-3">
                 <q-list link dense no-border>
                   <q-item @click="menuGauche = false, $router.push({ name: 'accueil'})">
                     <q-item-side icon="fa-home" />
                     <q-item-main>
                       Accueil
                     </q-item-main>
                   </q-item>
                   <q-item @click="menuGauche = false, $router.push({ name: 'Tableau de bord', params: { userId: loggedInUser() }})">
                     <q-item-side icon="fa-tachometer" />
                     <q-item-main>
                       Tableau de bord
                     </q-item-main>
                   </q-item>
                   <q-item @click="menuGauche = false, $router.push({ name: 'listeUsers' })">
                     <q-item-side icon="fa-users" />
                     <q-item-main>
                       Liste des adhérents
                     </q-item-main>
                   </q-item>
                   <q-item @click="menuGauche = false, deconnexion()">
                     <q-item-side icon="fa-sign-out" />
                     <q-item-main>
                       Deconnexion
                     </q-item-main>
                   </q-item>
                 </q-list>
        </q-popover> 
    </q-btn>

  </q-toolbar>
  
  <router-view :key="$route.fullPath" />
  
  </q-layout>

</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QPopover,
  QModal,
  Toast,
  QInput,
  Loading,
  QSpinnerCircles,
  QList,
  QItem,
  QItemSide,
  QItemMain,
  Events
} from 'quasar'
import layoutStore from '../constants/layoutStore'
import { authMixins } from '../utils/auth.js'
import { validationMixin } from 'vuelidate'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  mixins: [authMixins, validationMixin],
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QPopover,
    QModal,
    QInput,
    QList,
    QItem,
    QItemSide,
    QItemMain
  },
  created () {
    Events.$on('logginState', this.updateEstIdentifie)
  },
  beforeDestroy () {
    Events.$off('logginState', this.updateEstIdentifie)
  },
  data () {
    return {
      layoutStore,
      estIdentifie: this.isLoggedIn(),
      email: '',
      password: '',
      repeatPassword: '',
      nom: '',
      prenom: '',
      menuGauche: false,
      menuInscription: false,
      menuIdentification: false
    }
  },
  validations: {
    nom: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  mounted () {
    this.estIdentifie = this.isLoggedIn()
    // this.$watch('estIdentifie', () => {console.log('change !'); return this.isLoggedIn()})
  },
  methods: {
    inscription: async function () {
      Loading.show({
        spinner: QSpinnerCircles,
        message: 'Enregistrement dans la base en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.signup(this.email, this.password, this.nom, this.prenom)
      Loading.hide()
      this.estIdentifie = this.isLoggedIn()
      this.email = ''
      this.password = ''
      this.repeatPassword = ''
      this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
      /* .then((data) => {
        Loading.hide()
        this.estIdentifie = this.isLoggedIn()
        this.email = ''
        this.password = ''
        this.repeatPassword = ''
        this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
      }).catch((error) => {
        Loading.hide()
        console.log(error)
      }) */
    },
    connexion: function () {
      Loading.show({
        spinner: QSpinnerCircles,
        message: 'Chargement des données utilisateur...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      this.login(this.email, this.password).then((data) => {
        Loading.hide()
        this.estIdentifie = this.isLoggedIn()
        Events.$emit('logginState')
        // this.$router.go()
      }).catch((error) => {
        Loading.hide()
        if (error.message.search('password') > 0) {
          Toast.create.negative({
            html: 'Ce n\'est pas le bon mot de passe'
          })
        }
        if (error.message.search('mail') > 0) {
          Toast.create.negative({
            html: 'Cette adresse mail n\'a pas été trouvée dans la base'
          })
        }
      })
    },
    deconnexion: function () {
      this.logout()
      this.estIdentifie = this.isLoggedIn()
      this.menuGauche = false
      this.menuInscription = false
      this.menuIdentification = false
      Events.$emit('logginState')
      // this.$router.push({name: 'accueil'})
    },
    updateEstIdentifie: function () {
      this.$set(this, 'estIdentifie', this.isLoggedIn())
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
