"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, BarChart2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsData {
  name: string;
  views?: number;
  cartAdds?: number;
  value?: number;
}

interface AnalyticsClientProps {
  products: AnalyticsData[];
  articles: AnalyticsData[];
}

const ITEMS_PER_PAGE = 15;

export function AnalyticsClient({ 
  products, 
  articles
}: AnalyticsClientProps) {
  
  const [activeTab, setActiveTab] = useState<'products' | 'articles'>('products');
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
    return data;
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = getFilteredData();
    return getSortedData(filtered);
  }, [products, articles, activeTab, searchQuery, sortBy]);

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
      </div>

      {/* Chart Container */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 text-[#ff6b00] rounded-lg flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a]">
            {activeTab === 'products' ? 'Top Products Performance' : 'Top Articles Views'}
          </h2>
        </div>
        
        <div className="h-[300px] w-full">
          {filteredAndSortedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredAndSortedData.slice(0, 10)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  tick={{ fontSize: 12, fill: '#888' }}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#888' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0a0a0a', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey={activeTab === 'products' ? (sortBy === 'views' ? 'views' : 'cartAdds') : 'views'} 
                  fill="#ff6b00" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <BarChart2 size={40} className="mb-4 opacity-20" />
              <p>No data available for chart visualization</p>
            </div>
          )}
        </div>
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
                  {activeTab === 'products' ? (sortBy === 'views' ? 'Views' : 'Cart Adds') : 'Views'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length > 0 ? (
                currentData.map((item, idx) => {
                  const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr key={`${item.name}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
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
                          : item.views?.toLocaleString()}
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
