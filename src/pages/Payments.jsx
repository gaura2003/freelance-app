import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  DollarSign, Calendar, CreditCard, Clock, CheckCircle, 
  XCircle, AlertTriangle, Download, Filter, ChevronDown, ChevronUp 
} from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    paymentType: "",
    dateRange: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: "paymentDate",
    direction: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${apiBase}/payments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          throw new Error("Failed to fetch payments");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to load payments. Please try again later.");
        
        // DUMMY fallback data based on the Payment model
        setPayments([
          {
            _id: "pay1",
            userId: "u1",
            projectId: "p1",
            contractId: "c1",
            milestoneId: "m1",
            amount: 750,
            currency: "USD",
            paymentMethod: "credit_card",
            paymentType: "milestone",
            description: "First milestone payment for website redesign",
            paymentStatus: "completed",
            transactionId: "txn_123456789",
            paymentDate: "2023-10-15T14:30:00Z",
            platformFee: 37.5,
            taxAmount: 0,
            invoiceId: "INV-2023-001",
            project: {
              title: "E-commerce Website Redesign"
            },
            client: {
              fullName: "Jane Smith",
              profileImageUrl: "https://i.pravatar.cc/150?img=2"
            }
          },
          {
            _id: "pay2",
            userId: "u1",
            projectId: "p2",
            contractId: "c2",
            amount: 250,
            currency: "USD",
            paymentMethod: "paypal",
            paymentType: "deposit",
            description: "Initial deposit for mobile app development",
            paymentStatus: "pending",
            paymentDate: null,
            platformFee: 12.5,
            taxAmount: 0,
            invoiceId: "INV-2023-002",
            project: {
              title: "Mobile App Development"
            },
            client: {
              fullName: "Mike Wilson",
              profileImageUrl: "https://i.pravatar.cc/150?img=3"
            }
          },
          {
            _id: "pay3",
            userId: "u1",
            projectId: "p3",
            contractId: "c3",
            amount: 1200,
            currency: "USD",
            paymentMethod: "bank_transfer",
            paymentType: "hourly",
            description: "40 hours of development work",
            paymentStatus: "processing",
            transactionId: "txn_987654321",
            paymentDate: "2023-10-10T09:15:00Z",
            platformFee: 60,
            taxAmount: 0,
            invoiceId: "INV-2023-003",
            project: {
              title: "Custom CRM Development"
            },
            client: {
              fullName: "Sarah Johnson",
              profileImageUrl: "https://i.pravatar.cc/150?img=4"
            }
          },
          {
            _id: "pay4",
            userId: "u1",
            projectId: "p4",
            contractId: "c4",
            amount: 500,
            currency: "USD",
            paymentMethod: "escrow",
            paymentType: "milestone",
            description: "Logo and brand identity design",
            paymentStatus: "completed",
            transactionId: "txn_456789123",
            paymentDate: "2023-09-28T16:45:00Z",
            platformFee: 25,
            taxAmount: 0,
            invoiceId: "INV-2023-004",
            project: {
              title: "Brand Identity Design"
            },
            client: {
              fullName: "Alex Brown",
              profileImageUrl: "https://i.pravatar.cc/150?img=5"
            }
          },
          {
            _id: "pay5",
            userId: "u1",
            projectId: "p5",
            contractId: "c5",
            amount: 350,
            currency: "USD",
            paymentMethod: "credit_card",
            paymentType: "refund",
            description: "Partial refund for incomplete work",
            paymentStatus: "completed",
            transactionId: "txn_135792468",
            paymentDate: "2023-09-20T11:30:00Z",
            platformFee: -17.5,
            taxAmount: 0,
            invoiceId: "INV-2023-005",
            project: {
              title: "Content Writing Project"
            },
            client: {
              fullName: "Emily Davis",
              profileImageUrl: "https://i.pravatar.cc/150?img=6"
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-30 dark:text-purple-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Refunded
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:bg-opacity-30 dark:text-orange-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Unknown
          </span>
        );
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case "paypal":
        return (
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.185c-1.145 0-2.116.829-2.296 1.973l-1.12 7.11c-.01.142-.01.237-.01.332h4.238c.514 0 .953-.383 1.039-.887l.738-4.678.043-.237c.184-1.146 1.156-1.974 2.3-1.974h1.454c4.254 0 7.593-1.729 8.573-6.727.382-1.922.179-3.544-.77-4.707z" />
          </svg>
        );
      case "bank_transfer":
        return (
          <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        );
      case "escrow":
        return (
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "wallet":
        return (
          <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" />
            <path d="M16 12h4v4h-4z" />
          </svg>
        );
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: "",
      paymentType: "",
      dateRange: ""
    });
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting
  const getFilteredAndSortedPayments = () => {
    let filteredPayments = [...payments];
    
    // Apply filters
    if (filters.status) {
      filteredPayments = filteredPayments.filter(payment => payment.paymentStatus === filters.status);
    }
    
    if (filters.paymentType) {
      filteredPayments = filteredPayments.filter(payment => payment.paymentType === filters.paymentType);
    }
    
    if (filters.dateRange) {
      const now = new Date();
      const pastDate = new Date();
      
      switch (filters.dateRange) {
        case "last7days":
          pastDate.setDate(now.getDate() - 7);
          break;
        case "last30days":
          pastDate.setDate(now.getDate() - 30);
          break;
        case "last90days":
          pastDate.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }
      
      filteredPayments = filteredPayments.filter(payment => {
        if (!payment.paymentDate) return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= pastDate && paymentDate <= now;
      });
    }
    
    // Apply sorting
    filteredPayments.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    } else if (sortConfig.key === 'paymentDate') {
      // Handle null payment dates (pending payments)
      if (!a.paymentDate) return sortConfig.direction === 'asc' ? -1 : 1;
      if (!b.paymentDate) return sortConfig.direction === 'asc' ? 1 : -1;
      
      return sortConfig.direction === 'asc' 
        ? new Date(a.paymentDate) - new Date(b.paymentDate) 
        : new Date(b.paymentDate) - new Date(a.paymentDate);
    }
    
    return 0;
  });
  
  return filteredPayments;
};

