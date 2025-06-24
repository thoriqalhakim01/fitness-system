export const getCurrencyFormat = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const getFormatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
};

export const getFormatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
    });
};

export const getStatusFromAttendableType = (attendableType: string): string => {
    return attendableType.split('\\').pop() || '';
};
