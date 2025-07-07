import { FilterParams } from '@/types';
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export interface UseFiltersReturn {
    filters: {
        type: string;
        startDate: string;
        endDate: string;
    };
    handleFilterChange: (key: string, value: string) => void;
    handleApplyFilters: () => void;
    handleClearFilters: () => void;
}

export function useFilters(initialFilters?: FilterParams): UseFiltersReturn {
    const [filters, setFilters] = useState({
        type: initialFilters?.type || 'all',
        startDate: initialFilters?.start_date || '',
        endDate: initialFilters?.end_date || '',
    });

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const buildParams = useCallback(() => {
        const params: FilterParams = {
            type: filters.type,
        };

        if (filters.startDate) params.start_date = filters.startDate;
        if (filters.endDate) params.end_date = filters.endDate;

        return params;
    }, [filters]);

    const handleApplyFilters = useCallback(() => {
        const params = buildParams();
        router.get(route('admin.attendances.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [buildParams]);

    const handleClearFilters = useCallback(() => {
        setFilters({
            type: 'all',
            startDate: '',
            endDate: '',
        });

        router.get(
            route('admin.attendances.index'),
            { type: 'all' },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, []);

    return {
        filters,
        handleFilterChange,
        handleApplyFilters,
        handleClearFilters,
    };
}
