"use client";

import React, { useState } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import type { Customer } from '@/types';

export default function ProfileCard({ 
	customer, 
	onPhotoUpdate 
}: { 
	customer: Customer; 
	onPhotoUpdate?: (photo: string) => Promise<void>;
}) {
	const [photoPreview, setPhotoPreview] = useState<string | null>(
		(customer as any).photo || null
	);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		
		// Validate file type
		if (!file.type.startsWith('image/')) {
			setError('Please select a valid image file');
			return;
		}
		
		// Validate file size (max 3MB)
		if (file.size > 3 * 1024 * 1024) {
			setError('Image size must be less than 3MB');
			return;
		}
		
		setError(null);
		setUploading(true);
		
		const reader = new FileReader();
		reader.onload = async () => {
			const result = reader.result as string;
			setPhotoPreview(result);
			
			if (onPhotoUpdate) {
				try {
					await onPhotoUpdate(result);
					setError(null);
				} catch (err: any) {
					setError(err.message || 'Failed to upload image');
					// Revert preview on error
					setPhotoPreview((customer as any).photo || null);
				} finally {
					setUploading(false);
				}
			} else {
				setUploading(false);
			}
		};
		reader.onerror = () => {
			setError('Failed to read image file');
			setUploading(false);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Photo</h3>
			
			{error && (
				<div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
					{error}
				</div>
			)}
			
			<div className="flex flex-col items-center">
				<div className="relative mb-4">
					<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-100">
						{photoPreview ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
						) : (
							<FaCamera className="text-gray-400 text-4xl" />
						)}
						{uploading && (
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
								<FaSpinner className="text-white text-2xl animate-spin" />
							</div>
						)}
					</div>
					<label 
						htmlFor="photo-upload" 
						className={`absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<FaCamera className="text-white text-sm" />
					</label>
					<input 
						id="photo-upload"
						type="file" 
						accept="image/*" 
						onChange={handleFileChange}
						disabled={uploading}
						className="hidden"
					/>
				</div>
				
				<p className="text-xs text-gray-500 text-center max-w-[200px] mb-1">
					Allowed JPEG, PNG, JPG formats, up to 3MB
				</p>
				<p className="text-xs text-green-600 font-medium">Stored in Cloud</p>
			</div>
		</div>
	);
}
