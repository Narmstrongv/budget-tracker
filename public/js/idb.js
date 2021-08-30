const { response } = require("express");
const { get } = require("mongoose");

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
        uploadBudget();
    }
};

request.onerror = function(event) {
    //log error
    console.log(event.target.errorCode);
};

//func executed if attempting to submit new budget w/no connect
function saveRecord(record) {
    //open new transaction w/db w/read&write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    //access object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');

    //add record to store w/add method
    budgetObjectStore.add(record);
}

function uploadBudget() {
    //open transaction to db
    const transaction = db.transaction(['new_budget'], 'readwrite');

    //access object store
    const budgetObjectStore = transaction.objectStore('new_budget');

    //get all records from store, & set to vari
    const getAll = budgetObjectStore.getAll();

    //upon successful .getAll exec, run this func
    getAll.onsuccess = function() {
        //if there is data in indexDB's store, send it to api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    //open 1 more transac
                    const transaction = db.transaction(['new_budget'], 'readwrite');
                    //access new_budget object store 
                    const budgetObjectStore = transaction.objectStore('new_budget');
                    //clear all items in store
                    budgetObjectStore.clear();

                    alert('All saved budgets have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

//listen for app coming back online
window.addEventListener('online', uploadBudget);