import React from 'react';

const SearchBar = ({ onSearch, onCategory }) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2">
      <input placeholder="Search by title or category" onChange={e => onSearch(e.target.value)} className="border p-2" />
      <input placeholder="Filter by category" onChange={e => onCategory(e.target.value)} className="border p-2" />
    </div>
  );
};

export default SearchBar;
