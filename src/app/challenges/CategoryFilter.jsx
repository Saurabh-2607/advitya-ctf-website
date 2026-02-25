"use client";

import React from "react";
import { Filter } from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "web", label: "Web" },
  { value: "OSINT", label: "OSINT" },
  { value: "pwn", label: "PWN" },
  { value: "crypto", label: "Crypto" },
  { value: "forensics", label: "Forensics" },
  { value: "reverse", label: "Reverse" },
  { value: "misc", label: "Misc" },
];

const CategoryFilter = ({
  selectedCategory,
  filteredChallenges,
  challenges,
  onCategoryChange,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 relative z-20">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/50 rounded-full border-2 border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-500 shrink-0">
          <Filter className="w-3 h-3" />
          <span>Filter</span>
        </div>
        
        <div className="flex flex-wrap gap-2 flex-1">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`relative px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border-2 transition-all duration-300 ${
                selectedCategory === category.value
                  ? "bg-neutral-200 text-black border-neutral-200"
                  : "bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-white"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="ml-auto shrink-0 hidden md:block">
           <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest font-bold">
              {filteredChallenges.length} Challenges Found
           </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
