
$(document).ready(function () {

    getProductLists();
    document.getElementById('modalSubmit').addEventListener('click', modalSubmit);

    function modalSubmit(e) {
        let id = randomNumberID();
        let productName = document.getElementById('productName').value;
        let productDescription = document.getElementById('productDescription').value;
        let imageData = document.getElementById('carImage').toDataURL('image/jpeg');

        if (productName !== '' && productDescription !== '' && imageData !== '') {
            let newProduct = {
                id: id,
                name: productName.toUpperCase(),
                image: imageData,
                description: productDescription
            };

            //Add new product to localStorage. The localStorage key for all the product is productList'
            if (localStorage.getItem("productList") === null || localStorage.getItem("productList") === []
                || localStorage.getItem("productList") === undefined) {
                let productList = [];
                productList.push(newProduct);
                localStorage.setItem("productList", JSON.stringify(productList));
            } else {
                let productList = JSON.parse(localStorage.getItem("productList"));
                productList.push(newProduct);
                localStorage.setItem("productList", JSON.stringify(productList));
            }
        } else {
            alert('All fields are required. Please check your entries again');
        }
        getProductLists();
        resetForm();
        e.preventDefault();
    }

});

//generate unique Id
function randomNumberID() {
    return Math.floor(Math.random() * (1000002 - 1 + 1)) + 1;
}

//get the data stored in the localStorage for display on load
function getProductLists() {
    if (localStorage.getItem("productList") === null) {
      //  setCarsCounter(0);
        alert("Use the add button to add new classic cars.");

    } else {

        let productList = JSON.parse(localStorage.getItem("productList"));

        // This sort element when use function dragable to sort cars
        $("#productDisplay").sortable({
            stop : function(event, ui){
                let sortedIds = $(this).sortable( "toArray", { key: "set_" } );
                let productListSorted = [];
                for (let i = 0; i < sortedIds.length; i++){
                    for (let j = 0; j < sortedIds.length; j++){
                        if(productList[j].id == sortedIds[i]){
                            productListSorted.push(productList[j]);
                            //console.log (sorted[i]) ;
                        }
                    }
                }
                localStorage.setItem("productList", JSON.stringify(productListSorted));

            }
        });
       //  $("#productDisplay").disableSelection();

        let productDisplay = document.getElementById('productDisplay');

        //Display elements stores
        productDisplay.innerHTML = '';

        for (let i = 0; i < productList.length; i++) {

            let id = productList[i].id;
            let name = productList[i].name;
            let description = productList[i].description;
            let img =  productList[i].image;

            productDisplay.innerHTML += '' +
             '<li id="'+ id + '" class="list-group-item">' +
                '<div class="container"> ' +
                    '<div class="row"> '+
                        '<div class="col-4"> ' +
                            '<img class="imgCar" src="' + img + '"> ' +
                        '</div> ' +
                        '<div class="col-4"> ' +
                            '<span>' + description + '</span>' +
                         '</div>' +
                        '<div class="col-4"> ' +
                            '<button type="button" class="btn btn-success" onclick="editProduct(\'' + id + '\')" data-toggle="modal" data-target="#addNewProductModal">Edit</button>' +
                            '<button type="button" class="btn btn-danger"  onclick="deleteProduct(\'' + id + '\')">Delete</button>' +
                        '</div>' +
                     '</div>' +
                 '</div>'  +
            '</li>';

        }
        setCarsCounter(productList.length);
    }
}

//Add element
function addProduct(id) {

    let productName = document.getElementById('productName').value;
    let productDescription = document.getElementById('productDescription').value;
    let imageData = document.getElementById('carImage').toDataURL('image/jpeg');

    let productList = JSON.parse(localStorage.getItem("productList"));

    if (productName !== '' && productDescription !== '') {
        let newProduct = {
            id: id,
            name: productName.toUpperCase(),
            image: imageData,
            description: productDescription
        };
        //get position in grid
        for (let i = 0; i < productList.length; i++) {

            if (productList[i].id == id) {
                productList.splice(i, 1, newProduct);
            }
        }

        if (localStorage.getItem("productList") === null || localStorage.getItem("productList") === [] || localStorage.getItem("productList") === undefined) {
            let productList = [];
            //productList.push(newProduct);
            localStorage.setItem("productList", JSON.stringify(productList));
        } else {
           // let productList = JSON.parse(localStorage.getItem("productList"));
         //   productList.push(newProduct);
            localStorage.setItem("productList", JSON.stringify(productList));
        }
    }
}

