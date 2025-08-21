var db = undefined
answers = {}
w = null
i = 0
function CNG(dbms, no, q) {
    return `
    <span id="question-id" style="display:none;">${no}</span>
    <div class="bounce-left radio-field">
    <input class="checkmark" type="radio" name="op${no}" value="${dbms[no]['1']}">
    <label>${dbms[no]['1']}</label>
</div>
<div class="delay-100 bounce-left radio-field">
    <input class="checkmark" type="radio" name="op${no}" value="${dbms[no]['2']}">
    <label>${dbms[no]['2']}</label>
</div>
<div class="delay-200 bounce-left radio-field">
    <input class="checkmark" type="radio" name="op${no}" value="${dbms[no]['3']}">
    <label>${dbms[no]['3']}</label>
</div>
<div class="delay-300 bounce-left radio-field">
    <input class="checkmark" type="radio" name="op${no}" value="${dbms[no]['4']}">
    <label>${dbms[no]['4']}</label>
</div>`
}

function readTextFile(_url) {
    db = localStorage.getItem(_url)

    if (db == null) {
        document.getElementById('que-sign').remove()
        document.getElementById('step_number').remove()
        document.getElementById('next').remove()
        document.getElementById('q-heading').remove()
        document.getElementById('main-q').innerHTML = `<img src="/static/images/not-found.png"><h1>Sorry! This quiz is expired you have to make it again <a href="/">Here</a></h1>`
        return;
    }
    db = JSON.parse(db)
    some = localStorage.getItem('urls')
    if (some != null) {
        some = JSON.parse(some)

        pass = true
        for (let index = 0; index < some.length; index++) {
            const element = some[index]['url'];
            if (element == _url) {
                pass = false
            }

        }
        if (pass == true) {
            // CreatingX
            rmn = { 'url': db['url'], 'title': db['title'], 'class': db['class'], 'subject': db['subject'] }
            some.push(rmn)
            some = JSON.stringify(some)
            localStorage.setItem('urls', some)
        }
    }
    if (some == null) {
        localStorage.setItem('urls', '[]')
        some = localStorage.getItem('urls')
        some = JSON.parse(some)

        // CreatingX
        rmn = { 'url': db['url'], 'title': db['title'], 'class': db['class'], 'subject': db['subject'] }
        some.push(rmn)
        some = JSON.stringify(some)

        localStorage.setItem('urls', some)
    }


    document.title = db['title'] + ' Quiz'
    skm = ''
    for (let index = 0; index < db['all']; index++) {
        skm = `${skm}<div class="bar">
                    <div class="fill"></div>
                </div>`

    }
    document.getElementById('bars').innerHTML = skm
    inc()
    document.getElementById('question').innerHTML = `Question <span id="activeStep">1</span>/${db['all']}`
    document.getElementById('q-heading').innerHTML = db['1']['Q']
    document.getElementById('mcq').innerHTML = CNG(db, '1')

    for (let index = 0; index < db['all']; index++) {
        answers[index + 1] = ''

    }
    return db
}



function next(id) {
    document.getElementById('q-heading').innerHTML = db[id]['Q']
    document.getElementById('mcq').innerHTML = CNG(db, id)
}
function sub() {
    id = parseInt(document.getElementById('question-id').innerHTML)
    console.log(id)
    var Number = $(`input[name = "op${id}"]:checked`).val();
    console.log(Number)
    if (Number == undefined) {
        document.getElementById('error').innerHTML = '<div class="reveal alert alert-danger">Choose an option!</div>'
        return
    }
    answers[id] = Number


    inc()
    if (id + 1 == db['all']) {
        document.getElementById('next').innerHTML = 'Submit<i class="fa-solid fa-arrow-right"></i>'
    }
    if (id == db['all']) {
        correct = 0
        for (let index = 0; index < db['all']; index++) {
            console.log('Check')
            n = index + 1
            if (answers[n] == db[n.toString()]['ans']) {
                correct = correct + 1

            }

        }
        document.getElementById('y-score').innerHTML = `${((correct / db['all']) * 100).toFixed(1)}%`;
        if (((correct / (db['all'])) * 100) < 70) {
            document.getElementById('r-sentence').innerHTML = '<i class="fa-solid fa-xmark"></i>You did not Pass'
            document.getElementById('status').innerHTML = 'Fail'
        }
        if (((correct / (db['all'])) * 100) > 70) {
            document.getElementById('r-sentence').innerHTML = '<i class="fa-solid fa-mark"></i>You are Pass'
            document.getElementById('result_msgs').innerHTML = 'Well Done!'
        }
        document.getElementById('right_m').innerHTML = correct
        document.getElementById('wrong_m').innerHTML = db['all'] - correct
        document.getElementById('step_number').style.display = 'none'
        document.getElementById('container').style.display = 'none'
        document.getElementById('result_page').classList.add('result_page_show')
        return
    }
    id = id + 1
    next(id.toString())
}
function inc() {
    var mainDiv = document.getElementsByClassName('bar')
    len = mainDiv.length
    // alert(len)
    if (i != 0) {
        document.getElementById('back').style.visibility = 'visible'
    }

    if (i != len) {
        if (i != 0) {
            mainDiv[i - 1].getElementsByTagName('div')[0].classList.remove('w-100')

            document.getElementById('activeStep').innerHTML = i + 1
        }
        mainDiv[i].getElementsByTagName('div')[0].classList.add('w-100')
        i = i + 1
    }
}


