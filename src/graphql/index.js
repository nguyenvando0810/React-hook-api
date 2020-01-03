import { gql } from 'apollo-boost'

export const TODOS_QUERY = gql`
  query {
    todoes {
      title
      id
      completed
    }
  }
`

export const ADD_TODO = gql`
  mutation createTodo($title: String!) {
    createTodo(data: { title: $title }) {
      title
      id
      completed
    }
  }
`

export const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      title
      id
      completed
    }
  }
`

export const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $title: String!, $completed: Boolean!) {
    updateTodo(where: { id: $id }, data: { title: $title, completed: $completed }) {
      title
      id
      completed
    }
  }
`