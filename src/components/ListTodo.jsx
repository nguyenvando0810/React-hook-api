import React, { useContext } from 'react'
import { Table, Tag, Button } from 'antd';
import { useQuery } from '@apollo/react-hooks'
import { TODOS_QUERY } from '../graphql'
import { TodoContext } from '../App';
import loadingImg from '../loading.gif';

function ListTodo() {
  const { data, loading } = useQuery(TODOS_QUERY)
  const { dispatchModal } = useContext(TodoContext)
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
      <Button icon="ant-cloud" className="btn-add" onClick={() => dispatchModal({ type: "OPEN_MODAL", typeModal: "FORM_MODAL" })}> Create </Button>
      {data && data.todoes &&
        <Table
          bordered
          align={'center'}
          columns={columns}
          dataSource={data.todoes}
          rowKey='id'
        />
      }

      <div style={{textAlign: "center"}}>
        {loading && <img src={loadingImg} alt="logo" />}
      </div>
    </div>
  )
}

export default ListTodo
