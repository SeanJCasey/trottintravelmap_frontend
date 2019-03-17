import React, { Component } from 'react';

import { updateRemotePlaceMap } from '../apiRouters';
import { calculateStatsForPlacesByIDs, PATH_BASE, PATH_MAPS } from '../utils';

import FilterablePlaces from './FilterablePlaces';
import MessagesBlock from '../components/MessagesBlock';
import PlaceMapBlock from '../components/PlaceMapBlock';
import StatBlocksRow from '../components/StatBlocksRow';
import UserAccountOptionsBlock from '../components/UserAccountOptionsBlock';
import UserLoginBlock from './UserLoginBlock';


// TODO: Move stat caculations when we decide state
class EditablePlacesVisitedMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placesVisited: this.props.placemap ? this.props.placemap.placesVisited : [],
      messages: {
        error: [],
        warning: [],
        success: []
      },
    };

    this.addSystemMessage = this.addSystemMessage.bind(this);
    this.handlePlaceRowChange = this.handlePlaceRowChange.bind(this);
    this.updateRemotePlacesVisited = this.updateRemotePlacesVisited.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Load placesVisited if there was no placemap in prev build
    if (!prevProps.placemap && this.props.placemap) {
      this.setState({ placesVisited: this.props.placemap.placesVisited });
    }

    // Empty placesVisited if placemap has been removed from parent
    else if (prevProps.placemap && !this.props.placemap) {
      this.setState({ placesVisited: [] });
    }
  }

  addSystemMessage(text, messageType) {
    if (!this.state.messages[messageType]) { return; }

    const newMessages = this.state.messages[messageType].slice();
    if (!newMessages.includes(text)) {
      newMessages.push(text);
      this.setState({
        messages: {
          ...this.state.messages,
          [messageType]: newMessages
        }
      });
    }
  }

  handlePlaceRowChange(event) {
    const { placemap } = this.props;
    const { placesVisited } = this.state;

    // Add or remove place from the placesVisited array
    const placeID = Number(event.target.value);
    let newPlacesVisited = placesVisited.slice();
    if (newPlacesVisited.includes(placeID)) {
      newPlacesVisited = newPlacesVisited.filter(item => item !== placeID);
    }
    else {
      newPlacesVisited.push(placeID);
    }

    // Update state with new placesVisited
    this.setState({ placesVisited: newPlacesVisited });

    // Update remote db if it isn't a new placemap
    if (placemap) {
      this.updateRemotePlacesVisited(newPlacesVisited);
    }
  }

  updateRemotePlacesVisited(placesVisited) {
    // TODO - handle errors
    return updateRemotePlaceMap(this.props.placemap.owner.slug, placesVisited)
      .catch(error => console.log(error.response));
  }

  render() {
    const { placemap, places, placesByRegion, statsTotal, user } = this.props;
    const { placesVisited, messages } = this.state;
    const statsVisited = calculateStatsForPlacesByIDs(placesVisited, places);

    return (
      <div className="traveler-map">
        <PlaceMapBlock
          places={places}
          visitedPlaces={placesVisited}
        />
        <div className="main-content-wrapper">
          <div className="container">
            {placemap ?
              <h1>{placemap.owner.name}'s Travel Map</h1> :
              <h1>Fill In Your Travel Map</h1>
            }
            <MessagesBlock
              messages={messages}
            />
            {user.id &&
              <UserAccountOptionsBlock
                mapUrl={`${PATH_BASE}${PATH_MAPS}/${user.slug}`}
                userName={user.name}
                onUserLogout={this.props.logoutUser}
              />}
            <StatBlocksRow
              statsTotal={statsTotal}
              statsVisited={statsVisited}
            />
            <FilterablePlaces
              editable={true}
              placesByRegion={placesByRegion}
              visitedPlaces={placesVisited}
              onPlaceRowChange={(e) => this.handlePlaceRowChange(e)}
            />
          </div>
        </div>
        {!user.id &&
          <UserLoginBlock
            addSystemMessage={this.addSystemMessage}
            placesVisited={placesVisited}
            setUser={this.props.setUser}
          />
        }
      </div>
    );
  }
}

export default EditablePlacesVisitedMap;
