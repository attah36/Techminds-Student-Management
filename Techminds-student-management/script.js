// Data structures
const students = new Map(); // Map to store students (id => {name, age, courses, [passwordSymbol]})
const allCourses = new Set(); // Set for unique courses
const passwordSymbol = Symbol("password"); // Symbol for private password storage
let nextId = 1; // Auto-increment ID

// DOM elements
const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const courseList = document.getElementById("courseList");
const deleteBtn = document.getElementById("deleteBtn");
const deleteNameInput = document.getElementById("deleteName");
const searchBtn = document.getElementById("searchBtn");
const searchIdInput = document.getElementById("searchId");
const searchResult = document.getElementById("searchResult");

// Add Student
studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = parseInt(document.getElementById("age").value.trim());
    const coursesInput = document.getElementById("courses").value.trim();
    const password = document.getElementById("password").value;

    // Prevent duplicate names
    for (let [, student] of students) {
        if (student.name.toLowerCase() === name.toLowerCase()) {
            alert("Student with this name already exists!");
            return;
        }
    }

    // Store courses in a Set to ensure uniqueness
    const courseListInput = coursesInput.split(",").map(c => c.trim()).filter(c => c);
    const courseSet = new Set(courseListInput);

    // Update the global courses set
    courseSet.forEach(course => allCourses.add(course));

    // Create student object with private password
    const student = {
        id: nextId,
        name,
        age,
        courses: courseSet,
        [passwordSymbol]: password
    };

    // Add to map
    students.set(nextId, student);
    nextId++;

    // Clear form
    studentForm.reset();

    // Refresh display
    displayStudents();
    displayCourses();
});

// Display Students
function displayStudents() {
    studentList.innerHTML = "";
    for (let [id, data] of students) {
        const li = document.createElement("li");
        li.textContent = `ID: ${id} - ${data.name} (Age: ${data.age}) - Courses: ${[...data.courses].join(", ")}`;
        studentList.appendChild(li);
    }
}

// Display Unique Courses
function displayCourses() {
    courseList.innerHTML = "";
    for (let course of allCourses) {
        const li = document.createElement("li");
        li.textContent = course;
        courseList.appendChild(li);
    }
}

// Delete Student by Name
deleteBtn.addEventListener("click", function () {
    const nameToDelete = deleteNameInput.value.trim().toLowerCase();
    let studentIdToDelete = null;

    for (let [id, student] of students) {
        if (student.name.toLowerCase() === nameToDelete) {
            studentIdToDelete = id;
            break;
        }
    }

    if (studentIdToDelete !== null) {
        // Remove student's courses from global Set if unused
        const studentCourses = students.get(studentIdToDelete).courses;
        studentCourses.forEach(course => {
            let stillUsed = false;
            for (let [, data] of students) {
                if (data.courses.has(course) && data.id !== studentIdToDelete) {
                    stillUsed = true;
                    break;
                }
            }
            if (!stillUsed) {
                allCourses.delete(course);
            }
        });

        students.delete(studentIdToDelete);
        deleteNameInput.value = "";

        displayStudents();
        displayCourses();
    } else {
        alert("No student found with that name!");
    }
});

// Search Student by ID
searchBtn.addEventListener("click", function () {
    const id = parseInt(searchIdInput.value.trim());
    searchResult.innerHTML = "";

    if (students.has(id)) {
        const student = students.get(id);
        searchResult.innerHTML = `
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Age:</strong> ${student.age}</p>
            <p><strong>Courses:</strong> ${[...student.courses].join(", ")}</p>
        `;
    } else {
        searchResult.textContent = "No student found with that ID!";
    }
});
