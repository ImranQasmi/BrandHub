
let users_count = document.getElementById("users_count");
let arr = [];
let start = 0;
let pageLimit = 8;

firebase.firestore().enablePersistence()
    .then(function () {
        // Initialize Cloud Firestore through firebase
        var db = firebase.firestore();
    })
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

///////////////////////////////////////////////////////////
///////////////Check User
////////////////////////////////////////////////////////////

var currentUser = JSON.parse(localStorage.getItem('currentUser'));
var user_menu = document.getElementById('user_menu');

if (currentUser && (window.location.pathname == '/index.html' || window.location.pathname == '/')) {
    user_menu.innerHTML = `
    <div class="dropdown my-2" style="margin: 5%;">
        <button class="btn btn-dark dropdown-toggle" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false w-75">
        ${currentUser.name}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu">
            <button class="dropdown-item" type="button" onclick="Openedit()">Edit</button>
            <button class="dropdown-item" type="button" onclick="MyAds()">My Ads</button>
            <button class="dropdown-item" type="button" onclick="SignOut()">Sign Out</button>
        </div>
    </div> 
    `
    sell_button.innerHTML = `<a class="btn btn-dark" href="./src/pages/submit-ads.html"><b>SELL</b></a>`
}
else {
    if (user_menu) {
        user_menu.innerHTML = `<a class="btn" href="./src/pages/login.html"><b>LOGIN</b></a>`

        sign_up.innerHTML = `<a class="btn" href="./src/pages/signup.html"><b>SIGNUP</b></a>`
    }
}

//////////////////////////////////////////////////////////////////
////////////////////////////Email and Password Login
// ////////////////////////////////////////////////////////////////////////


function Login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (resp) {

            if (email === "admin@admin.com") {
                localStorage.setItem('currentUser', JSON.stringify({ status: true , type: "admin" }));
               // alert("Successfully Login");
                window.location.assign('/src/pages/admin.html');
            }
            else {
                db.collection("users").doc(resp.user.uid)
                    .get()
                    .then(function (resps) {
                        if(resps.data().status) {
                            localStorage.setItem('currentUser', JSON.stringify({ status: true, ...resps.data(), type: "user" }));
                           // alert("Successfully Login");
                            window.location.assign('/index.html');
                        }
                        else {
                            alert("Contact your admin to access")
                        }
                    })
            }

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // alert(errorCode);
            alert(errorMessage);
        });

}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////Email and Password sign-up
///////////////////////////////////////////////////////////////////////////////////

function SignUp() {

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let name = document.getElementById('name').value;
    let phoneno = document.getElementById('phoneno').value;
    let shopname = document.getElementById('shopname').value;
    let address = document.getElementById('address').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((response) => {
            db.collection('users').doc(response.user.uid).set({
                email,
                phoneno,
                shopname,
                name,
                address,
                uid: response.user.uid,
                status: true
            })
                .then(() => {
                    alert("Successfully Created");
                    localStorage.setItem("userData", JSON.stringify({
                        email,
                        phoneno,
                        shopname,
                        name,
                        address,
                        uid: response.user.uid,
                        status: true
                    }))
                    window.location.assign('/index.html');
                })
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            // ...
        });
}



//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


function SignOut() {
    firebase.auth().signOut()
        .then(function () {
            localStorage.clear();
            localStorage.setItem('favlist', JSON.stringify([]));
            window.location.pathname = '/index.html';
        })
        .catch(function (error) {
            console.log("[Logout Error].....", error.message);
        });
}


///////////////////////////////////////////////////////////////////////
/////////////////Submitting Advertisment
///////////////////////////////////////////////////////////////////////

async function SubmitAds() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    var category = document.getElementById("product_categoty").value;
    var condition = document.getElementById('product_condition').value;
    var price = parseInt(document.getElementById("price").value, 10);
    var description = document.getElementById("product_description").value;
    var productname = document.getElementById("productname").value;


    if (currentUser.uid) {
        if (category && condition && price && description && productname) {
            UploadImage()
                .then((url) => {
                    db.collection("advertise").add({
                        uid: currentUser.uid,
                        category,
                        condition,
                        price,
                        description,
                        productname,
                        owner_name: currentUser.name,
                        phonenumber: currentUser.phoneno,
                        shopname: currentUser.shopname,
                        address: currentUser.address,
                        posted_date: new Date().toString(),
                        url,
                        status: true
                    })
                        .then(function (resp) {
                            swal("Good job!", "Your Ads successfully submitted!", "success");
                            document.getElementById('myform').reset();
                        })
                        .catch((error) => {
                            swal("Error!", "" + error.message + "", "error");
                        })
                });
        }
        else {
            swal("Attention!", "Some field is empty", "warning");
        }
    }
    else {
        swal("Attention!", "First Login on your Account!", "warning")
            .then(() => {
                document.getElementById('myform').reset();
            })
    }
}


