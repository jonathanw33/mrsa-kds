import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const EducationalTooltip = ({ term, explanation, children, placement = "top" }) => {
  const renderTooltip = (props) => (
    <Tooltip {...props} className="educational-tooltip">
      <div>
        <strong>{term}</strong>
        <br />
        {explanation}
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <span className="educational-term" style={{ 
        borderBottom: '1px dotted #007bff', 
        cursor: 'help',
        color: '#007bff'
      }}>
        {children}
      </span>
    </OverlayTrigger>
  );
};

export default EducationalTooltip;
