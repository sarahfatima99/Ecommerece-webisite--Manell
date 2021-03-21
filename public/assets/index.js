// let carts = document.querySelectorAll('.add-cart');

// let products = [



//   {
//     name:"food1",
//     pid:1,
//     price:200,
//     incart:0
//   },
//   {
//     name:"food1",
//     pid:1,
//     price:200,
//     incart:0.
//   },  {
//     name:"food1",
//     pid:1,
//     price:200,
//     incart:0.
//   }
  
// ];



// function setSize(product,sizu){
//     let cartitems = localStorage.getItem('productsincart');
//     cartitems =JSON.parse(cartitems);
//     if(cartitems != null){
//       if(cartitems[product.id] != undefined)
//       {
//          cartitems[product.id].size=sizu;
//       }
// console.log(cartitems[product.id]);

       
//     }
//          localStorage.setItem("productsincart",JSON.stringify(cartitems));

 
// }


// here we are
// for (let i=0; i < carts.length; i++){
//   carts[i].addEventListener('click', (ev) => {
// id= ev.target.getAttribute("id");

// for(let i=0;i<products.length;i++){
//     if(products[i].id==id){
//         product=products[i];
//        console.log(product);
//     }
    
// } 
//  cartnumbers(product);
//  totalcost(product); 
//   })
// }




// function onload(){
//   let productnumbers = localStorage.getItem('cartnumbers');
//   if(productnumbers){
//     // document.querySelector('.cart span').textContent = 
     
//   }
// }


//affect cart numbers
  // function cartnumbers(product)
  // {
    
  //   let productnumbers = localStorage.getItem('cartnumbers');
  //   productnumbers = parseInt(productnumbers);
  //   if( productnumbers)
  //   {
  //     localStorage.setItem('cartnumbers', productnumbers + 1);
  //     document.querySelector('.cart span').textContent =  productnumbers + 1;
  //   }
  //   else{
  //     localStorage.setItem('cartnumbers', 1);
  //     document.querySelector('.cart span').textContent = 1;
  //   }
  //  setitems(product);
  // }



  function setitems(product){
    let cartitems = localStorage.getItem('productsincart');
 
    cartitems =JSON.parse(cartitems);



    if(cartitems != null){
      
      if(cartitems[product.pid] == undefined)
      {
        cartitems = {
        ...cartitems,
        [product.pid]:product
        }
      }

      cartitems[product.pid].incart += 1;
    }
    else{
      product.incart = 1;
      cartitems = {
        [product.pid]:product
      }
    }
    
    
        localStorage.setItem("productsincart",JSON.stringify(cartitems));
        
      
  }

  function loadDoc(pid){

    console.log(document.getElementById(pid).children);
    var productChildren = document.getElementById(pid).children;
    var products = {
      pid:pid,
      name:productChildren[1].innerHTML,
      price:productChildren[2].children[0].innerHTML,
      incart:0
      //  img:productChildren[0].children[0].innerHTML
      
    }
     console.log(products);
    setitems(products);
    totalcost(products);
  
  }


