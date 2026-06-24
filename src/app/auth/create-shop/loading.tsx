import { PuffLoader } from "react-spinners";

const loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <PuffLoader color="#274f45" />
    </div>
  );
};

export default loading;
