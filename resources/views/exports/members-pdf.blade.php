<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Members Export</title>
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
        <div class="title">Member Listing Report</div>
        <div class="date">Generated on: {{ now()->format('Y-m-d H:i:s') }}</div>
    </div>

    @if ($filters['search'] || $filters['status'] !== 'all' || $filters['start_date'] || $filters['end_date'])
        <div class="filters">
            <strong>Applied Filters:</strong>
            @if ($filters['search'])
                <span class="filter-item">Search: "{{ $filters['search'] }}"</span>
            @endif
            @if ($filters['status'] !== 'all')
                <span class="filter-item">Status:
                    {{ $filters['status'] === 'member' ? 'Active Member' : 'Non-Member' }}</span>
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
                <th>Email</th>
                <th>Phone</th>
                <th>Trainer</th>
                <th>Membership Status</th>
                <th>Status</th>
                <th>Registration Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($members as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->email }}</td>
                    <td>{{ $item->phone }}</td>
                    <td>{{ $item->trainer->user->name }}</td>
                    <td>{{ $item->is_member ? 'Active Member' : 'Non-Member' }}</td>
                    <td style="text-transform: capitalize">{{ $item->status }}</td>
                    <td>{{ $item->registration_date }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Total Members: {{ $members->count() }}
    </div>
</body>

</html>
