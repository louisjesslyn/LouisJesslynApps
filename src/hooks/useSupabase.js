import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useMemories() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMemories = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('date', { ascending: false })
    if (!error) setMemories(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchMemories() }, [fetchMemories])

  return { memories, loading, refetch: fetchMemories }
}

export function useMilestones() {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('milestones').select('*').order('date', { ascending: true })
      .then(({ data }) => { setMilestones(data || []); setLoading(false) })
  }, [])

  return { milestones, loading }
}

export function useBucketList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from('bucket_list').select('*').order('created_at')
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const toggleDone = async (id, isDone) => {
    await supabase.from('bucket_list').update({
      is_done: !isDone,
      done_date: !isDone ? new Date().toISOString().split('T')[0] : null
    }).eq('id', id)
    fetchItems()
  }

  return { items, loading, toggleDone }
}

export function useLoveLetters() {
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('love_letters').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setLetters(data || []); setLoading(false) })
  }, [])

  return { letters, loading }
}
