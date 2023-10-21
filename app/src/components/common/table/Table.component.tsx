import Emtpy from '../emtpy/Empty.component'
import './table.style.scss'
import { FC, ReactElement, ReactNode, createContext, useContext } from 'react'

interface TableProps {
  columns: string
  children: React.ReactNode
}

interface HeaderProps {
  children: React.ReactNode
}

interface RowProps {
  children: React.ReactNode
  className?: string
  rowRef?: React.RefObject<HTMLDivElement>
  styles?: React.CSSProperties
}

interface BodyProps {
  className?: string
  data: any[]
  render: (item: any) => JSX.Element
  emptyMessage: string
}

interface FooterProps {
  children: React.ReactNode
}

interface TableComp {
  Header: FC<HeaderProps>
  Body: FC<BodyProps>
  Row: FC<RowProps>
  Footer: FC<FooterProps>
}

const TableContext = createContext(null)

const Table: FC<TableProps> & TableComp = ({ columns, children }) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="table" role="table">
        {children}
      </div>
    </TableContext.Provider>
  )
}

const Header: FC<HeaderProps> = ({ children }) => {
  const { columns } = useContext(TableContext)
  return (
    <div
      className="table__header"
      role="row"
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  )
}

const Body: FC<BodyProps> = ({ data, render, emptyMessage, className }) => {
  if (!data.length) return <Emtpy emptyMessage={emptyMessage} />
  return (
    <div className={`table__body ${className || ''}`}>{data.map(render)}</div>
  )
}

const Row: FC<RowProps> = ({ children, className, rowRef, styles }) => {
  const { columns } = useContext(TableContext)
  return (
    <div
      className={`table__row ${className ? className : ''}`}
      role="row"
      style={{ ...styles, gridTemplateColumns: columns }}
      ref={rowRef}
    >
      {children}
    </div>
  )
}

const Footer: FC<FooterProps> = ({ children }) => {
  return <div className="table__footer">{children}</div>
}

Table.Header = Header
Table.Body = Body
Table.Row = Row
Table.Footer = Footer

export default Table
