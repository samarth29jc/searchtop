import React from "react";
import { useNavigate } from "react-router-dom"; 
import Icon from "../../media/icon/icons";

export const headings = {
    dashboard: "Dashboard",
    mail: "Email Templates",
    mmerchant: "Manage Client",
    msettlement: "Manage Settlement",
    muser: "Manage User",
    mmid: "Manage Mid",
    crefund: "Create Refund",
    transaction: "Transaction Monitoring",
    vmerchant: "View Profile",
    vuser: "View User",
    viewrefund: "View Refund",
    payout: "Payout",
};

const Heading = ({ heading, showIcon = false }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); 
    };

    const validatedHeading = typeof heading === "string" ? heading : "Default Heading";

    return (
        <div className="manage-main-head">
            {showIcon && validatedHeading !== headings.dashboard && (
                <div className="back-to-previous">
                    <Icon
                        name="back_arrow"
                        color="#00478f"
                        onClick={handleBack}
                        width={18}
                        height={18}
                    />
                </div>
            )}
            <h4>{validatedHeading}</h4>
        </div>
    );
};

export default Heading;
