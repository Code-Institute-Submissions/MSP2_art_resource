/*  
        Setting up api portal
*/
const apiMet = "https://collectionapi.metmuseum.org/public/collection/v1/";
const apiMetObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

/* 

    Declaring global variables used by more than one function

*/

var searchCrit1 = "";
var searchCrit2 = "";
var qryStr ="";  // q
var qryHighlight;   // isHighlight
var qryDept;        // departmentId
var qryDeptName;    //Selection form now asks for name, not id.
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
    document.getElementById("metArtTotal").innerHTML = `There are ${totalObjects} recorded objects in the Met's collection.`;
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
        }
    };
}

function writeDepts() {
    document.getElementById("metArtDept").innerHTML = "";
    depts.forEach(function (item) {
      document.getElementById("metArtDept").innerHTML += item.departmentId + ") " + item.displayName + " <br>";
    });

}

function loadDepts() {
/*  
    Using temporary store for department names
    Will clear when browser closed
*/
    sessionStorage.clear();
    getMetDept(function (item) {
        depts = item.departments;
        depts.forEach(function(item){
            /* need a lookup from department name back to id */
            sessionStorage.setItem(item.displayName,item.departmentId);
        });
    });
}

function writeDeptName(data) {
    document.getElementById("metCriteria").innerHTML += " "+ data.displayName + "</p>";
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

function returnDeptId(deptName) {
    /*
    depends upon the sessionStorage of key displayName against value of departmentId
    */
   return sessionStorage.getItem(deptName);
}

function loadSelDepts() {
    var selHTML = "";
    var selOptions = "";
    
    depts.forEach(function (dItem) {
        /* need a lookup from department name back to id. */
        selOptions += `     <option>${dItem.displayName}</option>`;
    });
    
    selHTML = `      <label for="deptNameSel"`;
    selHTML += ` data-toggle="popover" data-trigger="hover" data-placement="top" `; 
    selHTML += ` title="Department Name"`;
    selHTML += ` data-content="Select Met Museum Art Departments valid list">`;
    selHTML += ` Select one Department: </label>`;
    selHTML += `     <select class="form-control" id="deptNameSel"  required > `;
    selHTML += selOptions;
    selHTML += `     </select>`;

    document.getElementById("selDept").innerHTML += selHTML;
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
}

function getMetSearch(cb1) {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET",apiMet + "search?"+searchCrit1+"&"+searchCrit2);
    xhr2.send();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb1(JSON.parse(this.responseText));
        }
    };
}

function getMetObject(obj_ID, cb2) {
 
    var xhr3 = new XMLHttpRequest();
    xhr3.open("GET",apiMetObject + obj_ID);
    xhr3.send();

    xhr3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {  
            cb2(JSON.parse(this.responseText));
         }
    };
}

