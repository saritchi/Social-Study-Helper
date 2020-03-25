import React from 'react'
import './CardDisplay.css'
import InfoCard from './InfoCard';

const CardDisplay = (props) => {
    return (
        <div className="cards">
            {props.cardsInfo.map(cardInfo => <InfoCard key={cardInfo.id} 
                                                       id={cardInfo.id} 
                                                       info={cardInfo.name} 
                                                       changePage={props.changePage}
                                                       options={props.options}
                                            />)}
        </div>
    )
};

export default CardDisplay;