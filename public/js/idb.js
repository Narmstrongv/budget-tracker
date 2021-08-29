//vari to hold db connect
let db;
//establish connect to IndexDB called 'b-t' & set to ver 1
const request = indexedDB.open('budget_tracker', 1);
//this event will emit if db ver changes (nonexistant to ver 1/2/3 etc)
request.onupgradeneeded = function(event) {
    //save a ref to db
    const db = event.target.result;
    //create an obj store(table) called 'new_budget', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_budget', { autoIncrement: true }); 
};

//upon successful...
request.onsuccess = function(event) {
    //when db is succesfully created w/its object store (from onupgradedneeded event above) or made a connect, save ref to db in global vari
    db = event.target.result;

    //check if app online, if Y run uploadBudget() to send all local db data to api
    if (navigator.onLine) {
        //uploadBudget();
    }
};

request.onerror = function(event) {
    //log error
    console.log(event.target.errorCode);
};