function writeObjects() {
    var objects = [];
    var objectId;
    var totalInt;
    var artCnt = 0; 
    var pageCnt = 1;
    var thisArtWork = {};

   /*
        Clear down previous search results...
   */
    document.getElementById("metArt").innerHTML = "";
    document.getElementById("selDept").innerHTML = "";
   /*
        Now for current search results.....
   */
    
    writeCriteria();
    getMetSearch(function(item) {
       var total_Found;
       total_Found = item.total;
       document.getElementById("metArtFoundTotal").innerHTML = "<p>Total found: "+total_Found+" </p>";
       totalInt = parseInt(total_Found);
        /*
            If there are no objects found, no need to display get objects button
        */
       if (totalInt == 0) {
           document.getElementById("metArtFoundTotal").innerHTML += "<p>Please make another selection.</p>";
       }
       else {
            /* 
                If there are objects found for the search crieria given
                need to hide the selection button until after the objects have been displayed
                just to simplify UX
            */
            //document.getElementById("btnGetCriteria").style.display = "none";
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
                        thisArtWork = new DisplayObject(artCnt,objectId,pageCnt);
                        displayObjects.push(thisArtWork);
                    }
                    else {
                        if ( artCnt % 5 == 1 ) { pageCnt++ ; }
                        generatePaginationButton(pageCnt);
                        thisArtWork = new DisplayObject(artCnt,objectId,pageCnt);
                        //document.getElementById("metDebug").innerHTML += `<br> ${thisArtWork.workId} , ${thisArtWork.pageNo}`; 
                        displayObjects.push(thisArtWork);
                    }    
                }
            }
        }
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

    var objAdditionalImages = [];
    var objConstituents = [];
    var objWiki = "";
    var objArtistDisplayBio = "";
    var objPortfolio = "";
    var objArtistRole = "";
    var objArtistPrefix = "";
    var objArtistSuffix = "";
    var objArtistNationality = "";
    var objArtistGender = "";
    var objDate = "";
    var objCity = "";
    var objState = "";
    var objCounty = "";
    var objCountry = "";
    var objRegion = "";
    var objSubRegion = "";
    var objLocale = "";
    var objLocus = "";
    var objExcavation = "";
    var objRiver = "";
    var objClassification = "";

    var objLinkResource = "";
    var objObjectURL = "";
    var objGalleryNumber = "";
    var objMetadataDate = "";  // Date metadata was last updated

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
        //objAdditionalImages = item.additionalImages; // array
        for ( let i in item.additionalImages ) {
            objAdditionalImages.push(item.additionalImages[i]);
        }
        //objConstituents = parse(item.constituents);  //array
        /*
        for ( let i in item.constituents ) {
            objConstituents.push(item.constituents[i]);
        }    
        */
        objWiki = item.objectWikidata_URL;
        objArtistDisplayBio = item.artistDisplayBio;
        objPortfolio = item.portfolio;
        objArtistRole = item.artistRole;
        objArtistPrefix = item.artistPrefix;   
        objArtistSuffix = item.artistSuffix;
        objArtistNationality = item.artistNationality;
        objArtistGender = item.artistGender;
        objDate = item.objectDate;
        objCity = item.city;
        objState = item.state;
        objCounty = item.county;
        objCountry = item.country;
        objRegion = item.region;
        objSubRegion = item.subregion;
        objLocale = item.locale;
        objLocus = item.locus;
        objExcavation = item.excavation;
        objRiver = item.river;
        objClassification = item.classification;        

        objLinkResource = item.linkResource;
        objObjectURL = item.objectURL;
        objGalleryNumber = item.GalleryNumber;
        objMetadataDate = item.metadataDate;
        /* linkresource and objecturl could point to the same place */
        if ( objLinkResource.length > 0 && objLinkResource == objObjectURL ) { objObjectURL = ""; }

        document.getElementById("metArt").innerHTML += obj_ID + ": "+ objTitle +" <br>";
        document.getElementById("metArt").innerHTML += objName +" <br>";
        document.getElementById("metArt").innerHTML += "<img class=\"img-fluid\" src="+ objPrimaryImage +" alt="+objTitle+"\"> <br>";
        if (objArtistDisplayName.length > 0) {
            document.getElementById("metArt").innerHTML += "Artist: " + objArtistDisplayName +" <br>";
        }
        if (objArtistBegin.length > 0 ) {
            document.getElementById("metArt").innerHTML += "Artist's birth: " + objArtistBegin +" and death: "+objArtistEnd+ "<br>";
        }
        if (objMedium.length > 0) {
            document.getElementById("metArt").innerHTML += "Medium: " + objMedium +" <br>";
        }
        document.getElementById("metArt").innerHTML += "Department: " + objDept +" <br>";
        if (objCulture.length > 0) {
            document.getElementById("metArt").innerHTML += "Culture: " + objCulture +" <br>";
        }
        if (objPeriod.length > 0){
            document.getElementById("metArt").innerHTML += "Period: " + objPeriod +" <br>";
        }
        if (objDynasty.length > 0){
            document.getElementById("metArt").innerHTML += "Dynasty: " + objDynasty +" <br>";
        }
        if (objReign.length > 0){
            document.getElementById("metArt").innerHTML += "Reign: " + objReign +" <br>";
        }
        if (objDimensions.length > 0){
            document.getElementById("metArt").innerHTML += "Artwork dimensions: " + objDimensions +" <br>";
        }        
        document.getElementById("metArt").innerHTML += "Artwork began: " + objBegin + " artwork finished: "+ objEnd + " <br>";
        if (objCreditLine.length > 0){
            document.getElementById("metArt").innerHTML += "Origin and year acquired: " + objCreditLine +" <br>";
        }



        /*  blanking out additional images for the moment...another window? 
        if (objAdditionalImages.length > 0) {
            for ( let i in objAdditionalImages ) {
                document.getElementById("metArt").innerHTML += `Additional images: <img class="img-fluid" src="${objAdditionalImages[i]}" width="50" height="auto" alt="additional image"> <br>`;
            };
        };
        */
        if (objConstituents.length > 0 ) {
            for ( let i in objConstituents ) {
            document.getElementById("metArt").innerHTML += `Constituents: ${objConstituents[i]} <br>`;
            }
        }

        if (objWiki.length > 0 ) {
            document.getElementById("metArt").innerHTML += `WIKIData: <a href="${objWiki}" target="_blank" title="WIKIData link">WIKI link</a>  <br>`;
        } 

        if (objArtistDisplayBio.length > 0 ){
             document.getElementById("metArt").innerHTML += `Artist Biography: ${objArtistDisplayBio} `;
        }

        if (objPortfolio.length > 0 ) {
            document.getElementById("metArt").innerHTML += `Portfolio: ${objPortfolio} <br>`;
        }

        if (objArtistRole.length > 0 ) {
            document.getElementById("metArt").innerHTML += `Artists role: ${objArtistRole} <br>`;
        }
        if (objArtistPrefix.length > 0 ) {
            document.getElementById("metArt").innerHTML += `Prefix: ${objArtistPrefix} <br>`;
        }

        if ( objArtistSuffix.length > 0 ){ document.getElementById("metArt").innerHTML += `Suffix: ${objArtistSuffix} <br>`;}
        if (objArtistNationality.length > 0 ) { document.getElementById("metArt").innerHTML += `Nationality: ${objArtistNationality} <br>`;}
        if ( objArtistGender.length > 0 ) { document.getElementById("metArt").innerHTML += `Gender: ${objArtistGender} <br>`;}
        if (objDate.length > 0 ) { document.getElementById("metArt").innerHTML += `Artwork date: ${objDate} <br>`;}
        if ( objCity.length > 0 ) { document.getElementById("metArt").innerHTML += `City: ${objCity} <br>`;}
        if ( objState.length > 0 ) { document.getElementById("metArt").innerHTML += `State: ${objState} <br>`;}
        if (objCounty.length > 0 ) { document.getElementById("metArt").innerHTML += `County: ${objCounty} <br>`;}
        if ( objCountry.length > 0 ) { document.getElementById("metArt").innerHTML += `Country: ${objCountry} <br>`;}
        if ( objRegion.length > 0 ) { document.getElementById("metArt").innerHTML += `Region: ${objRegion} <br>`;}
        if (objSubRegion.length > 0 ) { document.getElementById("metArt").innerHTML += `Subregion: ${objSubRegion} <br>`;}
        if (objLocale.length > 0 ) { document.getElementById("metArt").innerHTML += `Locale: ${objLocale} <br>`;}
        if (objLocus.length > 0 ) { document.getElementById("metArt").innerHTML += `Locus: ${objLocus} <br>`;}
        if ( objExcavation.length > 0 ) { document.getElementById("metArt").innerHTML += `Excavation: ${objExcavation} <br>`;}
        if ( objRiver.length > 0 ) { document.getElementById("metArtt").innerHTML += `River: ${objRiver} <br>`;}
        if ( objClassification.length > 0 ) { document.getElementById("metArt").innerHTML += `Classification: ${objClassification} <br>`;}

         if (objLinkResource.length > 0){ 
             document.getElementById("metArt").innerHTML +=`"Museum web page: <a href="${objLinkResource}" target="_blank" title="Website page">Website page</a><br>`;
        }
         if (objObjectURL.length > 0){  
            document.getElementById("metArt").innerHTML +=`Museum web page: <a href="${objObjectURL}" target="_blank" title="Website page">Website page</a><br>`;
        }
         if (objGalleryNumber.length > 0){ 
             document.getElementById("metArt").innerHTML +="Gallery Number "+objGalleryNumber+" <br>";
        }
         if (objMetadataDate.length > 0){
             document.getElementById("metArt").innerHTML +="Date data set "+objMetadataDate+" <br>";
        }        
        document.getElementById("metArt").innerHTML += "<hr>";
    });
}

