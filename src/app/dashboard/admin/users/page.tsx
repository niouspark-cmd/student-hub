'use client';

import { useState, useEffect } from 'react';
import { SearchIcon, PhoneIcon, UserIcon, ShieldIcon, DatabaseIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Fetch users failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm)
    );

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto pt-20">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <Link href="/dashboard/admin" className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block hover:opacity-70 transition-all">← Back to Command Center</Link>
                        <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter">Entity/User Database</h1>
                        <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Global Identity Registry</p>
                    </div>
                    <div className="bg-surface border border-surface-border rounded-full px-4 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{users.length} Records Active</span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8 max-w-md">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/* Table */}
                <div className="bg-surface border border-surface-border rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-border bg-foreground/5">
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-foreground/40">Identity</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-foreground/40">Clearance</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-foreground/40">Contact (Phone)</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-foreground/40">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-foreground/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black text-xs">
                                                    {user.name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-foreground">{user.name || 'Unknown Entity'}</div>
                                                    <div className="text-[10px] text-foreground/40 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' :
                                                    user.role === 'VENDOR' ? 'bg-orange-500/10 text-orange-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {user.role === 'ADMIN' && <ShieldIcon className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-mono text-foreground/80">
                                                <PhoneIcon className="w-3 h-3 opacity-40" />
                                                {user.phoneNumber ? (
                                                    <span className="group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigator.clipboard.writeText(user.phoneNumber)} title="Click Copy">
                                                        {user.phoneNumber}
                                                    </span>
                                                ) : (
                                                    <span className="opacity-20">N/A</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-foreground/60 uppercase">
                                                {user.vendorStatus === 'NOT_APPLICABLE' ? 'Citizen' : user.vendorStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-mono text-foreground/40">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-foreground/30">
                            <DatabaseIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No matching records found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
