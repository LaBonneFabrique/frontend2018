<template>
  <div class='formActivite'>
   <q-input
    v-model='dataEvent.titreActivite'
    placeholder='Une nouvelle activité'
    class="titre"
    />
       <div class='row'>
      <div class="col-sm-5">
      <q-select
          stack-label='Espace concerné'
          color='light-green-8'
          inverted
          separator
          v-model='dataEvent.section'
          :options='listeSection'
          />
      <q-input v-model='dataEvent.lieuActivite' stack-label = 'Lieu' placeholder='La Bonne Fabrique'/>
        <q-btn
          @click="modalIllustration = true"
          class="col-8 offset-2"
          flat
          color="primary"
          >
          choisir une illustration
        </q-btn>
          <img
            height="150"
            width="150"
            :src="trouverImage(dataEvent.illustration)"
            class="col-6 offset-3"
            style="border: 1px solid grey"
            @click="modalIllustration = true"
            />
        </div>
      <div class="col-sm-6 offset-sm-1">
        <q-field
          icon="fa-file-text-o"
          label="Description"
          />
        <q-input
          type='textarea'
          v-model='dataEvent.description'
          placeholder='...'
          :min-rows='14'
          style="margin-left: 40px;"
          />
      </div>
    </div>
    
    <q-field
      icon='fa-eur'
      label="Prix"
      />
      <q-btn
        flat
        icon="fa-plus"
        color="primary"
        style="margin-left: 40px"
        @click="ajoutPrix"
        class="col-md-3 col-xs-7"
        >
        Ajouter un prix
      </q-btn>
      <div class="row">
        <div v-for="(pri, index) in dataEvent.prix"  class="col-sm-5 liste">
          <div class="row">
            <q-field
                icon="fa-eur"
                :label-width="1"
                class="col-8"
                >
            <q-input v-model='pri.prix' type="number" placeholder='0' class="col-sm-1" />
            </q-field>
            <q-btn flat color="amber-14" class="col-2 offset-2" @click="removePrix(index)">
                <q-tooltip color="amber-8">
                  Effacer ce prix
              </q-tooltip>
                <q-icon name="fa-trash" />
              </q-btn>
            </div>
            <q-field
                icon="fa-pencil"
                :label-width="1"
                >
            <q-input v-model='pri.description' placeholder='Description' class="col-sm-5" />
            </q-field>
            <q-field
                label="QF ?"
                :label-width="2"
                >
            <q-checkbox v-model='pri.qf' class="col-sm-1" />
            </q-field>
          </div>
      </div>
          <q-field
            icon="fa-clock-o"
            label="Dates, horaires et nombre de participants"
            :label-width="11"
            />
            <div class="row" style="margin-bottom: 10px;">
            <q-btn
              flat
              icon="fa-plus"
              color="primary"
              @click="ajoutHoraire"
              class="col-md-4 col-xs-7"
              >
                Ajouter un horaire
              </q-btn>
              <q-checkbox v-model='dataEvent.checkInscription' label="Sur Inscription ?" style="margin-top: 5px" class="col-md-3 col-xs-5 offset-1"/>
              <!-- <q-checkbox v-if="dataEvent.checkInscription" v-model='dataEvent.checkInscriptionCycle' label="Sur tout le cycle ?" style="margin-top: 5px" class="col-md-3 col-xs-5 offset-1"/> -->
              </div>
            <div class="row">
            <div  v-for="(creneau, index) in dataEvent.creneaux" class="col-sm-5 liste">
            <div class="row">
              <q-field
                icon="fa-calendar"
                :label-width="1"
                class="col-8"
                >
                <q-datetime
                    v-model="creneau.date"
                    type="date"
                    format24h
                    float-label="Date"
                    format="DD MMMM YYYY"
                    :month-names="monthNames"
                    :day-names="dayNames"
                    monday-first
                    ok-label="valider"
                    cancel-label="annuler"
                    clear-label="effacer"
                    :min="aujourdhui"
                    />
              </q-field>
              <q-btn flat color="amber-14" class="col-2 offset-2" @click="removeHoraire(index)" v-if = "boutonPoubelleCreneau(index)">
                <q-tooltip color="amber-8">
                  Effacer cette date {{index}}
              </q-tooltip>
                <q-icon name="fa-trash" />
              </q-btn>
            </div>
              <q-field
                icon="fa-clock-o"
                :label-width="1"
                >
                <q-range
                    v-model="creneau.horaire"
                    :min="9"
                    :max="18"
                    :step="0.5"
                    snap
                    markers
                    label
                    :left-label-value="afficheHeure(creneau.horaire.min)"
                    :right-label-value="afficheHeure(creneau.horaire.max)"
                  />
              </q-field>
              <div class="row" v-if="dataEvent.checkInscription">
              <q-field
                icon="fa-users"
                :label-width="1"
                class="col-md-4"
              >
                <q-input v-model="creneau.maxParticipants" type="number" />
              </q-field>

              </div>
            </div>
            </div>
        <q-field
          icon='fa-check-square-o'
          label='Validation'
         />
         <div class="row>"
    <q-btn
          icon="fa-times"
          color="warning"
          class="col-sm-3"
          style="margin-top: 0px; padding: 6px"
          @click="$router.push({name: 'listeActivites'})"
          >
          Annuler
        </q-btn>
        <q-btn
          icon="fa-floppy-o"
          color="secondary"
          class="col-sm-3 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="sauvegardeActivite(false)"
          >
          Enregistrer en brouillon
        </q-btn>
        <q-btn
          v-if="!idAtelier"
          icon="fa-pencil-square-o"
          color="primary"
          class="col-sm-4 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="sauvegardeActivite(true)"
          >
          Créer et publier
        </q-btn>
        <q-btn
          v-if="!!idAtelier"
          icon="fa-pencil-square-o"
          color="primary"
          class="col-sm-4 offset-sm-1"
          style="margin-top: 0px; padding: 6px"
          @click="sauvegardeActivite(true)"
          >
          Modifier et publier
        </q-btn>
    <!-- modals -->
    <q-modal
      v-model="modalIllustration"
      :content-css= "{padding: '10px'}"
      >
         <q-field
        icon='fa-camera-retro'
        label='Illustration'
        :label-width="1"
       >
     <q-btn flat color="faded" icon="fa-undo" style="margin-left: 30px; margin-top: -5px;" @click="resetChoixIllu"></q-btn>
    </q-field>
    <div class="row" style="margin-left: 30px;">
    <div v-for="illu in listeDesIllu">
      <img height="150" width="150" :src="illu.image" />
      <div class="row justify-end">
        <q-radio
          v-model="dataEvent.illustration"
          :val="illu.id"
          unchecked-icon="fa-square-o"
          checked-icon="fa-check-square-o"
        />
        <q-btn flat color="warning" @click="effaceImageDialogue(illu.id, illu.imageId)">
          <q-icon name="fa-times" />
        </q-btn>
      </div>
    </div>
      <div v-if="loadIllu" class="row items-center justify-center" id='illuProcessing'>
        <q-spinner-gears size="30px" color="primary"></q-spinner-gears>
        <div class="justify-center messageProcess">{{message}}</div>
    </div>
    <vue-dropzone
      ref='illustrationDropzone'
      id='illuDropzone'
      :options='dropzoneOptions'
      @vdropzone-sending='envoieImage'
      @vdropzone-success='envoieSucces'
      @vdropzone-upload-progress='envoieProgres'
      @vdropzone-processing='processFile'
      />
      </div>
      <q-btn
        flat
        color="primary"
        @click="modalIllustration = false"
      >
        Valider
      </q-btn>
    </q-modal>
  </div>
