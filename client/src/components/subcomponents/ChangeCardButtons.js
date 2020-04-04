import React, { Component } from "react";
import { Button } from "shards-react";
import { TiMediaPlay, TiMediaPlayReverse } from 'react-icons/ti';
import '../pages/ViewCards.css';


const ChangeCardButtons = (props) => {
    if(props.view == false){
        return(null);
    }
    else{
        return (
            <div className="switch-card-button" style={{ visibility: props.view ? 'visible' : 'hidden'}}>
              <Button id="button-click" theme="secondary" disabled={props.index == 0} onClick={() => { props.passedFunction("BACK") }}>
                <TiMediaPlayReverse size={30} />
              </Button>
              <Button id="button-click" theme="secondary" onClick={() => { props.passedFunction("NEXT") }}>
                <TiMediaPlay size={30} />
              </Button>
            </div>
        );
    }

}

export default ChangeCardButtons;