import { FaSpinner } from "react-icons/fa";

export default function Spinner() {
  return (
    <div className="flex h-[50vh] w-full justify-center items-center">
      <FaSpinner className="animate-spin h-[40px] w-[40px] opacity-80" />
    </div>
  );
}
