/*  
        Setting up api portal
*/
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/";
const apiMetObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

/* 

    Declaring global variables used by more than one function

*/

var searchCrit1 = "departmentID=";
var searchCrit2 = "q=sunflower";
var qryStr ="";  // q
var qryHighlight;   // isHighlight
var qryDept;        // departmentId
var qryView;        // isOnView
var qryCult;        // artistOrCulture
var qryMedium;     // medium
var qryImages;       // hasImages
var qryLoc;          // geoLocation
// must have both values for dateBegin and dateEnd queries:
var qryBegin;        // dateBegin
var qryEnd;          // dateEnd
// Department array to hold id and name used by functions writeDepts,getDeptName,returnDeptName
var depts = [];
var deptName; //department Name
var totalObjects;   // to capture the total number of objects listed on the Met's public collectsions
var displayObjects = [];
let currentPg = 1;

/*
    Initialising popovers to help with selection criteria validation, UX
    Also calling function to collect API object total
    Also populating departments array
*/

$(document).ready(function(){
  $('[data-toggle="popover"]').popover();
    totalCollection();
    loadDepts();
});

/* Object DisplayObject and its constructor */
class DisplayObject {
    constructor(artCount,metObjectId,pageCount) {
        this.artCnt = artCount;
        this.objectId = metObjectId;
        this.pageCnt =pageCount;
    }
    /* methods */
    get workId() { return this.objectId;}
    get pageNo() { return this.pageCnt;}
}

/*
    Functions to get latest object total from API
*/

function getTotalObjects(cb) {
  var xhr = new XMLHttpRequest();
  var apiAll = apiMetObject.substring(0, apiMetObject.length - 1);
  xhr.open("GET", apiAll);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cb(JSON.parse(this.responseText));
      console.log(
        "********  JSON response text " + JSON.parse(this.responseText)
      );
    }
  };
}

function totalCollection() {
  getTotalObjects(function (item) {
    totalObjects = item.total;
    document.getElementById("metArtTotal").innerHTML = `There is a total of ${totalObjects} recorded objects in the Met's collection.`;
    return totalObjects;
  });
}

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
    document.getElementById("metArtDept").innerHTML = "";
    depts.forEach(function (item) {
      document.getElementById("metArtDept").innerHTML += item.departmentId + ") " + item.displayName + " <br>";
    });

};

function loadDepts() {
/*  
    Using temporary store for department names
    Will clear when browser closed
*/
    sessionStorage.clear();
    getMetDept(function (item) {
        depts = item.departments;
        depts.forEach(function(item){
            sessionStorage.setItem(item.departmentId,item.displayName);
        })
    });
}

function writeDeptName(data) {
    document.getElementById("metCriteria").innerHTML += " : "+ data.displayName + "</p>";
}

function getDeptName(deptId) {
    getMetDept(function(item) {
        depts.forEach(function(item) {
              if ( item.departmentId == deptId ){
                  writeDeptName(item);
              }
        });
    });
}

function returnDeptName(deptId) {
    /*
    depends upon populated  global array 'depts' to lookup name from id.
    */
    var deptName = "";
    depts.forEach(function (item) {
        if (item.departmentId == deptId) {
            deptName = item.displayName;
        }
    });
    alert("returnDeptName " + deptName);
    return deptName;
}

