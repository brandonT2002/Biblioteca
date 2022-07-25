let api = 'https://ipc1-proyecto2-202112030.herokuapp.com/'
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
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info",
            buttons: false,
            timer: 2000
        });
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
            //alert(resultado.msg)
            swal({
                title: "¡Bien!",
                text: resultado.msg,
                icon: "success",
                buttons: false,
                timer: 2000
            });
            resetModal()
            getBooksInfo()
        }
        else{
            swal({
                title: "¡Oops!",
                text: resultado.msg + ", ISBN duplicado",
                icon: "warning",
            })
            document.getElementById('isbn').value=''
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo crear el libro",
            icon: "error",
        });
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
        let info = '<tr><th>ISBN</th><th>Autor</th><th>Titulo</th><th>Año</th><th>Copias</th><th>Copias Disponibles</th><th></th><th></th></tr>'
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
            <td title="eliminar">
            <a class="button-modal">
                <svg onclick="deleteAlert(${resultado[i].isbn})" class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </a>
            </td>
          </tr>`
        }
        if(resultado.length != 0){
            document.getElementById('booksInfo').innerHTML = info
        }
    })
    .catch(error => {/*console.error(error)*/})
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
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info",
            buttons: false,
            timer: 2000
        });
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
            swal({
                title: "¡Bien!",
                text: resultado.msg + " exitosamente",
                icon: "success",
                buttons: false,
                timer: 2000
            });
            resetModalEdit()
            getBooksInfo()
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo actualizar el libro",
            icon: "error",
        });
        /*console.error(error)*/
        resetModalEdit()
    })
}

function deleteAlert(isbn){
    swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, ¡no podrá recuperar este libro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    .then((willDelete) => {
        if (willDelete) {
            deleteBook(isbn)
            swal("¡El libro ha sido eliminado!", {
                icon: "success",
                buttons: false,
                timer: 1500
            });
        }
    });
}

function deleteBook(isbn){
    fetch(`${api}/book`, {
        method: 'DELETE',
        headers,
        body: `{
            "isbn": ${isbn}
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Libro eliminado exitosamente'){
            getBooksInfo()
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo actualizar el libro",
            icon: "error",
        });
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
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info",
            buttons: false,
            timer: 2000
        });
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
            swal({
                title: "¡Bien!",
                text: resultado.msg,
                icon: "success",
                buttons: false,
                timer: 2000
            });
            resetModalCustomer()
            getCustomerInfo()
        }
        else{
            swal({
                title: "¡Oops!",
                text: resultado.msg + ", CUI duplicado",
                icon: "warning",
                buttons: false,
                timer: 2000
            });
            document.getElementById('cui').value=''
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo crear al prestamista",
            icon: "error",
        });
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
        let info = '<tr><th>CUI</th><th>Nombre</th><th>Apellido</th><th></th><th></th></tr>'
        for(let i = 0; i < resultado.length; i ++) {
            info += `<tr>
            <td>${resultado[i].cui}</td>
            <td>${resultado[i].first_name}</td>
            <td>${resultado[i].last_name}</td>
            <td title="historial">
            <a href="#modal2" class="button-modal record" onclick="recordCustomer('${resultado[i].first_name}','${resultado[i].last_name}')">Historial</a>
            </td>
            <td><a class="button-modal"><svg onclick="deleteAlertCustomer(${resultado[i].cui})" class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </a></td>
          </tr>`
          console.log(resultado[i].record)
        }
        if(resultado.length != 0){
            document.getElementById('customerInfo').innerHTML = info
        }
    })
    .catch(error => {/*console.error(error)*/})
}

function recordCustomer(name,lastName) {
    document.getElementById('titleLook').innerHTML = name + " " + lastName
    //console.log(record)
        /*let info = '<tr><th>UUID</th><th>ISBN</th><th>Titulo</th><th>Fecha de Prestamo</th><th>Fecha de Devolución</th></tr>'
        for(let i = 0; i < record.length; i ++) {
            info += `<td>${record[i]}</td>`
        }
        if(resultado.length != 0){
            document.getElementById('customerRecord').innerHTML = info
        }else{
            document.getElementById('noRecord').style.display = "none"
        }*/
}

function deleteAlertCustomer(cui){
    swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, ¡no podrá recuperar este prestamista!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    .then((willDelete) => {
        if (willDelete) {
            deleteCustomer(cui)
            swal("¡El prestamista ha sido eliminado!", {
                icon: "success",
                buttons: false,
                timer: 1500
            });
            getCustomerInfo()
        }
    });
}

