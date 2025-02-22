const Carts = require("../models/carts");

// Get cart items by email
const getCartByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const query = { email: email };
        const result = await Carts.find(query).exec();
        res.status(200).json(result); // Return the result
    } catch (error) {
        console.error('Error fetching cart items:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Add an item to the cart
const addToCart = async (req, res) => {
    const { menuItemId, name, recipe, image, price, quantity, email } = req.body;
    try {
        // Check if the item already exists in the cart
        const existingCartItem = await Carts.findOne({ email, menuItemId });
        if (existingCartItem) {
            return res.status(400).json({ message: "Product already exists!" });
        }

        // Create a new cart item
        const cartItem = await Carts.create({
            menuItemId, name, recipe, image, price, quantity, email 
        });
        res.status(201).json(cartItem); // Return the created item
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ message: error.message });
    }
};
// delete a cart item
const deleteCart =  async (req, res) => {
    const cartId = req.params.id;
    try {
        const deletedCart = await Carts.findByIdAndDelete(cartId);
        if(!deletedCart){
            return res.status(401).json({message: "Cart Items not found!"})
        }
        res.status(200).json({message: "Cart Item Deleted Successfully!"})
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
// updata a cart item
const updateCart = async (req, res) => {
    const cartId = req.params.id;
    const {menuItemId, name, recipe, image, price, quantity,email } = req.body;

    try {
        const updatedCart = await Carts.findByIdAndUpdate(
            cartId, {menuItemId, name, recipe, image, price, quantity,email }, {
                new: true, runValidators: true
            }
        )
        if(!updatedCart){
            return res.status(404).json({ message: "Cart Item not found"})
        }
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
// get single recipe
const getSingleCart = async (req, res) => {
    const cartId = req.params.id;
    try {
        const cartItem = await Carts.findById(cartId)
        res.status(200).json(cartItem)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


module.exports = {
    getCartByEmail,
    addToCart,
    deleteCart,
    updateCart,
    getSingleCart
};
