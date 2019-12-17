let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser) {
    alert("Login first");
    window.location.assign("/src/pages/login.html");
}
else if(currentUser.type !== "admin" ) {
    window.location.assign("/");
}


let users_count = document.getElementById("users_count");

let promise = [];
let products = [];
let users = [];

promise.push(db.collection("users").where("status", "==", true).get());
promise.push(db.collection("advertise").where("status", "==", true).get());

Promise.all(promise)
.then((dataResponse ) => {
    products = [];

    dataResponse[1].forEach(doc => {
        products.push({ ...doc.data(), docId: doc.id })
    })

    dataResponse[0].forEach(doc => {
        users.push({ownerName: doc.data().name, uid: doc.data().uid, products:  products.filter(value => value.uid == doc.data().uid )});
    });
    
    document.getElementById("user_product").innerHTML = users.map((value) =>{
        return(`
                <div class="dropdown" style="text-align: center;">
                <button type="button" class="btn btn-dark dropdown-toggle w-75" data-toggle="dropdown">
                ${value.ownerName}
                </button>
                <button type="button" class="btn btn-dark" onClick="deleteUsers('${value.uid}')">Delete</button>
                <div class="dropdown-menu w-75">
                ${
                    value.products.map((product) =>{
                        return(`
                            <div class="card-body row">
                                <div class="offset-md-1"></div>
                                <div class="col-md-6">
                                    <h5 class="card-title">${product.productname}</h5>
                                </div>
                
                                <div class="col-md-3 form-group">
                                    <button class="btn btn-secondary"  onClick="deleteProduct('${product.docId}')">Delete</button>
                                </div>
                        
                            </div>
                            <hr>
                        `)
                    }).join("")
                }
                </div>
        </div>
        <hr>

        `)
    }).join("")

    document.getElementById("users_count").innerHTML= users.length;

    document.getElementById("product_count").innerHTML= products.length;
})
.catch((error)  =>{
    console.log(error.message)
})


function deleteProduct(docId) {
     db.collection("advertise")
     .doc(docId).delete()
    .then(() => {
        alert('Product deleted')
        window.location.assign('/src/pages/admin.html');
    })
    .catch((error) => {
        alert(error.message)
    })
}

function deleteUsers(userId) {
    let updatePromise = [];
    db
    .collection("users")
    .doc(userId)
    .update({
        status: false
    })
    .then(() =>{
        db
        .collection("advertise")
        .where("uid", "==", userId)
        .get()
        .then((response) => {
            console.log("response", response)
            response.forEach((doc) => {
                updatePromise.push( db
                    .collection("advertise")
                    .doc(doc.id)
                    .update({
                        status: false
                    }));               
            })

            Promise.all(updatePromise)
            .then((ddfdf) =>{
                window.location.assign("/src/pages/admin.html");
            })
        })
    })
    .catch((error) => {
        alert(error.message)
    })
    
}


function adminlogput()
{
    firebase.auth().signOut()
        .then(function () {
            localStorage.clear();
            localStorage.setItem('favlist', JSON.stringify([]));
            alert("Successfully Logout");
            window.location.pathname = '/index.html';
        })
        .catch(function (error) {
            console.log("[Logout Error].....", error.message);
        });
    }