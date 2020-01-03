import React, { useContext, useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Modal, Form, Input, notification, Checkbox, Button } from 'antd';
import { TodoContext } from '../App'
import { TODOS_QUERY, DELETE_TODO, ADD_TODO, UPDATE_TODO } from '../graphql'

function ModalTodo() {
  const [title, setTitle] = useState('')
  const [completed, setCompleted] = useState(false)
  const [errTitle, setErrTitle] = useState(false)
  const { modal, dispatchModal } = useContext(TodoContext)

  useEffect(() => {
    if (modal.todo) {
      setTitle(modal.todo.title)
      setCompleted(modal.todo.completed)
    }
  }, [modal.todo])

  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data: { deleteTodo } }) {
      const { todoes } = cache.readQuery({ query: TODOS_QUERY })
      cache.writeQuery({
        query: TODOS_QUERY,
        data: { todoes: todoes.filter(todo => todo.id !== deleteTodo.id) }
      })
    }
  })

  const [createTodo] = useMutation(ADD_TODO, {
    update(cache, { data: { createTodo } }) {
      const { todoes } = cache.readQuery({ query: TODOS_QUERY })
      cache.writeQuery({
        query: TODOS_QUERY,
        data: { todoes: todoes.concat([createTodo]) }
      })
    }
  })

  const [updateTodo] = useMutation(UPDATE_TODO)

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  }

  const handleBlurTitle = (e) => {
    setErrTitle(!e.target.value)
  }

  const handleCancel = () => {
    setTitle('')
    setCompleted(false)
    setErrTitle(false)
    dispatchModal({ type: "CLOSE_MODAL" })
  }

  const handleDelete = () => {
    deleteTodo({ variables: { id: modal.todo.id } })
    openNotification('success', 'Notification Update', 'Delete Success !')
    handleCancel()
  }

  const handleSave = () => {
    if (modal.todo) {
      updateTodo({ variables: { id: modal.todo.id, title, completed } })
      openNotification('success', 'Notification Update', 'Update Success !')
    } else {
      createTodo({ variables: { title, completed } })
      openNotification('success', 'Notification Create', 'Create Success !')
    }

    handleCancel()
  }

  return (
    <>
      {(modal.typeModal === "DELETE_MODAL") &&
        <Modal
          title="Delete Modal"
          visible={modal.visible}
          onOk={handleDelete}
          onCancel={handleCancel}
          okText="Delete"
        >
          <p>Are you want to delete book "{modal.todo.title}" ?</p>
        </Modal>
      }

      {(modal.typeModal === "FORM_MODAL") &&
        <Modal
          title="Form Modal"
          visible={modal.visible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>Cancel</Button>,
            <Button key="submit" type="primary" disabled={!title.trim()} onClick={handleSave}>Save</Button>,
          ]}
        >
          <Form>
            <div className="form-control">
              <label>Title</label>
              <Input
                type="text"
                placeholder="Title ..."
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
                onBlur={handleBlurTitle}
              />
              {errTitle && <div className="error_message">Title cannot be empty</div>}
            </div>

            <div className="form-control">
              <label>Completed</label>&nbsp; &nbsp;
                <Checkbox
                checked={completed}
                disabled={!modal.todo}
                onChange={(e) => { setCompleted(e.target.checked) }}
              />
            </div>
          </Form>
        </Modal>
      }
    </>
  )
}

export default ModalTodo

// : (
//   <Modal
//     title="Form Modal"
//     visible={modal.visible}
//     onCancel={handleCancel}
//     footer={[
//       <Button key="back" onClick={handleCancel}>Cancel</Button>,
//       <Button key="submit" type="primary" disabled={!title.trim()} onClick={handleSave}>Save</Button>,
//     ]}
//   >
//     <Form>
//       <div className="form-control">
//         <label>Title</label>
//         <Input
//           type="text"
//           placeholder="Title ..."
//           value={title}
//           onChange={(e) => { setTitle(e.target.value) }}
//           onBlur={handleBlurTitle}
//         />
//         {errTitle && <div className="error_message">Title cannot be empty</div>}
//       </div>

//       <div className="form-control">
//         <label>Completed</label>&nbsp; &nbsp;
//         <Checkbox
//           checked={completed}
//           disabled={!modal.todo}
//           onChange={(e) => { setCompleted(e.target.checked) }}
//         />
//       </div>
//     </Form>
//   </Modal>
// )
