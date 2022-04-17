//Content script to insert "Export" button into Schedule Builder page
//Scrapes data from Schedule builder and forms a request in compliance with the Google Calendar API, and sends this data to export.js


//Create a button inline with the original Schedule Builder buttons 

var isMap = false, exported = false; //Track if the popup window is open, and if exporting has been completed 

var button = document.createElement("button");
button.className = "btn btn-mini white-on-navyblue";  
button.addEventListener("click", parseAndChangeToMap);
var text = document.createTextNode("Map");
button.appendChild(text);

document.getElementsByClassName("menu")[0].appendChild(button);
var button = document.createElement("button");
button.className = "btn btn-mini white-on-navyblue";  
button.addEventListener("click", parseAndChangeToMap);
var text = document.createTextNode("Map");
button.appendChild(text);
document.getElementsByClassName("menu")[1].appendChild(button);

//Insert the button

var ViewType = $(document.getElementById("SavedSchedules")).data("ViewType");




var SavedSchedulesListDisplayContainer = document.getElementById("SavedSchedulesListDisplayContainer");
var SavedSchedulesCalendarDisplayContainer = document.getElementById("SavedSchedulesCalendarDisplayContainer");
var SavedSchedulesMapDisplayContainer = document.createElement("div");
SavedSchedulesMapDisplayContainer.id=("SavedSchedulesMapDisplayContainer");

SavedSchedulesCalendarDisplayContainer.insertAdjacentElement('afterend',SavedSchedulesMapDisplayContainer)


if(!$(SavedSchedulesMapDisplayContainer).hasClass("hide")){
	$(SavedSchedulesMapDisplayContainer).addClass("hide");
}
var TheMap=document.createElement("div");
var map=document.createElement("img");
map.src=chrome.runtime.getURL("campus_map_4-26-19.png");
//var map=document.createElement("div");
//map.innerHTML="<iframe width=420 height=330 name=aa frameborder=0 src=https://campusmap.ucdavis.edu/></iframe>";
TheMap.appendChild(map);



SavedSchedulesMapDisplayContainer.appendChild(TheMap);




function initMap() {
    var mapProp = {
		center:new google.maps.LatLng(51.508742,-0.120850),
		zoom:5,
		mapTypeId:google.maps.MapTypeId.ROADMAP
		};
	  var map=new google.maps.Map(map,mapProp);
}

//Parses text from Schedule Builder and exports to Google Calendar
function parseAndChangeToMap() {
	

	  		//Add the popup to the page
		
		var TBA = false; //Some course times may be listed as TBA
		var OLA = false; //Some courses have no times and are listed as Online Learning Activities
		var dataArray = [[],[],[],[],[],[],[]]; //stores parsed data from Schedule Builder
		var courseContainer = document.getElementById("SavedSchedulesListDisplayContainer");
		var courses = courseContainer.getElementsByClassName("CourseItem"); //Element containing all courses in the schedule
		var events, data, text;
		var count = 0;
		for(var i = 0; i < courses.length; i++) { //For each course listing
			events = courses[i].getElementsByClassName("data meeting-times")[0].childNodes; 
			courseName = courses[i].getElementsByClassName("classTitle")[0].textContent;
			for(var j = 0; j < events.length; j++) { //For each "event" in the course (Lecture, Lab, Discussion...)
				TBA = false;
				OLA = false;
				data = events[j].childNodes; //Contains text to parse out name, time, days, location of the event
				var eventData = {courseName: "", eventName: "", time: "", days: "",location: ""};
				eventData.courseName = courseName;
				count = 0;
				for(var k = 0; k < data.length; k++) {
					text = data[k].textContent;
					if(text.includes("TBA")){
						TBA = true;
					}
					if(text.includes("Online Learning Activity")){
						OLA = true;
					}
					if(/\S/.test(text)) { //Checks that text is not all whitespace
						//Store parsed data
						if(count == 0) {
							eventData.eventName = text;
							
						}else if(count == 1) {
							eventData.time = text; 

						}else if(count == 2) {
							eventData.days = text;

						}else if(count == 3) {
							eventData.location = text;

						}else {
							break;
						}

						count++;
					}
				}
				
				if(eventData.days.includes("TBA")){
					dataArray[0].push(eventData);
				}else{
					if(eventData.days.includes("M"))dataArray[1].push(eventData);
					if(eventData.days.includes("T"))dataArray[2].push(eventData);
					if(eventData.days.includes("W"))dataArray[3].push(eventData);
					if(eventData.days.includes("R"))dataArray[4].push(eventData);
					if(eventData.days.includes("F"))dataArray[5].push(eventData);
				}
				
			}
		
			
		}
		//initMap();
		adjustContainerDisplay("SavedSchedules","Map");
			
		
	
}

