const ALL_PRODUCTS_ADDRESS = 'https://management-l6c9.onrender.com/api/products';

export const getAllProducts = async () => {
    try {
        const allProducts = await fetch(ALL_PRODUCTS_ADDRESS);
        const jsonAllProducts = await allProducts.json(ALL_PRODUCTS_ADDRESS);
        return jsonAllProducts;
    } catch (error) {
        throw error;
    };
};

export const updateProduct = async (id, properties) => {
    try {
        const response = await fetch(`${ALL_PRODUCTS_ADDRESS}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(properties),
        });
        const updated = await response.json();
        if (!response.ok) throw new Error(`${updated}`);
        return updated;
    } catch (error) {
        throw error;
    }
}