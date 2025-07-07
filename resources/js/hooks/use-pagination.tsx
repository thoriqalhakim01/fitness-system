import { router } from '@inertiajs/react';
import { useCallback } from 'react';

interface UsePaginationProps {
    route: string;
    preserveFilters?: boolean;
    filters?: Record<string, any>;
}

export function usePagination({ route: routeName, preserveFilters = true, filters = {} }: UsePaginationProps) {
    const handlePageChange = useCallback(
        (page: number) => {
            const params = preserveFilters ? { ...filters, page } : { page };

            router.get(route(routeName), params, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [routeName, preserveFilters, filters],
    );

    return { handlePageChange };
}
