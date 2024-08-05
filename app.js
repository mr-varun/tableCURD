// Select DOM elements
const newMemberAddBtn = document.querySelector('.addMemberBtn');
const darkBg = document.querySelector('.dark_bg');
const popupForm = document.querySelector('.popup');
const crossBtn = document.querySelector('.closeBtn');
const submitBtn = document.querySelector('.submitBtn');
const modalTitle = document.querySelector('.modalTitle');
const popupFooter = document.querySelector('.popupFooter');
const imgInput = document.querySelector('.img');
const imgHolder = document.querySelector('.imgholder');
const form = document.querySelector('form');
const formInputFields = document.querySelectorAll('form input');
const uploadimg = document.querySelector("#uploadimg");
const fName = document.getElementById("fName");
const lName = document.getElementById("lName");
const age = document.getElementById("age");
const city = document.getElementById("city");
const position = document.getElementById("position");
const salary = document.getElementById("salary");
const sDate = document.getElementById("sDate");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const entries = document.querySelector(".showEntries");
const tabSize = document.getElementById("table_size");
const userInfo = document.querySelector(".userInfo");
const table = document.querySelector("table");
const filterData = document.getElementById("search");

let originalData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : [];
let getData = [...originalData];

let isEdit = false, editId;

let arrayLength = 0;
let tableSize = 10;
let startIndex = 1;
let endIndex = 0;
let currentIndex = 1;
let maxIndex = 0;

showInfo();

newMemberAddBtn.addEventListener('click', () => {
    isEdit = false;
    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";
    popupFooter.style.display = "block";
    imgInput.src = "./img/pic1.png";
    darkBg.classList.add('active');
    popupForm.classList.add('active');
});

crossBtn.addEventListener('click', () => {
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();
});

uploadimg.onchange = function () {
    if (uploadimg.files[0].size < 1000000) { // 1MB = 1000000
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };
        fileReader.readAsDataURL(uploadimg.files[0]);
    } else {
        alert("This file is too large!");
    }
};

function preLoadCalculations() {
    arrayLength = getData.length;
    maxIndex = Math.ceil(arrayLength / tableSize);
}

function displayIndexBtn() {
    preLoadCalculations();

    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = "";
    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>';

    for (let i = 1; i <= maxIndex; i++) {
        pagination.innerHTML += '<button onclick="paginationBtn(' + i + ')" index="' + i + '">' + i + '</button>';
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';
    highlightIndexBtn();
}

function highlightIndexBtn() {
    startIndex = ((currentIndex - 1) * tableSize) + 1;
    endIndex = Math.min(startIndex + tableSize - 1, arrayLength);

    if (maxIndex >= 2) {
        const nextBtn = document.querySelector(".next");
        nextBtn.classList.add("act");
    }

    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;

    const paginationBtns = document.querySelectorAll('.pagination button');
    paginationBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('index') === currentIndex.toString()) {
            btn.classList.add('active');
        }
    });

    showInfo();
}

function showInfo() {
    document.querySelectorAll(".employeeDetails").forEach(info => info.remove());

    const tab_start = startIndex - 1;
    const tab_end = endIndex;

    if (getData.length > 0) {
        for (let i = tab_start; i < tab_end; i++) {
            const staff = getData[i];
            if (staff) {
                const createElement = `
                    <tr class="employeeDetails">
                        <td>${i + 1}</td>
                        <td><img src="${staff.picture}" alt="" width="40" height="40"></td>
                        <td>${staff.fName + " " + staff.lName}</td>
                        <td>${staff.ageVal}</td>
                        <td>${staff.cityVal}</td>
                        <td>${staff.positionVal}</td>
                        <td>${staff.salaryVal}</td>
                        <td>${staff.sDateVal}</td>
                        <td>${staff.emailVal}</td>
                        <td>${staff.phoneVal}</td>
                        <td>
                            <button onclick="readInfo('${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-eye"></i></button>
                            <button onclick="editInfo(${i}, '${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button onclick="deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                        </td>
                    </tr>`;
                userInfo.innerHTML += createElement;
                table.style.minWidth = "1400px";
            }
        }
    } else {
        userInfo.innerHTML = `<tr class="employeeDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`;
        table.style.minWidth = "1400px";
    }
}

