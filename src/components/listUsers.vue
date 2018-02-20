<template>
  <div>
  <q-data-table
  :data="listeUsers"
  :config="config"
  :columns="columns">
    
    <template slot='col-actions' slot-scope='cell'>
    <q-btn flat small inverted @click="affiche(cell.row)">
      <q-icon name="fa-edit" />
    </q-btn>
</template>
  
  </q-data-table>
  </div>
</template>

<script>
import {LISTE_USERS} from '../constants/usersGraphQL'

import {
  QDataTable,
  QBtn,
  QIcon
} from 'quasar'

export default {
  components: {
    QDataTable,
    QBtn,
    QIcon
  },
  data () {
    return {
      listeUsers: [],
      loadingUsers: 0,
      config: {
        title: 'Liste des adhérents',
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: '40px',
        responsive: true,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        labels: {
          columns: 'Colonnes',
          allCols: 'Toutes les colonnes',
          rows: 'Lignes',
          selected: {
            singular: 'adhérent sélectionné.',
            plural: 'adhérents sélectionnés.'
          },
          clear: 'vider la sélection',
          search: 'Recherche',
          all: 'Tout'
        }
      },
      columns: [{
        label: 'id',
        field: 'id',
        width: '80px'
      },
      {
        label: 'Nom',
        field: 'nom',
        width: '60px',
        filter: true,
        sort: false
      },
      {
        label: 'Prénom',
        field: 'prenom',
        width: '60px',
        filter: true,
        sort: false
      },
      {
        label: 'Email',
        field: 'email',
        width: '80px',
        filter: true,
        sort: false
      },
      {
        label: 'Email principal',
        field: 'mainEmail',
        width: '80px',
        filter: true,
        sort: false
      },
      {
        label: 'Actions',
        field: 'actions',
        width: '60px'
      }
      ]
    }
  },
  apollo: {
    listeUsers: {
      query: LISTE_USERS,
      fetchPolicy: 'network-only',
      loadingKey: 'loadingUsers',
      update (data) {
        console.log(data.allProfils)
        return data.allProfils.map(row => {
          if (row.role.indexOf('Secondaire') < 0) {
            let isAdmin = false
            if (row.role.indexOf('Admin') >= 0) isAdmin = true
            return {
              id: row.id,
              nom: row.nom,
              prenom: row.prenom,
              email: row.email,
              mainEmail: row.user.email,
              isAdmin: isAdmin
            }
          }
          else {
            return {
              id: row.id,
              nom: row.nom,
              prenom: row.prenom,
              email: row.email,
              mainEmail: row.user.email
            }
          }
        })
      }
    }
  },
  methods: {
    affiche: function (data) {
      console.log(data)
    }
  }
}
</script>

<style>
</style>
