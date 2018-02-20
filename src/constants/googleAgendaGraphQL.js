import gql from 'graphql-tag'

export const LIST_EVENTS = gql`
query listeEve{listeEvents {
  message
}}
`

export const ADD_EVENT = gql`
query addEve($dataEvent: Json!) {addEvent(dataEvent: $dataEvent) {
    idEvent
    sequenceEvent
}
}
`

export const UPDATE_EVENT = gql`
query updateEve($eventId: String!, $dataEvent: Json!) {updateEvent(eventId: $eventId, dataEvent: $dataEvent) {
    idEvent
    sequenceEvent
}
}
`

export const DELETE_EVENT = gql`
query deleteEve($eventId: String !) {deleteEvent(eventId: $eventId) {
  eventId
}
}
`