function UploadImage() {
    var storageRef = firebase.storage().ref();
    var ImagesRef = storageRef.child(`images/product_${Math.random().toString().substring(2, 6)}`);
    var file = document.getElementById("product_photo").files[0];
    return new Promise((resolve, reject) => {
        ImagesRef.put(file)
            .then(function (snapshot) {
                ImagesRef.getDownloadURL()
                    .then(function (downloadURL) {
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        reject(erroe);
                    })
            })
            .catch((e) => {
                console.log('Error', e)
            });
    })
}

////////////////////////////////////////////////////////////////////////////////
/////////////////OpenEditProduct
///////////////////////////////////////////////////////////////////////////

function Openedit() {
    window.location.pathname = '/src/pages/myproduct.html';
}



////////////////////////////////////////////////////////////////////////////////
/////////////////RecommedSearch
///////////////////////////////////////////////////////////////////////////////

function RecommedSearch() {
    let div = document.getElementById('recomended_search');
    var pagination = document.getElementById('pagination');

    db.collection("advertise").where("status", "==", true).limit(12)
        .get()
        .then((querySnapshot) => {

             arr = [];
            querySnapshot.forEach(function (doc) {
                arr.push({ id: doc.id, data: doc.data() });
            })

            localStorage.setItem("current_search_data", JSON.stringify(arr));

        div.innerHTML = `
        <div class="parent card-deck">
        ${ arr.slice(start, pageLimit).map((doc) => {
                return (`
                <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                    <div>
                        <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                    </div>
                    <hr>
                    <div class="card-body">
                        <h5 class="card-title">${doc.data.price}</h5>
                        <p class="card-text">${doc.data.productname}</p>
                    </div>
                </div>`)
            }).join('')}
        <div>
        `
        pagination.innerHTML = `
        ${ arr.slice(start, Math.ceil(arr.length / pageLimit)).map((doc, index) =>{
            return (
            `<li class="page-item" onClick={paginationForRecommded('${index}')}><p class="page-link">${index + 1}</p></li>`
            )
        }).join('')}`
        
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}


///pagination 

function paginationForRecommded(index) {
    let div = document.getElementById('recomended_search');

    div.innerHTML = `
    <div class="parent card-deck">
    ${ arr.slice(index, index + pageLimit).map((doc) => {
            return (`
            <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                <div>
                    <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                </div>
                <hr>
                <div class="card-body">
                    <h5 class="card-title">${doc.data.price}</h5>
                    <p class="card-text">${doc.data.productname}</p>
                </div>
            </div>`)
        }).join('')}
    <div>`;
   
}

function paginationForSearch(index) {
    let div = document.getElementById('ads_card');

    div.innerHTML = `
    <div class="parent card-deck">
    ${ arr.slice(index, index + pageLimit).map((doc) => {
            return (`
            <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                <div>
                    <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                </div>
                <hr>
                <div class="card-body">
                    <h5 class="card-title">${doc.data.price}</h5>
                    <p class="card-text">${doc.data.productname}</p>
                </div>
            </div>`)
        }).join('')}
    <div>`;
   
}

///////////////////////////////////////getAllProducts/////

function getAllProducts() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let allproducts = document.getElementById("allproduct");
    let products = [];
    db.collection("advertise")
        .where("uid", "==", currentUser.uid)
        .where("status", "==", true)
        .onSnapshot((response) => {
            allproducts.innerHTML = "";
            products = [];
            response.forEach((doc, index) => {
                let data = doc.data();
                products.push({ ...data, id: doc.id });
                console.log(data.url);
                allproduct.innerHTML += `<br>
                <div class="card mb-3" style="max-width: 600px;">
                <div class="row no-gutters">
                  <div class="col-md-4">
                    <img src="${data.url}" class="card-img" alt="...">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">${data.productname}</h5>
                      <p class="card-text">${data.description}</p>
                      
                      <div class="row"  style="text-align: center";>
                      <div class="col-md-6 form-group">
                          <button href="#" class="btn btn-secondary form-control" onClick="goToEditPage('${doc.id}')" >Edit</button>
                      </div>
                  
                      <div class="col-md-6 form-group">
                          <button href="#myModal_3" class="trigger-btn btn btn-secondary form-control" data-toggle="modal" onClick="store_edit_ProductId('${doc.id}')">Delete</button>
                      </div>
                  </div>

                    </div>
                  </div>
                </div>
              </div>`
            })

            localStorage.setItem("products", JSON.stringify(products))
        })
}

function store_edit_ProductId(eprodid)
{
    localStorage.setItem("edit_product_id", eprodid);
}

function deleteProduct() {
    var edit_wala_prodId = localStorage.getItem("edit_product_id");
    db.collection("advertise").doc(edit_wala_prodId).delete()
        .then(() => {
            console.log('Product deleted')
        })
        .catch((error) => {
            console.log(error.message)
        })
}


function goToEditPage(id) {
    window.location = "/src/pages/editproduct.html#" + id;
}

function loadEditPage(index) {
    let href = window.location.href;
    let id = href.slice(href.indexOf("#") + 1);
    let products = JSON.parse(localStorage.getItem("products"));

    let product = products.filter(value => value.id === id)[0];

    let myform = document.getElementById("myform");

    myform.innerHTML = `
    <table class="table">
    <tr>
        <td>
            <label>Product Name</label>
        </td>
        <td>
            <input type="text" class="form-control" id="productname" value="${product.productname}" required/>
        </td>                            
    </tr>
   
    <tr>
        <td> <label >Category*</label></td>
        <td>
            <select class="form-control" id="product_categoty" required>
                <option value="Women’s" ${product.category === "Women’s" ? "selected" : ""} >Women’s</option>
                <option value="Men’s"   ${product.category === "Men’s" ? "selected" : ""}  >Men’s</option>    
                <option value="Kid’s"   ${product.category === "Kid’s" ? "selected" : ""}>Kid’s</option>
                <option value="Toddler" ${product.category === "Toddler" ? "selected" : ""}>Toddler</option>
                <option value="Others" ${product.category === "Others" ? "selected" : ""} >Others</option>              
            </select>
        </td>
    </tr>
    <tr>
        <td><label>Conditions*</label></td>
        <td>
            <select class="form-control" id="product_condition" required>
                <option value="New"  ${product.condition === "New" ? "selected" : ""}>New</option>
                <option value="Used" ${product.condition === "Used" ? "selected" : ""}>Used</option>
            </select>
        </td>
    </tr>
     <tr>
        <td><label>Price*</label></td>
        <td>
            <input type="number" class="form-control" id="price" value="${product.price}" required/>
        </td>
    </tr>
    <tr>
            <td> <label >Product Description*</label></td>
            <td>
                <textarea cols="30" rows="10" class="form-control" placeholder="Include the brand, model, age and any included accessories." id="product_description" required>${product.description}</textarea>
            </td>
    </tr>
        <tr>
        <td> <label for="">Uploaded Photos</label></td>
        <td> <img src="${product.url}" id="uploaded_photo"/ > </td>
    </tr>
    <tr>
        <td> <label for="">Upload Photos</label></td>
        <td><input type="file" class="form-control" id="product_photo"> </td>
    </tr>
</table>
<hr>
<button class="form-control btn btn" style="background-color: #1185f8!important;" onclick="editProduct('${product.id}')"><b>SAVE</b></button>
    `

}

async function editProduct(id) {

    var file = document.getElementById("product_photo").files[0];

    var category = document.getElementById("product_categoty").value;
    var condition = document.getElementById('product_condition').value;
    var price = document.getElementById("price").value;
    var description = document.getElementById("product_description").value;
    var productname = document.getElementById("productname").value;

    console.log({
        file,
        category,
        condition,
        price,
        description,
        productname,
        id
    })

    if (file) {
        if (category && condition && price && description && productname) {
            UploadImage()
                .then((url) => {
                    db
                        .collection("advertise")
                        .doc(id)
                        .update({

                            category,
                            condition,
                            price,
                            description,
                            productname,
                            url
                        })
                        .then(function (resp) {
                            swal("Your Ads successfully edited!", "success");
                            document.getElementById('myform').reset();
                        })
                        .catch((error) => {

                            swal("Error!", "" + error.message + "", "error");
                        })
                });
        }
        else {
            swal("Attention!", "Some field is empty", "warning");
        }
    }
    else {
        db
            .collection("advertise")
            .doc(id)
            .update({
                category,
                condition,
                price,
                description,
                productname
            })
            .then(function (resp) {
                swal("Good job!", "Your Ads successfully submitted!", "success");
                document.getElementById('myform').reset();
            })
            .catch((error) => {

                swal("Error!", "" + error.message + "", "error");
            })
    }
}





//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////Search Ads
/////////////////////////////////////////////////////////////////////////////////

function Search() {
    var search_text = document.getElementById("search_text").value;
    var pagination = document.getElementById('pagination');

    if (search_text != "" && search_text != " ") {
        search_text = search_text.toLowerCase();
        var ads_card = document.getElementById('ads_card');

        db.collection("advertise")
        .where("status", "==", true)
            .get()
            .then((querySnapshot) => {
                console.log("querySnapshot", querySnapshot)
                var arr = [];

                querySnapshot.forEach(function (doc) {
                     console.log("ss",doc.data().title);
                    if (doc.data().productname.toLowerCase().indexOf(search_text) >= 0 || doc.data().category.toLowerCase().indexOf(search_text) >= 0)
                        arr.push({ id: doc.id, data: doc.data() });
                })

                console.log("arr", arr.length);

                if(arr.length)
                {
                localStorage.setItem("current_search_data", JSON.stringify(arr));

                ads_card.innerHTML = `
                <div class="parent card-deck">
                ${ arr.slice(start, pageLimit).map((doc) => {
                    return (`
                        <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                            <div>
                                <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                            </div>
                            <hr>
                            <div class="card-body">
                                <h5 class="card-title">${doc.data.price}</h5>
                                <p class="card-text">${doc.data.productname}</p>
                            </div>
                        </div>`)
                }).join('')}
                <div>
                ` }
                    else{
                        swal("! NOT FOUND", "Product Not Foumd", "error");
                    }

                pagination.innerHTML = `
                ${ arr.slice(start, Math.ceil(arr.length / pageLimit)).map((doc, index) =>{
                    return (
                    `<li class="page-item" onClick={paginationForSearch('${index}')}><p class="page-link">${index + 1}</p></li>`
                    )
                }).join('')}`

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }
    else {
        swal("Opps", "SearchBox is emply", "error");
    }
}

function SearchAdsByCategory(category) {
    var ads_card = document.getElementById('ads_card');
    var pagination = document.getElementById('pagination');
    var b; 

    db.collection("advertise").where("category", "==", category).where("status", "==", true).get()
        .then((querySnapshot) => {
            console.log("querySnapshot", querySnapshot)
             arr = [];
            querySnapshot.forEach(function (doc) {
                arr.push({ id: doc.id, data: doc.data() });
            })

            b  = arr.length;

            if(b !== 0)
            {

            localStorage.setItem("current_search_data", JSON.stringify(arr));

            ads_card.innerHTML = `
            <div class="parent card-deck">
            ${
                arr.slice(start, pageLimit).map((doc) => {
                return (`
                    <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                        <div>
                            <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                        </div>
                        <hr>
                        <div class="card-body">
                            <h5 class="card-title">${doc.data.price}</h5>
                            <p class="card-text">${doc.data.productname}</p>
                        </div>
                    </div>`)
            }).join('')}
            <div>
            `
            pagination.innerHTML = `
            ${ arr.slice(start, Math.ceil(arr.length / pageLimit)).map((doc, index) =>{
                return (
                `<li class="page-item" onClick={paginationForSearch('${index}')}><p class="page-link">${index + 1}</p></li>`
                )
            }).join('')}`

        }
        else{
            swal("! NOT FOUND", "Product Not found", "error");
        }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}


function SearchAdsByPrice(params) {
    var ads_card = document.getElementById('ads_card');
    var pagination = document.getElementById('pagination');
    var a ;
    

    console.log(params);

    db
    .collection("advertise")
    .where("price", ">=", params.min)
    .where("price", "<", params.max)
    .where("status", "==", true)
    .get()
        .then((querySnapshot) => {
            console.log("querySnapshot", querySnapshot)
            var arr = [];
            querySnapshot.forEach(function (doc) {
                arr.push({ id: doc.id, data: doc.data() });
            })

            console.log("arr", arr)

            a = arr.length;

            if(a !== 0)
            {

            localStorage.setItem("current_search_data", JSON.stringify(arr));

            ads_card.innerHTML = `
            <div class="parent card-deck">
            ${ arr.slice(start, pageLimit).map((doc) => {
                return (`
                    <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                        <div>
                            <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                        </div>
                        <hr>
                        <div class="card-body">
                            <h5 class="card-title">${doc.data.price}</h5>
                            <p class="card-text">${doc.data.productname}</p>
                        </div>
                    </div>`)
            }).join('')}
            <div>
            `
            pagination.innerHTML = `
            ${ arr.slice(start, Math.ceil(arr.length / pageLimit)).map((doc, index) =>{
                return (
                `<li class="page-item" onClick={paginationForSearch('${index}')}><p class="page-link">${index + 1}</p></li>`
                )
            }).join('')}`
          }
          else
          {
            swal("! NOT FOUND", "Product Not found", "error");
          }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////Show Ads
////////////////////////////////////////////////////////////////////////////////

function ShowAds(current_ads_id) {
    localStorage.setItem('current_ads_id', JSON.stringify(current_ads_id));
    window.location.assign('/src/pages/show_ads.html');
}

function RenderAds() {
    let current_ads_id = JSON.parse(localStorage.getItem('current_ads_id'));
    let current_search_data = JSON.parse(localStorage.getItem('current_search_data')).filter(value => {
        return value.id == current_ads_id
    });

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    localStorage.setItem('ads_owner', JSON.stringify(current_search_data[0].data.uid))

    if(current_search_data[0].data.phonenumber)
    {

    }
    else{
        current_search_data[0].data.phonenumber = "Not Avialable";
    }

    console.log('current_search_data[0].data', current_search_data[0].data)
    let render_ads = document.getElementById('render_ads');
    render_ads.innerHTML = `
        <div class="row ">
            <div class="col-md-8 border">
            <div class="p-3 border">
                    <img src="${current_search_data[0].data.url}" class="img-fluid">
            </div>
            <div class="p-3 border" style="padding: 10px;">
                <table class="table">
                    <tr>
                        <td><h4>DETAILS</h4></td>
                    </tr>
                </table>
                <table class="table border-buttom">
                    <tr>
                        <td>Brand</td>
                        <td>${current_search_data[0].data.category}</td>
                    </tr>
                    <tr>
                        <td>Ads Name</td>
                        <td>${current_search_data[0].data.productname}</td>
                    </tr>
                    <tr>
                        <td>Condition</td>
                        <td>${current_search_data[0].data.condition}</td>
                    </tr>
                </table>
                <hr>
                <h4>DESCRIPTION</h4>
                <h6>${current_search_data[0].data.description}</h6>
            </div>
            </div>
            <div class="col-md-4 border">
            <div class="border mt-3 p-3">
                <h3>Rs: ${current_search_data[0].data.price}</h3>
                <h5>${current_search_data[0].data.productname}</h5>
                    <br>
                    <p>Phone no: ${current_search_data[0].data.phonenumber}</p>
                    <p>Address: ${current_search_data[0].data.address}</p>
            </div>
            <div class="border mt-3 p-3 seller_dec">
                <h3>Seller description</h3>
                <h6 class="m-3">${current_search_data[0].data.owner_name}</h6>
              </div> 
            </div>
        </div>
    `
}


function MyAds() {

    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    var ads_card = document.getElementById('ads_card');

    db.collection("advertise").where("uid", "==", currentUser.uid)
        .get()
        .then((querySnapshot) => {
            console.log("querySnapshot", querySnapshot)
            var arr = [];
            querySnapshot.forEach(function (doc) {
                arr.push({ id: doc.id, data: doc.data() });
            })

            console.log("arr", arr)

            localStorage.setItem("current_search_data", JSON.stringify(arr));

            ads_card.innerHTML = `
            <div class="parent card-deck">
            ${ arr.map((doc) => {
                return (`
                    <div class="child card mt-5" onclick="ShowAds('${doc.id}')">
                        <div>
                            <img class="card-img-top" height = "180px" src="${doc.data.url}" />
                        </div>
                        <hr>
                        <div class="card-body">
                            <h5 class="card-title">${doc.data.price}</h5>
                            <p class="card-text">${doc.data.productname}</p>
                        </div>
                    </div>`)
            }).join('')}
            <div>
            `
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}
