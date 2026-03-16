import React, { useState, useRef } from 'react';
import axios from 'axios';

const MedicineDropdown = ({ value, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState(value || '');
  const [fetching, setFetching] = useState(false);
  const inputRef = useRef(null);

  // Fetch matching medicines on input change
  const handleInputChange = async (e) => {
    const searchStr = e.target.value;
    setSearchValue(searchStr);
    setShowDropdown(!!searchStr);

    if (!searchStr) {
      setOptions([]);
      onSelect('');
      return;
    }

    setFetching(true);

    try {
      const res = await axios.get(`/api/search-medicines/?search=${searchStr}`);
      if (Array.isArray(res.data)) {
        setOptions(res.data);
        // Debug: what the backend returns
        console.log("[MedicineDropdown] API result:", res.data);
      } else {
        setOptions([]);
      }
    } catch (err) {
      setOptions([]);
      console.error("[MedicineDropdown] API error:", err);
    } finally {
      setFetching(false);
    }

    onSelect(searchStr); // Always allow manual input
  };

  const handleSelect = (medName) => {
    setSearchValue(medName);
    setShowDropdown(false);
    setOptions([]);
    onSelect(medName);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 180);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        ref={inputRef}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (searchValue) setShowDropdown(true);
        }}
        onBlur={handleBlur}
        placeholder="Search or type medicine name"
        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      {showDropdown && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-blue-200 rounded shadow max-h-56 overflow-auto mt-1">
          {fetching && (
            <li className="py-2 px-3 text-gray-500">Searching...</li>
          )}
          {!fetching && options.length > 0 && options.map(med => (
            <li
              key={med.id}
              className="py-2 px-3 cursor-pointer hover:bg-blue-100 text-gray-900"
              onMouseDown={() => handleSelect(med.name)}
            >
              {med.name}
            </li>
          ))}
          {!fetching && options.length === 0 && (
            <li className="py-2 px-3 text-gray-400">
              No medicines found. You can add manually.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MedicineDropdown;
