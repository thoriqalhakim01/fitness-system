<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Attendances Export</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
        }

        .filters {
            margin-bottom: 15px;
            font-size: 12px;
        }

        .filter-item {
            display: inline-block;
            margin-right: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .footer {
            margin-top: 20px;
            font-size: 10px;
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="title">Attendance Listing Report</div>
        <div class="date">Generated on: {{ now()->format('Y-m-d H:i:s') }}</div>
    </div>

    @if ($filters['type'] || $filters['start_date'] || $filters['end_date'])
        <div class="filters">
            <strong>Applied Filters:</strong>
            @if ($filters['type'])
                <span class="filter-item">Type: "{{ $filters['type'] }}"</span>
            @endif
            @if ($filters['start_date'] && $filters['end_date'])
                <span class="filter-item">Date Range: {{ $filters['start_date'] }} to {{ $filters['end_date'] }}</span>
            @endif
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Name</th>
                <th>Type</th>
                <th>Entry Date</th>
                <th>Entry Time</th>
            </tr>
        </thead>
        <tbody> 
            @foreach ($attendances as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->attendable->name }}</td>
                    <td>{{ $item->attendable_type }}</td>
                    <td>{{ $item->entry_timestamp->format('Y-m-d') }}</td>
                    <td>{{ $item->entry_timestamp->format('H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Total Attendance: {{ $attendances->count() }}
    </div>
</body>

</html>
