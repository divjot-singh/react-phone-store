import React, {Component} from 'react';
import Product from './Product';
import Title from './Title';
import {storeProducts} from '../data';
import {ProductConsumer} from '../context';
export default class Productlist extends Component{

    render(){
        return (
            <React.Fragment>
                <div className="py-5">
                    <div className="container">
                    <Title name="our" title="products"></Title>
                        <div className="row">
                            <ProductConsumer>
                                {
                                    (data) => {
                                        return data.products.map((product) => {
                                            return <Product key={product.id} product={product} />
                                        });
                                    }
                                }
                            </ProductConsumer>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}