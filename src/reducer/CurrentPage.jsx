export function CurrentPageReducer(state, action) {
  switch (action.type) {
    case 'NEXT_PAGE':
      return state + 1

    case 'PREV_PAGE':
      return state - 1

    case 'ITEM_PAGE':
      return action.currentPage

    case 'FIRST_PREV_PAGE':
      return 1

    default:
      return state
  }
}
