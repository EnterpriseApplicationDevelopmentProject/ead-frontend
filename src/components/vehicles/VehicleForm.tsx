"use client";

import React, { useState } from "react";

export interface NewVehicleInput {
	model: string;
	color: string;
	vin: string;
	registrationDate: string; // ISO date
	licensePlate: string;
	year: number | '';
	image?: string | null; // data URL
}

export default function VehicleForm({
	initial,
	onSubmit,
	onCancel,
}: {
	initial?: Partial<NewVehicleInput>;
	onSubmit: (v: NewVehicleInput) => void;
	onCancel?: () => void;
}) {
	const [form, setForm] = useState<NewVehicleInput>({
		model: initial?.model || "",
		color: initial?.color || "",
		vin: initial?.vin || "",
		registrationDate: initial?.registrationDate || "",
		licensePlate: initial?.licensePlate || "",
		year: (initial?.year as number) || "",
		image: initial?.image ?? null,
	});

	const [imagePreview, setImagePreview] = useState<string | null>(
		initial?.image || null
	);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target as HTMLInputElement;
		setForm((s) => ({ ...s, [name]: name === "year" ? Number(value) : value }));
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			setImagePreview(result);
			setForm((s) => ({ ...s, image: result }));
		};
		reader.readAsDataURL(file);
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		// simple validation
		if (!form.model || !form.vin || !form.licensePlate) return;
		onSubmit({ ...form, year: Number(form.year) });
	};

	return (
		<form onSubmit={submit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">Model</label>
					<input
						name="model"
						value={form.model}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Color</label>
					<input
						name="color"
						value={form.color}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">VIN</label>
					<input
						name="vin"
						value={form.vin}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">License Plate</label>
					<input
						name="licensePlate"
						value={form.licensePlate}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Year</label>
					<input
						name="year"
						value={String(form.year)}
						onChange={handleChange}
						type="number"
						className="w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Registration Date</label>
					<input
						name="registrationDate"
						value={form.registrationDate}
						onChange={handleChange}
						type="date"
						className="w-full rounded border px-3 py-2"
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Image</label>
				<input type="file" accept="image/*" onChange={handleFile} />
				{imagePreview && (
					<div className="mt-2">
						<img src={imagePreview} alt="preview" className="h-28 object-cover" />
					</div>
				)}
			</div>

			<div className="flex items-center gap-3">
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
					Add vehicle
				</button>
				{onCancel && (
					<button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
