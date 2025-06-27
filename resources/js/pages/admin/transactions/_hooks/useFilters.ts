import { FilterParams } from '@/types';
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export interface UseFiltersReturn {
    searchTerm: string;
    filters: {
        startDate: string;
        endDate: string;
    };
    setSearchTerm: (value: string) => void;
    handleFilterChange: (key: string, value: string) => void;
    handleSearch: () => void;
    handleApplyFilters: () => void;
    handleClearFilters: () => void;
}

export function useFilters(initialFilters?: FilterParams): UseFiltersReturn {
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [filters, setFilters] = useState({
        startDate: initialFilters?.start_date || '',
        endDate: initialFilters?.end_date || '',
    });

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const buildParams = useCallback(() => {
        const params: FilterParams = {
            search: searchTerm,
        };

        if (filters.startDate) params.start_date = filters.startDate;
        if (filters.endDate) params.end_date = filters.endDate;

        return params;
    }, [searchTerm, filters]);

    const handleSearch = useCallback(() => {
        const params = buildParams();
        router.get(route('admin.transactions.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [buildParams]);

    const handleApplyFilters = useCallback(() => {
        const params = buildParams();
        router.get(route('admin.transactions.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [buildParams]);

    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setFilters({
            startDate: '',
            endDate: '',
        });

        router.get(
            route('admin.transactions.index'),
            { search: '' },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, []);

    return {
        searchTerm,
        filters,
        setSearchTerm,
        handleFilterChange,
        handleSearch,
        handleApplyFilters,
        handleClearFilters,
    };
}