function deleteCustomer(cui){
    fetch(`${api}/person`, {
        method: 'DELETE',
        headers,
        body: `{
            "cui": "${cui}"
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Prestamista eliminado exitosamente'){
            getCustomerInfo()
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo eliminar el prestamista",
            icon: "error",
        });
    })
}

function newLoan(){
    let cui = document.getElementById('cuiBorrow').value
    let isbn = document.getElementById('isbnBorrow').value
    if(cui.replace(' ','')=='' || isbn.replace(' ','')=='') {
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info",
            buttons: false,
            timer: 2000
        });
        return
    }
    fetch(`${api}/borrow`, {
        method: 'POST',
        headers,
        body: `{
            "cui": "${cui}",
            "isbn": ${isbn}
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Prestamo pendiente'){
            swal({
                title: "¡Oops!",
                text: resultado.msg,
                icon: "info",
                buttons: false,
                timer: 2000
            });
            resetBorrow()
        }
        else if(resultado.msg == 'No se ha podido realizar el prestamo'){
            swal({
                text: resultado.msg + ", verifique los datos",
                icon: "info"
            });
            resetBorrow()
        }
        else if(resultado.msg == 'No hay libros disponibles'){
            swal({
                text: resultado.msg,
                icon: "info"
            });
            resetBorrow()
        }
        else{
            swal({
                title: "¡Bien!",
                text: "Prestamo exitoso, código de préstamo - " + resultado.uuid,
                icon: "success",
            });
            resetBorrow()
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo realizar el prestamo",
            icon: "error",
        });
        resetBorrow()
    })
}

function resetBorrow(){
    window.location.href = 'cliente.html#close'
    document.getElementById('cuiBorrow').value=''
    document.getElementById('isbnBorrow').value=''
}
function returnBook(){
    let uuid = document.getElementById('uuid').value
    if(uuid.replace(' ','')=='') {
        swal({
            title: "¡Oops!",
            text: "Todos los campos son obligatorios",
            icon: "info",
            buttons: false,
            timer: 2000
        });
        return
    }
    fetch(`${api}/borrow/:uuid`, {
        method: 'PATCH',
        headers,
        body: `{
            "uuid": "${uuid}"
        }`
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        if(resultado.msg == 'Libro devuelto exitosamente'){
            swal({
                title: "¡Bien!",
                text: resultado.msg,
                icon: "success",
                buttons: false,
                timer: 2000
            });
            document.getElementById('uuid').value=''
        }
        else{
            swal({
                text: resultado.msg,
                icon: "info",
                buttons: false,
                timer: 2000
            });
            document.getElementById('uuid').value=''
        }
    })
    .catch(error => {
        swal({
            title: "¡Oops!",
            text: "Ha ocurrido un error, no se pudo devolver el libro",
            icon: "error",
        });
        document.getElementById('uuid').value=''
    })
}
/*loan*/
function show() {
    let action = document.getElementById('action')
    if(action.value == 'loan'){
        loan = `<h2 class="center-text">Prestar Libro</h2>
        <div class="containerBorrow">
            <div class="input-container ic2">
                <input id="cuiBorrow" class="input" type="number" placeholder=" " />
                <div class="cut cut-short"></div>
                <label for="cuiBorrow" class="placeholder">CUI</label>
            </div>
            <div class="input-container ic2">
                <input id="isbnBorrow" class="input" type="number" placeholder=" " />
                <div class="cut cut-short"></div>
                <label for="isbnBorrow" class="placeholder">ISBN</>
            </div>
            <button type="button" class="button" onclick="newLoan()">Prestar</button>
        </div>`
        document.getElementById('prestar').style.display=''
        document.getElementById('prestar').innerHTML = loan
    }
    else{
        returnB = `<h2 class="center-text">Devolver Libro</h2>
        <div class="containerReturn">
            <div class="input-container ic2">
                <input id="uuid" class="input" maxlength="5" type="text" placeholder=" " />
                <div class="cut cut-short"></div>
                <label for="uuid" class="placeholder">UUID</label>
            </div>
            <button type="button" class="button" onclick="returnBook()">Devolver</button>
        </div>`
        document.getElementById('prestar').style.display=''
        document.getElementById('prestar').innerHTML = returnB
    }
}