/*
    Scripts to access API objects using their search resource

    MET API search returns
        a listing of all Object IDs for objects 
        that contain the search query 
        within the object’s data.
        The returned query also contains total number of objects found.
*/

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
    var totalInt;
    var artCnt = 0; 
    var pageCnt = 1;

   /*
        Clear down previous search results...
   */
   document.getElementById("metArt").innerHTML = "";
   /*
        Now for current search results.....
   */
    
    writeCriteria();
    getMetSearch(function(item) {
       var total_Found;
       total_Found = item.total;
       document.getElementById("metArtFoundTotal").innerHTML += "<p> Total found: "+total_Found+" </p>";
       totalInt = parseInt(total_Found);
        /*
            If there are no objects found, no need to display get objects button
        */
       if (totalInt == 0) {
            document.getElementById("btnGetObjects").style.display = "block";
       }
       else {
            /* 
                If there are objects found for the search crieria given
                need to hide the selection button until after the objects have been displayed
                just to simplify UX
            */
            document.getElementById("btnGetCriteria").style.display = "none";
            document.getElementById("btnGetObjects").style.display = "block";
            objects=item.objectIDs;
       
            for (objectId of objects) {
                if (totalInt < 6) { 
                    writeObjectDetails(objectId);
                    generatePaginationButton(pageCnt);
                }
                /*  Decided on 5 artworks per page, to save on memory issues... */    
                else {
                    artCnt++;
                    if (artCnt < 6) {  
                        writeObjectDetails(objectId);
                        var thisArtWork = new DisplayObject(artCnt,objectId,pageCnt);
                        displayObjects.push(thisArtWork);
                    }
                    else {
                        if ( artCnt == 6) {pageCnt++};
                        if ( artCnt % 5 == 0 ) { pageCnt++ };
                        generatePaginationButton(pageCnt);
                        var thisArtWork = new DisplayObject(artCnt,objectId,pageCnt);
                        //document.getElementById("metDebug").innerHTML += `<br> ${thisArtWork.workId} , ${thisArtWork.pageNo}`; 
                        displayObjects.push(thisArtWork);
                    }    
                };
            }
        };
    });
}
/*
        Function to display individual art object details
*/
function writeObjectDetails(obj_ID) {
    var objTitle = "";
    var objPrimaryImage ="";
    var objArtistDisplayName ="";
    var objMedium = "";
    var objDept = "";
    var objBegin = "";
    var objEnd = "";
    var objArtistBegin = "";
    var objArtistEnd = "";
    var objName = "";
    var objCulture = "";
    var objPeriod = "";
    var objDynasty = "";
    var objReign = "";
    var objDimensions = "";
    var objCreditLine = "";
    getMetObject(obj_ID,function(item){
        objTitle = item.title;
        objPrimaryImage = item.primaryImageSmall;
        objArtistDisplayName = item.artistDisplayName;
        objMedium = item.medium;
        objDept = item.department;
        objBegin = item.objectBeginDate;
        objEnd = item.objectEndDate;
        objArtistBegin = item.artistBeginDate;
        objArtistEnd = item.artistEndDate;
        objName = item.objectName;
        objCulture = item.culture;
        objPeriod = item.period;
        objDynasty = item.dynasty;
        objReign = item.reign;
        objDimensions = item.dimensions;
        objCreditLine = item.creditLine;
        document.getElementById("metArt").innerHTML += obj_ID + ": "+ objTitle +" <br>";
        document.getElementById("metArt").innerHTML += objName +" <br>";
        document.getElementById("metArt").innerHTML += "<img class=\"img-fluid\" src="+ objPrimaryImage +" alt="+objTitle+"\"> <br>";
        document.getElementById("metArt").innerHTML += "artist: " + objArtistDisplayName +" <br>";
        if (objArtistBegin.length > 0 ) {
            document.getElementById("metArt").innerHTML += "artist birth: " + objArtistBegin +" death: "+objArtistEnd+ "<br>";
        }
        document.getElementById("metArt").innerHTML += "medium: " + objMedium +" <br>";
        document.getElementById("metArt").innerHTML += "department: " + objDept +" <br>";
        if (objCulture.length > 0) {
            document.getElementById("metArt").innerHTML += "culture: " + objCulture +" <br>";
        }
        if (objPeriod.length > 0){
            document.getElementById("metArt").innerHTML += "period: " + objPeriod +" <br>";
        }
        if (objDynasty.length > 0){
            document.getElementById("metArt").innerHTML += "dynasty: " + objDynasty +" <br>";
        }
        if (objReign.length > 0){
            document.getElementById("metArt").innerHTML += "reign: " + objReign +" <br>";
        }
        if (objDimensions.length > 0){
            document.getElementById("metArt").innerHTML += "artwork dimensions: " + objDimensions +" <br>";
        }        
        document.getElementById("metArt").innerHTML += "object begin date: " + objBegin + " object end date: "+ objEnd + " <br>";
        if (objCreditLine.length > 0){
            document.getElementById("metArt").innerHTML += "origin and year acquired: " + objCreditLine +" <br>";
        }         
        document.getElementById("metArt").innerHTML += "<hr>";
    });
};

function getSelection() {
    $(document).ready(function(){
        $("#searchBtn").on("click",function() {
            document.getElementById("metCriteria").innerHTML = "";
            writeSelection();
        });
    });  
};

function writeSelection() {
    qryStr = document.forms["metArtCriteria"]["queryString"].value;
    qryDept = document.forms["metArtCriteria"]["qryDept"].value;
    qryHighlight = document.forms["metArtCriteria"]["qryHighlight"].value;
    qryView = document.forms["metArtCriteria"]["qryView"].value;        // isOnView
    qryCult = document.forms["metArtCriteria"]["qryCult"].value;       // artistOrCulture
    qryMedium = document.forms["metArtCriteria"]["qryMedium"].value;     // medium
    qryImages = document.forms["metArtCriteria"]["qryImages"].value;       // hasImages
    qryLoc = document.forms["metArtCriteria"]["qryLoc"].value;          // geoLocation
    // must have both values for dateBegin and dateEnd queries:
    qryBegin = document.forms["metArtCriteria"]["qryBegin"].value;        // dateBegin
    qryEnd = document.forms["metArtCriteria"]["qryEnd"].value;    

    getDeptName(qryDept);  
    
/*
        So we have a set of selected criteria, but also unselected or blank criteria from the form
        Need to strip out the blank selection qualifiers
*/

    searchCrit1 = `departmentId=${qryDept}&q=${qryStr}`;
    var searchCrit2Orig = `isHighlight=${qryHighlight}&isOnView=${qryView}&artistOrCulture=${qryCult}&medium=${qryMedium}&hasImages=${qryImages}&geoLocation=${qryLoc}&dateBegin=${qryBegin}&dateEnd=${qryEnd}`;
    searchCritArray = searchCrit2Orig.split("&");
    searchCrit2 = stripBlankSelections(searchCritArray);
    document.getElementById("metCriteria").innerHTML += `<p> Search criteria: ${searchCrit1}${searchCrit2} </p>`;

/*
    Now display the button to allow user to get selected works....
*/
    document.getElementById("btnGetObjects").style.display = "block";

};

