let library = [];   // lives in RAM, tied to the specific page reload

function Book(name, author, numOfPages, status) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.author = author;
    this.numOfPages = numOfPages;
    this.status = status;
}
Book.prototype.edit = function(name, author, numOfPages, status) {  // edit function on the prototype to save memory
    this.name = name;
    this.author = author;
    this.numOfPages = numOfPages;
    this.status = status;
}

let editingBook = null;   // keeps track of whether a book is being edited or new

function addBookToLibrary(book) {
    library.push(book);
    displayBooks();
}

const dialog = document.querySelector(".popup");
const add = document.querySelector(".add-book");
// Clicking "Add Book" opens the dialog as a modal
add.addEventListener("click", () => {
    dialog.showModal();
})
const form = document.querySelector(".book-info");
form.addEventListener("submit", (e) => {
    // Prevent the browser's default form behavior, which is to
    // submit the request and reload/navigate the page — without this,
    // the page reloads and wipes out the library array right after adding a book
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity(); // shows the native "please fill this in" reminder
        return; // return since invalid
    }

    // get the information entered in the form
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const status = document.getElementById("status").value;

    if (editingBook !== null) {
        editingBook.edit(title, author, pages, status);
        editingBook = null; // reset edit status
        displayBooks(); // display after editing
    }
    else {  // new book
        const book = new Book(title, author, pages, status);
        addBookToLibrary(book);
    }
    // Close the dialog and reset the form for next time
    dialog.close();
    form.reset();
})

// Close button logic
const cancel = document.querySelector(".close");
cancel.addEventListener("click", () => {
    dialog.close();     // close dialog
    form.reset();   // clear form
})

const lib = document.querySelector(".book-list"); // get the existing library div

function removeBook(id) {
    let arr = [];
    for (let i = 0; i < library.length; i++) {
        if (library[i].id !== id) arr.push(library[i]);
    }
    library = arr;
    // shorter way: library = library.filter(book => book.id !== id); 
}

function displayBooks() {
    lib.innerHTML = ""; // clear old content first
    for (let i = 0; i < library.length; i++) {
        // Create new table elements for each field of the form
        const row = document.createElement("tr");
        const title = document.createElement("td");
        title.textContent = library[i].name;
        const author = document.createElement("td");
        author.textContent = library[i].author;
        const pages = document.createElement("td");
        pages.textContent = library[i].numOfPages;
        const status = document.createElement("td");
        status.textContent = library[i].status;
        // Create some user action buttons
        const actions = document.createElement("td");
        actions.className = "actions";
        const actionDiv = document.createElement("div");
        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.classList.add("edit");
        edit.addEventListener("click", () => {
            editingBook = library[i];
            // manually set each input's value to the book's current data
            document.getElementById("title").value = library[i].name;
            document.getElementById("author").value = library[i].author;
            document.getElementById("pages").value = library[i].numOfPages;
            document.getElementById("status").value = library[i].status;
            dialog.showModal(); // open dialog
        })
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.classList.add("delete");
        del.addEventListener("click", () => {
            removeBook(library[i].id);
            displayBooks();
        })
        // Add all html elements to library div
        actionDiv.appendChild(edit);
        actionDiv.appendChild(del);
        actions.appendChild(actionDiv);

        row.appendChild(title);
        row.appendChild(author);
        row.appendChild(pages);
        row.appendChild(status);
        row.appendChild(actions);
        lib.appendChild(row);
    }
}