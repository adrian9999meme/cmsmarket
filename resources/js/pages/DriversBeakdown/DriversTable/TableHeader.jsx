export default function TableHeader() {
    return (
        <thead className="table-light">
            <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Last Login</th>
                <th>Salary</th>
                <th>Pickup Hub</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Total Collection</th>
                <th>Total Commission</th>
                <th className="text-end">Options</th>
            </tr>
        </thead>
    );
}