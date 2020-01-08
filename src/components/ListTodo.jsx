import React, { useContext, useState } from 'react'
import { Table, Tag, Button, Input, Icon } from 'antd';
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

// const GET_LIST_CACHE = gql`
//   query getList {
//     getList @client
//   }
// `

function ListTodo() {
  let todosFilter
  const todosPerPage = 5
  const { data, loading } = useQuery(TODOS_QUERY)
  const { dispatchModal } = useContext(TodoContext)
  const { data: { isLogin } } = useQuery(IsLogin)
  const { data: { bgcolor } } = useQuery(COLOR_QUERY)
  const [keySearch, setKeySearch] = useState('')
  const { currentPage, dispatchCurrentPage } = useContext(TodoContext)
  // console.log("TCL: ListTodo -> listTodo", useQuery(GET_LIST_CACHE))

  const [updateBg] = useMutation(UPDATE_BG, {
    update: (cache, { data: { updateBg } }) => {
      cache.writeQuery({
        query: COLOR_QUERY,
        data: { ...data, bgcolor: updateBg }
      })
    }
  })

  //const client = useApolloClient() Khai báo client, Set cache trực tiếp.
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

  if (data && data.todoes) {
    todosFilter = data.todoes.filter(todo => todo.title.toLowerCase().indexOf(keySearch.toLowerCase()) !== -1)
  }

  const handleChangeBg = () => {
    updateBg({ variables: { bgcolor: "#52c41a" } })
  }

  const handleSearch = (e) => {
    setKeySearch(e.target.value)
    dispatchCurrentPage({ type: "FIRST_PREV_PAGE" })
  }

  const showNumbersPage = (data) => {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(data.length / todosPerPage); i++) {
      pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li
          className={`ant-pagination-item ${currentPage === number ? 'ant-pagination-item-active' : ''}`}
          id={number}
          key={number}
          onClick={(e) => dispatchCurrentPage({ type: "ITEM_PAGE", currentPage: Number(e.target.id) })}>
          {number}
        </li>
      )
    })

    return renderPageNumbers
  }

  const handleClickPageNumbersPrev = () => {
    if (currentPage > 1) {
      dispatchCurrentPage({ type: "PREV_PAGE" })
    }
  }

  const handleClickPageNumbersNext = () => {
    if (currentPage < todosFilter.length / todosPerPage) {
      dispatchCurrentPage({ type: "NEXT_PAGE" })
    }
  }

  const handleClickPageNumbersFirstPrev = () => {
    dispatchCurrentPage({ type: "FIRST_PREV_PAGE" })
  }

  const showListTodo = (data) => {
    const indexOfLastTodo = currentPage * todosPerPage
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

    if (data.length !== 0 && data.slice(indexOfFirstTodo, indexOfLastTodo).length === 0) {
      dispatchCurrentPage({ type: "PREV_PAGE" })
    }

    return (
      <Table
        bordered
        align={'center'}
        columns={columns}
        dataSource={data.slice(indexOfFirstTodo, indexOfLastTodo)}
        rowKey='id'
        pagination={false}
      />
    )
  }

  return (
    <div className="todo-list">
      <div className="wrap-action">
        <Input className="search-input" placeholder="Search..." value={keySearch} onChange={handleSearch} />
        <Button icon="ant-cloud" onClick={() => dispatchModal({ type: "OPEN_MODAL", typeModal: "FORM_MODAL" })}> Create </Button>
      </div>

      {data && data.todoes && (
        <>
          {showListTodo(todosFilter)}

          {todosFilter.length > 0 &&
            <ul className="ant-pagination">
              <li
                className={`${currentPage === 1 ? "ant-pagination-disabled" : ""} ant-pagination-item`}
                onClick={handleClickPageNumbersFirstPrev}>
                <Icon type="double-left" />
              </li>
              <li
                className={`${currentPage === 1 ? "ant-pagination-disabled" : ""} ant-pagination-item`}
                onClick={handleClickPageNumbersPrev}>
                <Icon type="left" />
              </li>
              {data && data.todoes && showNumbersPage(todosFilter)}
              <li
                className={`${currentPage === Math.ceil(todosFilter.length / todosPerPage) ? "ant-pagination-disabled" : ""} ant-pagination-item`}
                onClick={handleClickPageNumbersNext}>
                <Icon type="right" />
              </li>
              <li
                className={`${currentPage === Math.ceil(todosFilter.length / todosPerPage) ? "ant-pagination-disabled" : ""} ant-pagination-item`}
                onClick={(e) => dispatchCurrentPage({ type: "ITEM_PAGE", currentPage: Math.ceil(todosFilter.length / todosPerPage) })}>
                <Icon type="double-right" />
              </li>
            </ul>
          }
        </>
      )}

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
