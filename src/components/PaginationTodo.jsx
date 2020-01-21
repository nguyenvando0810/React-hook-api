import React, { useState, useEffect } from 'react'
import { Icon } from 'antd';

function PaginationTodo({ data, todosPerPage, currentPage, handleChangeCurrentPage }) {
  const [currentPagination, setCurrentPagination] = useState(1)
  const pageNumbers = []
  const totalPage = Math.ceil(data.length / todosPerPage)

  const showNumbersPage = () => {
    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li
          className={`ant-pagination-item ${currentPage === number ? 'ant-pagination-item-active' : ''}`}
          id={number}
          key={number}
          onClick={(e) => { setCurrentPagination(Number(e.target.id)) }}>
          {number}
        </li>
      )
    })

    return renderPageNumbers
  }

  useEffect(() => {
    setCurrentPagination(currentPage)
  }, [currentPage])

  useEffect(() => {
    handleChangeCurrentPage(currentPagination)
  })

  const handleClickPageNumbersFirstPrev = () => {
    setCurrentPagination(1)
  }

  const handleClickPageNumbersNext = () => {
    if (currentPagination < data.length / todosPerPage) {
      setCurrentPagination(prevCurrentPagination => prevCurrentPagination + 1)
    }
  }

  const handleClickPageNumbersPrev = () => {
    if (currentPagination > 1) {
      setCurrentPagination(prevCurrentPagination => prevCurrentPagination - 1)
    }
  }

  const handleClickPageNumbersLastNext = () => {
    setCurrentPagination(totalPage)
  }

  return (
    <>
      {data.length > 0 &&
        <ul className="ant-pagination">
          <li className={`${currentPagination === 1 ? "ant-pagination-disabled" : ""} ant-pagination-item`} onClick={handleClickPageNumbersFirstPrev}>
            <Icon type="double-left" />
          </li>
          <li className={`${currentPagination === 1 ? "ant-pagination-disabled" : ""} ant-pagination-item`} onClick={handleClickPageNumbersPrev} >
            <Icon type="left" />
          </li>

          {showNumbersPage()}

          <li className={`${(currentPagination === totalPage) ? "ant-pagination-disabled" : ""} ant-pagination-item`} onClick={handleClickPageNumbersNext}>
            <Icon type="right" />
          </li>
          <li className={`${currentPagination === totalPage ? "ant-pagination-disabled" : ""} ant-pagination-item`} onClick={handleClickPageNumbersLastNext}>
            <Icon type="double-right" />
          </li>
        </ul>
      }
    </>
  )
}

export default PaginationTodo

