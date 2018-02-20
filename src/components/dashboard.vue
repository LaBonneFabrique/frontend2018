<template>  
  <q-tabs inverted no-pane-border>
      <q-tab default slot="title" name="general" label="général"/>
      <q-tab v-for="(m, index) in profileData.profil" :label="m.prenom" :name="m.prenom" slot="title" :key = "m.id" />
      
  <q-tab-pane name="general"  style="margin-top: 40px">
  <div class="row md-gutter" style="padding-left: 32px">
    <q-card class="col-md-3" inline style="padding: 0px">
      <q-card-title>
        <q-icon name="fa-address-card-o" style="margin-right: 10px"/>
          Généralité
      </q-card-title>
      <q-card-main>
        <div class="row">
        <q-field
          label="Quotient familial"
          :labelWidth="8"
          class="col-8">
          <q-input type="number" v-model="profileData.qf" @blur="majUser('qf')"/>
        </q-field>
        <q-icon name="fa-question-circle-o" class="col-3 offset-1 justify-start" size="24px">
                  <q-tooltip anchor="bottom middle" self="top middle">
        <q-list dense no-border>
        <q-item>
          Nos prix sont modulés par le quotient :
        </q-item>
        <q-item>
          1 < QF < 600 : -60%
        </q-item>
        <q-item>601 < QF < 900 : -40%</q-item>
        <q-item>901 < QF < 1200 : -20%</q-item>
        <q-item>1201 < QF < 1500 : -10%</q-item>
        <q-item>
          QF > 1501 : plein tarif
        </q-item>
        </q-list>
        </q-tooltip>
        </q-icon>
        </div>
      </q-card-main>
    </q-card>
    
    
        <q-card class="col-md-3" inline style="padding: 0px">
      <q-card-title>
        <q-icon name="fa-users" style="margin-right: 10px"/>
          Membres de la famille
      </q-card-title>

        <q-card-main>
        <div class="row sm-gutter" v-for="(m, index) in profileData.profil" style="margin-bottom: 10px">
          <div class="col-5">{{m.prenom}}</div>
          <div class="col-3 ">{{age(m.dateNaissance)}}</div>
          <q-btn class="col-1 offset-1" flat inverted color="primary" @click="majMembre(index)"><q-icon name="fa-pencil" /></q-btn>
          
          <q-btn v-if="index > 0" class="col-1" flat inverter @click="effacerMembre(m.id)" color="warning">
            <q-icon name="fa-trash" />
          </q-btn>
        </div>
        </q-card-main>
        <q-card-separator />
    <q-card-actions align="end">
      <q-btn flat inverted @click="ajoutMembre = true">
        <q-icon name="fa-plus" style="margin-right: 10px" />
        Ajouter un membre</q-btn>
    </q-card-actions>
    </q-card>
    <q-modal v-model="ajoutMembre":content-css="{padding: '15px'}">
      <h5>Ajouter un membre</h5>
      <q-input float-label="Prénom" v-model="membre.prenom" @blur="$v.membre.prenom.$touch" :error="$v.membre.prenom.$error"/>
      <span v-if="!$v.membre.prenom.required">Un prénom est requis</span>
      <q-input float-label="Nom" v-model="membre.nom"  @blur="$v.membre.nom.$touch" :error="$v.membre.nom.$error"/>
      <span v-if="!$v.membre.nom.required">Un nom est requis</span>
      <q-input float-label="Adresse mail" v-model="membre.email" />
      <q-input float-label="Date de naissance (si enfant)" placeholder="jj/mm/aaaa" v-model="membre.dateNaissance" @blur="$v.membre.dateNaissance.$touch" :error="$v.membre.dateNaissance.$error"/>
      <span v-if="!$v.membre.dateNaissance.isValideDate">mauvais format</span>
      <div class="row justify-end">
        <q-btn color="amber-8" flat inverted @click="ajoutMembre = false">Annuler</q-btn>
        <q-btn v-if="membre.id" color="primary" flat inverted @click="ajouterMembre(membre.id)">Modifier</q-btn>
        <q-btn v-else color="primary" flat inverted @click="ajouterMembre()">Ajouter</q-btn>
      </div>
    </q-modal>
            <q-card class="col-md-3" inline style="padding: 0px">
      <q-card-title>
        <q-icon name="fa-exclamation" style="margin-right: 10px"/>
          Zone de danger
      </q-card-title>

        <q-card-main>
        Les actions de ce cadre sont irréversibles.
        </q-card-main>
        <q-card-separator />
    <q-card-actions align="end">
      <q-btn flat @click="effacerCompte()" color="negative" icon="fa-warning">
        Effacer le compte</q-btn>
    </q-card-actions>
    </q-card>

  </div>
  </q-tab-pane>
  <q-tab-pane v-for="(m, index) in profileData.profil" :name="m.prenom" :key = "m.id">
    <img :src="avatar(m.id)" width="150px" class="shadow-2"/>
    <q-card inline style="width: 400px">
      <q-card-title>
        Badges <q-btn flat inverted ><q-icon name="fa-question-circle-o" size="24px" /></q-btn>
      </q-card-title>
    </q-card>
    <q-card inline style="width: 400px">
      <q-card-title>
        Ateliers
      </q-card-title>
    </q-card>
  </q-tab-pane>
  </q-tabs>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QCardActions,
  QCardSeparator,
  QCardMain,
  QBtn,
  Loading,
  QSpinnerGears,
  QInput,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QIcon,
  QField,
  QTooltip,
  QModal,
  date,
  QTabs,
  QTab,
  QTabPane,
  Toast,
  Dialog,
  Events
} from 'quasar'

