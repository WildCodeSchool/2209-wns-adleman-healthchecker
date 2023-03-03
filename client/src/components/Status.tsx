import { FcApproval, FcHighPriority, FcMediumPriority } from "react-icons/fc";

interface IconStatusProps {
  status: number;
}

const IconStatus: React.FC<IconStatusProps> = ({ status }) => {
  if (status && 200 <= status && status <= 299)
    return <span className="status good">{status}</span>;
  if (status && 300 <= status && status <= 499)
    return <span className="status medium">{status}</span>;
  if (status && 500 <= status && status <= 599)
    return <span className="status not-good">{status}</span>;
  return <></>;
};
export default IconStatus;
