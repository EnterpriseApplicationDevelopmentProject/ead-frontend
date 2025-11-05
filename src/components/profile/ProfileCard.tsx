"use client";

import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import type { Customer } from '@/types';

export default function ProfileCard({ 
	customer, 
	onPhotoUpdate 
}: { 
	customer: Customer; 
	onPhotoUpdate?: (photo: string) => void;
}) {
	const [photoPreview, setPhotoPreview] = useState<string | null>(
		(customer as any).photo || null
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			setPhotoPreview(result);
			if (onPhotoUpdate) {
				onPhotoUpdate(result);
			}
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-800 mb-6">Upload a Photo</h3>
			
			<div className="flex flex-col items-center">
				<div className="relative mb-4">
					<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-100">
						{photoPreview ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
						) : (
							<FaCamera className="text-gray-400 text-4xl" />
						)}
					</div>
					<label 
						htmlFor="photo-upload" 
						className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
					>
						<FaCamera className="text-white text-sm" />
					</label>
					<input 
						id="photo-upload"
						type="file" 
						accept="image/*" 
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>
				
				<p className="text-xs text-gray-500 text-center max-w-[200px] mb-1">
					Allowed JPEG, PNG, JPG formats, up to 3MB
				</p>
				<p className="text-xs text-red-500 font-medium">Not Required</p>
			</div>
		</div>
	);
}
