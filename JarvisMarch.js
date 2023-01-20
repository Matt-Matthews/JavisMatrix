//const { json } = require('stream/consumers');
const { log } = require("console");
const IOfileObj = require("fs");

//get
var coordinatesTest = getFileData("openstreetMapData.txt");
var coordinatesTest1 = getFileData("polygonTest/test1.json");
var coordinatesTest2 = getFileData("polygonTest/test2.json");
var coordinatesTest3 = getFileData("polygonTest/test3.json");
var Array_2D;
/*
var objLocation = {
    lat: ,
    lon: ,
}
get array of lon lat [lat,lon]
map into json array
 instance = {
    lat: 5544,
    lon: 8954
 }

*/

function getCoordinates(geometry) {
  const { type, coordinates } = geometry;

  if (
    type !== "MultiPolygon" &&
    type !== "Polygon" &&
    type !== "MultiLineString"
  ) {
    return coordinates.map((coord, i) => ({
      type,
      lat: coord[1],
      lng: coord[0],
    }));
  } else if (type === "Polygon") {
    // Polygon inspection
    // console.log(type, coordinates[0])
    return coordinates[0].map((coord, i) => ({
      type,
      lat: coord[1],
      lng: coord[0],
    }));
  } else if (type === "MultiLineString") {
    return coordinates.map((coords) =>
      coords.map((c) => ({ type, lat: c[1], lng: c[0] }))
    );
  } else {
    coordinates.forEach((coords) => {
      coords.forEach((c) => {
        return c.map((x) => ({ type, lat: x[1], lng: x[0] }));
      });
    });
  }
}

function GeoJson() {
  var bufferData = IOfileObj.readFileSync("polygonTest/test4.geojson");
  var JsonData = JSON.parse(bufferData.toString().trim());

  JsonData = JsonData["features"];
  var coordinatesDemo = [];
  var elementsData = [];
  var arrayData = [];

  JsonData.forEach((data) => {
    if (data.geometry.type !== "Point") {
      const geoCooordinates = getCoordinates(data.geometry);
      elementsData = [...elementsData, geoCooordinates];
    } else {
      const point = {
        type: data.geometry.type,
        lat: data.geometry.coordinates[1],
        lng: data.geometry.coordinates[0],
      };
      elementsData.push(point);
    }
  });

//   console.log(elementsData);

  // console.log(arrayData)

  // let newArrayData = arrayData.filter(e=>e.type !== 'Point'&& e.type!== 'MultiPolygon');

  // newArrayData.forEach(element=>{
  //     for(let i = 0;i<element.coordinates.length;i++){
  //         var temp = element.coordinates[i];
  //         coordinatesDemo.push({type: element.type,lat:temp[1], lon:temp[0]})

  //     }
  //     elementsData.push({elements : coordinatesDemo})
  // })
  // console.log(elementsData);

  // newArrayData.forEach(element=>{
  //     for(let i = 0;i<element.coordinates.length;i++){
  //         var temp = element.coordinates[i];
  //         coordinatesDemo.push({type: element.type,lat:temp[1], lon:temp[0]})

  //     }
  //     elementsData.push({elements : coordinatesDemo})
  // })

  //    let multiPolygonArray = arrayData.filter(e=>e.type=== 'MultiPolygon');
  //    coordinatesDemo = [];
  //    multiPolygonArray.forEach(element=>{
  //     console.log(element.coordinates.length);
  //     element.coordinates.forEach(i=>{
  //             // console.log("First Array", i[0])
  //             i.forEach(x=>{
  //                 for(let a = 0;a<x.length;a++){
  //                     var temp = x[a];
  //                     coordinatesDemo.push({type: element.type,lat:temp[1], lon:temp[0]})
  //                 }
  //                 // console.log(coordinatesDemo);
  //                 elementsData.push({elements : coordinatesDemo})
  //             })
  //         })
  //     })
}

GeoJson();

function getFileData(filePath) {
  //get data from local file
  var JsonData;
  var bufferData;
  var arrayCoordinates;
  bufferData = IOfileObj.readFileSync(filePath);
  JsonData = JSON.parse(bufferData.toString().trim());
  arrayCoordinates = JsonData["elements"].filter((i) => i.type === "node");
  return arrayCoordinates;
}

function writeResultData(ConvexHulldata, coordinatesData, fileName) {
  //write data to index fie
  IOfileObj.writeFileSync(
    fileName + "convexHull.txt",
    JSON.stringify(ConvexHulldata)
  );
  IOfileObj.writeFileSync(
    fileName + "coordinates.txt",
    JSON.stringify(coordinatesData)
  );
}

console.log("start");
function getLowestIndex(coordinates) {
  //function returns index of lowest/left most point of coordinates
  let LowestPoint = coordinates[0];
  var lowestIndex = 0;

  //for each to loop through elemnts
  coordinates.forEach((element, index) => {
    if (LowestPoint.lon >= element.lon) {
      LowestPoint = element;
      lowestIndex = index;
    }
  });
  return lowestIndex;
}

//orientation function

function orientation(point1, point2, point3) {
  let val =
    (point2.lat - point1.lat) * (point3.lon - point2.lon) -
    (point2.lon - point1.lon) * (point3.lat - point2.lat);

  if (val === 0) return 0;

  return val > 0 ? 1 : 2;
}

function getConvexHull(/*array data*/ coordinates) {
  var lowestIndex = getLowestIndex(coordinates);
  var OuterHexagon = [];
  let p = lowestIndex,
    q;
  do {
    OuterHexagon.push(coordinates[p]);

    q = (p + 1) % coordinates.length;
    for (let i = 0; i < coordinates.length; i++) {
      if (orientation(coordinates[p], coordinates[i], coordinates[q]) === 2) {
        q = i;
      }
    }
    p = q;
  } while (p !== lowestIndex);
  return OuterHexagon;
}

// getConvexHull(coordinatesTest);
// getConvexHull(coordinatesTest1);
// getConvexHull(coordinatesTest2);
// getConvexHull(coordina
// console.log(convexArr);

writeResultData(getConvexHull(coordinatesTest), coordinatesTest, "_");
writeResultData(getConvexHull(coordinatesTest1), coordinatesTest1, "_1");
writeResultData(getConvexHull(coordinatesTest2), coordinatesTest2, "_2");
writeResultData(getConvexHull(coordinatesTest3), coordinatesTest3, "_3");
console.log("done");
/*
writeBuffer.writeFileSync("convexHull.txt",JSON.stringify(OuterHexagon) )
writeBuffer.writeFileSync("coordinates.txt",JSON.stringify(coordinates) )
*/
//const writeBuffer = require('fs').writeFileSync("convexHull.txt",JSON.stringify(OuterHexagon));

/*
 getConvexHull(coordinates){


    return conextHull[];
    array1+","+ array2
 }

 
*/
