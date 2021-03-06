let api = 'http://127.0.0.1:4000'
//let api = ''
let headers = new Headers()
headers.append('Content-Type','application/json');
headers.append('Accept','application/json');
headers.append('Access-Control-Allow-Origin',api);
headers.append('Access-Control-Allow-Credentials','true');
headers.append('GET','POST','OPTIONS','PUT','DELETE','PATCH')

function createBook(){
    let isbn = document.getElementById('isbn').value
    let author = document.getElementById('author').value
    let title = document.getElementById('title').value
    let year = document.getElementById('year').value
    let noCopies = document.getElementById('noCopies').value
    let noAvailableCopies = document.getElementById('noAvailableCopies').value
    if(isbn.replace(' ','')=='' || author.replace(' ','')=='' || title.replace(' ','')=='' || year.replace(' ','')=='' || noCopies.replace(' ','')=='' || noAvailableCopies.replace(' ','')=='') {
        alert('Todos los campos son obligatorios')
        return
    }
    fetch(`${api}/book`, {
        method: 'POST',
        headers,
        body: `{
            "isbn": ${isbn},
            "author": "${author}",
            "title": "${title}",
            "year": ${year},
            "no_copies": ${noCopies},
            "no_available_copies": ${noAvailableCopies}
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Libro creado exitosamente'){
            alert(resultado.msg)
            resetModal()
            getBooksInfo()
        }
        else{
            alert(`${resultado.msg}, ISBN duplicado`)
            document.getElementById('isbn').value=''
        }
    })
    .catch(error => {
        alert('Ha ocurrido un error, no se pudo crear el libro')
        resetModal()
    })
}

function resetModal(){
    window.location.href = 'index.html#close'
    document.getElementById('isbn').value=''
    document.getElementById('author').value=''
    document.getElementById('title').value=''
    document.getElementById('year').value=''
    document.getElementById('noCopies').value=''
    document.getElementById('noAvailableCopies').value=''
}

function getBooksInfo(){
    fetch(`${api}/book`, {
        method: 'GET',
        headers
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        let info = '<tr><th>ISBN</th><th>Autor</th><th>Titulo</th><th>A??o</th><th>Copias</th><th>Copias Disponibles</th><th></th></tr>'
        for(let i = 0; i < resultado.length; i ++) {
            info += `<tr>
            <td>${resultado[i].isbn}</td>
            <td>${resultado[i].author}</td>
            <td>${resultado[i].title}</td>
            <td>${resultado[i].year}</td>
            <td>${resultado[i].no_copies}</td>
            <td>${resultado[i].no_available_copies}</td>
            <td title="editar">
            <a href="#modal2" class="button-modal">
              <svg onclick="changeInfoBook(${resultado[i].isbn})" class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </a>
            </td>
          </tr>`
        }
        if(resultado.length != 0){
            document.getElementById('booksInfo').innerHTML = info
        }else{
            document.getElementById('noBooks').style.display = "none"
        }
    })
    .catch(error => {console.error(error)})
}

function changeInfoBook(isbn) {
    closeAlert()
    document.getElementById('titleLook').innerHTML = 'ISBN: ' + isbn
    document.getElementById('buttonChange').innerHTML = `<button type="button" class="submit" onclick="updateBook(${parseInt(isbn)})">Actualizar</button>`
}

function closeAlert(){
    var close = document.getElementsByClassName('closebtn');
    var i;

    for(i = 0; i < close.length; i++){
        close[i].onclick = function(){
            var div = this.parentElement;
            div.style.opacity= "0";
            setTimeout(function(){
                div.style.display = "none;"
            }, 600);
        }
    }
}

function updateBook(isbn){
    let author = document.getElementById('authorEdit').value
    let title = document.getElementById('titleEdit').value
    let year = document.getElementById('yearEdit').value
    if(author.replace(' ','')=='' || title.replace(' ','')=='' || year.replace(' ','')=='') {
        alert('Todos los campos son obligatorios')
        return
    }

    fetch(`${api}/book`, {
        method: 'PUT',
        headers,
        body: `{
            "isbn": ${isbn},
            "author": "${author}",
            "title": "${title}",
            "year": ${year}
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Libro actualizado'){
            alert(resultado.msg)
            resetModalEdit()
            getBooksInfo()
        }
    })
    .catch(error => {
        alert('Ha ocurrido un error, no se pudo actualizar el libro')
        console.error(error)
        resetModalEdit()
    })
}

function resetModalEdit(){
    window.location.href = 'index.html#close'
    document.getElementById('authorEdit').value=''
    document.getElementById('titleEdit').value=''
    document.getElementById('yearEdit').value=''
}

function createCustomer(){
    let cui = document.getElementById('cui').value
    let firstName = document.getElementById('firstName').value
    let lastName = document.getElementById('lastName').value
    if(cui.replace(' ','')=='' || firstName.replace(' ','')=='' || lastName.replace(' ','')=='') {
        alert('Todos los campos son obligatorios')
        return
    }
    fetch(`${api}/person`, {
        method: 'POST',
        headers,
        body: `{
            "cui": "${cui}",
            "last_name": "${lastName}",
            "first_name": "${firstName}"
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Prestamista creado exitosamente'){
            alert(resultado.msg)
            resetModalCustomer()
            getCustomerInfo()
        }
        else{
            alert(`${resultado.msg}, CUI duplicado`)
            document.getElementById('cui').value=''
        }
    })
    .catch(error => {
        alert('Ha ocurrido un error, no se pudo crear el libro')
        resetModalCustomer()
    })
}

function resetModalCustomer(){
    window.location.href = 'cliente.html#close'
    document.getElementById('cui').value=''
    document.getElementById('firstName').value=''
    document.getElementById('lastName').value=''
}

function getCustomerInfo(){
    fetch(`${api}/person`, {
        method: 'GET',
        headers
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        let info = '<tr><th>CUI</th><th>Nombre</th><th>Apellido</th><th>Registro</th></tr>'
        for(let i = 0; i < resultado.length; i ++) {
            info += `<tr>
            <td>${resultado[i].cui}</td>
            <td>${resultado[i].first_name}</td>
            <td>${resultado[i].last_name}</td>
            <td title="editar">
            <a href="#modal2" class="button-modal">
              <svg onclick="changeInfoBook()" class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </a>
            </td>
          </tr>`
        }
        if(resultado.length != 0){
            document.getElementById('customerInfo').innerHTML = info
        }else{
            document.getElementById('noCustomer').style.display = "none"
        }
    })
    .catch(error => {console.error(error)})
}