</template>

<script>
import choixDates from './choixDates'
import {
  QField,
  QInput,
  QSelect,
  QCheckbox,
  QSpinnerGears,
  QRadio,
  QBtn,
  QIcon,
  Toast,
  Dialog,
  QChip,
  QDatetime,
  QRange,
  QItem,
  QItemSide,
  QItemMain,
  QTooltip,
  QModal,
  Loading,
  date
} from 'quasar'
import {ADD_EVENT, UPDATE_EVENT, DELETE_EVENT} from '../constants/googleAgendaGraphQL'
import { LISTE_ESPACEBF } from '../constants/listeEnums'
import { GET_LISTE_ILLU_FILTRE_ESPACE, ADD_LISTE_ILLU, DELETE_ILLU_GRAPHQL, DELETE_ILLU } from '../constants/illustrationsGraphQL'
import { ADD_ACTIVITE, ADD_ACTIVITE_BROUILLON, QUERY_ACTIVITE_BY_IDCYCLE, UPDATE_ACTIVITE, EFFACE_ACTIVITE } from '../constants/activitesGraphQL-2'
import { DAYNAMES, MONTHNAMESABRV } from '../constants/date-fr'

import cloudinary from 'cloudinary-core'
var cl = new cloudinary.Cloudinary({cloud_name: 'la-bonne-fabrique', secure: true})

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'

