// src/components/CakeCustomizer/FlavorSelector.js
import React from 'react';

const FlavorSelector = ({ flavors, selectedFlavor, onSelect }) => {
  return (
    <div className="flavor-selector">
      <h2>Choose Your Cake Flavor</h2>
      <div className="flavors-grid">
        {flavors && flavors.map((flavor) => (
          <div 
            key={flavor.id} 
            className={`flavor-card ${selectedFlavor && selectedFlavor.id === flavor.id ? 'selected' : ''}`}
            onClick={() => onSelect(flavor)}
          >
            <div 
              className="flavor-color-preview" 
              style={{ backgroundColor: flavor.colorCode || '#f9d5cf' }}
            ></div>
            <h3>{flavor.name}</h3>
            <p>{flavor.description}</p>
            <div className="flavor-price">${flavor.price?.toFixed(2) || '0.00'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorSelector;