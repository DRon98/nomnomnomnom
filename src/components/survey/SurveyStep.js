import React from 'react';
import PropTypes from 'prop-types';

const SurveyStep = ({ step, title, children, onNext, onPrevious, isLastStep }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">Step {step + 1} of 5</p>
      </div>
      
      <div className="mb-8">
        {children}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          disabled={step === 0}
          className={`px-4 py-2 rounded-md ${
            step === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isLastStep ? 'Complete Survey' : 'Next'}
        </button>
      </div>
    </div>
  );
};

SurveyStep.propTypes = {
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired
};

export default SurveyStep; 