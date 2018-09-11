var MAP;
var ROAD;

var ROAD_INFO = {};

ymaps.ready(init);

function init(){
  // Создание карты.
  MAP = new ymaps.Map("map", {
      // Координаты центра карты.
      // Порядок по умолчнию: «широта, долгота».
      center: [55.76, 37.64],
      zoom: 4,
      controls: []
  });

  initRequests();
  initWS();
}

function initWS() {
  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
  var ws_path = ws_scheme + '://' + window.location.host;
  var socket = new WebSocket(ws_path);

  socket.onopen = function () {
    console.log("Connected to socket");
  };
  socket.onclose = function () {
    console.log("Disconnected from socket");
  }

  socket.onmessage = function(data) {
    initRequests();
  }
}



function initRequests() {
  fetch(API_URL+'getFactory/', {
      method: 'get'
  }).then(headerMiddleware)
  .then(renderFactorys).catch(errorHandler);

  fetch(API_URL + 'getSump/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderSump).catch(errorHandler);

  fetch(API_URL + 'getStorage/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderStorage).catch(errorHandler);

  fetch(API_URL + 'getPetrol/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderPetrol).catch(errorHandler);

  fetch(API_URL + 'getLine/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderPipeLines).catch(errorHandler);

}

function renderFactorys(data) {
  if (data){
    console.log('factorys');
    console.log(data);
    data.forEach(function(factory) {
      var newOilFactory = new ymaps.Placemark(factory.address, {
        hintContent: factory.title
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'assets/icons/oil-factory.svg',
        iconImageSize: [50, 65],
        iconImageOffset: [-22, -62]
      });
      newOilFactory.events.add('click', function () {
        selectedMarks.add(newOilFactory.geometry._coordinates, newOilFactory.properties._data.hintContent);
      });
      MAP.geoObjects.add(newOilFactory);
    });
  }
}

function renderSump(data) {
  if (data) {
    console.log('sump');
    console.log(data);
    data.forEach(function(oilSump) {
      var newOilSump = new ymaps.Placemark(oilSump.address, {
        hintContent: oilSump.title
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'assets/icons/oil-sump.svg',
        iconImageSize: [50, 65],
        iconImageOffset: [-22, -62]
      });
      newOilSump.events.add('click', function () {
        selectedMarks.add(newOilSump.geometry._coordinates, newOilSump.properties._data.hintContent);
      });
      MAP.geoObjects.add(newOilSump);
    });
  }
}


function renderStorage(data) {
  if (data) {
    console.log('storage');
    console.log(data);
    data.forEach(function(oilStorage) {
      var newOilStorage = new ymaps.Placemark(oilStorage.address, {
        hintContent: oilStorage.title
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'assets/icons/oil-storage.svg',
        iconImageSize: [50, 65],
        iconImageOffset: [-22, -62]
      });
      newOilStorage.events.add('click', function () {
        selectedMarks.add(newOilStorage.geometry._coordinates, newOilStorage.properties._data.hintContent);
      });
      MAP.geoObjects.add(newOilStorage);
    });
  }
}



function renderPetrol(data) {
  if (data) {
    console.log('petrol');
    console.log(data);
    data.forEach(function(oilPetrol) {
      var newOilPetrol = new ymaps.Placemark(oilPetrol.address, {
        hintContent: oilPetrol.title
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'assets/icons/oil-petrol.svg',
        iconImageSize: [50, 65],
        iconImageOffset: [-22, -62]
      });
      newOilPetrol.events.add('click', function () {
        selectedMarks.add(newOilPetrol.geometry._coordinates, newOilPetrol.properties._data.hintContent);
      });
      MAP.geoObjects.add(newOilPetrol);
    });
  }
}

function renderPipeLines(data) {
  console.log('line');
  console.log(data);
  data.forEach(function(pipe) {
    var _line = [pipe.start_point];
    if (pipe.point && pipe.point.length) {
      pipe.point.forEach(function(_point) {
        _line.push(_point.address);
      });
    }
    _line.push(pipe.end_point);
    MAP.geoObjects.add(
      new ymaps.Polyline([..._line], {}, {
      strokeWidth: Math.round(pipe.percent/10),
      strokeColor: '#555',
    })
    );
  })
}

function renderRoads(data) {
  if (data) {
    var _road = [];
    data.forEach(function(road) {
      if (road.coord && road.coord.length) {
        _road.push(road.coord);
      }
    });

    ymaps.route(_road, {
      viaIndexes: [2,3],
    }).then(
      function(route) {
        route.getPaths().options.set({
          // Можно выставить настройки графики маршруту.
          strokeColor: '#0072bc',
          opacity: 0.9
        });
        _road.forEach(function(el, i) {
          route.getWayPoints().get(i).options.set("iconLayout", null);
        });
        ROAD_INFO.length = route.getLength()
        ROAD_INFO.time = route.getTime();
        ROAD && MAP.geoObjects.remove(ROAD);
        MAP.geoObjects.add(ROAD = route);
        renderRoadInfo();
      },
      function(error) {
        console.error(error);
      }
    );

  }
}


function headerMiddleware(ans) {
  if (ans.headers.get('Content-Type') === 'application/json') return ans.json();
  return new Error('Invalid answer type');
}

function errorHandler(err) {
  console.log(err);
}