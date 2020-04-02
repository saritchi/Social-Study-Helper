import React from 'react'
import './CardDisplay.css'
import InfoCard from './InfoCard';

const CardDisplay = (props) => {
    return (
        <div className="cards">
            {props.cardsInfo.map(cardInfo => <InfoCard key={cardInfo.id} 
                                                       id={cardInfo.id} 
                                                       info={cardInfo.name}
                                                       sharedWithUsers={cardInfo.sharedWith}
                                                       {...props}
                                            />)}
        </div>
    )
};

export default CardDisplay;