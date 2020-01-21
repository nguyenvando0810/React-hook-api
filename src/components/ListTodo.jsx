import React, { useContext, useState } from 'react'
import { Tag, Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TODOS_QUERY, IsLogin, COLOR_QUERY, UPDATE_BG } from '../graphql'
import { TodoContext } from '../App';
import loadingImg from '../loading.gif';
import PaginationTodo from './PaginationTodo';
import Search from './Search';
import TableCustom from './TableCustom';
// import { useApolloClient } from "@apollo/react-hooks";

function ListTodo() {
  const todosPerPage = 5
  const { data, loading } = useQuery(TODOS_QUERY)
  const { dispatchModal } = useContext(TodoContext)
  const { data: { isLogin } } = useQuery(IsLogin)
  const { data: { bgcolor } } = useQuery(COLOR_QUERY)
  const [keySearch, setKeySearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [updateBg] = useMutation(UPDATE_BG, {
    update: (cache, { data: { updateBg } }) => {
      cache.writeQuery({
        query: COLOR_QUERY,
        data: { ...data, bgcolor: updateBg }
      })
    }
  })

  const handleChangeBg = () => {
    updateBg({ variables: { bgcolor: (bgcolor === "pink" ? "#52c41a" : "pink") } })
  }
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

  let dataFilter = ((data && data.todoes) ? data.todoes.filter(todo =>
    Object.keys(todo).some(key =>
      todo[key].toString().toLowerCase().includes(keySearch.toLowerCase())
    )
  ) : [])

  const handleSearchList = (search) => {
    setKeySearch(search)
    handleChangeCurrentPage(1)
  }

  const showListTodo = (data) => {
    const indexOfLastTodo = currentPage * todosPerPage
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

    if (data.length !== 0 && data.slice(indexOfFirstTodo, indexOfLastTodo).length === 0) {
      setCurrentPage(currentPagePrev => currentPagePrev - 1)
    }

    return (
      <TableCustom
        bordered={true}
        columns={columns}
        dataSource={data.slice(indexOfFirstTodo, indexOfLastTodo)}
        pagination={false}
      />
    )
  }

  const handleChangeCurrentPage = (currentPagePagination) => {
    setCurrentPage(currentPagePagination)
  }

  return (
    <div className="todo-list">
      <div className="wrap-action">
        <Search
          keySearch={keySearch}
          handleSearchList={handleSearchList}
          placeholder="Search by title"
        />
        <Button icon="ant-cloud" onClick={() => dispatchModal({ type: "OPEN_MODAL", typeModal: "FORM_MODAL" })}> Create</Button>
      </div>

      {data && data.todoes && (
        <>
          {showListTodo(dataFilter)}

          <PaginationTodo
            data={dataFilter}
            todosPerPage={todosPerPage}
            currentPage={currentPage}
            handleChangeCurrentPage={handleChangeCurrentPage}
          />
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