function show() {
    document.getElementById('body').remove()

    for (let index = 0; index < db['all']; index++) {
        index2 = index + 1
        qooo = index + 1
        correct1 = ''
        correct2 = ''
        correct3 = ''
        correct4 = ''

        your_correct1 = ''
        your_correct2 = ''
        your_correct3 = ''
        your_correct4 = ''

        if (answers[index2] == db[index2]['1'] && answers[index2] != db[index2]['ans']) {
            your_correct1 = 'style="border: solid 4px #E91E63;"'
        }
        if (answers[index2] == db[index2]['2'] && answers[index2] != db[index2]['ans']) {
            your_correct2 = 'style="border: solid 4px #E91E63;"'
        }
        if (answers[index2] == db[index2]['3'] && answers[index2] != db[index2]['ans']) {
            your_correct3 = 'style="border: solid 4px #E91E63;"'
        }
        if (answers[index2] == db[index2]['4'] && answers[index2] != db[index2]['ans']) {
            your_correct4 = 'style="border: solid 4px #E91E63;"'
        }

        if (db[index2]['1'] == db[index2]['ans']) {
            correct1 = 'checked'
        }
        if (db[index2]['2'] == db[index2]['ans']) {
            correct2 = 'checked'
        }
        if (db[index2]['3'] == db[index2]['ans']) {
            correct3 = 'checked'
        }
        if (db[index2]['4'] == db[index2]['ans']) {
            correct4 = 'checked'
        }
        // if(answers[n] == db[n.toString()]['ans']){
        ans = `
        <!-- heading -->
        <h2 class="q-heading" id="q-heading">${db[index2]['Q']}</h2>

        <!-- form field -->
        <div class="form-inner" id="mcq">
        <span id="question-id" style="display:none;"></span>
        <div class="bounce-left radio-field">
        <input class="checkmark" type="radio" name="op"  value="${db[index2]['1']}" ${your_correct1} ${correct1} disabled>
        <label>${db[index2]['1']}</label>
    </div>
    <div class="delay-100 bounce-left radio-field">
        <input class="checkmark" type="radio" name="op"  value="${db[index2]['2']}" ${your_correct2} ${correct2} disabled>
        <label>${db[index2]['2']}</label>
    </div>
    <div class="delay-200 bounce-left radio-field">
        <input class="checkmark" type="radio" name="op" value="${db[index2]['3']}" ${your_correct3} ${correct3} disabled>
        <label>${db[index2]['3']}</label>
    </div>
    <div class="delay-300 bounce-left radio-field">
        <input class="checkmark" type="radio" name="op" value="${db[index2]['4']}" ${your_correct4} ${correct4} disabled>
        <label>${db[index2]['4']}</label>
    </div>
        </div>

        <!-- next previous button -->`
        ele = `   
        <main class="overflow-hidden">

        <!-- step-number -->

        <div class="step-number">
            <div class="step-number-inner">Question <span id="activeStep">${qooo}</div>
        </div>
        <div class="container" id="container">
            <div class="row">
                <div class="tab-100 order-c col-md-5 p-relative" id="girl_img">

                    

                    <!-- bar -->

                </div>
                <div class="tab-100 col-md-7">
                    <div class="show-section wrapper">

                        <!-- step 1 -->
                        <section class="steps" id="main-q">

                            <!-- form -->
                            <form id="step1" novalidate="">
${ans}

                            </form>
                        </section>
                        
                        


                        <div class="question overflow-hidden" id="que-sign">
                            <img src="/static/images/question-sign.png" alt="question">
                        </div>

                    </div>
                    
                </div>
            </div>
        </div>
        
        
    </main>
    <script>
    function handleWindowResize() {
            if (window.innerWidth < 769) {
                // Your code to be executed when the window width is less than 769 pixels
                // For example, you can show or hide elements, change styles, or perform any other action.
                document.getElementById('girl_img').style.display = 'none'
                return
            }
            if (window.innerWidth > 769) {
                // Your code to be executed when the window width is less than 769 pixels
                // For example, you can show or hide elements, change styles, or perform any other action.
                document.getElementById('girl_img').style.display = 'block'
                return
            }
        }

        // Add an event listener to check for window resizing
        window.addEventListener("resize", handleWindowResize);

        // Call the function when the page loads to handle the initial window size
        handleWindowResize();
</script>

    `

        // }

        bod = document.createElement('body')
        bod.innerHTML = ele
        document.getElementById('html').appendChild(bod)
    }


    // handleWindowResize()
}

window.onbeforeunload = function () {
    var r = confirm("Are you sure you want to reload the page. All change are reset!");
    if (r) {
        window.location.reload();
    }
    else {
        return;

    }
};
