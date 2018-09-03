function showRoads() {
  MAP.geoObjects.remove(ROAD);
  ROAD = null;
  renderRoads(selectedMarks.places);
}

function clearAll() {
  selectedMarks.clearAll();
  MAP.geoObjects.remove(ROAD);
  ROAD = null;
  ROAD_INFO = {};
}

function deleteItem(event) {
  var item = event.target;
  var index = item.getAttribute('index');
  selectedMarks.places.splice(index, 1);
  selectedMarks.render();
}