import React from "react";

const MembershipBadge = ({ type }) => {
  let badgeColor, badgeText;
  
  switch (type) {
    case "Premium":
      badgeColor = "bg-purple-100 text-purple-800 border-purple-200";
      badgeText = "Premium";
      break;
    case "Pro":
      badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
      badgeText = "Pro";
      break;
    default:
      return null; // Don't show badge for Basic members
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${badgeColor}`}>
      {badgeText}
    </span>
  );
};

export default MembershipBadge;
