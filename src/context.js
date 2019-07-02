import React,{Component} from 'react';
import {storeProducts,detailProduct} from './data';
const ProductContext = React.createContext();

class ProductProvider extends Component{
    state={
        products:[],
        cart:[],
        detailProduct:detailProduct,
        modalOpen:false,
        modalProduct:detailProduct,
        cartSubtotal:0,
        cartTax:0,
        cartTotal:0
    }
    componentDidMount(){
        this.setProducts();
    }
    increment = (id) => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find( item => item.id == id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count++;
        product.total = product.count*product.price;
        this.setState( () => {
            return {
                cart:[...tempCart]
            }
        }, () => {
            this.addToTotals();
        });
    }
    decrement = (id) => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find( item => item.id == id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count--;
        if(product.count != 0){
            product.total = product.count*product.price;
            this.setState( () => {
                return {
                    cart:[...tempCart]
                }
            }, () => {
                this.addToTotals();
            });
        }
        else{
            this.removeItem(id);
        }
    }
    removeItem = (id) => {
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id != id);
        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.total = 0;
        removedProduct.count = 0;
        this.setState( () => {
            return {
                cart:[...tempCart],
                products:[...tempProducts]
            }
        }, () => {
            this.addToTotals();
        }) ;
    }
    clearCart = () => {
        this.setState( () => {
            return {
                cart:[]
            }
        }, () => {
            this.setProducts();
            this.addToTotals();
        })
    }
    addToTotals = () => {
        let subTotal = 0;
        this.state.cart.map(item => {subTotal += item.total});
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2))
        const total = tax + subTotal;
        this.setState(() => {
            return {
                cartSubtotal:subTotal,
                cartTax: tax,
                cartTotal: total
            }
        })
    }
    getItem = (id) => {
        const product =this.state.products.find(item => item.id === id);
        return product;
    }
    handleDetail = (id) => {
        const product=this.getItem(id);
        this.setState(()=> {
            return {detailProduct : product}
        })
    }
    addToCart = (id) => {
        let tempProducts=[...this.state.products];
        const index=tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        if(!product.inCart)
            product.inCart=true;
        product.count++;
        product.total+=product.price;
        this.setState(() => {
            return {products:tempProducts,cart:[...this.state.cart,product]}
        }, () => {
            this.addToTotals();
        });
    }
    setProducts = () => {
        let tempProducts=[];
        storeProducts.forEach(item => {
            const singleItem = {...item};
            tempProducts = [...tempProducts,singleItem];
        });
        this.setState(() => {
            return {products:tempProducts}
        });
    }
    openModal = (id) => {
        const product = this.getItem(id);
        this.setState( () => {
            return {modalOpen:true, modalProduct:product}
        });
    }
    closeModal = () => {
        this.setState ( () => {
            return {modalOpen:false}
        });
    }
    render(){
        return(
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail:this.handleDetail,
                addToCart:this.addToCart,
                openModal:this.openModal,
                closeModal:this.closeModal,
                increment:this.increment,
                decrement:this.decrement,
                removeItem:this.removeItem,
                clearCart:this.clearCart
            }}>
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};