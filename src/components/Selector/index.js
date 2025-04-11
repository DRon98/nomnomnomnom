import React, { useState, useMemo } from 'react';
import { FaCheck, FaSearch, FaTimes } from 'react-icons/fa';
import './styles.css';

const Selector = ({ 
  categories,
  onComplete,
  onBack,
  title = "Select Items",
  completeButtonText = "Complete Selection"
}) => {
  const [activeTab, setActiveTab] = useState(Object.keys(categories)[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selections, setSelections] = useState(
    Object.keys(categories).reduce((acc, category) => {
      acc[category] = new Set();
      return acc;
    }, {})
  );

  // Create a flat list of all items with their categories for search
  const allItems = useMemo(() => {
    return Object.entries(categories).reduce((acc, [categoryKey, category]) => {
      category.items.forEach(item => {
        acc.push({
          item,
          category: categoryKey,
          categoryTitle: category.title
        });
      });
      return acc;
    }, []);
  }, [categories]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery) return null;
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(({ item, categoryTitle }) => 
      item.toLowerCase().includes(query) ||
      categoryTitle.toLowerCase().includes(query)
    );
  }, [searchQuery, allItems]);

  const handleSelect = (item, category) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const categorySet = new Set(prev[category]);
      
      if (categorySet.has(item)) {
        categorySet.delete(item);
      } else {
        categorySet.add(item);
      }
      
      newSelections[category] = categorySet;
      return newSelections;
    });
  };

  const handleSelectAll = () => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const currentItems = categories[activeTab].items;
      
      if (prev[activeTab].size === currentItems.length) {
        newSelections[activeTab] = new Set();
      } else {
        newSelections[activeTab] = new Set(currentItems);
      }
      
      return newSelections;
    });
  };

  const getTotalSelectedCount = () => {
    return Object.values(selections).reduce((total, set) => total + set.size, 0);
  };

  const renderSearchResults = () => {
    if (!filteredItems || filteredItems.length === 0) {
      return (
        <div className="no-results">
          No items found matching "{searchQuery}"
        </div>
      );
    }

    // Group results by category
    const groupedResults = filteredItems.reduce((acc, { item, category, categoryTitle }) => {
      if (!acc[category]) {
        acc[category] = {
          title: categoryTitle,
          items: []
        };
      }
      acc[category].items.push(item);
      return acc;
    }, {});

    return (
      <div className="search-results">
        {Object.entries(groupedResults).map(([category, { title, items }]) => (
          <div key={category} className="search-category">
            <h3>{title}</h3>
            <div className="options-grid">
              {items.map(item => (
                <button
                  key={item}
                  className={`option-bubble ${selections[category].has(item) ? 'selected' : ''}`}
                  onClick={() => handleSelect(item, category)}
                >
                  {item}
                  {selections[category].has(item) && <FaCheck className="check-icon" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="selector">
      <div className="header-section">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <FaCheck /> Back
          </button>
        )}
        <h1>{title}</h1>
        <div className="selected-count">
          {getTotalSelectedCount()} items selected
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search all items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="tabs-container">
        {!searchQuery ? (
          <>
            <div className="tabs-header">
              {Object.keys(categories).map(category => (
                <button
                  key={category}
                  className={`tab-button ${activeTab === category ? 'active' : ''}`}
                  onClick={() => setActiveTab(category)}
                >
                  {categories[category].title}
                  {selections[category].size > 0 && (
                    <span className="selection-badge">
                      {selections[category].size}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="tab-content">
              <div className="tab-header">
                <h2>{categories[activeTab].title}</h2>
                <button className="select-all-btn" onClick={handleSelectAll}>
                  {selections[activeTab].size === categories[activeTab].items.length 
                    ? 'Deselect All' 
                    : 'Select All'}
                </button>
              </div>

              <div className="options-grid">
                {categories[activeTab].items.map(item => (
                  <button
                    key={item}
                    className={`option-bubble ${selections[activeTab].has(item) ? 'selected' : ''}`}
                    onClick={() => handleSelect(item, activeTab)}
                  >
                    {item}
                    {selections[activeTab].has(item) && <FaCheck className="check-icon" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="search-content">
            {renderSearchResults()}
          </div>
        )}
      </div>

      <div className="footer-actions">
        <button 
          className="complete-button"
          onClick={() => onComplete(selections)}
          disabled={getTotalSelectedCount() === 0}
        >
          {completeButtonText} ({getTotalSelectedCount()})
        </button>
      </div>
    </div>
  );
};

export default Selector; 