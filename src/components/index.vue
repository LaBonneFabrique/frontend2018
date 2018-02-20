<template>
  <div>
        <q-card v-for="(activite, index) in affichageActivites" inline style="width: 350px; margin-bottom: 5px;" :key="activite.id" >
      <q-card-media>
        <img height="150" width="350" :src="activite.image" />
      </q-card-media>
      <q-card-title style="padding: 5px; margin-top: 5px">
        {{activite.titre}}
      </q-card-title>
      <q-card-main>
        <vue-markdown :source="activite.description"></vue-markdown>
      </q-card-main>
      <q-card-separator />
      <q-card-actions align="end">
        <div style="margin-top: 8px" v-if="activite.checkInscription">{{nbPlacesRestantes(index)}}</div>
        <q-btn flat inverted color="amber-8" @click="creationModalInscription(activite)" v-if="activite.checkInscription" 
        :disable="isComplet(activite)"
        ><q-icon name="fa-pencil-square-o" />
        <q-tooltip anchor="bottom middle" self="top middle" v-if="estIdentifie">
          Inscription
        </q-tooltip>
        <q-tooltip v-else anchor="bottom middle" self="top middle">
          Connectez-vous pour vous inscrire.
        </q-tooltip>
        </q-btn>
        <q-btn v-else flat inverted>
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-modal v-model = "modalInscription" :content-css="{padding: '20px'}">
      <h6>Inscription</h6>
      <hr />
      <div>Sélectionnez le ou les membres de votre famille à inscrire :</div>
      <q-checkbox
        v-model="aInscrire"
        v-for="(membre, index) in userData.profil"
        :label="membre.prenom"
        :val="membre.id"
        :key="membre.id"
        :disable="disableCheckbox(membre.id)"
        style="margin-right: 10px"/>
      <!-- <div v-for="membre in userData.profil" v-if="inscrire(membre.id) && !activiteInscription.checkInscriptionCycle" style="margin-top: 10px">
         <div>Choisissez le créneau pour {{membre.prenom}}</div>
         <hr />
         <q-checkbox
           v-model="checkboxInscription"
           v-for="creneau in activiteInscription.creneaux"
           :label = "horaireLisible(creneau.dateDebut, creneau.dateFin)"
           :val = "getValeur(membre.id, creneau.id)"
           :key = "creneau.id"
           :disable = "verifieCheckbox(membre.id, creneau.id)"
           style="margin-right: 10px"/>
       </div> -->
       <div class="row justify-end" style="margin-top: 15px">
       <q-btn color="amber-8" @click="modalInscription = false" flat inverted >Annuler</q-btn>
       <q-btn v-if="!inscriptionUpdate" color="primary" flat inverted @click="saveInscription()"
         >
         Enregistrer</q-btn>
       <q-btn v-else color="primary" flat inverted @click="saveInscription()">Modifier</q-btn>
       </div>
    </q-modal>
    
  </div>
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
  QIcon,
  Loading,
  QSpinnerGears,
  QTooltip,
  QModal,
  QCheckbox,
  date,
  Toast,
  Events
} from 'quasar'
import { QUERY_ALL_ACTIVITES_ASC } from '../constants/activitesGraphQL'
import { GET_ILLU_BY_ID } from '../constants/illustrationsGraphQL'
import { FIND_USER_BY_ID } from '../constants/userAuth'
import { AJOUT_INSCRIPTION, LISTE_INSCRIPTION, LES_INSCRIPTIONS, LISTE_INSCRIPTION_CYCLEID, EFFACE_LISTE_INSCRIPTION } from '../constants/inscriptionGraphQL'
import { authMixins } from '../utils/auth.js'
import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})

import VueMarkdown from 'vue-markdown'

