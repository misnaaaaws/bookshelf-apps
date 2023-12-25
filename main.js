const bookshelf = [];
const RENDER_EVENT = "render-bookshelf";

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("inputBook");
  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", function () {
    searchBooks(searchInput.value.toLowerCase());
  });

  if (isStorageExist()) {
    loadStorageData();
  }
});

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_BOOK, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadStorageData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const book of data) {
      bookshelf.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const id = generateId();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value, 10);
  const isCompleted = document.getElementById("complete").checked;

  const book = generateTodoObject(id, title, author, year, isCompleted);
  bookshelf.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  const unfinishedBookshelf = document.getElementById("incompleteBookshelfList");
  unfinishedBookshelf.innerHTML = "";

  const finishedBookshelf = document.getElementById("completeBookshelfList");
  finishedBookshelf.innerHTML = "";

  for (const book of bookshelf) {
    const bookItem = makeBook(book);

    if (!book.isCompleted) unfinishedBookshelf.append(bookItem);
    else finishedBookshelf.append(bookItem);
  }
});

function makeBook(book) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = book.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author : " + book.author;

  const textYear = document.createElement("p");
  textYear.innerHTML = "Year : " + book.year;

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book_item");

  bookContainer.append(textTitle, textAuthor, textYear);

  const buttonAction = document.createElement("div");
  buttonAction.classList.add("action");

  if (book.isCompleted) {
    const finishedBook = document.createElement("button");
    finishedBook.classList.add("green");
    finishedBook.innerHTML = "Unfinished";

    finishedBook.addEventListener("click", function () {
      addBookToUnfinished(book.id);
    });

    buttonAction.append(finishedBook);
  } else {
    const unfinishedBook = document.createElement("button");
    unfinishedBook.classList.add("green");
    unfinishedBook.innerHTML = "Finished";

    unfinishedBook.addEventListener("click", function () {
      addBookToFinished(book.id);
    });

    buttonAction.append(unfinishedBook);
  }

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.classList.add("red");
  deleteButton.addEventListener("click", function () {
    if (confirm("Are you sure?")) {
      deleteBook(book.id);
    }
  });
  buttonAction.append(deleteButton);

  bookContainer.append(buttonAction);

  const editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.classList.add("blue");
  editButton.addEventListener("click", function () {
    editBook(book.id);
  });

  buttonAction.append(editButton);

  return bookContainer;

}

function addBookToFinished(idBook) {
  const book = findBook(idBook);

  if (book === null) return;

  book.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToUnfinished(idBook) {
  const book = findBook(idBook);

  if (book === null) return;

  book.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(idBook) {
  const bookIndex = findBook(idBook);

  if (bookIndex === -1) return;

  bookshelf.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(idBook) {
  for (const book of bookshelf) {
    if (book.id === idBook) return book;
  }
  return -1;
}

function saveData() {
  const parsed = JSON.stringify(bookshelf);
  localStorage.setItem("BOOKSHELF_APPS", parsed);
  document.dispatchEvent(new Event(SAVED_BOOK));
}

function editBook(idBook) {
    const book = findBook(idBook);
  
    if (book === null) return;
  
    const newTitle = prompt("Enter new title", book.title);
    const newAuthor = prompt("Enter new author", book.author);
    const newYearString = prompt("Enter new year", book.year.toString());
    const newYear = parseInt(newYearString, 10)
  
    if (newTitle !== null && newAuthor !== null && newYear !== null) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = newYear;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  }

  function searchBooks(keyword) {
    const unfinishedBookshelf = document.getElementById("incompleteBookshelfList");
    const finishedBookshelf = document.getElementById("completeBookshelfList");
    
    unfinishedBookshelf.innerHTML = "";
    finishedBookshelf.innerHTML = "";
    
    for (const book of bookshelf) {
      const bookItem = makeBook(book);
  
      if (
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.year.includes(keyword)
      ) {
        if (!book.isCompleted) unfinishedBookshelf.append(bookItem);
        else finishedBookshelf.append(bookItem);
      }
    }
  }
