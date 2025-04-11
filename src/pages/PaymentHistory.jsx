import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Download, Filter, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight 
} from "lucide-react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.year) queryParams.append('year', filters.year);
        if (filters.month) queryParams.append('month', filters.month);
        queryParams.append('page', currentPage);
        
        const response = await fetch(`${apiBase}/payments/history?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPayments(data.payments);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Failed to fetch payment history");
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError("Failed to load payment history. Please try again later.");
        
        // DUMMY fallback data
        generateDummyPaymentHistory();
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [filters, currentPage]);

  // Generate dummy payment history for development
  const generateDummyPaymentHistory = () => {
    const year = parseInt(filters.year) || new Date().getFullYear();
    const month = filters.month ? parseInt(filters.month) - 1 : null;
    
    const dummyPayments = [];
    const paymentTypes = ['milestone', 'hourly', 'deposit', 'refund'];
    const statuses = ['completed', 'completed', 'completed', 'refunded'];
    const projects = [
      'Website Redesign', 'Mobile App Development', 'Logo Design', 
      'Content Writing', 'SEO Optimization', 'Database Migration'
    ];
    
    // Generate 20 dummy payments
    for (let i = 1; i <= 20; i++) {
      const date = new Date(year, month !== null ? month : Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      
      // Skip if month filter is applied and this payment is not in that month
      if (month !== null && date.getMonth() !== month) {
        i--; // Try again
        continue;
      }
      
      const typeIndex = Math.floor(Math.random() * paymentTypes.length);
      
      dummyPayments.push({
        _id: `pay${i}`,
        amount: Math.floor(Math.random() * 1000) + 100,
        currency: "USD",
        paymentType: paymentTypes[typeIndex],
        paymentStatus: statuses[typeIndex],
        paymentDate: date.toISOString(),
        description: `Payment for ${projects[Math.floor(Math.random() * projects.length)]}`,
        invoiceId: `INV-${year}-${String(i).padStart(3, '0')}`,
        platformFee: Math.floor((Math.random() * 50) + 10),
        taxAmount: Math.floor(Math.random() * 20)
      });
    }
    
    setPayments(dummyPayments);
    setTotalPages(3); // Dummy total pages
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Handle filter changes
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters(prev => ({ ...prev, [name]: value }));
  setCurrentPage(1); // Reset to first page when filters change
};

// Reset filters
const handleResetFilters = () => {
  setFilters({
    year: new Date().getFullYear().toString(),
    month: ""
  });
  setCurrentPage(1);
};

// Generate year options (last 5 years)
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }
  return years;
};

// Handle pagination
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setCurrentPage(newPage);
  }
};

// Calculate monthly totals
const calculateMonthlyTotals = () => {
  const monthlyData = {};
  
  payments.forEach(payment => {
    const date = new Date(payment.paymentDate);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        total: 0,
        fees: 0,
        taxes: 0,
        count: 0
      };
    }
    
    monthlyData[monthKey].total += payment.amount;
    monthlyData[monthKey].fees += payment.platformFee || 0;
    monthlyData[monthKey].taxes += payment.taxAmount || 0;
    monthlyData[monthKey].count += 1;
  });
  
  // Convert to array and sort by date (newest first)
  return Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return new Date(0, b.month, 0) - new Date(0, a.month, 0);
  });
};

const monthlyTotals = calculateMonthlyTotals();

if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-blue-600 text-lg animate-pulse">Loading payment history...</div>
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
    <div className="flex items-center mb-6">
      <Link to="/payments" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Payments
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Payment History
      </h1>
    </div>
    
    {/* Filters */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Filter Payments
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
        </div>
      )}
      
      {showFilters && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
    
    {/* Monthly Summary */}
    {monthlyTotals.length > 0 && (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Monthly Summary
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Month
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fees
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Net Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {monthlyTotals.map((monthData, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {monthData.month} {monthData.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {monthData.count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(monthData.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(monthData.fees + monthData.taxes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(monthData.total - monthData.fees - monthData.taxes)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
    
    {/* Payment History Table */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No payment history found for the selected period.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(payment.paymentDate)}
                      </span>
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
                    <div className="text-sm text-gray-900 dark:text-white">
                      {payment.invoiceId || "N/A"}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {payment.invoiceId && (
                      <button 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Download Invoice"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show current page, first, last, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                          } text-sm font-medium`}
                        >
                          {page}
                        </button>
                      );
                    }
                    
                    // Show ellipsis for gaps
                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;

