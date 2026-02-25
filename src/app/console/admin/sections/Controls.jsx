import React from 'react'
import { Settings } from 'lucide-react';

const Controls = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Controls</h1>
          <p className="text-neutral-400 mt-1">Configure global settings and system parameters</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 m-4 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <Settings className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Configuration Panel</h3>
          <p className="text-neutral-400 max-w-sm">
            Control panel settings and environment variables configuration will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Controls