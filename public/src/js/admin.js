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
                <div class="dropdown row" style="text-align: center;">
                 
                <div class = "col-md-2" style="text-align: right;"><b>${value.ownerName}</b></div>
                 
                <button type="button" class="btn btn-dark dropdown-toggle w-50" data-toggle="dropdown">
                ${"View Product"}
                </button>
                <a href="#myModal_1" class="trigger-btn" data-toggle="modal" onClick="store_user_uid('${value.uid}')"> <img src="../images/deleteIcon.png" height="48" alt=""/> </a>
                <div class="dropdown-menu w-50">
                ${
                    value.products.map((product) =>{
                        return(`
                            <div class="card-body row">
                                <div class="offset-md-1"></div>
                                <div class="col-md-6">
                                    <h5 class="card-title">${product.productname}</h5>
                                </div>
                
                                <div class="col-md-3 form-group">
                                    <a href="#myModal_2" class="trigger-btn" data-toggle="modal" onClick="store_product_uid('${product.docId}')">Delete</a>
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

function store_user_uid(duserid)
{
    localStorage.setItem("delete_user_id", duserid );
}

function store_product_uid(dprodid)
{
    localStorage.setItem("delete_product_id", dprodid );
}

function deleteProduct() {
    var tobe_del_pid = localStorage.getItem("delete_product_id");
     db.collection("advertise")
     .doc(tobe_del_pid).delete()
    .then(() => {
        // alert('Product deleted')
        window.location.assign('/src/pages/admin.html');
    })
    .catch((error) => {
        console.log(error.message)
    })
}

function deleteUsers() {
    var tobe_del_uid = localStorage.getItem("delete_user_id");
    console.log(tobe_del_uid);
    let updatePromise = [];
    db
    .collection("users")
    .doc(tobe_del_uid)
    .update({
        status: false
    })
    .then(() =>{
        db
        .collection("advertise")
        .where("uid", "==", tobe_del_uid)
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
        console.log(error.message)
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