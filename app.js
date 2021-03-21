//jshint:esversion6

//imports

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
var session = require("express-session");
var path = require("path");
const _ = require("lodash");
const multer = require("multer");
var Cart = require("./models/cart");
var fs = require("fs");
var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs");
(port = process.argv[2] || 8888),
  (mimeTypes = {
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    json: "application/json",
    js: "text/javascript",
    css: "text/css",
  });

const storage = multer.diskStorage({
  destination: path.join(__dirname + "/public/uploaded_images"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

app.use(express.static(path.join(__dirname + "/public")));

const { createPool } = require("mysql");
const { POINT_CONVERSION_COMPRESSED } = require("constants");
const { Console } = require("console");
const { each } = require("jquery");

//                                                     define variable

// var account = "Account";
currentUser = "Account";
var name;
var uid;
var sid;

var shop="Become a Seller!" ;

//                                                     create connection

var con = createPool({
  host: "127.0.0.1",
  user: "new_user",
  password: "sarahf0205",
  database: "manell",
  connectionLimit: 10,
  port: 3306,
});

//                                                      FOR  LOGIN

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (request, response, next) {
  response.locals.session = request.session;
  //  request.session.currentUser=currentUser;
  //  request.session.shop=shop;
  response.locals.shop = request.session.shop;
  response.locals.currentUser = request.session.currentUser;

  next();
});

//                                                    getting the pages

app.listen(3000, function () {
  console.log("server started on port 3000");
});
//                                                       VIEW PROD

app.get("/viewproduct/:test", function (req, res) {
  var name = [];
  var price = [];
  var picture = [];
  var pic;
  var product = [];
  var id = [];
  var par = _.lowerCase(req.params.test);

  con.query(
    "select * from product_detail where prod_cat=( select idCategories from categories where name=?);",
    [par],
    function (err, results, fields) {
      if (err) {
        throw err;
        console.log(err);
      } else {
        for (i = 0; i < results.length; i++) {
          picture.push("/public/uploaded_images/" + results[i].img);
          //   name.push(results[i].name);
          //   id.push(results[i].pid)
          //   price.push(results[i].price);
          //   console.log(results[i].img);

          //
        }
        res.render("viewprod", { product: results, picture: picture });
      }
    }
  );
});

//                                                        HOME PAGE

app.get("/", function (req, res) {
  console.log(currentUser);
  

res.render("login");

});

//                                          LOGOUT



app.get("/logout", function (req, res) {
  if (req.session.currentUser != "Account") {
    req.session.shop = "Become a Seller";
    req.session.currentUser = "Account";
    res.redirect("/");
  }
});

//                                                     CART
app.get("/cart", function (req, res) {
  res.render("cart");
});

//                           login page

app.get("/acc", function (req, res) {
  res.render("acc");
});

app.get("/home", function (req, res) {
  res.render("home");
});

//                                                   add product page

app.get("/product", function (req, res) {
  console.log(req.session.shop)
  res.render("product");
});

//                                                   register shop page

app.get("/shop", function (req, res) {
  res.render("shop");
});

//                                                         POST PAGES

//                                                         login page

app.post("/auth", function (request, response) {
  var email = request.body.email;
  var password = request.body.pass;
  if (email && password) {
    con.query(
      "SELECT * FROM user WHERE Email= ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          
          
      
          
          uid = results[0].U_id;

          con.query(
            "select shop_name from shop_shop where sid=(select shop_id from shop_user where user_id=?)",[uid],
            function (err, results, field) {
              if (results.length > 0) {
                shop=results[0].shop_name;
                request.session.shop=results[0].shop_name;
                // console.log(request.session.shop);
                // request.session.shop =shop;
               
              } 
                else{
                  console.log(err);
                  shop="Become a seller";
                  request.session.shop = "Become a seller";

                }
              
              
              }
            
          );
          request.session.currentUser = results[0].Name;
        

          response.render("home", {
            currentUser: results[0].Name,
            shop: shop,
          });
         
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

//                                                                              SHOP PAGE

app.post("/shop", function (req, res) {
  var shop = req.body.name;
  var sql = "call insert_data_shop(?, ?)";

  con.query(sql, [shop, uid], function (err, data) {
    if (err) {
      throw err;
      console.log(err);
    }
  });

  res.redirect("/product");
});

//                                                                        REGISTER PRODUCTS

app.post("/product", function (req, res) {
  const upload = multer({
    storage: storage,
  }).single("photo");

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      var pic = req.file.filename;
      var name = req.body.productname;
      var desc = req.body.desc;
      var photo = pic;
      var category = req.body.category;
      var price = req.body.price;
      var cat;

      var sql1 = "select idCategories from categories where name = ?";

      con.query(sql1, [category], function (err, results, fields) {
        if (err) {
          throw err;
          console.log(err);
        } else {
          cat = results[0].idCategories;
          console.log("helo");
          con.query(
            `INSERT INTO product_detail (name, description, img, prod_cat, price ) VALUES ('${name}', '${desc}','${pic}','${cat}','${price}' )`,
            function (err, results, fields) {
              if (err) {
                throw err;
                console.log(err);
              }

              var sql = "call insert_shop_product(?)";
              // con.query(sql, [uid], function (err, data) {
              //   if (err) {
              //     throw err;
              //     console.log(err);
              //   }
              // });
            }
          );
        }
      });
    }
  });
  res.redirect("product");
});

//                                                          CART


app.post("/cart", function (req, res) {
  var price, pid, incart, name;


  var created = new Date().toISOString().slice(0, 19).replace("T", " ");

  var cartitems = req.body.cartitems;

  for (i = 0; i < cartitems.length; i++) {
    incart = parseInt(cartitems[i].incart);
    price = parseInt(cartitems[i].price);
    price = incart * price;
    pid = parseInt(cartitems[i].pid);
    name = cartitems[i].name;

    con.query(
      `INSERT INTO order_details (uid,pid,date,name,qty,price) VALUES ('${uid}', '${pid}','${created}','${name}','${incart}' ,'${price}')`,
      function (err, results, field) {
        if (err) {
          throw err;
          console.log(err);
        }
        console.log(results);
      }
    );
  }
res.rendirect("/home");

});

//                                                             HISTORY
app.get("/hist",function(req,res){
  var total;
  con.query("select * from order_details where uid=?",[uid],function(err,results,fields){




    res.render("history",{hist:results});
  })
  
})






//                                                             RESGITER YOURSELF

app.post("/acc", function (req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  var pass = req.body.pass;
  var city = req.body.city;
  var country = req.body.country;
  var email = req.body.email;

  var sql = `INSERT INTO user (Name, Phone, password, Country, city,  Email ) VALUES ('${name}', '${phone}','${pass}','${country}','${city}',  '${email}' )`;
  con.query(sql, function (err, data) {
    if (err) throw err;
    console.log(err);
  });
  res.redirect("/");
});

