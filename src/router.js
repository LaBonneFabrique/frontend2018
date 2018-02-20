import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './utils/authRouter'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: '/',
      component: load('layout'),
      children: [
        {
          path: '/',
          name: 'accueil',
          component: load('index')
        },
        {
          path: '/dashboard/:userId',
          name: 'Tableau de bord',
          component: load('dashboard'),
          props: true,
          beforeEnter: requireAuth
        },
        {
          path: '/nouvelAtelier',
          component: load('formulaireActivite'),
          name: 'ajoutActivite'
        },
        {
          path: '/modifierAtelier/:idAtelier',
          props: true,
          component: load('formulaireActivite')
        },
        {
          path: '/dupliquerAtelier/:idAtelier/:dupliquer',
          props: true,
          component: load('formulaireActivite')
        },
        {
          path: '/listeAdherents',
          name: 'listeUsers',
          component: load('listUsers')
        }
      ]
    },

    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})

function requireAuth (to, from, next) {
  if (!auth.loggedIn() || !auth.hasLoggedUser() || to.params.userId !== auth.loggedInUser()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  else {
    next()
  }
}
