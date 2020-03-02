/*
    new_card.js

    Description: 
        When the "New Card" button is clicked, two new text fields will be created (Term and Definition)

    

*/


var newCard = document.getElementById("new_card_btn");
var labelCount = 1; //number of starting cards (before new card btn is clicked)

newCard.onclick = () => {
    labelCount++;
    //gets the "div" where all the term and definition pairs sit
    var termList = document.getElementById("TermList");

    //Creates a new label and text field for the term portion of card
    var node = document.createElement("Label");
    node.innerHTML = "Term: ";
    termList.appendChild(node);

    var input_term = document.createElement("input");
    input_term.setAttribute("type", "text");
    input_term.setAttribute("name", "term"+labelCount)
    termList.appendChild(input_term);

    //Creates a new label and text field for the definition portion of the card
    var node = document.createElement("Label");
    node.innerHTML = "Definition: ";
    termList.appendChild(node);

    var input_term = document.createElement("input");
    input_term.setAttribute("type", "text");
    input_term.setAttribute("name", "defn"+labelCount)
    termList.appendChild(input_term);

    //adds spacing after each new card
    termList.appendChild(document.createElement("BR"));
}