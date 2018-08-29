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

  fetch(API_URL+'getRoad/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderRoads).catch(errorHandler);

  fetch(API_URL + 'getOilSump/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderOilSump).catch(errorHandler);

  fetch(API_URL + 'getOilStorage/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderOilStorage).catch(errorHandler);

  fetch(API_URL + 'getLine/', {
    method: 'get'
  }).then(headerMiddleware)
  .then(renderPipeLines).catch(errorHandler);
}

function renderPipeLines(data) {
  // console.log(data);
  data.forEach(function(pipe) {
    var newPipe =
    MAP.geoObjects.add(
      new ymaps.Polyline([pipe.factory_point, pipe.oilstorage_point, pipe.oilsump_point], {}, {
      strokeWidth: Math.round(pipe.percent/10),
      strokeColor: '#555',
    })
    );
  })
}

function renderOilStorage(data) {
  if (data) {
    // console.log(data);
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

function renderOilSump(data) {
  if (data) {
    // console.log(data);
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

function renderRoads(data) {
  if (data) {
    console.log(data);
    data.forEach(function(road) {
      let _road = [];
      if (road.oilstorage_point !== "None") _road.push(road.oilstorage_point);
      if (road.oilsump_point !== "None") _road.push(road.oilsump_point);
      if (road.factory_point !== "None") _road.push(road.factory_point);
      console.log(_road);
      ymaps.route([..._road], {
        viaIndexes: [2,3],
      }).then(
        function(route) {
          route.getPaths().options.set({
            // Можно выставить настройки графики маршруту.
            strokeColor: '#0072bc',
            opacity: 0.9
          });
          route.getWayPoints().get(0).options.set("iconLayout", null);
          route.getWayPoints().get(1).options.set("iconLayout", null);
          MAP.geoObjects.add(route);
        },
        function(error) {
          console.error(error);
        }
      );
    });
  }
}

function renderFactorys(data) {
  if (data){
      // console.log(data);
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

function headerMiddleware(ans) {
  if (ans.headers.get('Content-Type') === 'application/json') return ans.json();
  return new Error('Invalid answer type');
}

function errorHandler(err) {
  console.log(err);
}