import React, { useContext, useState } from 'react'
import { Table, Tag, Button, Input } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TODOS_QUERY } from '../graphql'
import { TodoContext } from '../App';
import loadingImg from '../loading.gif';
import { gql } from 'apollo-boost'
// import { useApolloClient } from "@apollo/react-hooks";

const IsLogin = gql`
  query {
    isLogin @client
  }
`;

const COLOR_QUERY = gql`
  query {
    bgcolor @client
  }
`;

const UPDATE_BG = gql`
  mutation UpdateBg ($bgcolor: String!) {
    updateBg(bgcolor: $bgcolor) @client
  }
`;


function ListTodo() {
  const { data, loading } = useQuery(TODOS_QUERY)
  const { dispatchModal } = useContext(TodoContext)
  const { data: { isLogin } } = useQuery(IsLogin)
  const { data: { bgcolor } } = useQuery(COLOR_QUERY)
  const [keySearch, setKeySearch] = useState('')
  let todosFilter = []

  const [updateBg] = useMutation(UPDATE_BG, {
    update: (cache, { data: { updateBg } }) => {
      cache.writeQuery({
        query: COLOR_QUERY,
        data: { ...data, bgcolor: updateBg }
      })
    }
  })

  //const client = useApolloClient() Khai báo client, Set cache trực tiếp.

  const handleChangeBg = () => {
    updateBg({ variables: { bgcolor: "#52c41a" } })
  }

  const handleSearch = (e) => {
    setKeySearch(e.target.value)
  }

  if (data && data.todoes) {
    todosFilter = [...data.todoes]
    todosFilter = todosFilter.filter(todo => todo.title.toLowerCase().indexOf(keySearch.toLowerCase()) !== -1)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Title',
      dataIndex: 'title'
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      render: (completed) => {
        return <Tag color={completed ? "green" : "#f50"}>{completed ? "True" : "False"}</Tag >
      }
    },
    {
      title: 'Action',
      render: (row) => {
        return (
          <>
            <Button icon="dingding" onClick={() => dispatchModal({ type: "OPEN_MODAL", typeModal: "FORM_MODAL", todo: row })}>Edit</Button> &nbsp; &nbsp;
            <Button type="danger" icon="delete" onClick={() => dispatchModal({ type: "OPEN_MODAL", typeModal: "DELETE_MODAL", todo: row })}>Delete</Button>
          </>
        )
      }
    },
  ];

  return (
    <div className="todo-list">
      <div className="wrap-action">
        <Input className="search-input" placeholder="Search..." value={keySearch} onChange={handleSearch} />
        <Button icon="ant-cloud" onClick={() => dispatchModal({ type: "OPEN_MODAL", typeModal: "FORM_MODAL" })}> Create </Button>
      </div>

      {todosFilter &&
        <Table
          bordered
          align={'center'}
          columns={columns}
          dataSource={todosFilter}
          rowKey='id'
        />
      }

      <div style={{ textAlign: "center" }}>
        {loading && <img src={loadingImg} alt="logo" />}
      </div>

      {/* <Button icon="loading" onClick={() => client.writeData({ data: { bgcolor: "#52c41a" } })}>Direct writes</Button> Set cache trực tiếp.*/}

      <Button icon="color" className="btn-add" onClick={handleChangeBg}>Change Background</Button>
      <p style={{ background: bgcolor, padding: 15 }}>{isLogin ? "Logged in" : "No Login"}</p>
    </div>
  )
}

export default ListTodo
