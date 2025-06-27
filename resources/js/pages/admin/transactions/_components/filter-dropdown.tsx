import { DateRangePicker } from '@/components/date-picker-range';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterState {
    startDate: string;
    endDate: string;
}

interface FilterDropdownProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export function FilterDropdown({ filters, onFilterChange, onApplyFilters, onClearFilters }: FilterDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={'sm'}>
                    <SlidersHorizontal />
                    <span className="hidden sm:block">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-96">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Date range</DropdownMenuLabel>
                    <DateRangePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onStartDateChange={(date) => onFilterChange('startDate', date)}
                        onEndDateChange={(date) => onFilterChange('endDate', date)}
                    />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <Button variant="destructive" size={'sm'} onClick={onClearFilters}>
                            Reset all
                        </Button>
                        <Button onClick={onApplyFilters} size={'sm'}>
                            Apply now
                        </Button>
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
