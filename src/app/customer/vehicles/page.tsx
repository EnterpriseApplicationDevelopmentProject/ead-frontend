"use client";

import React, { useEffect, useState } from "react";
import VehicleList from "@/components/vehicles/VehicleList";
import VehicleDetails from "@/components/vehicles/VehicleDetails";
import VehicleForm, { NewVehicleInput } from "@/components/vehicles/VehicleForm";
import { vehicleApi } from "@/lib/vehicleApi";
import { Vehicle } from "@/types/vehicle.types";
import { debugImageUpload } from "@/lib/debugImageUpload";

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load all vehicles on mount
  useEffect(() => {
    loadVehicles();
  }, []);

  // Debug: Log selected vehicle changes
  useEffect(() => {
    console.log('Selected vehicle changed:', selected);
  }, [selected]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getAllVehicles();
      console.log('Loaded vehicles:', data);
      setVehicles(data);
      // Auto-select first vehicle only on initial load
      if (isInitialLoad && data.length > 0) {
        console.log('Auto-selecting first vehicle:', data[0]);
        setSelected(data[0]);
        setIsInitialLoad(false);
      }
    } catch (err: any) {
      console.error("Failed to load vehicles:", err);
      setError(err.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleSubmit = async (input: NewVehicleInput) => {
    try {
      setLoading(true);
      setError(null);

      const vehicleData = {
        model: input.model,
        color: input.color,
        vin: input.vin,
        licensePlate: input.licensePlate,
        year: Number(input.year),
        registrationDate: input.registrationDate,
      };

      let savedVehicle: Vehicle;

      if (editingVehicle) {
        // Update existing vehicle
        if (input.imageFile) {
          savedVehicle = await vehicleApi.updateVehicleWithImage(
            editingVehicle.id,
            vehicleData,
            input.imageFile
          );
        } else {
          savedVehicle = await vehicleApi.updateVehicle(editingVehicle.id, vehicleData);
        }
        
        // Update the vehicle in the list
        setVehicles((prev) =>
          prev.map((v) => (v.id === savedVehicle.id ? savedVehicle : v))
        );
      } else {
        // Create new vehicle
        if (input.imageFile) {
          savedVehicle = await vehicleApi.createVehicleWithImage(vehicleData, input.imageFile);
        } else {
          savedVehicle = await vehicleApi.createVehicle(vehicleData);
        }
        
        // Add to the beginning of the list
        setVehicles((prev) => [savedVehicle, ...prev]);
      }

      setSelected(savedVehicle);
      setShowForm(false);
      setEditingVehicle(null);
    } catch (err: any) {
      console.error("Failed to save vehicle:", err);
      setError(err.response?.data?.message || "Failed to save vehicle");
      alert(`Error: ${err.response?.data?.message || "Failed to save vehicle"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await vehicleApi.deleteVehicle(vehicleId);
      
      // Remove from list
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      
      // Clear selection if deleted vehicle was selected
      if (selected?.id === vehicleId) {
        const remaining = vehicles.filter((v) => v.id !== vehicleId);
        setSelected(remaining.length > 0 ? remaining[0] : null);
      }
      
      alert("Vehicle deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete vehicle:", err);
      setError(err.response?.data?.message || "Failed to delete vehicle");
      alert(`Error: ${err.response?.data?.message || "Failed to delete vehicle"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">My Vehicles</h2>
          {/* Debug button - Remove after testing */}
          <button
            onClick={debugImageUpload}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
            title="Test image upload with detailed console logging"
          >
            🐛 Debug Upload
          </button>
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}

      <div className="mb-6">
        <VehicleList vehicles={vehicles} onSelect={setSelected} onAdd={handleAddClick} />
      </div>

      {!loading && (
        <div className="border-t pt-6 space-y-6">
          <div className=" gap-6">
            <div className="lg:col-span-1">
              <VehicleDetails 
                vehicle={selected} 
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            </div>
            <div className="lg:col-span-2">
              
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h4>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingVehicle(null);
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <VehicleForm 
              initial={editingVehicle ? {
                model: editingVehicle.model,
                color: editingVehicle.color,
                vin: editingVehicle.vin,
                licensePlate: editingVehicle.licensePlate,
                year: editingVehicle.year,
                registrationDate: editingVehicle.registrationDate,
                imagePreview: editingVehicle.imageUrl,
              } : undefined}
              onSubmit={handleSubmit} 
              onCancel={() => {
                setShowForm(false);
                setEditingVehicle(null);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
