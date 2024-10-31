// Open  & Close the chat
document.addEventListener("DOMContentLoaded", function () {
  var chat_window = document.getElementById("chat-window");
  var close_btn = document.getElementById("minimize-btn");

  var initial_chat = document.getElementById("closed-window");
  if (initial_chat) {
    initial_chat.addEventListener("click", function () {
      initial_chat.style.display = "none";
      chat_window.style.display = "block";
    });
  }

  var close_btn = document.getElementById("minimize-btn");
  if (close_btn) {
    close_btn.addEventListener("click", function () {
      initial_chat.style.display = "block";
      chat_window.style.display = "none";
    });
  }

  var first_btn = document.getElementById("next_stage");
  if (first_btn) {
    first_btn.addEventListener("click", function () {
      var issue = document.getElementById("issue").value;
      var specific_issue = document.getElementById("specific_issue").value;

      if (!issue) return;
      hideAllWindows();
      if (issue == "PRODUCT") {
        document.getElementById("product_check").style.display = "block";
      } else {
        document.getElementById("customer_check").style.display = "block";
      }

      storeItems("payload", { issue, specific_issue });
      console.log("Selected Issue:", issue);
      console.log("Specific Issue:", specific_issue);
    });
  }

  var product_btn = document.getElementById("product_btn");
  if (product_btn) {
    product_btn.addEventListener("click", async function () {
      var query = document.getElementById("product_search").value;
      product_btn.innerHTML = "Fetching Product";
      product_btn.className = "loading_btn";
      product_btn.disabled = true;

      if (!query) return;

      var result = await fetchProducts(query);
      console.log({ result });

      hideAllWindows();
      document.getElementById("product_list").style.display = "block";

      console.log("Product Query:", query);
    });
  }

  async function fetchProducts(query) {
    const url = `https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/${this.domain}/products/${query}`;
    console.log("Fetch Products:", query);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return false;
      }

      const data = await response.json();
      return data?.data?.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function renderProducts(products) {
    if (!products.length) return;

    products.forEach((product) => {
      const rowDiv = createProductRow(product);
      rowDiv.addEventListener("click", () => handleProductClick(product.id));
      this.parentContainer.appendChild(rowDiv);
    });
  }

  function createProductRow(product) {
    const placeholder =
      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";
    const imgSrc = product.img || placeholder;
    const statusColor =
      product.status.toLocaleLowerCase() === "active"
        ? { bg: "#AEFEBF", text: "#024B3F" }
        : { bg: "#FED1D6", text: "#8E0B21" };

    const rowDiv = createElementWithAttributes("div", ["row-product"], {
      id: product.id || "",
    });
    const imgDiv = createElementWithAttributes(
      "div",
      ["product-img"],
      {},
      `<img src="${imgSrc}" alt="product" />`,
    );
    const txtDiv = createElementWithAttributes(
      "div",
      ["product-col", "col"],
      {},
      `<span style="font-weight: 800; font-size: 14;">${product.title}</span>
      <div class="row-order" style="padding: 10px 10px 0px 0">
        <span style="color: ${statusColor.text}; background: ${statusColor.bg}; padding: 3px 5px; border-radius: 4px;">${product.status.toLocaleLowerCase()}</span>
        <span>stock level x ${product.stock_level}</span>
      </div>`,
    );

    rowDiv.appendChild(imgDiv);
    rowDiv.appendChild(txtDiv);

    return rowDiv;
  }

  function handleProductClick(productId) {
    console.log("Product clicked:", productId);
    hideAllWindows();
  }

  async function fetchProducts(query) {
    console.log("Fetch Products:", query);
    const domain = "dummy-store-usa.myshopify.com";
    const url = `https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/${domain}/products/${query}`;

    try {
      const response = await fetch(url);
      console.log(response.status);

      if (response.ok) {
        const data = await response.json();
        const products = data.data.products;

        const parentContainer = document.querySelector(
          "#product_list .prefetchRow",
        );
        if (!parentContainer || !products) return false;

        console.log({ products });

        products.forEach((product) => {
          const rowDiv = document.createElement("div");
          rowDiv.classList.add("row-product");
          rowDiv.id = `${product.id || ""}`;

          const placeholder =
            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";

          // Image container
          const imgDiv = document.createElement("div");
          imgDiv.classList.add("product-img");
          imgDiv.innerHTML = `<img src="${product.img || placeholder}" alt="product" />`;

          var bkg =
            product.status.toLocaleLowerCase() == "active"
              ? "#AEFEBF"
              : "#FED1D6";
          var color =
            product.status.toLocaleLowerCase() == "active"
              ? "#024B3F"
              : "#8E0B21";

          const txtDiv = document.createElement("div");
          txtDiv.classList.add("product-col", "col");
          txtDiv.innerHTML = `
            <span style="font-weight: 800; font-size: 14;">${product.title}</span>
            <div class="row-order" style="padding: 10px 10px 0px 0">
              <span style="
                color: ${color};
                background: ${bkg};
                padding: 3px 5px;
                border-radius: 4px;">${product.status.toLocaleLowerCase()}</span>
              <span>stock level x ${product.stock_level}</span>
            </div>`;

          rowDiv.appendChild(imgDiv);
          rowDiv.appendChild(txtDiv);

          rowDiv.addEventListener("click", function () {
            console.log("clicked");
            console.log(this.id);
            hideAllWindows();
            // document.getElementById("chat_window").style.display = "block";
          });

          parentContainer.appendChild(rowDiv);
        });
        return true;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    return false;
  }

  var customer_btn = document.getElementById("customer_btn");
  if (customer_btn) {
    customer_btn.addEventListener("click", function () {
      var email = document.getElementById("email_input").value;

      hideAllWindows();
      document.getElementById("order_check").style.display = "block";
      loadOrders();

      console.log("Customer Email:", email);
    });
  }

  async function loadOrders() {
    try {
      //   // Fetch data (replace with your actual API endpoint)
      //   const response = await fetch("https://api.example.com/orders");
      //   const orders = await response.json();

      const parentContainer = document.querySelector(
        "#order_check .prefetchRow",
      );
      product_list;

      var orders = [
        {
          order_number: 1234,
          fulfillment_status: "hold",
          tracking_url: "",
          total_price: "49.00",
        },
      ];

      orders.forEach((order) => {
        var colDiv = document.createElement("div");
        colDiv.classList.add("col", "col-order");

        var rowDiv1 = document.createElement("div");
        rowDiv1.classList.add("row", "row-order");
        rowDiv1.innerHTML = `<span>#${order.order_number}</span><span>${order.fulfillment_status}</span>`;

        var rowDiv2 = document.createElement("div");
        rowDiv2.classList.add("row", "row-order");
        rowDiv2.innerHTML = `<span>Tracking: <a href="#">${order.tracking_url}</a></span><span>$${order.total_price}</span>`;

        colDiv.appendChild(rowDiv1);
        colDiv.appendChild(rowDiv2);

        colDiv.addEventListener("click", function () {
          console.log("clicked");
          hideAllWindows();
          document.getElementById("chat_window").style.display = "block";
        });

        parentContainer.appendChild(colDiv);
      });
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  }

  function hideAllWindows() {
    document.getElementById("pre_check").style.display = "none";
    document.getElementById("product_check").style.display = "none";
    document.getElementById("product_list").style.display = "none";
    document.getElementById("customer_check").style.display = "none";
    document.getElementById("order_check").style.display = "none";
  }

  function extractNumbersFromString(inputString) {
    return inputString.replace(/[^0-9]/g, "");
  }

  function isValidEmail(email) {
    var emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  function addOperatorMessage(response) {
    var messageContainer = document.getElementById("messages");
    var operatorMessage = document.createElement("div");
    operatorMessage.className = "message message-operator";
    operatorMessage.innerHTML =
      '<span class="message-content">' + response + "</span>";
    messageContainer.appendChild(operatorMessage);
  }

  function storeItems(key, value) {
    if (typeof window !== "undefined") {
      console.log("STORING");
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function getItems(key) {
    if (typeof window !== "undefined") {
      const value = window.localStorage.getItem(key);
      return JSON.parse(value);
    }
    return null; // Handle cases where window is not defined
  }
});

// var issue_select = document.getElementById("issue");
// if (issue_select) {
//   issue_select.addEventListener("change", function () {
//     var option = this.value;
//     if (option == "GENERAL") {
//       orderContainer.style.display = "none";
//     } else {
//       emailContainer.style.display = "block";
//       orderContainer.style.display = "block";
//     }
//     console.log(option);
//   });
// }

// Prefetch Data
document.addEventListener("DOMContentLoaded", function () {
  var prefetchBtn = document.getElementById("prefetch_btn");
  var prefetchWinow = document.getElementById("pre_check");
  var chatWindow = document.getElementById("CHAT");

  // Inputs
  var emailInput = document.getElementById("emailInput");
  var orderInput = document.getElementById("orderInput");

  var queue = document.getElementById("queue");
  var issueSelect = document.getElementById("issue");

  prefetchBtn.addEventListener("click", function () {
    prefetchBtn.disabled = true; // Disable the button
    prefetchBtn.className = "loading_btn";
    prefetchBtn.innerHTML = "Waiting for Agent"; // Display "loading" text
    var issue = issueSelect.value;

    var email = emailInput.value.trim();
    if ((email !== "" && isValidEmail(email)) || issue == "GENERAL") {
      var order_number = orderInput.value.trim();
      var shop = sessionStorage.getItem("shop");

      queue.innerHTML =
        '<span style="color:#000; margin-left: 1rem;">' +
        "<strong>1</strong> Person ahead of you..." +
        "</span>";
      setTimeout(async () => {
        await verifyData(
          email,
          extractNumbersFromString(order_number),
          shop,
          issue,
        );
      }, 3000);
    } else {
      email.value = "";

      prefetchBtn.disabled = false;
      prefetchBtn.innerHTML = "Submit";
      var errorMsg = document.getElementById("error_msg");
      errorMsg.innerHTML =
        '<span style="color:red;">' +
        "VALID EMAIL USED FOR ORDER REQUIRED" +
        "</span>";
      errorMsg.classList.add("fade-out");
      setTimeout(function () {
        errorMsg.classList.remove("fade-out");
        errorMsg.innerHTML = "";
      }, 3000);
    }
  });

  async function verifyData(email, order_number, shop, issue) {
    console.log({ order_number });

    // modified the links for prod
    var url =
      "https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/initialize";
    var data = {
      email,
      order_number: order_number ?? "",
      domain: shop,
      issue: issue,
    };

    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);

      if (response.status === 422) {
        var errorMsg = document.getElementById("error_msg");
        errorMsg.innerHTML =
          '<span style="color:red; font-size: 2.6vh;">' +
          "A valid customer email is required." +
          "</span>";
        errorMsg.classList.add("fade-out");
        setTimeout(function () {
          errorMsg.classList.remove("fade-out");
          errorMsg.innerHTML = "";
        }, 5000);
        email.value = "";
        order_number.value = "";
        prefetchBtn.disabled = false;
        prefetchBtn.className = "";
        prefetchBtn.innerHTML = "Submit";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        return;
      } else if (response.status === 500) {
        var errorMsg = document.getElementById("error_msg");
        errorMsg.innerHTML =
          '<span style="color:red; font-size: 2.6vh;">' +
          "Uh Oh, contact the merchant via email" +
          "</span>";
        errorMsg.classList.add("fade-out");
        setTimeout(function () {
          errorMsg.classList.remove("fade-out");
          errorMsg.innerHTML = "";
        }, 5000);
        email.value = "";
        order_number.value = "";
        prefetchBtn.disabled = false;
        prefetchBtn.className = "";
        prefetchBtn.innerHTML = "Submit";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        return;
      } else if (response.status === 409) {
        var errorMsg = document.getElementById("error_msg");
        errorMsg.innerHTML =
          '<span style="color:red; font-size: 2.6vh;">' +
          "Customer email <strong>must</strong> match order Email" +
          "</span>";
        errorMsg.classList.add("fade-out");
        setTimeout(function () {
          errorMsg.classList.remove("fade-out");
          errorMsg.innerHTML = "";
        }, 5000);
        email.value = "";
        order_number.value = "";
        prefetchBtn.disabled = false;
        prefetchBtn.className = "";
        prefetchBtn.innerHTML = "Submit";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        return;
      } else if (response.status === 403) {
        var errorMsg = document.getElementById("error_msg");
        errorMsg.innerHTML =
          '<span style="color:red; font-size: 2.6vh;">' +
          "Customer email <strong>must</strong> match order Email" +
          "</span>";
        errorMsg.classList.add("fade-out");
        setTimeout(function () {
          errorMsg.classList.remove("fade-out");
          errorMsg.innerHTML = "";
        }, 5000);
        email.value = "";
        order_number.value = "";
        prefetchBtn.disabled = false;
        prefetchBtn.className = "";
        prefetchBtn.innerHTML = "Submit";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        alert("Agents not available at the moment.");
        return;
      } else if (response.status === 429) {
        var errorMsg = document.getElementById("error_msg");
        errorMsg.innerHTML =
          '<span style="color:red; font-size: 2.6vh;">' +
          "Merchant Needs To Pay for Service." +
          "</span>";
        errorMsg.classList.add("fade-out");
        setTimeout(function () {
          errorMsg.classList.remove("fade-out");
          errorMsg.innerHTML = "";
        }, 5000);
        email.value = "";
        order_number.value = "";
        prefetchBtn.disabled = false;
        prefetchBtn.className = "";
        prefetchBtn.innerHTML = "Submit";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        return;
      } else if (response.ok) {
        email.value = "";
        order_number.value = "";
        prefetchBtn.disabled = false;
        prefetchBtn.className = "";
        prefetchBtn.innerHTML = "Submit";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        const data = await response.json();
        console.log(data);

        sessionStorage.setItem("cha_uid", data.data.cha_uid);
        sessionStorage.setItem("access_token", data.data.access_token);
        console.log(sessionStorage.getItem("cha_uid"));
        console.log(sessionStorage.getItem("access_token"));

        prefetchWinow.style.display = "none";
        chatWindow.style.display = "block";
        addOperatorMessage(data.data.agents_init_message);
      } else {
        email.value = "";
        order_number.value = "";
        queue.innerHTML =
          '<span style="color:#000; margin-left: 1rem;">' + "</span>";
        prefetchBtn.disabled = false;
        prefetchBtn.innerHTML = "Submit";
        prefetchBtn.className = "";
        alert("Agents not available at the moment.");
      }
    } catch (error) {
      console.log("[error");
      console.log(error);
      email.value = "";
      order_number.value = "";
      queue.innerHTML =
        '<span style="color:#000; margin-left: 1rem;">' + "</span>";

      prefetchBtn.disabled = false;
      prefetchBtn.innerHTML = "Submit";
      var errorMsg = document.getElementById("error_msg");
      errorMsg.innerHTML =
        '<span style="color:red; font-size: 2.6vh;">' +
        "Try Again Later. No Reps are available." +
        "</span>";
      errorMsg.classList.add("fade-out");
      setTimeout(function () {
        errorMsg.classList.remove("fade-out");
        errorMsg.innerHTML = "";
      }, 5000);
      alert("Agents not available at the moment.");
    }
  }
});

// Talk with the Agent
document.addEventListener("DOMContentLoaded", function () {
  var sendButton = document.getElementById("button");
  var textarea = document.getElementById("new-message-textarea");
  var cus_chat = "";
  var responseTimeout;
  var typingTimeout;
  var typingIndicator = createTypingIndicator();
  var operatorResponsesCount = 0;

  function submitMessage() {
    var messageText = textarea.value.trim();
    cus_chat = cus_chat + " " + messageText;

    if (messageText !== "") {
      addCustomerMessage(messageText);
      textarea.value = "";
      console.log("chat started");

      clearTimeout(responseTimeout);
      clearTimeout(typingTimeout);

      typingTimeout = setTimeout(() => {
        // Add typing indicator
        var messageContainer = document.getElementById("messages");
        messageContainer.appendChild(typingIndicator);
      }, 15000);

      responseTimeout = setTimeout(() => {
        console.log("timer ended");
        const shop = sessionStorage.getItem("shop");
        const cha_uid = sessionStorage.getItem("cha_uid");

        console.log(shop);
        console.log(cha_uid);
        console.log(cus_chat);

        sendMessage(cus_chat, shop, cha_uid);
        cus_chat = "";
      }, 30000);
    }
  }

  sendButton.addEventListener("click", submitMessage);

  textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      submitMessage();
      event.preventDefault();
    }
  });

  function sendMessage(message, shop, cha_uid) {
    // modified the links for prod
    var url =
      "https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/respond";
    var data = {
      initial_msg: message,
      cha_uid: cha_uid,
      domain: shop,
    };

    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    var messageContainer = document.getElementById("messages");

    fetch(url, options)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error sending message");
        }
      })
      .then(function (responseText) {
        messageContainer.removeChild(typingIndicator);
        addOperatorMessage(responseText.data);
        operatorResponsesCount++;
        if (operatorResponsesCount == 3) {
          injectNewDiv();
          // Initial setup
          setupRatingEventListeners();
        }
      })
      .catch(function (error) {
        alert("Try again later.");
        messageContainer.removeChild(typingIndicator);
        console.error("Error sending message:", error);
      });
  }

  function addOperatorMessage(response) {
    var messageContainer = document.getElementById("messages");
    var operatorMessage = document.createElement("div");
    operatorMessage.className = "message message-operator";
    operatorMessage.innerHTML =
      '<span class="message-content">' + response + "</span>";
    messageContainer.appendChild(operatorMessage);
  }

  function addCustomerMessage(msg) {
    var messageContainer = document.getElementById("messages");
    var customerMessage = document.createElement("div");
    customerMessage.className = "message message-visitor";
    customerMessage.innerHTML =
      '<span class="message-content">' + msg + "</span>";
    messageContainer.appendChild(customerMessage);
  }

  function createTypingIndicator() {
    var typingIndicator = document.createElement("div");
    typingIndicator.className = "message message-operator typing-indicator";
    typingIndicator.innerHTML =
      '<span class="typing-indicator-dot"></span><span class="typing-indicator-dot"></span><span class="typing-indicator-dot"></span>';
    return typingIndicator;
  }

  function injectNewDiv() {
    var messageContainer = document.getElementById("messages");
    var newDiv = document.createElement("div");
    newDiv.className = "message message-operator rating-container";
    newDiv.innerHTML =
      '<div style=" text-align: center; padding: 0  0 1rem 0;"><span>Let Us Know How We Are Doing</span></div><div class="rating" style="display: flex !important;"><div class="rating-item" id="POSITIVE"><span>😀</span><span>Positive</span></div><div class="rating-item" id="NEUTRAL"><span>😐</span><span>Neutral</span></div><div class="rating-item" id="NEGATIVE"><span>🙁</span><span>Negative</span></div></div>';
    messageContainer.appendChild(newDiv);
  }

  function setupRatingEventListeners() {
    var ratingItems = document.getElementsByClassName("rating-item");
    for (var i = 0; i < ratingItems.length; i++) {
      console.log(ratingItems[i]);
      ratingItems[i].addEventListener("click", rateChat);
    }
  }

  function rateChat(event) {
    var ratingSpan = event.currentTarget;
    console.log(ratingSpan);
    var ratingId = ratingSpan.id.toLocaleLowerCase();
    console.log(ratingId);
    var cha_uid = sessionStorage.getItem("cha_uid");
    var domain = sessionStorage.getItem("shop");

    var ratingData = {
      rating: {
        negative: 0,
        positive: 0,
        neutral: 0,
      },
      cha_uid: cha_uid,
      domain: domain,
    };

    ratingData.rating[ratingId] = 1;
    console.log(ratingData);

    fetch(
      "https://us-central1-sherpa-dc1fe.cloudfunctions.net/tools/chat/rate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      },
    )
      .then(function (response) {
        if (response.ok) {
          // Rating submitted successfully
          // You can perform any additional actions here
          console.log("Rating submitted successfully");
          var ratingContainer =
            document.getElementsByClassName("rating-container");
          ratingContainer[0].style.display = "none";
        } else {
          throw new Error("Error submitting rating");
        }
      })
      .catch(function (error) {
        console.error("Error submitting rating:", error);
      });
  }
});
