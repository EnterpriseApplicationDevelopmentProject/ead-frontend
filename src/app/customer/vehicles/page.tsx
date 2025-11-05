"use client";

import React, { useEffect, useState } from "react";
import { vehicleService, customerService } from "@/api/mockApiService";
import VehicleList from "@/components/vehicles/VehicleList";
import VehicleDetails from "@/components/vehicles/VehicleDetails";
import VehicleForm, { NewVehicleInput } from "@/components/vehicles/VehicleForm";

interface VehicleFull {
  id: string;
  customerId: string;
  model?: string;
  color?: string;
  vin?: string;
  registrationDate?: string;
  licensePlate?: string;
  year?: number | string;
  image?: string | null;
}

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleFull[]>([]);
  const [selected, setSelected] = useState<VehicleFull | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const customer = await customerService.getProfile();
        const list = await vehicleService.getCustomerVehicles(customer.id);
        if (!mounted) return;
        // normalize to VehicleFull
        const normalized = list.map((v: any) => ({
          id: v.id,
          customerId: v.customerId,
          model: `${v.make || ''} ${v.model || ''}`.trim(),
          licensePlate: v.vehicleNumber,
          year: v.year,
          image: null,
        }));
        setVehicles(normalized);
        if (normalized.length) setSelected(normalized[0]);
      } catch (e) {
        console.error(e);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const handleAddClick = () => setShowForm(true);

  const handleAdd = (input: NewVehicleInput) => {
    const newVehicle: VehicleFull = {
      id: `V-${Date.now()}`,
      customerId: "CUST001",
      model: input.model,
      color: input.color,
      vin: input.vin,
      registrationDate: input.registrationDate,
      licensePlate: input.licensePlate,
      year: input.year,
      image: input.image || null,
    };
    setVehicles((s) => [newVehicle, ...s]);
    setSelected(newVehicle);
    setShowForm(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">My Vehicles</h2>
      </div>

      <div className="mb-6">
        <VehicleList vehicles={vehicles} onSelect={setSelected} onAdd={handleAddClick} />
      </div>

      <div className="border-t pt-6 space-y-6">
        <div className=" gap-6">
          <div className="lg:col-span-1">
            <VehicleDetails vehicle={selected} />
          </div>
          <div className="lg:col-span-2">
            
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Add vehicle</h4>
              <button onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            <VehicleForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
