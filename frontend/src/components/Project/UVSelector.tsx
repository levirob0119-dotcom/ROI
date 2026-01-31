import React, { useMemo } from 'react';
import type { UVL1 } from '@/services/data';
import './UVSelector.css';

interface UVSelectorProps {
    uvData: UVL1[];
    selectedUVs: string[]; // List of selected UV L2 Names
    onToggleUV: (uvL2Name: string) => void;
}

const UVSelector: React.FC<UVSelectorProps> = ({
    uvData,
    selectedUVs,
    onToggleUV
}) => {
    // Filter out empty groups if any
    const validGroups = useMemo(() => {
        return uvData.filter(l1 => l1.l2_items.length > 0);
    }, [uvData]);

    return (
        <div className="uv-selector">
            {validGroups.map(l1 => (
                <div key={l1.l1_id} className="uv-l1-group">
                    <div className="uv-l1-header">
                        {l1.l1_name}
                    </div>
                    <div className="uv-l2-grid">
                        {l1.l2_items.map(l2 => (
                            <div
                                key={l2.id}
                                className="uv-l2-item"
                                onClick={() => onToggleUV(l2.name)}
                            >
                                <input
                                    type="checkbox"
                                    className="uv-l2-checkbox"
                                    checked={selectedUVs.includes(l2.name)}
                                    onChange={() => { }} // Handle by parent div click
                                />
                                <span className="uv-l2-label">{l2.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UVSelector;