function stripBlankSelections(searchCritArray) {
  var searchString = ""; 
  for (let i in searchCritArray) {
    if (searchCritArray[i].length != searchCritArray[i].lastIndexOf("=") + 1) {
      searchString += "&" + searchCritArray[i];
    }
  }
  return searchString;
}

function generatePaginationButton(pageCnt) {

    document.getElementById("metPages").innerHTML = `<table><tr><td>`;
    document.getElementById("metPages").innerHTML += `<button id="btnNext" onClick="writePreviousPage(${pageCnt})" class="btn btn-secondary btn-sm">Previous 5 artworks of ${pageCnt} pages</button>`;
    document.getElementById("metPages").innerHTML += `</td></tr>`;

    document.getElementById("metPages").innerHTML += `<tr><td>`;
    document.getElementById("metPages").innerHTML += `<button id="btnNext" onClick="writeNextPage(${pageCnt})" class="btn btn-secondary btn-sm">Next 5 artworks of ${pageCnt} pages</button>`;
    document.getElementById("metPages").innerHTML += `</td></tr>`;
 
    document.getElementById("metPages").innerHTML += `<tr><td>`;
    document.getElementById("metPages").innerHTML += `<button id="btnNew" onClick="clickBtnNew()" class="btn btn-secondary btn-sm">New selection</button>`;
    document.getElementById("metPages").innerHTML += `</td></tr></table>`;

    document.getElementById("metPagesTop").innerHTML = `<table><tr><td>`;
    document.getElementById("metPagesTop").innerHTML += `<button id="btnNext" onClick="writePreviousPage(${pageCnt})" class="btn btn-secondary btn-sm">Previous 5 artworks of ${pageCnt} pages</button>`;
    document.getElementById("metPagesTop").innerHTML += `</td></tr>`;

    document.getElementById("metPagesTop").innerHTML += `<tr><td>`;
    document.getElementById("metPagesTop").innerHTML += `<button id="btnNext" onClick="writeNextPage(${pageCnt})" class="btn btn-secondary btn-sm">Next 5 artworks of ${pageCnt} pages</button>`;
    document.getElementById("metPagesTop").innerHTML += `</td></tr>`;
 
    document.getElementById("metPagesTop").innerHTML += `<tr><td>`;
    document.getElementById("metPagesTop").innerHTML += `<button id="btnNew" onClick="clickBtnNew()" class="btn btn-secondary btn-sm">New selection</button>`;
    document.getElementById("metPagesTop").innerHTML += `</td></tr></table>`;

}

function writeNextPage(pageCnt) {
    /*  Clear down any previous page results...  */
    document.getElementById("metArt").innerHTML = "";
    if ( currentPg < pageCnt) {
        currentPg++;
    }
    /* writing current Page number to screen */
    document.getElementById("metPageCount").innerHTML = `Page: ${currentPg}`;

    var myWrk = {};
    var myArr = Object.values(displayObjects);

    /* unpacking the found art works */
    for (let i in myArr) {
        myWrk = myArr[i];
        if ( myWrk.pageNo == currentPg ) {
            //document.getElementById("metDebug").innerHTML += `<br> ${myWrk.workId}`;
            writeObjectDetails(myWrk.workId);
        }
    }
}

function writePreviousPage(pageCnt) {
    /*  Clear down any previous page results...  */
    document.getElementById("metArt").innerHTML = "";
    if ( currentPg > 1 ) {
        currentPg--;
    }

    /* writing current Page number to screen */
    document.getElementById("metPageCount").innerHTML = `Page: ${currentPg}`;

    var myWrk = {};
    var myArr = Object.values(displayObjects);
    
    /* unpacking the found art works */
    for (let i in myArr) {
        myWrk = myArr[i];
        if ( myWrk.pageNo == currentPg ) {
            writeObjectDetails(myWrk.workId);
        }
    }
}

function clickBtnNew () {
    /*    Clear down previous search results...  */
    document.getElementById("metArt").innerHTML = "";
    document.getElementById("metCriteria").innerHTML = "";
    document.getElementById("metArtFoundTotal").innerHTML = "";
    document.getElementById("btnGetObjects").style.display = "none";
    document.getElementById("metPagesTop").innerHTML = "";
    document.getElementById("metPageCount").innerHTML = "";
    document.getElementById("metPages").innerHTML = "";
    /* allow user to make another selection */
    document.getElementById("btnGetCriteria").style.display = "block";
    /* initialise variables holding old selections */
    currentPg = 1;
    displayObjects = [];
}