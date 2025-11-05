"use client";

import React from "react";

export default function VehicleCard({
	vehicle,
	onClick,
}: {
	vehicle: any;
	onClick?: () => void;
}) {
	return (
		<div
			onClick={onClick}
			className="bg-white rounded shadow p-4 cursor-pointer hover:shadow-md flex flex-col items-center"
		>
			<div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
				{vehicle.image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={vehicle.image} alt={vehicle.model || vehicle.licensePlate} className="h-full object-cover" />
				) : (
					<div className="text-sm text-gray-500">vehicle image</div>
				)}
			</div>
			<div className="mt-3 text-center">
				<div className="font-semibold">{vehicle.model || vehicle.licensePlate}</div>
				<div className="text-xs text-gray-500">{vehicle.year || ''}</div>
			</div>
		</div>
	);
}
