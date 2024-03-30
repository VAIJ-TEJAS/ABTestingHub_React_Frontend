import { ReactNode } from 'react';
import CountUp from 'react-countup';
import { Paper } from '@mui/material';

interface StatisticCardProps {
    amount: number;
    icon: ReactNode;
    bgColor: string;
    title: string;
    prefix?: string;
}

export const StatisticCard = ({ amount, icon, bgColor, title, prefix }: StatisticCardProps) => {
    return (
        <Paper className='mt-4 hover:shadow-lg'>
            <div className='w-64 h-28 relative'>
                <div className='absolute flex justify-between items-center w-full px-4 '>
                    <div className={`flex-shrink-0 h-14 w-14 flex justify-center items-center ${bgColor} rounded shadow -mt-2`}>
                        {icon}
                    </div>
                    <div className='text-zinc-500 text-center -mb-2 '>
                        {title}
                    </div>
                </div>
                <div className='flex w-full h-full justify-center items-center pt-12 text-4xl font-medium'>
                    <CountUp start={0} end={amount ?? 0} duration={0.5} separator="," prefix={prefix}/>
                </div>
            </div>
        </Paper>
    );
};
