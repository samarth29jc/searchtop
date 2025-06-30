import React from "react";
import { useLocation, Link } from "react-router-dom";
import Icon from "../media/icon/icons";

function BreadCrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Breadcrumb Mapping
  const breadcrumbMapping = {
    home: "Dashboard > Overview",
    managemerchant: "Management > Manage Merchant",
    viewmerchant: "Management > Manage Merchant > View Merchant",
    manageuser: "Management > Manage User",
    managemid: "Management > Manage MID",
    transactionmonitoring: "Transactions > Transaction Monitoring",
  };

  // Find the last known route in the mapping
  const lastKnownRoute = pathSegments.find(
    (segment) =>
      breadcrumbMapping[segment] || segment.match(/(viewmerchant|manageuser)\/\d+/)
  );

  // Determine Display Text for Breadcrumbs
  const displayText =
    breadcrumbMapping[lastKnownRoute?.split("/")[0]] || "Dashboard";

  return (
    <div className="breadcrumb-container">
      {displayText.split(" > ").map((segment, index, arr) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === arr.length - 1;

        return (
          <React.Fragment key={index}>
            {!isLast ? (
              <Link to={path} className="breadcrumb-link">
                {segment}
              </Link>
            ) : (
              <span className="breadcrumb-current">{segment}</span>
            )}
            {index !== arr.length - 1 && (
              <span className="breadcrumb-separator">
                <Icon name="arrow_full_right" height={24} width={24} color="#888" />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default BreadCrumb;
