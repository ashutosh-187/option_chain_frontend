import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [selectedIndex, setSelectedIndex] = useState('NIFTY');
  const [optionsData, setOptionsData] = useState([]);
  const [spotPrice, setSpotPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState('');

  const fetchOptionsData = async (index: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/option_chain?index=${index}`);
      const data = await response.json();
      if (data.option_chain && Array.isArray(data.option_chain)) {
        setSpotPrice(data.spot);
        setExpiryDate(data.expiry);
        setOptionsData(
          data.option_chain.map((item: any) => ({
            strikePrice: item.strike,
            call: {
              ltp: Number(item.call_details.instrument_ltp),
              iv: Number(item.call_details.IV),
              delta: Number(item.call_details.delta),
              gamma: Number(item.call_details.gamma),
              theta: Number(item.call_details.theta),
              vega: Number(item.call_details.vega),
              volume: Number(item.call_details.volume).toLocaleString(),
              oi: Number(item.call_details.OI).toLocaleString() || '0',
              oiChange: Number(item.call_details.OI_Change).toLocaleString() || '0'
            },
            put: {
              ltp: Number(item.put_details.instrument_ltp),
              iv: Number(item.put_details.IV),
              delta: Number(item.put_details.delta),
              gamma: Number(item.put_details.gamma),
              theta: Number(item.put_details.theta),
              vega: Number(item.put_details.vega),
              volume: Number(item.put_details.volume).toLocaleString(),
              oi: Number(item.put_details.OI).toLocaleString() || '0',
              oiChange: Number(item.put_details.OI_Change).toLocaleString() || '0'
            }
          }))
        );
      } else {
        setOptionsData([]);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching options data:', error);
      setOptionsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionsData(selectedIndex);
    const interval = setInterval(() => fetchOptionsData(selectedIndex), 60000);
    return () => clearInterval(interval);
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-8">
      <div className="w-full max-w-7xl">
        <div className="bg-black rounded-lg shadow-2xl p-6 border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="px-4 py-2 bg-black border border-zinc-800 rounded-md text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NIFTY">NIFTY</option>
                <option value="BANKNIFTY">BANK NIFTY</option>
                <option value="SENSEX">SENSEX</option>
              </select>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
                <span className="text-sm text-emerald-500 font-bold">
                  Spot: {spotPrice || "Loading..."}
                </span>
                <span className="text-sm text-blue-500 font-bold">
                  Expiry: {expiryDate || "Loading..."}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              ) : (
                <RefreshCw className="w-5 h-5 text-zinc-700" />
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-900">
                  <th colSpan={8} className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">CALLS</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">STRIKE</th>
                  <th colSpan={8} className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">PUTS</th>
                </tr>
                <tr className="bg-zinc-900">
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">OI</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">OI Chg</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">IV</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Delta</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Gamma</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Theta</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Vega</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">LTP</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">PRICE</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">LTP</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Vega</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Theta</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Gamma</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">Delta</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">IV</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider border-r border-zinc-800">OI Chg</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">OI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {optionsData.length > 0 ? (
                  optionsData.map((data, index) => (
                    <tr key={index} className="hover:bg-zinc-900">
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.oi}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.oiChange}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.iv}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.delta}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.gamma}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.theta}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.call.vega}</td>
                      <td className="px-3 py-2 text-center text-sm font-semibold text-emerald-400">{data.call.ltp}</td>
                      <td className={`px-3 py-2 text-center text-sm font-bold ${data.strikePrice === spotPrice ? 'text-emerald-400 text-lg' : 'text-zinc-200'}`}>
                        {data.strikePrice}
                      </td>
                      <td className="px-3 py-2 text-center text-sm font-semibold text-red-400">{data.put.ltp}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.vega}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.theta}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.gamma}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.delta}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.iv}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.oiChange}</td>
                      <td className="px-3 py-2 text-center text-xs text-zinc-300">{data.put.oi}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={17} className="text-center text-zinc-500 py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;