import { authMixins } from '../utils/auth.js'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { FIND_USER_BY_ID, ADD_MEMBRE, CONNECT_MEMBRE, EFFACE_MEMBRE, MAJ_MEMBRE, MAJ_USER_QF, EFFACER_USER } from '../constants/userAuth'

const isValideDate = value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value)
}

export default {
  props: {
    userId: String
  },
  mixins: [authMixins, validationMixin],
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QBtn,
    Loading,
    QSpinnerGears,
    QInput,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QIcon,
    QField,
    QTooltip,
    QModal,
    QTabs,
    QTab,
    QTabPane
  },
  created: function () {
    if (this.userId !== this.loggedInUser()) {
      this.$router.push({name: 'accueil'})
    }
  },
  data () {
    return {
      profileData: {
        email: '',
        qf: '',
        profil: []
      },
      ajoutMembre: false,
      membre: {nom: '', prenom: '', email: '', dateNaissance: ''},
      loadingUser: 0
    }
  },
  validations: {
    membre: {
      prenom: {
        required
      },
      nom: {
        required
      },
      email: {
        email
      },
      dateNaissance: {
        isValideDate
      }
    }
  },
  apollo: {
    allUsers: {
      query: FIND_USER_BY_ID,
      variables () {
        return {
          id: this.userId
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingUser',
      watchLoading (isLoading, countModifier) {
        this.loadingUser = isLoading
        if (isLoading) {
          Loading.show({
            spinner: QSpinnerGears,
            message: 'Chargement des données',
            messageColor: 'white',
            spinnerSize: 150, // in pixels
            spinnerColor: 'white',
            customClass: 'bg-test'
          })
        }
        else {
          Loading.hide()
        }
      },
      result (result) {
        this.profileData = Object.assign({}, result.data.allUsers[0])
        this.profileData.profil = Object.assign({}, result.data.allUsers[0].profil)
      }
    }
  },
  methods: {
    ajouterMembre: function (mId) {
      this.ajoutMembre = false
      if (mId) {
        Loading.show({
          spinner: QSpinnerGears,
          message: 'Mise à jour de la base en cours...',
          messageColor: 'white',
          spinnerSize: 250, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
        this.$apollo.mutate({
          mutation: MAJ_MEMBRE,
          variables: {
            id: this.membre.id,
            nom: this.membre.nom,
            prenom: this.membre.prenom,
            email: this.membre.email,
            dateNaissance: this.membre.dateNaissance,
            role: this.membre.role
          }
        }).then((data) => {
          Loading.hide()
          this.$apollo.queries.allUsers.refetch()
        })
      }
      else {
        Loading.show({
          spinner: QSpinnerGears,
          message: 'Enregistrement dans la base en cours...',
          messageColor: 'white',
          spinnerSize: 250, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
        this.$apollo.mutate({
          mutation: ADD_MEMBRE,
          variables: {
            nom: this.membre.nom,
            prenom: this.membre.prenom,
            email: this.membre.email,
            dateNaissance: this.membre.dateNaissance,
            role: ['Secondaire']
          }
        }).then((data) => {
          Loading.hide()
          const membreId = data.data.createProfil.id
          this.$apollo.mutate({
            mutation: CONNECT_MEMBRE,
            variables: {
              userId: this.userId,
              membreId: membreId
            }
          }).then((data) => {
            console.log(data)
            this.$apollo.queries.allUsers.refetch()
          })
        })
      }
      this.membre = {nom: '', prenom: '', email: '', dateNaissance: ''}
    },
    age: function (naissance) {
      console.log('pof', naissance)
      if (naissance) {
        var dateNaissance = naissance.split('/')
        let cetteDate = date.buildDate({ year: dateNaissance[2], month: dateNaissance[1], date: dateNaissance[0] })
        let timeStamp = Date.now()

        let unit = 'months'
        return Math.floor((date.getDateDiff(timeStamp, cetteDate, unit)) / 12).toString() + ' ans'
      }
      return ''
    },
    effacerMembre: function (mId) {
      this.$apollo.mutate({
        mutation: EFFACE_MEMBRE,
        variables: {
          id: mId
        }
      }).then((data) => {
        this.$apollo.queries.allUsers.refetch()
      })
    },
    majMembre: function (index) {
      this.membre.nom = this.profileData.profil[index].nom
      this.membre.prenom = this.profileData.profil[index].prenom
      this.membre.email = this.profileData.profil[index].email
      this.membre.dateNaissance = this.profileData.profil[index].dateNaissance
      this.membre.id = this.profileData.profil[index].id
      this.ajoutMembre = true
    },
    majUser: function (type) {
      switch (type) {
        case 'qf': {
          Loading.show({
            spinner: QSpinnerGears,
            message: 'Mise à jour de la base en cours...',
            messageColor: 'white',
            spinnerSize: 250, // in pixels
            spinnerColor: 'white',
            customClass: 'bg-test'
          })
          this.$apollo.mutate({
            mutation: MAJ_USER_QF,
            variables: {
              id: this.userId,
              qf: this.profileData.qf
            }
          }).then((data) => {
            Loading.hide()
          })
        }
      }
    },
    avatar: function (mId) {
      return 'https://api.adorable.io/avatars/150/' + mId + '.png'
    },
    effacerCompte: function () {
      Dialog.create({
        title: 'Warning',
        message: 'Vous êtes sur le point d\'effacer votre compte. Merci de confirmer.',
        buttons: [
          'Annuler',
          {
            label: 'Confirmer',
            handler: () => {
              this.effacerCompteAction()
            }
          }
        ]
      })
    },
    effacerCompteAction: function () {
      let userId = this.loggedInUser()
      this.logout()
      Events.$emit('logginState')
      this.$set(this, 'estIdentifie', this.isLoggedIn())
      this.$apollo.mutate({
        mutation: EFFACER_USER,
        variables: {
          id: userId
        }
      }).then((data) => {
        Toast.create.positive({
          html: 'Compte effacé avec succès.'
        })
        this.$router.push({name: 'accueil'})
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
