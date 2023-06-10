/*This will check whether our browser supports IndexedDB*/


const indexedDB =
window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.mxIndexedDB || window.shimIndexedDB;

/*This will open a request using IndexedDB and 1 represents the version of the database*/
const request=indexedDB.open("Database1",1);

request.onerror = function (event) {
    console.error("An error occured with IndexedDB");
    console.error(event);
};

/*The below function will run to create a ObjectStore Movie with a unique id
and in that ObjectStore we have an index named Movie_Details which has a compound index as Name and Director for details
about the movie we search and an index Movie_Genre to display the Genre of the movie*/

request.onupgradeneeded = function() {
    const db = request.result;
    const Main = db.createObjectStore("Movie",{keyPath: "id"});
    Main.createIndex("Movie_Details",["Name", "Director"],{unique:false,});
    Main.createIndex("Movie_Genre", ["Genre"] ,{unique:false,})
};
request.onsuccess = function() {
    const db = request.result; /* To get the reference of the cards database */
    const transaction = db.transaction("Movie","readwrite"); /*const transaction = db.transaction(db.objectStoreNames);*/
    const Main = transaction.objectStore("Movie");
    const CompoundIndex = Main.index("Movie_Details");
    const GenreIndex = Main.index("Movie_Genre");

    Main.put({id:101 , Name:"Friends", Director:"James Burrows",Genre:"Rom-Com"});
    Main.put({id:102 , Name:"Conjuring", Director:"James Wan",Genre:"Horror"});
    Main.put({id:103 , Name:"Avengers", Director:"Russo Brothers",Genre:"Sci-Fi"});
    Main.put({id:104 , Name:"The Hangover", Director:"David Fernandes",Genre:"Rom-Com"});
    Main.put({id:105 , Name:"Evil Dead", Director:"Alex Marshal", Genre:"Horror"});

    const GetallQuery = GenreIndex.getAll(["Rom-Com"]);
    const IDQuery = Main.get(103);
    const CompoundQuery = CompoundIndex.get(["Evil Dead","Alex Marshal"]);

    GetallQuery.onsuccess = function(){
        console.log('Query1 -> to get all the details of Genre Rom-Com',GetallQuery.result);
    };
    IDQuery.onsuccess = function(){
      console.log('Query2-> to get details of id 103', IDQuery.result);  
    };
    CompoundQuery.onsuccess = function(){
        console.log('Query3 -> to get details of Genre "Horror" & Director "Alex Marshal"',CompoundQuery.result);
    };

    transaction.oncomplete = function(){
        db.close();
    };  
};