import React, { Component } from 'react';

import PlacesForm from '../components/PlacesForm'
import PlacesList from '../components/PlacesList'
import RegionsFilter from '../components/RegionsFilter'


class FilterablePlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'filters': {
        'region': 'africa'
      }
    }
    this.handleRegionRowClick = this.handleRegionRowClick.bind(this);
  }

  handleRegionRowClick(event) {
    const regionLinkTarget = event.target.getAttribute('href');
    this.setState({
      'filters': {
        'region': regionLinkTarget.replace('#', '')
      }
    })
    event.preventDefault();
  }

  render() {
    return (
      <div className="filterable-places">
        <div className="row">
          <div className="col-sm-5 col-md-4">
            <RegionsFilter
              placesByRegion={this.props.placesByRegion}
              visitedPlaces={this.props.visitedPlaces}
              filters={this.state.filters}
              onRegionRowClick={(e) => this.handleRegionRowClick(e)}
            />
          </div>
          <div className="col-sm-7 col-md-8">
            {this.props.editable &&
              <PlacesForm
                placesByRegion={this.props.placesByRegion}
                visitedPlaces={this.props.visitedPlaces}
                onPlaceRowChange={this.props.onPlaceRowChange}
                filters={this.state.filters}
              />
            }
            {!this.props.editable &&
              <PlacesList
                placesByRegion={this.props.placesByRegion}
                visitedPlaces={this.props.visitedPlaces}
                filters={this.state.filters}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default FilterablePlaces;
