"use client";

import React from "react";
import VehicleCard from "./VehicleCard";

export default function VehicleList({
	vehicles,
	onSelect,
	onAdd,
}: {
	vehicles: any[];
	onSelect: (v: any) => void;
	onAdd?: () => void;
}) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			<div
				onClick={onAdd}
				className="bg-white rounded shadow p-4 flex items-center justify-center cursor-pointer hover:shadow-md"
			>
				<div className="text-2xl font-bold">+</div>
			</div>

			{vehicles.map((v) => (
				<div key={v.id} onClick={() => onSelect(v)}>
					<VehicleCard vehicle={v} />
				</div>
			))}
		</div>
	);
}
