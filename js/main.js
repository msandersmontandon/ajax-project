/* global data */

var $header = document.querySelector('header');
var $pickButton = $header.querySelector('[data-view="pick"]');
var $pickButtonMobile = $header.querySelector('[data-view="pick mobile"]');
var $container = document.querySelector('.container');
var $menu = document.querySelector('.menu');
var $mobileRows = $header.querySelectorAll('.mobile');
var $foreground = document.querySelector('.foreground');
var $foregroundCard = $foreground.querySelector('img');
var $foregroundTextName = $foreground.querySelector('#card-name');
var $foregroundTextDescription = $foreground.querySelector('#card-description');
var $foregroundTextUp = $foreground.querySelector('#card-up');
var $foregroundTextReverse = $foreground.querySelector('#card-reverse');

function Spread() {
  this.cards = [];
}

Spread.prototype.setTable = function () {
  if (data.currentTable) {
    data.currentTable.remove();
    data.currentCards = [];
    data.cards = [];
  }
  data.currentTable = document.createElement('div');
  data.currentTable.className = 'row card-display';
  $container.appendChild(data.currentTable);
};

Spread.prototype.pickCard = function (quantity) {
  var cardRequest = new XMLHttpRequest();
  cardRequest.open('GET', 'https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=' + quantity);
  cardRequest.responseType = 'json';
  cardRequest.addEventListener('load', function () {
    for (var i = 0; i < quantity; i++) {
      data.cards.push(cardRequest.response.cards[i]);
      var currentCardIndex = data.cards.length - 1;
      data.cards[currentCardIndex].image = 'archive/cards/' + data.cards[currentCardIndex].name_short + '.jpg';
      var $cardColumn = document.createElement('div');
      $cardColumn.className = 'column-card';
      data.currentTable.appendChild($cardColumn);

      var $cardWrap = document.createElement('div');
      $cardWrap.className = 'card-wrapper';
      $cardWrap.setAttribute('data-card-index', currentCardIndex);
      $cardColumn.appendChild($cardWrap);

      var $cardElement = document.createElement('div');
      $cardElement.className = 'card';
      $cardWrap.appendChild($cardElement);

      var $cardImg = document.createElement('img');
      $cardImg.setAttribute('src', data.cards[currentCardIndex].image);
      $cardImg.setAttribute('alt', data.cards[currentCardIndex].name);
      $cardImg.setAttribute('title', data.cards[currentCardIndex].name);
      $cardElement.appendChild($cardImg);

      data.currentCards.push({
        cardColumn: $cardColumn,
        cardWrap: $cardWrap,
        cardElement: $cardElement,
        cardImg: $cardColumn,
        card: data.cards[currentCardIndex]
      });
    }
  });
  cardRequest.send();
};

function pickOne() {
  data.currentSpread = new Spread();
  data.currentSpread.setTable();
  data.currentSpread.pickCard(1);
}

function resetForeground() {
  $foreground.className += ' hidden';
  data.foregroundHidden = true;
  if (!data.descriptionHidden) {
    $foregroundTextName.closest('.description-wrapper').className += ' hidden';
    data.descriptionHidden = true;
  }
  data.currentCards[data.selectedIndex].cardWrap.className = data.currentCards[data.selectedIndex].cardWrap.className.replace(' hidden', '');
  data.selectedIndex = null;
}

$pickButton.addEventListener('click', function () {
  if (!data.foregroundHidden) {
    resetForeground();
  }
  pickOne();
});
$pickButtonMobile.addEventListener('click', function () {
  if (!data.foregroundHidden) {
    resetForeground();
  }
  pickOne();
});
$menu.addEventListener('click', function (event) {
  if (data.mobileHidden) {
    for (var i = 0; i < $mobileRows.length; i++) {
      $mobileRows[i].className = $mobileRows[i].className.replace(' hidden', '');
    }
    data.mobileHidden = false;
  } else {
    for (i = 0; i < $mobileRows.length; i++) {
      $mobileRows[i].className += ' hidden';
    }
    data.mobileHidden = true;
  }
});
window.addEventListener('resize', function (event) {
  if (event.target.innerWidth >= 415 && !data.mobileHidden) {
    for (var i = 0; i < $mobileRows.length; i++) {
      $mobileRows[i].className += ' hidden';
    }
    data.mobileHidden = true;
  }
});
$container.addEventListener('click', function (event) {
  if (event.target.closest('.card-wrapper')) {
    $foreground.className = $foreground.className.replace(' hidden', '');
    data.foregroundHidden = false;
    event.target.closest('.card-wrapper').className += ' hidden';
    data.selectedIndex = parseInt(event.target.closest('.card-wrapper').getAttribute('data-card-index'));
    $foregroundCard.setAttribute('src', data.currentCards[data.selectedIndex].card.image);
    $foregroundCard.setAttribute('alt', data.currentCards[data.selectedIndex].card.name);
    $foregroundCard.setAttribute('title', data.currentCards[data.selectedIndex].card.name);
    $foregroundTextName.textContent = data.currentCards[data.selectedIndex].card.name;
    $foregroundTextDescription.textContent = data.currentCards[data.selectedIndex].card.desc;
    $foregroundTextUp.textContent = data.currentCards[data.selectedIndex].card.meaning_up;
    $foregroundTextReverse.textContent = data.currentCards[data.selectedIndex].card.meaning_rev;
  }
});

$foreground.addEventListener('click', function (event) {
  if (event.target.closest('.card-wrapper')) {
    if (data.descriptionHidden) {
      for (var i = 0; i < $mobileRows.length; i++) {
        $foregroundTextName.closest('.description-wrapper').className = $foregroundTextName.closest('.description-wrapper').className.replace(' hidden', '');
      }
      data.descriptionHidden = false;
    } else {
      for (i = 0; i < $mobileRows.length; i++) {
        $foregroundTextName.closest('.description-wrapper').className += ' hidden';
      }
      data.descriptionHidden = true;
    }
  } else if (!event.target.closest('.description-wrapper')) {
    resetForeground();
  }
});
