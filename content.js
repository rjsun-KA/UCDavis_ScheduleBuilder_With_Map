/* 1）import下面的东西
<script async
src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
</script>
    2） 加一个叫map的div*/




function initMap(){
    var options = {
        zoom : 8,
        center:{lat:42.3601, lng: -71.0589}
    }
    var map = new 
    google.map.Map(document.getElementById('map'), options);

    var marker = new google.maps.Marker({
        position:{lat:42.4668, lng: -70.9495},
        map:map
    });


    }
