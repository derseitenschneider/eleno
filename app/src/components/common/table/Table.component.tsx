import { createContext, useContext, useMemo } from 'react'
import Emtpy from '../emtpy/Empty.component'
import './table.style.scss'

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

interface BodyProps<T> {
  className?: string
  data: T[]
  render: (item: T) => JSX.Element
  emptyMessage: string
}

interface FooterProps {
  children: React.ReactNode
}
const TableContext = createContext(null)

function Table({ columns, children }: TableProps) {
  const value = useMemo(() => ({ columns }), [columns])

  return (
    <TableContext.Provider value={value}>
      <div className="table" role="table">
        {children}
      </div>
    </TableContext.Provider>
  )
}

function Header({ children }: HeaderProps) {
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

function Body<T>({ data, render, emptyMessage, className }: BodyProps<T>) {
  if (!data.length) return <Emtpy emptyMessage={emptyMessage} />

  return (
    <div className={`table__body ${className || ''}`}>{data.map(render)}</div>
  )
}

function Row({ children, className = '', rowRef, styles }: RowProps) {
  const { columns } = useContext(TableContext)
  return (
    <div
      className={`table__row ${className}`}
      role="row"
      style={{ ...styles, gridTemplateColumns: columns }}
      ref={rowRef}
    >
      {children}
    </div>
  )
}

function Footer({ children }: FooterProps) {
  return <div className="table__footer">{children}</div>
}

Table.Header = Header
Table.Body = Body
Table.Row = Row
Table.Footer = Footer

export default Table
