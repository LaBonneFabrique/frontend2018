import { LocalStorage } from 'quasar'
import { SIGNUP, AUTENTIFICATION, FIND_USER_ROLE, MAJ_USER_PROFIL } from '../constants/userAuth'

export var authMixins = {
  methods: {
    isLoggedIn () {
      return !!LocalStorage.has('token')
    },
    loggedInUser () {
      return LocalStorage.get.item('idUser')
    },
    userRoles () {
      return this.$apollo.mutate({
        query: FIND_USER_ROLE,
        fetchPolicy: 'network-only',
        variables: {
          id: LocalStorage.get.item('idUser')
        }
      })
    },
    login (email, pwd) {
      return this.$apollo.mutate({
        mutation: AUTENTIFICATION,
        fetchPolicy: 'network-only',
        variables: {
          email: email,
          password: pwd
        }
      }).then((data) => {
        LocalStorage.set('idUser', data.data.authenticateUser.id)
        LocalStorage.set('token', data.data.authenticateUser.token)
      }).catch((error) => {
        console.log(error)
        throw error
      })
    },
    signup (email, pwd, nom, prenom) {
      let profil = [{
        nom,
        prenom,
        email,
        role: ['Utilisateur']
      }]
      return this.$apollo.mutate({
        mutation: SIGNUP,
        fetchPolicy: 'network-only',
        variables: {
          email: email,
          password: pwd
        }
      }).then((data) => {
        LocalStorage.set('idUser', data.data.signupUser.id)
        LocalStorage.set('token', data.data.signupUser.token)
        this.$apollo.mutate({
          mutation: MAJ_USER_PROFIL,
          variables: {
            id: data.data.signupUser.id,
            profil: profil
          }
        })
      })
    },
    logout (cb) {
      LocalStorage.remove('token')
      LocalStorage.remove('idUSer')
      if (cb) cb()
    }
  }
}
