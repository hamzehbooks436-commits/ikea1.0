const OrderSync = {
    async getOrders() {
        if (this.hasOnlineDatabase()) {
            let response = await fetch(this.ordersUrl());
            let data = await response.json();
            return this.objectToArray(data);
        }

        return JSON.parse(localStorage.getItem("orders")) || [];
    },

    async addOrder(order) {
        if (this.hasOnlineDatabase()) {
            await fetch(this.ordersUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });
            return;
        }

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
    },

    async markDelivered(orderId) {
        let orders = await this.getOrders();
        let deliveredOrder = orders.find(order => Number(order.id) === Number(orderId));

        if (!deliveredOrder) {
            return;
        }

        deliveredOrder.deliveredDate = new Date().toLocaleString();
        deliveredOrder.saleDay = new Date().toLocaleDateString();

        await this.addSale(deliveredOrder);

        if (this.hasOnlineDatabase()) {
            await fetch(this.orderUrl(deliveredOrder.syncKey), {
                method: "DELETE"
            });
            return;
        }

        let remainingOrders = orders.filter(order => Number(order.id) !== Number(orderId));
        localStorage.setItem("orders", JSON.stringify(remainingOrders));
    },

    async getSales() {
        if (this.hasOnlineDatabase()) {
            let response = await fetch(this.salesUrl());
            let data = await response.json();
            return this.objectToArray(data);
        }

        return JSON.parse(localStorage.getItem("salesHistory")) || [];
    },

    async addSale(sale) {
        if (this.hasOnlineDatabase()) {
            await fetch(this.salesUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sale)
            });
            return;
        }

        let sales = JSON.parse(localStorage.getItem("salesHistory")) || [];
        sales.push(sale);
        localStorage.setItem("salesHistory", JSON.stringify(sales));
    },

    hasOnlineDatabase() {
        return typeof ORDER_SYNC_DATABASE_URL !== "undefined" && ORDER_SYNC_DATABASE_URL !== "";
    },

    baseUrl() {
        return ORDER_SYNC_DATABASE_URL.replace(/\/$/, "");
    },

    ordersUrl() {
        return this.baseUrl() + "/orders.json";
    },

    orderUrl(syncKey) {
        return this.baseUrl() + "/orders/" + syncKey + ".json";
    },

    salesUrl() {
        return this.baseUrl() + "/salesHistory.json";
    },

    objectToArray(data) {
        if (!data) {
            return [];
        }

        return Object.keys(data).map(key => {
            data[key].syncKey = key;
            return data[key];
        });
    }
};
