"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { State } from "country-state-city";

export interface StateOption {
  value: string;
  label: string;
  name: string;
}

export interface StateSelectProps {
  id?: string;
  name?: string;
  value?: string | null;
  onChange: (value: string) => void;
  countryCode?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "form-input" | "modal" | "checkout" | "default";
  isClearable?: boolean;
  required?: boolean;
}

const StateSelect: React.FC<StateSelectProps> = ({
  id,
  name,
  value,
  onChange,
  countryCode = "US",
  placeholder = "Select State",
  error = false,
  disabled = false,
  className = "",
  variant = "default",
  isClearable = false,
}) => {
  const reactId = useId();
  const selectId = id || `state-select-${reactId}`;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const options: StateOption[] = useMemo(() => {
    if (!countryCode) return [];
    try {
      const states = State.getStatesOfCountry(countryCode);
      return states.map(item => ({
        value: item.isoCode,
        label: `${item.name} (${item.isoCode})`,
        name: item.name,
      }));
    } catch {
      return [];
    }
  }, [countryCode]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    return (
      options.find(
        opt =>
          opt.value.toLowerCase() === value.toLowerCase() ||
          opt.name.toLowerCase() === value.toLowerCase(),
      ) || null
    );
  }, [options, value]);

  const customStyles: StylesConfig<StateOption, false> = useMemo(() => {
    let minHeight = "48px";
    let borderRadius = "8px";
    let defaultBorderColor = "#d1d5db";
    let borderWidth = "1px";
    let fontSize = "0.95rem";
    let padding = "2px 6px";

    if (variant === "form-input") {
      minHeight = "44px";
      borderRadius = "5px";
      defaultBorderColor = "#4b4a47";
      borderWidth = "2.5px";
      fontSize = "0.95rem";
      padding = "1px 4px";
    } else if (variant === "modal") {
      minHeight = "42px";
      borderRadius = "8px";
      defaultBorderColor = "#d1d5db";
      borderWidth = "1px";
      fontSize = "0.875rem";
      padding = "1px 4px";
    } else if (variant === "checkout") {
      minHeight = "48px";
      borderRadius = "8px";
      defaultBorderColor = "#d1d5db";
      borderWidth = "1px";
      fontSize = "0.95rem";
      padding = "2px 6px";
    }

    const borderColor = defaultBorderColor;

    return {
      control: (base, state) => ({
        ...base,
        minHeight,
        borderRadius,
        borderWidth,
        borderColor: borderColor,
        boxShadow:  "none",
        backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
        cursor: disabled ? "not-allowed" : "pointer",
        padding,
        fontSize,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "#274f45",
        },
      }),
      valueContainer: base => ({
        ...base,
        padding: "0 6px",
      }),
      input: base => ({
        ...base,
        margin: 0,
        padding: 0,
        color: "#13141d",
      }),
      placeholder: base => ({
        ...base,
        color: "#9ca3af",
        fontSize,
      }),
      singleValue: base => ({
        ...base,
        color: "#13141d",
        fontSize,
      }),
      menu: base => ({
        ...base,
        borderRadius: "8px",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        zIndex: 9999,
        overflow: "hidden",
      }),
      menuList: base => ({
        ...base,
        padding: "4px",
        maxHeight: "220px",
      }),
      menuPortal: base => ({
        ...base,
        zIndex: 99999,
      }),
      option: (base, state) => ({
        ...base,
        borderRadius: "6px",
        margin: "1px 0",
        padding: "8px 12px",
        fontSize,
        cursor: "pointer",
        backgroundColor: state.isSelected
          ? "#274f45"
          : state.isFocused
            ? "#f0eee9"
            : "transparent",
        color: state.isSelected ? "#ffffff" : "#13141d",
        "&:active": {
          backgroundColor: state.isSelected ? "#274f45" : "#d4e2cb",
        },
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? "#274f45" : "#6b7280",
        padding: "4px",
        "&:hover": {
          color: "#274f45",
        },
      }),
      clearIndicator: base => ({
        ...base,
        padding: "4px",
      }),
      indicatorSeparator: base => ({
        ...base,
        backgroundColor: "#e5e7eb",
        margin: "6px 0",
      }),
    };
  }, [variant, error, disabled]);

  const handleChange = (selected: SingleValue<StateOption>) => {
    onChange(selected ? selected.value : "");
  };

  if (!mounted) {
    let minHeight = "48px";
    let borderRadius = "8px";
    if (variant === "form-input") {
      minHeight = "44px";
      borderRadius = "5px";
    } else if (variant === "modal") {
      minHeight = "42px";
      borderRadius = "8px";
    }

    return (
      <div
        className={`w-full border bg-white flex items-center px-3 text-sm text-gray-400 select-none border-gray-300 ${className}`}
        style={{ minHeight, borderRadius }}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Select<StateOption, false>
        instanceId={selectId}
        id={selectId}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={isClearable}
        isSearchable
        styles={customStyles}
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
};

export default StateSelect;
