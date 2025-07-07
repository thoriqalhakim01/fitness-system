import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExportActions, ExportState } from '@/hooks/use-export';
import { ChevronDown, FileDown, FileText, Loader2, Sheet } from 'lucide-react';

interface ExportDropdownProps extends ExportState, ExportActions {
    triggerText?: string;
    disabled?: boolean;
    className?: string;
    align?: 'start' | 'center' | 'end';
}

export function ExportDropdown({
    isExportingExcel,
    isExportingPdf,
    isExporting,
    exportExcel,
    exportPdf,
    triggerText = 'Export as',
    disabled = false,
    className = '',
    align = 'end',
}: ExportDropdownProps) {
    const isDisabled = disabled || isExporting;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isDisabled} className={className}>
                    {isExporting ? <Loader2 className="animate-spin" /> : <FileDown />}
                    <span className="hidden lg:block">{triggerText}</span>
                    <ChevronDown className="hidden lg:block" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-36">
                <DropdownMenuItem disabled={isDisabled}>
                    <button className="flex w-full items-center gap-2" onClick={exportExcel} disabled={isDisabled}>
                        {isExportingExcel ? <Loader2 className="animate-spin" size={16} /> : <Sheet size={16} />}
                        {isExportingExcel ? 'Exporting...' : 'Excel'}
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isDisabled}>
                    <button className="flex w-full items-center gap-2" onClick={exportPdf} disabled={isDisabled}>
                        {isExportingPdf ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                        {isExportingPdf ? 'Exporting...' : 'PDF'}
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
