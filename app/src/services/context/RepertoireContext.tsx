import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ContextTypeRepertoire, RepertoireItem } from '../../types/types'

import fetchErrorToast from '../../hooks/fetchErrorToast'
import {
  createRepertoireItemAPI,
  deleteRepertoireItemAPI,
  fetchRepertoireAPI,
  updateRepertoireItemAPI,
} from '../api/repertoire.api'

export const RepertoireContext = createContext<ContextTypeRepertoire>({
  repertoire: [],
  isLoading: true,
  getRepertoire: () => new Promise(() => {}),
  addRepertoireItem: () => new Promise(() => {}),
  updateRepertoireItem: () => new Promise(() => {}),
  deleteRepertoireItem: () => new Promise(() => {}),
})

export function RepertoireProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [repertoire, setRepertoire] = useState<RepertoireItem[]>([])

  const getRepertoire = useCallback(async (studentId: number) => {
    try {
      const rep = await fetchRepertoireAPI(studentId)
      setRepertoire(rep)
    } catch (e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addRepertoireItem = useCallback(async (item: RepertoireItem) => {
    try {
      const [newItem] = await createRepertoireItemAPI(item)

      setRepertoire((prev) => [...prev, newItem])
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const updateRepertoireItem = useCallback(async (newItem: RepertoireItem) => {
    try {
      await updateRepertoireItemAPI(newItem)
      setRepertoire((prev) =>
        prev.map((item) => (item.id === newItem.id ? newItem : item)),
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const deleteRepertoireItem = useCallback(async (id: number) => {
    try {
      await deleteRepertoireItemAPI(id)
      setRepertoire((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const value = useMemo(
    () => ({
      repertoire,
      getRepertoire,
      addRepertoireItem,
      isLoading,
      updateRepertoireItem,
      deleteRepertoireItem,
    }),
    [
      repertoire,
      getRepertoire,
      addRepertoireItem,
      isLoading,
      updateRepertoireItem,
      deleteRepertoireItem,
    ],
  )
  return (
    <RepertoireContext.Provider value={value}>
      {children}
    </RepertoireContext.Provider>
  )
}

export const useRepertoire = () => {
  const context = useContext(RepertoireContext)
  if (!context) throw new Error('Repertoire context used outside of scope')
  return context
}
