import { StatisticCard } from '../components/StatisticCard';


export const Dashboard = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-[#ff000050]'>
      <div className='container'>
        <div className='flex gap-4 p-4 justify-center'>
          <StatisticCard/>
          <StatisticCard/>
          <StatisticCard/>
          <StatisticCard/>
          <StatisticCard/>
        </div>
      </div>
      <div className='container flex justify-between my-8'>
        <div>
          Search
        </div>
        <div className='flex'>
          <div>Create</div>
          <div>Export</div>
        </div>
      </div>
    </div>
  );
};
