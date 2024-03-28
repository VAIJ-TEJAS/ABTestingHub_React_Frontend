/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatisticCard } from '../components/StatisticCard';
import { Table, Input, Button, Space, Tag } from 'antd';
import { PlusOutlined, BarChartOutlined, SearchOutlined, RocketOutlined, DollarCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Paper } from '@mui/material';

const getTagColor = (status: any) => {
  switch (status) {
    case 'Concluded':
      return 'volcano';
    case 'In-progress':
      return 'green';
    case 'Aborted':
      return 'red';
    default:
      return 'default';
  }
};

const columns = [
  {
    title: 'Hypothesis Name',
    dataIndex: 'hypothesisName',
    key: 'hypothesisName',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Experiment ID',
    dataIndex: 'experimentId',
    key: 'experimentId',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status: any) => (
      <Tag color={getTagColor(status)}>{status}</Tag>
    ),
  },
  {
    title: 'Integrity',
    key: 'integrity',
    dataIndex: 'integrity',
    render: (integrity: any) => (
      <span>{integrity ? <Tag color="green">High</Tag> : <Tag color="volcano">Low</Tag>}</span>
    ),
  },
  {
    title: 'Last Modified Date',
    dataIndex: 'lastModifiedDate',
    key: 'lastModifiedDate',
  },
  {
    title: 'MSS | Duration',
    dataIndex: 'mssDuration',
    key: 'mssDuration',
  },
  {
    title: 'Revenue Impact',
    dataIndex: 'revenueImpact',
    key: 'revenueImpact',
  },
  {
    title: 'A/B Test - Results',
    dataIndex: 'abTestResults',
    key: 'abTestResults',
  },
];

const data = [
  {
    key: '1',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '2',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '3',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },

  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
  {
    key: '4',
    hypothesisName: 'test_price_alert_01',
    description: 'Price change alert changes.',
    experimentId: '123456',
    status: 'Concluded',
    integrity: true,
    lastModifiedDate: '2024-01-03 07:42:11',
    mssDuration: '22,000 | 7 days',
    revenueImpact: '$ 25,000',
    abTestResults: 'Significant | relative uplift: 20%',
  },
];

export const Dashboard = () => {

  const paginationConfig = {
    pageSize: 8, // Set the number of items per page
  };

  return (
    <div className='flex flex-col justify-center items-center bg-[#f5f5f5] p-4'>
      <div className='flex-grow-0 container'>
        <div className='flex gap-4 p-4 justify-center'>
          <StatisticCard
            amount="874"
            icon={<SearchOutlined className='text-white text-3xl' />}
            bgColor="bg-primary" // This should be a tailwind css color class or a custom class defined by you
            title="Total Hypothesis"
          />
          <StatisticCard
            amount="311"
            icon={<RocketOutlined className='text-white text-3xl' />}
            bgColor="bg-red-600" // This should be a tailwind css color class or a custom class defined by you
            title="Prompted to Experiment"
          />
          <StatisticCard
            amount="₹ 235,522"
            icon={<DollarCircleOutlined className='text-white text-3xl' />}
            bgColor="bg-green-600" // This should be a tailwind css color class or a custom class defined by you
            title="Total Incremental Revenue"
          />
          <StatisticCard
            amount="160"
            icon={<BarChartOutlined className='text-white text-3xl' />}
            bgColor="bg-yellow-500" // This should be a tailwind css color class or a custom class defined by you
            title="Biased"
          />
          <StatisticCard
            amount="281"
            icon={<CheckCircleOutlined className='text-white text-3xl' />}
            bgColor="bg-primary" // This should be a tailwind css color class or a custom class defined by you
            title="Concluded"
          />
        </div>
      </div>
      <div className='container my-8'>
        <div className='flex justify-between'>
          <div className='w-60'>
            <Input />
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>New Hypothesis</Button>
            {/* <Button icon={<FileExcelOutlined />}>Export</Button> */}
          </Space>
        </div>
      </div>
      <Paper className='container '>
        <Table
          columns={columns}
          dataSource={data}
          pagination={paginationConfig}
        />
      </Paper>
    </div>
  );
};
