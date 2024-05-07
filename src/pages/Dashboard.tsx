/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatisticCard } from "../components/StatisticCard";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Menu,
  Dropdown,
  message,
  Select,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  RocketOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ITest } from "../types/test.types";
import { confirmation } from "../components/Confirmation";
import { Option } from "antd/es/mentions";

const getTagColor = (status: string) => {
  switch (status) {
    case "APPR":
      return "red";
    case "INPR":
      return "yellow";
    case "CONC":
      return "green";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "APPR":
      return "Approved";
    case "INPR":
      return "In Progress";
    case "CONC":
      return "Concluded";
    default:
      return status;
  }
};

export const Dashboard = () => {
  const [totalHypotheses, setTotalHypotheses] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [concluded, setConcluded] = useState<number>(0);
  const [totalIncrementalRevenue, setTotalIncrementalRevenue] =
    useState<number>(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [testsData, setTestsData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();

  const paginationConfig = {
    pageSize: 8,
  };

  const fetchAllTestsData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/tests/`, {
        headers: {
          Authorization:
            "Token " + localStorage.getItem("abtestinghub-access-token"),
        },
      });

      const tests = response.data;
      setTestsData(tests);

      // Calculate the values for the cards
      setTotalHypotheses(tests.length);
      setInProgress(tests.filter((test: any) => test.status === "INPR").length);
      setConcluded(tests.filter((test: any) => test.status === "CONC").length);

      const totalRevenueImpact = tests.reduce((acc: number, test: any) => {
        const impact = test.revenue_impact || 0; // Assuming revenue_impact is already a number
        return acc + impact;
      }, 0);

      setTotalIncrementalRevenue(totalRevenueImpact);
    } catch (error) {
      console.error("Failed to fetch tests data:", error);
    }
  };

  const fetchTestsData = async (searchTerm = "") => {
    const queryParam = searchTerm ? `?search=${searchTerm}` : "";
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tests/${queryParam}`,
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
      console.log(response.data);
      setTestsData(response.data);
    } catch (error) {
      console.error("Failed to fetch tests data:", error);
    }
  };

  const handleSearch = (searchTerm: string) => {
    fetchTestsData(searchTerm);
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTestsData(searchTerm);
    }, 300); // Delay for debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    fetchAllTestsData();
  }, []);

  const handleEditTest = (testId: number) => {
    // Navigate to create test page with testId as state
    navigate("/create-test", { state: { testId } });
  };

  const handleDeleteTest = async (testId: number) => {
    const isConfirmed = await confirmation(
      "Are you sure you want to delete this test?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/tests/${testId}/`, {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        });

        fetchTestsData();
        message.success("Test deleted successfully");
      } catch (error) {
        console.error("Failed to delete the test:", error);
      }
    }
  };

  const menu = (record: any) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEditTest(record.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleDeleteTest(record.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleMassDelete = async () => {
    const isConfirmed = await confirmation(
      "Are you sure you want to delete the selected tests?"
    );
    if (isConfirmed) {
      try {
        await Promise.all(
          selectedRowKeys.map((testId) =>
            axios.delete(`${import.meta.env.VITE_BASE_URL}/tests/${testId}/`, {
              headers: {
                Authorization:
                  "Token " + localStorage.getItem("abtestinghub-access-token"),
              },
            })
          )
        );
        setSelectedRowKeys([]);
        fetchTestsData();
        message.success("Selected tests deleted successfully");
      } catch (error) {
        console.error("Failed to delete selected tests:", error);
      }
    }
  };

  const [editStatusTestId, setEditStatusTestId] = useState<number | null>(null);

  const handleStatusEdit = (testId: number) => {
    setEditStatusTestId(testId); // Set the current editing row by testId
  };

  const updateTestStatus = async (testId: number, newStatus: string) => {
    const isConfirmed = await confirmation(
      `Are you sure you want to change the status to ${getStatusLabel(
        newStatus
      )}?`
    );
    if (!isConfirmed) {
      // If not confirmed, revert the status dropdown to the original status and exit
      setEditStatusTestId(null);
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/tests/${testId}/`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization:
              "Token " + localStorage.getItem("abtestinghub-access-token"),
          },
        }
      );
      if (response.status === 200) {
        message.success("Status updated successfully");
        fetchTestsData(); // Refresh data
        setEditStatusTestId(null); // Exit editing mode
      }
    } catch (error) {
      console.error("Failed to update the status:", error);
      message.error("Failed to update status");
    }
  };

  const rowSelection = {
    selectedRowKeys, // This already matches the expected type
    onChange: (selectedKeys: React.Key[]) => {
      // Now this matches the expected signature, including the selectedRows parameter
      setSelectedRowKeys(selectedKeys);
    },
  };

  const columns: any = [
    {
      title: "Hypothesis Name",
      dataIndex: "hypothesisName",
      key: "hypothesisName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string, record: ITest) => {
        if (editStatusTestId === record.id) {
          // If the current row is in edit mode, show the dropdown
          return (
            <Select
              defaultValue={status}
              style={{ width: 120 }}
              onChange={(newStatus) => updateTestStatus(record.id, newStatus)}
              onBlur={() => setEditStatusTestId(null)} // Exit edit mode when the dropdown loses focus
            >
              <Option value="APPR">{getStatusLabel("APPR")}</Option>
              <Option value="INPR">{getStatusLabel("INPR")}</Option>
              <Option value="CONC">{getStatusLabel("CONC")}</Option>
              // Add more options as needed
            </Select>
          );
        } else {
          return (
            <div
              className="cursor-pointer hover:shadow-lg"
              onClick={() => handleStatusEdit(record.id)}
            >
              <Tag className="w-full text-center" color={getTagColor(status)}>
                {getStatusLabel(status)}
              </Tag>
            </div>
          );
        }
      },
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
    },
    {
      title: "MSS | Duration",
      dataIndex: "mssDuration",
      key: "mssDuration",
      render: (text: string, record: ITest) => {
        // Determine the route based on the proportional_metric attribute
        const route = record.proportional_metric
          ? "/proportional-metric-testing"
          : "/continuous-metric-testing";
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(route, { state: { testId: record.id } })}
          >
            {text === "N/A" ? "MSS" : text}
          </Button>
        );
      },
    },
    {
      title: "Revenue Impact",
      dataIndex: "revenueImpact",
      key: "revenueImpact",
      render: (revenueImpact: number) => (
        <span
          className={`font-medium ${
            revenueImpact < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {revenueImpact}
        </span>
      ),
    },
    {
      title: "A/B Test - Results",
      dataIndex: "abTestResults",
      key: "abTestResults",
      render: (text: string, record: ITest) => {
        const route = "/ab-testing";
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(route, { state: { testId: record.id } })}
          >
            {text === "N/A" ? "A/B" : text}
          </Button>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: any) => (
        <Dropdown overlay={() => menu(record)} trigger={["click"]}>
          <Button shape="circle" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const dataSource = testsData.map((test: ITest) => ({
    id: test.id,
    key: test.id,
    hypothesisName: test.name,
    description: test.description ?? "Description not provided",
    status: test.status ?? "Status not available",
    lastModifiedDate: test.modified_date,
    mssDuration:
      test?.total_sample_size && test?.days_required
        ? test?.total_sample_size.toLocaleString() +
          " | " +
          test?.days_required +
          " days"
        : "N/A",
    revenueImpact: test?.revenue_impact ? " ₹ " + Math.round(test.revenue_impact) : "N/A",
    abTestResults:
      test?.max_uplift
        ? (test?.statistically_significant ? "Significant" : "Insignificant") +
          " | " +
          test?.max_uplift
        : "N/A",
    proportional_metric: test.proportional_metric,
  }));

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="flex-grow-0 container">
        <div className="flex gap-4 p-4 justify-center">
          <StatisticCard
            amount={totalHypotheses}
            icon={<SearchOutlined className="text-white text-3xl" />}
            bgColor="bg-primary"
            title="Total Hypothesis"
          />
          <StatisticCard
            amount={inProgress}
            icon={<RocketOutlined className="text-white text-3xl" />}
            bgColor="bg-red-600"
            title="In Progress"
          />
          <StatisticCard
            amount={concluded}
            icon={<CheckCircleOutlined className="text-white text-3xl" />}
            bgColor="bg-yellow-500"
            title="Results"
          />
          <StatisticCard
            amount={totalIncrementalRevenue}
            icon={<DollarCircleOutlined className="text-white text-3xl" />}
            bgColor="bg-green-600"
            title="Total Incremental Revenue"
            prefix="₹"
          />
        </div>
      </div>
      <div className="container my-8">
        <div className="flex justify-between">
          <div className="w-60">
            <Input.Search
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />
          </div>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                navigate("/create-test");
              }}
            >
              New Hypothesis
            </Button>
            {/* <Button icon={<FileExcelOutlined />}>Export</Button> */}
          </Space>
        </div>
      </div>
      <div className="flex container">
        {selectedRowKeys.length > 0 && (
          <div className="p-2">
            <Button
              danger
              onClick={handleMassDelete}
              disabled={!selectedRowKeys.length}
              type="primary"
              icon={<DeleteOutlined />}
            />
          </div>
        )}
        <Paper className="container flex-1">
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={paginationConfig}
          />
        </Paper>
      </div>
    </div>
  );
};
