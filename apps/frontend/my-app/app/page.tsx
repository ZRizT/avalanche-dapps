'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';

// ==============================
// 🔹 CONFIG
// ==============================
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const SIMPLE_STORAGE_ABI = [
  { inputs: [], name: 'getValue', outputs: [{ type: 'uint256' }],stateMutability: 'view', type: 'function' },
  { inputs: [{ name: '_value', type: 'uint256' }], name: 'setValue', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'getMessage', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: '_message', type: 'string' }], name: 'setMessage', outputs: [], stateMutability: 'nonpayable', type: 'function' }
] as const;

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Hooks Wagmi
  const { address, isConnected } = useAccount();
  const { connectors, connect, error: connectError, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Local State
  const [numValue, setNumValue] = useState('');
  const [strValue, setStrValue] = useState('');

  // Hindari Hydration Error
  useEffect(() => setIsMounted(true), []);

  // Read Contract
  const { data: valueNumber, refetch: refetchNumber } = useReadContract({
    address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'getValue',
  });
  const { data: valueString, refetch: refetchString } = useReadContract({
    address: CONTRACT_ADDRESS, abi: SIMPLE_STORAGE_ABI, functionName: 'getMessage',
  });

  // Write Contract
  const { writeContract, data: hash, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      refetchNumber();
      refetchString();
      setNumValue('');
      setStrValue('');
    }
  }, [isConfirmed, refetchNumber, refetchString]);

  // Handlers
  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) connect({ connector });
  };

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
      <div className="w-full max-w-md space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tight text-white">Avalanche dApp</h1>
          <p className="text-zinc-500 text-sm">SimpleStorage Interaction</p>
        </div>

        {/* WALLET CARD */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          {!isConnected ? (
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 text-sm shadow-lg shadow-white/10"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
              {connectError && (
                <p className="text-xs text-red-400 text-center bg-red-950/20 p-2 rounded">
                  {connectError.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-zinc-300 text-sm font-medium">Connected</span>
                </div>
                <button onClick={() => disconnect()} className="text-zinc-500 hover:text-red-400 text-xs transition-colors">
                  Disconnect
                </button>
              </div>
              <div className="bg-black/40 rounded-lg p-3 border border-zinc-800/50">
                <p className="font-mono text-xs text-zinc-400 text-center break-all tracking-wide">
                  {address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BAR */}
        {(hash || writeError) && (
          <div className={`rounded-lg p-4 text-xs border ${writeError ? 'bg-red-950/20 border-red-900/50 text-red-300' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'}`}>
            {writeError ? (
              <p>{writeError.message.split('\n')[0]}</p>
            ) : (
              <div className="flex justify-between items-center">
                <span>Tx: <a href={`https://testnet.snowtrace.io/tx/${hash}`} target="_blank" className="text-blue-400 hover:underline">{hash?.slice(0, 6)}...{hash?.slice(-4)}</a></span>
                {isConfirming && <span className="text-amber-500 font-medium animate-pulse">Confirming...</span>}
                {isConfirmed && <span className="text-emerald-500 font-medium">Success</span>}
              </div>
            )}
          </div>
        )}

        {/* MAIN INTERACTION */}
        {isConnected && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Number Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Number Value</label>
                <span className="text-xl font-light text-white">{valueNumber?.toString() || '0'}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0"
                  value={numValue}
                  onChange={(e) => setNumValue(e.target.value)}
                  disabled={isWriting}
                  className="flex-1 bg-zinc-900/30 border border-zinc-800 text-zinc-200 text-sm rounded-lg px-4 py-3 focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 outline-none transition-all"
                />
                <button
                  onClick={handleSetNumber}
                  disabled={isWriting || !numValue}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Set
                </button>
              </div>
            </div>

            <div className="h-px bg-zinc-800/50 w-full"></div>

            {/* String Input */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Identity String</label>
                <p className="text-sm font-light text-blue-200/80 break-words min-h-[1.5em]">
                  {valueString || 'No identity set'}
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your Name / NIM"
                  value={strValue}
                  onChange={(e) => setStrValue(e.target.value)}
                  disabled={isWriting}
                  className="flex-1 bg-zinc-900/30 border border-zinc-800 text-zinc-200 text-sm rounded-lg px-4 py-3 focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 outline-none transition-all"
                />
                <button
                  onClick={handleSetString}
                  disabled={isWriting || !strValue}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}