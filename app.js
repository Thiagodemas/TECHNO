const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        product: false,
        cart: [],
        cartActive: false,
        alertMsg: "Item adicionado",
        alertActive: false
       
    },
    filters: {
        numberPrice(value) {
            return value.toLocaleString("en-BR", { style: "currency", currency: "BRL"});
        }
    },
    computed:{
        cartTotal() {
            let total = 0;

            if (this.cart.length){
                this.cart.forEach(item => {
                    total += item.preco;
                })
            }
            return total++;
        }
    },
    methods: {
        fetchProducts(){
            fetch("./api/produtos.json")
            .then(response => response.json())
            .then(response => {
                this.products = response;
            })
        },
        fetchProduct(id){
            fetch(`./api/produtos/${id}/dados.json`)
            .then(response => response.json())
            .then(response => {
                this.product = response;
            } )
        },
        openModal(id){
            this.fetchProduct(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        closeModal({target, currentTarget}) {
            if (target === currentTarget) this.product = false;
        },
        clickCloseCart({target, currentTarget}) {
            if (target === currentTarget) this.cartActive = false;
        },
        addItem(){
            this.product.estoque--;
            const {id, nome, preco} = this.product
            this.cart.push({id, nome, preco})
            this.alert(`${nome} foi adicionado ao carrinho.`)
        },
        removeItem(index){
            const {nome} = this.product
            this.product.estoque++;
            this.cart.splice(index,1)
            this.alert("item removido do carrinho.")
        },
        checkLocalStorage(){
            if (window.localStorage.cart) this.cart = JSON.parse(window.localStorage.cart)
        },
        compareStock(){
            const items = this.cart.filter(({id}) => id === this.product.id);
            this.product.estoque -= items.length
        },
        alert(message){
          this.alertMsg = message;
          this.alertActive = true  
          setTimeout(() => {
              this.alertActive = false;
          }, 1500)
        },
        router() {
            const hash = document.location.hash;
            if(hash)
                this.fetchProduct(hash.replace("#", ""))
        }
    },
    watch: {
        product() {
            document.title = this.product.nome || "Techno";
            const hash = this.product.id || "";
            history.pushState(null, null, `#${hash}`)
            if(this.product){
                this.compareStock();
            }
        },
        cart() {
            window.localStorage.cart = JSON.stringify(this.cart)
        }
    },
    created() {
        this.fetchProducts();
        this.router();
        this.checkLocalStorage();
    },
})