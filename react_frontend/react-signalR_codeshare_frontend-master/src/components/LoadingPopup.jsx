import React from 'react';

const LoadingPopup = () => {
  return (
    <div style={popupStyle}>
      <div style={overlayStyle}>
        <div style={popupContentStyle}>
          <div style={spinnerStyle}></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
};

const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000
};

const overlayStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%'
};

const popupContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid rgba(0, 0, 0, 0.1)',
  borderTop: '4px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default LoadingPopup;