let newDate = Date.now()

export default {
  components: {
    choixDates,
    QField,
    QInput,
    QSelect,
    QCheckbox,
    vueDropzone: vue2Dropzone,
    QSpinnerGears,
    QRadio,
    QBtn,
    QIcon,
    QChip,
    QDatetime,
    QRange,
    QItem,
    QItemSide,
    QItemMain,
    QTooltip,
    QModal
  },
  props: {
    idAtelier: String,
    dupliquer: Boolean
  },
  data () {
    return {
      modalIllustration: false,
      dataEvent: {},
      listeDesIllu: [],
      dropzoneOptions: {
        autoProcessQueue: true,
        uploadMultiple: false,
        acceptedFiles: '.jpg,.png,.jpeg,.gif',
        parallelUploads: 10,
        url: 'https://api.cloudinary.com/v1_1/la-bonne-fabrique/image/upload',
        dictDefaultMessage: '<i class=\'fa fa-plus fa-4x\'></i>',
        previewsContainer: false,
        resizeWidth: 1920,
        resizeHeight: 1920,
        resizeMethod: 'contain',
        resizeQuality: 0.9
      },
      loadIllu: 0,
      message: 'rien',
      selectionIllu: '',
      efface: false,
      listeSection: [],
      monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      rangeValues: {
        min: 10,
        max: 12
      },
      aujourdhui: newDate
    }
  },
  apollo: {
    allEnums: {
      query: LISTE_ESPACEBF,
      update (data) {
        let listeEnum = data.__type.enumValues
        this.listeSection = []
        listeEnum.forEach((valeurEnum) => {
          this.listeSection.push({label: valeurEnum.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(L)(e)/g, '$1\'$2'), value: valeurEnum.name})
        })
      }
    },
    allActivitesIllustrations: {
      query: GET_LISTE_ILLU_FILTRE_ESPACE,
      variables () {
        return {
          espace: this.dataEvent.section
        }
      },
      loadingKey: 'loadIllu',
      watchLoading (isLoading, countModifier) {
        this.loadIllu = isLoading
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
      update (data) {
        this.listeDesIllu = []
        data.allActivitesIllustrations.forEach((image) => {
          this.listeDesIllu.push({id: image.id, imageId: image.idImage, image: cl.url(image.idImage + '.' + image.format, { width: 150, height: 150, crop: 'fill', gravity: 'auto' }), checked: false, efface: false})
        })
      }
    },
    getActivite: {
      query: QUERY_ACTIVITE_BY_IDCYCLE,
      variables () {
        return {
          idCycle: this.idAtelier
        }
      },
      fetchPolicy: 'network-only',
      skip () {
        this.dataEvent = {
          titreActivite: '',
          section: 'LaBonneFabrique',
          checkInscription: false,
          checkInscriptionCycle: true,
          lieuActivite: 'La Bonne Fabrique',
          description: '',
          creneaux: [{date: newDate, horaire: {min: 14.5, max: 17.0}, dateDebut: newDate, dateFin: newDate, maxParticipants: 8}],
          illustration: '',
          prix: [{description: 'Adhérents', prix: 10, qf: true}, {description: 'Non adhérents', prix: 15, qf: false}],
          publie: false
        }
        return !this.idAtelier
      },
      update (data) {
        Object.assign(this.dataEvent, data.allActivites[0])
        this.dataEvent.creneaux = []
        data.allActivites.forEach((creneau) => {
          let dateCreneau = creneau.dateDebut
          let horaire = {
            min: this.heureToDecimal(Number(date.formatDate(creneau.dateDebut, 'H')), Number(date.formatDate(creneau.dateDebut, 'm'))),
            max: this.heureToDecimal(Number(date.formatDate(creneau.dateFin, 'H')), Number(date.formatDate(creneau.dateFin, 'm')))
          }
          console.log('getActivite creneau', creneau)
          this.dataEvent.creneaux.push({
            id: creneau.id,
            date: dateCreneau,
            horaire: horaire,
            dateDebut: creneau.dateDebut,
            dateFin: creneau.dateFin,
            maxParticipants: creneau.maxParticipants,
            idGoogleEvent: creneau.idGoogleEvent,
            sequenceEvent: creneau.sequenceEvent
          })
        })
        this.dataEvent.prix = []
        data.allActivites[0].prix.forEach((prix) => {
          this.dataEvent.prix.push({id: prix.id, description: prix.description, prix: prix.prix, qf: prix.qf})
        })
        // this.dataEvent = data.allActivites[0]
      }
    }
  },
  methods: {
    resetChoixIllu: function () {
      this.dataEvent.illustration = ''
    },
    removeHoraire: function (index) {
      this.effaceEventGoogleCalendar(this.dataEvent.creneaux[index].idGoogleEvent)
      this.$apollo.mutate({
        mutation: EFFACE_ACTIVITE,
        variables: {
          id: this.dataEvent.creneaux[index].id
        }
      }).then((data) => {
        this.dataEvent.creneaux.splice(index, 1)
      }).catch((error) => console.log(error))
    },
    ajoutHoraire: function () {
      this.dataEvent.creneaux.push({date: newDate, horaire: {min: 14.5, max: 17.0}, maxParticipants: 8})
    },
    removePrix: function (index) {
      this.dataEvent.prix.splice(index, 1)
    },
    ajoutPrix: function () {
      this.dataEvent.prix.push({description: 'Nouveau prix', prix: 15, qf: false})
    },
    toTimeStamp: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'X').toString() + Math.random().toString(2)
    },
    toDateReadable: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'dddd DD MMM', {dayNames: DAYNAMES, monthNames: MONTHNAMESABRV})
    },
    envoieImage: (file, xhr, formData) => {
      formData.append('file', file)
      formData.append('upload_preset', 'howigptf') // Replace the preset name with your own
      formData.append('api_key', '355229151489945') // Replace API key with your own Cloudinary key
      formData.append('timestamp', (Date.now() / 1000) | 0)
    },
    envoieSucces (file, response) {
      this.message = 'Succès !'
      this.$apollo.mutate({
        mutation: ADD_LISTE_ILLU,
        variables: {
          idImage: response.public_id,
          format: response.format,
          espace: this.dataEvent.section
        },
        updateQueries: {
        }
      }).then((data) => {
        this.$apollo.queries.allActivitesIllustrations.refetch()
        this.loadIllu = false
      }).catch((error) => {
        // Error
        console.error(error)
      })
    },
    envoieProgres (file, progress, bytesSent) {
      this.message = 'Téléversement ' + progress.toFixed(2) + ' %'
    },
    processFile (file) {
      this.loadIllu = true
      this.message = 'Réduction à une taille raisonnable si besoin...'
    },
    effaceImage (id, imageId) {
      this.$apollo.query({
        query: DELETE_ILLU,
        variables: {
          imageId
        }
      }).then((data) => {
        this.$apollo.mutate({
          mutation: DELETE_ILLU_GRAPHQL,
          variables: {
            id
          }
        }).then((data) => {
          this.$apollo.queries.allActivitesIllustrations.refetch()
          Toast.create.positive({
            html: 'L\'image a été effacée avec succès'
          })
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    effaceImageDialogue (id, imageId) {
      Dialog.create({
        title: 'Confirmer',
        message: 'Effacer cette image ?',
        buttons: [
          'Annuler',
          {
            label: 'Effacer',
            handler: () => {
              this.effaceImage(id, imageId)
            }
          }
        ]
      })
    },
    async sauvegardeActivite (publie) {
      console.log('CREATE')
      let promises = []
      let idCycle = this.generateId()
      // let oldPublie = this.dataEvent.publie
      if (publie) {
        Loading.show({
          spinner: QSpinnerGears,
          message: 'Mise à jour du calendrier Google',
          messageColor: 'white',
          spinnerSize: 150, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
        await this.addActiviteToGCalendar('confirmed')
        Loading.show({
          spinner: QSpinnerGears,
          message: 'Mise à jour de la base',
          messageColor: 'white',
          spinnerSize: 150, // in pixels
          spinnerColor: 'white',
          customClass: 'bg-test'
        })
      }
      if (!publie) {
        // await this.effaceEventGoogleCalendar(creneau.idGoogleEvent)
        await this.addActiviteToGCalendar('cancelled')
        // this.dataEvent.creneaux[index].idGoogleEvent = 'delete'
      }
      for (let creneau of this.dataEvent.creneaux) {
        if (creneau.id && !this.dupliquer) {
          promises.push(
            this.$apollo.mutate({
              mutation: UPDATE_ACTIVITE,
              variables: {
                id: creneau.id,
                titreActivite: this.dataEvent.titreActivite || 'Grand titre',
                section: this.dataEvent.section,
                checkInscription: this.dataEvent.checkInscription,
                checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
                lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
                description: this.dataEvent.description || 'Description de l\'atelier ou de l\'évènement',
                illustration: this.dataEvent.illustration || 'cjdokry9w5u7d0169dy7bi61n',
                prix: this.dataEvent.prix,
                publie: publie,
                idCycle: idCycle,
                dateDebut: this.ajusteDate(creneau.date, creneau.horaire.min),
                dateFin: this.ajusteDate(creneau.date, creneau.horaire.max),
                maxParticipants: creneau.maxParticipants,
                idGoogleEvent: creneau.idGoogleEvent,
                sequenceEvent: creneau.sequenceEvent
              }
            })
          )
        }
        else {
          console.log('pas id ou dupliquer', creneau)
          if (creneau.idGoogleEvent) {
            promises.push(
              this.$apollo.mutate({
                mutation: ADD_ACTIVITE,
                variables: {
                  titreActivite: this.dataEvent.titreActivite || 'Grand titre',
                  section: this.dataEvent.section,
                  checkInscription: this.dataEvent.checkInscription,
                  checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
                  lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
                  description: this.dataEvent.description || 'Description de l\'atelier ou de l\'évènement',
                  illustration: this.dataEvent.illustration || 'cjdokry9w5u7d0169dy7bi61n',
                  prix: this.dataEvent.prix,
                  publie: publie,
                  idCycle: idCycle,
                  dateDebut: this.ajusteDate(creneau.date, creneau.horaire.min),
                  dateFin: this.ajusteDate(creneau.date, creneau.horaire.max),
                  maxParticipants: creneau.maxParticipants,
                  idGoogleEvent: creneau.idGoogleEvent,
                  sequenceEvent: creneau.sequenceEvent || 0
                }
              })
            )
          }
          else {
            console.log('brouillon !', creneau)
            promises.push(
              this.$apollo.mutate({
                mutation: ADD_ACTIVITE_BROUILLON,
                variables: {
                  titreActivite: this.dataEvent.titreActivite || 'Grand titre',
                  section: this.dataEvent.section,
                  checkInscription: this.dataEvent.checkInscription,
                  checkInscriptionCycle: this.dataEvent.checkInscriptionCycle,
                  lieuActivite: this.dataEvent.lieuActivite || 'La Bonne Fabrique',
                  description: this.dataEvent.description || 'Description de l\'atelier ou de l\'évènement',
                  illustration: this.dataEvent.illustration || 'cjdokry9w5u7d0169dy7bi61n',
                  prix: this.dataEvent.prix,
                  publie: publie,
                  idCycle: idCycle,
                  dateDebut: this.ajusteDate(creneau.date, creneau.horaire.min),
                  dateFin: this.ajusteDate(creneau.date, creneau.horaire.max),
                  maxParticipants: creneau.maxParticipants
                }
              })
            )
          }
        }
      }
      Promise.all(promises).then((data) => {
        Loading.hide()
        this.dialogue('Sauvegarde réussie.', true, 'Succès')
      }).catch((error) => console.log(error))
    },
    dialogue: function (texte, flagRetour, type) {
      Loading.hide()
      Toast.create({
        title: type,
        html: texte,
        icon: 'fa-check-o',
        color: 'white',
        bgColor: 'teal',
        timeout: 1000,
        position: 'top',
        onDismiss: () => {
          if (flagRetour) {
            Loading.hide()
            this.$router.push({name: 'listeActivites'})
          }
        }
      })
    },
    afficheHeure: function (nombre) {
      let heureMinute = this.decimalToHeure(nombre)
      heureMinute.minutes = heureMinute.minutes / 10
      return heureMinute.heures.toString() + 'h' + heureMinute.minutes.toString() + '0'
    },
    decimalToHeure: function (nombre) {
      let minutes = 0
      let heure = Math.floor(nombre)
      if ((nombre - Math.floor(nombre)) > 0) {
        minutes = 30
      }
      else {
        minutes = 0
      }
      return {heures: heure, minutes: minutes}
    },
    heureToDecimal: function (heures, minutes) {
      return heures + minutes * 0.5 / 30
    },
    ajusteDate: function (dateTemp, ajustement) {
      let heuresMinutes = this.decimalToHeure(ajustement)
      return date.adjustDate(dateTemp, {hours: heuresMinutes.heures, minutes: heuresMinutes.minutes, seconds: 0})
    },
    addActiviteToGCalendar: function (status) {
      var promises = []
      this.dataEvent.creneaux.forEach((creneau, index) => {
        let newSequence = 1
        if (creneau.sequenceEvent) {
          newSequence = creneau.sequenceEvent + 1
        }
        console.log('sequence', newSequence)
        if (creneau.idGoogleEvent) {
          console.log('update google calendar')
          console.log(creneau.idGoogleEvent)
          const eventDataGoogle = {
            summary: this.dataEvent.titreActivite,
            location: this.dataEvent.lieuActivite,
            description: this.dataEvent.description,
            start: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.min)},
            end: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.max)},
            status: status,
            sequence: newSequence
          }
          promises.push(
            this.$apollo.query({
              query: UPDATE_EVENT,
              variables: {
                eventId: creneau.idGoogleEvent,
                dataEvent: eventDataGoogle
              }
            }).then((data) => {
              console.log('update ok', data.data)
              this.dataEvent.creneaux[index].sequenceEvent = data.data.updateEvent.sequenceEvent
            }).catch((error) => console.log('erreur update', error))
          )
        }
        else {
          const eventDataGoogle = {
            summary: this.dataEvent.titreActivite,
            location: this.dataEvent.lieuActivite,
            description: this.dataEvent.description,
            start: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.min)},
            end: {dateTime: this.ajusteDate(creneau.date, creneau.horaire.max)},
            status: status
          }
          console.log('ajout google calendar')
          promises.push(
            this.$apollo.query({
              query: ADD_EVENT,
              variables: {
                dataEvent: eventDataGoogle
              }
            }).then((data) => {
              console.log('succès', data.data)
              this.dataEvent.creneaux[index].idGoogleEvent = data.data.addEvent.idEvent
              this.dataEvent.creneaux[index].sequenceEvent = data.data.addEvent.sequenceEvent
            }).catch((error) => console.log('erreur ajout google calendar', error))
          )
        }
      })
      return Promise.all(promises)
    },
    effaceEventGoogleCalendar: function (idGoogleEvent) {
      this.$apollo.query({
        query: DELETE_EVENT,
        variables: {
          eventId: idGoogleEvent
        }
      }).then((data) => {
        console.log('success delete from google calendar')
      }).catch((error) => {
        console.log(error)
      })
    },
    generateId: function () {
      // desired length of Id
      var idStrLen = 32
      // always start with a letter -- base 36 makes for a nice shortcut
      var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36)
      // add a timestamp in milliseconds (base 36 again) as the base
      idStr += (new Date()).getTime().toString(36)
      // similar to above, complete the Id using random, alphanumeric characters
      do {
        idStr += (Math.floor((Math.random() * 35))).toString(36)
      } while (idStr.length < idStrLen)
      return (idStr)
    },
    trouverImage: function (idImage) {
      var retour = this.listeDesIllu.find(item => item.id === idImage)
      if (retour) {
        return retour.image
      }
      else {
        return 'https://res.cloudinary.com/la-bonne-fabrique/image/upload/c_fill,g_auto,h_150,w_150/logoLBFmoyen_p1zcu0.png'
      }
    },
    boutonPoubelleCreneau: function (index) {
      return index > 0
    }
  }
}
</script>

<style lang="stylus">
@import '~variables';

  .formActivite {
    width: 100%;
    max-width: 800px;
  }

  #illuDropzone {
      border-radius: 10%;
      border-style: dashed;
      width: 150px !important;
      height: 150px;
      margin-left: 10px;
      margin-top: 5px;
    }
  
  #illuProcessing {
      width: 150px;
      height: 150px;
      margin-left: 10px;
      margin-top: 5px;
  }
  
  .messageProcess {
    font-size: x-small;
  }
  
  .liste 
    border: 1px solid $blue-grey-3;
    margin-left: 20px
    margin-bottom: 20px
    padding: 10px
  
  .bg-test
    background-color: rgba(75, 188, 196, 0.5)
  
  .titre
    font-size: x-large
    font-variant: small-caps 
    padding: 10px
</style>
