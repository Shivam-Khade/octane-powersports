"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";

interface AnalyticsData {
  name: string;
  views?: number;
  cartAdds?: number;
  value?: number;
}

interface AnalyticsClientProps {
  products: AnalyticsData[];
  articles: AnalyticsData[];
  bookingStats: AnalyticsData[];
}

const ITEMS_PER_PAGE = 15;

export function AnalyticsClient({ 
  products, 
  articles, 
  bookingStats 
}: AnalyticsClientProps) {
  
  const [activeTab, setActiveTab] = useState<'products' | 'articles' | 'bookings'>('products');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'views' | 'cartAdds'>('views');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when tab or search changes
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // 1. Filter Data
  const getFilteredData = () => {
    let data: AnalyticsData[] = [];
    if (activeTab === 'products') data = products;
    if (activeTab === 'articles') data = articles;
    if (activeTab === 'bookings') data = bookingStats;

    if (searchQuery) {
      data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return data;
  };

  // 2. Sort Data
  const getSortedData = (data: AnalyticsData[]) => {
    if (activeTab === 'products') {
      return [...data].sort((a, b) => {
        if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
        return (b.cartAdds || 0) - (a.cartAdds || 0);
      });
    }
    if (activeTab === 'articles') {
      return [...data].sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    if (activeTab === 'bookings') {
      return [...data].sort((a, b) => (b.value || 0) - (a.value || 0));
    }
    return data;
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = getFilteredData();
    return getSortedData(filtered);
  }, [products, articles, bookingStats, activeTab, searchQuery, sortBy]);

  // 3. Paginate Data
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE) || 1;
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => handleTabChange('products')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'products' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#ff6b00] hover:text-[#ff6b00]'
          }`}
        >
          Products
        </button>
        <button 
          onClick={() => handleTabChange('articles')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'articles' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#ff6b00] hover:text-[#ff6b00]'
          }`}
        >
          Articles
        </button>
        <button 
          onClick={() => handleTabChange('bookings')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'bookings' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#ff6b00] hover:text-[#ff6b00]'
          }`}
        >
          Service Bookings
        </button>
      </div>

      {/* Controls Container */}
      <div className="bg-white p-6 rounded-t-2xl border border-gray-200 border-b-0 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] transition-all"
          />
        </div>

        {/* Sort Filter (Only for Products) */}
        {activeTab === 'products' && (
          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto shrink-0">
            <button 
              onClick={() => setSortBy('views')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${sortBy === 'views' ? 'bg-white shadow text-[#111111]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Sort by Views
            </button>
            <button 
              onClick={() => setSortBy('cartAdds')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${sortBy === 'cartAdds' ? 'bg-white shadow text-[#111111]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Sort by Cart Adds
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 w-24">Rank</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-right">
                  {activeTab === 'products' ? (sortBy === 'views' ? 'Views' : 'Cart Adds') : activeTab === 'articles' ? 'Views' : 'Total Bookings'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length > 0 ? (
                currentData.map((item, idx) => {
                  const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr key={item.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                          globalRank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                          globalRank === 2 ? 'bg-gray-100 text-gray-700' : 
                          globalRank === 3 ? 'bg-orange-100 text-orange-700' : 
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {globalRank}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#111111]">{item.name}</td>
                      <td className="px-6 py-4 text-right font-black text-[#ff6b00]">
                        {activeTab === 'products' 
                          ? (sortBy === 'views' ? item.views?.toLocaleString() : item.cartAdds?.toLocaleString()) 
                          : activeTab === 'articles' 
                            ? item.views?.toLocaleString() 
                            : item.value?.toLocaleString()}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    <BarChart2 size={32} className="mx-auto mb-3 opacity-20" />
                    <p>No data found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
