"use client";

import * as React from "react";

export type DateValue = {
  month: string;
  day: string;
  year: string;
  era?: string;
  display?: string;
  iso?: string;
};

export type DatePickerProps = {
  label?: React.ReactNode;
  value?: DateValue | string | null;
  defaultValue?: DateValue | string | null;
  description?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  minWidth?: string;
  customIndicator?: React.ReactNode;
  showTime?: boolean;
  international?: boolean;
  onChange?: (value: DateValue | null) => void;
};

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Standard month lengths
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarIcon() {
  return (
    <svg aria-hidden="true" aria-label="Calendar icon" fill="none" height="1em" role="presentation" viewBox="0 0 13 14" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" role="img" className="iconify iconify--gravity-ui size-4" width="1em" height="1em" viewBox="0 0 16 16">
      <path fill="currentColor" fillRule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" clipRule="evenodd" />
    </svg>
  );
}

function parseValue(val: DateValue | string | null | undefined): DateValue | null {
  if (!val) return null;
  if (typeof val === "string") {
    const parts = val.split("-");
    if (parts.length === 3) {
      return { year: parts[0], month: String(Number(parts[1])), day: String(Number(parts[2])), iso: val };
    }
    return null;
  }
  return val;
}

function formatValue(value: DateValue | string | null | undefined, showTime?: boolean, international?: boolean) {
  const parsed = parseValue(value);
  if (!parsed) return ["mm", "/", "dd", "/", "yyyy"];
  if (parsed.display) return parsed.display.split("|");
  if (international) return [parsed.day, "/", parsed.month, "/", parsed.year, " ", parsed.era || "शक"];
  if (showTime) return [parsed.month, "/", parsed.day, "/", parsed.year, ", ", "\u20668:45\u2069", " AM GMT+4"];
  return [parsed.month, "/", parsed.day, "/", parsed.year];
}

