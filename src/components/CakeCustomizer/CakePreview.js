// src/components/CakeCustomizer/CakePreview.js
import React from 'react';

const CakePreview = ({ selectedOptions }) => {
  const { flavor, toppings, size } = selectedOptions;
  
  const sizeScale = size ? size.diameter / 20 : 1; // Scale based on diameter
  
  return (
    <div className="cake-preview">
      <h2>Your Cake Preview</h2>
      
      <div className="cake-image-container">
        {flavor ? (
          <div 
            className="cake-base"
            style={{ 
              backgroundColor: flavor.colorCode || '#f9d5cf',
              width: `${100 * sizeScale}px`,
              height: `${70 * sizeScale}px`,
            }}
          >
            {/* Cake layers visualization */}
            <div className="cake-layer cake-top" style={{ backgroundColor: flavor.colorCode || '#f9d5cf' }}></div>
            <div className="cake-layer cake-middle" style={{ backgroundColor: flavor.colorCode || '#f9d5cf' }}></div>
            
            {/* Toppings visualization */}
            <div className="toppings-container">
              {toppings.map((topping, index) => (
                <div 
                  key={topping.id}
                  className="topping-item"
                  style={{ 
                    left: `${20 + (index * 15)}%`,
                    top: '5px',
                  }}
                >
                  {topping.icon || '🍬'}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-cake-placeholder">
            <p>Select cake options to see preview</p>
          </div>
        )}
      </div>
      
      <div className="cake-details">
        <h3>Current Selection:</h3>
        <ul>
          <li><strong>Flavor:</strong> {flavor ? flavor.name : 'Not selected'}</li>
          <li>
            <strong>Toppings:</strong> 
            {toppings.length > 0 
              ? toppings.map(t => t.name).join(', ') 
              : 'None selected'}
          </li>
          <li><strong>Size:</strong> {size ? size.name : 'Not selected'}</li>
        </ul>
      </div>
    </div>
  );
};

export default CakePreview;