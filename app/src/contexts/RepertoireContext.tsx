import { createContext, useContext, useState } from 'react'
import { ContextTypeRepertoire, TRepertoireItem } from '../types/types'

import {
  getRepertoireByStudentSupabase,
  createRepertoireItemSupabase,
  deleteRepertoireItemSupabase,
  udpateRepertoireItemSupabase,
} from '../supabase/repertoire.supabase'
import fetchErrorToast from '../hooks/fetchErrorToast'

export const RepertoireContext = createContext<ContextTypeRepertoire>({
  repertoire: [],
  isLoading: true,
  getRepertoire: () => new Promise(() => {}),
  addRepertoireItem: () => new Promise(() => {}),
  updateRepertoireItem: () => new Promise(() => {}),
  deleteRepertoireItem: () => new Promise(() => {}),
})

export const RepertoireProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [repertoire, setRepertoire] = useState<TRepertoireItem[]>([])

  const getRepertoire = async (studentId: number) => {
    try {
      const rep = await getRepertoireByStudentSupabase(studentId)
      setRepertoire(rep)
    } catch {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  const addRepertoireItem = async (item: TRepertoireItem) => {
    try {
      const [newItem] = await createRepertoireItemSupabase(item)

      setRepertoire((prev) => [...prev, newItem])
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateRepertoireItem = async (newItem: TRepertoireItem) => {
    try {
      await udpateRepertoireItemSupabase(newItem)
      setRepertoire((prev) =>
        prev.map((item) => (item.id === newItem.id ? newItem : item))
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const deleteRepertoireItem = async (id: number) => {
    try {
      await deleteRepertoireItemSupabase(id)
      setRepertoire((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <RepertoireContext.Provider
      value={{
        repertoire,
        getRepertoire,
        addRepertoireItem,
        isLoading,
        updateRepertoireItem,
        deleteRepertoireItem,
      }}
    >
      {children}
    </RepertoireContext.Provider>
  )
}

export const useRepertoire = () => {
  const context = useContext(RepertoireContext)
  if (!context) throw new Error('Repertoire context used outside of scope')
  return context
}