export function DatePicker({
  label = "Date",
  value,
  defaultValue = null,
  description,
  disabled = false,
  invalid = false,
  required = false,
  minWidth = "w-full",
  customIndicator,
  showTime = false,
  international = false,
  onChange,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<DateValue | null>(parseValue(defaultValue));
  const [open, setOpen] = React.useState(false);
  const [focusedSegment, setFocusedSegment] = React.useState<string | null>(null);
  
  // Use a ref to manage click outside to close the popover
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const currentValue = isControlled ? parseValue(value) : innerValue;
  const segments = formatValue(currentValue, showTime, international);

  const setDate = React.useCallback(
    (next: DateValue | null) => {
      if (!isControlled) setInnerValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleTrigger = () => {
    if (!disabled) setOpen((next) => !next);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((next) => !next);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const today = new Date();
      const base = currentValue || { month: String(today.getMonth() + 1), day: String(today.getDate()), year: String(today.getFullYear()), iso: today.toISOString().split("T")[0] };
      const delta = event.key === "ArrowUp" ? 1 : -1;
      
      const currentMonthIndex = Math.max(0, Number(base.month) - 1);
      const maxDays = MONTH_DAYS[currentMonthIndex] || 31;
      
      const day = Math.max(1, Math.min(maxDays, Number(base.day || 1) + delta));
      setDate({ ...base, day: String(day), iso: `${base.year}-${String(base.month).padStart(2, "0")}-${String(day).padStart(2, "0")}` });
    }
  };

  const selectDay = (year: number, month: number, day: number) => {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const next = { month: String(month), day: String(day), year: String(year), iso };
    setDate(next);
    setOpen(false);
  };

  return (
    <div ref={containerRef} data-slot="date-picker" className={`date-picker ${minWidth}`} data-rac="" data-disabled={disabled || undefined} data-invalid={invalid || undefined} data-open={open || undefined}>
      <HeroUIStyles />
      {label && <span className="label" data-slot="label">{label}{required ? <span className="required-mark" aria-hidden="true"> *</span> : null}</span>}
      <div
        data-react-aria-pressable="true"
        role="group"
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        className="date-input-group date-input-group--full-width date-input-group--primary"
        data-slot="date-input-group"
        data-rac=""
        onKeyDown={handleKeyDown}
      >
        <div role="presentation" data-react-aria-pressable="true" className="date-input-group__input" data-slot="date-input-group-input" data-rac="">
          {segments.map((segment, index) => {
            const isLiteral = ["/", ", ", " ", " AM GMT+4"].includes(segment);
            return (
              <span
                key={`${segment}-${index}`}
                data-slot="date-input-group-segment"
                role={isLiteral ? undefined : "spinbutton"}
                aria-label={isLiteral ? undefined : index === 0 && international ? "दिन, " : index === 2 && international ? "माह, " : index === 4 && international ? "वर्ष, " : index === 0 ? "month, " : index === 2 ? "day, " : "year, "}
                aria-disabled={disabled || undefined}
                data-placeholder={!currentValue && !isLiteral ? "true" : undefined}
                contentEditable={!disabled && !isLiteral}
                suppressContentEditableWarning
                tabIndex={disabled || isLiteral ? undefined : 0}
                className="date-input-group__segment"
                data-focused={focusedSegment === `${index}` || undefined}
                data-rac=""
                onFocus={() => setFocusedSegment(`${index}`)}
                onBlur={() => setFocusedSegment(null)}
              >
                {segment}
              </span>
            );
          })}
        </div>
        <input type="text" hidden name="date" value={currentValue?.iso || ""} readOnly />
        <div className="date-input-group__suffix" data-slot="date-input-group-suffix">
          <button
            data-slot="date-picker-trigger"
            className="date-picker__trigger"
            data-rac=""
            type="button"
            aria-label="Calendar"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={handleTrigger}
          >
            <span aria-hidden="true" className="date-picker__trigger-indicator" data-slot="date-picker-trigger-indicator">
              {customIndicator || <CalendarIcon />}
            </span>
          </button>
        </div>
      </div>
      {description ? <span className="description" data-slot="description">{description}</span> : null}
      {open ? (
        <div data-slot="date-picker-popover" className="date-picker__popover" role="dialog">
          <CalendarView 
            initialYear={currentValue ? Number(currentValue.year) : new Date().getFullYear()} 
            initialMonth={currentValue ? Number(currentValue.month) : new Date().getMonth() + 1}
            selectedDay={currentValue ? Number(currentValue.day) : null} 
            onSelect={selectDay} 
          />
        </div>
      ) : null}
    </div>
  );
}

function CalendarView({ initialYear, initialMonth, selectedDay, onSelect }: { initialYear: number; initialMonth: number; selectedDay: number | null; onSelect: (year: number, month: number, day: number) => void }) {
  const [yearMode, setYearMode] = React.useState(false);
  const [year, setYear] = React.useState(initialYear);
  const [month, setMonth] = React.useState(initialMonth);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };
  
  const handleYearSelect = (y: number) => {
    setYear(y);
    setYearMode(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const maxDays = MONTH_DAYS[month - 1] || 31;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = month === 2 && isLeapYear ? 29 : maxDays;
  
  // Calculate first day of month (0 = Sun, 1 = Mon...)
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  // Generate days array with padding for previous/next months
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ day: 0, current: false }); // padding
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, current: true });
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push({ day: 0, current: false }); // padding
  }

  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div role="application" data-slot="calendar" className="calendar">
      <header data-slot="calendar-header" className="calendar__header">
        <button type="button" data-slot="calendar-year-picker-trigger" className="calendar-year-picker__trigger" onClick={() => setYearMode((next) => !next)}>
          <span data-slot="calendar-year-picker-trigger-heading" className="calendar-year-picker__trigger-heading">{monthNames[month - 1]} {year}</span>
          <span data-slot="calendar-year-picker-trigger-indicator" className="calendar-year-picker__trigger-indicator"><ChevronDownIcon /></span>
        </button>
        <button type="button" onClick={handlePrevMonth} data-slot="calendar-nav-button" className="calendar__nav-button" aria-label="Previous month">‹</button>
        <button type="button" onClick={handleNextMonth} data-slot="calendar-nav-button" className="calendar__nav-button" aria-label="Next month">›</button>
      </header>
      
      {!yearMode && (
        <table role="grid" data-slot="calendar-grid" className="calendar__grid">
          <thead data-slot="calendar-grid-header" className="calendar__grid-header">
            <tr>{WEEK_DAYS.map((d) => <th key={d} data-slot="calendar-header-cell" className="calendar__header-cell">{d}</th>)}</tr>
          </thead>
          <tbody data-slot="calendar-grid-body" className="calendar__grid-body">
            {rows.map((row, rIndex) => (
              <tr key={rIndex}>
                {row.map((cell, cIndex) => {
                  const selected = cell.current && selectedDay === cell.day;
                  return (
                    <td key={`${rIndex}-${cIndex}`}>
                      {cell.day > 0 ? (
                        <button
                          type="button"
                          role="button"
                          data-slot="calendar-cell"
                          className="calendar__cell"
                          data-selected={selected || undefined}
                          onClick={() => onSelect(year, month, cell.day)}
                        >
                          {cell.day}
                        </button>
                      ) : (
                        <span className="calendar__cell" data-outside-month="true"></span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {yearMode && (
        <div role="listbox" data-slot="calendar-year-picker-grid" className="calendar-year-picker__year-grid">
          {Array.from({ length: 25 }, (_, index) => new Date().getFullYear() - 10 + index).map((y) => (
            <button key={y} type="button" onClick={() => handleYearSelect(y)} data-slot="calendar-year-picker-year-cell" className="calendar-year-picker__year-cell" data-selected={y === year || undefined}>{y}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function HeroUIStyles() {
  return (
    <style>{`
      .date-picker,.date-picker *{box-sizing:border-box}
      .date-picker{position:relative;display:inline-flex;flex-direction:column;gap:.25rem;color:hsl(var(--foreground));font-family:inherit;overflow:visible}
      .date-picker[data-open=true]{z-index:80}
      .date-picker.w-full{width:100%}.date-picker[data-disabled=true]{opacity:.6}
      .label{font-size:.875rem;line-height:1.25rem;font-weight:500;color:hsl(var(--foreground))}
      .required-mark{color:#ef4444}
      .description{font-size:.875rem;line-height:1.25rem;color:hsl(var(--muted-foreground))}
      .date-input-group{display:inline-flex;align-items:center;height:2.5rem;overflow:hidden;border-radius:var(--radius);border:1px solid hsl(var(--border));background:hsl(var(--background));box-shadow:0 1px 2px rgba(0,0,0,.04);outline:none;transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease}
      .date-input-group:hover{border-color:hsl(var(--foreground) / .32)}
      .date-input-group:focus-within{border-color:hsl(var(--ring));box-shadow:0 0 0 1px hsl(var(--ring))}
      .date-input-group[aria-invalid=true]{border-color:hsl(var(--destructive));box-shadow:0 0 0 2px hsl(var(--destructive) / .18)}
      .date-input-group[aria-disabled=true]{pointer-events:none;background:hsl(var(--muted));color:hsl(var(--muted-foreground))}
      .date-input-group__input{display:flex;flex:1;align-items:center;gap:1px;min-width:0;padding:.5rem .5rem .5rem .75rem;border:0;background:transparent;font-size:.875rem;line-height:1.25rem;unicode-bidi:isolate}
      .date-input-group__segment{display:inline-block;outline:none;border-radius:.375rem;padding:0 .125rem;color:inherit;text-align:end;text-wrap:nowrap;caret-color:transparent}
      .date-input-group__segment[data-placeholder=true]{color:hsl(var(--muted-foreground))}
      .date-input-group__segment:focus,.date-input-group__segment[data-focused=true]{background:hsl(var(--primary) / .14);color:hsl(var(--foreground))}
      .date-input-group__suffix{pointer-events:none;display:flex;align-items:center;flex-shrink:0;margin-right:.5rem;color:hsl(var(--muted-foreground))}
      .date-picker__trigger{pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:1.75rem;height:1.75rem;padding:.25rem;border:0;border-radius:.375rem;background:transparent;color:hsl(var(--muted-foreground));cursor:pointer;transition:all .15s ease}
      .date-picker__trigger:hover{background:hsl(var(--accent));color:hsl(var(--accent-foreground))}
      .date-picker__trigger:active{transform:scale(.96)}
      .date-picker__trigger:focus-visible{outline:2px solid hsl(var(--ring));outline-offset:2px}
      .date-picker__trigger-indicator{display:inline-flex;align-items:center;justify-content:center;font-size:1rem}
      .date-picker__popover{position:absolute;z-index:100;top:calc(100% + .5rem);left:0;width:16rem;max-width:16rem;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;border-radius:var(--radius);border:1px solid hsl(var(--border));background:hsl(var(--popover));box-shadow:0 16px 40px rgba(0,0,0,.16),0 2px 8px rgba(0,0,0,.08);padding:.75rem;transform-origin:top;animation:datePickerPopover .16s ease-out}
      .calendar{display:flex;flex-direction:column;gap:.5rem;min-width:0;color:hsl(var(--popover-foreground))}
      .calendar__header{display:flex;align-items:center;gap:.25rem;height:2rem}
      .calendar-year-picker__trigger{display:flex;align-items:center;gap:.375rem;height:2rem;padding:0 .5rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-weight:500;cursor:pointer}
      .calendar-year-picker__trigger:hover,.calendar__nav-button:hover{background:hsl(var(--accent));color:hsl(var(--accent-foreground))}
      .calendar-year-picker__trigger-heading{font-size:.875rem}.calendar-year-picker__trigger-indicator{display:inline-flex;color:hsl(var(--muted-foreground))}
      .calendar__nav-button{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-size:1.125rem;cursor:pointer}.calendar__nav-button + .calendar__nav-button{margin-left:0}
      .calendar__grid{width:100%;border-collapse:separate;border-spacing:0 .125rem;table-layout:fixed}
      .calendar__grid th,.calendar__grid td{padding:0;text-align:center;vertical-align:middle}
      .calendar__header-cell{height:2rem;text-align:center;font-size:.75rem;font-weight:500;color:hsl(var(--muted-foreground))}
      .calendar__cell{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:var(--radius);background:transparent;color:inherit;font-size:.875rem;cursor:pointer;transition:all .14s ease}
      .calendar__cell:hover{background:hsl(var(--accent));color:hsl(var(--accent-foreground))}
      .calendar__cell:focus-visible{outline:2px solid hsl(var(--ring));outline-offset:1px}
      .calendar__cell:active{transform:scale(.95)}
      .calendar__cell[data-outside-month=true]{color:hsl(var(--muted-foreground) / .55);pointer-events:none}
      .calendar__cell[data-selected=true]{background:hsl(var(--primary));color:hsl(var(--primary-foreground));font-weight:500}
      .calendar-year-picker__year-grid{max-height:12rem;overflow:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.25rem;border-top:1px solid hsl(var(--border));padding-top:.5rem}
      .calendar-year-picker__year-cell{height:2.25rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-size:.8125rem;cursor:pointer;transition:all .1s ease}
      .calendar-year-picker__year-cell:hover{background:hsl(var(--accent));color:hsl(var(--accent-foreground))}
      .calendar-year-picker__year-cell[data-selected=true]{background:hsl(var(--primary));color:hsl(var(--primary-foreground))}
      @keyframes datePickerPopover{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    `}</style>
  );
}
