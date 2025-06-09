// CakeBuilder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlavorSelector from './FlavorSelector';
import ToppingSelector from './ToppingSelector';
import SizeSelector from './SizeSelector';
import CakePreview from './CakePreview';
import PriceCalculator from './PriceCalculator';
import { getCakeOptions } from '../../services/cake.service';

const CakeBuilder = () => {
  const [step, setStep] = useState(1);
  const [cakeOptions, setCakeOptions] = useState({
    flavors: [],
    toppings: [],
    sizes: []
  });
  const [selectedOptions, setSelectedOptions] = useState({
    flavor: null,
    toppings: [],
    size: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCakeOptions = async () => {
      try {
        const options = await getCakeOptions();
        setCakeOptions(options);
        setSelectedOptions({
          flavor: options.flavors[0] || null,
          toppings: [],
          size: options.sizes[0] || null
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cake options:", error);
        setLoading(false);
      }
    };

    fetchCakeOptions();
  }, []);

  const handleFlavorSelect = (flavor) => {
    setSelectedOptions({
      ...selectedOptions,
      flavor
    });
  };

  const handleToppingToggle = (topping) => {
    setSelectedOptions({
      ...selectedOptions,
      toppings: selectedOptions.toppings.includes(topping)
        ? selectedOptions.toppings.filter(t => t.id !== topping.id)
        : [...selectedOptions.toppings, topping]
    });
  };

  const handleSizeSelect = (size) => {
    setSelectedOptions({
      ...selectedOptions,
      size
    });
  };

  const handleAddToCart = () => {
    // Add cake to cart (would typically dispatch an action or update context)
    const cake = {
      ...selectedOptions,
      id: Date.now().toString(),
      totalPrice: calculateTotalPrice()
    };
    
    // For this example, we'll use localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cake);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    navigate('/cart');
  };

  const calculateTotalPrice = () => {
    const flavorPrice = selectedOptions.flavor?.price || 0;
    const toppingsPrice = selectedOptions.toppings.reduce((sum, topping) => sum + topping.price, 0);
    const sizeMultiplier = selectedOptions.size?.priceMultiplier || 1;
    
    return (flavorPrice + toppingsPrice) * sizeMultiplier;
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (loading) {
    return <div>Loading cake options...</div>;
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FlavorSelector 
            flavors={cakeOptions.flavors} 
            selectedFlavor={selectedOptions.flavor}
            onSelect={handleFlavorSelect}
          />
        );
      case 2:
        return (
          <ToppingSelector 
            toppings={cakeOptions.toppings}
            selectedToppings={selectedOptions.toppings}
            onToggle={handleToppingToggle}
          />
        );
      case 3:
        return (
          <SizeSelector 
            sizes={cakeOptions.sizes}
            selectedSize={selectedOptions.size}
            onSelect={handleSizeSelect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="cake-builder">
      <h1>Create Your Custom Cake</h1>
      
      <div className="cake-builder-container">
        <div className="cake-options">
          <div className="steps-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Choose Flavor</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Add Toppings</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Select Size</div>
          </div>
          
          {renderStepContent()}
          
          <div className="navigation-buttons">
            {step > 1 && (
              <button className="btn-secondary" onClick={prevStep}>
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button className="btn-primary" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleAddToCart}
                disabled={!selectedOptions.flavor || !selectedOptions.size}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
        
        <div className="cake-preview-section">
          <CakePreview selectedOptions={selectedOptions} />
          <PriceCalculator 
            selectedOptions={selectedOptions}
            totalPrice={calculateTotalPrice()}
          />
        </div>
      </div>
    </div>
  );
};

export default CakeBuilder;