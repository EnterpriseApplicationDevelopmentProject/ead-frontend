"use client";

import React, { useState } from "react";
import type { Customer } from '@/types';

export default function ProfileForm({
	customer,
	onSave,
}: {
	customer: Customer;
	onSave: (c: Partial<Customer>) => Promise<void> | void;
}) {
	const [form, setForm] = useState<Partial<Customer>>(customer || {});
	const [saving, setSaving] = useState(false);

	const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setForm((s) => ({ ...s, [name]: value }));
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await onSave(form);
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={submit} className="space-y-5 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Customer Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
					<input 
						name="firstName" 
						value={String(form.firstName || '')} 
						onChange={handle} 
						placeholder="Service Center Name"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
					<input 
						name="email" 
						value={customer.email} 
						disabled 
						placeholder="Email"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
					/>
				</div>

				{/* NIC Number */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
					<input 
						name="nic" 
						value={String(form.nic || '')} 
						onChange={handle} 
						placeholder="NIC Number"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
				</div>

				{/* Telephone Number */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Telephone Number</label>
					<input 
						name="phone" 
						value={String(form.phone || '')} 
						onChange={handle} 
						placeholder="Telephone Number"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
				</div>

				{/* Address */}
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
					<textarea 
						name="address" 
						value={String(form.address || '')} 
						onChange={handle} 
						placeholder="Address"
						rows={3}
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
					/>
				</div>
			</div>

			<div className="flex justify-end pt-2">
				<button 
					type="submit" 
					disabled={saving} 
					className="bg-teal-400 hover:bg-teal-500 text-white font-medium px-8 py-2.5 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{saving ? 'Updating...' : 'Update'}
				</button>
			</div>
		</form>
	);
}
