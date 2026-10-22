class Carrito{
    constructor(productos, moneda){
        this.productos=productos;
        this.moneda=moneda;
        this.unidades={};
        productos.forEach(p=>this.unidades[p.SKU]=0);
    }

    actualizarUnidades(sku, unidades){
        this.unidades[sku]= Math.max(0, Number(unidades) || 0);
    }

    obtenerInformacionProducto(sku){
        const p=this.productos.find(prod => prod.SKU === sku);
        return{
            sku: sku,
            title: p.title,
            price: Number(p.price),
            quantity: this.unidades[sku],
        };
    }

    obtenerCarrito(){
        const products = this.productos
            .filter(p => this.unidades[p.SKU]>0)
            .map(p => this.obtenerInformacionProducto(p.SKU));

            const total = products.reduce ((suma, p) => suma + p.price * p.quantity, 0);

            return{
                total: total.toFixed(2),
                currency: this.moneda,
                products: products,
            };
    }
}