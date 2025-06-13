import { FC } from 'react'
import { Detalle } from '../../../../types';
import CardProducts from '../../Cards/CardProducts/CardProducts';
import styles from "./ProductList.module.css"

interface IProps {
    products: Detalle[];
}

const ProductList: FC<IProps> = ({ products })=> {
    if (!products || products.length === 0) {
        return <div>No hay productos disponibles</div>;
    }
    return (
        <div className={styles.list}>
            {products.map((product) => ( 
                <CardProducts key={product.id} products={product} />
            ))}
        </div>
    )
}

export default ProductList