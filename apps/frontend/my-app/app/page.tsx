'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { 
  getBlockchainValue, 
  getBlockchainIdentity, 
  getBlockchainEvents 
} from '@/services/blockchain.service'; 

// ==============================
// 🔹 CONFIG
// ==============================
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const SIMPLE_STORAGE_ABI = [
  { inputs: [{ name: '_value', type: 'uint256' }], name: 'setValue', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: '_message', type: 'string' }], name: 'setMessage', outputs: [], stateMutability: 'nonpayable', type: 'function' }
] as const;

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  
  // WALLET HOOKS
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // LOCAL STATE DATA (Dari Backend)
  const [valueNumber, setValueNumber] = useState<string>('Loading...');
  const [valueString, setValueString] = useState<string>('Loading...');
  const [events, setEvents] = useState<any[]>([]);

  // FORM STATE
  const [numValue, setNumValue] = useState('');
  const [strValue, setStrValue] = useState('');

  // FETCH DATA FUNCTION (Ke Backend)
  const fetchData = useCallback(async () => {
    try {
      const vNum = await getBlockchainValue();
      setValueNumber(vNum.value);

      const vStr = await getBlockchainIdentity();
      setValueString(vStr.identity);

      const vEvents = await getBlockchainEvents();
      setEvents(vEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, [fetchData]);

  // WRITE CONTRACT (Tetap via Wallet)
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // auto refresh setelah transaksi sukses
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        fetchData(); // pnggil backend lagi untuk update data
        setNumValue('');
        setStrValue('');
      }, 2000); 
    }
  }, [isConfirmed, fetchData]);

  const handleSetNumber = () => {
    if (!numValue) return;
    writeContract({ address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'setValue', args: [BigInt(numValue)] });
  };

  const handleSetString = () => {
    if (!strValue) return;
    writeContract({ address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'setMessage', args: [strValue] });
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-zinc-100 p-6 font-sans">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tight text-white">Avalanche Full Stack dApp</h1>
          <p className="text-zinc-500 text-sm">Frontend - Backend - Blockchain</p>
        </div>

        {/* WALLET CONNECT */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md">
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all"
            >
              {isConnecting ? 'Connecting...' : 'Connect Core Wallet'}
            </button>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-green-400 text-sm">● Connected: {address?.slice(0,6)}...{address?.slice(-4)}</span>
              <button onClick={() => disconnect()} className="text-red-400 text-xs hover:underline">Disconnect</button>
            </div>
          )}
        </div>

        {/* TRANSACTION STATUS */}
        {(hash || isConfirming || isConfirmed) && (
           <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg text-xs text-center">
              {isConfirming && <span className="text-yellow-500 animate-pulse">Waiting for confirmation...</span>}
              {isConfirmed && <span className="text-green-500">Transaction Confirmed! Refreshing data...</span>}
              {hash && <div className="mt-1 text-zinc-500">Tx: {hash}</div>}
           </div>
        )}

        {/* DATA DISPLAY & INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NUMBER SECTION */}
          <div className="space-y-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
            <h3 className="text-zinc-500 text-xs uppercase">Number State (via API)</h3>
            <p className="text-3xl font-light">{valueNumber}</p>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={numValue} 
                onChange={(e) => setNumValue(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm"
                placeholder="New Number"
                disabled={!isConnected || isWriting}
              />
              <button onClick={handleSetNumber} disabled={!isConnected || isWriting} className="bg-zinc-700 px-4 rounded text-sm">Set</button>
            </div>
          </div>

          {/* IDENTITY SECTION */}
          <div className="space-y-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
            <h3 className="text-zinc-500 text-xs uppercase">Identity State (via API)</h3>
            <p className="text-lg text-indigo-300 break-words">{valueString}</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={strValue} 
                onChange={(e) => setStrValue(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm"
                placeholder="Name / NIM"
                disabled={!isConnected || isWriting}
              />
              <button onClick={handleSetString} disabled={!isConnected || isWriting} className="bg-zinc-700 px-4 rounded text-sm">Set</button>
            </div>
          </div>
        </div>

        {/* EVENT HISTORY (FROM BACKEND) */}
        <div className="space-y-2">
          <h3 className="text-zinc-500 text-xs uppercase ml-1">Recent Events</h3>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-800/50 text-zinc-400">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Block</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {events.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-zinc-600">No events found in range</td></tr>
                ) : (
                  events.map((evt, i) => (
                    <tr key={i} className="hover:bg-white/5 transition">
                      <td className={`p-3 ${evt.type.includes('Identity') ? 'text-blue-400' : 'text-emerald-400'}`}>{evt.type}</td>
                      <td className="p-3 font-mono text-zinc-300">{evt.value}</td>
                      <td className="p-3 text-zinc-500">{evt.blockNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}