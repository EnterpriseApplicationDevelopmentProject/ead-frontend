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
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setForm((s) => ({ ...s, [name]: value }));
		setError(null);
		setSuccess(false);
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError(null);
		setSuccess(false);
		
		try {
			await onSave(form);
			setSuccess(true);
			
			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(false), 3000);
		} catch (err: any) {
			setError(err.message || 'Failed to update profile');
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={submit} className="space-y-5 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
					{error}
				</div>
			)}
			
			{/* Success Message */}
			{success && (
				<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
					Profile updated successfully!
				</div>
			)}
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* First Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						First Name <span className="text-red-500">*</span>
					</label>
					<input 
						name="firstName" 
						value={String(form.firstName || '')} 
						onChange={handle}
						required
						placeholder="First Name"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
				</div>

				{/* Last Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Last Name <span className="text-red-500">*</span>
					</label>
					<input 
						name="lastName" 
						value={String(form.lastName || '')} 
						onChange={handle}
						required
						placeholder="Last Name"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
				</div>

				{/* Email (Read-only) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
					<input 
						name="email" 
						value={customer.email} 
						disabled 
						placeholder="Email"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
					/>
					<p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
				</div>

				{/* Telephone Number */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Telephone Number
					</label>
					<input 
						name="phone" 
						value={String(form.phone || '')} 
						onChange={handle} 
						placeholder="10-15 digits"
						pattern="[0-9]{10,15}"
						title="Phone number must be 10-15 digits"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
					<p className="text-xs text-gray-500 mt-1">Optional: 10-15 digits</p>
				</div>

				{/* NIC Number (Local field - not synced to backend) */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
					<input 
						name="nic" 
						value={String(form.nic || '')} 
						onChange={handle} 
						placeholder="NIC Number"
						className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
					/>
					<p className="text-xs text-gray-500 mt-1">Stored locally only</p>
				</div>

				{/* Address (Local field - not synced to backend) */}
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
					<p className="text-xs text-gray-500 mt-1">Stored locally only</p>
				</div>
			</div>

			<div className="flex justify-end pt-2">
				<button 
					type="submit" 
					disabled={saving} 
					className="bg-teal-400 hover:bg-teal-500 text-white font-medium px-8 py-2.5 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{saving ? 'Updating...' : 'Update Profile'}
				</button>
			</div>
		</form>
	);
}
