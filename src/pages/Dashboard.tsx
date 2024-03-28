/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatisticCard } from '../components/StatisticCard';
import { Table, Input, Button, Space, Tag } from 'antd';
import { PlusOutlined, BarChartOutlined, SearchOutlined, RocketOutlined, DollarCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ITest } from '../types/test.types';

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

export const Dashboard = () => {

  const [testsData, setTestsData] = useState([]);
  const navigate = useNavigate()

  const paginationConfig = {
    pageSize: 8,
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
    render: (text: string, record: ITest) => {
      if (text === 'N/A') {
        // Determine the route based on the proportional_metric attribute
        const route = record.proportional_metric ? '/proportional-metric-testing' : '/continuous-metric-testing';
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(route, { state: { testId: record.id } })}
          >
            MSS
          </Button>
        );
      } else {
        return text;
      }
    },
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

  useEffect(() => {
    // Function to fetch data using axios
    const fetchTestsData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tests/', {
          headers: {
            'Authorization': 'Token ' + localStorage.getItem('abtestinghub-access-token')
          }
        }
        );
        setTestsData(response.data);
      } catch (error) {
        console.error("Failed to fetch tests data:", error);
      }
    };
    fetchTestsData();
  }, []);

  const dataSource = testsData.map((test: ITest) => ({
    id: test.id,
    hypothesisName: test.name,
    description: test.description ?? 'Description not provided',
    status: test.status ?? 'Status not available', 
    integrity: test.integrity, 
    lastModifiedDate: test.modified_date,
    mssDuration: (test?.total_sample_size && test?.days_required) ? test?.total_sample_size + ' | ' + test?.days_required : 'N/A', 
    revenueImpact: (test?.control_revenue && test?.test_revenue) ? (((test.test_revenue - test.control_revenue) / test.control_revenue) * 100).toFixed(2) : 'N/A',
    abTestResults: 'N/A', 
    proportional_metric: test.proportional_metric
  }));

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
            title="Results"
          />
        </div>
      </div>
      <div className='container my-8'>
        <div className='flex justify-between'>
          <div className='w-60'>
            <Input.Search placeholder='Search' />
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              navigate('/create-test')
            }}>New Hypothesis</Button>
            {/* <Button icon={<FileExcelOutlined />}>Export</Button> */}
          </Space>
        </div>
      </div>
      <Paper className='container '>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={paginationConfig}
        />
      </Paper>
    </div>
  );
};
