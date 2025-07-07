<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Trainers Export</title>
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
        <div class="title">Trainer Listing Report</div>
        <div class="date">Generated on: {{ now()->format('Y-m-d H:i:s') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Member Trained</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($trainers as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->user->name }}</td>
                    <td>{{ $item->user->email }}</td>
                    <td>{{ $item->user->phone }}</td>
                    <td>{{ $item->members->count() }}</td>
                    <td>{{ $item->created_at }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Total Trainers: {{ $trainers->count() }}
    </div>
</body>

</html>
