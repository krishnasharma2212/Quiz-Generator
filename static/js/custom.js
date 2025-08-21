templat = `    <div class="card" style="width: 18rem;" id="old_quiz">
<img src="/images/quiz.webp" class="card-img-top" alt="...">
<div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
        card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
</div>
</div>`


function re_old() {
    some = JSON.parse(localStorage.getItem('urls'))
    making = ''
    for (let index = 0; index < some.length; index++) {
        console.log(some)
        making += `     <div class="col">
    <div class="card shadow-sm">
        <img src="/static/images/quiz.webp" alt="thumbnail of quiz">
        <div class="card-body">
            <p class="card-text">${some[index]['title']}</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-success" onclick="window.open('/q/${some[index]['url']}','_blank')">Open</button>&ThickSpace;
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="del_url('${some[index]['url']}')">Delete</button>
                </div>
                <small class="text-body-secondary">${some[index]['subject']}</small>
            </div>
        </div>
    </div>
</div>`


    }
    document.getElementById('older').innerHTML = making
}
re_old()
function del_url(url) {
    some = JSON.parse(localStorage.getItem('urls'))
    for (let index = 0; index < some.length; index++) {
        const element = some[index];
        if (element['url'] == url) {
            some.splice(index, 1)
            break
        }

    }
    localStorage.setItem('urls', JSON.stringify(some))
    re_old()


}

function setCookie(name, value, hours) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
    const cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    document.cookie = cookie;
}

// Set a cookie with an expiration time of 1 hour
// setCookie('myCookie', 'cookieValue', 1);
function getcookie(name) {
    // You can access the cookie like this
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('myCookie='));
    if (cookieValue) {
        const value = cookieValue.split('=')[1];
        return value
    } else {
        return null
    }
}
if (getcookie('any') != null) {
    document.getElementById('main').style.display = 'none'
}
function build() {
    document.getElementById('nom').style.display = 'none'
    cls = document.getElementById('class').value
    subj = document.getElementById('subject').value
    chp = document.getElementById('chapter').value
    que = document.getElementById('question').value

    if (cls && subj && chp && que) {
         
            document.getElementById('f-btn').style.display = 'none'
            document.getElementById('modal').innerHTML = `<div class="spinner-border text-primary" id="spinner" role="status">
            <span class="sr-only"></span>
          </div><h4>Hang on building your quiz it generally take 30-70 Seconds. Don't Reload the page.</h4>`
            db = ''

            $.get(
                "/make", {
                class: cls,
                subject: subj,
                chapter: chp,
                question: que

            },
                function (data) {

                    try {
                        db = JSON.parse(data)
    
                        localStorage.setItem(db['url'], data)
                        setCookie(db['url'], data, 5)
                        window.location = `/q/${db['url']}`
                        
                    } catch (error) {
                        alert(data)
                    }
                });
            return


    }
    else {
        confirm('Please fill all the blanks')
    }
}


