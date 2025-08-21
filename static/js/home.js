function toggle_nav() {
    var user_data = document.getElementById('mobile-menu')
    if (user_data.style.display == 'none') {
        user_data.style.display = 'block'
        return;
    }
    if (user_data.style.display == 'block') {
        user_data.style.display = 'none'
        return;
    }

}

function toggle_user() {
    var user_data = document.getElementById('user-bar')
    if (user_data.style.display == 'none') {
        user_data.style.display = 'block'
        return;
    }
    if (user_data.style.display == 'block') {
        user_data.style.display = 'none'
        return;
    }

}
function chk_c() {
    const course = document.getElementById('subject').value
    const chapter = document.getElementById('chapter').value
    const level = document.getElementById('level').value
    const question = document.getElementById('question').value
    const name = document.getElementById('name').value

    document.getElementById('subject_l').innerText = course
    document.getElementById('level_l').innerText = level
    document.getElementById('question_l').innerText = question
    document.getElementById('name_l').innerText = name


}
chk_c()




const toggleBackCard = () => {
    cardEl = document.getElementById("creditCard");
    if (cardEl.classList.contains("seeBack")) {
        cardEl.classList.remove("seeBack");
    } else {
        cardEl.classList.add("seeBack");
    }
};
const showBackCard = () => {
    cardEl = document.getElementById("creditCard");
    if (!cardEl.classList.contains("seeBack")) {
        cardEl.classList.add("seeBack");
    }
};
const hideBackCard = () => {
    cardEl = document.getElementById("creditCard");
    if (cardEl.classList.contains("seeBack")) {
        cardEl.classList.remove("seeBack");
    }
};

async function timeout(id, sec) {
    function myFunction1() {
        document.getElementById(`rq${id}-1`).style.display = 'none'
        document.getElementById(`rq${id}-2`).style.display = 'flex'
        try {

            document.getElementById(`rq${id + 1}`).style.display = 'flex'
        } catch (error) {

        }

    }
    await setTimeout(myFunction1, sec)
}

var request = null
var url_101 = null

function prompt() {
    // Replace the URL with your Flask server's URL
    const apiUrl = '/make';

    const course = document.getElementById('subject').value
    const chapter = document.getElementById('chapter').value
    const level = document.getElementById('level').value
    const question = document.getElementById('question').value
    const name = document.getElementById('name').value
    const trueFalse = document.getElementById('trueFalse').checked

    
    

    const queryParams = {
        level: level,
        chapter: chapter,
        subject: course,
        question: question,
        trueFalse: trueFalse
    };

    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    const fullUrl = `${apiUrl}?${queryString}`;

    fetch(fullUrl)
        .then(response => response.text())
        .then(data => {
            request = 'ok'
            console.log(data);
            try {
                db = JSON.parse(data)
                localStorage.setItem(db['url'], JSON.stringify(db))
                url_101 = `/q/${db['url']}`

            } catch (error) {
                alert(error)

            }
        })
        .catch(error => {
            request = 'ok'
            console.error('Error:', error);
        });

}
function create() {
    prompt()
    showBackCard()

    //I want a post request here.

    // Run the first function after 3 seconds
    setTimeout(function () {
        timeout(1, 1000)

        // Run the second function after another 3 seconds
        setTimeout(function () {
            timeout(2, 2000)

        }, 1000);

    }, 100);
    var int_1 = null
    const fn_2 = () => {
        if (request == 'ok') {
            setTimeout(function () {

                timeout(3, 100)

                // if post request is not laoded than don't go forward here till response is ready.

                // Run the third function after another 3 seconds
                setTimeout(function () {
                    timeout(4, 100)
                    window.location = url_101
                }, 1000);
            }, 10);
            request == 'off'
            clearInterval(int_1)
        }
    }
    int_1 = setInterval(fn_2, 1000);
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
                jsonData['url'] = jsonData['url'] + '-local'
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