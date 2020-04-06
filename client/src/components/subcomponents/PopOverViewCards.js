import React from "react";
import { Button, ButtonGroup, Popover, PopoverHeader, PopoverBody } from "shards-react";
import './PopOverViewCards.css';


const PopOverViewCards = (props) => {
    console.log(props.user_role)
    if(props.user_role !== "teacher"){
        return(
            <div>
            <ButtonGroup id="viewCard-options">
            <Button id="popover" onClick={props.function_today} outline={props.view}>Today</Button>
                <Popover
                placement="bottom"
                open={props.open}
                toggle={props.function_toggle}
                target="#popover"
                >
                <PopoverHeader>Done required cards!</PopoverHeader>
                <PopoverBody>
                    It looks like you have studied all the required cards for today.
                    Come back another day to get your practice in! You can still choose
                    to view all cards.
                </PopoverBody>
                </Popover>
            <Button id="view-all-cards" onClick={props.function_all} outline={!props.view}>All</Button>
            </ButtonGroup>
        </div>
        )
    }else{
        return(
            <div></div>
        )
    }

}

export default PopOverViewCards;