// src/components/CakeCustomizer/SizeSelector.js
import React from 'react';

const SizeSelector = ({ sizes, selectedSize, onSelect }) => {
  return (
    <div className="size-selector">
      <h2>Select Your Cake Size</h2>
      
      <div className="sizes-container">
        {sizes && sizes.map((size) => (
          <div 
            key={size.id} 
            className={`size-option ${selectedSize && selectedSize.id === size.id ? 'selected' : ''}`}
            onClick={() => onSelect(size)}
          >
            <div className="size-circle" style={{ 
              width: `${size.diameter || 50}px`, 
              height: `${size.diameter || 50}px` 
            }}>
              {size.diameter ? `${size.diameter}"` : size.name}
            </div>
            <div className="size-details">
              <h3>{size.name}</h3>
              <p>{size.servings} servings</p>
              <p className="size-multiplier">Price: x{size.priceMultiplier?.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedSize && (
        <div className="selected-size-info">
          <h3>Selected: {selectedSize.name}</h3>
          <p>Serves {selectedSize.servings} people</p>
          <p>Base price will be multiplied by {selectedSize.priceMultiplier?.toFixed(1)}</p>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;