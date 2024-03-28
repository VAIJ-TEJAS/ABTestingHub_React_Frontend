import { ReactNode } from 'react';
import { Paper } from '@mui/material';

interface StatisticCardProps {
    amount: string;
    icon: ReactNode;
    bgColor: string;
    title: string;
}

export const StatisticCard = ({ amount, icon, bgColor, title }: StatisticCardProps) => {
    return (
        <Paper className='mt-4 hover:shadow-lg'>
            <div className='w-64 h-28 relative'>
                <div className='absolute flex justify-between items-center w-full px-4 '>
                    <div className={`h-14 w-14 flex justify-center items-center ${bgColor} rounded shadow -mt-2`}>
                        {icon}
                    </div>
                    <div className='absolutetext-zinc-500 text-center -mb-2 '>
                        {title}
                    </div>
                </div>
                <div className='flex w-full h-full justify-center items-center pt-12 text-4xl font-medium'>
                    {amount}
                </div>
            </div>
        </Paper>
    );
};
