/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatisticCard } from '../components/StatisticCard';
import { Table, Input, Button, Space, Tag } from 'antd';
import { FileExcelOutlined, PlusOutlined } from '@ant-design/icons';
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
    // Add the rest of the properties like sorting, filtering if needed
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
    title: 'AB Test - Results',
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
  // ... Add more data here
];

export const Dashboard = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-[#f5f5f5]'>
      <div className='container'>
        <div className='flex gap-4 p-4 justify-center'>
          <StatisticCard />
          <StatisticCard />
          <StatisticCard />
          <StatisticCard />
          <StatisticCard />
        </div>
      </div>
      <div className='container justify-between my-8'>
        <div className='flex justify-between'>
          <div>
            <Input/>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>New Hypothesis</Button>
            <Button icon={<FileExcelOutlined />}>Export</Button>
          </Space>
        </div>
      </div>
      <Paper className='container'>
        <Table columns={columns} dataSource={data} className='' />
      </Paper>
    </div>
  );
};
