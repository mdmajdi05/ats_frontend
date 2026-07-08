'use client';

import { useState, useRef, useEffect } from 'react';

type GooPaginationProps = {
  total: number;
  current?: number;
  onChange?: (page: number) => void;
};

export default function GooPagination({ total, current = 1, onChange }: GooPaginationProps) {
  const [activeIdx, setActiveIdx] = useState(current);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (indicatorRef.current && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      const activeItem = items[activeIdx - 1];
      if (activeItem) {
        indicatorRef.current.style.left = `${activeItem.offsetLeft}px`;
      }
    }
  }, [activeIdx]);

  const handleClick = (page: number) => {
    setActiveIdx(page);
    onChange?.(page);
  };

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="goo-pagination">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="goo-pagination">
        <ul ref={listRef}>
          <span ref={indicatorRef} className="active-indicator" />
          {Array.from({ length: total }).map((_, i) => (
            <li
              key={i}
              className={activeIdx === i + 1 ? 'current' : ''}
              onClick={() => handleClick(i + 1)}
            >
              {i + 1}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
