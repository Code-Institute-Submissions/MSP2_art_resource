// Setting up api portal
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/";
const apiMetObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";


/*
        Scripts to access Met API for their art department details
*/

function getMetDept(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",apiMet + "departments");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb(JSON.parse(this.responseText));
            console.log("********  JSON response text "+JSON.parse(this.responseText));
        } else {
            console.log("******** state "+ this.readyState +" ******* status " +this.status);
        };
    };
};

function writeDepts() {
    getMetDept(function(item) {
       var depts = [];
       depts=item.departments;
       depts.forEach(function(item) {
                document.getElementById("metArtDept").innerHTML += item.departmentId+") "+item.displayName+" <br>";
            });
    });
};

/*
    Scripts to access API objects using their search resource
*/

var searchCrit1 = "departmentID=11";
var searchCrit2 = "q=sunflower";

function writeCriteria() {
    document.getElementById("metCriteria").innerHTML = "<p> Search criteria: "+searchCrit1+" "+searchCrit2+" </p>";
};

function getMetSearch(cb1) {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET",apiMet + "search?"+searchCrit1+"&"+searchCrit2);
    xhr2.send();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb1(JSON.parse(this.responseText));
        };
    };
};

function getMetObject(obj_ID, cb2) {
 
    var xhr3 = new XMLHttpRequest();
    xhr3.open("GET",apiMetObject + obj_ID);
    xhr3.send();

    xhr3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb2(JSON.parse(this.responseText));
         };
    };
};

function writeObjects() {
    var objects = [];
    var objectId;
 
    writeCriteria();
    getMetSearch(function(item) {
       var total_Found;
       total_Found = item.total;
       document.getElementById("metArt").innerHTML += "<p> Total found: "+total_Found+" </p>";
       objects=item.objectIDs;
       
       for (objectId of objects) {
           writeObjectDetails(objectId);
       };

    });
};

/*
        Function to display individual art object details
*/
function writeObjectDetails(obj_ID) {
    var objTitle = "";
    var objPrimaryImage ="";
    var objArtistDisplayName ="";
    getMetObject(obj_ID,function(item){
        objTitle = item.title;
        objPrimaryImage = item.primaryImageSmall;
        objArtistDisplayName = item.artistDisplayName;
        document.getElementById("metArt").innerHTML += obj_ID + ": "+ objTitle +" <br>";
        document.getElementById("metArt").innerHTML += "<img src="+ objPrimaryImage +" alt="+objTitle+"\"> <br>";
        document.getElementById("metArt").innerHTML += "artist: " + objArtistDisplayName +" <br>  <hr>";
    });
};