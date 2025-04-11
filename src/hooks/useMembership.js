import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useMembership() {
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
    
    const updatedUser = {
      ...currentUser,
      membership: {
        ...currentUser.membership,
        type: newMembershipType,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        // Reset bids based on membership type
        bidsRemaining: newMembershipType === "Basic" ? 10 : 
                       newMembershipType === "Premium" ? 30 : 9999
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

  return {
    membershipStatus,
    upgradeMembership,
    useBid
  };
}
