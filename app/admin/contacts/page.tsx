'use client';

import React, { useEffect, useState } from 'react';

type Contact = {
    id: string;
    fullName: string;
    phone: string | null;
    email: string | null;
    note: string | null;
    status: string;
    createdAt: string;
};

export default function AdminContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/contacts')
            .then(res => res.json())
            .then(data => {
                setContacts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-slate-500">Loading contacts...</div>;

    return (
        <div className="bg-white dark:bg-navy-surface rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Inquiries</h1>
                    <p className="text-slate-500">Manage client contact requests.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-black/5 dark:border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-4 font-bold">Client</th>
                            <th className="py-4 font-bold">Contact Info</th>
                            <th className="py-4 font-bold">Note</th>
                            <th className="py-4 font-bold text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        {contacts.map(contact => (
                            <tr key={contact.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition">
                                <td className="py-4 pr-4 align-top">
                                    <p className="font-bold text-slate-900 dark:text-white">{contact.fullName}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="py-4 align-top">
                                    <div className="space-y-1">
                                        {contact.email && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-sm">mail</span>
                                                {contact.email}
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-sm">call</span>
                                                {contact.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 align-top">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                                        {contact.note || <span className="italic text-slate-300">No note provided.</span>}
                                    </p>
                                </td>
                                <td className="py-4 text-right align-top">
                                    <span className="text-xs text-slate-400 font-mono">
                                        {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {contacts.length === 0 && (
                    <div className="py-20 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">inbox</span>
                        <p className="text-slate-400 italic">No inquiries yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
