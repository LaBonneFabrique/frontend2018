import gql from 'graphql-tag'

export const AJOUT_INSCRIPTION = gql`
mutation ajoutInscription($cycleId: String!, $membreId: String!) {
    createInscription(membreId: $membreId, cycleId: $cycleId){id}
}
`

export const LISTE_INSCRIPTION = gql`
query listeInscription($membreId: String!) {allInscriptions(filter: {membreId: $membreId}) {
    id
    membreId
    cycleId
}}
`

export const LISTE_INSCRIPTION_CYCLEID = gql`
query listeInscription($cycleId: String!) {allInscriptions(filter: {cycleId: $cycleId}) {
    id
    membreId
    cycleId
}}
`

export const LES_INSCRIPTIONS = gql`
query lesInscriptions {allInscriptions {
   id
    membreId
    cycleId
}}
`

export const EFFACE_LISTE_INSCRIPTION = gql`
mutation effaceInscriptions($id: ID!) {deleteInscription(id: $id) {id}}
`

/*
export const CONNECT_INSCRIPTION_ACTIVITE = gql`
mutation connexionInscriptionConnexion($activiteId: ID!, $inscriptionId: ID!) {
    addToInscriptionsActivites(activiteActiviteId: $activiteId, inscriptionsInscriptionId: $inscriptionId) {
        activiteActivite {
            id
        }
        inscriptionsInscription {
            id
        }
    }
}
`

export const LISTE_INSCRIPTION = gql`
query listeInscription($membreId: String!) {allInscriptions(filter: {membreId: $membreId}) {
    id
    membreId
    creneauId
}}
`

export const EFFACE_LISTE_INSCRIPTION = gql`
mutation effaceInscriptions($id: ID!) {deleteInscription(id: $id) {id}}
`

export const LISTE_INSCRIPTION_BY_ACTIVITES = gql`
query listeInscription($creneauId: String!) {allInscriptions(filter: {creneauId: $creneauId}) {
    id
    membreId
    creneauId
}}
`

export const LES_INSCRIPTIONS = gql`
query lesInscriptions {allInscriptions {
   id
    membreId
    creneauId
}}
`

*/
