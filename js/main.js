var MAP;

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
      var myGeoObject = new ymaps.Placemark(factory.address, {
        hintContent: factory.title
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'assets/icons/oil-factory.svg',
        iconImageSize: [50, 65],
        iconImageOffset: [-47, -57]
      });
      MAP.geoObjects.add(myGeoObject);
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
        iconImageOffset: [-47, -57]
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
        iconImageSize: [40, 50],
        iconImageOffset: [-15, -55]
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
        iconImageOffset: [-47, -57]
      });
      MAP.geoObjects.add(newOilPetrol);
    });
  }
}

function renderPipeLines(data) {
  console.log('line');
  console.log(data);
  renderRoads(data);
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
    console.log('road');
    console.log(data);
    data.forEach(function(road) {
      let _road = [];
      _road.push(road.start_point);
      if (road.point && road.point.length) {
        road.point.forEach(function(_point) {
          _road.push(_point.address);
        })
      }
      _road.push(road.end_point);

      ymaps.route([..._road], {
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
          })
          MAP.geoObjects.add(route);
        },
        function(error) {
          console.error(error);
        }
      );
    });
  }
}


function headerMiddleware(ans) {
  if (ans.headers.get('Content-Type') === 'application/json') return ans.json();
  return new Error('Invalid answer type');
}

function errorHandler(err) {
  console.log(err);
}