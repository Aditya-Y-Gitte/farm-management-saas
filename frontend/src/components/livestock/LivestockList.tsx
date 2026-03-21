// LivestockList.tsx
import React, { useEffect, useState } from 'react';
import { getLivestocks } from '../../services/livestockService';
import { Livestock } from '../../types/livestock';

interface LivestockListProps {
    refresh: boolean;
}

const LivestockList: React.FC<LivestockListProps> = ({ refresh }) => {
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);

    useEffect(() => {
        const fetchLivestocks = async () => {
            const data = await getLivestocks();
            setLivestocks(data);
        };
        fetchLivestocks();
    }, [refresh]);

    return (
        <div>
            <h2>Livestock</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Breed</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>
                    {livestocks.map((livestock) => (
                        <tr key={livestock.id}>
                            <td>{livestock.name}</td>
                            <td>{livestock.species}</td>
                            <td>{livestock.breed}</td>
                            <td>{new Date(livestock.dateOfBirth).toLocaleDateString()}</td>
                            <td>{livestock.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivestockList;
