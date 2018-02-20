import gql from 'graphql-tag'

export const ADD_ACTIVITE = gql`
mutation ajoutActivite(
  $titreActivite: String!,
  $section: String!,
  $checkInscription: Boolean!,
  $checkInscriptionCycle: Boolean,
  $lieuActivite: String!,
  $description: String!,
  $illustration: String!,
  $prix: [Json!]!,
  $publie: Boolean!,
  $idCycle: String!,
  $dateDebut: DateTime!,
  $dateFin: DateTime!,
  $maxParticipants: Int!,
  $idGoogleEvent: String!,
  $sequenceEvent: Int!
) 
{
  createActivite(
    titreActivite: $titreActivite,
    section: $section,
    checkInscription: $checkInscription,
    checkInscriptionCycle: $checkInscriptionCycle,
    lieuActivite: $lieuActivite,
    description: $description,
    illustration: $illustration,
    prix: $prix,
    publie: $publie,
    idCycle: $idCycle,
    dateDebut: $dateDebut,
    dateFin: $dateFin,
    maxParticipants: $maxParticipants,
    idGoogleEvent: $idGoogleEvent,
    sequenceEvent: $sequenceEvent
  ) {
    id
  }
}
`

export const ADD_ACTIVITE_BROUILLON = gql`
mutation ajoutActivite(
  $titreActivite: String!,
  $section: String!,
  $checkInscription: Boolean!,
  $checkInscriptionCycle: Boolean,
  $lieuActivite: String!,
  $description: String!,
  $illustration: String!,
  $prix: [Json!]!,
  $publie: Boolean!,
  $idCycle: String!,
  $dateDebut: DateTime!,
  $dateFin: DateTime!,
  $maxParticipants: Int!
) 
{
  createActivite(
    titreActivite: $titreActivite,
    section: $section,
    checkInscription: $checkInscription,
    checkInscriptionCycle: $checkInscriptionCycle,
    lieuActivite: $lieuActivite,
    description: $description,
    illustration: $illustration,
    prix: $prix,
    publie: $publie,
    idCycle: $idCycle,
    dateDebut: $dateDebut,
    dateFin: $dateFin,
    maxParticipants: $maxParticipants
  ) {
    id
  }
}
`

export const QUERY_ALL_ACTIVITES = gql`
query listeActivites {
  allActivites {
    id
    idCycle
    titreActivite
    description
    lieuActivite
    illustration
    publie
    prix
    dateDebut
    dateFin
    idGoogleEvent
    sequenceEvent
  }
}
`

export const QUERY_ACTIVITE_BY_IDCYCLE = gql`
query singleActivite($idCycle: String!) {
  allActivites(filter: {idCycle: $idCycle}) {
    id
    idCycle
    titreActivite
    section
    checkInscription
    checkInscriptionCycle
    lieuActivite
    description
    illustration
    prix
    publie
    dateDebut
    dateFin
    idGoogleEvent
    sequenceEvent
    maxParticipants
  }
}
`

export const UPDATE_ACTIVITE = gql`
mutation modifieActivite(
  $id: ID!,
  $titreActivite: String!,
  $section: String!,
  $checkInscription: Boolean!,
  $checkInscriptionCycle: Boolean,
  $lieuActivite: String!,
  $description: String!,
  $illustration: String!,
  $prix: [Json!]!,
  $publie: Boolean!,
  $idCycle: String!,
  $dateDebut: DateTime!,
  $dateFin: DateTime!,
  $maxParticipants: Int!,
  $idGoogleEvent: String!,
  $sequenceEvent: Int!
  )
  {
    updateActivite(
      id: $id,
      titreActivite: $titreActivite,
      section: $section,
      checkInscription: $checkInscription,
      checkInscriptionCycle: $checkInscriptionCycle,
      lieuActivite: $lieuActivite,
      description: $description,
      illustration: $illustration,
      prix: $prix,
      publie: $publie,
      idCycle: $idCycle,
      dateDebut: $dateDebut,
      dateFin: $dateFin,
      maxParticipants: $maxParticipants,
      idGoogleEvent: $idGoogleEvent,
      sequenceEvent: $sequenceEvent
    ) 
  {
   id
 }
}
`

export const UPDATE_ACTIVITE_SEQUENCE = gql`
mutation modifieActiviteSequence(
  $id: ID!,
  $sequenceEvent: Int!
  )
  {
    updateActivite(
      id: $id,
      sequenceEvent: $sequenceEvent
      )
  {
    id
  }}
`

export const EFFACE_ACTIVITE = gql`
mutation effaceActivite($id: ID!) {
  deleteActivite(id:$id) {
    id
  }
}
`

export const UPDATE_ACTIVITE_PUBLIE = gql`
mutation modifieActivite($id: ID!, $publie: Boolean!) {
 updateActivite(id: $id, publie: $publie) {
   id
 }
}
`
