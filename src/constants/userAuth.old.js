import gql from 'graphql-tag'

export const SIGNUP = gql`
mutation ajoutUtilisateur($email:String!, $password: String!) {
  signupUser(email: $email, password: $password) {
    id
    token
  }
}
`
