import gql from 'graphql-tag'

export const UPDATE_CRENEAU_INSCRIT = gql`
mutation updateCreneauInscrit($id: ID!, $participants: [String!]!, $nbInscrits: Int!) {updateCreneau(id: $id, participants: $participants, nbInscrits: $nbInscrits) {id}}
`
