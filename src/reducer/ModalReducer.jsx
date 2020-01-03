export function ModalReducer(state, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { visible: true, typeModal: action.typeModal, todo: action.todo }

    case 'CLOSE_MODAL':
      return { visible: false }

    default:
      return state
  }
}
