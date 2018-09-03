
var selectedMarks = (function() {
  var card = document.querySelector('.map-coords-info-card')
  var cardContent = card.children[0];
  return {
    status: false,
    render: function() {
      cardContent.innerHTML = '';
      if (this.places.length < 2) {
        card.children[1].children[1].setAttribute('disabled', '');
      } else {
        card.children[1].children[1].removeAttribute('disabled');
      }
      if (this.places.length) {
        this.places.forEach(function(itemData, i) {
          var item = document.createElement('div');
          item.classList.add('map-coords-info-card-item');
          item.innerText = itemData.name;
          item.setAttribute('index', i);
          item.addEventListener('click', deleteItem);
          cardContent.appendChild(item);
        })
      }
    },
    add: function(coord, name) {
      if (!this.places.some(function(el, i) {
        return el.coord[0] === coord[0] && el.coord[1] === coord[1] && el.name === name;
      })) {
        this.places.push({
          coord: coord,
          name: name
        });
        this.show();
      }
    },
    clearAll: function() {
      this.hide();
      this.places = [];
    },
    places: [],
    show: function() {
      card.style.display = 'block';
      this.render();
    },
    hide: function() {
      card.style.display = 'none';
    }
  }
}());


function renderRoadInfo() {
  var roadInfo = document.querySelector('.road-info');
  roadInfo.innerHTML = '';
  var roadLength = document.createElement('div');
  var roadTime = document.createElement('div');
  roadLength.innerText = Math.round(ROAD_INFO.length/100)/10 + '  км';
  roadTime.innerText = Math.round(ROAD_INFO.time/360)/10 + ' ч';
  roadInfo.appendChild(roadLength);
  roadInfo.appendChild(roadTime);
}