// Open  & Close the chat
document.addEventListener("DOMContentLoaded", function () {
  var live = document.querySelector(".online");

  var a = getRandomNumber(5);
  live.innerHTML = `${a} Agents online`;

  var chat_window = document.getElementById("chat-window");
  var close_btn = document.getElementById("minimize-btn");
  var domain = chat_window.getAttribute("data-shopify-domain");

  storeString("domain", domain);
  var p = getItems("payload");

  async function fetchChat() {
    return await fetchActiveThread();
  }

  async function fetchActiveThread() {
    var payload = getItems("payload");
    if (!payload) {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
      return 500;
    }
    var domain = getString("domain");
    var url = `http://127.0.0.1:5001/sherpa-dc1fe/us-central1/store/${domain}/chats/thread/${payload.email}`;
    try {
      var response = await fetch(url);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Not Active.`);

        hideAllWindows();
        document.getElementById("pre_check").style.display = "block";
        clearItem("payload");

        return response.status;
      }

      var data = await response.json();

      var convo = data?.data;
      if (!convo) {
        hideAllWindows();
        document.getElementById("pre_check").style.display = "block";

        return 422;
      }

      for (var c of convo) {
        if (c.sender === "agent" && !c.is_note) {
          addAgentMessage(c.message);
        } else if (c.sender === "customer") {
          addCustomerMessage(c.message);
        }
      }
      return 200;
    } catch (error) {
      console.error("Error fetching products:", error);
      return 500;
    }
  }

  if (p && p.email && domain) {
    fetchChat();
    hideAllWindows();
    document.getElementById("chat_window").style.display = "block";
  } else {
    hideAllWindows();
    document.getElementById("pre_check").style.display = "block";
  }

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
  var issue = document.getElementById("issue");
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
    start_chat.addEventListener("click", async function () {
      toggleLoading(start_chat, true);
      var issue = document.getElementById("issue").value;
      var specific_issue = document.getElementById("specific_issue").value;
      var email = document.getElementById("email_optional").value;

      if (!email) {
        var errorMsg = document.getElementById("precheck_error");
        errorMsg.innerHTML = "<span>VALID EMAIL REQUREID.</span>";
        toggleLoading(start_chat, false);
        return;
      }

      if (!isValidEmail(email)) {
        toggleLoading(start_chat, false);
        var errorMsg = document.getElementById("precheck_error");
        errorMsg.innerHTML = "<span>VALID EMAIL REQUREID.</span>";
      }

      if (!issue) {
        var errorMsg = document.getElementById("precheck_error");
        errorMsg.innerHTML = "<span>CHOOSE AN ISSUE.</span>";
        toggleLoading(start_chat, false);
        return;
      }

      storeItems("payload", {
        issue: issue.toLocaleLowerCase(),
        specific_issue,
        email,
      });

      // start chat
      var result = await startChat();
      if (result.status > 300) return false;

      if (result.status == 200) {
        addAgentMessage(result.agent);
      }

      hideAllWindows();
      document.getElementById("chat_window").style.display = "block";
      toggleLoading(start_chat, false);
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
    var domain = getString("domain");
    var url = `https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/${domain}/products/${query}`;

    try {
      var response = await fetch(url);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return [];
      }

      var data = await response.json();
      return data?.data?.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function renderProducts(products) {
    if (!products.length) return false;

    var parentContainer = document.querySelector("#product_list .prefetchRow");
    if (!parentContainer) return false;

    products.forEach((product) => {
      var rowDiv = createProductRow(product);
      rowDiv.addEventListener("click", () => handleProductClick(product.id));
      parentContainer.appendChild(rowDiv);
    });
    return true;
  }

  function createProductRow(product) {
    var placeholder =
      "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";
    var imgSrc = product.image || placeholder;
    var statusColor =
      product.status.toLocaleLowerCase() === "active"
        ? { bg: "#AEFEBF", text: "#024B3F" }
        : { bg: "#FED1D6", text: "#8E0B21" };

    var rowDiv = createElementWithAttributes("div", ["row-product"], {
      id: product.id || "",
    });

    var stock_level =
      product.stock_level <= 0
        ? "out of stock"
        : `stock level x ${product.stock_level}`;

    var status =
      product.status.toLocaleLowerCase() == "active"
        ? "Active"
        : "Not Available";

    var imgDiv = createElementWithAttributes(
      "div",
      ["product-img"],
      {},
      `<img src="${imgSrc}" alt="product" />`,
    );
    var txtDiv = createElementWithAttributes(
      "div",
      ["product-col", "col"],
      {},
      `<span style="font-weight: 800; font-size: 14;">${product.title}</span>
      <div class="row-order" style="padding: 10px 10px 0px 0">
        <span style="color: ${statusColor.text}; background: ${statusColor.bg}; padding: 3px 5px; border-radius: 4px;">${status}</span>
        <span style="color: ${product.stock_level <= 0 ? "#8E0B21" : ""}">${stock_level}</span>
      </div>`,
    );

    rowDiv.appendChild(imgDiv);
    rowDiv.appendChild(txtDiv);

    return rowDiv;
  }

  // ? Not sure what to do here
  function handleProductClick(productId) {
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

  var product_list_back = document.getElementById("product_list_back");
  if (product_list_back) {
    product_list_back.addEventListener("click", function () {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
    });
  }

  // * 5. FETCH & RENDER ORDERS
  // ! =============================================================
  async function fetchOrders(email) {
    var domain = getString("domain");
    var url = `http://127.0.0.1:5001/sherpa-dc1fe/us-central1/agents/${domain}/customer/${email}/orders`;

    try {
      var response = await fetch(url);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return [];
      }

      var data = await response.json();

      return data?.data?.orders || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function renderOrders(orders) {
    if (!orders.length) return false;

    var parentContainer = document.querySelector("#order_check .prefetchRow");
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
    var statusColor =
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
    var parent = document.querySelector("#order_check .prefetchRow");
    if (!parent) return false;

    var n = getRandomNumber(3);

    parent.innerHTML = `<div class="nav-row" id="order_back"><span>back</span></div><div id="windowHdr"><span><strong>${n}</strong> Person ahead of you...</span></div>`;

    var payload = getItems("payload");
    if (!payload) {
      hideAllWindows();
      document.getElementById("pre_check").style.display = "block";
      return false;
    }
    storeItems("payload", { ...payload, order_id: extractNumbers(orderID) });

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
    var domain = getString("domain");
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

        for (var c of convo) {
          if (c.sender === "agent" && !c.is_note) {
            addAgentMessage(c.message);
          } else if (c.sender === "customer") {
            addCustomerMessage(c.message);
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

  // * 7. SUBMIT CUSTOMER MSG
  // ! =============================================================
  var chat = "";
  var response_timeout;
  var typing_timeout;
  var typing = createTypingIndicator();
  var message_container = document.getElementById("messages");
  var operatorResponsesCount = 0;

  var send_btn = document.getElementById("button");
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

  function submitMessage() {
    var message = textarea.value.trim();
    chat = chat + " " + message;

    if (message !== "") {
      addCustomerMessage(message);
      textarea.value = "";

      clearTimeout(response_timeout);
      clearTimeout(typing_timeout);

      typing_timeout = setTimeout(() => {
        message_container.appendChild(typing);
      }, 15000);

      response_timeout = setTimeout(
        async () => await handleSendingMessage(),
        30000,
      );
    }
  }

  async function handleSendingMessage() {
    var response = await sendMessage();

    if (response) {
      addAgentMessage(response);
      operatorResponsesCount++;
      if (operatorResponsesCount == 3) {
        injectRating();
        setupRatingEventListeners();
      }
    }
    chat = "";
    message_container.removeChild(typing);
  }

  async function sendMessage() {
    var domain = getString("domain");
    var payload = getItems("payload");

    if (!domain || !payload.email || !chat) return "";
    var url = `https://us-central1-sherpa-dc1fe.cloudfunctions.net/agents/${domain}/respond/${payload.email}`;

    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: chat }),
    };

    try {
      var response = await fetch(url, options);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed To Send message.`);
        return "";
      }
      var data = await response.json();
      return data?.data?.response || "";
    } catch (error) {
      console.error("Error getting response:", error);
      return "";
    }
  }

  // * 8. HANDLE RATING
  // ! =============================================================
  function injectRating() {
    var message_container = document.getElementById("messages");
    var newDiv = document.createElement("div");
    newDiv.className = "message message-operator rating-container";
    newDiv.innerHTML =
      '<div style=" text-align: center; padding: 0  0 1rem 0;"><span>Let Us Know How We Are Doing</span></div><div class="rating" style="display: flex !important;"><div class="rating-item" id="POSITIVE"><span>😀</span><span>Positive</span></div><div class="rating-item" id="NEUTRAL"><span>😐</span><span>Neutral</span></div><div class="rating-item" id="NEGATIVE"><span>🙁</span><span>Negative</span></div></div>';
    message_container.appendChild(newDiv);
  }

  function setupRatingEventListeners() {
    var ratingItems = document.getElementsByClassName("rating-item");
    for (var i = 0; i < ratingItems.length; i++) {
      ratingItems[i].addEventListener("click", async function (event) {
        await rateChat(event);
      });
    }
  }

  async function rateChat(event) {
    var ratingContainer = document.getElementsByClassName("rating-container");
    ratingContainer[0].style.display = "none";

    var rating_span = event.currentTarget;
    var rating_id = rating_span.id.toLocaleLowerCase();

    var domain = getString("domain");
    var payload = getItems("payload");

    if (!domain || !payload.email || !rating_id) return "";
    var url = `https://us-central1-sherpa-dc1fe.cloudfunctions.net/store/${domain}/chats/${payload.email}/rate?rating=${rating_id}`;

    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      var response = await fetch(url, options);
      if (!response.ok) {
        console.error(`Error: ${response.status} - Failed to fetch products.`);
        return "";
      }

      console.log("Rating submitted successfully");
    } catch (error) {
      console.error("Error getting response:", error);
      return "";
    }
  }

  // * 9. ADD MESSAGE DIVS
  // ! =============================================================

  // Add Messages - Agent Response
  function addAgentMessage(response) {
    var msg_container = document.getElementById("messages");
    var agent = document.createElement("div");
    agent.className = "message message-operator";
    agent.innerHTML = `<span class="message-content">${marked.parse(response)}</span>`;
    msg_container.appendChild(agent);
  }

  // Add Messages - Customer Response
  function addCustomerMessage(msg) {
    var container = document.getElementById("messages");
    var message = document.createElement("div");
    message.className = "message message-visitor";
    message.innerHTML = `<span class="message-content" style="color: #f7f7f7"><p>${msg}</p></span>`;
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
    var element = document.createElement(tag);
    if (classNames.length) element.classList.add(...classNames);
    for (var [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    element.innerHTML = innerHTML;
    return element;
  }

  // Validate Emails
  function isValidEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Local Storage
  function storeItems(key, value) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function storeString(key, value) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  }

  function getItems(key) {
    if (typeof window !== "undefined") {
      var value = window.localStorage.getItem(key);
      return JSON.parse(value);
    }
    return null; // Handle cases where window is not defined
  }

  function getString(key) {
    if (typeof window !== "undefined") {
      var value = window.localStorage.getItem(key);
      return value;
    }
    return null;
  }

  function clearItem(key) {
    console.log("CLEARED");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }

  // Formatters
  function extractNumbers(str) {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.join("") : "";
  }

  function capitalizeWords(str) {
    var words = str.replaceAll("_", " ").split(" ");

    let word = "";
    for (var w of words) {
      word += w.charAt(0).toLocaleUpperCase() + w.substring(1) + " ";
    }

    return word;
  }

  function getRandomNumber(num) {
    return Math.floor(Math.random() * num) + 1;
  }
});
