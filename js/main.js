/* global data */

var $header = document.querySelector('.head');
var $pickButton = $header.querySelector('[data-view="pick"]');
var $pickButtonMobile = $header.querySelector('[data-view="pick"]');
var $card = document.querySelector('.card img');

function pickCard(event, quantity) {
  console.log('cardRequest');
  var cardRequest = new XMLHttpRequest();
  cardRequest.open('GET', 'https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=' + quantity);
  console.log(cardRequest);
  cardRequest.responseType = 'json';
  cardRequest.addEventListener('load', function () {
    console.log(cardRequest.status);
    console.log(cardRequest.response);
    data.card = cardRequest.response.cards[0];
    console.log(data.card.name);
    $card.setAttribute('src', 'archive/cards/' + data.card.name_short + '.jpg');
  });
  cardRequest.send();
}

// function cardDisplay() {
//   console.log(data.card.name_short);
//   $card.setAttribute('src', 'archive/cards/' + data.card.name_short + '.jpg');
// }

function pickOne(event) {
  pickCard(event, 1);
  // cardDisplay();
}

$pickButton.addEventListener('click', pickOne);
$pickButtonMobile.addEventListener('click', pickOne);
