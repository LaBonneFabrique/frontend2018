import { LocalStorage } from 'quasar'

export default {
  loggedIn () {
    return !!LocalStorage.has('token')
  },
  loggedInUser () {
    return LocalStorage.get.item('idUser')
  },
  hasLoggedUser () {
    return !!LocalStorage.has('idUser')
  }
}
