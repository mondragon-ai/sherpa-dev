// Open  & Close the chat
document.addEventListener("DOMContentLoaded", function () {
  var chat_window = document.getElementById("chat-window");
  var close_btn = document.getElementById("minimize-btn");

  // * 1. TOGGLE OPEN & CLOSE CHAT WINDOW
  // ! =============================================================
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

  // * 2. NAVIGATE WINDOWS - HANDLING DATA
  // ! =============================================================
  const issue = document.getElementById("issue");
  if (issue) {
    issue.addEventListener("change", function () {
      var option = this.value;
      if (option == "GENERAL") {
        document.getElementById("email_gen").style.display = "block";
        document.getElementById("start_chat").style.display = "block";
        document.getElementById("next_stage").style.display = "none";
      } else {
        document.getElementById("email_gen").style.display = "none";
        document.getElementById("start_chat").style.display = "none";
        document.getElementById("next_stage").style.display = "block";
      }
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

      storeItems("payload", {
        issue: issue.toLocaleLowerCase(),
        specific_issue,
      });
    });
  }

  // * 3. INITIATE SERVER REQUESTS - Buttons
  // ! =============================================================
  var start_chat = document.getElementById("start_chat");
  if (start_chat) {
    // Start chat with AI Agent (if issue == general)
    start_chat.addEventListener("click", function () {
      var issue = document.getElementById("issue").value;
      var specific_issue = document.getElementById("specific_issue").value;
      var email = document.getElementById("email_optional").value;

      if (!issue) return;
      hideAllWindows();
      document.getElementById("chat_window").style.display = "block";

      // start chat
    });
  }

  var customer_btn = document.getElementById("customer_btn");
  if (customer_btn) {
    // Fetch Valid Customer orders
    customer_btn.addEventListener("click", async function () {
      var email = document.getElementById("email_input").value;
      toggleLoading(customer_btn, true);

      if (!email) {
        toggleLoading(customer_btn, false);
        return;
      }

      if (!isValidEmail(email)) {
        toggleLoading(customer_btn, false);
        var errorMsg = document.getElementById("customer_error");
        errorMsg.innerHTML = "<span>VALID EMAIL REQUREID.</span>";
      }

      var payload = getItems("payload");
      if (!payload) {
        hideAllWindows();
        document.getElementById("pre_check").style.display = "block";
        return;
      }
      storeItems("payload", { ...payload, email: email });

      var orders = await fetchOrders(email);

      if (!orders.length) {
        var errorMsg = document.getElementById("customer_error");
        errorMsg.innerHTML = "<span>NO ORDERS FOUND. TRY ANOTHER EMAIL.</span>";

        toggleLoading(customer_btn, false);
        return;
      }
      renderOrders(orders);

      hideAllWindows();
      document.getElementById("order_check").style.display = "block";

      toggleLoading(customer_btn, false);
    });
  }

  var product_btn = document.getElementById("product_btn");
  if (product_btn) {
    // Fetch Products (if available)
    product_btn.addEventListener("click", async function () {
      var query = document.getElementById("product_search").value;
      toggleLoading(product_btn, true);

      if (!query) {
        toggleLoading(product_btn, false);
        return;
      }

      var products = await fetchProducts(query);

      if (!products.length) {
        var errorMsg = document.getElementById("product_error");
        errorMsg.innerHTML = "<span>NO PRODUCTS FOUND. TRY AGAIN.</span>";

        toggleLoading(product_btn, false);
        return;
      }
      renderProducts(products);

      hideAllWindows();
      document.getElementById("product_list").style.display = "block";

      toggleLoading(product_btn, false);
    });
  }

  // * 4. FETCH & RENDER PRODUCTS
  // ! =============================================================
  async function fetchProducts(query) {
    const domain = "dummy-store-usa.myshopify.com";
    const url = `https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/${domain}/products/${query}`;
    console.log("Fetch Products:", query);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return [];
      }

      const data = await response.json();
      return data?.data?.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function renderProducts(products) {
    if (!products.length) return false;

    const parentContainer = document.querySelector(
      "#product_list .prefetchRow",
    );
    if (!parentContainer) return false;

    products.forEach((product) => {
      const rowDiv = createProductRow(product);
      rowDiv.addEventListener("click", () => handleProductClick(product.id));
      parentContainer.appendChild(rowDiv);
    });
    return true;
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

  // ? Not sure what to do here
  function handleProductClick(productId) {
    console.log("Product clicked:", productId);
    // hideAllWindows();
  }

  // * 4. NAVIGATE WINDOWS - GO BACK
  // ! =============================================================
  var customer_back = document.getElementById("customer_back");
  if (customer_back) {
    customer_back.addEventListener("click", function () {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
    });
  }

  var order_back = document.getElementById("order_back");
  if (order_back) {
    order_back.addEventListener("click", function () {
      hideAllWindows();
      document.getElementById("customer_check").style.display = "block";
    });
  }

  var product_back = document.getElementById("product_back");
  if (product_back) {
    product_back.addEventListener("click", function () {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
    });
  }

  // * 5. FETCH & RENDER ORDERS
  // ! =============================================================
  async function fetchOrders(email) {
    const domain = "dummy-store-usa.myshopify.com";
    const url = `http://127.0.0.1:5001/sherpa-dc1fe/us-central1/agents/${domain}/customer/${email}/orders`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return [];
      }

      const data = await response.json();

      return data?.data?.orders || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function renderOrders(orders) {
    if (!orders.length) return false;

    const parentContainer = document.querySelector("#order_check .prefetchRow");
    if (!parentContainer) return false;

    orders.forEach((order) => {
      var colDiv = createOrderEl(order);
      colDiv.addEventListener("click", async function () {
        await handleOrderClick(order.id);
      });
      parentContainer.appendChild(colDiv);
    });
    return true;
  }

  function createOrderEl(order) {
    const statusColor =
      order.fulfillment_status === "FULFILLED"
        ? { bg: "#AEFEBF", text: "#024B3F" }
        : { bg: "#FED1D6", text: "#8E0B21" };

    var colDiv = document.createElement("div");
    colDiv.classList.add("col", "col-order");

    var rowDiv1 = document.createElement("div");
    rowDiv1.classList.add("row", "row-order");
    rowDiv1.innerHTML = `<span>${order.order_number}</span><span style="color: ${statusColor.text}; background: ${statusColor.bg}; padding: 3px 5px; border-radius: 4px;">${capitalizeWords(order.fulfillment_status.toLocaleLowerCase())}</span>`;

    var rowDiv2 = document.createElement("div");
    rowDiv2.classList.add("row", "row-order");
    rowDiv2.innerHTML = `<span>Tracking: <a href="${order.tracking_url || "#"}">${order.tracking_url ? extractNumbers(order.tracking_url) : "no tracking"}</a></span><span>$${order.current_total_price}</span>`;

    colDiv.appendChild(rowDiv1);
    colDiv.appendChild(rowDiv2);

    return colDiv;
  }

  // Start Chat with valid order
  async function handleOrderClick(orderID) {
    console.log("Order clicked:", orderID);

    const parent = document.querySelector("#order_check .prefetchRow");
    if (!parent) return false;

    parent.innerHTML = `<div class="nav-row" id="order_back"><span>back</span></div><div id="windowHdr"><span><strong>1</strong> Person ahead of you...</span></div>`;

    var payload = getItems("payload");
    if (!payload) {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
      return false;
    }
    storeItems("payload", { ...payload, order_id: orderID });

    var result = await startChat();
    if (result.status > 300) return false;

    if (result.status == 200) {
      addAgentMessage(result.agent);
    }

    hideAllWindows();
    document.getElementById("chat_window").style.display = "block";
  }

  // * 6. START CHAT WITH AGENT (email & order)
  // ! =============================================================
  async function startChat() {
    var payload = getItems("payload");
    if (!payload) {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
      return { agent: "", status: 500 };
    }
    var domain = "dummy-store-usa.myshopify.com";
    var url = `http://127.0.0.1:5001/sherpa-dc1fe/us-central1/agents/${domain}/initiate/${payload.email}`;
    var options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat: payload }),
    };

    try {
      var response = await fetch(url, options);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return { agent: "", status: response.status };
      }

      var data = await response.json();

      if (response.status == 201) {
        var convo = data?.data;
        if (!convo) return { agent: "", status: 422 };

        for (const c of convo) {
          if (c.sender === "agent" && !c.is_note) {
            addAgentMessage(c.message);
          } else if (c.sender === "customer") {
            console.log("CUSTOMER");
          }
        }
        return { agent: "", status: 201 };
      }

      return { agent: data?.data?.message || "", status: 200 };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { agent: "", status: 500 };
    }
  }

  // * 7. SUBMIT CUSTOMER
  // ! =============================================================
  var send_btn = document.getElementById("customer_submit");
  if (send_btn) {
    send_btn.addEventListener("click", submitMessage);
  }

  var textarea = document.getElementById("new-message-textarea");
  if (textarea) {
    textarea.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitMessage();
      }
    });
  }

  var chat = "";
  var response_timeout;
  var typing_timeout;
  var typing = createTypingIndicator();
  function submitMessage() {
    var message = textarea.value.trim();
    chat = chat + " " + message;

    if (message !== "") {
      addCustomerMessage(message);
      textarea.value = "";

      clearTimeout(response_timeout);
      clearTimeout(typing_timeout);

      typing_timeout = setTimeout(() => {
        var message_container = document.getElementById("messages");
        message_container.appendChild(typing);
      }, 15000);

      response_timeout = setTimeout(() => {
        console.log("timer ended");
        const payload = getItems("payload");
        console.log(payload);
        // sendMessage
        chat = "";
      }, 30000);
    }
  }

  var operatorResponsesCount = 0;
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

  // * 8. HELPERS - UI/Storage/Formatting
  // ! =============================================================

  function hideAllWindows() {
    document.getElementById("pre_check").style.display = "none";
    document.getElementById("product_check").style.display = "none";
    document.getElementById("product_list").style.display = "none";
    document.getElementById("customer_check").style.display = "none";
    document.getElementById("order_check").style.display = "none";
  }

  function toggleLoading(el, loading) {
    if (loading) {
      el.innerHTML = "loading...";
      el.className = "loading_btn";
      el.disabled = true;
    } else {
      el.innerHTML = "Fetch Product";
      el.classList.remove("loading_btn");
      el.disabled = false;
    }
  }

  function createElementWithAttributes(
    tag,
    classNames = [],
    attributes = {},
    innerHTML = "",
  ) {
    const element = document.createElement(tag);
    if (classNames.length) element.classList.add(...classNames);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    element.innerHTML = innerHTML;
    return element;
  }

  // Validate Emails
  function isValidEmail(email) {
    var emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  // Local Storage
  function storeItems(key, value) {
    if (typeof window !== "undefined") {
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

  // Formatters
  function extractNumbers(str) {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  }

  function capitalizeWords(str) {
    const words = str.replaceAll("_", " ").split(" ");

    let word = "";
    for (const w of words) {
      word += w.charAt(0).toLocaleUpperCase() + w.substring(1) + " ";
    }

    return word;
  }

  // Add Messages - Agent Response
  function addAgentMessage(response) {
    var msg_container = document.getElementById("messages");
    var agent = document.createElement("div");
    agent.className = "message message-operator";
    agent.innerHTML = `<span class="message-content">${response}</span>`;
    msg_container.appendChild(agent);
  }

  // Add Messages - Customer Response
  function addCustomerMessage(msg) {
    var container = document.getElementById("messages");
    var message = document.createElement("div");
    message.className = "message message-visitor";
    message.innerHTML = `<span class="message-content">${msg}</span>`;
    container.appendChild(message);
  }

  // Typing Indicator
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
