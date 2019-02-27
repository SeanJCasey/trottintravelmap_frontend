import React from 'react';

const ALERTCLASSMAP = {
  'error': 'alert-danger',
  'warning': 'alert-warning',
  'success': 'alert-success'
}

const MessagesBlock = ({ messages }) =>
  <div className="messages">
    {
      Object.keys(messages).map(category =>
        messages[category].map((message, index) =>
          <div
            className={`alert ${ALERTCLASSMAP[category]}`}
            key={`${category}-${index}`}
          >
            {message}
          </div>
        )
      )
    }

  </div>

export default MessagesBlock;
