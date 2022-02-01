var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var d = new Date();
  var month = months[d.getMonth()];
  var todaysDate = month + " " + d.getDate() + ", " + d.getFullYear() + " ";
  var salats = ["Fajr", "Zuhr", "Asr", "Magrib", "Isha"];



function timer(countDownDate, secondCountDownDate, nxtSalat, nxtSalat2) {
       
       
        
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        distance = countDownDate - now;
       
       

        // Time calculations for hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);


        // Output the result in an element with id="demo"
        document.getElementById("demo").innerHTML = hours + "h " +
          minutes + "m " + seconds + "s ";
        document.getElementById("next-salat").innerHTML = salats[nxtSalat];


        if (distance < 0) {
          document.getElementById("next-salat").innerHTML = salats[nxtSalat2];


          distance = secondCountDownDate - now;

          hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          seconds = Math.floor((distance % (1000 * 60)) / 1000);

          document.getElementById("demo").innerHTML = hours + "h " +
            minutes + "m " + seconds + "s ";
        }


      }






function loadSalatTimes(id = '854de233-d6db-4678-ab57-203930b187f8') {
  

  
  
  //formats current date
  function formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [month, day].join('-');
  }
  var today = formatDate();



  //fetch data from api based on mosque id and current date
  fetch('https://us-central1-cogent-tine-336309.cloudfunctions.net/prayer_get?mosqueId=' + id + '&day=2021-' + today)
    .then(response => response.json())
    .then(data => {

     

      //function to convert 24h time format to 12h time format
      var convert24hourTo12HourFormat = (time) => {
        var time_part_array = time.split(":");

        let ampm = 'AM';
        if (time_part_array[0] >= 12) {
          ampm = 'PM';
        }
        if (time_part_array[0] > 12) {
          time_part_array[0] = time_part_array[0] - 12;
        }

        var formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;
        return formatted_time;
      }


      var convertTime12to24 = (time12h) => {
        var [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
          hours = '00';
        }

        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
      }


      
      let currentHour = parseInt(d.getHours());
    
    
      //creates array using salat times from api call formated to 12h time
      let salatTimes = [convert24hourTo12HourFormat(data['fajr_iqama']), convert24hourTo12HourFormat(data['zuhr_iqama']), convert24hourTo12HourFormat(data['asr_iqama']), convert24hourTo12HourFormat(data['magrib_start']), convert24hourTo12HourFormat(data['isha_iqama'])];


      //creates array with only the hour from salat times 
      let convertedHours = salatTimes.map((date) => {

        let time = parseInt(date.split(' ')[0]);
        let period = date.split(' ')[1];


        if (time === 12 && period === 'PM')
          return time;

        if (time < 12 && period === 'AM')
          return time;

        return time + 12;
      });
    
    
      //finds next salat time using converted hours
      let getNearestTime = (convertedHours, currentHour) => {
        console.log(convertedHours, currentHour)
        let nearestTime;
        let minValue = convertedHours[0] > currentHour ? (convertedHours[0] - currentHour) : (currentHour - convertedHours[0]);
        convertedHours.reduce((minVal, hour) => {
          let hourDiff = (currentHour > hour) ? currentHour - hour : hour - currentHour;
          if (hourDiff <= minVal) {
            nearestTime = hour;
            return hourDiff;
          } else {
            return minVal;
          }

        }, minValue)


        let salatNum = convertedHours.indexOf(nearestTime);


        console.log(
          salatTimes[convertedHours.indexOf(nearestTime)],
          salatNum,
          salatTimes[convertedHours.indexOf(nearestTime) + 1],
          salatNum + 1
        )
        //returns next salat time, subsequent salat time, and index of next salat time 
        return [
          salatTimes[convertedHours.indexOf(nearestTime)],
          salatNum,
          salatTimes[convertedHours.indexOf(nearestTime) + 1],
          salatNum + 1
        ]





      };

      let nxtSalat = getNearestTime(convertedHours, currentHour);



      let timeRemaining = convertTime12to24(nxtSalat[0]);
      let countDownDate = new Date(todaysDate + timeRemaining).getTime();
      console.log(nxtSalat[2])
      
      let secondTimeRemaining = convertTime12to24(nxtSalat[2]);
      let secondCountDownDate = new Date(todaysDate + secondTimeRemaining).getTime();


      
      
      var myInterval = setInterval(timer, 1000, countDownDate, secondCountDownDate, nxtSalat[1], nxtSalat[3])

      loadSalatTimes.interval = myInterval;
    


      document.getElementById("fajr-st").innerHTML = convert24hourTo12HourFormat(data['fajr_start']);
      document.getElementById("fajr-iq").innerHTML = convert24hourTo12HourFormat(data['fajr_iqama']);
      document.getElementById("zuhr-st").innerHTML = convert24hourTo12HourFormat(data['zuhr_start']);
      document.getElementById("zuhr-iq").innerHTML = convert24hourTo12HourFormat(data['zuhr_iqama']);
      document.getElementById("asr-st").innerHTML = convert24hourTo12HourFormat(data['asr_start']);
      document.getElementById("asr-iq").innerHTML = convert24hourTo12HourFormat(data['asr_iqama']);
      document.getElementById("magrib-st").innerHTML = convert24hourTo12HourFormat(data['magrib_start']);
      document.getElementById("isha-st").innerHTML = convert24hourTo12HourFormat(data['isha_start']);
      document.getElementById("isha-iq").innerHTML = convert24hourTo12HourFormat(data['isha_iqama']);

    })
};

function loadElement(element) {
  
  console.log(element)
  var elements = document.getElementsByClassName('active');
  for (var i = 0; i < elements.length; ++i) {
    var item = elements[i];  
    item.classList.remove("active");
}
  element.classList.add("active");
  

  var myId = $(element).data("id");
  var name = $(element).data('name');
  document.getElementById('masjidName').innerHTML= name;
  loadSalatTimes(myId)
  var myInterval = loadSalatTimes.interval;
  clearInterval(myInterval);
}


//Heelo

//window.onload = loadSalatTimes();
