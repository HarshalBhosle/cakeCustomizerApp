// src/components/CakeCustomizer/ToppingSelector.js
import React from 'react';

const ToppingSelector = ({ toppings, selectedToppings, onToggle }) => {
  return (
    <div className="topping-selector">
      <h2>Choose Your Toppings</h2>
      <p>Select up to 3 toppings for your cake</p>
      
      <div className="toppings-grid">
        {toppings && toppings.map((topping) => {
          const isSelected = selectedToppings.some(t => t.id === topping.id);
          const isDisabled = selectedToppings.length >= 3 && !isSelected;
          
          return (
            <div 
              key={topping.id} 
              className={`topping-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onToggle(topping)}
            >
              <div className="topping-icon">
                {/* You can replace this with actual icons if available */}
                {topping.icon || '🍬'}
              </div>
              <h3>{topping.name}</h3>
              <p>{topping.description}</p>
              <div className="topping-price">+${topping.price?.toFixed(2) || '0.00'}</div>
            </div>
          );
        })}
      </div>
      
      <div className="selected-toppings">
        <h3>Selected Toppings:</h3>
        {selectedToppings.length === 0 ? (
          <p>No toppings selected</p>
        ) : (
          <ul>
            {selectedToppings.map(topping => (
              <li key={topping.id}>
                {topping.name} (+${topping.price?.toFixed(2)})
                <button onClick={() => onToggle(topping)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ToppingSelector;