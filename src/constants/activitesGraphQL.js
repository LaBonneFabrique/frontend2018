import gql from 'graphql-tag'

export const QUERY_ALL_ACTIVITES = gql`
query listeActivites {
  allActivites {
    id
    titreActivite
    description
    checkInscription
    checkInscriptionCycle
    illustration
    publie
    creneaux {
      id
      dateDebut
      dateFin
      idGoogleEvent
      maxParticipants
    }
    prix {
      id
    }
    inscriptions {
      id
      membreId
      cycleId
    }
    nbMaxTotalParticipants
  }
}
`

export const QUERY_ALL_ACTIVITES_ASC = gql`
query listeActivites {
  allActivites(orderBy: dateDebut_ASC) {
    id
    idCycle
    titreActivite
    description
    checkInscription
    lieuActivite
    illustration
    publie
    prix
    dateDebut
    dateFin
    idGoogleEvent
    sequenceEvent
    maxParticipants
    inscriptions {
      id
      membreId
      cycleId
    }
  }
}
`
