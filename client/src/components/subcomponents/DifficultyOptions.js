import React, { Component } from "react";
import { Button } from "shards-react";
import '../pages/ViewCards.css';


const DifficultyOptions = (props) => {
    if(props.view == true){
        return(null);
    }
    else{
        return (
            <div className="difficulty-button-container" style={{ visibility: props.view ? 'hidden' : 'visible'}}>
                <h5>How difficult is this card?</h5>
                <Button className="difficulty-button" size="lg" theme="success" onClick={(e) => props.passedFunction(e, "EASY")}>Easy</Button>
                <Button className="difficulty-button" size="lg" onClick={(e) => props.passedFunction(e, "MEDIUM")}>Medium</Button>
                <Button className="difficulty-button" size="lg" theme="danger" onClick={(e) => props.passedFunction(e, "HARD")}>Hard</Button>
          </div>
        );
    }

}

export default DifficultyOptions;