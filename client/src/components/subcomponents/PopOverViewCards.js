import React, { Component } from "react";
import { Button, ButtonGroup, Popover, PopoverHeader, PopoverBody } from "shards-react";
import '../pages/ViewCards.css';


const PopOverViewCards = (props) => {
    if(props.view == true){
        return(
            <div id="button-group">
            <ButtonGroup >
            <Button id="popover" onClick={props.function_today} outline>Today</Button>
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
            <Button onClick={props.function_all}>All</Button>
            </ButtonGroup>
        </div>
        )
    }
    else{
        return(
            <div id="button-group">
            <ButtonGroup >
            <Button id="popover" onClick={props.function_today}>Today</Button>
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
            <Button onClick={props.function_all} outline>All</Button>
            </ButtonGroup>
        </div>
        )
    }


}

export default PopOverViewCards;