function getSelection() {
    $(document).ready(function(){
        $("#searchBtn").on("click",function() {
            document.getElementById("metCriteria").innerHTML = "";
            document.getElementById("metArtFoundTotal").innerHTML = "";
            writeSelection();
        });
    });  
}

function writeSelection() {
    //qryStr = document.forms["metArtCriteria"]["queryString"].value;
    qryStr = document.getElementById("metArtCriteria").elements.namedItem("queryString").value;
    /*    
        Prototype search form asked for department id.
        Updated search form, now asking, via drop-down selections, for department names
        For API search endpoint, need to convert 'human' name back to Id
    */   
    //qryDeptName = document.forms["metArtCriteria"]["deptNameSel"].value;
    qryDeptName = document.getElementById("metArtCriteria").elements.namedItem("deptNameSel").value;
    qryDept = returnDeptId(qryDeptName);
    qryHighlight = document.getElementById("metArtCriteria").elements.namedItem("qryHighlight").value;
    qryView = document.getElementById("metArtCriteria").elements.namedItem("qryView").value;        // isOnView
    qryCult = document.getElementById("metArtCriteria").elements.namedItem("qryCult").value;       // artistOrCulture
    qryMedium = document.getElementById("metArtCriteria").elements.namedItem("qryMedium").value;     // medium
    qryImages = document.getElementById("metArtCriteria").elements.namedItem("qryImages").value;       // hasImages
    qryLoc = document.getElementById("metArtCriteria").elements.namedItem("qryLoc").value;          // geoLocation
    // must have both values for dateBegin and dateEnd queries:
    qryBegin = document.getElementById("metArtCriteria").elements.namedItem("qryBegin").value;        // dateBegin
    qryEnd = document.getElementById("metArtCriteria").elements.namedItem("qryEnd").value;    

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
    Selection criteria captured, now display objects found.
*/    
    writeObjects();

}

