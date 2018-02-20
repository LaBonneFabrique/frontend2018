<template>
  <div class="formDate">
    <q-btn color="primary" flat @click="openChoixDate = true">Ajouter des dates</q-btn>
    <q-modal v-model="openChoixDate" minimized :content-css="{padding: '20px'}">
  <q-field
    icon="fa-calendar"
    label="Choisir la ou les dates"
    /> 
    <q-inline-datetime color="amber" v-model="datePickup" monday-first type="date" :month-names="moisFR" :day-names="joursFR" @change="addDate" :min="aujourdhui"/>
    <br />
    <q-btn v-if="afficheBtn" color="amber" flat @click="forceAjout()">Ajouter cette sélection</q-btn>
      <div class="group">
      <q-chip v-for="(date, index) in listeDates" :key="toTimeStamp(date)" closable color="primary" @close="removeDate(index)">
        {{toDateReadable(date)}}
      </q-chip>
      </div>
      <div class="row justify-center" style="margin-top: 10px">
      <q-btn color="primary" flat @click="openChoixDate = false" clas="col-m-2">Valider</q-btn>
      </div>
</q-modal>
  </div>
</template>

<script>
import { QField, QInlineDatetime, QChip, QBtn, QModal, date } from 'quasar'
import { DAYNAMES, MONTHNAMES } from '../constants/date-fr'

const today = new Date()

export default {
  components: {
    QField,
    QInlineDatetime,
    QChip,
    QBtn,
    QModal
  },
  props: ['propDates'],
  data () {
    return {
      datePickup: today,
      joursFR: DAYNAMES,
      moisFR: MONTHNAMES,
      listeDates: this.propDates,
      aujourdhui: today,
      lastDatePickup: today,
      afficheBtn: false,
      openChoixDate: false
    }
  },
  mounted: function () {
    this.listeDates = this.propDates
  },
  methods: {
    removeDate: function (index) {
      this.listeDates.splice(index, 1)
      this.$emit('listeDates', this.listeDates)
    },
    addDate: function () {
      let unit = 'months'
      let diff = date.getDateDiff(this.datePickup, this.lastDatePickup, unit)
      this.lastDatePickup = this.datePickup
      if (diff !== 1 && diff !== -1) {
        this.listeDates.push(this.datePickup)
        this.$emit('listeDates', this.listeDates)
        this.afficheBtn = false
      }
      else {
        this.afficheBtn = true
      }
    },
    toTimeStamp: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'X').toString() + Math.random().toString(2)
    },
    toDateReadable: function (dateToTransform) {
      return date.formatDate(dateToTransform, 'dddd DD MMMM', {dayNames: DAYNAMES, monthNames: MONTHNAMES})
    },
    forceAjout: function () {
      this.lastDatePickup = this.datePickup
      this.listeDates.push(this.datePickup)
      this.afficheBtn = false
      this.$emit('listeDates', this.listeDates)
    }
  }
}
</script>

<style>
.formDate {
    width: 100%;
    max-width: 400px;
  }
</style>
