//we will insert new alarms inside the alarm list
var alarmList = document.getElementById('alarm-list');

//removing the default behavior of submit button i.e. to send data and refresh page
var Form= document.getElementById('myForm');
Form.addEventListener('submit', func);
function func(e)
{
    e.preventDefault();
}

//this will be an array of arrays which will store [hour, min, sec, date, month, year] corresponding to each alarm
var alarmArray= [];
var count= -1; //counts the no. of alarms currently
var days_name= ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

//plays alarm music
function playSound() {
    console.log("playing...");
    var audio = new Audio('alarm.mp3');
    audio.loop = false;
    audio.play();
}

//fetching the current date
var currentdate = new Date(); 
var date= currentdate.getDate() + " / " + parseInt(parseInt(currentdate.getMonth())+1) + " / " + currentdate.getFullYear();
var day= currentdate.getDay();

//This function runs when page reloads or opens
function begin() {

    //showing current date and day on the page
    var dateElement= document.createElement('span');
    dateElement.innerHTML= `
    <span class="today-val">${date}</span>
    `;

    var dayElement= document.createElement('span');
    dayElement.innerHTML= `
    <span class="today-val">${days_name[day]}</span>
    `;

    var today_date= document.getElementById('today-date');
    var today_day= document.getElementById('today-day');

    console.log(dateElement, dayElement);
    today_date.appendChild(dateElement);
    today_day.appendChild(dayElement);

    //Making the default alarm date as today's date
    document.getElementById('alarm-date-date').setAttribute('value', currentdate.getDate());
    document.getElementById('alarm-date-month').setAttribute('value', parseInt(currentdate.getMonth())+1);
    document.getElementById('alarm-date-year').setAttribute('value', currentdate.getFullYear());
    document.getElementById('alarm-date-year').setAttribute('min', currentdate.getFullYear());
};
begin();

//Every second we need to check if any alarm time matched with current time or not
setInterval(() => {

    //fetching the current time
    var currentdate = new Date();
    var curr_hour= parseInt(currentdate.getHours());
    var curr_min= parseInt(currentdate.getMinutes());
    var curr_sec= parseInt(currentdate.getSeconds());
    var curr_date= parseInt(currentdate.getDate());
    var curr_month= parseInt(currentdate.getMonth())+1;
    var curr_year= parseInt(currentdate.getFullYear());

    var time=  currentdate.getHours() + " : "  + currentdate.getMinutes() + " : " + currentdate.getSeconds();

    var current_time= document.getElementById('current-time');
    if(current_time != null)
    {
        current_time.remove();
    }

    var timeElement= document.createElement('span');
    timeElement.innerHTML= `
    <span id="current-time" class="today-val">${time}</span>
    `;
    document.getElementById('today-time').append(timeElement);

    //this loop check if current time matches with any of the alarms
    for(var i in alarmArray)
    {
        if(alarmArray[i][0]==curr_hour && alarmArray[i][1]==curr_min && alarmArray[i][2]==curr_sec && alarmArray[i][3]==curr_date && alarmArray[i][4]==curr_month && alarmArray[i][5]==curr_year)
        {
            playSound();
            alarmArray.splice(i, 1);
            displayAllAlarms();
            break;
        }
    }
}, 1000);

//adding event listener to the set-alarm button
document.getElementById('set-alarm-button').addEventListener('click', function() {
    var currentdate = new Date();
    var curr_hour= parseInt(currentdate.getHours());
    var curr_min= parseInt(currentdate.getMinutes());
    var curr_sec= parseInt(currentdate.getSeconds());
    var curr_date= parseInt(currentdate.getDate());
    var curr_month= parseInt(currentdate.getMonth());
    var curr_year= parseInt(currentdate.getFullYear());

    var hour=  parseInt(document.getElementById('alarm-hour').value);
    var min= parseInt(document.getElementById('alarm-min').value);
    var sec= parseInt(document.getElementById('alarm-sec').value);
    var date=  parseInt(document.getElementById('alarm-date-date').value);
    var month=  parseInt(document.getElementById('alarm-date-month').value);
    var year=  parseInt(document.getElementById('alarm-date-year').value);

    //Checking if any of the input fields are empty
    if(isNaN(hour) || isNaN(min) || isNaN(sec) || isNaN(date) || isNaN(month) || isNaN(year))
    {
        alert("Please fill all fields !!");
        return;
    }
    //Checking if any of the input fields have incorrect value
    else if(hour<0 || hour>23 || min<0 || min>59 || sec<0 || sec>59 || date<0 || date>30 || month<0 || month>12 || year<2023)
    {
        alert("Please fill correct values !!");
        return;
    }

    //Checking if the user's entered time is already passed or not
    if(year==curr_year && month< curr_month+1)
    {
        alert('Past months are not accepted');
        return;
    }
    else if(year==curr_year && month== curr_month+1 && date< curr_date)
    {
        alert('Past days are not accepted');
        return;
    }
    else if(year==curr_year && month== curr_month+1 && date== curr_date && hour< curr_hour)
    {
        alert('Past hours are not accepted');
        return;
    }
    else if(year==curr_year && month== curr_month+1 && date== curr_date && hour== curr_hour && min< curr_min)
    {
        alert('Past minutes are not accepted');
        return;
    }
    else if(year==curr_year && month== curr_month+1 && date== curr_date && hour== curr_hour && min== curr_min && sec< curr_sec)
    {
        alert('Past seconds are not accepted');
        return;
    }

    //Checking for duplicate alarms
    var alarmDetail= [hour, min, sec, date, month, year];
    for(var arr of alarmArray)
    {
        if(arr[0]==alarmDetail[0] && arr[1]==alarmDetail[1] && arr[2]==alarmDetail[2] && arr[3]==alarmDetail[3] && arr[4]==alarmDetail[4] && arr[5]==alarmDetail[5])
        {
            alert("Alarm already exists !!");
            return;
        }
    }

    count++;
    //As this alarm is valid, so we will push this alarm in the alarmArray
    alarmArray.push(alarmDetail);
    displayAllAlarms();
});

//This function displays all alarms in the side block
function displayAllAlarms()
{
    var ul= document.getElementById('alarm-list');
    ul.innerHTML= "";

    for(var i in alarmArray)
    {
        var li= document.createElement('li');
        li.innerHTML= `
        <span class="white-text set-text-size-17">TIME: ${alarmArray[i][0] + ":" + alarmArray[i][1] + ":" + alarmArray[i][2] + " || DATE: " + alarmArray[i][3] + "/" + alarmArray[i][4] + "/" + alarmArray[i][5]} </span>
        <img src="images/bin.svg" class="delete" data-id="${i}"/>
        `;
        li.classList.add('set-background-blur');

        alarmList.append(li);
    }
}

//adding event listener to the page, so that we can check if we clicked on the delete alarm button
document.addEventListener('click', handleClickEvent);

//function to handle click event on bin-image
function handleClickEvent(e) {
    const target= e.target;

    if(target.className == 'delete') {
        const Id= target.dataset.id; //because we used data-id
        console.log("deleteId: "+Id);
        count--;
        deleteAlarm(Id);
        return;
    }
}

//Deleted that particular alarm from the alarmArray
function deleteAlarm(Id)
{
    alarmArray.splice(Id, 1);
    displayAllAlarms();
}