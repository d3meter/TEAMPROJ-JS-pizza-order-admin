const rootElement = document.querySelector("#root");
const pizzaContainer = document.querySelector(".container");
const refreshBtn = document.querySelector("#refresh-btn");

const orderComponent = (
    date,
    name,
    phone,
    zip,
    city,
    street,
    house,
    pizzas
) => `
                <div id="order">
                    <div id="title">
                        <h1>${
                            name[0] + zip.slice(1, 3) + date.slice(-4, -1)
                        }</h1>
                        <form id="statusForm">
                            <label for="statusInput">Status:</label>
                            <select id="statusInput" name="statusInput">
                                <option selected value="open">Open</option>
                                <option value="canceled">Canceled</option>
                                <option value="finish">Finish</option>
                            </select>
                        </form>
                        <h1>${date.slice(0, 10)}</h1>
                        <h1>${date.replace("Z", "").slice(11, 16)}</h1>
                    </div>
                    <div class="customer-details">
                        <h2>${name}</h2>
                        <h2>${phone}</h2>
                        <hr>
                        <h2>
                        ${zip} ${city.toUpperCase()}
                        <br>
                        ${street} ${house}</h2>
                    </div>
                    <div class="order-details">
                        ${pizzas}
                    </div>
                </div>
`;

function getFetch() {
    fetch("/order")
        .then((res) => res.json())
        .then((orders) => {
            orders.map((order) => {
                pizzaContainer.insertAdjacentHTML(
                    "beforeend",
                    orderComponent(
                        order.orderDate,
                        order.orderData.name,
                        order.orderData.phone,
                        order.orderData.zip,
                        order.orderData.city,
                        order.orderData.street,
                        order.orderData.house,
                        iterate(order.pizzaAll)
                    )
                );
            });
            refreshBtn.addEventListener("click", (e) => {
                console.log("clicked");
                console.log(e);
                refreshOrders();
            });
                        
            const titleDiv = document.querySelectorAll("#title");
            const orderDiv = document.querySelectorAll("#order");
            const statusInput = document.querySelectorAll("#statusInput");
            for (let i = 0; i < orderDiv.length; i++) {
                statusInput[i].addEventListener("change", function () {
                    if (statusInput[i].value === "open") {
                        orderDiv[i].style.backgroundColor =
                            "rgb(150, 127, 105)";
                        titleDiv[i].style.backgroundColor = "#463926";
                    }
                    if (statusInput[i].value === "canceled") {
                        orderDiv[i].style.backgroundColor = "#7c7c7c";
                        titleDiv[i].style.backgroundColor =
                            "rgba(0, 0, 0, 0.69)";
                    }
                    if (statusInput[i].value === "finish") {
                        orderDiv[i].style.backgroundColor =
                            "rgba(0, 221, 24, 0.69)";
                        titleDiv[i].style.backgroundColor = "rgb(37, 91, 0)";
                    }
                });
            }

            const filterBtn = document.querySelector("#filterStatus");
            for (let i = 0; i < orderDiv.length; i++) {
                filterBtn.addEventListener("change", function () {
                    if (
                        filterBtn.value === "open" &&
                        statusInput[i].value !== "open"
                    ) {
                        orderDiv[i].style.display = "none";
                    } else {
                        orderDiv[i].style.display = "grid";
                    }
                });
            }
        });
}

getFetch();

function refreshOrders() {
    const orderClass = document.querySelectorAll("#order");
    let orderNumber = orderClass.length;
    console.log(orderNumber);

    fetch(`/order-number/${orderNumber}`)
        .then((res) => res.json())
        .then((orders) => {
            if (orders.answer !== "ok") {
                orders.map((order) => {
                    pizzaContainer.insertAdjacentHTML(
                        "beforeend",
                        orderComponent(
                            order.orderDate,
                            order.orderData.name,
                            order.orderData.phone,
                            order.orderData.zip,
                            order.orderData.city,
                            order.orderData.street,
                            order.orderData.house,
                            iterate(order.pizzaAll)
                        )
                    );
                });
            }
        });
}

function refreshTime() {
    const timeDisplay = document.getElementById("time");
    const dateString = new Date().toLocaleString("en-US", {hour12: false});
    const formattedString = dateString.replace(", ", " - ");
    timeDisplay.textContent = formattedString;
}
setInterval(refreshTime, 1000);

const iterate = function (array) {
    insertHtml = "";
    for (let i = 0; i < array.length; i++) {
        insertHtml += `<li>${Object.values(array[i])} &#215 ${Object.keys(
            array[i]
        )}</li>`;
    }
    return insertHtml;
};