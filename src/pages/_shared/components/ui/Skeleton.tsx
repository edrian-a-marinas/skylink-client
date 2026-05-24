import React from "react";

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`bg-gray-200/60 animate-pulse rounded ${className}`} />
  );
};

export default Skeleton;