function stripBlankSelections(searchCritArray) {
  var searchString = ""; 
  for (let i in searchCritArray) {
    if (searchCritArray[i].length != searchCritArray[i].lastIndexOf("=") + 1) {
        /* Radio buttons have 'blank' values returned, can ignore these */
        if ( searchCritArray[i].lastIndexOf("blank") < 1 ) {
            searchString += "&" + searchCritArray[i];
        }     
    }
  }
  return searchString;
}

function generatePaginationButton(pageCnt) {

    document.getElementById("metPages").innerHTML = `<table><tr><td>`;
    document.getElementById("metPages").innerHTML += `<button id="btnNext" onClick="writePreviousPage(${pageCnt})" class="btn btn-secondary btn-sm">Previous 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
    document.getElementById("metPages").innerHTML += `</td></tr>`;

    document.getElementById("metPages").innerHTML += `<tr><td>`;
    document.getElementById("metPages").innerHTML += `<button id="btnNext" onClick="writeNextPage(${pageCnt})" class="btn btn-secondary btn-sm">Next 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
    document.getElementById("metPages").innerHTML += `</td></tr>`;
 
    document.getElementById("metPages").innerHTML += `<tr><td>`;
    document.getElementById("metPages").innerHTML += `<button id="btnNew" onClick="clickBtnNew()" class="btn btn-warning btn-sm">New selection</button>`;
    document.getElementById("metPages").innerHTML += `</td></tr></table>`;

    document.getElementById("metPagesTop").innerHTML = `<table><tr><td>`;
    document.getElementById("metPagesTop").innerHTML += `<button id="btnNext" onClick="writePreviousPage(${pageCnt})" class="btn btn-secondary btn-sm">Previous 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
    document.getElementById("metPagesTop").innerHTML += `</td></tr>`;

    document.getElementById("metPagesTop").innerHTML += `<tr><td>`;
    document.getElementById("metPagesTop").innerHTML += `<button id="btnNext" onClick="writeNextPage(${pageCnt})" class="btn btn-secondary btn-sm">Next 5 artworks of <span class="badge badge-light">${pageCnt}</span> pages</button>`;
    document.getElementById("metPagesTop").innerHTML += `</td></tr>`;
 
    document.getElementById("metPagesTop").innerHTML += `<tr><td>`;
    document.getElementById("metPagesTop").innerHTML += `<button id="btnNew" onClick="clickBtnNew()" class="btn btn-warning btn-sm">New selection</button>`;
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
    document.getElementById("metPagesTop").innerHTML = "";
    document.getElementById("metPageCount").innerHTML = "";
    document.getElementById("metPages").innerHTML = "";
    /* allow user to make another selection */
    document.getElementById("btnGetCriteria").style.display = "block";
    /* initialise variables holding old selections */
    currentPg = 1;
    displayObjects = [];
}
