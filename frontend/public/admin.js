const rootElement = document.querySelector("#root");
const addPizzaForm = document.querySelector(".add-pizza-form");
const menuC = document.querySelector(".c-menu");
const delPizzaForm = document.querySelector(".del-pizza-form");
const modifyPizza = document.querySelector(".modify");

const addPizzas = async () => {
  return fetch("/pizza")
    .then((data) => data.json())
    .then((pizzas) => {
      return pizzas;
    });
};

const pizzaComponent = (id, name, price, ingredients, active) => `
<div class="pizza">
    <div class="pizza-admin">
        <h1 class="id-text">- ${id} -</h1>
        <h1>Active: ${active}</h1> 
    </div>
    <hr>
    <h2>${name}</h2>
    <h5>${price} $</h5>
    <div class="pizza-pics">
        <img src="img/${name}.webp" alt="pizza">
    </div>
    <h3>${ingredients.join(" &#9679 ")}</h3>
</div>
`;

const elementBuilder = async () => {
  const data = await addPizzas();
  data.forEach((elem) => {
    menuC.insertAdjacentHTML(
      "beforeend",
      pizzaComponent(
        elem.id,
        elem.name,
        elem.price,
        elem.ingredients,
        elem.active
      )
    );
  });
};

const addNewPizza = async () => {
  const sendBtn = document.querySelector(".send-btn");
  sendBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(event);
    let nameInput = document.querySelector("#name").value;
    let ingInput = document.querySelector("#ingredients").value;
    let priceInput = document.querySelector("#price").value;
    let myFiles = document.querySelector('#myFiles').files
    console.log(myFiles)

    let newPizzaDatas = {
      name: nameInput,
      ingredients: ingInput,
      price: priceInput,
    };

    console.log(newPizzaDatas);

    await fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPizzaDatas),
    });

    const formData = new FormData()

    Object.keys(myFiles).forEach(key => {
        formData.append(myFiles.item(key).name, myFiles.item(key))
    })

    await fetch("/admin-img", {
      method: "POST",
      body: formData,
    });

    document.querySelector("#name").value = "";
    document.querySelector("#ingredients").value = "";
    document.querySelector("#price").value = "";
    menuC.innerHTML = "";
    document.querySelector('#myFiles').value = "";
    await elementBuilder();
  });
};

const delPizza = async () => {
  const delBtn = document.querySelector(".del-pizza");
  delBtn.addEventListener("click", async () => {
    let delInput = document.querySelector("#pizza-id").value;
    await fetch(`/admin/del/${delInput}`, {
      method: "DELETE",
    });

    document.querySelector("#pizza-id").value = "";
    menuC.innerHTML = "";
    await elementBuilder();
  });
};

const selectPizza = async () => {
  const selectBtn = document.querySelector(".select-pizza");
  selectBtn.addEventListener("click", async () => {
    let selectedId = document.querySelector("#select-pizza-id").value;
    let pizzaNameSel = document.querySelector("#name");
    let pizzaPriceSel = document.querySelector("#price");
    let pizzaIngrSel = document.querySelector("#ingredients");
    let pizzaIdSel = document.querySelector(".pizz-id");
    let pizzaStatSel = document.querySelector(".sel-pizza-status");
    await fetch(`/admin/${selectedId}`)
      .then((res) => res.json())
      .then((newPizza) => {
        pizzaIdSel.innerHTML = newPizza.id;
        (pizzaNameSel.value = newPizza.name),
          (pizzaPriceSel.value = newPizza.price),
          (pizzaStatSel.value = newPizza.active),
          (pizzaIngrSel.value = newPizza.ingredients.join(", "));
      });
  });
};

const modifyPizzaComponent = async () => {
  const modBtn = document.querySelector(".modify-pizza");
  modBtn.addEventListener("click", async () => {
    let selectId = document.querySelector(".pizz-id").innerText;
    let modNameInput = document.querySelector("#name").value;
    let modPriceInput = document.querySelector("#price").value;
    let modIngrInput = document.querySelector("#ingredients").value;
    let modStatusSelect = document.querySelector(".sel-pizza-status").value;

    let modifiedPizzaDatas = {
      id: selectId,
      name: modNameInput,
      ingredients: modIngrInput.split(", "),
      price: modPriceInput,
      active: modStatusSelect,
    };

    console.log(selectId);

    await fetch(`/admin/modify/${selectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedPizzaDatas),
    });

    document.querySelector("#select-pizza-id").value = "";
    document.querySelector(".pizz-id").innerText = "";
    document.querySelector("#name").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#ingredients").value = "";
    document.querySelector(".sel-pizza-status").value = "true";
    menuC.innerHTML = "";
    await elementBuilder();
  });
};

const main = async () => {
  await elementBuilder();

  addPizzaForm.insertAdjacentHTML(
    "beforeend",
    `
  <form id="new-pizza-form">
      <input type="text" name="name" id="name" placeholder="Pizza name" autocomplete="off">
      <textarea type="text" name="ingredients" id="ingredients" placeholder="Ingredients separated by a comma and space (for example: Tomato sauce, Cheese, Red chili...)">
      </textarea>
      <input type="number" name="price" id="price" placeholder="Price" autocomplete="off">
      </br>
      <label for="picture">Image upload (Pizzaname.webp):</label>
      <input type="file" name="file" id="myFiles" autocomplete="off">
      <input type="submit" value="ADD new" class="send-btn"/>
      <hr />
  </form>
  `
  );

  document.getElementById("ingredients").innerHTML = document
    .getElementById("ingredients")
    .innerHTML.trim();

  addPizzaForm.insertAdjacentHTML(
    "beforeend",
    `
    <div class="status">
        <h1>Active?</h1>
        <select class="sel-pizza-status" name="boolean"     size="1" required>  
            <option value="true"> true </option>  
            <option value="false"> false </option>  
        </select>
    </div>
    <input type="number" name="id" id="select-pizza-id" placeholder="ID" autocomplete="off">
    <button class="select-pizza">SELECT existing</button>
    <button class="modify-pizza">MODIFY existing</button>
    <h3 class="pizz-id"></h3>
  `
  );

  addPizzaForm.insertAdjacentHTML(
    "beforeend",
    `
    <h1>Delete existing pizza</h1>  
    <hr>
    <input type="number" name="id" id="pizza-id" placeholder="ID" autocomplete="off">
    <button class="del-pizza">DELETE</button>
    <p> &#128712 Pizza can be deleted after selecting its ID </p>
  `
  );

  await addNewPizza();

  await delPizza();

  await selectPizza();

  await modifyPizzaComponent();
};

main();
