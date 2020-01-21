import React, { useState, useEffect } from 'react'
import { Input, Icon } from 'antd';

const prefix = <Icon type="search" />

function Search({ keySearch, handleSearchList, placeholder }) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSearch(keySearch)
  }, [keySearch])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    handleSearchList(search)
  })

  return (
    <Input
      className="search-input"
      placeholder={placeholder}
      prefix={prefix}
      allowClear
      value={search}
      onChange={handleSearch}
    />
  )
}

export default Search
