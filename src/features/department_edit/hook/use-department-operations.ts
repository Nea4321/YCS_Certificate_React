"use client"

import { useState } from "react"
import { departmentApi } from "../api/department"
import type { DepartmentFormData, DragItem } from "../types/department"

export function useDepartmentOperations(refetch: () => void) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAdd = async (formData: DepartmentFormData, parentId?: number) => {
        try {
            setIsLoading(true)
            setError(null)
            await departmentApi.addDepartment({ ...formData, parentId })
            refetch()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add department")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (id: number, data: Partial<DepartmentFormData>) => {
        try {
            setIsLoading(true)
            setError(null)
            await departmentApi.updateDepartment(id, data)
            refetch()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update department")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true)
            setError(null)
            await departmentApi.deleteDepartment(id)
            refetch()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete department")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDrop = async (item: DragItem, targetParentId: number, targetDepartmentId?: number) => {
        try {
            setIsLoading(true)
            setError(null)
            // Mock implementation for drag and drop
            console.log("Dropping item:", item, "to parent:", targetParentId, "department:", targetDepartmentId)
            refetch()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to move item")
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        handleAdd,
        handleUpdate,
        handleDelete,
        handleDrop,
    }
}
