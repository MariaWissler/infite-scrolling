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
      totalCards: 0,
    };
  }

  componentDidMount() {
    // fetch the initial list of magic cards
    this.getMagicCards();
    // add the event listener to to handle infinite scroll
    window.addEventListener("scroll", this.handleScroll);
  }

  componentUnMount() {
    // let's make sure wer emove the scrolle event listener when the comp. unmounts
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { page, isLoading,totalCards } = this.state;
    // when  user scrolls to the bottom, then get the new list of magic cards
    if (isLoading) {
      // if a request is pending, we need wait for it to finish before fetch another list
      return null;
    }
    if(totalCards !== this.state.cards.length ){
    this.setState(
      {
        page: page + 1
      },

      () => this.getMagicCards()
    )};
  };

  handleInput = event => {
    this.setState({ queryName: event.target.value });
    console.log(`this is the search value`, this.state.queryName);
  };

  getMagicCards = () => {
    const { cards, page, pageSize } = this.state;
    this.setState({
      isLoading: true
    })

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
    const { cards, page, pageSize, queryName } = this.state;
    this.setState({
      isLoading: true
    })

    let searchName = queryName.toLowerCase();

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
          totalCards: cards.length,
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
       <div>
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
            <CardBody clasName="card-body">
              <CardTitle className="card-titles">{card.name}</CardTitle>
              <CardText>Artist:{card.artist}</CardText>
              <CardText>Set Name:{card.setName}</CardText>
              <CardText>Original Type:{card.type}</CardText>
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
