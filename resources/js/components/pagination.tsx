import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationData {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface PaginationProps {
    data: PaginationData;
    onPageChange: (page: number) => void;
    className?: string;
}

const generatePaginationItems = (currentPage: number, lastPage: number) => {
    const items: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 7;

    if (lastPage <= maxVisiblePages) {
        for (let i = 1; i <= lastPage; i++) {
            items.push(i);
        }
    } else {
        items.push(1);

        if (currentPage <= 4) {
            for (let i = 2; i <= 5; i++) {
                items.push(i);
            }
            items.push('ellipsis');
            items.push(lastPage);
        } else if (currentPage >= lastPage - 3) {
            items.push('ellipsis');
            for (let i = lastPage - 4; i <= lastPage; i++) {
                items.push(i);
            }
        } else {
            items.push('ellipsis');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                items.push(i);
            }
            items.push('ellipsis');
            items.push(lastPage);
        }
    }

    return items;
};

export function Pagination({ data, onPageChange, className = '' }: PaginationProps) {
    const paginationItems = generatePaginationItems(data.current_page, data.last_page);

    if (data.total === 0) {
        return null;
    }

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="text-sm text-muted-foreground">
                Showing {data.from} to {data.to} of {data.total} results
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => onPageChange(data.current_page - 1)} disabled={data.current_page === 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                    {paginationItems.map((item, index) => {
                        if (item === 'ellipsis') {
                            return (
                                <Button key={`ellipsis-${index}`} variant="ghost" size="icon" disabled className="cursor-default">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={item}
                                variant={item === data.current_page ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => onPageChange(item)}
                            >
                                {item}
                            </Button>
                        );
                    })}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(data.current_page + 1)}
                    disabled={data.current_page === data.last_page}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