// Editing a Car
function editProduct(id) {
    "use strict";
    document.getElementById('modalSubmit').style.display = "none";
    document.getElementById("addNewProductModalLabel").textContent = "Edit Car";

    let parentDiv = document.getElementById('modalFooter');
    let productList = JSON.parse(localStorage.getItem("productList"));


    if (parentDiv.contains(document.getElementById("editButton"))) {
        document.getElementById('editButton').remove();
    }
    let editButton = document.createElement('button');
    editButton.id = "editButton";
    editButton.className = "fa fa-hdd-o btn btn-outline-primary btn-sm m-2";
    editButton.textContent = " Save data";
    parentDiv.appendChild(editButton);

    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == id) {
            document.getElementById("productName").value = productList[i].name;
            document.getElementById("productDescription").value = productList[i].description;
            setCanvas(productList[i].image)

        }
    }

    document.getElementById("editButton").addEventListener("click", function () {

		//localStorage.setItem("productList", JSON.stringify(productList));
		addProduct(id);        
        getProductLists();
        resetForm();
        document.getElementById("editButton").style.display = "none";
        $(".addNewProduct").on('click', productFormReset());

    });

}

// deleting any element.
function deleteProduct(id) {
    let productList = JSON.parse(localStorage.getItem("productList"));
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == id) {
            productList.splice(i, 1);
            //console.log(result);
        }
    }
    localStorage.setItem("productList", JSON.stringify(productList)); //reset the values in the local storage
    getProductLists(); // to quickly display what is remaining from local storage.
}

function resetForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById('carInput').value  = "";
	clearCanvas();
   // document.getElementById('canvasImg').src  = "";

}

function productFormReset() {
    document.getElementById('modalSubmit').style.display = "block";
    document.getElementById("addNewProductModalLabel").textContent = "New Product Form";
    document.getElementById('editButton').style.display = "none";
	resetForm();
}


// counts cars quantity
function setCarsCounter(counter) {
    document.getElementById("counter").textContent = counter;
}

//Remove Canvas Img after add Car
function clearCanvas(){
	
	let canvas = document.getElementById('carImage');
	let context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}


function setCanvas(imagenData){

   // let ctx = document.getElementById('carImage').getContext('2d');
	
	let myCanvas = document.getElementById('carImage');
    let ctx = myCanvas.getContext('2d');
	
    let img = new Image();
    img.src = imagenData;
    img.onload = function () {
		
		myCanvas.width = 320;
        myCanvas.height = 320;
        ctx.drawImage(img, 0, 0);
		
       
    }
}

function readURL() {

    let myCanvas = document.getElementById('carImage');
    let ctx = myCanvas.getContext('2d');
    let img = new Image();

    img.onload = function(){
       
	   myCanvas.width = 320;
       myCanvas.height = 320;
       ctx.drawImage(img, 0, 0);

        //   console.log(myCanvas.toDataURL('image/jpeg'));
    };
    img.src = URL.createObjectURL(event.target.files[0]);
}



function render(src){
	var MAX_HEIGHT = 320;
	var image = new Image();
	image.onload = function(){
		var canvas = document.getElementById("carImage");
		if(image.height > MAX_HEIGHT) {
			image.width *= MAX_HEIGHT / image.height;
			image.height = MAX_HEIGHT;
		}
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.width = image.width;
		canvas.height = image.height;
		ctx.drawImage(image, 0, 0, image.width, image.height);
	};
	image.src = URL.createObjectURL(event.target.files[0]);
}



$("#carInput").change(function(){
	//render();
    readURL(this);
})

//MaxCachacter TextBox Area
function minmax(value, min, max)
{
    if(parseInt(value) < min || isNaN(parseInt(value)))
        return min;
    else if(parseInt(value) > max)
        return max;
    else return value;
}


