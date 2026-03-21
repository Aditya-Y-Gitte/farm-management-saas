// DairyList.tsx
import React, { useEffect, useState } from 'react';
import { getDairies } from '../../services/dairyService';
import { Dairy } from '../../types/dairy';

interface DairyListProps {
    refresh: boolean;
}

const DairyList: React.FC<DairyListProps> = ({ refresh }) => {
    const [dairies, setDairies] = useState<Dairy[]>([]);

    useEffect(() => {
        const fetchDairies = async () => {
            const data = await getDairies();
            setDairies(data);
        };
        fetchDairies();
    }, [refresh]);

    return (
        <div>
            <h2>Dairy Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Milk Yield</th>
                        <th>Fat Content</th>
                        <th>Protein Content</th>
                        <th>Quality</th>
                    </tr>
                </thead>
                <tbody>
                    {dairies.map((dairy) => (
                        <tr key={dairy.id}>
                            <td>{new Date(dairy.date).toLocaleDateString()}</td>
                            <td>{dairy.milkYield}</td>
                            <td>{dairy.fatContent}</td>
                            <td>{dairy.proteinContent}</td>
                            <td>{dairy.quality}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DairyList;
