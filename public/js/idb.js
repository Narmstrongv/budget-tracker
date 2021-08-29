//vari to hold db connect
let db;
//establish connect to IndexDB called 'b-t' & set to ver 1
const request = indexedDB.open('budget_tracker', 1);
//this event will emit if db ver changes (nonexistant to ver 1/2/3 etc)
request.onupgradeneeded = function(event) {
    //save a ref to db
}