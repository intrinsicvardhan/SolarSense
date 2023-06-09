var markers = [];
var mark = [];
var array = [];
var area;
var nom_value ;

function searchBox() {
     
        //hybrid map initially having bounds to Thapar University
            var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: 30.350243, lng: 76.360243},
              zoom: 20,
              mapTypeId: google.maps.MapTypeId.HYBRID
            });
            
         // properties of polygon   
            pol = new google.maps.Polygon({
              strokeColor: '#FF0000',
              strokeOpacity: 1.0, 
              fillOpacity: 0.50,
              fillColor: "darkorange",
              strokeWeight: 6,
              map: map,
            });

            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
              searchBox.setBounds(map.getBounds());
              
            });

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            
            searchBox.addListener('places_changed', function() {

                  var places = searchBox.getPlaces();
                  if (places.length == 0) {
                    return;
                  }

                  // Clear out the old markers.
                  markers.forEach(function(marker) {
                      marker.setMap(null);
                      });
                  markers = [];
                  
                  // For each place, get the icon, name and location.

                  var bounds = new google.maps.LatLngBounds();
                      
                    places.forEach(function(place) {
                            
                            if (!place.geometry) {
                              console.log("Returned place contains no geometry");
                              return;
                              
                            }
              
                        // Create a marker for each place.
                        markers.push(new google.maps.Marker({
                                map: map,
                                title: place.name,
                                position: place.geometry.location
                              }));         

                          if (place.geometry.viewport) {
                            
                        // Only geocodes have viewport
                          
                        bounds.union(place.geometry.viewport);
                          } else {
                            bounds.extend(place.geometry.location);
                          }
                          
                    });
                
                  map.fitBounds(bounds);
 
            });

        map.addListener('click', function(e) {
            document.getElementById("path").disabled = false;
            map.setZoom(20);
            placeMarkerAndPanTo(e.latLng, map);
          });
         
  }

  function placeMarkerAndPanTo(latLng, map) {
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });

        mark.push(marker);

        map.panTo(latLng);

        //storing the values to draw path by selecting location on map by clicking on map
        var latlong = latLng;                         
        var len = array.length;
        array[len] = latlong;

        /*
        to calculate nominal value based on the various factors on each place 
        */

        /*
        assumptions for nominal power calculation, added power value to power array for each selected place 
        to execute uncomment the following code
        */
      
              /* var num = power[i]+100;
              power.push(num);
              i++;  */

  }


  function drawPolygon(){
    document.getElementById("cal_area").disabled = false;
    pol.setPath(array);
   
  }


  function calculateArea(){
    
    document.getElementById("nominal").disabled = false;
  
    area = google.maps.geometry.spherical.computeArea(pol.getPath());
   
    document.getElementById('getarea').value = area;
    
  }

  function areaTosolarPanelProduction() {
    //assuming an average solar panel production of 0.2 kW per area utilisation
     area = google.maps.geometry.spherical.computeArea(pol.getPath()); 
     return area*0.2;
  }

  // function calculateCarbonEmisisons() {
  //   document.getElementById("reduce").disabled=false; 
  //   const lbsToMetricTons = 0.000453592;
  //   var emissionSavedLbs = areaTosolarPanelProduction()*1900; 
  //   document.getElementById("reduce").value = emissionSavedLbs*100; 
  // }

  function calculateCarbonEmisisonsReduction() {
    document.getElementById('reduce').disabled =false;
    var area = document.getElementById('getarea').value; 
    var solarPanelProduction = area*0.001; 
    var calculateCarbonEmisisonsReduction = solarPanelProduction*0.95; 
    document.getElementById('reduce') = calculateCarbonEmisisonsReduction; 
  }

  // function calculateEquivalentArea(solarPanelCapacity, solarInsolation, solarPanelEfficiency) {
  //   const efficiency = solarPanelEfficiency/100; 
  //   const annualElectricityProduction = solarPanelCapacity*solarInsolation*365; 
  //   const equivalentArea = annualElectricityProduction/(efficiency*solarInsolation); 
  //   return equivalentArea;
  // }

  function calculateNominalArea(){
    
    // calculated nominal value with a predefined value

    nom_value = document.getElementById('getarea').value * 0.68782634483;
    
    /* 
    to calculate nominal value based on the various factors on each place 
    I assumed by getting the max value of intensity from the data.
    nom_value = Math.max(...power);
    
    */

    document.getElementById('nom_val').value = nom_value;
  }

 
