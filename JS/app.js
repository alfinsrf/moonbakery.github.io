// Proudct data
document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Cheesecake Original",
        img: "Cheesecake.jpg",
        price: 33000,
      },
      {
        id: 2,
        name: "Cheesecake Strawberry",
        img: "CheesecakeStrawberry.jpg",
        price: 40000,
      },
      {
        id: 3,
        name: "Cheesecake Blueberry",
        img: "CheesecakeBlueberry.jpg",
        price: 42000,
      },
      {
        id: 4,
        name: "Cheesecake Lotus Biscoff",
        img: "CheesecakeLotusBiscoff.jpg",
        price: 45000,
      },
      { id: 5, name: "Cheese Burger", img: "CheeseBurger.jpg", price: 35000 },
      {
        id: 6,
        name: "Double Burger",
        img: "DoubleBurger.jpg",
        price: 50000,
      },
      {
        id: 7,
        name: "Croissant",
        img: "Croissant.jpg",
        price: 30000,
      },
      {
        id: 8,
        name: "Macaron 10pcs",
        img: "Macaron.jpg",
        price: 100000,
      },
      {
        id: 9,
        name: "Pretzels",
        img: "Pretzels.jpg",
        price: 25000,
      },
      {
        id: 10,
        name: "Donut all variant",
        img: "Donut.jpg",
        price: 7000,
      },
      {
        id: 11,
        name: "A plate of donut",
        img: "DoubleDonut.jpg",
        price: 12000,
      },
      {
        id: 12,
        name: "Sandwich",
        img: "Sandwich.jpg",
        price: 25000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((items) => items.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;

            return item;
          }
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;

            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Send data when click chechout button
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);

  // ask transaction token using fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });

    const token = await response.text();
    window.snap.pay(token);
  } catch (error) {}
});

// format message
const formatMessage = (obj) => {
  return `Data Customer
    Name: ${obj.name}
    Email: ${obj.email}
    Phone: ${obj.phone}
  
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
Total: ${rupiah(obj.total)}
Terima kasih`;
};

// Currency Convert to Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