export default {
  mixins: [authMixins],
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QBtn,
    QIcon,
    VueMarkdown,
    QTooltip,
    QModal,
    QCheckbox
  },
  data () {
    return {
      affichageActivites: [],
      modalInscription: false,
      aInscrire: [],
      checkDisable: false,
      activiteInscription: {},
      checkboxInscription: [],
      inscriptionUpdate: false,
      userData: {},
      listeInscriptions: [],
      complet: false,
      allInscriptions: [],
      listeActivites: [],
      estIdentifie: this.isLoggedIn()
    }
  },
  created () {
    Events.$on('logginState', this.updateEstIdentifie)
  },
  beforeDestroy () {
    Events.$off('logginState', this.updateEstIdentifie)
  },
  apollo: {
    allActivites: {
      query: QUERY_ALL_ACTIVITES_ASC,
      fetchPolicy: 'network-only',
      loadingKey: 'loadingActivites',
      watchLoading (isLoading, countModifier) {
        this.loadingActivites = isLoading
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
        // var affichageActivites = []
        this.affichageActivites = []
        var listeActivites = []
        this.listeActivites = []
        var listeUnique = ''
        var indice = 0
        result.data.allActivites.forEach((activite, index) => {
          if (listeUnique.indexOf(activite.idCycle) < 0) {
            listeUnique += activite.idCycle
            listeActivites[activite.idCycle] = [{
              aId: activite.id,
              gId: activite.idGoogleEvent,
              sequence: activite.sequenceEvent,
              summary: activite.titreActivite,
              location: activite.lieuActivite,
              description: activite.description,
              dateDebut: activite.dateDebut,
              dateFin: activite.dateFin
            }]
            this.$apollo.query({
              query: LISTE_INSCRIPTION_CYCLEID,
              fetchPolicy: 'network-only',
              variables: {
                cycleId: activite.idCycle
              }
            }).then((dataCycle) => {
              let inscriptions = []
              Object.assign(inscriptions, dataCycle.data.allInscriptions)
              this.$apollo.query({
                query: GET_ILLU_BY_ID,
                variables: {
                  id: activite.illustration
                }
              }).then((data) => {
                const illustration = data.data.allActivitesIllustrations[0]
                this.$set(this.affichageActivites, indice, {
                  id: activite.id,
                  idCycle: activite.idCycle,
                  checkInscription: activite.checkInscription,
                  publie: activite.publie,
                  lieu: activite.lieuActivite,
                  prix: activite.prix,
                  titre: activite.titreActivite,
                  description: activite.description,
                  image: cl.url(illustration.idImage + '.' + illustration.format, { width: 350, height: 150, crop: 'fill', gravity: 'auto' }),
                  idGoogleEvent: activite.idGoogleEvent,
                  sequenceEvent: activite.sequenceEvent,
                  maxParticipants: activite.maxParticipants,
                  inscriptions: inscriptions
                })
                indice += 1
              }).catch((error) => {
                console.log(error)
              })
            })
          }
          else {
            listeActivites[activite.idCycle].push({
              aId: activite.id,
              gId: activite.idGoogleEvent,
              sequence: activite.sequenceEvent,
              summary: activite.titreActivite,
              location: activite.lieuActivite,
              description: activite.description,
              dateDebut: activite.dateDebut,
              dateFin: activite.dateFin
            })
          }
        })
        Object.assign(this.listeActivites, listeActivites)
      }
    },
    userData: {
      query: FIND_USER_BY_ID,
      fetchPolicy: 'network-only',
      variables () {
        return {
          id: this.loggedInUser()
        }
      },
      skip () {
        return !this.isLoggedIn()
      },
      update (data) {
        this.listeInscriptions = []
        data.allUsers[0].profil.forEach((membre) => {
          this.$apollo.query({
            query: LISTE_INSCRIPTION,
            fetchPolicy: 'network-only',
            variables: {
              membreId: membre.id
            }
          }).then((data) => {
            if (data.data.allInscriptions.length > 0) {
              data.data.allInscriptions.forEach((inscription) => {
                this.listeInscriptions.push(inscription)
              })
            }
          })
        })
        return data.allUsers[0]
      }
    },
    allInscriptions: {
      query: LES_INSCRIPTIONS,
      fetchPolicy: 'network-only'
    }
  },
  methods: {
    nbPlacesRestantes: function (nActivite) {
      if (this.affichageActivites[nActivite].checkInscription) {
        const nbPlaces = this.affichageActivites[nActivite].maxParticipants - this.affichageActivites[nActivite].inscriptions.length
        if (nbPlaces > 1) return nbPlaces.toString() + ' places restantes '
        if (nbPlaces === 1) return 'Dernière place'
        if (nbPlaces === 0) {
          return 'Séance complète'
        }
      }
      else {
        return ''
      }
    },
    inscrire: function (mId) {
      if (this.aInscrire.indexOf(mId) > -1) {
        return true
      }
      else {
        return false
      }
    },
    getValeur: function (mId, cId) {
      return mId + '**-**' + cId
    },
    verifieCheckbox: function (mId, cId) {
      var membreInscritFlag = false // verification si membre inscrit à un creneau
      var membreInscritCreneauFlag = false // verification si membre inscrit à CE creneau cId
      let retour = false
      this.checkboxInscription.forEach((inscription) => {
        if (inscription.indexOf(mId) > -1) membreInscritFlag = true
        if (inscription.indexOf(this.getValeur(mId, cId)) > -1) membreInscritCreneauFlag = true
        if ((membreInscritFlag && membreInscritCreneauFlag) || (!membreInscritFlag && !membreInscritCreneauFlag)) {
          retour = false
        }
        else {
          retour = true
        }
      })
      return retour
    },
    horaireLisible: function (debut, fin) {
      let dateActivite = date.formatDate(debut, 'dddd D MMMM', {
        monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
      })
      let heureDebut = date.formatDate(debut, 'HH')
      let minDebut = date.formatDate(debut, 'mm')
      let heureFin = date.formatDate(fin, 'HH')
      let minFin = date.formatDate(fin, 'mm')
      return dateActivite + ' de ' + heureDebut + 'h' + minDebut + ' à ' + heureFin + 'h' + minFin
    },
    saveInscription: function () {
      this.modalInscription = false
      if (this.listeInscriptions.length > 0) this.updateInscription()
      if (this.aInscrire.length === 0) {
        this.modalInscription = false
        return
      }
      Loading.show({
        spinner: QSpinnerGears,
        message: 'Enregistrement de l\'inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let promises = []
      this.aInscrire.forEach((membre) => {
        promises.push(
          this.$apollo.mutate({
            mutation: AJOUT_INSCRIPTION,
            variables: {
              membreId: membre,
              cycleId: this.activiteInscription.idCycle
            }
          })
        )
      })
      Promise.all(promises).then((data) => {
        this.$apollo.queries.allActivites.refetch()
        this.$apollo.queries.userData.refetch()
        this.$apollo.queries.allInscriptions.refetch()
        Loading.hide()
        Toast.create.positive({
          html: 'Inscription effectuée avec succès.'
        })
      })
    },
    updateInscription: function () {
      Loading.show({
        spinner: QSpinnerGears,
        message: 'Préparation de l\'inscription',
        messageColor: 'white',
        spinnerSize: 150, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      var promises = []
      this.listeInscriptions.forEach((inscription) => {
        if (inscription.id) {
          promises.push(
            this.$apollo.mutate({
              mutation: EFFACE_LISTE_INSCRIPTION,
              variables: {
                id: inscription.id
              }
            }).then((data) => {
            })
          )
        }
      })
      Promise.all(promises).then((data) => {
        Loading.hide()
        this.$apollo.queries.allActivites.refetch()
        this.$apollo.queries.userData.refetch()
      })
    },
    creationModalInscription: function (activite) {
      this.activiteInscription = activite
      this.aInscrire = []
      this.checkboxInscription = []
      this.listeInscriptions = []
      if (this.userData.profil.length > 0) {
        this.userData.profil.forEach((membre) => {
          let listeAteliers = this.traitementInscription('membre', membre.id)
          if (listeAteliers.length > 0) this.listeInscriptions.push(listeAteliers[0])
          if (listeAteliers.length > 0) {
            this.inscriptionUpdate = true
            this.aInscrire.push(membre.id)
            this.checkboxInscription.push(this.getValeur(membre.id, listeAteliers[0].creneauId))
          }
        })
        this.modalInscription = true
      }
      else {
        Toast.create.warning({
          html: 'Personne à inscrire dans votre profil. Redirection vers votre tableau de bord.',
          onDismiss: () => {
            this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
          }
        })
      }
    },
    traitementInscription: function (leCas, mId, aId) {
      var listeFiltree = []
      switch (leCas) {
        case 'membre':
          listeFiltree = this.activiteInscription.inscriptions.filter((el) => {
            return el.membreId === mId
          })
          break
        case 'creneau':
          listeFiltree = this.activiteInscription.inscriptions.filter((el) => {
            return el.membreId === mId && el.creneauId === aId
          })
          break
      }
      return listeFiltree
    },
    btnDisableStatus: function () {
      if (this.activiteInscription.checkInscriptionCycle) {
        return false
      }
      else {
        if (this.checkboxInscription.length > 0 || this.listeInscriptions.length > 0) { return false }
        else { return true }
      }
    },
    isComplet: function (activite) {
      if (!this.estIdentifie) return true
      const complet = (activite.maxParticipants - activite.inscriptions.length) === 0
      var estDejaInscrit = false
      this.userData.profil.forEach((membre) => {
        const filtre = activite.inscriptions.filter((el) => {
          return el.membreId === membre.id
        })
        if (filtre.length > 0) estDejaInscrit = true
      })
      return complet && !estDejaInscrit
    },
    updateEstIdentifie: function () {
      this.$set(this, 'estIdentifie', this.isLoggedIn())
    },
    disableCheckbox: function (mId) {
      if (!this.modalInscription) return true
      let ajustement = 0
      this.userData.profil.forEach((membre) => {
        if (this.traitementInscription('membre', membre.id).length > 0) ajustement += 1
      })
      if ((this.activiteInscription.maxParticipants - this.activiteInscription.inscriptions.length) > 0) {
        return false
      }
      else {
        if ((ajustement > 0) && (this.aInscrire.length === 0)) return false
        return (this.aInscrire.indexOf(mId) < 0)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.bg-test
  background-color: rgba(75, 188, 196, 0.5)
</style>
