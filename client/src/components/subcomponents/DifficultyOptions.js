import React from "react";
import { Button } from "shards-react";
import './DifficultyOptions.css';


const DifficultyOptions = (props) => {
    return (
        <div className="difficulty-button-container">
            <h5>How difficult is this card?</h5>
            <Button className="difficulty-button" id="easy-button" size="lg" theme="success" onClick={(e) => props.passedFunction(e, "EASY")}>Easy</Button>
            <Button className="difficulty-button" id="med-button" size="lg" onClick={(e) => props.passedFunction(e, "MEDIUM")}>Medium</Button>
            <Button className="difficulty-button" id="hard-button" size="lg" onClick={(e) => props.passedFunction(e, "HARD")}>Hard</Button>
        </div>
    );

}

export default DifficultyOptions;