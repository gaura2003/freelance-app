import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MembershipContext = createContext();

export const MembershipProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const [membershipStatus, setMembershipStatus] = useState({
    isActive: false,
    type: "Basic",
    daysRemaining: 0,
    bidsRemaining: 0
  });

  useEffect(() => {
    if (currentUser && currentUser.membership) {
      const endDate = new Date(currentUser.membership.endDate);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setMembershipStatus({
        isActive: diffDays > 0,
        type: currentUser.membership.type,
        daysRemaining: diffDays > 0 ? diffDays : 0,
        bidsRemaining: currentUser.membership.bidsRemaining || 0
      });
    }
  }, [currentUser]);

  const upgradeMembership = (newMembershipType, duration = 1) => {
    if (!currentUser) return false;
    
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + duration);
    
    // Set bids based on membership type
    let bidsRemaining;
    switch (newMembershipType) {
      case "Premium":
        bidsRemaining = 30;
        break;
      case "Pro":
        bidsRemaining = 9999; // Unlimited
        break;
      default:
        bidsRemaining = 10; // Basic
    }
    
    const updatedUser = {
      ...currentUser,
      membership: {
        ...currentUser.membership,
        type: newMembershipType,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        bidsRemaining,
        autoRenew: currentUser.membership?.autoRenew || false
      }
    };
    
    setCurrentUser(updatedUser);
    return true;
  };

  const useBid = () => {
    if (!currentUser || !membershipStatus.isActive || membershipStatus.bidsRemaining <= 0) {
      return false;
    }
    
    const updatedUser = {
      ...currentUser,
      membership: {
        ...currentUser.membership,
        bidsRemaining: currentUser.membership.bidsRemaining - 1
      }
    };
    
    setCurrentUser(updatedUser);
    return true;
  };

  return (
    <MembershipContext.Provider value={{ membershipStatus, upgradeMembership, useBid }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembershipContext = () => useContext(MembershipContext);
