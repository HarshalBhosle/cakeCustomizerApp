// src/components/CakeCustomizer/PriceCalculator.js
import React from 'react';

const PriceCalculator = ({ selectedOptions, totalPrice }) => {
  const { flavor, toppings, size } = selectedOptions;
  
  return (
    <div className="price-calculator">
      <h2>Price Breakdown</h2>
      
      <div className="price-details">
        <div className="price-row">
          <span>Base Cake ({flavor ? flavor.name : 'Not selected'}):</span>
          <span>${flavor ? flavor.price.toFixed(2) : '0.00'}</span>
        </div>
        
        {toppings.length > 0 && (
          <>
            <div className="price-row heading">
              <span>Toppings:</span>
              <span></span>
            </div>
            {toppings.map(topping => (
              <div key={topping.id} className="price-row indent">
                <span>{topping.name}</span>
                <span>+${topping.price.toFixed(2)}</span>
              </div>
            ))}
          </>
        )}
        
        {size && (
          <div className="price-row">
            <span>Size Multiplier ({size.name}):</span>
            <span>x{size.priceMultiplier.toFixed(1)}</span>
          </div>
        )}
        
        <div className="price-row total">
          <span>Total Price:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="price-notes">
        <p>* Prices are subject to change</p>
        <p>* Additional customization may incur extra charges</p>
      </div>
    </div>
  );
};

export default PriceCalculator;