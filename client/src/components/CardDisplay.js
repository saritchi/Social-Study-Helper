import React from 'react'
import './CardDisplay.css'
import InfoCard from './InfoCard';

const CardDisplay = (props) => {
    return (
        <div className="cards">
            {props.cardsInfo.map(cardInfo => <InfoCard key={cardInfo.id} info={cardInfo.name}/>)}
        </div>
    )
};

export default CardDisplay;