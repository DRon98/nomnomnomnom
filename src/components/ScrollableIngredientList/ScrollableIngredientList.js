import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ScrollableIngredientList.css';

const ScrollableIngredientList = React.memo(({ 
  items, 
  onSelect, 
  selectedIds, 
  emptyMessage, 
  showRemoveButton 
}) => {
  const containerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const checkOverflow = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const contentWidth = container.scrollWidth;
      setContainerWidth(containerWidth);
      setContentWidth(contentWidth);
      setShowLeftArrow(translateX < 0);
      setShowRightArrow(contentWidth > containerWidth + Math.abs(translateX));
    }
  }, [translateX]);

  const scroll = useCallback((direction) => {
    const scrollAmount = direction === 'left' ? 200 : -200;
    const newTranslateX = Math.min(0, Math.max(translateX + scrollAmount, -(contentWidth - containerWidth)));
    setTranslateX(newTranslateX);
  }, [translateX, contentWidth, containerWidth]);

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [items, checkOverflow]);

  useEffect(() => {
    checkOverflow();
  }, [translateX, checkOverflow]);

  const renderedItems = useMemo(() => items.map(item => (
    <div 
      key={item.foodId} 
      className={`ingredient-pill ${!showRemoveButton ? 'clickable' : ''} ${selectedIds.includes(item.foodId) ? 'selected' : ''}`}
      onClick={() => !showRemoveButton && onSelect(item)}
    >
      {item.food.icon && <span className="ingredient-icon">{item.food.icon}</span>}
      <span className="ingredient-name">{item.food.name}</span>
      {showRemoveButton && (
        <button
          className="remove-ingredient"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.foodId);
          }}
        >
          ×
        </button>
      )}
    </div>
  )), [items, onSelect, selectedIds, showRemoveButton]);

  return (
    <div className="ingredients-scroll">
      {showLeftArrow && (
        <button className="scroll-button left" onClick={() => scroll('left')}>
          <FaChevronLeft />
        </button>
      )}
      <div 
        className="ingredients-scroll-container" 
        ref={containerRef}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {renderedItems}
        {items.length === 0 && (
          <div className="empty-message">{emptyMessage}</div>
        )}
      </div>
      {showRightArrow && (
        <button className="scroll-button right" onClick={() => scroll('right')}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
});

export default ScrollableIngredientList; 