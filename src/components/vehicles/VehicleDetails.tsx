"use client";

import React from "react";

export default function VehicleDetails({ vehicle }: { vehicle: any | null }) {
	if (!vehicle) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<p className="text-gray-500 text-center">Select a vehicle to see details</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden">
			<div className="flex flex-col md:flex-row">
				{/* Image Section */}
				<div className="relative md:w-1/2 bg-gray-100 p-6 flex items-center justify-center">
					{vehicle.image ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img 
							src={vehicle.image} 
							alt={vehicle.model || vehicle.licensePlate} 
							className="w-full h-auto max-h-96 object-contain rounded-lg" 
						/>
					) : (
						<div className="h-64 flex items-center justify-center text-gray-400">
							<div className="text-center">
								<div className="text-4xl mb-2">🚗</div>
								<div>No image available</div>
							</div>
						</div>
					)}
				</div>

				{/* Details Section */}
				<div className="md:w-1/2 p-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						{vehicle.model || vehicle.licensePlate}
					</h2>
					
					{vehicle.price && (
						<div className="mb-6">
							<div className="text-3xl font-bold text-green-600">
								€{vehicle.price.toLocaleString()}
							</div>
							{vehicle.originalPrice && (
								<div className="text-sm text-gray-500">
									(Minimum price €{vehicle.originalPrice.toLocaleString()})
								</div>
							)}
						</div>
					)}

					<div className="space-y-3">
						<div className="flex justify-between py-2 border-b border-gray-100">
							<span className="text-gray-600">Advertisement number</span>
							<span className="font-medium text-gray-900">
								{vehicle.id || vehicle.vin || '-'}
							</span>
						</div>
						
						<div className="flex justify-between py-2 border-b border-gray-100">
							<span className="text-gray-600">Year</span>
							<span className="font-medium text-gray-900">{vehicle.year || '-'}</span>
						</div>

						<div className="flex justify-between py-2 border-b border-gray-100">
							<span className="text-gray-600">Color</span>
							<span className="font-medium text-gray-900">{vehicle.color || '-'}</span>
						</div>

						<div className="flex justify-between py-2 border-b border-gray-100">
							<span className="text-gray-600">VIN</span>
							<span className="font-medium text-gray-900">{vehicle.vin || '-'}</span>
						</div>

						<div className="flex justify-between py-2 border-b border-gray-100">
							<span className="text-gray-600">License plate</span>
							<span className="font-medium text-gray-900">
								{vehicle.licensePlate || '-'}
							</span>
						</div>

						<div className="flex justify-between py-2 border-b border-gray-100">
							<span className="text-gray-600">Advertised on</span>
							<span className="font-medium text-gray-900">
								{vehicle.registrationDate || '-'}
							</span>
						</div>

						<div className="flex justify-between py-2">
							<span className="text-gray-600">Previous sale</span>
							<span className="font-medium text-gray-900">
								{vehicle.previousSale || 'As open as possible'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}