import React from 'react';
import type { Project } from '@/types/models';
import type { Pets } from '@/services/data';
import { formatEnglishLabel } from '@/lib/utils';
import './Sidebar.css';

interface SidebarProps {
    project: Project;
    petsList: Pets[];
    currentVehicle: string;
    onVehicleChange: (vehicle: string) => void;
    selectedPets: string[];
    onPetsToggle: (petsId: string) => void;
    activePetsId: string | null;
    onPetsClick: (petsId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    project,
    petsList,
    currentVehicle,
    onVehicleChange,
    selectedPets,
    onPetsToggle,
    activePetsId,
    onPetsClick
}) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <label className="form-label text-xs mb-1">当前分析车型</label>
                <select
                    className="vehicle-select"
                    value={currentVehicle}
                    onChange={(e) => onVehicleChange(e.target.value)}
                >
                    {project.vehicles.map(v => (
                        <option key={v} value={v}>
                            {formatEnglishLabel(v)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="section-title">
                    <span>Pets 维度 ({selectedPets.length})</span>
                </div>

                <div className="pets-list">
                    {petsList.map(pet => (
                        <div
                            key={pet.id}
                            className={`pets-item ${activePetsId === pet.id ? 'active' : ''}`}
                            onClick={() => onPetsClick(pet.id)}
                        >
                            <input
                                type="checkbox"
                                className="pets-checkbox"
                                checked={selectedPets.includes(pet.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onPetsToggle(pet.id);
                                }}
                            />
                            <span>{pet.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
