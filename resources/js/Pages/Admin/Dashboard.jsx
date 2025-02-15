import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p>Welcome to your admin dashboard!</p>
            </div>
        </AdminLayout>
    );
}