var db = `{{data | safe}}`;
function replaceCaretWithSup(text) {
    // Use a regular expression to find ^ followed by any number or variable
    var pattern = /(\w+)\^(\w+|\d+)/g;

    // Replace ^ with <sup> and </sup>
    var replacedText = text.replace(pattern, '$1<sup>$2</sup>');

    return replacedText;
}
function replaceCaretWithSup2(text) {
    // Use a regular expression to find (something)^n
    var pattern = /\(([^)]+)\)\^(\w+|\d+)/g;

    // Replace ^ with <sup> and </sup>
    var replacedText = text.replace(pattern, '($1)<sup>$2</sup>');

    return replacedText;
}
// Example usage

db = replaceCaretWithSup(db);
db = replaceCaretWithSup2(db);


var owner = false;
const type = '{{types}}';
const url = '{{url | safe}}'
var win = 1;
var model = true;
var user = '{{user}}';
let countdownInterval = null;
var username = 'Not Given'
// Parse the URL and get the search parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'name' parameter
const timer = urlParams.get('t');

// Get the value of the 'age' parameter
const acc = urlParams.get('p');



// Your text data
function download_db() {
    var jsonData = JSON.stringify(db)

    // Convert the text data to a Blob
    var blob = new Blob([jsonData], { type: 'application/json' });

    // Create a link element
    var link = document.createElement('a');

    // Set the download attribute and href for the link
    link.download = `${db['url']}.json`;
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click event on the link to initiate the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}
function uploadFile() {
    var fileInput = document.getElementById('jsonFile');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            try {
                var jsonData = JSON.parse(e.target.result);
                if (jsonData['url'] == undefined) {
                    alert('Invalid AI Quiz JSON file. Please upload a valid AI Quiz JSON file.');
                    return;
                }
                localStorage.setItem(jsonData['url'], JSON.stringify(jsonData))

                window.location = `/q/${jsonData['url']}`
            } catch (error) {
                alert(`Invalid AI Quiz JSON file. Please upload a valid AI Quiz JSON file. ${error}`);
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please choose a JSON file to upload.');
    }
}
try {
    if (type == 'local') {
        db = JSON.parse(localStorage.getItem(url));

    }
    if (type != 'local') {
        db = JSON.parse(db);

    }
    function send_quiz() {
        if (navigator.share) {
            navigator.share({
                title: db['title'],
                text: `Hi check this exciting challenge of quiz now of ${db['all']} questions.`,
                url: window.location.href
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing:', error));
        } else {
            window.open(`https://wa.me/text=Hi check this exciting challenge of quiz now of ${db['all']} questions.`, '_blank')
            alert('Web Share API is not supported in this browser.');
        }

    }
    var ans = {};
    for (let index = 1; index <= db['all']; index++) {
        ans[index] = null;
    }
    function chk_ans() {
        let timer_data = ''
        if (timer != null && timer != '') {

            if (!isNaN(timer)) {
                // Display the countdown in the specified element
                // Calculate minutes and remaining seconds
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;

                // Calculate minutes and remaining seconds
                const minutes3 = Math.floor((parseFloat(timer) * 60) / 60);
                const seconds3 = (parseFloat(timer) * 60) % 60;
                const time_left = `${minutes3 - minutes}.${(seconds3 - seconds) < 10 ? '0' : ''}${seconds3 - seconds}`
                clearInterval(countdownInterval);
                timer_data = `Complete in ${time_left} min`


            }
        }
        var correct = 0
        for (let index = 1; index <= db['all']; index++) {
            if (ans[index] == db[index]['ans']) {
                correct += 1

            }

        }
        var percent = ((correct / db['all']) * 100).toFixed(1)



        // Define the data you want to send in the request
        const data = {
            percent: percent,
            correct: correct,
            ans: ans,
            url: '{{url}}',
            username: username,
            timer_data: timer_data
        };

        // Make the POST request using the fetch API
        fetch('/result_set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.text())
            .then(data => {


                window.location = `/result/${data}`
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Error:', error);
            });


        try {
            document.exitFullscreen();

        } catch (error) {

        }





    }

    function saveSelection(num) {
        for (let index2 = 1; index2 <= 4; index2++) {
            if (document.getElementById(`step${num}op${index2}`).checked == true) {
                ans[num] = document.getElementById(`step${num}op${index2}`).value;
                break;
            }
        }
    }

    function loadSelection(num) {

        for (let index2 = 1; index2 <= 4; index2++) {
            if (ans[num] != null && ans[num] == document.getElementById(`step${num}op${index2}`).value) {
                document.getElementById(`step${num}op${index2}`).checked = true;
                break;
            }
        }
    }

    function inc(num) {


        win += 1
        saveSelection(num);

        document.getElementById(`step${num}`).style.display = 'none';
        if (num == db['all']) {
            chk_ans();
            return;
        }
        document.getElementById(`step${num + 1}`).style.display = 'block';

        loadSelection(num + 1);
    }

    function dec(num) {
        saveSelection(num);

        win -= 1
        document.getElementById(`step${num}`).style.display = 'none';
        try {
            document.getElementById(`step${num - 1}`).style.display = 'block';
            loadSelection(num - 1);
        } catch (error) {
            // Handle the case when there is no previous question
        }
    }

    var raw = ``;
    for (let index = 1; index <= db['all']; index++) {
        raw += `<fieldset id="step${index}" style="display:none;">
                        <!-- Question -->
                        <h1 class="question">${db[index]['Q']}</h1>
    
                        <!-- Options -->
                        <div class="options d-flex flex-wrap justify-content-between">
                            <div class="option animate" id="step${index}box1">
                                <input type="radio" name="op${index}" id="step${index}op1" value="${db[index][1]}">
                                <label>${db[index][1]}</label>
                            </div>
                            <div class="option animate delay-100" id="step${index}box2">
                                <input type="radio" name="op${index}" id="step${index}op2" value="${db[index][2]}">
                                <label>${db[index][2]}</label>
                            </div>
                            <div class="option animate delay-200" id="step${index}box3">
                                <input type="radio" name="op${index}" id="step${index}op3" value="${db[index][3]}">
                                <label>${db[index][3]}</label>
                            </div>
                            <div class="option animate delay-300" id="step${index}box4">
                                <input type="radio" name="op${index}" id="step${index}op4" value="${db[index][4]}" >
                                <label>${db[index][4]}</label>
                            </div>
                        </div>
    
                        <!-- Next Prev Button -->
                        <div class="nextPrev">
                            <button class="prev" type="button" onclick="dec(${index})">
                                <i class="fa-solid fa-caret-left"></i>
                            </button>
                            <div class="stepCount"><span>${index}</span>/${db['all']}</div>
                            <button class="next" type="button" onclick="inc(${index})">
                                <i class="fa-solid fa-caret-right"></i>
                            </button>
                        </div>
                    </fieldset>`;
    }


    // Function to be executed when the space key is pressed
    function handleSpaceKeyPress(event) {
        if (model == true) {
            return;
        }

        // Check if the pressed key is the space key (keyCode 32 or key " ")
        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'ArrowRight' || event.key === ' ') {
            if (win > db['all']) {
                return;
            }
            // Your code to be executed when the space key is pressed
            inc(win)
        }
        // Check if the pressed key is the space key (keyCode 32 or key " ")
        if (event.code === 'ArrowLeft' || event.code === 'Backspace') {
            if (win <= 1) {
                return;
            }
            // Your code to be executed when the space key is pressed
            dec(win)
        }
    }
    function copy() {
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        // Run inline code after a delay of 3 seconds
        document.getElementById('link-icon').style.display = 'none'
        document.getElementById('circle-icon').style.display = 'block'
        setTimeout(function () {
            document.getElementById('circle-icon').style.display = 'none'
            document.getElementById('link-icon').style.display = 'block'
        }, 1000);
    }
    window.onload = function () {



        document.getElementById('url-link').setAttribute('onclick', `copy()`)
        document.getElementById('down_link').setAttribute('href', `${db['url']}.json`)
        document.getElementById('stepForm').innerHTML = raw;
        for (let index = 1; index <= db['all']; index++) {
            if (db[index][1] == undefined) {
                document.getElementById(`step${index}box1`).style.display = 'none'
            }
            if (db[index][2] == undefined) {
                document.getElementById(`step${index}box2`).style.display = 'none'
            }
            if (db[index][3] == undefined) {
                document.getElementById(`step${index}box3`).style.display = 'none'
            }
            if (db[index][4] == undefined) {
                document.getElementById(`step${index}box4`).style.display = 'none'
            }
        }
        document.getElementById('body').style.display = 'block';
        document.getElementById('step1').style.display = 'block';

        loadSelection(1); // Load selection for the first question



    }
    // Attach the event listener to the document
    document.addEventListener('keydown', handleSpaceKeyPress);

} catch (error) {
    alert(error)

}