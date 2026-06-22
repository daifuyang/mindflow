"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface DynamicTableProps {
  children: React.ReactNode;
}

function measureTextWidth(text: string, element: HTMLElement): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  const style = window.getComputedStyle(element);
  ctx.font = `${style.fontSize} ${style.fontFamily}`;
  return ctx.measureText(text).width;
}

export function DynamicTable({ children }: DynamicTableProps) {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const measureRef = useRef<HTMLTableElement>(null);
  const MAX_WIDTH = 250;

  useLayoutEffect(() => {
    if (!measureRef.current) return;

    const table = measureRef.current;
    const rows = table.querySelectorAll("tr");
    if (rows.length === 0) {
      setVisible(true);
      return;
    }

    const widths: number[] = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td, th");
      cells.forEach((cell, cellIndex) => {
        const text = cell.textContent || "";
        const textWidth = measureTextWidth(text, cell as HTMLElement);
        const withPadding = textWidth + 32;
        if (widths[cellIndex] === undefined || withPadding > widths[cellIndex]) {
          widths[cellIndex] = withPadding;
        }
      });
    });

    const finalWidths = widths.map((w) => {
      if (w > MAX_WIDTH) return MAX_WIDTH;
      return w;
    });

    setColumnWidths(finalWidths);
    setVisible(true);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table
        ref={measureRef}
        className="table-fixed w-full"
        style={{ tableLayout: "fixed", visibility: visible ? "visible" : "hidden" }}
      >
        {columnWidths.length > 0 && (
          <colgroup>
            {columnWidths.map((width, i) => (
              <col key={i} style={{ width: `${width}px`, minWidth: `${width}px` }} />
            ))}
          </colgroup>
        )}
        {children}
      </table>
    </div>
  );
}