function adjustContainerDisplay(newActiveContainer,newActiveContainerViewType,newScheduleNameEncoded,ThisButtonID,subType,runPreRegCheck){
	try{
		var MaxWidth = window.outerWidth;
		var SaveForLaterCourses = document.getElementById("SaveForLaterCourses");
		var SavedSchedules = document.getElementById("SavedSchedules");
		var PreBuildScheduleOptions = document.getElementById("PreBuildScheduleOptions");
		var PreBuildSchedules = document.getElementById("PreBuildSchedules");
		var SavedScheduleMenuTrigger1Text = document.getElementById("SavedScheduleMenuTrigger1Text");
		var SavedScheduleMenuTrigger2Text = document.getElementById("SavedScheduleMenuTrigger2Text");
		var ScheduleMenu2ChangeCoursesSectionsItem = document.getElementById("ScheduleMenu2ChangeCoursesSectionsItem");
		var SaveForLaterCoursesMenuViewScheduleItem = document.getElementById("SaveForLaterCoursesMenuViewScheduleItem");
		var SaveForLaterCoursesMenuViewScheduleItem2 = document.getElementById("SaveForLaterCoursesMenuViewScheduleItem2");
		
		var newScheduleName = null;
		if(newScheduleNameEncoded!=null && newScheduleNameEncoded!=""){
			newScheduleName = decodeURIComponent(newScheduleNameEncoded);
		}
		
		var ThisButton = null;
		
		if(newActiveContainer != null && newActiveContainer!=""){
			ActiveContainer = newActiveContainer;
		}
		
		var ActualSubType = "";
		if(subType != null && subType!=""){
			ActualSubType = subType;
		}
		
		
		if(SaveForLaterCourses!=null && SavedSchedules!=null && PreBuildScheduleOptions!=null && PreBuildSchedules!=null){
			if(MaxWidth <= 992){
				if(ActiveContainer == "SavedSchedules"){
					if($(SavedSchedules).hasClass("hide")){
						$(SavedSchedules).removeClass("hide");
					}
					if(!$(PreBuildScheduleOptions).hasClass("hide")){
						$(PreBuildScheduleOptions).addClass("hide");
					}
					if(!$(PreBuildSchedules).hasClass("hide")){
						$(PreBuildSchedules).addClass("hide");
					}
				}
				if(ActiveContainer == "SaveForLaterCourses"){
					if($(SaveForLaterCourses).hasClass("hide")){
						$(SaveForLaterCourses).removeClass("hide");
					}
					if(!$(SavedSchedules).hasClass("hide")){
						$(SavedSchedules).addClass("hide");
					}
					if(!$(PreBuildScheduleOptions).hasClass("hide")){
						$(PreBuildScheduleOptions).addClass("hide");
					}
					if(!$(PreBuildSchedules).hasClass("hide")){
						$(PreBuildSchedules).addClass("hide");
					}
				}
				if(ActiveContainer == "PreBuildScheduleOptions"){
					if(!$(SaveForLaterCourses).hasClass("hide")){
						$(SaveForLaterCourses).addClass("hide");
					}
					if(!$(SavedSchedules).hasClass("hide")){
						$(SavedSchedules).addClass("hide");
					}
					if($(PreBuildScheduleOptions).hasClass("hide")){
						$(PreBuildScheduleOptions).removeClass("hide");
					}
					if(!$(PreBuildSchedules).hasClass("hide")){
						$(PreBuildSchedules).addClass("hide");
					}
				}
				if(ActiveContainer == "PreBuildSchedules"){
					if(!$(SaveForLaterCourses).hasClass("hide")){
						$(SaveForLaterCourses).addClass("hide");
					}
					if(!$(SavedSchedules).hasClass("hide")){
						$(SavedSchedules).addClass("hide");
					}
					if(!$(PreBuildScheduleOptions).hasClass("hide")){
						$(PreBuildScheduleOptions).addClass("hide");
					}
					if($(PreBuildSchedules).hasClass("hide")){
						$(PreBuildSchedules).removeClass("hide");
					}
				}
				
				/**/
				if(ScheduleMenu2ChangeCoursesSectionsItem!=null){
					if($(ScheduleMenu2ChangeCoursesSectionsItem).hasClass("hide")){
						$(ScheduleMenu2ChangeCoursesSectionsItem).removeClass("hide");
					}
				}
				if(SaveForLaterCoursesMenuViewScheduleItem2!=null){
					if($(SaveForLaterCoursesMenuViewScheduleItem2).hasClass("hide")){
						$(SaveForLaterCoursesMenuViewScheduleItem2).removeClass("hide");
					}
				}
				if(SaveForLaterCoursesMenuViewScheduleItem!=null){
					if($(SaveForLaterCoursesMenuViewScheduleItem).hasClass("hide")){
						$(SaveForLaterCoursesMenuViewScheduleItem).removeClass("hide");
					}
				}
				
			}else{
				if(ActiveContainer == "SavedSchedules" || ActiveContainer == "SaveForLaterCourses"){
					if($(SaveForLaterCourses).hasClass("hide")){
						$(SaveForLaterCourses).removeClass("hide");
					}
					if($(SavedSchedules).hasClass("hide")){
						$(SavedSchedules).removeClass("hide");
					}
					if(!$(PreBuildScheduleOptions).hasClass("hide")){
						$(PreBuildScheduleOptions).addClass("hide");
					}
					if(!$(PreBuildSchedules).hasClass("hide")){
						$(PreBuildSchedules).addClass("hide");
					}
				}
				if(ActiveContainer == "PreBuildScheduleOptions" || ActiveContainer == "PreBuildSchedules"){
					if(!$(SaveForLaterCourses).hasClass("hide")){
						$(SaveForLaterCourses).addClass("hide");
					}
					if(!$(SavedSchedules).hasClass("hide")){
						$(SavedSchedules).addClass("hide");
					}
					if($(PreBuildScheduleOptions).hasClass("hide")){
						$(PreBuildScheduleOptions).removeClass("hide");
					}
					if($(PreBuildSchedules).hasClass("hide")){
						$(PreBuildSchedules).removeClass("hide");
					}
				}
				
				/**/
				if(ScheduleMenu2ChangeCoursesSectionsItem!=null){
					if(!$(ScheduleMenu2ChangeCoursesSectionsItem).hasClass("hide")){
						$(ScheduleMenu2ChangeCoursesSectionsItem).addClass("hide");
					}
				}
				if(SaveForLaterCoursesMenuViewScheduleItem!=null){
					if(!$(SaveForLaterCoursesMenuViewScheduleItem).hasClass("hide")){
						$(SaveForLaterCoursesMenuViewScheduleItem).addClass("hide");
					}
				}
				if(SaveForLaterCoursesMenuViewScheduleItem2!=null){
					if(!$(SaveForLaterCoursesMenuViewScheduleItem2).hasClass("hide")){
						$(SaveForLaterCoursesMenuViewScheduleItem2).addClass("hide");
					}
				}
				
			}
		}
		
		
		/**/
		if(ActiveContainer == "SavedSchedules"){
			var SavedSchedulesListDisplayContainer = document.getElementById("SavedSchedulesListDisplayContainer");
			var SavedSchedulesCalendarDisplayContainer = document.getElementById("SavedSchedulesCalendarDisplayContainer");
			var SavedSchedulesMapDisplayContainer = document.getElementById("SavedSchedulesMapDisplayContainer");
			var ViewTypeMenuTriggerText = document.getElementById("ViewTypeMenuTriggerText");
			
			if(newActiveContainerViewType!=null && newActiveContainerViewType!=""){
				$(SavedSchedules).data("ViewType",newActiveContainerViewType);
			}
			
			if(typeof $(SavedSchedules).data("ViewType") !== "undefined"){
				if(SavedSchedulesListDisplayContainer!=null && SavedSchedulesCalendarDisplayContainer!=null){
					if($(SavedSchedules).data("ViewType") == "List"){
						if($(SavedSchedulesListDisplayContainer).hasClass("hide")){
							$(SavedSchedulesListDisplayContainer).removeClass("hide");
						}
						if(!$(SavedSchedulesCalendarDisplayContainer).hasClass("hide")){
							$(SavedSchedulesCalendarDisplayContainer).addClass("hide");
						}
						
						if(!$(SavedSchedulesMapDisplayContainer).hasClass("hide")){
							$(SavedSchedulesMapDisplayContainer).addClass("hide");
						}
						
						/**/
						/*if(ViewTypeMenuTriggerText!=null){
							ViewTypeMenuTriggerText.innerHTML = "List View";
						}*/
					}else if($(SavedSchedules).data("ViewType") == "Map"){
						if(!$(SavedSchedulesListDisplayContainer).hasClass("hide")){
							$(SavedSchedulesListDisplayContainer).addClass("hide");
						}
						if(!$(SavedSchedulesCalendarDisplayContainer).hasClass("hide")){
							$(SavedSchedulesCalendarDisplayContainer).addClass("hide");
						}
						
						if($(SavedSchedulesMapDisplayContainer).hasClass("hide")){
							$(SavedSchedulesMapDisplayContainer).removeClass("hide");
						}
						
						/**/
						/*if(ViewTypeMenuTriggerText!=null){
							ViewTypeMenuTriggerText.innerHTML = "List View";
						}*/
					}else{
						if(!$(SavedSchedulesListDisplayContainer).hasClass("hide")){
							$(SavedSchedulesListDisplayContainer).addClass("hide");
						}
						if($(SavedSchedulesCalendarDisplayContainer).hasClass("hide")){
							$(SavedSchedulesCalendarDisplayContainer).removeClass("hide");
						}
						
						if(!$(SavedSchedulesMapDisplayContainer).hasClass("hide")){
							$(SavedSchedulesMapDisplayContainer).addClass("hide");
						}
						
						/**/
						/*if(ViewTypeMenuTriggerText!=null){
							ViewTypeMenuTriggerText.innerHTML = "Calendar View";
						}*/
					}
				}
			}
		}
		
		var ViewType = $(SavedSchedules).data("ViewType");
		
		/*$(".print-button").each(function(){
			if(ViewType=="Calendar"){
				if(!$(this).hasClass("hide")){
					$(this).addClass("hide");
				}
			}else{
				if($(this).hasClass("hide")){
					$(this).removeClass("hide");
				}
			}
		});*/
		
		/**/
		if(newScheduleName!=null && newScheduleName!="" && newScheduleName!=ThisScheduleName){
			if(ThisButtonID!=null && ThisButtonID!=""){
				ThisButton = document.getElementById(ThisButtonID);
				if(ThisButton!=null){
					UCD.SAOT.SpinJS.swapInSpinner(ThisButton,"#000000");
				}
			}
			
			ThisScheduleIndex = createSchedule(newScheduleName);
			ThisScheduleName = newScheduleName;
			
			/**///ActualSubType 
			if(ActualSubType=="Print" && ActiveContainer=="SavedSchedules"){
				if(ViewType=="List"){
					buildDisplay("PrintableSavedScheduleList",document.getElementById("SavedSchedulesListDisplayContainer"));
				}else if(ViewType=="Calendar"){
					/*buildDisplay("FinalScheduleDisplay",document.getElementById("SavedSchedulesListDisplayContainer"));*/
					buildScheduleDisplays();
				}else{
					buildScheduleDisplays();
				}
			}else{
				buildScheduleDisplays();
				
				if(runPreRegCheck!=null && runPreRegCheck==1){
					preCheckAllRegistration(null,0);
				}
			}
			
			/**/
			/*buildScheduleListings();*/
			if(SavedScheduleMenuTrigger1Text!=null){
				SavedScheduleMenuTrigger1Text.innerHTML = ThisScheduleName;
			}
			if(SavedScheduleMenuTrigger2Text!=null){
				SavedScheduleMenuTrigger2Text.innerHTML = ThisScheduleName;
			}
		}else if(ViewType=="Calendar"){
			//calendar.cdar("setView","week");
			calendar.cdar("setView");
		}
	}catch(e){
		//UCD.SAOT.Exceptions.errorHandlerTryCatchHelper(e,arguments.callee.toString(),new Error(""),"4031",null,"","",UCD.SAOT.AJAX_TIMEOUT,ShowDebug);
	}
}

