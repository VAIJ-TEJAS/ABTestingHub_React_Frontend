/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  Space,
  Alert,
  Typography,
  Divider,
} from "antd";
import { CloseSharp, LogoutOutlined, WarningOutlined } from "@mui/icons-material";
import { Context } from "../context/context.provider";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { confirmation } from "./Confirmation";

const { Text, Paragraph } = Typography;

interface LogoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  showWarning?: boolean;
  redirectPath?: string;
}

export const Logout: React.FC<LogoutModalProps> = ({
  isVisible,
  onClose,
  showWarning = true,
  redirectPath = "/home",
}) => {
  const { signOutUser, username } = Context();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutReason, setLogoutReason] = useState<string>("");

  useEffect(() => {
    if (isVisible) {
      setCountdown(null);
      setIsLoggingOut(false);
      setLogoutReason("");
    }
  }, [isVisible]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      handleConfirmLogout();
    }
  }, [countdown]);

  const handleConfirmLogout = useCallback(async () => {
    setIsLoggingOut(true);
    
    try {
      // Clear any pending operations
      const pendingRequests = localStorage.getItem('pendingRequests');
      if (pendingRequests) {
        try {
          const requests = JSON.parse(pendingRequests);
          console.log('Clearing pending requests:', requests);
          localStorage.removeItem('pendingRequests');
        } catch (e) {
          console.error('Error clearing pending requests:', e);
        }
      }

      // Clear user data
      localStorage.removeItem('abtestinghub-access-token');
      localStorage.removeItem('ab_testing_hub_username');
      localStorage.removeItem('abtestinghub-currency');
      
      // Call sign out function
      signOutUser();
      
      // Show success message
      setTimeout(() => {
        navigate(redirectPath);
        onClose();
        setIsLoggingOut(false);
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }, [signOutUser, navigate, redirectPath, onClose]);

  const handleLogoutClick = useCallback(async () => {
    if (showWarning) {
      const confirmed = await confirmation("Are you sure you want to logout?");
      if (!confirmed) {
        return;
      }
    }
    handleConfirmLogout();
  }, [showWarning, handleConfirmLogout]);

  const handleCancel = useCallback(() => {
    if (countdown !== null) {
      setCountdown(null);
    }
    onClose();
  }, [countdown, onClose]);

  const handleStartCountdown = useCallback(() => {
    setCountdown(5);
  }, []);

  const handleReasonChange = useCallback((reason: string) => {
    setLogoutReason(reason);
  }, []);

  const logoutReasons = [
    "Session timeout",
    "Security concern",
    "Switching accounts",
    "Other",
  ];

  return (
    <Modal
      open={isVisible}
      onCancel={handleCancel}
      closeIcon={false}
      footer={null}
      width={500}
      styles={{
        content: {
          padding: "0px 0px",
          borderRadius: "16px",
        },
      }}
      maskClosable={false}
    >
      <div className="border-4 border-secondary rounded-xl p-8">
        <div className="pb-4 flex flex-col gap-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LogoutOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
              <Text strong style={{ fontSize: '20px' }}>Confirm Logout</Text>
            </div>
            <CloseSharp 
              className="hover:text-primary hover:cursor-pointer" 
              onClick={handleCancel}
              style={{ fontSize: '24px' }}
            />
          </div>

          {username && (
            <Alert
              message={`Logged in as: ${username}`}
              type="info"
              showIcon
              closable={false}
            />
          )}

          {showWarning && (
            <Alert
              message="Warning"
              description="You will be logged out and any unsaved changes will be lost."
              type="warning"
              icon={<WarningOutlined />}
              showIcon
            />
          )}

          <div className="text-xl text-center">
            Are you sure you want to log out?
          </div>

          {countdown !== null && (
            <Alert
              message={`Logging out in ${countdown} seconds...`}
              type="warning"
              showIcon
              action={
                <Button size="small" onClick={() => setCountdown(null)}>
                  Cancel
                </Button>
              }
            />
          )}

          <Divider />

          <div className="flex flex-col gap-2">
            <Text strong>Reason for logout (optional):</Text>
            <Space direction="vertical" style={{ width: '100%' }}>
              {logoutReasons.map((reason) => (
                <Button
                  key={reason}
                  block
                  type={logoutReason === reason ? "primary" : "default"}
                  onClick={() => handleReasonChange(reason)}
                >
                  {reason}
                </Button>
              ))}
            </Space>
          </div>

          <Divider />

          <div className="flex gap-4">
            <Button 
              size="large" 
              className="flex-1" 
              onClick={handleCancel}
              disabled={isLoggingOut || countdown !== null}
            >
              Cancel
            </Button>
            <Button
              size="large"
              className="flex-1"
              danger
              type="primary"
              onClick={handleLogoutClick}
              loading={isLoggingOut}
              disabled={countdown !== null}
              icon={<LogoutOutlined />}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              type="link"
              size="small"
              onClick={handleStartCountdown}
              disabled={countdown !== null || isLoggingOut}
            >
              Auto-logout in 5 seconds
            </Button>
          </div>

          {logoutReason && (
            <Paragraph type="secondary" style={{ fontSize: '12px', margin: 0 }}>
              Reason: {logoutReason}
            </Paragraph>
          )}
        </div>
      </div>
    </Modal>
  );
};
