import React from "react";

const DashboardSkeleton = () => {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <div className="skeleton skeleton-box" style={{ flex: 1 }}></div>
        <div className="skeleton skeleton-box" style={{ flex: 1 }}></div>
        <div className="skeleton skeleton-box" style={{ flex: 1 }}></div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div className="skeleton skeleton-search"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
      <div>
        {Array(5)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="skeleton skeleton-table-row"
              style={{ width: "100%" }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
