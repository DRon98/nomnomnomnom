import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import StateSelector from './index';
import {
  addCurrentState,
  removeCurrentState,
  addDesiredState,
  removeDesiredState
} from '../../store/userSlice';

const mockStore = configureStore([]);

describe('StateSelector Component', () => {
  let store;
  const mockOptions = ['Happy', 'Energetic', 'Calm', 'Focused'];
  const mockQuestion = 'How do you want to feel?';

  beforeEach(() => {
    store = mockStore({
      user: {
        currentStates: ['Happy'],
        desiredStates: ['Focused', 'Calm']
      }
    });
    store.dispatch = jest.fn();
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('renders the question label correctly', () => {
    renderWithProviders(
      <StateSelector 
        type="current" 
        options={mockOptions} 
        question={mockQuestion} 
      />
    );
    
    expect(screen.getByText(mockQuestion)).toBeInTheDocument();
  });

  // it('renders the dropdown with correct options for current states', () => {
  //   renderWithProviders(
  //     <StateSelector 
  //       type="current" 
  //       options={mockOptions} 
  //       question={mockQuestion} 
  //     />
  //   );
    
  //   // Open the dropdown
  //   const dropdown = screen.getByTestId('state-selector');
  //   fireEvent.focus(dropdown);
  //   fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    
  //   // Check that options not already selected are available
  //   expect(screen.getByText('Energetic')).toBeInTheDocument();
  //   expect(screen.getByText('Calm')).toBeInTheDocument();
  //   expect(screen.getByText('Focused')).toBeInTheDocument();
    
  //   // Happy should not be in dropdown as it's already selected
  //   expect(screen.queryByText('Happy')).not.toBeInTheDocument();
  // });

  // it('renders the dropdown with correct options for desired states', () => {
  //   renderWithProviders(
  //     <StateSelector 
  //       type="desired" 
  //       options={mockOptions} 
  //       question={mockQuestion} 
  //     />
  //   );
    
  //   // Open the dropdown
  //   const dropdown = screen.getByTestId('state-selector');
  //   fireEvent.focus(dropdown);
  //   fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    
  //   // Check that options not already selected are available
  //   expect(screen.getByText('Happy')).toBeInTheDocument();
  //   expect(screen.getByText('Energetic')).toBeInTheDocument();
    
  //   // Focused and Calm should not be in dropdown as they're already selected
  //   expect(screen.queryByText('Focused')).not.toBeInTheDocument();
  //   expect(screen.queryByText('Calm')).not.toBeInTheDocument();
  // });

  it('displays selected states as bubbles for current states', () => {
    renderWithProviders(
      <StateSelector 
        type="current" 
        options={mockOptions} 
        question={mockQuestion} 
      />
    );
    
    // Check that the selected state is displayed as a bubble
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Happy').closest('.state-bubble')).toHaveClass('current-state');
  });

  it('displays selected states as bubbles for desired states', () => {
    renderWithProviders(
      <StateSelector 
        type="desired" 
        options={mockOptions} 
        question={mockQuestion} 
      />
    );
    
    // Check that the selected states are displayed as bubbles
    expect(screen.getByText('Focused')).toBeInTheDocument();
    expect(screen.getByText('Calm')).toBeInTheDocument();
    expect(screen.getByText('Focused').closest('.state-bubble')).toHaveClass('desired-state');
    expect(screen.getByText('Calm').closest('.state-bubble')).toHaveClass('desired-state');
  });

  // it('dispatches addCurrentState action when selecting a state in current type', () => {
  //   renderWithProviders(
  //     <StateSelector 
  //       type="current" 
  //       options={mockOptions} 
  //       question={mockQuestion} 
  //     />
  //   );
    
  //   // Open the dropdown
  //   const dropdown = screen.getByTestId('state-selector');
  //   fireEvent.focus(dropdown);
  //   fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    
  //   // Select an option
  //   fireEvent.click(screen.getByText('Energetic'));
    
  //   // Check that the correct action was dispatched
  //   expect(store.dispatch).toHaveBeenCalledWith(addCurrentState('Energetic'));
  // });

  // it('dispatches addDesiredState action when selecting a state in desired type', () => {
  //   renderWithProviders(
  //     <StateSelector 
  //       type="desired" 
  //       options={mockOptions} 
  //       question={mockQuestion} 
  //     />
  //   );
    
  //   // Open the dropdown
  //   const dropdown = screen.getByTestId('state-selector');
  //   fireEvent.focus(dropdown);
  //   fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    
  //   // Select an option
  //   fireEvent.click(screen.getByText('Energetic'));
    
  //   // Check that the correct action was dispatched
  //   expect(store.dispatch).toHaveBeenCalledWith(addDesiredState('Energetic'));
  // });

  it('dispatches removeCurrentState action when removing a state in current type', () => {
    renderWithProviders(
      <StateSelector 
        type="current" 
        options={mockOptions} 
        question={mockQuestion} 
      />
    );
    
    // Find the remove button for the Happy state
    const removeButton = screen.getByLabelText('Remove Happy');
    fireEvent.click(removeButton);
    
    // Check that the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(removeCurrentState('Happy'));
  });

  it('dispatches removeDesiredState action when removing a state in desired type', () => {
    renderWithProviders(
      <StateSelector 
        type="desired" 
        options={mockOptions} 
        question={mockQuestion} 
      />
    );
    
    // Find the remove button for the Focused state
    const removeButton = screen.getByLabelText('Remove Focused');
    fireEvent.click(removeButton);
    
    // Check that the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(removeDesiredState('Focused'));
  });
});