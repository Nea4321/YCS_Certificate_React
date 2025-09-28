"use client"

import { useState, useEffect, useCallback } from "react"

interface UseDataFetchingProps<T> {
    fetchFn: () => Promise<T>
}

export function useDataFetching<T>({ fetchFn }: UseDataFetchingProps<T>) {
    const [data, setData] = useState<T>([] as T)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await fetchFn()
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }, [fetchFn])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const refetch = useCallback(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch }
}
