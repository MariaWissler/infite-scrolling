import React, { Component } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button
} from "reactstrap";
import axios from "axios";
import "./cards.css";
import backCard from "./backCard.png";

class CardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isLoading: false,
      page: 1,
      pageSize: 20,
      queryName: "",
      totalCards: 0
    };
  }

  componentDidMount() {
    // fetch the initial list of magic cards
    this.getMagicCards();
    // add the event listener to to handle infinite scroll
    window.addEventListener("scroll", this.handleScroll);
  }

  componentUnMount() {
    // let's make sure we move the scroller event listener when the comp-unmounts
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { page, isLoading, totalCards } = this.state;
    // when  user scrolls to the bottom, then get the new list of magic cards
    if (isLoading) {
      // if a request is pending, we need wait for it to finish before fetch another list
      return null;
    }
    if (totalCards !== this.state.cards.length) {
      //also in case if a search we stop the scrolling once all the results are shown

      this.setState(
        {
          page: page + 1
          // go to the next page set of 20 magic cards
        },

        () => this.getMagicCards()
      );
    }
  };

  handleInput = event => {
    // we got a search !
    this.setState({ queryName: event.target.value });
    console.log(`this is the search value`, this.state.queryName);
  };

  getMagicCards = () => {
    const { cards, page, pageSize } = this.state;
    this.setState({
      isLoading: true
    });

    const request = axios({
      method: "GET",
      url: `http://api.magicthegathering.io/v1/cards?page=${page}&pageSize=${pageSize}&types=${"Creature"}`
    });

    request
      .then(response => {
        const { data } = response;
        this.setState({
          cards: [...cards, ...data.cards],
          isLoading: false,
          totalCards: cards.length
        });
        console.log(this.state.totalCards);
      })
      .catch(error => {
        console.error(error);
      });
  };

  getMagicCardsByName = () => {
    const { page, pageSize, queryName } = this.state;

    this.setState({
      isLoading: true
    });

    let searchName = queryName.replace(/^\w/, c => c.toUpperCase());
    //looking at the API most names start with capitol letter, we quet the first letter of our query capitalized
    console.log(searchName);

    const request = axios({
      method: "GET",
      url: `http://api.magicthegathering.io/v1/cards?page=${page}&pageSize=${pageSize}&types=${"Creature"}&name=${searchName}`
    });

    request
      .then(response => {
        const { data } = response;
        this.setState({
          cards: data.cards,
          isLoading: false,
          totalCards: data.cards.length
        });
        console.log(this.state.totalCards);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const { cards, isLoading, queryName } = this.state;

    return (
      <div className="background">
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by Name"
            onChange={this.handleInput}
            value={queryName}
          ></input>
          {queryName ? (
            <Button
              color="secondary"
              className="search-button"
              onClick={this.getMagicCardsByName}
            >
              Search
            </Button>
          ) : (
            <div></div>
          )}
          <div className="reload">
            <Button className="load-all" onClick={this.getMagicCards}>
              Reload All Cards
            </Button>
          </div>
        </div>
        <div className="cards">
          {cards.map(card => (
            <Card className="creature-card">
              {card.imageUrl ? (
                <CardImg
                  top
                  width="70%"
                  key={card.id}
                  src={card.imageUrl}
                  alt="Card image"
                />
              ) : (
                <CardImg
                  className="fallback-card"
                  key={card.id}
                  src={backCard}
                  alt="image not found"
                />
              )}
              <CardBody className="card-body">
                <CardTitle className="card-titles">~{card.name}~</CardTitle>
                <CardText>Artist: {card.artist}</CardText>
                <CardText>Set Name: {card.setName}</CardText>
                <CardText>Original Type: {card.type}</CardText>
              </CardBody>
            </Card>
          ))}

          {isLoading && (
            <div className="skeleton">
              <SkeletonTheme color="#d6d3d3">
                <Skeleton width={300} height={450} count={20} />
              </SkeletonTheme>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CardComponent;
