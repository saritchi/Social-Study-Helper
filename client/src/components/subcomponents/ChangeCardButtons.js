import React from "react";
import { Button } from "shards-react";
import { TiMediaPlay, TiMediaPlayReverse } from 'react-icons/ti';
import './ChangeCardButtons.css';


const ChangeCardButtons = (props) => {

    if(props.user_role === "teacher"){
        return (
          <div className="switch-card-button">
            <Button id="button-click" theme="secondary" disabled={props.index === 0} onClick={() => { props.passedFunction("BACK") }}>
              <TiMediaPlayReverse size={30} />
            </Button>
            <Button id="button-click" theme="secondary" onClick={() => { props.passedFunction("NEXT") }}>
              <TiMediaPlay size={30} />
            </Button>
          </div>
      );
    }
    else if(!props.view){
        return(null);
    }
    else{
        return (
            <div className="switch-card-button" style={{ visibility: props.view ? 'visible' : 'hidden'}}>
              <Button id="button-click" theme="secondary" disabled={props.index === 0} onClick={() => { props.passedFunction("BACK") }}>
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