function totalcost(product){
  console.log("price=",product.price);

  price=parseInt(product.price);
 // console.log("cartcost=",cartcost);
 // console.log(typeof cartcost );
 if(price!=0){
  let cartcost = localStorage.getItem('totalcost');
  // console.log("yoo",cartcost)
  if(cartcost!=null){

    cartcost = parseInt(cartcost);
    price=parseInt(product.price);
    console.log(cartcost);

    localStorage.setItem("totalcost",cartcost +price);
  }
  else{
  localStorage.setItem("totalcost",price);
  }}
}
//display products in cart page
function displaycart(){

let cartitems = localStorage.getItem("productsincart");
cartitems = JSON.parse(cartitems);
console.log("yoo1",cartitems);
  
let productcontainer = document.querySelector(".products");
let cartcost = localStorage.getItem('totalcost');
if (cartitems !=null && productcontainer!=null){
  productcontainer.innerHTML ='';

  Object.values(cartitems).map(item => {
    
  

    console.log("helloo");
    console.log("itemm",item.price); 


       if(item.price!==null || item.price!==undefined){
    productcontainer.innerHTML += `
    <div class="product">
      <ion-icon class="rem" name="close-circle"></ion-icon>
      
      <span>${item.name}</span>
      </div>
        <div class="price">
      
        Rs${item.price}</div>
       <div class="quantity">
       <ion-icon class='backin' name="chevron-back-outline"></ion-icon>
       <span>${item.incart}</span>
       <ion-icon class='forward' name="chevron-forward-outline"></ion-icon>
       </div>
     
       <div class="total">
       Rs${item.incart * item.price}
       .00
       </div>

    `
  }});
  productcontainer.innerHTML += `
  <div class="baskettotalcontainer">
  <h4 class="baskettotaltitle">
  basket total
  </h4>
  <h4 class="baskettotal">
  Rs${cartcost}.00
  </h4>
  `
}
    let carts_plus = document.querySelectorAll('.forward');

    for (let i=0; i < carts_plus.length; i++){
     carts_plus[i].addEventListener('click', (ev) => {
     setitems(Object.values(cartitems)[i]);
     totalcost(Object.values(cartitems)[i]);
      displaycart();
     })
   }
    
    let carts_minus = document.querySelectorAll('.backin');
      for (let i=0; i < carts_minus.length; i++){
     carts_minus[i].addEventListener('click', (ev) => {
     ev.target.disabled =true;
     setitems_minus(Object.values(cartitems)[i]);
     totalcost_minus(Object.values(cartitems)[i]);
         displaycart();
     })
   }
    
let carts_delete = document.querySelectorAll('.rem');
      for (let i=0; i < carts_delete.length; i++){
     carts_delete[i].addEventListener('click', (ev) => {
     ev.target.disabled =true;
     setitems_minus_delete(Object.values(cartitems)[i]);
     totalcost_delete(Object.values(cartitems)[i]);
      displaycart();
     })
   }
    
let changed = document.querySelectorAll('select[name="size"]');
 for (let i=0; i < changed.length; i++){
     changed[i].addEventListener('change', (ev) => {
     setSize(Object.values(cartitems)[i],ev.target.value);
      displaycart();
     })
   }  

}


    


//affect cart numbers
  function setitems_minus_delete(product)
  {
    
    let productnumbers = localStorage.getItem('setitems');
    productnumbers = parseInt(productnumbers);
    if( productnumbers && productnumbers >0)
    {
      localStorage.setItem('setitems', productnumbers - product.incart);
      document.querySelector('.cart span').textContent =  productnumbers - product.incart;
    }
    else{
      localStorage.setItem('setitems', 0);
      document.querySelector('.cart span').textContent = 0;
    }
   setitems_delete(product);
  }


function totalcost_delete(product){
  let cartcost = localStorage.getItem('totalcost');
  if(cartcost != null){
    cartcost = parseInt(cartcost);
    localStorage.setItem("totalcost",cartcost -  (product.incart*product.price));
  }
  else{
     
     localStorage.setItem("totalcost",0);

        
 
  }
}


 function setitems_delete(product){
    let cartitems = localStorage.getItem('productsincart');
    cartitems =JSON.parse(cartitems);
    if(cartitems != null){
      if(cartitems[product.pid != undefined])
      {
      delete cartitems[product.pid] ;
      }


       
    }
         localStorage.setItem("productsincart",JSON.stringify(cartitems));

 }




function totalcost_minus(product){
  let cartcost = localStorage.getItem('totalcost');
  if(cartcost != null){
    cartcost = parseInt(cartcost);
    localStorage.setItem("totalcost",cartcost - product.price);
  }
  else{
     
     localStorage.setItem("totalcost",0);

        
 
  }
}

  function setitems_minus(product){
    
    let cartitems = localStorage.getItem('productsincart');
    cartitems =JSON.parse(cartitems);
    console.log(cartitems[product.pid].incart);
    if(cartitems != null){
      if(cartitems[product.pid] != undefined)
      {
      cartitems[product.pid].incart -= 1;
      }


        if(cartitems[product.pid].incart==0){
            delete cartitems[product.pid] ;
        }
    }
  
    
    
   
    localStorage.setItem("productsincart",JSON.stringify(cartitems));
  
      
  }






displaycart();



  $('.addbtn').click(function(){  
    let cartitems = localStorage.getItem('productsincart');
 
    cartitems =JSON.parse(cartitems)

       var task = cartitems;
       console.log(task);
  
      $.ajax({  
         url:'/cart',  
         method:'post',  
         dataType:'json',  
         data:{'cartitems':cartitems}, 
          
         success:function(response){  
             if(response.msg=='success'){  
             alert('task added successfully');  
             getdata();  
             $('#task').val('')  
             }
         },  
        
     });  
  });  
 