const filteredAndSortedPayments = getFilteredAndSortedPayments();

// Calculate totals
const calculateTotals = () => {
  const total = filteredAndSortedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const fees = filteredAndSortedPayments.reduce((sum, payment) => sum + (payment.platformFee || 0), 0);
  const taxes = filteredAndSortedPayments.reduce((sum, payment) => sum + (payment.taxAmount || 0), 0);
  const net = total - fees - taxes;
  
  return { total, fees, taxes, net };
};

const totals = calculateTotals();

if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-blue-600 text-lg animate-pulse">Loading payments...</div>
    </div>
  );
}

if (error) {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="container mx-auto px-4 py-8 mt-16 mb-20">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
        Payments
      </h1>
      
      <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
        
        <Link
          to="/payment-history"
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Clock className="w-4 h-4 mr-2" />
          Payment History
        </Link>
      </div>
    </div>
    
    {/* Filters */}
    {showFilters && (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={filters.paymentType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="milestone">Milestone</option>
              <option value="hourly">Hourly</option>
              <option value="deposit">Deposit</option>
              <option value="refund">Refund</option>
              <option value="platform_fee">Platform Fee</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      </div>
    )}
    
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Payments</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totals.total)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Platform Fees</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totals.fees)}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 rounded-full">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Taxes</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totals.taxes)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 rounded-full">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Earnings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totals.net)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 rounded-full">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('paymentDate')}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === 'paymentDate' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="w-4 h-4 ml-1" /> 
                        : <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortConfig.key === 'amount' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="w-4 h-4 ml-1" /> 
                        : <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No payments found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(payment.paymentDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.project?.title || "Unknown Project"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.client?.fullName || "Unknown Client"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.description || "No description"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.paymentType.replace('_', ' ').charAt(0).toUpperCase() + payment.paymentType.replace('_', ' ').slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      {payment.platformFee > 0 && (
                        <div className="text-xs text-red-500">
                          -Fee: {formatCurrency(payment.platformFee, payment.currency)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {payment.paymentMethod.replace('_', ' ').charAt(0).toUpperCase() + payment.paymentMethod.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {payment.invoiceId && (
                          <button 
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="Download Invoice"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                        <Link 
                          to={`/payments/${payment._id}`}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;


