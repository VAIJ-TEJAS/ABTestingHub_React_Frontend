import { BarChartOutlined } from '@ant-design/icons'
import { Paper } from '@mui/material'

export const StatisticCard = () => {
    return (
        <Paper className='mt-4 hover:shadow-lg'>
            <div className='w-64 h-28 relative'>
                <div className='absolute flex justify-between items-end w-full px-4 -mt-1'>
                    <div className='h-14 w-14 flex justify-center items-center bg-primary rounded shadow shadow-primary -mt-2'>
                        <BarChartOutlined className='text-white text-3xl' />
                    </div>
                    <div className='text-zinc-500 text-end -mb-2'>
                        Total Incremental Revenue
                    </div>
                </div>
                <div className='flex w-full h-full justify-center items-center pt-8 text-4xl font-medium'>
                    3,453
                </div>
            </div>
        </Paper>
    )
}
