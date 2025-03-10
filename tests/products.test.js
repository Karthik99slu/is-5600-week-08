const { mockDb, mockProducts, mockModel } = require('./db.mock');
const { list, get, destroy } = require('../products');

jest.mock('../db', () => mockDb);

describe('Product Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should list products', async () => {
            const products = await list();
            expect(products.length).toBe(2);
            expect(products[0].description).toBe('Product 1');
            expect(products[1].description).toBe('Product 2');
        });
    });

    describe('get', () => {
        it('should get a product by id', async () => {
            // Mock the Product.findById method to return a specific product
            mockModel.findById = jest.fn().mockResolvedValue({ description: 'Product 1' });

            // Call to get the product using the `get` method
            // Assertions
            const product = await get('exampleProductId');

            expect(mockModel.findById).toHaveBeenCalledWith('exampleProductId');
            expect(product).toBeDefined();
            expect(product.description).toBe('Product 1');
        });

        it('should return null if product not found', async () => {
            mockModel.findById = jest.fn().mockResolvedValue(null);

            const product = await get('exampleProductId2');

            expect(mockModel.findById).toHaveBeenCalledWith('exampleProductId2');
            expect(product).toBeNull();
        });
    });

    describe('destroy', () => {
        it('should delete a product by id', async () => {
            mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
            const result = await destroy('someProductId');

            expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'someProductId' });
            expect(result.deletedCount).toBe(1);
        });

        it('should return deletedCount 0 if product does not exist', async () => {
            mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });
            const result = await destroy('unknownProductId');

            expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'unknownProductId' });
            expect(result.deletedCount).toBe(0);
        });
    });

});