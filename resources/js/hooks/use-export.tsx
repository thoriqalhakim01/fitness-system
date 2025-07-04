import { useState } from 'react';
import { toast } from 'react-toastify';

export type ExportFormat = 'excel' | 'pdf';

export interface ExportOptions {
    baseRouteName: string;
    filters?: Record<string, any>;
    successMessage?: string;
    errorMessage?: string;
    downloadDelay?: number;
    resetDelay?: number;
}

export interface ExportState {
    isExportingExcel: boolean;
    isExportingPdf: boolean;
    isExporting: boolean;
}

export interface ExportActions {
    exportExcel: () => Promise<void>;
    exportPdf: () => Promise<void>;
    exportAs: (format: ExportFormat) => Promise<void>;
}

export function useExport(options: ExportOptions): ExportState & ExportActions {
    const { baseRouteName, filters = {}, successMessage, errorMessage, downloadDelay = 1000, resetDelay = 2000 } = options;

    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const isExporting = isExportingExcel || isExportingPdf;

    const buildExportUrl = (format: ExportFormat): string => {
        const routeName = `${baseRouteName}.export-${format}`;
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                params.append(key, String(value));
            }
        });

        const baseUrl = route(routeName);
        const queryString = params.toString();

        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    const performExport = async (format: ExportFormat): Promise<void> => {
        const setLoading = format === 'excel' ? setIsExportingExcel : setIsExportingPdf;
        const defaultSuccessMessage = `${format.toUpperCase()} export completed successfully!`;
        const defaultErrorMessage = `Failed to export ${format.toUpperCase()} file`;

        setLoading(true);

        try {
            const url = buildExportUrl(format);
            const link = document.createElement('a');
            link.href = url;
            link.download = `export.${format === 'excel' ? 'xlsx' : 'pdf'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                toast.success(successMessage || defaultSuccessMessage);
            }, downloadDelay);
        } catch (error) {
            console.error(`Export ${format} error:`, error);
            toast.error(errorMessage || defaultErrorMessage);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, resetDelay);
        }
    };

    const exportExcel = () => performExport('excel');
    const exportPdf = () => performExport('pdf');
    const exportAs = (format: ExportFormat) => performExport(format);

    return {
        isExportingExcel,
        isExportingPdf,
        isExporting,
        exportExcel,
        exportPdf,
        exportAs,
    };
}
