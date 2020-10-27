let db;
// Creates a new db request for a "budget" database
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // Creates object store called "pending"=
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  // Checks if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  // Creates a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  // Accesses the pending object store
  const store = transaction.objectStore("pending");

  // Adds a record to the store
  store.add(record);
}

function checkDatabase() {
  // Opens a transaction on the pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // Accesses the pending object store
  const store = transaction.objectStore("pending");
  // Gets all records from the store and sets them to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");

          // Clears all the items in the store
          store.clear();
        });
    }
  };
}

// Event Listener for app coming back online
window.addEventListener("online", checkDatabase);
