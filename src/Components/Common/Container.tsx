import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1340px] mx-auto px-5 lg:px-7 2xl:px-10">
      {children}
    </div>
  );
};

export default Container;