function readInfo(pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone) {
    imgInput.src = pic;
    fName.value = fname;
    lName.value = lname;
    age.value = Age;
    city.value = City;
    position.value = Position;
    salary.value = Salary;
    sDate.value = SDate;
    email.value = Email;
    phone.value = Phone;

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "none";
    modalTitle.innerHTML = "Profile";
    formInputFields.forEach(input => {
        input.disabled = true;
    });

    imgHolder.style.pointerEvents = "none";
}

function editInfo(id, pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone) {
    isEdit = true;
    editId = id;

    imgInput.src = pic;
    fName.value = fname;
    lName.value = lname;
    age.value = Age;
    city.value = City;
    position.value = Position;
    salary.value = Salary;
    sDate.value = SDate;
    email.value = Email;
    phone.value = Phone;

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "block";
    modalTitle.innerHTML = "Update the Form";
    submitBtn.innerHTML = "Update";
    formInputFields.forEach(input => {
        input.disabled = false;
    });

    imgHolder.style.pointerEvents = "auto";
}

function deleteInfo(index) {
    if (confirm("Are you sure you want to delete?")) {
        originalData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(originalData));
        getData = [...originalData];

        preLoadCalculations();

        if (getData.length === 0) {
            currentIndex = 1;
            startIndex = 1;
            endIndex = 0;
        } else if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        showInfo();
        highlightIndexBtn();
        displayIndexBtn();

        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');

        if (Math.floor(maxIndex) > currentIndex) {
            nextBtn.classList.add("act");
        } else {
            nextBtn.classList.remove("act");
        }

        if (currentIndex > 1) {
            prevBtn.classList.add('act');
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        id: Date.now(),
        picture: imgInput.src === undefined ? "./img/pic1.png" : imgInput.src,
        fName: fName.value,
        lName: lName.value,
        ageVal: age.value,
        cityVal: city.value,
        positionVal: position.value,
        salaryVal: salary.value,
        sDateVal: sDate.value,
        emailVal: email.value,
        phoneVal: phone.value
    };

    if (isEdit) {
        originalData.splice(editId, 1, information);
        submitBtn.innerHTML = "Submit";
        modalTitle.innerHTML = "Fill the Form";
    } else {
        originalData.push(information);
    }

    localStorage.setItem("userProfile", JSON.stringify(originalData));
    getData = [...originalData];

    form.reset();
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    showInfo();
    highlightIndexBtn();
    displayIndexBtn();
});

function paginationBtn(index) {
    currentIndex = index;
    showInfo();
    highlightIndexBtn();

    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add('act');
    }
}

function prev() {
    currentIndex--;

    if (currentIndex < 1) {
        currentIndex = 1;
    }

    showInfo();
    highlightIndexBtn();

    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add('act');
    }
}

function next() {
    currentIndex++;

    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }

    showInfo();
    highlightIndexBtn();

    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add('act');
    }
}

function showFilteredData() {
    const searchKey = filterData.value.trim().toLowerCase();

    if (searchKey !== "") {
        getData = originalData.filter(user =>
            user.fName.toLowerCase().includes(searchKey) ||
            user.lName.toLowerCase().includes(searchKey) ||
            user.ageVal.includes(searchKey) ||
            user.cityVal.toLowerCase().includes(searchKey) ||
            user.positionVal.toLowerCase().includes(searchKey) ||
            user.salaryVal.includes(searchKey) ||
            user.sDateVal.includes(searchKey) ||
            user.emailVal.toLowerCase().includes(searchKey) ||
            user.phoneVal.includes(searchKey)
        );
    } else {
        getData = [...originalData];
    }

    currentIndex = 1;
    startIndex = 1;
    endIndex = 0;
    showInfo();
    highlightIndexBtn();
    displayIndexBtn();
}

filterData.addEventListener("keyup", showFilteredData);
tabSize.addEventListener("change", function () {
    tableSize = parseInt(this.value);
    currentIndex = 1;
    showInfo();
    highlightIndexBtn();
    displayIndexBtn();
});
