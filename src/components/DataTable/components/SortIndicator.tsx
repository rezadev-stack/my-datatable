import React from 'react';

interface SortIndicatorProps {
  isSorted: boolean;
  isDesc: boolean;
}

export function SortIndicator({ isSorted, isDesc }: SortIndicatorProps) {
  if (!isSorted) {
    return (
      <span className="ml-2 flex flex-col text-gray-400">
        <span className="text-[10px]">▲</span>
        <span className="text-[10px]">▼</span>
      </span>
    );
  }

  return (
    <span className="ml-2 flex flex-col">
      <span className={`text-[10px] ${isDesc ? 'text-gray-400' : 'text-blue-400'}`}>
        ▲
      </span>
      <span className={`text-[10px] ${isDesc ? 'text-blue-400' : 'text-gray-400'}`}>
        ▼
      </span>
    </span>
  );
}