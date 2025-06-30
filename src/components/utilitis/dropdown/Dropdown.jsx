import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../media/icon/icons";
import styles from "./Dropdown.module.css";

const Dropdown = ({
  options = [],
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  height = "200px",
  onSelect,
  defaultValue = "",
  disabled = false,
  allowClear = true,
  className = "",
  multiple = false,
  searchable = true,
  floatingLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(
    multiple ? (Array.isArray(defaultValue) ? defaultValue : []) : defaultValue
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [interactionMode, setInteractionMode] = useState("keyboard");

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
console.log(options)
  const filteredOptions = options.filter((opt) => {
    const label = typeof opt === "object" && opt.label ? opt.label : opt;
    return String(label).toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      setInteractionMode("keyboard");

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions]);

  useEffect(() => {
    if (
      interactionMode === "keyboard" &&
      highlightedIndex >= 0 &&
      listRef.current &&
      highlightedIndex < listRef.current.children.length
    ) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        requestAnimationFrame(() => {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        });
      }
    }
  }, [highlightedIndex, interactionMode]);

  const handleOptionSelect = (option) => {
  if (multiple) {
    const isSelected = selectedOptions.some((opt) =>
      typeof opt === "object" ? opt.id === option.id : opt === option
    );

    const newSelectedOptions = isSelected
      ? selectedOptions.filter((opt) =>
          typeof opt === "object" ? opt.id !== option.id : opt !== option
        )
      : [...selectedOptions, option];

    setSelectedOptions(newSelectedOptions);

    // Return array of IDs or strings
    const ids = newSelectedOptions.map((opt) =>
      typeof opt === "object" && opt.id !== undefined ? opt.id : opt
    );

    onSelect?.(ids);
  } else {
    setSelectedOptions(option);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);

    // Return just the ID if object, else the string
    const valueToSend = typeof option === "object" ? option.id : option;
    onSelect?.(valueToSend);
  }
};

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOptions(multiple ? [] : "");
    onSelect?.(multiple ? [] : null);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen) {
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      if (!selectedOptions.length) return placeholder;
      return selectedOptions
        .map((opt) =>
          typeof opt === "object" && opt.label ? opt.label : opt
        )
        .join(", ");
    }

    if (!selectedOptions) return placeholder;
    return typeof selectedOptions === "object" && selectedOptions.label
      ? selectedOptions.label
      : selectedOptions;
  };

  const hasSelection = multiple
    ? selectedOptions.length > 0
    : !!selectedOptions;

  return (
    <div
      className={`${styles.dynamicdropdown} ${disabled ? styles.disabled : ""} ${className}`}
      ref={dropdownRef}
    >
      <div
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={toggleDropdown}
      >
        {floatingLabel && (
          <span className={`${styles.label} ${hasSelection ? styles.floating : ""}`}>
            {placeholder}
          </span>
        )}
        <span className={`${styles.selectedText} ${!hasSelection ? styles.placeholder : ""}`}>
          {getDisplayText()}
        </span>
        {allowClear && hasSelection && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            <Icon name="close_fill" width={16} height={16} color="grey" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {searchable && (
            <div className={styles.searchContainer}>
              <Icon name="search" className={styles.searchIcon} height={20} width={16} />
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
              />
            </div>
          )}

          <ul className={styles.optionsList} ref={listRef}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const label = typeof option === "object" && option.label ? option.label : option;
                const key = typeof option === "object" && option.id !== undefined ? option.id : label;
                const isSelected = multiple
                  ? selectedOptions.some((opt) =>
                      typeof opt === "object" ? opt.id === option.id : opt === option
                    )
                  : selectedOptions === option ||
                    (typeof selectedOptions === "object" &&
                      typeof option === "object" &&
                      selectedOptions.id === option.id);

                return (
                  <li
                    key={key}
                    className={`${styles.option} ${index === highlightedIndex ? styles.highlighted : ""} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    onMouseEnter={() => {
                      setHighlightedIndex(index);
                      setInteractionMode("mouse");
                    }}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className={styles.checkbox}
                      />
                    )}
                    <span className={styles.optionLabel}>{label}</span>
                  </li>
                );
              })
            ) : (
              <li className={styles.noResults}>No options found for "{searchTerm}"</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
