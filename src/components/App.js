import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import EditablePlacesVisitedMap from '../containers/EditablePlacesVisitedMap';

const App = () => (
  <Router>
    <div className="app-wrapper">
      <Route
        path='/'
        exact
        component={EditablePlacesVisitedMap}
      />
      <Route
        path='/travel-maps/:userSlug'
        component={EditablePlacesVisitedMap}
      />
    </div>
  </Router>
)

export default App;
