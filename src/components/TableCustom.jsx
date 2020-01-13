import React from 'react'
import { Table } from 'antd';

function TableCustom({ bordered, columns, dataSource, pagination }) {
  return (
    <Table
      bordered={bordered}
      columns={columns}
      dataSource={dataSource}
      rowKey='id'
      pagination={pagination}
    />
  )
}

export default TableCustom
