/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
} from "antd";
import { CloseSharp } from "@mui/icons-material";
import { Context } from "../context/context.provider";

interface CreateTestModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Logout: React.FC<CreateTestModalProps> = ({
  isVisible,
  onClose
}) => {

  const { signOutUser } = Context();

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      closeIcon={false}
      footer={null}
      
      styles={{
        content: {
          padding: "0px 0px",
          borderRadius: "16px",
        },
      }}
    >
      <div className="border-4 border-secondary rounded-xl p-8">
        <div className="pb-4 flex flex-col gap-4">
          <div className="w-ful flex justify-end">
            <CloseSharp className="hover:text-primary hover:cursor-pointer" onClick={onClose}/>
          </div>
          <div className="text-2xl text-center inline-flex w-full justify-center">
            Are you sure you want to Log out?
          </div>
          <div className="flex gap-8">
            <Button size="large" className="w-full" onClick={onClose}>
                Cancel 
            </Button>
            <Button size="large" className="w-full" danger type="primary" onClick={signOutUser}>
                Logout 
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
