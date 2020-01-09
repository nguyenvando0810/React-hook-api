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
      id
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
export const IsLogin = gql`
  query {
    isLogin @client
  }
`

export const COLOR_QUERY = gql`
  query {
    bgcolor @client
  }
`

export const UPDATE_BG = gql`
  mutation UpdateBg ($bgcolor: String!) {
    updateBg(bgcolor: $bgcolor) @client
  }
`

export const GET_LIST_CACHE = gql`
  query getList {
    getList @client
  }
`