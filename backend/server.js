const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/admin.html`));
});

app.get("/orders", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/order.html`));
});

app.use("/img", express.static(`${__dirname}/data/img`));

app.use("/public", express.static(`${__dirname}/../frontend/public`));


app.get('/order', (req, res) => {
  let directory = `${__dirname}/data/orders`

  let fileNames = []
  let filesDatas = []

  fs.readdir(directory, (err, files) => {
    if(err) {
      console.log(err)
    } else {
      let file = files

      for(let item of file) {
        let fileDate = item.slice(13)
        fileNames.push(fileDate)
      }
    }
  
    for(let i = 0; i < fileNames.length; i++) {
      const data = fs.readFileSync(`${__dirname}/data/orders/pizzas-order-${fileNames[i]}`)

      filesDatas.push(JSON.parse(data))
    }
    res.send(filesDatas)
  })
})

app.get("/pizza", (req, res) => {
  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if (err) {
      console.log("hiba:", err);
      res.status(500).send("hibavan");
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

app.post("/", (req, res) => {
  let orderData = JSON.stringify(req.body);
  let currentDate = Date.now();
  let filePath = `${__dirname}/data/orders/pizzas-order-${currentDate}.json`;
  fs.writeFile(filePath, orderData, (err) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send({ response: "done" });
    }
  });
});

app.post("/admin-img", function (req, res) {
  const files = req.files;
  console.log(files);
  
  Object.keys(files).forEach((key) => {
    const filepath = path.join(`${__dirname}/data/img`, files[key].name);
    console.log(filepath)
    files[key].mv(filepath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err });
    });
  });

  return res.json({
    status: "success",
    message: Object.keys(files).toString(),
  });
});

app.post("/admin", (req, res) => {
  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if (err) {
      console.log("hiba:", err);
      res.status(500).send("hibavan");
    } else {
      let pizzas = JSON.parse(data);

      let lastItem = pizzas[pizzas.length - 1];
      let lastItemId = parseInt(lastItem.id);

      let newPizza = {
        id: (lastItemId + 1).toString(),
        name: req.body.name,
        ingredients: req.body.ingredients.split(", "),
        price: req.body.price,
        active: "true",
      };

      pizzas.push(newPizza);

      fs.writeFile(
        `${__dirname}/data/pizza.json`,
        JSON.stringify(pizzas, null, 4),
        (err) => {
          if (err) {
            return res.send(err);
          } else {
            return res.json(newPizza);
          }
        }
      );
    }
  });
});

app.delete("/admin/del/:id", (req, res) => {
  let delPizzaId = req.params.id;
  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let pizzas = JSON.parse(data);

      let delPizza = pizzas.find((el) => el.id === delPizzaId);

      if (delPizza !== undefined) {
        let index = pizzas.indexOf(delPizza);
        pizzas.splice(index, 1);
      } else {
        console.log("hiba");
        return res.status(500).send("This pizza does not exist!");
      }

      fs.writeFile(
        `${__dirname}/data/pizza.json`,
        JSON.stringify(pizzas, null, 4),
        (error) => {
          if (error) {
            console.log(error);
          } else {
            return res.send("ok");
          }
        }
      );
    }
  });
});

app.get("/admin/:id", (req, res) => {
  let selPizzaId = req.params.id;
  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let pizzas = JSON.parse(data);

      let selPizza = pizzas.find((el) => el.id === selPizzaId);
      return res.send(selPizza);
    }
  });
});

app.put("/admin/modify/:id", (req, res) => {
  let modPizzaId = req.params.id;
  let changes = req.body;

  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let pizzas = JSON.parse(data);

      let index = pizzas.findIndex((pizza) => pizza.id === modPizzaId);

      if (index !== -1) {
        pizzas[index] = changes;
      } else {
        res.send("This pizza does not exist!");
      }

      fs.writeFile(
        `${__dirname}/data/pizza.json`,
        JSON.stringify(pizzas, null, 4),
        (error) => {
          if (error) {
            console.log(error);
          } else {
            res.send("ok");
          }
        }
      );
    }
  });
});

app.get('/order-number/:id', (req, res) => {
  let directory = `${__dirname}/data/orders`

  let currentNumber = parseInt(req.params.id)
  console.log(currentNumber)

  let fileNames = []
  let filesDatas = []

  fs.readdir(directory, (err, files) => {
    if(err) {
      console.log(err)
    } else {
      let file = files

      console.log(file)

      let ordersNumber = file.length

      console.log(ordersNumber)

      let minus = ordersNumber - currentNumber

      console.log(minus)

      if(minus === 0) {
        return res.send({answer: "ok"})
      }else {
        for(let i = currentNumber; i < file.length; i++) {
          let fileDate = file[i].slice(13)
          fileNames.push(fileDate)
        }
      }
    }
    console.log(fileNames)
    for(let i = 0; i < fileNames.length; i++) {
      const data = fs.readFileSync(`${__dirname}/data/orders/pizzas-order-${fileNames[i]}`)

      filesDatas.push(JSON.parse(data))
    }
    res.send(filesDatas)
  })
})

app.listen(2000, console.log("server listening on http://127.0.0.1:2000"));